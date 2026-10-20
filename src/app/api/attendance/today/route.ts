import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/guard';
import { getAttendanceForDate } from '@/lib/mock';
import { todayISO } from '@/lib/date';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  const url = new URL(request.url);
  const date = url.searchParams.get('date') ?? todayISO();
  const department = url.searchParams.get('department') ?? undefined;
  const records = getAttendanceForDate(date, department);

  return NextResponse.json({
    date,
    count: records.length,
    records,
    simulated: true,
  });
}
