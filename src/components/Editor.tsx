'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
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
});

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: 'dark' | 'light';
}

export default function Editor({ value, onChange, theme }: EditorProps) {
  const extensions = useMemo(() => {
    // We need to dynamically import these to avoid SSR issues
    const mods: Promise<typeof import('@codemirror/lang-markdown')> = import(
      '@codemirror/lang-markdown'
    );
    return mods;
  }, []);

  return (
    <EditorInner value={value} onChange={onChange} theme={theme} />
  );
}

function EditorInner({
  value,
  onChange,
  theme,
}: EditorProps) {
  // Use a separate component that will only render on client
  return (
    <ClientEditor value={value} onChange={onChange} theme={theme} />
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
