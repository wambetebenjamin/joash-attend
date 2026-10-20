import { getSeedDevices, getSeedLeaves, getStaff } from './mock';
import { readStore, writeStore } from './storage';
import type { BiometricDevice, LeaveRequest, OrganisationSettings, Staff } from '@/types';

export const KEYS = {
  leaves: 'joash:leaves',
  devices: 'joash:devices',
  staff: 'joash:staff',
  settings: 'joash:settings',
  users: 'joash:users',
  contacts: 'joash:contacts',
} as const;

export const defaultSettings: OrganisationSettings = {
  name: process.env.ORG_NAME || 'Joash Attend Academy',
  logoUrl: null,
  workStart: process.env.WORK_START_TIME || '08:00',
  workEnd: process.env.WORK_END_TIME || '17:00',
  graceMinutes: Number(process.env.LATE_GRACE_MINUTES ?? 10),
  leaveTypes: ['Annual leave', 'Sick leave', 'Compassionate leave', 'Study leave', 'Maternity leave', 'Paternity leave'],
  notifyLate: true,
  notifyAbsent: true,
  notifyLeave: true,
  payrollFormat: 'csv',
};

export const getLeaves = async (): Promise<LeaveRequest[]> => {
  const stored = await readStore<LeaveRequest[] | null>(KEYS.leaves, null);
  if (stored) return stored;
  const seeded = getSeedLeaves();
  await writeStore(KEYS.leaves, seeded);
  return seeded;
};

export const saveLeave = async (leave: LeaveRequest): Promise<LeaveRequest> => {
  const leaves = await getLeaves();
  const next = [leave, ...leaves];
  await writeStore(KEYS.leaves, next);
  return leave;
};

export const updateLeave = async (id: string, status: 'approved' | 'rejected'): Promise<LeaveRequest | null> => {
  const leaves = await getLeaves();
  const target = leaves.find((leave) => leave.id === id);
  if (!target) return null;
  const updated: LeaveRequest = {
    ...target,
    status,
    decidedAt: new Date().toISOString().slice(0, 10),
  };
  await writeStore(
    KEYS.leaves,
    leaves.map((leave) => (leave.id === id ? updated : leave)),
  );
  return updated;
};

export const getDevices = async (): Promise<BiometricDevice[]> => {
  const stored = await readStore<BiometricDevice[] | null>(KEYS.devices, null);
  if (stored) return stored;
  const seeded = getSeedDevices();
  await writeStore(KEYS.devices, seeded);
  return seeded;
};

export const addDevice = async (device: BiometricDevice): Promise<BiometricDevice> => {
  const devices = await getDevices();
  await writeStore(KEYS.devices, [device, ...devices]);
  return device;
};

export const markDeviceSynced = async (id: string): Promise<BiometricDevice[]> => {
  const devices = await getDevices();
  const next = devices.map((device) =>
    device.id === id
      ? { ...device, lastSync: new Date().toISOString(), status: 'online' as const }
      : device,
  );
  await writeStore(KEYS.devices, next);
  return next;
};

export const getStaffDirectory = async (): Promise<Staff[]> => {
  const overrides = await readStore<Staff[] | null>(KEYS.staff, null);
  return overrides && overrides.length ? overrides : getStaff();
};

export const addStaffMember = async (staff: Staff): Promise<Staff> => {
  const directory = await getStaffDirectory();
  const next = [staff, ...directory];
  await writeStore(KEYS.staff, next);
  return staff;
};

export const updateStaffMember = async (id: string, patch: Partial<Staff>): Promise<Staff | null> => {
  const directory = await getStaffDirectory();
  const target = directory.find((member) => member.id === id);
  if (!target) return null;
  const updated = { ...target, ...patch };
  await writeStore(
    KEYS.staff,
    directory.map((member) => (member.id === id ? updated : member)),
  );
  return updated;
};

export const removeStaffMember = async (id: string): Promise<boolean> => {
  const directory = await getStaffDirectory();
  const next = directory.filter((member) => member.id !== id);
  if (next.length === directory.length) return false;
  await writeStore(KEYS.staff, next);
  return true;
};

export const getSettings = async (): Promise<OrganisationSettings> => {
  const stored = await readStore<OrganisationSettings | null>(KEYS.settings, null);
  return { ...defaultSettings, ...(stored ?? {}) };
};

export const saveSettings = async (patch: Partial<OrganisationSettings>): Promise<OrganisationSettings> => {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await writeStore(KEYS.settings, next);
  return next;
};
