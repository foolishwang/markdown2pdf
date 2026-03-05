export interface PdfOptions {
  filename: string;
  pageSize: 'a4' | 'letter';
  margin: number;
  quality: number;
}

const PAGE_SIZES = {
  a4: [210, 297] as [number, number],
  letter: [215.9, 279.4] as [number, number],
};

export async function generatePdf(
  sourceElement: HTMLElement,
  options: PdfOptions
): Promise<void> {
  const html2pdf = (await import('html2pdf.js')).default;

  const [width, height] = PAGE_SIZES[options.pageSize];

  const originalBackground = sourceElement.style.background;
  sourceElement.classList.add('pdf-render-target');
  sourceElement.style.background = 'white';

  const opt = {
    margin: options.margin,
    filename: options.filename.endsWith('.pdf')
      ? options.filename
      : `${options.filename}.pdf`,
    image: { type: 'jpeg' as const, quality: options.quality },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      windowWidth: sourceElement.scrollWidth,
    },
    jsPDF: {
      unit: 'mm' as const,
      format: [width, height] as [number, number],
      orientation: 'portrait' as const,
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await html2pdf().set(opt).from(sourceElement).save();
  } finally {
    sourceElement.classList.remove('pdf-render-target');
    sourceElement.style.background = originalBackground;
  }
}
