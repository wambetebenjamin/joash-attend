const DAY_MS = 24 * 60 * 60 * 1000;

export const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const todayISO = (): string => toISODate(new Date());

export const parseISO = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

export const addDays = (value: string | Date, amount: number): Date => {
  const base = typeof value === 'string' ? parseISO(value) : new Date(value.getTime());
  return new Date(base.getTime() + amount * DAY_MS);
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const formatShortDate = (value: string): string =>
  parseISO(value).toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const formatDayMonth = (value: string): string =>
  parseISO(value).toLocaleDateString('en-KE', { day: '2-digit', month: 'short' });

export const formatMonthKey = (value: string): string =>
  parseISO(value).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' });

export const formatTime = (value: string | null): string => {
  if (!value) return 'Not recorded';
  const [hours, minutes] = value.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const normalised = hours % 12 === 0 ? 12 : hours % 12;
  return `${normalised}:${`${minutes}`.padStart(2, '0')} ${suffix}`;
};

export const minutesBetween = (start: string, end: string): number => {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return eh * 60 + em - (sh * 60 + sm);
};

export const daysBetweenInclusive = (start: string, end: string): number =>
  Math.round((parseISO(end).getTime() - parseISO(start).getTime()) / DAY_MS) + 1;

export const monthMatrix = (year: number, month: number): (string | null)[] => {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= total; day += 1) {
    cells.push(toISODate(new Date(year, month, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};
