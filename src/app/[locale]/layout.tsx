import type { Metadata } from 'next';
import 'highlight.js/styles/github-dark.css';
import '../globals.css';
import { locales } from '@/i18n/config';
import { getDictionary } from '@/i18n/useTranslation';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { locale } = params;
  const t = getDictionary(locale).app;

  // Define language alternates for SEO
  const languages: Record<string, string> = {
    'x-default': 'https://mk2pdf.cherry-blossoms-dating-inc.workers.dev/en',
  };
  locales.forEach((l) => {
    languages[l] = `https://mk2pdf.cherry-blossoms-dating-inc.workers.dev/${l}`;
  });

  return {
    title: t.title,
    description: t.description,
    keywords: [
      'markdown to pdf',
      'md to pdf',
      'online markdown editor',
      'markdown converter',
      'privacy-first markdown editor',
      'free markdown to pdf',
      'markdown templates',
      'next.js markdown editor',
    ],
    alternates: {
      canonical: `https://mk2pdf.cherry-blossoms-dating-inc.workers.dev/${locale === 'en' ? '' : locale}`,
      languages,
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: `https://mk2pdf.cherry-blossoms-dating-inc.workers.dev/${locale === 'en' ? '' : locale}`,
      siteName: 'MK2PDF',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'MK2PDF Interface Preview',
        },
      ],
      locale: locale === 'en' ? 'en_US' : locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    manifest: '/manifest.json',
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const params = await props.params;
  const { locale } = params;
  const t = getDictionary(locale).app;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MK2PDF',
    operatingSystem: 'Web',
    applicationCategory: 'ProductivityApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: t.description,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '100',
    },
  };

  return (
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
