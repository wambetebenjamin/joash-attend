import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyRecaptcha } from '@/lib/recaptcha';

export const dynamic = 'force-dynamic';

const schema = z.object({
  token: z.string().optional(),
  action: z.string().max(60).optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid verification payload.' }, { status: 422 });
  }
  const result = await verifyRecaptcha(parsed.data.token, parsed.data.action);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
