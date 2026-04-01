import { python } from '@codemirror/lang-python';
import { LanguageSupport, StreamLanguage } from '@codemirror/language';
import { useTheme } from '@heroui/use-theme';
import { vscodeLight } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';
import { useEffect, useState } from 'react';

// Simple CodeMirror language definition for optimization language
const optimizationLanguage = StreamLanguage.define({
  token(stream, state) {
    // Comments
    if (stream.match(/\/\/.*/)) {
      return 'comment';
    }

    // Keywords
    if (stream.match(/\b(parameters|variables|cse|min|max|st)\b/)) {
      return 'keyword';
    }

    // Einsum expressions
    if (stream.match(/#\(/)) {
      state.inEinsum = true;
      return 'string';
    }

    if (state.inEinsum) {
      if (stream.match(/\)/)) {
        state.inEinsum = false;
        return 'string';
      }
      if (stream.match(/;/)) {
        return 'operator';
      }
      stream.next();
      return 'string';
    }

    // Built-in functions
    if (stream.match(/\b(log|exp|sum|delta|norm|tr)\b/)) {
      return 'builtin';
    }

    // Numbers
    if (stream.match(/\b\d+(\.\d+)?\b/)) {
      return 'number';
    }

    // Operators
    if (stream.match(/==|<=|>=|<|>|[\+\-\*\/\^=]/)) {
      return 'operator';
    }

    // Variables
    if (stream.match(/[a-zA-Z][a-zA-Z0-9_]*/)) {
      return 'variableName';
    }

    stream.next();
    return null;
  },

  startState() {
    return { inEinsum: false };
  },
});

const optimizationLang = new LanguageSupport(optimizationLanguage);

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: 'python' | 'optimization';
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  height?: string;
  maxHeight?: string;
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  className,
  readOnly,
  language = 'optimization',
  height,
  maxHeight,
}: CodeEditorProps) {
  const { theme: defaultTheme } = useTheme();
  if (defaultTheme !== 'light' && defaultTheme !== 'dark') {
    return null;
  }
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Set initial theme
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    return () => observer.disconnect();
  }, []);

  const usedTheme = theme === 'dark' ? 'dark' : vscodeLight;

  return (
    <div className={className}>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[language === 'python' ? python() : optimizationLang]}
        placeholder={placeholder}
        readOnly={readOnly}
        editable={!readOnly}
        autoFocus={!readOnly}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: !readOnly,
          highlightActiveLine: !readOnly,
          foldGutter: false,
        }}
        maxHeight={maxHeight}
        height={height}
        theme={usedTheme}
        width={'1000px'}
        style={{
          fontSize: '14px',
          border: '2px solid hsl(var(--heroui-default-200))',
          //   borderRadius: '12px',
          //   overflow: 'hidden',
        }}
        className="overflow-hidden rounded-small w-full"
      />
    </div>
  );
}
