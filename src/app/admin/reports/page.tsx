import ReportBuilder from '@/components/dashboard/ReportBuilder';
import { getDepartments } from '@/lib/mock';
import { getStaffDirectory } from '@/lib/repository';
import { toISODate, todayISO } from '@/lib/date';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reports' };

export default async function ReportsPage() {
  const staff = await getStaffDirectory();
  const departments = getDepartments().map((department) => department.name);
  const today = new Date();
  return (
    <ReportBuilder
      staff={staff}
      departments={departments}
      defaultFrom={toISODate(new Date(today.getFullYear(), today.getMonth(), 1))}
      defaultTo={todayISO()}
    />
  );
}
