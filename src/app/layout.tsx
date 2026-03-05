import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MK2PDF — Markdown to PDF Editor",
  description:
    "A powerful online Markdown to PDF converter with live preview, templates, and export options. Privacy-first — everything runs in your browser.",
  keywords: ["markdown", "pdf", "editor", "converter", "online", "free"],
  openGraph: {
    title: "MK2PDF — Markdown to PDF Editor",
    description: "Convert Markdown to beautiful PDFs instantly in your browser.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
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
      </head>
      <body>{children}</body>
    </html>
  );
}
