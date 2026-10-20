'use client';

import { motion } from 'framer-motion';
import { Activity, ArrowDownLeft, ArrowUpRight, Info } from 'lucide-react';
import {
  DailyAttendanceBar,
  DepartmentWeekArea,
  MonthlyTrendLine,
  TodayStatusPie,
} from '@/components/charts/AttendanceCharts';
import { formatTime } from '@/lib/date';

interface Props {
  summary: {
    present: number;
    absent: number;
    late: number;
    leave: number;
    total: number;
    attendanceRate: number;
    monthRate: number;
  };
  daily: { label: string; rate: number; present: number; absent: number }[];
  monthly: { month: string; rate: number; present: number; late: number; absent: number }[];
  departments: {
    id: string;
    name: string;
    head: string;
    present: number;
    absent: number;
    late: number;
    leave: number;
    total: number;
    rate: number;
  }[];
  week: { day: string; [key: string]: string | number }[];
  feed: { id: string; staffName: string; department: string; time: string; type: 'clock-in' | 'clock-out'; status: string }[];
}

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function DemoPreview({ summary, daily, monthly, departments, week, feed }: Props) {
  const kpis = [
    { label: 'Present today', value: summary.present, meta: `${summary.attendanceRate}% of those expected` },
    { label: 'Absent today', value: summary.absent, meta: `Out of ${summary.total} staff` },
    { label: 'Late today', value: summary.late, meta: 'Beyond the grace period' },
    { label: 'Attendance this month', value: `${summary.monthRate}%`, meta: 'Working days only' },
  ];

  return (
    <motion.div
      className="stack gap-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
    >
      <motion.div className="demo-ribbon" variants={fade} role="note">
        <Info size={15} aria-hidden="true" />
        Demo data. Joash Attend Demo Organisation, 80 staff, 3 departments. Nothing here is saved and no login is
        required.
      </motion.div>

      <motion.div className="kpi-grid" variants={fade}>
        {kpis.map((kpi) => (
          <article className="kpi-card" key={kpi.label}>
            <p className="kpi-label">{kpi.label}</p>
            <p className="kpi-value">{kpi.value}</p>
            <p className="kpi-meta">{kpi.meta}</p>
          </article>
        ))}
      </motion.div>

      <div className="dash-grid">
        <div className="dash-col">
          <motion.section className="card" variants={fade} aria-label="Demo daily attendance rate">
            <div className="card-header">
              <div>
                <h3 className="heading-4">Daily attendance rate</h3>
                <p>Last 30 days, working days only.</p>
              </div>
              <span className="badge badge-info">{daily.length} days</span>
            </div>
            <div className="chart-frame">
              <DailyAttendanceBar data={daily} />
            </div>
          </motion.section>

          <motion.section className="card" variants={fade} aria-label="Demo monthly trend">
            <div className="card-header">
              <div>
                <h3 className="heading-4">Monthly attendance trend</h3>
                <p>Twelve month rolling view.</p>
              </div>
            </div>
            <div className="chart-frame">
              <MonthlyTrendLine data={monthly} />
            </div>
          </motion.section>

          <motion.section className="card" variants={fade} aria-label="Demo department comparison">
            <div className="card-header">
              <div>
                <h3 className="heading-4">Department comparison</h3>
                <p>This week, by department.</p>
              </div>
            </div>
            <div className="chart-frame">
              <DepartmentWeekArea data={week} departments={['Academics', 'Administration', 'Operations']} />
            </div>
          </motion.section>
        </div>

        <div className="dash-col">
          <motion.section className="card" variants={fade} aria-label="Demo live feed">
            <div className="card-header">
              <div>
                <h3 className="heading-4">Live clock-in feed</h3>
                <p>Read only sample of today&apos;s device events.</p>
              </div>
              <span className="chip">
                <Activity size={13} aria-hidden="true" /> Demo
              </span>
            </div>
            <div className="feed">
              {feed.map((event) => (
                <div className="feed-item" key={event.id}>
                  <span
                    className="icon-tile"
                    style={{
                      marginBottom: 0,
                      width: 32,
                      height: 32,
                      background: event.type === 'clock-in' ? 'var(--color-success-soft)' : 'var(--color-canvas-muted)',
                      color: event.type === 'clock-in' ? 'var(--color-success-ink)' : 'var(--color-ink-500)',
                    }}
                  >
                    {event.type === 'clock-in' ? (
                      <ArrowDownLeft size={14} aria-hidden="true" />
                    ) : (
                      <ArrowUpRight size={14} aria-hidden="true" />
                    )}
                  </span>
                  <div className="feed-main">
                    <strong>{event.staffName}</strong>
                    <small>{event.department}</small>
                  </div>
                  <span className="feed-time">{formatTime(event.time)}</span>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section className="card" variants={fade} aria-label="Demo status split">
            <div className="card-header">
              <div>
                <h3 className="heading-4">Today at a glance</h3>
                <p>Present, late and absent.</p>
              </div>
            </div>
            <div className="chart-frame short">
              <TodayStatusPie data={departments} />
            </div>
          </motion.section>
        </div>
      </div>

      <motion.section className="card" variants={fade} aria-label="Demo department breakdown">
        <div className="card-header">
          <div>
            <h3 className="heading-4">Department breakdown</h3>
            <p>Every department, today. Read only in this demo.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Department</th>
                <th scope="col">Head</th>
                <th scope="col">Present</th>
                <th scope="col">Late</th>
                <th scope="col">Absent</th>
                <th scope="col">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.name}</strong>
                    <br />
                    <span className="tiny">{row.total} enrolled</span>
                  </td>
                  <td>{row.head}</td>
                  <td>
                    <span className="badge badge-present">{row.present}</span>
                  </td>
                  <td>
                    <span className="badge badge-late">{row.late}</span>
                  </td>
                  <td>
                    <span className="badge badge-absent">{row.absent}</span>
                  </td>
                  <td>
                    <strong>{row.rate}%</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </motion.div>
  );
}
