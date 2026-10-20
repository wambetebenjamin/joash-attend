import { CalendarDays, Clock3, TrendingUp, UserX } from 'lucide-react';
import AttendanceCalendar from '@/components/dashboard/AttendanceCalendar';
import LeaveRequestForm from '@/components/dashboard/LeaveRequestForm';
import { getSessionUser } from '@/lib/guard';
import { getLeaves, getSettings, getStaffDirectory } from '@/lib/repository';
import { getPersonalSummary, getStaffAttendanceHistory } from '@/lib/mock';
import { addDays, toISODate, todayISO } from '@/lib/date';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'My attendance' };

export default async function MemberDashboardPage() {
  const user = await getSessionUser();
  const directory = await getStaffDirectory();
  const staffId = user?.staffId ?? 'staff-001';
  const member = directory.find((entry) => entry.id === staffId) ?? directory[0];
  const settings = await getSettings();
  const summary = getPersonalSummary(member.id);
  const from = toISODate(addDays(todayISO(), -35));
  const records = getStaffAttendanceHistory(member.id, from, todayISO());
  const leaves = (await getLeaves()).filter((leave) => leave.staffId === member.id);
  const now = new Date();

  const cards = [
    { label: 'Days present', value: summary.present, icon: CalendarDays, bg: 'var(--color-success-soft)', fg: 'var(--color-success-ink)' },
    { label: 'Days late', value: summary.late, icon: Clock3, bg: 'var(--color-warning-soft)', fg: 'var(--color-warning-ink)' },
    { label: 'Days absent', value: summary.absent, icon: UserX, bg: 'var(--color-danger-soft)', fg: 'var(--color-danger-ink)' },
    { label: 'Attendance rate', value: `${summary.rate}%`, icon: TrendingUp, bg: 'var(--color-primary-100)', fg: 'var(--color-primary-700)' },
  ];

  return (
    <div className="stack gap-16">
      <div className="page-head">
        <div>
          <h1>Hello {member.name.split(' ')[0]}</h1>
          <p>
            {member.role} · {member.department} · {member.staffCode}. Working hours {settings.workStart} to{' '}
            {settings.workEnd}, with a {settings.graceMinutes} minute grace period.
          </p>
        </div>
        <span className="chip">
          <span className="dot live-dot" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
          Record up to date
        </span>
      </div>

      <div className="kpi-grid">
        {cards.map((card) => (
          <article className="kpi-card" key={card.label}>
            <div className="kpi-top">
              <span className="kpi-label">{card.label}</span>
              <span className="kpi-icon" style={{ background: card.bg, color: card.fg }}>
                <card.icon size={17} aria-hidden="true" />
              </span>
            </div>
            <p className="kpi-value">{card.value}</p>
            <p className="kpi-meta">This month to date</p>
          </article>
        ))}
      </div>

      <section className="card" aria-label="My attendance calendar">
        <div className="card-header">
          <div>
            <h2 className="heading-4">My attendance calendar</h2>
            <p>Last 35 days. Weekends are not counted in your rate.</p>
          </div>
          <span className="chip">{summary.days} working days tracked</span>
        </div>
        <AttendanceCalendar records={records} initialYear={now.getFullYear()} initialMonth={now.getMonth()} />
      </section>

      <LeaveRequestForm leaveTypes={settings.leaveTypes} history={leaves} staffName={member.name} />

      <section className="card" aria-label="Recent clock-ins">
        <div className="card-header">
          <div>
            <h2 className="heading-4">Recent clock-ins</h2>
            <p>Every verification on your record, newest first.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Clock in</th>
                <th scope="col">Clock out</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(-10).reverse().map((record) => (
                <tr key={record.id}>
                  <td>
                    <strong>{record.date}</strong>
                  </td>
                  <td>{record.clockIn ?? 'Not recorded'}</td>
                  <td>{record.clockOut ?? 'Not recorded'}</td>
                  <td>
                    <span className={`badge badge-${record.status}`}>{record.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
