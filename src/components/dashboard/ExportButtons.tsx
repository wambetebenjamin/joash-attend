'use client';

import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { exportCsv, exportElementPdf } from '@/lib/export';
import { todayISO } from '@/lib/date';

interface Props {
  targetId: string;
  filenameBase: string;
  title: string;
  subtitle: string;
  csvHeaders: string[];
  csvRows: (string | number | null | undefined)[][];
}

export default function ExportButtons({
  targetId,
  filenameBase,
  title,
  subtitle,
  csvHeaders,
  csvRows,
}: Props) {
  const [busy, setBusy] = useState(false);

  const downloadPdf = async () => {
    setBusy(true);
    try {
      const element = document.getElementById(targetId);
      await exportElementPdf(element, `${filenameBase}-${todayISO()}.pdf`, title, subtitle);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="row gap-8 wrap">
      <button type="button" className="btn btn-ghost btn-sm" onClick={downloadPdf} disabled={busy}>
        <FileText size={14} aria-hidden="true" />
        {busy ? 'Preparing PDF' : 'Download PDF'}
      </button>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => exportCsv(`${filenameBase}-${todayISO()}.csv`, csvHeaders, csvRows)}
      >
        <Download size={14} aria-hidden="true" />
        Export CSV
      </button>
    </div>
  );
}
