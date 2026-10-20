import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/guard';
import { addDevice, getDevices } from '@/lib/repository';

export const dynamic = 'force-dynamic';

const deviceSchema = z.object({
  deviceId: z.string().min(4).max(40),
  location: z.string().min(3).max(90),
  type: z.enum(['fingerprint', 'face-id']),
});

export async function GET() {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;
  const devices = await getDevices();
  return NextResponse.json({ devices, simulated: true });
}

export async function POST(request: Request) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  const json = await request.json().catch(() => null);
  const parsed = deviceSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid device details.', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const device = {
    id: `device-${Date.now()}`,
    deviceId: parsed.data.deviceId,
    location: parsed.data.location,
    type: parsed.data.type,
    status: 'online' as const,
    lastSync: new Date().toISOString(),
    firmware: '3.8.2',
    enrolledUsers: 0,
  };

  await addDevice(device);
  return NextResponse.json({ device, simulated: true }, { status: 201 });
}
