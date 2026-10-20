export const chartColors = {
  primary: '#546fff',
  primarySoft: '#bac8ff',
  ink: '#141522',
  ink500: '#54577a',
  muted: '#8e92bc',
  success: '#2e8b57',
  successSoft: '#97c5ab',
  danger: '#ff4d5e',
  dangerSoft: '#ffb3ba',
  warning: '#ffb054',
  warningSoft: '#ffd8a3',
  sky: '#54a6ff',
  grid: '#ebedf7',
};

export const statusColor: Record<string, string> = {
  present: chartColors.success,
  late: chartColors.warning,
  absent: chartColors.danger,
  leave: chartColors.muted,
};

export const statusSoft: Record<string, string> = {
  present: '#d5e8dd',
  late: '#fff3dd',
  absent: '#ffdfe2',
  leave: '#ebedf7',
};

export const statusClasses: Record<string, string> = {
  present: 'badge badge-present',
  late: 'badge badge-late',
  absent: 'badge badge-absent',
  leave: 'badge badge-leave',
};
