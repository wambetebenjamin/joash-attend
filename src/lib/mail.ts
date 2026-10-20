import nodemailer from 'nodemailer';

interface MailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const isMailConfigured = (): boolean =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const transporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASS as string,
    },
  });

export const sendMail = async (payload: MailPayload): Promise<{ sent: boolean; simulated: boolean }> => {
  if (!isMailConfigured()) {
    console.info('[Joash Attend] SMTP not configured, email simulated for', payload.to, payload.subject);
    return { sent: true, simulated: true };
  }
  await transporter().sendMail({
    from: process.env.SMTP_FROM || 'Joash Attend <no-reply@joashattend.co.ke>',
    ...payload,
  });
  return { sent: true, simulated: false };
};
