'use client';

import dynamic from 'next/dynamic';
import type { EditorView } from '@codemirror/view';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: 'dark' | 'light';
  onEditorViewReady?: (view: EditorView) => void;
}

export default function Editor({ value, onChange, theme, onEditorViewReady }: EditorProps) {
  return <EditorInner value={value} onChange={onChange} theme={theme} onEditorViewReady={onEditorViewReady} />;
}

function EditorInner({
  value,
  onChange,
  theme,
  onEditorViewReady,
}: EditorProps) {
  return (
    <ClientEditor
      value={value}
      onChange={onChange}
      theme={theme}
      onEditorViewReady={onEditorViewReady}
    />
  );
}

const ClientEditor = dynamic(
  () => import('./EditorClient'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--text-muted)',
          fontSize: '14px',
        }}
      >
        Loading editor...
      </div>
    ),
  }
);
