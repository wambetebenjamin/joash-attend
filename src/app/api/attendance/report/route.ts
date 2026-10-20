import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/guard';
import { getAttendanceRange, getStaffAttendanceHistory, getStaffById } from '@/lib/mock';
import { todayISO } from '@/lib/date';

export const dynamic = 'force-dynamic';

const summarise = (records: ReturnType<typeof getAttendanceRange>) => {
  const present = records.filter((record) => record.status === 'present').length;
  const late = records.filter((record) => record.status === 'late').length;
  const absent = records.filter((record) => record.status === 'absent').length;
  const leave = records.filter((record) => record.status === 'leave').length;
  const counted = records.length - leave;
  return {
    present,
    late,
    absent,
    leave,
    total: records.length,
    rate: counted ? Math.round(((present + late) / counted) * 1000) / 10 : 0,
  };
};

export async function GET(request: Request) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  const url = new URL(request.url);
  const from = url.searchParams.get('from') ?? todayISO();
  const to = url.searchParams.get('to') ?? todayISO();
  const department = url.searchParams.get('department') ?? undefined;
  const type = url.searchParams.get('type') ?? 'daily';
  const staffId = url.searchParams.get('staffId') ?? undefined;

  const allRecords = staffId
    ? getStaffAttendanceHistory(staffId, from, to)
    : getAttendanceRange(from, to, department);

  const records =
    type === 'absenteeism'
      ? allRecords.filter((record) => record.status === 'absent' || record.status === 'leave')
      : type === 'late'
        ? allRecords.filter((record) => record.status === 'late')
        : allRecords;

  const byDepartment = ['Academics', 'Administration', 'Operations'].map((name) => {
    const rows = records.filter((record) => record.department === name);
    return { department: name, ...summarise(rows) };
  });

  const byDateMap = new Map<string, { date: string; present: number; late: number; absent: number }>();
  records.forEach((record) => {
    const entry = byDateMap.get(record.date) ?? { date: record.date, present: 0, late: 0, absent: 0 };
    if (record.status === 'present') entry.present += 1;
    if (record.status === 'late') entry.late += 1;
    if (record.status === 'absent') entry.absent += 1;
    byDateMap.set(record.date, entry);
  });

  return NextResponse.json({
    from,
    to,
    type,
    department: department ?? 'All departments',
    staff: staffId ? getStaffById(staffId)?.name ?? staffId : null,
    summary: summarise(allRecords),
    departments: byDepartment,
    daily: [...byDateMap.values()].sort((a, b) => (a.date < b.date ? -1 : 1)),
    rows: records.slice(0, 400),
    generatedAt: new Date().toISOString(),
  });
}
