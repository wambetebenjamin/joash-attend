export type Role = 'admin' | 'member';

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave';

export interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
}

export interface Staff {
  id: string;
  staffCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  location: string;
  joinedAt: string;
  status: 'active' | 'inactive';
  attendanceRate: number;
  avatarTone: number;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  status: AttendanceStatus;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  decidedAt?: string;
}

export interface BiometricDevice {
  id: string;
  deviceId: string;
  location: string;
  type: 'fingerprint' | 'face-id';
  status: 'online' | 'offline';
  lastSync: string;
  firmware: string;
  enrolledUsers: number;
}

export interface LiveEvent {
  id: string;
  sequence: number;
  staffId: string;
  staffName: string;
  department: string;
  time: string;
  type: 'clock-in' | 'clock-out';
  status: 'present' | 'late';
}

export interface OrganisationSettings {
  name: string;
  logoUrl: string | null;
  workStart: string;
  workEnd: string;
  graceMinutes: number;
  leaveTypes: string[];
  notifyLate: boolean;
  notifyAbsent: boolean;
  notifyLeave: boolean;
  payrollFormat: 'csv' | 'xlsx' | 'sage' | 'quickbooks';
}

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
  staffId?: string;
}
