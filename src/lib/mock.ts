import type {
  AttendanceRecord,
  AttendanceStatus,
  BiometricDevice,
  Department,
  LeaveRequest,
  LiveEvent,
  Staff,
} from '@/types';
import { addDays, isWeekend, parseISO, toISODate, todayISO } from './date';

const DEPARTMENTS: Department[] = [
  { id: 'dept-academics', name: 'Academics', head: 'Grace Wanjiru', staffCount: 42 },
  { id: 'dept-administration', name: 'Administration', head: 'Peter Otieno', staffCount: 20 },
  { id: 'dept-operations', name: 'Operations', head: 'Halima Abdi', staffCount: 18 },
];

const FIRST_NAMES = [
  'Grace', 'Peter', 'Halima', 'Brian', 'Mercy', 'Kevin', 'Faith', 'Dennis', 'Naomi', 'Samuel',
  'Cynthia', 'Joseph', 'Lilian', 'Eric', 'Esther', 'Victor', 'Ann', 'Michael', 'Wanjiku', 'Collins',
  'Rehema', 'Anthony', 'Beatrice', 'George', 'Njeri', 'Daniel', 'Purity', 'Elijah', 'Tabitha', 'Moses',
  'Caroline', 'Isaac', 'Judy', 'Felix', 'Rose', 'Patrick', 'Irene', 'Alex', 'Damaris', 'Stephen',
];

const LAST_NAMES = [
  'Wanjiru', 'Otieno', 'Abdi', 'Kariuki', 'Achieng', 'Mutua', 'Chebet', 'Omondi', 'Njoroge', 'Kamau',
  'Nyambura', 'Mwangi', 'Ochieng', 'Kilonzo', 'Wafula', 'Kiptoo', 'Barasa', 'Muthoni', 'Odhiambo', 'Njeri',
  'Waweru', 'Maina', 'Gitau', 'Owino', 'Cherono', 'Kimani', 'Atieno', 'Mumbua', 'Sang', 'Nekesa',
];

const LOCATIONS = ['Nairobi Main Campus', 'Thika Campus', 'Mombasa Road Office'];

const ROLE_BY_DEPARTMENT: Record<string, string[]> = {
  Academics: ['Senior Teacher', 'Teacher', 'Head of Subject', 'Teaching Assistant'],
  Administration: ['Registrar', 'HR Officer', 'Finance Officer', 'Front Office Lead'],
  Operations: ['Facilities Officer', 'ICT Support', 'Security Lead', 'Logistics Officer'],
};

const seedFrom = (value: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
};

const pseudoRandom = (seed: number): number => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const pad = (value: number): string => `${value}`.padStart(2, '0');

const ABSENCE_WATCH = ['staff-005', 'staff-014', 'staff-027', 'staff-038', 'staff-052'];

const statusFor = (staffId: string, date: string): AttendanceStatus => {
  const watchIndex = ABSENCE_WATCH.indexOf(staffId);
  if (watchIndex >= 0) {
    const streak = 3 + (watchIndex % 3);
    const target = parseISO(date);
    const today = parseISO(todayISO());
    if (target.getTime() < today.getTime()) {
      let workingDaysSince = 0;
      for (let cursor = addDays(target, 1); cursor.getTime() <= today.getTime(); cursor = addDays(cursor, 1)) {
        if (!isWeekend(cursor)) workingDaysSince += 1;
      }
      if (workingDaysSince <= streak) return 'absent';
    }
  }
  const roll = pseudoRandom(seedFrom(`${staffId}:${date}`));
  if (roll < 0.045) return 'absent';
  if (roll < 0.085) return 'leave';
  if (roll < 0.175) return 'late';
  return 'present';
};

const clockInFor = (staffId: string, date: string, status: AttendanceStatus): string | null => {
  if (status === 'absent' || status === 'leave') return null;
  const seed = seedFrom(`${staffId}:${date}:in`);
  const base = status === 'late' ? 505 : 455;
  const spread = status === 'late' ? 62 : 35;
  const minutes = base + Math.floor(pseudoRandom(seed) * spread);
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
};

const clockOutFor = (staffId: string, date: string, status: AttendanceStatus): string | null => {
  if (status === 'absent' || status === 'leave') return null;
  const seed = seedFrom(`${staffId}:${date}:out`);
  const minutes = 1000 + Math.floor(pseudoRandom(seed) * 95);
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
};

const buildStaffBase = (): Staff[] => {
  const union = new Date();
  const staff: Staff[] = [];
  const departmentPlan: { name: string; count: number }[] = [
    { name: 'Academics', count: 42 },
    { name: 'Administration', count: 20 },
    { name: 'Operations', count: 18 },
  ];

  departmentPlan.forEach(({ name, count }) => {
    for (let index = 0; index < count; index += 1) {
      const seed = seedFrom(`${name}:${index}`);
      const first = FIRST_NAMES[(seed + index) % FIRST_NAMES.length];
      const last = LAST_NAMES[(seed * 3 + index) % LAST_NAMES.length];
      const roles = ROLE_BY_DEPARTMENT[name];
      const staffIndex = staff.length;
      const joined = new Date(union.getFullYear() - (1 + (seed % 5)), seed % 12, 1 + (seed % 26));
      staff.push({
        id: `staff-${`${staffIndex + 1}`.padStart(3, '0')}`,
        staffCode: `JA-${`${staffIndex + 1}`.padStart(4, '0')}`,
        name: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}${index % 3 === 0 ? staffIndex : ''}@joashattend.co.ke`,
        phone: `+2547${(seed % 900000000 + 100000000).toString().slice(0, 9)}`,
        department: name,
        role: roles[seed % roles.length],
        location: LOCATIONS[seed % LOCATIONS.length],
        joinedAt: toISODate(joined),
        status: seed % 17 === 0 ? 'inactive' : 'active',
        attendanceRate: 0,
        avatarTone: seed % 6,
      });
    }
  });

  return staff;
};

let staffCache: Staff[] | null = null;

const rateForStaff = (member: Staff, days = 60): number => {
  let counted = 0;
  let attended = 0;
  const today = todayISO();
  for (let offset = days; offset >= 0; offset -= 1) {
    const date = addDays(today, -offset);
    if (isWeekend(date)) continue;
    const record = recordFor(member, toISODate(date));
    if (record.status === 'leave') continue;
    counted += 1;
    if (record.status === 'present' || record.status === 'late') attended += 1;
  }
  return counted ? Math.round((attended / counted) * 1000) / 10 : 0;
};

export const getStaff = (): Staff[] => {
  if (!staffCache) {
    staffCache = buildStaffBase().map((member) => ({
      ...member,
      attendanceRate: rateForStaff(member),
    }));
  }
  return staffCache;
};

export const getDepartments = (): Department[] => DEPARTMENTS;

export const getStaffById = (id: string): Staff | undefined => getStaff().find((member) => member.id === id);

const recordFor = (member: Staff, date: string): AttendanceRecord => {
  const status = statusFor(member.id, date);
  return {
    id: `${member.id}:${date}`,
    staffId: member.id,
    staffName: member.name,
    department: member.department,
    date,
    clockIn: clockInFor(member.id, date, status),
    clockOut: clockOutFor(member.id, date, status),
    status,
  };
};

export function attendanceForStaff(staffId: string, days: number): AttendanceRecord[] {
  const member = getStaff().find((entry) => entry.id === staffId);
  if (!member) return [];
  const records: AttendanceRecord[] = [];
  const today = todayISO();
  for (let offset = days; offset >= 0; offset -= 1) {
    const date = addDays(today, -offset);
    if (isWeekend(date)) continue;
    records.push(recordFor(member, toISODate(date)));
  }
  return records;
}

const attendanceCache = new Map<string, AttendanceRecord[]>();

export const getAttendanceForDate = (date: string, department?: string): AttendanceRecord[] => {
  const key = `${date}:${department ?? 'all'}`;
  const cached = attendanceCache.get(key);
  if (cached) return cached;
  const records = getStaff()
    .filter((member) => member.status === 'active')
    .filter((member) => !department || member.department === department)
    .map((member) => recordFor(member, date));
  attendanceCache.set(key, records);
  return records;
};

export const getAttendanceRange = (from: string, to: string, department?: string): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  let cursor = parseISO(from);
  const end = parseISO(to);
  while (cursor.getTime() <= end.getTime()) {
    const date = toISODate(cursor);
    if (!isWeekend(cursor)) records.push(...getAttendanceForDate(date, department));
    cursor = addDays(cursor, 1);
  }
  return records;
};

export const getTodaySummary = () => {
  const records = getAttendanceForDate(todayISO());
  const present = records.filter((record) => record.status === 'present').length;
  const late = records.filter((record) => record.status === 'late').length;
  const absent = records.filter((record) => record.status === 'absent').length;
  const leave = records.filter((record) => record.status === 'leave').length;
  const counted = records.length - leave;
  return {
    date: todayISO(),
    present,
    late,
    absent,
    leave,
    total: records.length,
    attendanceRate: counted ? Math.round(((present + late) / counted) * 1000) / 10 : 0,
    monthRate: getMonthlyRate(),
  };
};

const getMonthlyRate = (): number => {
  const today = new Date();
  const monthStart = toISODate(new Date(today.getFullYear(), today.getMonth(), 1));
  const records = getAttendanceRange(monthStart, todayISO());
  const counted = records.filter((record) => record.status !== 'leave');
  const attended = counted.filter((record) => record.status === 'present' || record.status === 'late').length;
  return counted.length ? Math.round((attended / counted.length) * 1000) / 10 : 0;
};

export const getDailyAttendanceRates = (days = 30) => {
  const series: { date: string; label: string; rate: number; present: number; absent: number }[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = addDays(todayISO(), -offset);
    if (isWeekend(date)) continue;
    const iso = toISODate(date);
    const records = getAttendanceForDate(iso);
    const counted = records.filter((record) => record.status !== 'leave');
    const attended = counted.filter((record) => record.status === 'present' || record.status === 'late').length;
    series.push({
      date: iso,
      label: iso.slice(5).replace('-', '/'),
      rate: counted.length ? Math.round((attended / counted.length) * 1000) / 10 : 0,
      present: records.filter((record) => record.status === 'present' || record.status === 'late').length,
      absent: records.filter((record) => record.status === 'absent').length,
    });
  }
  return series;
};

export const getMonthlyTrend = () => {
  const today = new Date();
  const series: { month: string; rate: number; present: number; late: number; absent: number }[] = [];
  for (let offset = 11; offset >= 0; offset -= 1) {
    const start = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const end = new Date(today.getFullYear(), today.getMonth() - offset + 1, 0);
    const cappedEnd = end.getTime() > today.getTime() ? today : end;
    const records = getAttendanceRange(toISODate(start), toISODate(cappedEnd));
    if (!records.length) {
      series.push({
        month: start.toLocaleDateString('en-KE', { month: 'short' }),
        rate: 0,
        present: 0,
        late: 0,
        absent: 0,
      });
      continue;
    }
    const counted = records.filter((record) => record.status !== 'leave');
    const present = counted.filter((record) => record.status === 'present').length;
    const late = counted.filter((record) => record.status === 'late').length;
    const absent = counted.filter((record) => record.status === 'absent').length;
    series.push({
      month: start.toLocaleDateString('en-KE', { month: 'short' }),
      rate: counted.length ? Math.round(((present + late) / counted.length) * 1000) / 10 : 0,
      present,
      late,
      absent,
    });
  }
  return series;
};

export const getDepartmentBreakdown = () => {
  const records = getAttendanceForDate(todayISO());
  return DEPARTMENTS.map((department) => {
    const rows = records.filter((record) => record.department === department.name);
    const present = rows.filter((record) => record.status === 'present').length;
    const late = rows.filter((record) => record.status === 'late').length;
    const absent = rows.filter((record) => record.status === 'absent').length;
    const leave = rows.filter((record) => record.status === 'leave').length;
    const counted = rows.length - leave;
    return {
      ...department,
      present,
      late,
      absent,
      leave,
      total: rows.length,
      rate: counted ? Math.round(((present + late) / counted) * 1000) / 10 : 0,
    };
  });
};

export const getDepartmentWeek = () => {
  const weekdays: { label: string; date: string }[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = addDays(todayISO(), -offset);
    if (isWeekend(date)) continue;
    weekdays.push({
      label: date.toLocaleDateString('en-KE', { weekday: 'short' }),
      date: toISODate(date),
    });
  }
  return weekdays.map((day) => {
    const records = getAttendanceForDate(day.date);
    const entry: { day: string } & Record<string, string | number> = { day: day.label };
    DEPARTMENTS.forEach((department) => {
      const rows = records.filter((record) => record.department === department.name);
      const counted = rows.filter((record) => record.status !== 'leave');
      const attended = rows.filter((record) => record.status === 'present' || record.status === 'late').length;
      entry[department.name] = counted.length ? Math.round((attended / counted.length) * 1000) / 10 : 0;
    });
    return entry;
  });
};

export const getAbsenceAlerts = () => {
  const alerts: {
    staffId: string;
    name: string;
    department: string;
    lastSeen: string;
    consecutiveDays: number;
    contact: string;
  }[] = [];
  const today = todayISO();
  getStaff()
    .filter((member) => member.status === 'active')
    .forEach((member) => {
      let streak = 0;
      let lastSeen = '';
      for (let offset = 1; offset <= 8; offset += 1) {
        const date = addDays(today, -offset);
        if (isWeekend(date)) continue;
        const record = recordFor(member, toISODate(date));
        if (record.status === 'absent') {
          streak += 1;
        } else {
          if (!lastSeen && (record.status === 'present' || record.status === 'late')) {
            lastSeen = toISODate(date);
          }
          break;
        }
      }
      if (streak >= 3) {
        alerts.push({
          staffId: member.id,
          name: member.name,
          department: member.department,
          lastSeen: lastSeen || toISODate(addDays(today, -(streak + 2))),
          consecutiveDays: streak,
          contact: member.email,
        });
      }
    });
  return alerts.sort((a, b) => b.consecutiveDays - a.consecutiveDays).slice(0, 8);
};

export const getStaffAttendanceHistory = (staffId: string, from: string, to: string) => {
  const member = getStaffById(staffId);
  if (!member) return [];
  const records: AttendanceRecord[] = [];
  let cursor = parseISO(from);
  const end = parseISO(to);
  while (cursor.getTime() <= end.getTime()) {
    if (!isWeekend(cursor)) records.push(recordFor(member, toISODate(cursor)));
    cursor = addDays(cursor, 1);
  }
  return records;
};

export const getSeedLeaves = (): LeaveRequest[] => {
  const staff = getStaff();
  const types = ['Annual leave', 'Sick leave', 'Compassionate leave', 'Study leave'];
  const reasons = [
    'Attending a family function upcountry.',
    'Medical review at Kenyatta National Hospital.',
    'Bereavement in the family.',
    'Final semester examinations.',
    'Annual leave booked with the department head.',
    'Recovering from flu and advised to rest.',
  ];
  return Array.from({ length: 9 }).map((_, index) => {
    const member = staff[(index * 7 + 3) % staff.length];
    const start = toISODate(addDays(todayISO(), index % 2 === 0 ? -4 + index : 3 + index));
    const days = 1 + (index % 4);
    const end = toISODate(addDays(start, days - 1));
    const status: LeaveRequest['status'] = index < 5 ? 'pending' : index < 8 ? 'approved' : 'rejected';
    return {
      id: `leave-${`${index + 1}`.padStart(3, '0')}`,
      staffId: member.id,
      staffName: member.name,
      department: member.department,
      type: types[index % types.length],
      startDate: start,
      endDate: end,
      days,
      reason: reasons[index % reasons.length],
      status,
      submittedAt: toISODate(addDays(start, -2)),
      decidedAt: status === 'pending' ? undefined : toISODate(addDays(start, -1)),
    };
  });
};

export const getSeedDevices = (): BiometricDevice[] => {
  const now = Date.now();
  return [
    {
      id: 'device-001',
      deviceId: 'ZKT-FP-4401',
      location: 'Nairobi Main Campus, Gate A',
      type: 'fingerprint',
      status: 'online',
      lastSync: new Date(now - 4 * 60 * 1000).toISOString(),
      firmware: '3.8.2',
      enrolledUsers: 64,
    },
    {
      id: 'device-002',
      deviceId: 'ZKT-FP-4402',
      location: 'Nairobi Main Campus, Staff Wing',
      type: 'fingerprint',
      status: 'online',
      lastSync: new Date(now - 11 * 60 * 1000).toISOString(),
      firmware: '3.8.2',
      enrolledUsers: 38,
    },
    {
      id: 'device-003',
      deviceId: 'HIK-FACE-2207',
      location: 'Thika Campus, Reception',
      type: 'face-id',
      status: 'online',
      lastSync: new Date(now - 26 * 60 * 1000).toISOString(),
      firmware: '2.1.0',
      enrolledUsers: 22,
    },
    {
      id: 'device-004',
      deviceId: 'ZKT-FP-4409',
      location: 'Mombasa Road Office, Service Bay',
      type: 'fingerprint',
      status: 'offline',
      lastSync: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      firmware: '3.7.9',
      enrolledUsers: 12,
    },
  ];
};

let liveStarted = false;
let liveEvents: LiveEvent[] = [];
let livePumpAt = 0;
let liveCursor = 0;

const buildLiveEvents = (): LiveEvent[] => {
  const today = todayISO();
  const records = getAttendanceForDate(today).filter(
    (record) => record.status === 'present' || record.status === 'late',
  );
  const events: LiveEvent[] = [];
  records.forEach((record) => {
    if (record.clockIn) {
      events.push({
        id: `${record.id}-in`,
        sequence: 0,
        staffId: record.staffId,
        staffName: record.staffName,
        department: record.department,
        time: record.clockIn,
        type: 'clock-in',
        status: record.status === 'late' ? 'late' : 'present',
      });
    }
    if (record.clockOut) {
      events.push({
        id: `${record.id}-out`,
        sequence: 0,
        staffId: record.staffId,
        staffName: record.staffName,
        department: record.department,
        time: record.clockOut,
        type: 'clock-out',
        status: record.status === 'late' ? 'late' : 'present',
      });
    }
  });
  events.sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0));
  return events.map((event, index) => ({ ...event, sequence: index + 1 }));
};

export const getLiveEvents = (since = 0): { events: LiveEvent[]; cursor: number } => {
  if (!liveStarted) {
    liveEvents = buildLiveEvents();
    liveCursor = liveEvents.length;
    liveStarted = true;
    livePumpAt = Date.now();
  }
  const now = Date.now();
  if (now - livePumpAt > 12000 && liveEvents.length < 120) {
    livePumpAt = now;
    const next = liveEvents[liveEvents.length % Math.max(liveEvents.length, 1)];
    if (next) {
      const [hour, minute] = next.time.split(':').map(Number);
      const rolled = (hour * 60 + minute + 7) % (19 * 60);
      liveCursor += 1;
      liveEvents.push({
        ...next,
        id: `${next.id}-${liveCursor}`,
        sequence: liveCursor,
        type: liveCursor % 3 === 0 ? 'clock-out' : 'clock-in',
        time: `${`${Math.floor(rolled / 60)}`.padStart(2, '0')}:${`${rolled % 60}`.padStart(2, '0')}`,
      });
    }
  }
  return {
    events: liveEvents.filter((event) => event.sequence > since).slice(-12).reverse(),
    cursor: liveCursor,
  };
};

export const getPersonalSummary = (staffId: string) => {
  const records = attendanceForStaff(staffId, 30);
  const present = records.filter((record) => record.status === 'present').length;
  const late = records.filter((record) => record.status === 'late').length;
  const absent = records.filter((record) => record.status === 'absent').length;
  const leave = records.filter((record) => record.status === 'leave').length;
  const counted = records.length - leave;
  return {
    present,
    late,
    absent,
    leave,
    days: records.length,
    rate: counted ? Math.round(((present + late) / counted) * 1000) / 10 : 0,
  };
};

export const DEMO_ORG = {
  name: 'Joash Attend Demo Organisation',
  staff: 80,
  departments: 3,
  description: 'A read only preview populated with realistic mock data for a Kenyan training institute.',
};
