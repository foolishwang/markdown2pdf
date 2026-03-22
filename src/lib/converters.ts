import { generatePdf, type PdfOptions } from './generatePdf';

export type ExportFormat =
  | 'pdf'
  | 'html'
  | 'doc'
  | 'rtf'
  | 'txt'
  | 'md'
  | 'json'
  | 'csv'
  | 'xml';

export interface ExportSettings extends PdfOptions {
  format: ExportFormat;
}

export interface FileConversionResult {
  markdown: string;
  sourceFormatLabel: string;
}

const EXPORT_EXTENSIONS: Record<ExportFormat, string> = {
  pdf: 'pdf',
  html: 'html',
  doc: 'doc',
  rtf: 'rtf',
  txt: 'txt',
  md: 'md',
  json: 'json',
  csv: 'csv',
  xml: 'xml',
};

const SOURCE_LABELS: Record<string, string> = {
  md: 'Markdown',
  markdown: 'Markdown',
  mdown: 'Markdown',
  mkd: 'Markdown',
  mdx: 'MDX',
  txt: 'Text',
  text: 'Text',
  html: 'HTML',
  htm: 'HTML',
  json: 'JSON',
  csv: 'CSV',
  tsv: 'TSV',
};

export const EXPORT_FORMATS: Array<{
  value: ExportFormat;
  extension: string;
  usesPreview: boolean;
}> = [
  { value: 'pdf', extension: 'pdf', usesPreview: true },
  { value: 'html', extension: 'html', usesPreview: true },
  { value: 'doc', extension: 'doc', usesPreview: true },
  { value: 'rtf', extension: 'rtf', usesPreview: false },
  { value: 'txt', extension: 'txt', usesPreview: false },
  { value: 'md', extension: 'md', usesPreview: false },
  { value: 'json', extension: 'json', usesPreview: false },
  { value: 'csv', extension: 'csv', usesPreview: false },
  { value: 'xml', extension: 'xml', usesPreview: false },
];

export async function exportDocument(
  sourceElement: HTMLElement,
  markdown: string,
  settings: ExportSettings
): Promise<void> {
  const filename = ensureExtension(settings.filename, EXPORT_EXTENSIONS[settings.format]);

  if (settings.format === 'pdf') {
    await generatePdf(sourceElement, settings);
    return;
  }

  const htmlDocument = buildHtmlDocument(filename, sourceElement.innerHTML);
  let blob: Blob;

  switch (settings.format) {
    case 'html':
      blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
      break;
    case 'doc':
      blob = new Blob([buildWordDocument(filename, sourceElement.innerHTML)], {
        type: 'application/msword;charset=utf-8',
      });
      break;
    case 'rtf':
      blob = new Blob([markdownToRtf(markdown)], { type: 'application/rtf;charset=utf-8' });
      break;
    case 'txt':
      blob = new Blob([markdownToPlainText(markdown)], { type: 'text/plain;charset=utf-8' });
      break;
    case 'md':
      blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      break;
    case 'json':
      blob = new Blob([JSON.stringify(markdownToJson(markdown), null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      break;
    case 'csv':
      blob = new Blob([markdownTablesToCsv(markdown)], { type: 'text/csv;charset=utf-8' });
      break;
    case 'xml':
      blob = new Blob([markdownToXml(markdown)], { type: 'application/xml;charset=utf-8' });
      break;
    default:
      throw new Error(`Unsupported format: ${settings.format satisfies never}`);
  }

  downloadBlob(blob, filename);
}

export async function convertFileToMarkdown(file: File): Promise<FileConversionResult> {
  const extension = getExtension(file.name);
  const sourceFormatLabel = SOURCE_LABELS[extension] ?? 'Text';
  const raw = await file.text();

  if (['md', 'markdown', 'mdown', 'mkd', 'mdx', 'txt', 'text'].includes(extension)) {
    return { markdown: raw, sourceFormatLabel };
  }

  if (extension === 'html' || extension === 'htm') {
    return { markdown: htmlToMarkdown(raw), sourceFormatLabel };
  }

  if (extension === 'json') {
    return { markdown: jsonToMarkdown(raw), sourceFormatLabel };
  }

  if (extension === 'csv' || extension === 'tsv') {
    return {
      markdown: delimitedTextToMarkdownTable(raw, extension === 'tsv' ? '\t' : ','),
      sourceFormatLabel,
    };
  }

  if (file.type.includes('text')) {
    return { markdown: raw, sourceFormatLabel };
  }

  throw new Error('Unsupported file format');
}

export function getAcceptedFileTypes(): string {
  return '.md,.markdown,.mdown,.mkd,.mdx,.txt,.html,.htm,.json,.csv,.tsv';
}

function ensureExtension(filename: string, extension: string) {
  return filename.toLowerCase().endsWith(`.${extension}`)
    ? filename
    : `${filename}.${extension}`;
}

function getExtension(filename: string): string {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] ?? '';
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildHtmlDocument(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: light; }
      body {
        margin: 0;
        padding: 48px 24px;
        background: #f5f1e8;
        color: #1e1b16;
        font-family: Georgia, "Times New Roman", serif;
      }
      main {
        max-width: 860px;
        margin: 0 auto;
        background: #fffdf8;
        border: 1px solid #d9cfbf;
        box-shadow: 0 24px 60px rgba(70, 48, 24, 0.12);
        padding: 56px;
      }
      h1, h2, h3, h4, h5, h6 { color: #2f2417; line-height: 1.2; }
      h1 { font-size: 2.4rem; border-bottom: 2px solid #d9cfbf; padding-bottom: 0.3em; }
      h2 { font-size: 1.8rem; border-bottom: 1px solid #e7dfd1; padding-bottom: 0.2em; }
      p, li, td, th, blockquote { font-size: 1rem; line-height: 1.75; }
      a { color: #8b3d1f; }
      pre {
        overflow: auto;
        padding: 18px 20px;
        border-radius: 12px;
        background: #f4eee4;
        border: 1px solid #ddd0bc;
      }
      code {
        font-family: "JetBrains Mono", "SFMono-Regular", monospace;
        background: #f4eee4;
        padding: 0.15em 0.35em;
        border-radius: 6px;
      }
      pre code { background: transparent; padding: 0; }
      table { width: 100%; border-collapse: collapse; margin: 1.2rem 0; }
      th, td { border: 1px solid #d9cfbf; padding: 10px 12px; text-align: left; }
      th { background: #f1e8da; }
      blockquote {
        margin: 1.2rem 0;
        padding: 0.2rem 0 0.2rem 1rem;
        border-left: 4px solid #b66a35;
        color: #5a4630;
      }
      img { max-width: 100%; height: auto; border-radius: 12px; }
      hr { border: none; border-top: 1px solid #d9cfbf; margin: 2rem 0; }
      @media print {
        body { background: #fff; padding: 0; }
        main { box-shadow: none; border: none; padding: 0; }
      }
    </style>
  </head>
  <body>
    <main>
      ${body}
    </main>
  </body>
</html>`;
}

function buildWordDocument(title: string, body: string) {
  return `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { font-family: Calibri, Arial, sans-serif; margin: 24pt; color: #222; }
      h1, h2, h3, h4, h5, h6 { color: #1f2937; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #cfd3d8; padding: 6pt 8pt; }
      th { background: #eff3f8; }
      blockquote { border-left: 3pt solid #94a3b8; padding-left: 10pt; color: #475569; }
      pre { background: #f8fafc; padding: 10pt; border: 1px solid #e2e8f0; }
      code { font-family: Consolas, "Courier New", monospace; }
    </style>
  </head>
  <body>${body}</body>
</html>`;
}

function markdownToPlainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```[a-zA-Z0-9_-]*\n?|\n?```/g, ''))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function markdownToJson(markdown: string) {
  const headings = Array.from(markdown.matchAll(/^(#{1,6})\s+(.+)$/gm)).map((match) => ({
    level: match[1].length,
    text: match[2].trim(),
    slug: slugify(match[2]),
  }));
  const links = Array.from(markdown.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)).map((match) => ({
    text: match[1],
    href: match[2],
  }));
  const lines = markdown.split('\n');
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;

  return {
    type: 'markdown-document',
    exportedAt: new Date().toISOString(),
    stats: {
      characters: markdown.length,
      words,
      lines: lines.length,
    },
    headings,
    links,
    content: markdown,
    plainText: markdownToPlainText(markdown),
  };
}

function markdownTablesToCsv(markdown: string) {
  const tables = extractMarkdownTables(markdown);
  if (tables.length === 0) {
    return 'No markdown tables found';
  }

  return tables
    .map((table) =>
      table
        .map((row) => row.map((cell) => escapeCsv(cell)).join(','))
        .join('\n')
    )
    .join('\n\n');
}

function markdownToXml(markdown: string) {
  const headings = Array.from(markdown.matchAll(/^(#{1,6})\s+(.+)$/gm)).map((match) => ({
    level: String(match[1].length),
    text: match[2].trim(),
  }));

  const paragraphs = markdownToPlainText(markdown)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  return `<?xml version="1.0" encoding="UTF-8"?>
<document exportedAt="${escapeXml(new Date().toISOString())}">
  <metadata>
    <characters>${markdown.length}</characters>
    <words>${markdown.trim().split(/\s+/).filter(Boolean).length}</words>
    <lines>${markdown.split('\n').length}</lines>
  </metadata>
  <headings>
${headings.map((heading) => `    <heading level="${heading.level}">${escapeXml(heading.text)}</heading>`).join('\n')}
  </headings>
  <paragraphs>
${paragraphs.map((paragraph) => `    <paragraph>${escapeXml(paragraph)}</paragraph>`).join('\n')}
  </paragraphs>
  <sourceMarkdown><![CDATA[${markdown.replaceAll(']]>', ']]]]><![CDATA[>')}]]></sourceMarkdown>
</document>`;
}

function markdownToRtf(markdown: string) {
  const text = markdownToPlainText(markdown);
  return `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0 Calibri;}{\\f1 Courier New;}}\n\\viewkind4\\uc1\\pard\\sa180\\sl276\\slmult1\\f0 ${escapeRtf(
    text
  ).replace(/\n\n/g, '\\par\\par ').replace(/\n/g, '\\line ')}\\par\n}`;
}

function htmlToMarkdown(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const content = Array.from(doc.body.childNodes)
    .map((node) => nodeToMarkdown(node))
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return content || doc.body.textContent?.trim() || '';
}

function nodeToMarkdown(node: ChildNode, depth = 0): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent?.replace(/\s+/g, ' ') ?? '';
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  const children = Array.from(element.childNodes)
    .map((child) => nodeToMarkdown(child, depth))
    .join('')
    .replace(/[ \t]+\n/g, '\n');

  if (tag === 'br') return '\n';
  if (tag === 'hr') return '\n---\n\n';
  if (tag === 'strong' || tag === 'b') return `**${children.trim()}**`;
  if (tag === 'em' || tag === 'i') return `*${children.trim()}*`;
  if (tag === 'code' && element.parentElement?.tagName.toLowerCase() !== 'pre') {
    return `\`${children.trim()}\``;
  }
  if (tag === 'pre') {
    const code = element.textContent?.replace(/\n$/, '') ?? '';
    return `\n\`\`\`\n${code}\n\`\`\`\n\n`;
  }
  if (tag === 'a') {
    const href = element.getAttribute('href') || '#';
    return `[${children.trim() || href}](${href})`;
  }
  if (tag === 'img') {
    const alt = element.getAttribute('alt') || 'image';
    const src = element.getAttribute('src') || '';
    return `![${alt}](${src})`;
  }
  if (/^h[1-6]$/.test(tag)) {
    const level = Number(tag[1]);
    return `${'#'.repeat(level)} ${children.trim()}\n\n`;
  }
  if (tag === 'blockquote') {
    return `${children
      .split('\n')
      .filter(Boolean)
      .map((line) => `> ${line.trim()}`)
      .join('\n')}\n\n`;
  }
  if (tag === 'ul') {
    return `${Array.from(element.children)
      .map((li) => `${'  '.repeat(depth)}- ${nodeToMarkdown(li, depth + 1).trim()}`)
      .join('\n')}\n\n`;
  }
  if (tag === 'ol') {
    return `${Array.from(element.children)
      .map((li, index) => `${'  '.repeat(depth)}${index + 1}. ${nodeToMarkdown(li, depth + 1).trim()}`)
      .join('\n')}\n\n`;
  }
  if (tag === 'li') {
    return children.trim().replace(/\n{2,}/g, '\n');
  }
  if (tag === 'table') {
    return `${tableElementToMarkdown(element)}\n\n`;
  }
  if (['p', 'div', 'section', 'article'].includes(tag)) {
    return `${children.trim()}\n\n`;
  }

  return children;
}

function jsonToMarkdown(raw: string) {
  const data = JSON.parse(raw);

  if (Array.isArray(data) && data.length > 0 && data.every(isFlatRecord)) {
    return `# Imported JSON\n\n${recordsToMarkdownTable(data.slice(0, 20))}\n\n## Full JSON\n\n\`\`\`json\n${JSON.stringify(
      data,
      null,
      2
    )}\n\`\`\``;
  }

  return `# Imported JSON\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
}

function delimitedTextToMarkdownTable(raw: string, delimiter: ',' | '\t') {
  const rows = parseDelimitedText(raw, delimiter);
  if (rows.length === 0) {
    return '';
  }

  const normalized = rows.map((row) => row.map((cell) => cell.trim()));
  const header = normalized[0];
  const separator = header.map(() => '---');
  const body = normalized.slice(1);

  return [header, separator, ...body]
    .map((row) => `| ${row.map((cell) => cell.replace(/\|/g, '\\|')).join(' | ')} |`)
    .join('\n');
}

function parseDelimitedText(raw: string, delimiter: ',' | '\t') {
  const rows: string[][] = [];
  let cell = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    const next = raw[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      row.push(cell);
      cell = '';
      continue;
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      row.push(cell);
      if (row.some((item) => item.length > 0)) {
        rows.push(row);
      }
      row = [];
      cell = '';
      continue;
    }

    cell += char;
  }

  row.push(cell);
  if (row.some((item) => item.length > 0)) {
    rows.push(row);
  }

  return rows;
}

function extractMarkdownTables(markdown: string) {
  const lines = markdown.split('\n');
  const tables: string[][][] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length >= 2) {
      const parsed = parseMarkdownTable(buffer);
      if (parsed.length > 1) {
        tables.push(parsed);
      }
    }
    buffer = [];
  };

  for (const line of lines) {
    if (line.includes('|')) {
      buffer.push(line);
    } else {
      flush();
    }
  }

  flush();
  return tables;
}

function parseMarkdownTable(lines: string[]) {
  const rows = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const trimmed = line.replace(/^\||\|$/g, '');
      return trimmed.split('|').map((cell) => cell.trim());
    });

  return rows.filter((row, index) => {
    if (index !== 1) {
      return true;
    }
    return !row.every((cell) => /^:?-{3,}:?$/.test(cell));
  });
}

function tableElementToMarkdown(table: HTMLElement) {
  const rows = Array.from(table.querySelectorAll('tr')).map((row) =>
    Array.from(row.querySelectorAll('th, td')).map((cell) =>
      (cell.textContent ?? '').trim().replace(/\|/g, '\\|')
    )
  );

  if (rows.length === 0) {
    return '';
  }

  const separator = rows[0].map(() => '---');
  return [rows[0], separator, ...rows.slice(1)]
    .map((row) => `| ${row.join(' | ')} |`)
    .join('\n');
}

function recordsToMarkdownTable(records: Array<Record<string, unknown>>) {
  const headers = Array.from(
    records.reduce((set, record) => {
      Object.keys(record).forEach((key) => set.add(key));
      return set;
    }, new Set<string>())
  );

  const separator = headers.map(() => '---');
  const rows = records.map((record) =>
    headers.map((header) => String(record[header] ?? '').replace(/\|/g, '\\|'))
  );

  return [headers, separator, ...rows]
    .map((row) => `| ${row.join(' | ')} |`)
    .join('\n');
}

function isFlatRecord(value: unknown): value is Record<string, string | number | boolean | null> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(
      (item) =>
        item === null || ['string', 'number', 'boolean'].includes(typeof item)
    )
  );
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeXml(value: string) {
  return escapeHtml(value).replaceAll("'", '&apos;');
}

function escapeRtf(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/[^\x00-\x7F]/g, (char) => `\\u${char.charCodeAt(0)}?`);
}
