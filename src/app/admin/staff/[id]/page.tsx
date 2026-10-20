import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Mail, MapPin, Phone } from 'lucide-react';
import AttendanceCalendar from '@/components/dashboard/AttendanceCalendar';
import PdfDownloadButton from '@/components/dashboard/PdfDownloadButton';
import { getStaffAttendanceHistory } from '@/lib/mock';
import { getLeaves, getStaffDirectory } from '@/lib/repository';
import { addDays, formatShortDate, formatTime, toISODate, todayISO } from '@/lib/date';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const directory = await getStaffDirectory();
  const member = directory.find((entry) => entry.id === id);
  return { title: member ? `${member.name} profile` : 'Staff profile' };
}

export default async function StaffProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const directory = await getStaffDirectory();
  const member = directory.find((entry) => entry.id === id);
  if (!member) notFound();

  const from = toISODate(addDays(todayISO(), -45));
  const records = getStaffAttendanceHistory(member.id, from, todayISO());
  const leaves = (await getLeaves()).filter((leave) => leave.staffId === member.id);
  const present = records.filter((record) => record.status === 'present').length;
  const late = records.filter((record) => record.status === 'late').length;
  const absent = records.filter((record) => record.status === 'absent').length;
  const leaveDays = records.filter((record) => record.status === 'leave').length;
  const counted = records.length - leaveDays;
  const rate = counted ? Math.round(((present + late) / counted) * 1000) / 10 : 0;
  const now = new Date();

  return (
    <div className="stack gap-16" id="staff-profile-report">
      <div className="page-head">
        <div>
          <Link href="/admin/staff" className="row gap-8 tiny" style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>
            <ArrowLeft size={14} aria-hidden="true" /> Back to directory
          </Link>
          <h1 style={{ marginTop: 8 }}>{member.name}</h1>
          <p>
            {member.role} · {member.department} · {member.staffCode}
          </p>
        </div>
        <div className="row gap-8 wrap">
          <span className={member.status === 'active' ? 'badge badge-present' : 'badge badge-leave'}>
            {member.status}
          </span>
          <PdfDownloadButton
            targetId="staff-profile-report"
            filename={`joash-attend-${member.staffCode}-attendance.pdf`}
            title={`Attendance report: ${member.name}`}
            subtitle={`${member.staffCode} · ${member.department} · ${from} to ${todayISO()}`}
          />
        </div>
      </div>

      <div className="dash-grid" style={{ marginTop: 0 }}>
        <div className="dash-col">
          <section className="card">
            <div className="row gap-16 wrap">
              <span className={`avatar-circle avatar-lg avatar-tone-${member.avatarTone}`}>
                {member.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
              </span>
              <div style={{ minWidth: 200 }}>
                <p className="tiny" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                  Staff profile
                </p>
                <h2 className="heading-4" style={{ marginTop: 4 }}>{member.name}</h2>
                <p className="tiny">Joined {formatShortDate(member.joinedAt)}</p>
              </div>
              <div className="grow" />
              <div className="stack gap-8" style={{ fontSize: '0.84rem', color: 'var(--color-ink-500)' }}>
                <span className="row gap-8">
                  <Mail size={14} aria-hidden="true" /> {member.email}
                </span>
                <span className="row gap-8">
                  <Phone size={14} aria-hidden="true" /> {member.phone}
                </span>
                <span className="row gap-8">
                  <MapPin size={14} aria-hidden="true" /> {member.location}
                </span>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Attendance calendar</h2>
                <p>Last 45 days. Each day carries the device status, including leave.</p>
              </div>
              <span className="chip">
                <CalendarDays size={14} aria-hidden="true" /> {rate}% this period
              </span>
            </div>
            <AttendanceCalendar records={records} initialYear={now.getFullYear()} initialMonth={now.getMonth()} />
          </section>

          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Clock-in and clock-out log</h2>
                <p>Most recent fourteen working days.</p>
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
                  {records.slice(-14).reverse().map((record) => (
                    <tr key={record.id}>
                      <td>
                        <strong>{formatShortDate(record.date)}</strong>
                      </td>
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
          </section>
        </div>

        <div className="dash-col">
          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Monthly summary</h2>
                <p>{now.toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })} to date.</p>
              </div>
            </div>
            <div className="stack gap-12">
              {[
                { label: 'Days present', value: present, tone: 'badge-present' },
                { label: 'Days late', value: late, tone: 'badge-late' },
                { label: 'Days absent', value: absent, tone: 'badge-absent' },
                { label: 'Leave days', value: leaveDays, tone: 'badge-leave' },
              ].map((row) => (
                <div key={row.label} className="row between">
                  <span className="muted" style={{ fontSize: '0.86rem' }}>
                    {row.label}
                  </span>
                  <span className={`badge ${row.tone}`}>{row.value}</span>
                </div>
              ))}
              <hr className="divider" style={{ margin: '6px 0' }} />
              <div className="row between">
                <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>Attendance rate</span>
                <strong style={{ fontSize: '1.2rem' }}>{rate}%</strong>
              </div>
              <div className="row between">
                <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>This month overall</span>
                <strong>{member.attendanceRate}%</strong>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Leave history</h2>
                <p>Requests filed through the staff portal.</p>
              </div>
            </div>
            {leaves.length ? (
              <div className="stack gap-12">
                {leaves.map((leave) => (
                  <div key={leave.id} className="alert-item" style={{ paddingTop: 0 }}>
                    <div className="alert-body">
                      <strong>{leave.type}</strong>
                      <small>
                        {formatShortDate(leave.startDate)} to {formatShortDate(leave.endDate)} · {leave.days} day(s)
                      </small>
                      <small>{leave.reason}</small>
                    </div>
                    <span
                      className={
                        leave.status === 'approved'
                          ? 'badge badge-present'
                          : leave.status === 'rejected'
                            ? 'badge badge-absent'
                            : 'badge badge-late'
                      }
                    >
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state" style={{ padding: '18px 0' }}>No leave requests on record.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
