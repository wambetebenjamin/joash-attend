import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { readStore, writeStore } from './storage';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'member';
  staffId?: string;
  createdAt: string;
}

const DEMO_PASSWORD = 'attendance2026';

const hash = (password: string, salt: string): string =>
  scryptSync(password, salt, 64).toString('hex');

export const createPasswordRecord = (password: string): string => {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${hash(password, salt)}`;
};

export const verifyPassword = (password: string, record: string): boolean => {
  const [salt, digest] = record.split(':');
  if (!salt || !digest) return false;
  const candidate = Buffer.from(hash(password, salt), 'hex');
  const stored = Buffer.from(digest, 'hex');
  if (candidate.length !== stored.length) return false;
  return timingSafeEqual(candidate, stored);
};

const demoUsers = (): StoredUser[] => [
  {
    id: 'admin-1',
    name: 'Joash Mwangi',
    email: 'admin@joashattend.co.ke',
    passwordHash: createPasswordRecord(DEMO_PASSWORD),
    role: 'admin',
    createdAt: '2025-01-12',
  },
  {
    id: 'member-1',
    name: 'Stephen Mumbua',
    email: 'staff@joashattend.co.ke',
    passwordHash: createPasswordRecord(DEMO_PASSWORD),
    role: 'member',
    staffId: 'staff-001',
    createdAt: '2025-02-03',
  },
];

export const DEMO_CREDENTIALS = {
  admin: { email: 'admin@joashattend.co.ke', password: DEMO_PASSWORD },
  member: { email: 'staff@joashattend.co.ke', password: DEMO_PASSWORD },
};

export const listUsers = async (): Promise<StoredUser[]> => {
  const stored = await readStore<StoredUser[] | null>('joash:users', null);
  if (stored && stored.length) return [...demoUsers(), ...stored];
  return demoUsers();
};

export const findUser = async (email: string) => {
  const users = await listUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const setUserStaffId = async (email: string, staffId: string): Promise<void> => {
  const stored = (await readStore<StoredUser[] | null>('joash:users', null)) ?? [];
  await writeStore(
    'joash:users',
    stored.map((user) =>
      user.email.toLowerCase() === email.toLowerCase() ? { ...user, staffId } : user,
    ),
  );
};

export const registerUser = async (input: {
  name: string;
  email: string;
  password: string;
}): Promise<StoredUser> => {
  const existing = await findUser(input.email);
  if (existing) throw new Error('An account with this email already exists.');
  const stored = (await readStore<StoredUser[] | null>('joash:users', null)) ?? [];
  const user: StoredUser = {
    id: `user-${Date.now()}`,
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: createPasswordRecord(input.password),
    role: 'member',
    createdAt: new Date().toISOString().slice(0, 10),
  };
  await writeStore('joash:users', [...stored, user]);
  return user;
};
