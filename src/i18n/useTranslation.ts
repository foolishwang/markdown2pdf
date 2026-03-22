import { Locale, defaultLocale } from './config';
import en from './dictionaries/en.json';
import zh from './dictionaries/zh.json';
import ja from './dictionaries/ja.json';
import fr from './dictionaries/fr.json';
import de from './dictionaries/de.json';
import es from './dictionaries/es.json';

export type Dictionary = typeof en;

const dictionaries: Record<string, Dictionary> = {
  en,
  zh,
  ja,
  fr,
  de,
  es,
};

export function getDictionary(locale: Locale | string): Dictionary {
  return dictionaries[locale] || dictionaries[defaultLocale];
}

// For use in both server and client components directly since it's statically imported
export function useTranslation(locale: Locale | string) {
  return { t: getDictionary(locale) };
}
