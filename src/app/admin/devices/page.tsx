import DeviceManager from '@/components/dashboard/DeviceManager';
import { getDevices } from '@/lib/repository';
import { getStaffDirectory } from '@/lib/repository';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Biometric devices' };

export default async function DevicesPage() {
  const devices = await getDevices();
  const staff = await getStaffDirectory();
  const locations = Array.from(new Set([...devices.map((device) => device.location), ...staff.map((member) => member.location)]));

  return <DeviceManager initialDevices={devices} locations={locations} />;
}
