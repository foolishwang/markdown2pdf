'use client';

import { useState, useRef, useCallback, useEffect, useMemo, use } from 'react';
import type { EditorView } from '@codemirror/view';
import Header from '@/components/Header';
import Toolbar from '@/components/Toolbar';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import ExportModal from '@/components/ExportModal';
import {
  convertFileToMarkdown,
  exportDocument,
  type ExportSettings,
} from '@/lib/converters';
import { useTranslation } from '@/i18n/useTranslation';

export default function Home(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const locale = params.locale;
  const { t } = useTranslation(locale);
  
  const [markdownContent, setMarkdownContent] = useState(t.welcome);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [sourceFormat, setSourceFormat] = useState('Markdown');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);
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
      const view = editorViewRef.current;
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
        showToast(t.toast.previewNotReady, 'error');
        return;
      }
      setIsExporting(true);
      try {
        await exportDocument(previewRef.current, markdownContent, settings);

        showToast(t.toast.exportSuccess.replace('{format}', settings.format.toUpperCase()), 'success');
        setShowExportModal(false);
      } catch (error) {
        console.error('Document export failed:', error);
        showToast(t.toast.exportError, 'error');
      } finally {
        setIsExporting(false);
      }
    },
    [markdownContent, showToast, t.toast]
  );

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleLoadFile = useCallback(
    async (file: File) => {
      try {
        const result = await convertFileToMarkdown(file);
        setMarkdownContent(result.markdown);
        setSourceFormat(result.sourceFormatLabel);
        showToast(
          t.toast.fileLoaded.replace('{format}', result.sourceFormatLabel),
          'success'
        );
      } catch (error) {
        console.error('File conversion failed:', error);
        showToast(t.toast.fileError, 'error');
      }
    },
    [showToast, t.toast]
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleLoadFile(file);
    }
  }, [handleLoadFile]);

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
    <div 
      className={`app-container ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-message">{t.dragdrop.message}</div>
        </div>
      )}
      <Header theme={theme} onToggleTheme={toggleTheme} locale={locale} t={t.header} />

      <Toolbar
        onInsert={handleInsert}
        onLoadTemplate={handleLoadTemplate}
        onLoadFile={handleLoadFile}
        onExport={() => setShowExportModal(true)}
        isExporting={isExporting}
        t={t.toolbar}
      />

      <div className="editor-area">
        <div className="editor-panel">
          <div className="panel-header">
            <span>{t.editor.title}</span>
            <div className="panel-header-right">
              <span className="word-count">
                {stats.words} {t.editor.words} · {stats.chars} {t.editor.chars} · {stats.lines} {t.editor.lines}
              </span>
            </div>
          </div>
          <div className="editor-wrapper">
            <Editor
              value={markdownContent}
              onChange={setMarkdownContent}
              theme={theme}
              onEditorViewReady={(view) => {
                editorViewRef.current = view;
              }}
            />
          </div>
        </div>

        <div className="preview-panel">
          <div className="panel-header">
            <span>{t.preview.title}</span>
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
            <span>{t.statusBar.ready}</span>
          </div>
        </div>
        <div className="status-bar-right">
          <span>{sourceFormat}</span>
          <span>{t.statusBar.multiExport}</span>
          <span>{t.statusBar.encoding}</span>
          <span>{t.statusBar.shortcut}</span>
        </div>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        isExporting={isExporting}
        t={t.modal}
      />

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}
    </div>
  );
}
