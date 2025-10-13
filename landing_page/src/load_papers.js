#!/usr/bin/env node
// Fetch papers for a list of Semantic Scholar author IDs and update
// landing_page/src/data/content.ts by replacing the `papers` export.
//
// Usage:
//   node load_papers.mjs                # uses `AUTHOR_IDS` below
//   node load_papers.mjs id1,id2        # comma-separated author ids
//
// If you have an API key, set SEMANTIC_SCHOLAR_API_KEY in the environment
// to increase rate limits: export SEMANTIC_SCHOLAR_API_KEY=your_key

import fs from 'fs/promises';
import path from 'path';

const CONTENT_FILE = path.resolve(
  new URL('./data/content.ts', import.meta.url).pathname.replace('%20', ' '),
);

// --- Configure author ids here as a default. You can also pass them as
// a comma-separated list on the command line: `node load_papers.mjs id1,id2`.
const AUTHOR_IDS_DEFAULT = [
  // Example: '144876145' // put real author ids here
  2008179240, 2173808336, 2123354471,
];

const API_BASE = 'https://api.semanticscholar.org/graph/v1';

async function fetchAuthorPapers(authorId) {
  // Request the author and their papers. We'll ask for a set of useful fields.
  const fields = [
    'papers.title',
    'papers.authors',
    'papers.year',
    'papers.url',
    'papers.abstract',
    'papers.venue',
    'papers.externalIds',
    'papers.paperId',
  ].join(',');

  const url = `${API_BASE}/author/${encodeURIComponent(authorId)}?fields=${encodeURIComponent(fields)}`;

  const headers = { Accept: 'application/json' };

  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(
      `Failed to fetch author ${authorId}: ${resp.status} ${resp.statusText} ${text}`,
    );
  }

  const data = await resp.json();

  // `data.papers` may be an array or an object depending on API version.
  let papers = [];
  if (Array.isArray(data.papers)) {
    papers = data.papers;
  } else if (data.papers && Array.isArray(data.papers.data)) {
    papers = data.papers.data;
  }

  return papers.map(p => ({ ...p }));
}

function simplifyPaper(p) {
  // Map Semantic Scholar paper object to the shape used in content.ts
  const authors = Array.isArray(p.authors)
    ? p.authors
        .map(a => (a.name ? a.name : a.authorId ? `author:${a.authorId}` : ''))
        .filter(Boolean)
    : [];

  const conference = p.venue || (p.journal ? p.journal : '');
  // Prefer DOI or arXiv direct links when available, otherwise use provided url
  let url = '';
  const ext = p.externalIds || {};
  if (ext.DOI) {
    // normalize DOI and use doi.org
    const doi = String(ext.DOI).trim();
    url = `https://doi.org/${doi}`;
  } else if (ext.ArXiv || ext.arXiv || ext.ARXIV) {
    const arx = ext.ArXiv || ext.arXiv || ext.ARXIV;
    url = `https://arxiv.org/abs/${String(arx).trim()}`;
  } else if (p.url) {
    url = p.url;
  } else if (p.paperId) {
    url = `https://www.semanticscholar.org/paper/${p.paperId}`;
  } else {
    url = '';
  }
  const abstract = p.abstract ? p.abstract.trim() : '';

  return {
    title: p.title || '',
    authors,
    conference,
    year: p.year || null,
    url,
    abstract,
    paperId: p.paperId || (p.externalIds && (p.externalIds.DOI || p.externalIds.PMID)) || undefined,
  };
}

function matchesKeywords(paper) {
  const text = ((paper.title || '') + ' ' + (paper.abstract || '')).toLowerCase();
  const re = /(tensor hypernetwork|tensor network|einsum)/i;
  return re.test(text);
}

function dedupePapers(papers) {
  const seen = new Map();
  for (const p of papers) {
    // prefer DOI/paperId/title as a key
    const key = (
      p.paperId ||
      (p.url || '').replace(/https?:\/\//, '') ||
      p.title ||
      ''
    ).toLowerCase();
    if (!seen.has(key)) seen.set(key, p);
    else {
      // merge abstracts/authors if missing
      const prev = seen.get(key);
      if ((!prev.abstract || prev.abstract.length < (p.abstract || '').length) && p.abstract)
        prev.abstract = p.abstract;
      if ((!prev.url || prev.url === '') && p.url) prev.url = p.url;
      if ((!prev.year || prev.year === null) && p.year) prev.year = p.year;
      prev.authors = Array.from(new Set([...(prev.authors || []), ...(p.authors || [])]));
    }
  }
  return Array.from(seen.values());
}

function buildPapersTsArray(papers) {
  // Build a pretty-printed TypeScript array for insertion into content.ts
  return papers
    .map((p, i) => {
      const id = i + 1;
      const authorsStr = JSON.stringify(p.authors, null, 2);
      // escape backticks in bib and abstract so we can wrap them in template literals
      const rawBib = buildBibtexString(p, id).replace(/`/g, '\\`');
      const rawAbstract = (p.abstract || '').replace(/`/g, '\\`');
      const conference = p.conference || '';
      const url = p.url || '';

      return (
        `  {
    id: ${id},
    title: ${JSON.stringify(p.title)},
    authors: ${authorsStr},
    conference: ${JSON.stringify(conference)},
    year: ${p.year === null ? 'null' : p.year},
    url: ${JSON.stringify(url)},
    bibtex: ` +
        '`' +
        `${rawBib}` +
        '`' +
        `,
    abstract: ` +
        '`' +
        `${rawAbstract}` +
        '`' +
        `
  }`
      );
    })
    .join(',\n');
}

function sanitizeBibField(s) {
  if (!s) return '';
  return String(s).replace(/[{}]/g, match => (match === '{' ? '\\{' : '\\}'));
}

function makeBibKey(p, idx) {
  // try first author last name + year + short word
  let author = (p.authors && p.authors[0]) || 'unknown';
  const last = author
    .split(' ')
    .slice(-1)[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const year = p.year || 'n.d.';
  const word = (p.title || '').split(/\s+/).find(w => /[a-zA-Z]/.test(w)) || 'paper';
  const short = String(word)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 8);
  return `${last}${year}${short}${idx}`;
}

function buildBibtexString(p, idx) {
  const key = makeBibKey(p, idx);
  const authors = (p.authors || []).join(' and ');
  const title = sanitizeBibField(p.title || '');
  const year = p.year || '';
  const url = p.url || '';

  let entryType = 'misc';
  let booktitleOrJournal = '';
  if (p.conference && p.conference.length > 0) {
    entryType = 'inproceedings';
    booktitleOrJournal = p.conference;
  }

  // Try to extract DOI from p.paperId or externalIds stored previously
  const doiMatch = (p.paperId && String(p.paperId)) || '';
  const doi = doiMatch && doiMatch.startsWith('10.') ? doiMatch : '';

  const lines = [];
  lines.push(`@${entryType}{${key},`);
  if (authors) lines.push(`  author = {${sanitizeBibField(authors)}},`);
  if (title) lines.push(`  title = {${sanitizeBibField(title)}},`);
  if (year) lines.push(`  year = {${sanitizeBibField(year)}},`);
  if (booktitleOrJournal) lines.push(`  booktitle = {${sanitizeBibField(booktitleOrJournal)}},`);
  if (doi) lines.push(`  doi = {${sanitizeBibField(doi)}},`);
  if (url) lines.push(`  url = {${sanitizeBibField(url)}},`);
  lines.push('}');

  return lines.join('\n');
}

async function replacePapersInContentFile(newPapersArrayString) {
  let content = await fs.readFile(CONTENT_FILE, 'utf8');

  const startMarker = 'export const papers = [';
  const start = content.indexOf(startMarker);
  if (start === -1) throw new Error(`Could not find "export const papers = [" in ${CONTENT_FILE}`);

  // find matching closing bracket for the array by scanning characters
  let idx = start + startMarker.length - 1;
  let depth = 0;
  let found = -1;
  for (let i = idx; i < content.length; i++) {
    const ch = content[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      if (depth === 0) {
        found = i;
        break;
      }
      depth--;
      if (depth < 0) {
        found = i;
        break;
      }
    }
  }

  // fallback: naive find of closing '];' after start
  if (found === -1) {
    const closeIdx = content.indexOf('];', start);
    if (closeIdx === -1) throw new Error('Could not locate end of papers array');
    found = closeIdx; // points to ] in '];'
  }

  const before = content.slice(0, start + startMarker.length);
  const after = content.slice(found);

  const newContent = before + '\n' + newPapersArrayString + '\n' + after;
  await fs.writeFile(CONTENT_FILE, newContent, 'utf8');
}

async function main() {
  const arg = process.argv[2];
  const authorIds = arg
    ? arg
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    : AUTHOR_IDS_DEFAULT;
  if (!authorIds || authorIds.length === 0) {
    console.error(
      'No author ids provided. Provide them as command-line argument or set AUTHOR_IDS_DEFAULT in the script.',
    );
    process.exit(1);
  }

  console.log(`Fetching papers for ${authorIds.length} author(s)...`);

  let allPapers = [];
  for (const id of authorIds) {
    try {
      // rate-limit friendly: small delay between requests
      await new Promise(r => setTimeout(r, 200));
      const papers = await fetchAuthorPapers(id);
      console.log(` - author ${id}: fetched ${papers.length} papers`);
      allPapers.push(...papers.map(simplifyPaper).filter(matchesKeywords));
    } catch (err) {
      console.error(`Error fetching author ${id}: ${err.message}`);
    }
  }

  console.log(
    `Filtered to ${allPapers.length} papers matching keywords (tensor network | tensor hypernetwork | einsum)`,
  );

  // dedupe and sort by year desc
  let unique = dedupePapers(allPapers);
  unique.sort((a, b) => (b.year || 0) - (a.year || 0));

  const newPapersTs = buildPapersTsArray(unique);

  // read/replace content.ts — pass only the inner array items (no extra brackets)
  await replacePapersInContentFile('\n' + newPapersTs + '\n');

  console.log(`Wrote ${unique.length} papers into ${CONTENT_FILE}`);
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1].endsWith('load_papers.mjs')
) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
