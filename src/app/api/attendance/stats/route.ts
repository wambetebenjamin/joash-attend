import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/guard';
import { getDepartmentBreakdown, getTodaySummary } from '@/lib/mock';

export const dynamic = 'force-dynamic';

export async function GET() {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  return NextResponse.json({
    summary: getTodaySummary(),
    departments: getDepartmentBreakdown(),
    generatedAt: new Date().toISOString(),
  });
}
