'use client';

import { useState, useRef, useEffect } from 'react';
import { templates, Template } from '@/lib/templates';

interface ToolbarProps {
  onInsert: (text: string) => void;
  onLoadTemplate: (content: string) => void;
  onExport: () => void;
  isExporting: boolean;
}

export default function Toolbar({
  onInsert,
  onLoadTemplate,
  onExport,
  isExporting,
}: ToolbarProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowTemplates(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatActions = [
    { icon: '𝐁', title: 'Bold (Ctrl+B)', insert: '**bold**' },
    { icon: '𝐼', title: 'Italic (Ctrl+I)', insert: '*italic*' },
    { icon: 'S̶', title: 'Strikethrough', insert: '~~strikethrough~~' },
    { icon: '</>', title: 'Inline Code', insert: '`code`' },
  ];

  const blockActions = [
    { icon: 'H1', title: 'Heading 1', insert: '# ' },
    { icon: 'H2', title: 'Heading 2', insert: '## ' },
    { icon: 'H3', title: 'Heading 3', insert: '### ' },
  ];

  const insertActions = [
    { icon: '•', title: 'Bullet List', insert: '- Item\n- Item\n- Item\n' },
    { icon: '1.', title: 'Numbered List', insert: '1. First\n2. Second\n3. Third\n' },
    { icon: '☑', title: 'Task List', insert: '- [ ] Task 1\n- [ ] Task 2\n- [x] Done\n' },
    { icon: '│', title: 'Blockquote', insert: '> ' },
    { icon: '─', title: 'Horizontal Rule', insert: '\n---\n' },
    { icon: '🔗', title: 'Link', insert: '[Link text](https://example.com)' },
    { icon: '🖼', title: 'Image', insert: '![Alt text](https://example.com/image.png)' },
    {
      icon: '⊞',
      title: 'Table',
      insert:
        '| Header 1 | Header 2 | Header 3 |\n| :------- | :------- | :------- |\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n',
    },
    {
      icon: '{ }',
      title: 'Code Block',
      insert: '```javascript\nconst hello = "world";\nconsole.log(hello);\n```\n',
    },
  ];

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        {formatActions.map((action, i) => (
          <button
            key={i}
            className="toolbar-btn"
            title={action.title}
            onClick={() => onInsert(action.insert)}
            id={`toolbar-format-${i}`}
          >
            {action.icon}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        {blockActions.map((action, i) => (
          <button
            key={i}
            className="toolbar-btn"
            title={action.title}
            onClick={() => onInsert(action.insert)}
            id={`toolbar-block-${i}`}
          >
            {action.icon}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-group">
        {insertActions.map((action, i) => (
          <button
            key={i}
            className="toolbar-btn"
            title={action.title}
            onClick={() => onInsert(action.insert)}
            id={`toolbar-insert-${i}`}
          >
            {action.icon}
          </button>
        ))}
      </div>

      <div className="toolbar-spacer" />

      <div className="template-selector" ref={dropdownRef}>
        <button
          className="template-btn"
          onClick={() => setShowTemplates(!showTemplates)}
          id="template-selector-btn"
        >
          📄 Templates
        </button>
        {showTemplates && (
          <div className="template-dropdown">
            {templates.map((t: Template, i: number) => (
              <button
                key={i}
                className="template-item"
                onClick={() => {
                  onLoadTemplate(t.content);
                  setShowTemplates(false);
                }}
                id={`template-item-${i}`}
              >
                <span className="template-item-icon">{t.icon}</span>
                <span className="template-item-info">
                  <span className="template-item-name">{t.name}</span>
                  <span className="template-item-desc">{t.description}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        className="export-btn"
        onClick={onExport}
        disabled={isExporting}
        id="export-pdf-btn"
      >
        {isExporting ? (
          <>
            <span className="spinner" />
            Generating...
          </>
        ) : (
          <>📥 Download PDF</>
        )}
      </button>
    </div>
  );
}
