import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/guard';
import { saveSettings } from '@/lib/repository';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  const form = await request.formData().catch(() => null);
  const file = form?.get('logo');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Attach a PNG or SVG logo file.' }, { status: 422 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'The logo must be smaller than 2 MB.' }, { status: 413 });
  }

  let logoUrl = '';
  let stored = false;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import('@vercel/blob');
      const blob = await put(`joash-attend/logo-${Date.now()}-${file.name}`, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: true,
      });
      logoUrl = blob.url;
      stored = true;
    } catch {
      stored = false;
    }
  }

  if (!stored) {
    const buffer = Buffer.from(await file.arrayBuffer());
    logoUrl = `data:${file.type || 'image/png'};base64,${buffer.toString('base64')}`;
  }

  const settings = await saveSettings({ logoUrl });
  return NextResponse.json({ logoUrl, stored, settings });
}
