import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/guard';
import { getLiveEvents } from '@/lib/mock';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  const url = new URL(request.url);
  const since = Number(url.searchParams.get('since') ?? 0);
  const payload = getLiveEvents(Number.isFinite(since) ? since : 0);

  return NextResponse.json({
    events: payload.events,
    cursor: payload.cursor,
    polledAt: new Date().toISOString(),
    source: 'mock biometric bridge',
  });
}
