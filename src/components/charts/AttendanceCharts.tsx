'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartTooltip from './ChartTooltip';
import { chartColors, statusColor } from '@/lib/theme';

interface DailyPoint {
  label: string;
  rate: number;
  present: number;
  absent: number;
}

interface MonthlyPoint {
  month: string;
  rate: number;
  present: number;
  late: number;
  absent: number;
}

interface DepartmentPoint {
  name: string;
  present: number;
  late: number;
  absent: number;
}

interface WeekPoint {
  day: string;
  [department: string]: string | number;
}

const axisStyle = { fontSize: 11, fill: chartColors.muted };

export function DailyAttendanceBar({ data }: { data: DailyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barCategoryGap="22%">
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
        <Tooltip content={<ChartTooltip suffix="%" />} cursor={{ fill: 'rgba(84,111,255,0.06)' }} />
        <Bar
          dataKey="rate"
          name="Attendance rate"
          fill={chartColors.primary}
          radius={[5, 5, 0, 0]}
          isAnimationActive
          animationDuration={900}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyTrendLine({ data }: { data: MonthlyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[60, 100]} unit="%" />
        <Tooltip content={<ChartTooltip suffix="%" />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: chartColors.ink500 }} />
        <Line
          type="monotone"
          dataKey="rate"
          name="Attendance rate"
          stroke={chartColors.primary}
          strokeWidth={2.4}
          dot={{ r: 3, fill: chartColors.primary, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
          isAnimationActive
          animationDuration={1100}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TodayStatusPie({ data }: { data: DepartmentPoint[] }) {
  const totals = data.reduce(
    (acc, entry) => ({
      present: acc.present + entry.present,
      late: acc.late + entry.late,
      absent: acc.absent + entry.absent,
    }),
    { present: 0, late: 0, absent: 0 },
  );
  const pieData = [
    { name: 'Present', value: totals.present, key: 'present' },
    { name: 'Late', value: totals.late, key: 'late' },
    { name: 'Absent', value: totals.absent, key: 'absent' },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<ChartTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: chartColors.ink500 }} />
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          innerRadius="48%"
          outerRadius="76%"
          paddingAngle={2}
          isAnimationActive
          animationDuration={900}
          stroke="#fff"
          strokeWidth={2}
        >
          {pieData.map((entry) => (
            <Cell key={entry.key} fill={statusColor[entry.key]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function DepartmentWeekArea({ data, departments }: { data: WeekPoint[]; departments: string[] }) {
  const palette = [chartColors.primary, chartColors.sky, chartColors.warning];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <defs>
          {departments.map((department, index) => (
            <linearGradient id={`dept-${index}`} key={department} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette[index % palette.length]} stopOpacity={0.32} />
              <stop offset="100%" stopColor={palette[index % palette.length]} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="day" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} domain={[60, 100]} unit="%" />
        <Tooltip content={<ChartTooltip suffix="%" />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: chartColors.ink500 }} />
        {departments.map((department, index) => (
          <Area
            key={department}
            type="monotone"
            dataKey={department}
            stroke={palette[index % palette.length]}
            fill={`url(#dept-${index})`}
            strokeWidth={2}
            isAnimationActive
            animationDuration={1000 + index * 120}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ReportBar({
  data,
  xKey,
  series,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  series: { key: string; name: string; color: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(84,111,255,0.06)' }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: chartColors.ink500 }} />
        {series.map((entry) => (
          <Bar
            key={entry.key}
            dataKey={entry.key}
            name={entry.name}
            fill={entry.color}
            radius={[4, 4, 0, 0]}
            isAnimationActive
            animationDuration={800}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
