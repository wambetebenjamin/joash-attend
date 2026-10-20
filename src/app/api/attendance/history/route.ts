import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/guard';
import { getAttendanceRange, getStaffAttendanceHistory } from '@/lib/mock';
import { addDays, todayISO } from '@/lib/date';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const guard = await requireRole(['admin', 'member']);
  if (guard.response || !guard.user) return guard.response;

  const url = new URL(request.url);
  const staffId = url.searchParams.get('staffId');
  const from = url.searchParams.get('from') ?? todayISO();
  const to = url.searchParams.get('to') ?? todayISO();
  const department = url.searchParams.get('department') ?? undefined;

  if (guard.user.role === 'member') {
    const ownStaffId = guard.user.staffId ?? 'staff-001';
    return NextResponse.json({
      from,
      to,
      records: getStaffAttendanceHistory(ownStaffId, from, to),
      scope: 'self',
    });
  }

  if (staffId) {
    return NextResponse.json({
      from,
      to,
      records: getStaffAttendanceHistory(staffId, from, to),
      scope: 'staff',
    });
  }

  return NextResponse.json({
    from,
    to,
    records: getAttendanceRange(from, to || todayISO(), department),
    scope: 'organisation',
    windowEnd: addDays(to, 0).toISOString().slice(0, 10),
  });
}
