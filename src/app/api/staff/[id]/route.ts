import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/guard';
import { getStaffDirectory, removeStaffMember, updateStaffMember } from '@/lib/repository';

export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  name: z.string().min(3).max(80).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(9).max(20).optional(),
  department: z.enum(['Academics', 'Administration', 'Operations']).optional(),
  role: z.string().min(2).max(60).optional(),
  location: z.string().min(2).max(80).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;
  const { id } = await context.params;
  const directory = await getStaffDirectory();
  const member = directory.find((entry) => entry.id === id);
  if (!member) return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
  return NextResponse.json({ staff: member });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;
  const { id } = await context.params;
  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid update.', issues: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const updated = await updateStaffMember(id, parsed.data);
  if (!updated) return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
  return NextResponse.json({ staff: updated });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const guard = await requireRole(['admin']);
  if (guard.response) return guard.response;
  const { id } = await context.params;
  const removed = await removeStaffMember(id);
  if (!removed) return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
  return NextResponse.json({ success: true, id });
}
