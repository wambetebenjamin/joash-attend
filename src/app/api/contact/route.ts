import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { sendMail } from '@/lib/mail';
import { readStore, writeStore } from '@/lib/storage';

export const dynamic = 'force-dynamic';

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  organisation: z.string().min(2).max(120),
  phone: z.string().min(7).max(20),
  size: z.string().max(40).optional(),
  message: z.string().min(10).max(1200),
  recaptchaToken: z.string().optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the form details.', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const captcha = await verifyRecaptcha(parsed.data.recaptchaToken, 'contact');
  if (!captcha.success) {
    return NextResponse.json(
      { error: 'Verification failed. Please retry the challenge.', challengeRequired: captcha.challengeRequired },
      { status: 400 },
    );
  }

  const stored = (await readStore<unknown[]>('joash:contacts', [])) ?? [];
  await writeStore('joash:contacts', [
    { ...parsed.data, recaptchaToken: undefined, receivedAt: new Date().toISOString() },
    ...stored,
  ]);

  const mail = await sendMail({
    to: process.env.SMTP_FROM || 'sales@joashattend.co.ke',
    subject: `Demo request from ${parsed.data.organisation}`,
    text: `${parsed.data.name} (${parsed.data.email}, ${parsed.data.phone}) requested a demo for ${parsed.data.organisation}.\n\n${parsed.data.message}`,
  }).catch(() => ({ sent: false, simulated: true }));

  return NextResponse.json({
    success: true,
    email: mail,
    captcha: { score: captcha.score, simulated: captcha.simulated },
  });
}
