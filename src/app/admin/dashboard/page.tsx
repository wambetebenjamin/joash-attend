import Link from 'next/link';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import KpiCards from '@/components/dashboard/KpiCards';
import LiveFeed from '@/components/dashboard/LiveFeed';
import AlertsPanel from '@/components/dashboard/AlertsPanel';
import DepartmentTable from '@/components/dashboard/DepartmentTable';
import ExportButtons from '@/components/dashboard/ExportButtons';
import {
  DailyAttendanceBar,
  DepartmentWeekArea,
  MonthlyTrendLine,
  TodayStatusPie,
} from '@/components/charts/AttendanceCharts';
import {
  getAbsenceAlerts,
  getAttendanceForDate,
  getDailyAttendanceRates,
  getDepartmentBreakdown,
  getDepartmentWeek,
  getLiveEvents,
  getMonthlyTrend,
  getStaff,
  getTodaySummary,
} from '@/lib/mock';
import { formatShortDate, formatTime, todayISO } from '@/lib/date';
import { getSessionUser } from '@/lib/guard';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Attendance overview' };

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  const firstName = (user?.name ?? 'Joash').split(' ')[0];
  const summary = getTodaySummary();
  const daily = getDailyAttendanceRates(30);
  const monthly = getMonthlyTrend();
  const departments = getDepartmentBreakdown();
  const week = getDepartmentWeek();
  const alerts = getAbsenceAlerts();
  const live = getLiveEvents(0);
  const todayRecords = getAttendanceForDate(todayISO());
  const codeById = new Map(getStaff().map((member) => [member.id, member.staffCode]));
  const today = new Date();

  const csvHeaders = ['Staff code', 'Name', 'Department', 'Date', 'Clock in', 'Clock out', 'Status'];
  const csvRows = todayRecords.map((record) => [
    codeById.get(record.staffId) ?? record.staffId,
    record.staffName,
    record.department,
    record.date,
    record.clockIn ?? '',
    record.clockOut ?? '',
    record.status,
  ]);

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1>Good day, {firstName}</h1>
          <p>
            {today.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.
            {' '}
            {summary.present + summary.late} of {summary.total} staff have clocked in.
          </p>
        </div>
        <div className="row gap-8 wrap">
          <span className="chip">
            <CalendarDays size={14} aria-hidden="true" />
            Today
          </span>
          <Link href="/admin/reports" className="btn btn-ghost btn-sm">
            Build a report <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
          <ExportButtons
            targetId="dashboard-report-surface"
            filenameBase="joash-attend-daily-report"
            title="Joash Attend daily attendance report"
            subtitle={`${summary.date} · ${summary.present} present, ${summary.late} late, ${summary.absent} absent`}
            csvHeaders={csvHeaders}
            csvRows={csvRows}
          />
        </div>
      </div>

      <div id="dashboard-report-surface" className="stack gap-16">
        <KpiCards
          present={summary.present}
          absent={summary.absent}
          late={summary.late}
          monthRate={summary.monthRate}
          total={summary.total}
          todayRate={summary.attendanceRate}
        />

        <div className="dash-grid">
          <div className="dash-col">
            <section className="card" aria-label="Daily attendance rate over 30 days">
              <div className="card-header">
                <div>
                  <h2 className="heading-4">Daily attendance rate</h2>
                  <p>Last 30 calendar days, working days only.</p>
                </div>
                <span className="badge badge-info">{daily.length} working days</span>
              </div>
              <div className="chart-frame">
                <DailyAttendanceBar data={daily} />
              </div>
            </section>

            <section className="card" aria-label="Monthly attendance trend">
              <div className="card-header">
                <div>
                  <h2 className="heading-4">Monthly attendance trend</h2>
                  <p>Rolling twelve months across the whole organisation.</p>
                </div>
                <span className="badge badge-neutral">{monthly[monthly.length - 1]?.rate ?? 0}% this month</span>
              </div>
              <div className="chart-frame">
                <MonthlyTrendLine data={monthly} />
              </div>
            </section>

            <section className="card" aria-label="Department attendance this week">
              <div className="card-header">
                <div>
                  <h2 className="heading-4">Department comparison</h2>
                  <p>Attendance rate per department across this week.</p>
                </div>
              </div>
              <div className="chart-frame">
                <DepartmentWeekArea
                  data={week}
                  departments={['Academics', 'Administration', 'Operations']}
                />
              </div>
            </section>
          </div>

          <div className="dash-col">
            <LiveFeed initialEvents={live.events} initialCursor={live.cursor} />

            <section className="card" aria-label="Today status split">
              <div className="card-header">
                <div>
                  <h2 className="heading-4">Today at a glance</h2>
                  <p>Present, late and absent split.</p>
                </div>
              </div>
              <div className="chart-frame short">
                <TodayStatusPie data={departments} />
              </div>
              <div className="chart-legend">
                <span>
                  <i className="legend-swatch" style={{ background: 'var(--color-success)' }} aria-hidden="true" />
                  Present {summary.present}
                </span>
                <span>
                  <i className="legend-swatch" style={{ background: 'var(--color-warning)' }} aria-hidden="true" />
                  Late {summary.late}
                </span>
                <span>
                  <i className="legend-swatch" style={{ background: 'var(--color-danger)' }} aria-hidden="true" />
                  Absent {summary.absent}
                </span>
                <span>
                  <i className="legend-swatch" style={{ background: 'var(--color-muted)' }} aria-hidden="true" />
                  Leave {summary.leave}
                </span>
              </div>
            </section>

            <AlertsPanel alerts={alerts} />
          </div>
        </div>

        <section className="card" aria-label="Department breakdown">
          <div className="card-header">
            <div>
              <h2 className="heading-4">Department breakdown</h2>
              <p>Today, by department. Attendance counts present and late arrivals.</p>
            </div>
            <span className="chip">{formatShortDate(summary.date)}</span>
          </div>
          <DepartmentTable rows={departments} />
        </section>

        <section className="card" aria-label="Today's clock-ins">
          <div className="card-header">
            <div>
              <h2 className="heading-4">Today&apos;s clock-in register</h2>
              <p>Every verification pulled from the three devices.</p>
            </div>
            <span className="badge badge-neutral">{todayRecords.length} records</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Staff</th>
                  <th scope="col">Department</th>
                  <th scope="col">Clock in</th>
                  <th scope="col">Clock out</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayRecords.slice(0, 12).map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.staffName}</strong>
                    </td>
                    <td>{record.department}</td>
                    <td>{formatTime(record.clockIn)}</td>
                    <td>{formatTime(record.clockOut)}</td>
                    <td>
                      <span className={`badge badge-${record.status}`}>{record.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tiny" style={{ marginTop: 10 }}>
            Showing the first 12 of {todayRecords.length} records. Download the CSV for the full register.
          </p>
        </section>
      </div>
    </div>
  );
}
