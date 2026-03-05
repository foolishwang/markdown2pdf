'use client';

import { useEffect, useState } from 'react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">📝</div>
          <span className="logo-text">MK2PDF</span>
          <span className="logo-badge">Pro</span>
        </div>
      </div>
      <div className="header-right">
        {mounted && (
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        )}
        <a
          className="github-link"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          id="github-link"
        >
          ⭐
        </a>
      </div>
    </header>
  );
}
