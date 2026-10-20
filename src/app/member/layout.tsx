import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/guard';
import { getSettings } from '@/lib/repository';
import AppShell from '@/components/dashboard/AppShell';

export const dynamic = 'force-dynamic';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const guard = await requireRole(['member', 'admin']);
  if (guard.response) redirect('/auth/signin?callbackUrl=/member/dashboard');
  const user = guard.user;
  const settings = await getSettings();

  return (
    <AppShell
      role={user?.role === 'admin' ? 'admin' : 'member'}
      name={user?.name ?? 'Staff member'}
      email={user?.email ?? 'staff@joashattend.co.ke'}
      organisation={settings.name}
      notifications={['Your attendance record for this month is up to date.', 'One leave request is awaiting review.']}
    >
      {children}
    </AppShell>
  );
}
