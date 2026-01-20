import CodeMirror from '@uiw/react-codemirror';
import { EditorView, WidgetType } from '@codemirror/view';
import { LanguageSupport, StreamLanguage } from '@codemirror/language';
import { python } from '@codemirror/lang-python';

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
  return (
    <div className={className}>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[language === 'python' ? python() : optimizationLang]}
        placeholder={placeholder}
        readOnly={readOnly}
        autoFocus={!readOnly}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: !readOnly,
          highlightActiveLine: !readOnly,
          foldGutter: false,
        }}
        maxHeight={maxHeight}
        height={height}
        width={'1000px'}
        style={{
          //   fontSize: '14px',
          border: '2px solid hsl(var(--heroui-default-200))',
          //   borderRadius: '12px',
          //   overflow: 'hidden',
        }}
        className="overflow-hidden rounded-small w-full"
      />
    </div>
  );
}
