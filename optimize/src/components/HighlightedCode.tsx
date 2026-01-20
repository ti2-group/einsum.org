import type { LanguageFn } from 'highlight.js';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import optLang from './optimization-lang';
import classes from './HighlightedCode.module.css';
hljs.registerLanguage('python', python);
hljs.registerLanguage('einsum', optLang);

//   case_insensitive: true, // language is case-insensitive
//   // keywords: {
//   //   $pattern: /#[a-z]*/, // allow keywords to begin with dash
//   //   keyword: '#',
//   // },
//   contains: [
//     {
//       scope: 'einsumExpression',
//       begin: /#\(/,
//       end: /\)/,
//       contains: [
//         {
//           scope: 'string',
//           begin: "'",
//           end: "'",
//         },
//         {
//           scope: 'built_in',
//           begin: /(log|exp|det)\(/,
//           end: /\)/,
//           contains: [
//             {
//               scope: 'variable',
//               match: /[\w\d/]/,
//             },
//           ],
//         },
//         { scope: 'variable', match: /[A-Z]/ },
//       ],
//     },
//     {
//       scope: 'built_in',
//       begin: /(parameters|variables|min|max|log|exp|det)\(/,
//       end: /\)/,
//       contains: [
//         {
//           scope: 'variable',
//           match: /[A-Z]/,
//         },
//         'self',
//       ],
//     },
//     { scope: 'variable', match: /[A-Z]/ },
//     { scope: 'comment', begin: /\\/, end: /$/ },
//   ],
// });

// hljs.registerLanguage('einsum', inputLang);

export function highlightExpression(expression: string, language: string = 'einsum') {
  return hljs.highlight(expression, { language }).value;
}

export function HighlightedCode({
  expression,
  style,
  language = 'einsum',
}: {
  expression: string;
  style?: any;
  language?: string;
}) {
  return (
    <div className="relative overflow-x-auto max-h-[350px] overflow-y-auto">
      <pre
        className={classes.tenvexityCodeHighlight}
        style={style}
        dangerouslySetInnerHTML={{
          __html: highlightExpression(expression, language),
        }}
      />
    </div>
  );
}
