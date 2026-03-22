import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, Locale } from './i18n/config';

// Map Cloudflare country codes to our supported locales
// CF-IPCountry returns 2-letter ISO 3166-1 alpha-2 country code
const countryToLocale: Record<string, Locale> = {
  // Chinese speaking regions
  CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh', SG: 'zh',
  
  // Japan
  JP: 'ja',
  
  // French speaking regions
  FR: 'fr', CA: 'fr', BE: 'fr', CH: 'fr', LU: 'fr', MC: 'fr', SN: 'fr',
  CI: 'fr', CM: 'fr', MG: 'fr', ML: 'fr', BF: 'fr', NE: 'fr',
  
  // German speaking regions
  DE: 'de', AT: 'de', LI: 'de',
  
  // Spanish speaking regions
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', PE: 'es', VE: 'es', CL: 'es',
  EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es',
  SV: 'es', NI: 'es', CR: 'es', PR: 'es', PA: 'es', UY: 'es', GQ: 'es',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only run middleware on the root path
  if (pathname !== '/') {
    return NextResponse.next();
  }

  // 1. Try Cloudflare IP Country header first
  const country = request.headers.get('cf-ipcountry');
  let targetLocale: Locale | null = null;
  
  if (country && countryToLocale[country]) {
    targetLocale = countryToLocale[country];
  }
  
  // 2. Fallback to Accept-Language header
  if (!targetLocale) {
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
      // Very basic parsing of Accept-Language: "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5"
      const acceptedLocales = acceptLanguage
        .split(',')
        .map((lang) => lang.split(';')[0].trim().substring(0, 2).toLowerCase());

      for (const lang of acceptedLocales) {
        if (locales.includes(lang as Locale)) {
          targetLocale = lang as Locale;
          break;
        }
      }
    }
  }

  // 3. Fallback to default locale
  targetLocale = targetLocale || defaultLocale;
  
  // Redirect to the determined locale
  request.nextUrl.pathname = `/${targetLocale}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/'],
};
