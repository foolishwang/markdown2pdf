'use client';

import { useState } from 'react';

export interface ExportSettings {
  filename: string;
  pageSize: 'a4' | 'letter';
  margin: number;
  quality: number;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (settings: ExportSettings) => void;
  isExporting: boolean;
}

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  isExporting,
}: ExportModalProps) {
  const [settings, setSettings] = useState<ExportSettings>({
    filename: 'document',
    pageSize: 'a4',
    margin: 10,
    quality: 0.95,
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Export to PDF</h2>
          <button className="modal-close" onClick={onClose} id="modal-close-btn">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label" htmlFor="filename-input">Filename</label>
            <input
              id="filename-input"
              type="text"
              className="form-input"
              value={settings.filename}
              onChange={(e) =>
                setSettings({ ...settings, filename: e.target.value })
              }
              placeholder="document"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="pagesize-select">Page Size</label>
              <select
                id="pagesize-select"
                className="form-select"
                value={settings.pageSize}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pageSize: e.target.value as 'a4' | 'letter',
                  })
                }
              >
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="letter">Letter (8.5 × 11 in)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="margin-input">Margin (mm)</label>
              <input
                id="margin-input"
                type="number"
                className="form-input"
                value={settings.margin}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    margin: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                max="50"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="quality-select">Image Quality</label>
            <select
              id="quality-select"
              className="form-select"
              value={settings.quality}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  quality: parseFloat(e.target.value),
                })
              }
            >
              <option value="0.8">Standard (80%)</option>
              <option value="0.95">High (95%)</option>
              <option value="1">Maximum (100%)</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} id="modal-cancel-btn">
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={() => onExport(settings)}
            disabled={isExporting}
            id="modal-export-btn"
          >
            {isExporting ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
