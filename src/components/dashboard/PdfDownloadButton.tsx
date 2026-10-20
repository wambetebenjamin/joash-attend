'use client';

import { useState } from 'react';
import { FileText } from 'lucide-react';
import { exportElementPdf } from '@/lib/export';

interface Props {
  targetId: string;
  filename: string;
  title: string;
  subtitle?: string;
  label?: string;
}

export default function PdfDownloadButton({ targetId, filename, title, subtitle, label = 'Download PDF' }: Props) {
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await exportElementPdf(document.getElementById(targetId), filename, title, subtitle);
        } finally {
          setBusy(false);
        }
      }}
    >
      <FileText size={14} aria-hidden="true" />
      {busy ? 'Preparing' : label}
    </button>
  );
}
