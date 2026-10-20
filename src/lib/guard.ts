import { NextResponse } from 'next/server';
import { auth } from './auth';
import type { Role } from '@/types';

export const getSessionUser = async () => {
  const session = await auth();
  if (!session?.user) return null;
  return {
    id: session.user.id ?? session.user.email ?? 'unknown',
    name: session.user.name,
    email: session.user.email,
    role: (session.user.role ?? 'member') as Role,
    staffId: session.user.staffId,
  };
};

export const requireRole = async (roles: Role[]) => {
  const user = await getSessionUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }),
    } as const;
  }
  if (!roles.includes(user.role)) {
    return {
      user: null,
      response: NextResponse.json({ error: 'You do not have access to this resource.' }, { status: 403 }),
    } as const;
  }
  return { user, response: null } as const;
};
