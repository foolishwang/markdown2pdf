'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Toolbar from '@/components/Toolbar';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import ExportModal, { ExportSettings } from '@/components/ExportModal';
import { generatePdf } from '@/lib/generatePdf';

const DEFAULT_MARKDOWN = `# Welcome to MK2PDF ✨

A powerful, privacy-first **Markdown to PDF** editor built with Next.js.

---

## Features

- ✅ **Live Preview** — See your changes in real-time
- ✅ **Rich Formatting** — Full GitHub Flavored Markdown support
- ✅ **PDF Export** — Download high-quality PDFs instantly
- ✅ **Templates** — Start with professional templates
- ✅ **Dark/Light Mode** — Choose your preferred theme
- ✅ **Privacy First** — Everything runs in your browser

## Quick Start

Try editing this text on the left panel! The preview will update instantly.

### Code Blocks

\`\`\`typescript
interface Document {
  title: string;
  content: string;
  createdAt: Date;
}

function createPdf(doc: Document): Promise<Blob> {
  // Your PDF generation logic here
  return generatePdf(doc);
}
\`\`\`

### Tables

| Feature       | Status | Priority |
| :------------ | :----: | :------: |
| Live Preview  |   ✅   |   High   |
| PDF Export    |   ✅   |   High   |
| Templates     |   ✅   |  Medium  |
| Dark Mode     |   ✅   |  Medium  |

### Blockquotes

> "The best way to predict the future is to create it."
> — Peter Drucker

### Task Lists

- [x] Install MK2PDF
- [x] Write your document
- [ ] Export to PDF
- [ ] Share with the world

---

*Made with ❤️ using Next.js, CodeMirror, and React Markdown*
`;

export default function Home() {
  const [markdownContent, setMarkdownContent] = useState(DEFAULT_MARKDOWN);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Persist theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('mk2pdf-theme') as
      | 'dark'
      | 'light'
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('mk2pdf-theme', next);
      return next;
    });
  }, []);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  const handleInsert = useCallback(
    (text: string) => {
      const view = (window as any).currentEditorView;
      if (view) {
        const selection = view.state.selection.main;
        view.dispatch({
          changes: { from: selection.from, to: selection.to, insert: text },
          selection: { anchor: selection.from + text.length }
        });
        view.focus();
      } else {
        setMarkdownContent((prev) => prev + text);
      }
    },
    []
  );

  const handleLoadTemplate = useCallback((content: string) => {
    setMarkdownContent(content);
  }, []);

  const handleExport = useCallback(
    async (settings: ExportSettings) => {
      if (!previewRef.current) {
        showToast('Preview not ready. Please try again.', 'error');
        return;
      }
      setIsExporting(true);
      try {
        await generatePdf(previewRef.current, {
          filename: settings.filename,
          pageSize: settings.pageSize,
          margin: settings.margin,
          quality: settings.quality,
        });

        showToast('PDF downloaded successfully!', 'success');
        setShowExportModal(false);
      } catch (error) {
        console.error('PDF generation failed:', error);
        showToast('Failed to generate PDF. Please try again.', 'error');
      } finally {
        setIsExporting(false);
      }
    },
    [showToast]
  );

  // Word and character counts
  const stats = useMemo(() => {
    const chars = markdownContent.length;
    const words = markdownContent
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    const lines = markdownContent.split('\n').length;
    return { chars, words, lines };
  }, [markdownContent]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        setShowExportModal(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        handleInsert('**bold**');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        handleInsert('*italic*');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInsert]);

  return (
    <div className="app-container">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <Toolbar
        onInsert={handleInsert}
        onLoadTemplate={handleLoadTemplate}
        onExport={() => setShowExportModal(true)}
        isExporting={isExporting}
      />

      <div className="editor-area">
        <div className="editor-panel">
          <div className="panel-header">
            <span>✏️ Editor</span>
            <div className="panel-header-right">
              <span className="word-count">
                {stats.words} words · {stats.chars} chars · {stats.lines} lines
              </span>
            </div>
          </div>
          <div className="editor-wrapper">
            <Editor
              value={markdownContent}
              onChange={setMarkdownContent}
              theme={theme}
            />
          </div>
        </div>

        <div className="preview-panel">
          <div className="panel-header">
            <span>👁️ Preview</span>
          </div>
          <div className="preview-wrapper">
            <Preview ref={previewRef} markdown={markdownContent} />
          </div>
        </div>
      </div>

      <div className="status-bar">
        <div className="status-bar-left">
          <div className="status-indicator">
            <span className="status-dot" />
            <span>Ready</span>
          </div>
        </div>
        <div className="status-bar-right">
          <span>Markdown</span>
          <span>UTF-8</span>
          <span>Ctrl+S to export</span>
        </div>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}
    </div>
  );
}
