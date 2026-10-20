'use client';

export const toCsv = (headers: string[], rows: (string | number | null | undefined)[][]): string => {
  const escape = (value: string | number | null | undefined) => {
    const text = value === null || value === undefined ? '' : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.join(','), ...rows.map((row) => row.map(escape).join(','))].join('\n');
};

export const downloadBlob = (content: string, filename: string, type = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportCsv = (
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
) => {
  downloadBlob(toCsv(headers, rows), filename);
};

export const exportElementPdf = async (
  element: HTMLElement | null,
  filename: string,
  title: string,
  subtitle?: string,
) => {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(16);
  doc.setTextColor('#141522');
  doc.text(title, 40, 48);
  doc.setFontSize(9);
  doc.setTextColor('#54577a');
  if (subtitle) doc.text(subtitle, 40, 64);
  doc.text(`Generated ${new Date().toLocaleString('en-KE')} by Joash Attend`, 40, subtitle ? 78 : 64);

  if (element) {
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const image = canvas.toDataURL('image/jpeg', 0.92);
      const printableWidth = pageWidth - 80;
      const printableHeight = (canvas.height * printableWidth) / canvas.width;
      doc.addImage(image, 'JPEG', 40, 96, printableWidth, printableHeight);
    } catch {
      doc.setFontSize(10);
      doc.setTextColor('#b33642');
      doc.text('The visual capture could not be completed. A text summary follows.', 40, 100);
    }
  }

  doc.save(filename);
};
