import type { LanguageFn } from 'highlight.js';
import hljs from 'highlight.js/lib/core';
import { useCallback } from 'react';

import classes from './HighlightedCode.module.css';
import { addToast, Button, ButtonGroup } from '@heroui/react';
import { Icon } from '@iconify/react';

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

export function highlightExpression(expression: string) {
  return hljs.highlight(expression, { language: 'einsum' }).value;
}

export function HighlightedCode({
  expression,
  style,
  buttons,
}: {
  expression: string;
  style?: any;
  buttons?: boolean;
}) {
  const handleDownload = useCallback(() => {
    const blob = new Blob([expression], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'optimizer.py';
    link.click();
  }, [expression]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(expression).then(() => {
      addToast({ description: 'Code copied to clipboard', color: 'success' });
    });
  }, [expression]);

  return (
    <div className="relative overflow-x-auto max-h-[350px] overflow-y-auto">
      <pre
        className={classes.tenvexityCodeHighlight}
        style={style}
        dangerouslySetInnerHTML={{
          __html: highlightExpression(expression),
        }}
      />
      {buttons && (
        <ButtonGroup className="absolute top-2 right-2">
          <Button
            onPress={handleDownload}
            className="btn-download"
            startContent={<Icon icon="lucide:download" />}
            isIconOnly
            size="sm"
          ></Button>
          <Button
            onPress={handleCopy}
            className="btn-copy"
            startContent={<Icon icon="lucide:copy" />}
            isIconOnly
            size="sm"
          ></Button>
        </ButtonGroup>
      )}
    </div>
  );
}
