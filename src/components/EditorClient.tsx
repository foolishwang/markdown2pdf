'use client';

import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView, type ViewUpdate } from '@codemirror/view';

interface EditorClientProps {
  value: string;
  onChange: (value: string) => void;
  theme: 'dark' | 'light';
  onEditorViewReady?: (view: EditorView) => void;
}

const darkTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      height: '100%',
    },
    '.cm-scroller': {
      overflow: 'auto',
    },
    '.cm-content': {
      caretColor: 'var(--accent-primary)',
      fontFamily: 'var(--font-mono)',
    },
    '.cm-cursor': {
      borderLeftColor: 'var(--accent-primary)',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
      backgroundColor: 'rgba(124, 92, 252, 0.2)',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(124, 92, 252, 0.04)',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-muted)',
      borderRight: '1px solid var(--border-color)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'var(--surface-1)',
    },
  },
  { dark: true }
);

const lightTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      height: '100%',
    },
    '.cm-scroller': {
      overflow: 'auto',
    },
    '.cm-content': {
      caretColor: 'var(--accent-primary)',
      fontFamily: 'var(--font-mono)',
    },
    '.cm-cursor': {
      borderLeftColor: 'var(--accent-primary)',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
      backgroundColor: 'rgba(106, 76, 230, 0.15)',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(106, 76, 230, 0.05)',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-muted)',
      borderRight: '1px solid var(--border-color)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'var(--surface-1)',
    },
  },
  { dark: false }
);

export default function EditorClient({
  value,
  onChange,
  theme,
  onEditorViewReady,
}: EditorClientProps) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={theme === 'dark' ? darkTheme : lightTheme}
      extensions={[
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.view && onEditorViewReady) {
            onEditorViewReady(update.view);
          }
        }),
      ]}
      onChange={(val) => onChange(val)}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightActiveLine: true,
        foldGutter: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: false,
        indentOnInput: true,
      }}
    />
  );
}
