import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/guard';
import { getSettings } from '@/lib/repository';
import { getAbsenceAlerts, getTodaySummary } from '@/lib/mock';
import AppShell from '@/components/dashboard/AppShell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const guard = await requireRole(['admin']);
  if (guard.response) redirect('/auth/signin?callbackUrl=/admin/dashboard');
  const user = guard.user;
  const settings = await getSettings();
  const summary = getTodaySummary();
  const alerts = getAbsenceAlerts();
  const notifications = [
    `${summary.present + summary.late} clock-ins recorded today, ${summary.absent} absent.`,
    alerts.length ? `${alerts.length} staff have been absent for three or more days.` : 'No consecutive absence alerts.',
    'Device sync completed from the mock bridge.',
  ];

  return (
    <AppShell
      role="admin"
      name={user?.name ?? 'Joash Admin'}
      email={user?.email ?? 'admin@joashattend.co.ke'}
      organisation={settings.name}
      notifications={notifications}
    >
      {children}
    </AppShell>
  );
}
