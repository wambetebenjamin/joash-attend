import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/guard';
import { getStaffById } from '@/lib/mock';
import { sendMail } from '@/lib/mail';

export const dynamic = 'force-dynamic';

const schema = z.object({
  staffId: z.string().min(2),
  consecutiveDays: z.number().min(1).max(60).optional(),
});

export async function POST(request: Request) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid reminder request.' }, { status: 422 });
  }

  const member = getStaffById(parsed.data.staffId);
  if (!member) return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });

  const mail = await sendMail({
    to: member.email,
    subject: 'Attendance follow up from Joash Attend',
    text: `Hello ${member.name},\n\nOur attendance records show ${parsed.data.consecutiveDays ?? 3} consecutive days without a clock-in. Please contact your supervisor or HR if you need support.\n\nJoash Attend, every clock-in counted and clear.`,
  });

  return NextResponse.json({
    success: true,
    staff: { id: member.id, name: member.name, email: member.email },
    email: mail,
  });
}
