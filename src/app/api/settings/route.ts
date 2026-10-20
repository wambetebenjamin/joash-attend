import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/guard';
import { getSettings, saveSettings } from '@/lib/repository';

export const dynamic = 'force-dynamic';

const settingsSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  logoUrl: z.string().max(500).nullable().optional(),
  workStart: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  workEnd: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  graceMinutes: z.number().min(0).max(120).optional(),
  leaveTypes: z.array(z.string().min(2).max(40)).max(12).optional(),
  notifyLate: z.boolean().optional(),
  notifyAbsent: z.boolean().optional(),
  notifyLeave: z.boolean().optional(),
  payrollFormat: z.enum(['csv', 'xlsx', 'sage', 'quickbooks']).optional(),
});

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  const json = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid settings.', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const settings = await saveSettings(parsed.data);
  return NextResponse.json({ settings });
}
