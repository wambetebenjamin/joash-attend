import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/guard';
import { saveLeave } from '@/lib/repository';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { daysBetweenInclusive } from '@/lib/date';
import { sendMail } from '@/lib/mail';
import { getStaffById } from '@/lib/mock';

export const dynamic = 'force-dynamic';

const leaveSchema = z
  .object({
    type: z.string().min(2).max(40),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    reason: z.string().min(10).max(500),
    recaptchaToken: z.string().optional(),
    staffId: z.string().optional(),
  })
  .refine((value) => value.endDate >= value.startDate, {
    message: 'The end date must fall after the start date.',
    path: ['endDate'],
  });

export async function POST(request: Request) {
  const guard = await requireRole(['member', 'admin']);
  if (guard.response || !guard.user) return guard.response;

  const json = await request.json().catch(() => null);
  const parsed = leaveSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid leave request.', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const captcha = await verifyRecaptcha(parsed.data.recaptchaToken, 'leave_request');
  if (!captcha.success) {
    return NextResponse.json(
      { error: 'Verification failed. Please complete the challenge and try again.', challengeRequired: captcha.challengeRequired },
      { status: 400 },
    );
  }

  const staffId = guard.user.role === 'admin' ? parsed.data.staffId ?? 'staff-001' : guard.user.staffId ?? 'staff-001';
  const member = getStaffById(staffId);
  const leave = {
    id: `leave-${Date.now()}`,
    staffId,
    staffName: member?.name ?? guard.user.name ?? 'Staff member',
    department: member?.department ?? 'Academics',
    type: parsed.data.type,
    startDate: parsed.data.startDate,
    endDate: parsed.data.endDate,
    days: daysBetweenInclusive(parsed.data.startDate, parsed.data.endDate),
    reason: parsed.data.reason,
    status: 'pending' as const,
    submittedAt: new Date().toISOString().slice(0, 10),
  };

  await saveLeave(leave);

  await sendMail({
    to: process.env.SMTP_FROM || 'hr@joashattend.co.ke',
    subject: `New leave request from ${leave.staffName}`,
    text: `${leave.staffName} (${leave.department}) requested ${leave.days} day(s) of ${leave.type} from ${leave.startDate} to ${leave.endDate}.`,
  }).catch(() => ({ sent: false, simulated: true }));

  return NextResponse.json(
    { leave, captcha: { score: captcha.score, simulated: captcha.simulated } },
    { status: 201 },
  );
}
