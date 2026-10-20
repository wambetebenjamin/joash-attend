import ReportBuilder from '@/components/dashboard/ReportBuilder';
import { getDepartments } from '@/lib/mock';
import { getStaffDirectory } from '@/lib/repository';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Reports' };

export default async function ReportsPage() {
  const staff = await getStaffDirectory();
  const departments = getDepartments().map((department) => department.name);
  return <ReportBuilder staff={staff} departments={departments} />;
}
