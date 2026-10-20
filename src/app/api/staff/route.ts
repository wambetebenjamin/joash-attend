import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/guard';
import { getStaffDirectory, addStaffMember } from '@/lib/repository';
import type { Staff } from '@/types';

export const dynamic = 'force-dynamic';

const staffSchema = z.object({
  name: z.string().min(3).max(80),
  email: z.string().email(),
  phone: z.string().min(9).max(20).optional(),
  department: z.enum(['Academics', 'Administration', 'Operations']),
  role: z.string().min(2).max(60),
  location: z.string().min(2).max(80),
  joinedAt: z.string().min(8).max(10).optional(),
});

export async function GET(request: Request) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  const url = new URL(request.url);
  const search = (url.searchParams.get('search') ?? '').toLowerCase();
  const department = url.searchParams.get('department') ?? '';
  const status = url.searchParams.get('status') ?? '';
  const location = url.searchParams.get('location') ?? '';

  const directory = await getStaffDirectory();
  const filtered = directory.filter((member) => {
    const matchesSearch =
      !search ||
      member.name.toLowerCase().includes(search) ||
      member.staffCode.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search);
    return (
      matchesSearch &&
      (!department || member.department === department) &&
      (!status || member.status === status) &&
      (!location || member.location === location)
    );
  });

  return NextResponse.json({ count: filtered.length, staff: filtered, simulated: true });
}

export async function POST(request: Request) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;

  const json = await request.json().catch(() => null);
  const parsed = staffSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid staff details.', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const directory = await getStaffDirectory();
  const nextIndex = directory.length + 1;
  const member: Staff = {
    id: `staff-${Date.now()}`,
    staffCode: `JA-${`${nextIndex}`.padStart(4, '0')}`,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? '+254700000000',
    department: parsed.data.department,
    role: parsed.data.role,
    location: parsed.data.location,
    joinedAt: parsed.data.joinedAt ?? new Date().toISOString().slice(0, 10),
    status: 'active',
    attendanceRate: 0,
    avatarTone: nextIndex % 6,
  };

  await addStaffMember(member);
  return NextResponse.json({ staff: member }, { status: 201 });
}
