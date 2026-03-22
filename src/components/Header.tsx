'use client';

import { locales, localeNames, localeFlags } from '@/i18n/config';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  locale: string;
  t: {
    logoBadge: string;
    themeToggle: string;
  };
}

export default function Header({ theme, onToggleTheme, locale, t }: HeaderProps) {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    window.location.href = `/${newLocale}`;
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo" title="MK2PDF — Markdown to PDF Editor">
          <div className="logo-icon">📝</div>
          <h1 className="logo-text">MK2PDF</h1>
          <span className="logo-badge">{t.logoBadge}</span>
        </div>
      </div>
      <div className="header-right">
        <div className="language-switcher">
          <select 
            value={locale} 
            onChange={handleLanguageChange}
            className="language-select popup-select"
            aria-label="Select Language"
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {localeFlags[l]} {localeNames[l]}
              </option>
            ))}
          </select>
        </div>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={t.themeToggle}
          title={t.themeToggle}
          id="theme-toggle-btn"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
