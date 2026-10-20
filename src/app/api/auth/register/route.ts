import { NextResponse } from 'next/server';
import { z } from 'zod';
import { registerUser, setUserStaffId } from '@/lib/users';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { addStaffMember } from '@/lib/repository';

export const dynamic = 'force-dynamic';

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  organisation: z.string().min(2).max(120).optional(),
  phone: z.string().min(7).max(20).optional(),
  recaptchaToken: z.string().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the sign up details.', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const captcha = await verifyRecaptcha(parsed.data.recaptchaToken, 'signup');
  if (!captcha.success) {
    return NextResponse.json({ error: 'Verification failed.', challengeRequired: captcha.challengeRequired }, { status: 400 });
  }

  try {
    const user = await registerUser({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });
    const staffId = `staff-${Date.now()}`;
    const staffCode = `JA-${`${Math.floor(Date.now() / 1000) % 10000}`.padStart(4, '0')}`;
    await addStaffMember({
      id: staffId,
      staffCode,
      name: user.name,
      email: user.email,
      phone: parsed.data.phone ?? '+254700000000',
      department: 'Administration',
      role: 'Staff member',
      location: 'Nairobi Main Campus',
      joinedAt: new Date().toISOString().slice(0, 10),
      status: 'active',
      attendanceRate: 0,
      avatarTone: 1,
    }).catch(() => null);
    await setUserStaffId(user.email, staffId).catch(() => undefined);

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, staffId },
      note: 'New accounts start with the member role. An administrator can promote you.',
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create the account.';
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
