import type { LanguageFn } from 'highlight.js';
import hljs from 'highlight.js/lib/core';

import classes from './HighlightedCode.module.css';
import pythonlang from 'highlight.js/lib/languages/python';

const inputLang: LanguageFn = () => ({
  case_insensitive: true, // language is case-insensitive
  // keywords: {
  //   $pattern: /#[a-z]*/, // allow keywords to begin with dash
  //   keyword: '#',
  // },
  contains: [
    {
      scope: 'einsumExpression',
      begin: /#\(/,
      end: /\)/,
      contains: [
        {
          scope: 'string',
          begin: "'",
          end: "'",
        },
        {
          scope: 'built_in',
          begin: /(log|exp|det)\(/,
          end: /\)/,
          contains: [
            {
              scope: 'variable',
              match: /\w/,
            },
          ],
        },
        { scope: 'variable', match: /[A-Z]/ },
      ],
    },
    {
      scope: 'built_in',
      begin: /(log|exp|det)\(/,
      end: /\)/,
      contains: [
        {
          scope: 'variable',
          match: /[A-Z]/,
        },
        'self',
      ],
    },
    { scope: 'variable', match: /[A-Z]/ },
  ],
});

hljs.registerLanguage('einsum', inputLang);

hljs.registerLanguage('python', pythonlang);
export function highlightExpression(expression: string, lang = 'einsum') {
  return hljs.highlight(expression, { language: lang }).value;
}

export function HighlightedCode({
  expression,
  style,
  lang,
}: {
  expression: string;
  style?: any;
  lang?: string;
}) {
  return (
    <pre
      className={classes.tenvexityCodeHighlight}
      style={style}
      dangerouslySetInnerHTML={{
        __html: highlightExpression(expression, lang),
      }}
    />
  );
}
