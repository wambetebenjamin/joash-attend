import { redirect } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Create an account', robots: { index: false, follow: false } };

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) redirect(session.user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard');
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return <AuthForm mode="signup" googleEnabled={googleEnabled} />;
}
