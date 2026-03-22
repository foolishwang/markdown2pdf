'use client';

import { useState } from 'react';
import { EXPORT_FORMATS, type ExportFormat } from '@/lib/converters';

export interface ExportSettings {
  filename: string;
  format: ExportFormat;
  pageSize: 'a4' | 'letter';
  margin: number;
  quality: number;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (settings: ExportSettings) => void;
  isExporting: boolean;
  t: {
    title: string;
    filename: string;
    format: string;
    pageSize: string;
    margin: string;
    quality: string;
    formatHint: string;
    pdfOptions: string;
    cancel: string;
    download: string;
    generating: string;
    formats: Record<ExportFormat, string>;
    sizeA4: string;
    sizeLetter: string;
    qualityStandard: string;
    qualityHigh: string;
    qualityMax: string;
  };
}

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  isExporting,
  t
}: ExportModalProps) {
  const [settings, setSettings] = useState<ExportSettings>({
    filename: 'document',
    format: 'pdf',
    pageSize: 'a4',
    margin: 10,
    quality: 0.95,
  });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t.title}</h2>
          <button className="modal-close" onClick={onClose} id="modal-close-btn">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label" htmlFor="filename-input">{t.filename}</label>
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

          <div className="form-group">
            <label className="form-label" htmlFor="format-select">{t.format}</label>
            <select
              id="format-select"
              className="form-select"
              value={settings.format}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  format: e.target.value as ExportFormat,
                })
              }
            >
              {EXPORT_FORMATS.map((format) => (
                <option key={format.value} value={format.value}>
                  {t.formats[format.value]}
                </option>
              ))}
            </select>
            <p className="form-help">
              {t.formatHint}
            </p>
          </div>

          {settings.format === 'pdf' && (
            <>
              <p className="form-section-label">{t.pdfOptions}</p>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="pagesize-select">{t.pageSize}</label>
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
                    <option value="a4">{t.sizeA4}</option>
                    <option value="letter">{t.sizeLetter}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="margin-input">{t.margin}</label>
                  <input
                    id="margin-input"
                    type="number"
                    className="form-input"
                    value={settings.margin}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        margin: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="quality-select">{t.quality}</label>
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
                  <option value="0.8">{t.qualityStandard}</option>
                  <option value="0.95">{t.qualityHigh}</option>
                  <option value="1">{t.qualityMax}</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} id="modal-cancel-btn">
            {t.cancel}
          </button>
          <button
            className="btn-primary"
            onClick={() => onExport(settings)}
            disabled={isExporting}
            id="modal-export-btn"
          >
            {isExporting ? t.generating : t.download}
          </button>
        </div>
      </div>
    </div>
  );
}
