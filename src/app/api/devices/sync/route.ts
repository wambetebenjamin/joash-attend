import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/guard';
import { markDeviceSynced } from '@/lib/repository';
import { getStaff } from '@/lib/mock';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  const json = (await request.json().catch(() => ({}))) as { deviceId?: string };
  const devices = await markDeviceSynced(json.deviceId ?? '');
  const staff = getStaff();
  const pulled = 8 + (new Date().getMinutes() % 7);

  return NextResponse.json({
    status: 'synced',
    simulated: true,
    deviceId: json.deviceId ?? 'all-devices',
    pulledRecords: pulled,
    pushedRecords: 0,
    latencyMs: 180 + (new Date().getSeconds() % 90),
    clockEvents: staff.slice(0, pulled).map((member, index) => ({
      staffCode: member.staffCode,
      name: member.name,
      direction: index % 4 === 0 ? 'clock-out' : 'clock-in',
      deviceTime: new Date(Date.now() - index * 45 * 1000).toISOString(),
      verification: index % 5 === 0 ? 'face-id' : 'fingerprint',
    })),
    devices,
    syncedAt: new Date().toISOString(),
  });
}
