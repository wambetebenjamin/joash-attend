import StaffDirectory from '@/components/dashboard/StaffDirectory';
import { getStaffDirectory } from '@/lib/repository';
import { getDepartments } from '@/lib/mock';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Staff directory' };

export default async function StaffPage() {
  const staff = await getStaffDirectory();
  const departments = getDepartments().map((department) => department.name);
  const locations = Array.from(new Set(staff.map((member) => member.location)));

  return <StaffDirectory initialStaff={staff} departments={departments} locations={locations} />;
}
