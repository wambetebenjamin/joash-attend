import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/guard';
import { updateLeave } from '@/lib/repository';
import { sendMail } from '@/lib/mail';

export const dynamic = 'force-dynamic';

const reviewSchema = z.object({
  leaveId: z.string().min(3),
  decision: z.enum(['approve', 'reject']),
  note: z.string().max(300).optional(),
});

export async function PUT(request: Request) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  const json = await request.json().catch(() => null);
  const parsed = reviewSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid review payload.', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const status = parsed.data.decision === 'approve' ? 'approved' : 'rejected';
  const leave = await updateLeave(parsed.data.leaveId, status);
  if (!leave) return NextResponse.json({ error: 'Leave request not found.' }, { status: 404 });

  await sendMail({
    to: 'hr@joashattend.co.ke',
    subject: `Leave ${status}: ${leave.staffName}`,
    text: `${leave.staffName}'s ${leave.type} request for ${leave.startDate} to ${leave.endDate} was ${status}.`,
  }).catch(() => ({ sent: false, simulated: true }));

  return NextResponse.json({ leave, email: { simulated: true } });
}
