import LeaveManager from '@/components/dashboard/LeaveManager';
import { getLeaves } from '@/lib/repository';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Leave management' };

export default async function LeavesPage() {
  const leaves = await getLeaves();
  return <LeaveManager initialLeaves={leaves} />;
}
