'use client';

import { useState } from 'react';
import { Download, FileText, Play } from 'lucide-react';
import { ReportBar } from '@/components/charts/AttendanceCharts';
import { exportCsv } from '@/lib/export';
import type { Staff } from '@/types';
import { formatShortDate } from '@/lib/date';

interface ReportPayload {
  from: string;
  to: string;
  type: string;
  department: string;
  staff: string | null;
  summary: { present: number; late: number; absent: number; leave: number; total: number; rate: number };
  departments: { department: string; present: number; late: number; absent: number; leave: number; total: number; rate: number }[];
  daily: { date: string; present: number; late: number; absent: number }[];
  rows: { id: string; staffName: string; department: string; date: string; clockIn: string | null; clockOut: string | null; status: string }[];
  generatedAt: string;
}

const reportTypes = [
  { value: 'daily', label: 'Daily Summary' },
  { value: 'monthly', label: 'Monthly Summary' },
  { value: 'absenteeism', label: 'Absenteeism Report' },
  { value: 'late', label: 'Late Arrivals Report' },
  { value: 'individual', label: 'Individual Staff Report' },
];

interface Props {
  staff: Staff[];
  departments: string[];
  defaultFrom: string;
  defaultTo: string;
}

export default function ReportBuilder({ staff, departments, defaultFrom, defaultTo }: Props) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [department, setDepartment] = useState('');
  const [type, setType] = useState('daily');
  const [staffId, setStaffId] = useState(staff[0]?.id ?? '');
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setBusy(true);
    setError('');
    try {
      const params = new URLSearchParams({ from, to, type });
      if (department) params.set('department', department);
      if (type === 'individual' && staffId) params.set('staffId', staffId);
      const response = await fetch(`/api/attendance/report?${params.toString()}`, { cache: 'no-store' });
      const payload = (await response.json()) as ReportPayload & { error?: string };
      if (!response.ok) {
        setError(payload.error ?? 'The report could not be generated.');
        return;
      }
      setReport(payload);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const rowsForCsv = () => {
    if (!report) return [];
    return report.rows.map((row) => [
      row.date,
      row.staffName,
      row.department,
      row.clockIn ?? '',
      row.clockOut ?? '',
      row.status,
    ]);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Reports</h1>
          <p>Choose a window, a department and a report type, then export for payroll or the board.</p>
        </div>
      </div>

      <section className="card">
        <div className="form-grid report-filters">
          <div className="field">
            <label htmlFor="report-from">From</label>
            <input id="report-from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="report-to">To</label>
            <input id="report-to" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="report-department">Department</label>
            <select id="report-department" value={department} onChange={(event) => setDepartment(event.target.value)}>
              <option value="">All departments</option>
              {departments.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="report-type">Report type</label>
            <select id="report-type" value={type} onChange={(event) => setType(event.target.value)}>
              {reportTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {type === 'individual' ? (
            <div className="field">
              <label htmlFor="report-staff">Staff member</label>
              <select id="report-staff" value={staffId} onChange={(event) => setStaffId(event.target.value)}>
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.staffCode})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="field">
              <label>&nbsp;</label>
              <button type="button" className="btn btn-primary" onClick={generate} disabled={busy}>
                <Play size={14} aria-hidden="true" />
                {busy ? 'Generating' : 'Generate Report'}
              </button>
            </div>
          )}
        </div>
        {type === 'individual' ? (
          <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={generate} disabled={busy}>
            <Play size={14} aria-hidden="true" />
            {busy ? 'Generating' : 'Generate Report'}
          </button>
        ) : null}
        {error ? (
          <p className="notice notice-error" role="alert" style={{ marginTop: 14 }}>
            {error}
          </p>
        ) : null}
      </section>

      {report ? (
        <div id="report-output" className="stack gap-16" style={{ marginTop: 16 }}>
          <div className="row between wrap gap-12">
            <div>
              <h2 className="heading-3">{reportTypes.find((option) => option.value === report.type)?.label}</h2>
              <p className="tiny">
                {formatShortDate(report.from)} to {formatShortDate(report.to)} · {report.department}
                {report.staff ? ` · ${report.staff}` : ''}
              </p>
            </div>
            <div className="row gap-8 wrap">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={async () => {
                  const { exportElementPdf } = await import('@/lib/export');
                  await exportElementPdf(
                    document.getElementById('report-output'),
                    `joash-attend-report-${report.from}-to-${report.to}.pdf`,
                    `${reportTypes.find((option) => option.value === report.type)?.label ?? 'Attendance report'}`,
                    `${report.from} to ${report.to} · ${report.department}`,
                  );
                }}
              >
                <FileText size={14} aria-hidden="true" /> Download PDF
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  exportCsv(
                    `joash-attend-report-${report.from}-to-${report.to}.csv`,
                    ['Date', 'Staff', 'Department', 'Clock in', 'Clock out', 'Status'],
                    rowsForCsv(),
                  )
                }
              >
                <Download size={14} aria-hidden="true" /> Download CSV
              </button>
            </div>
          </div>

          <div className="kpi-grid">
            {[
              { label: 'Present', value: report.summary.present },
              { label: 'Late', value: report.summary.late },
              { label: 'Absent', value: report.summary.absent },
              { label: 'Attendance rate', value: `${report.summary.rate}%` },
            ].map((item) => (
              <article className="kpi-card" key={item.label}>
                <p className="kpi-label">{item.label}</p>
                <p className="kpi-value">{item.value}</p>
                <p className="kpi-meta">{report.summary.total} records in window</p>
              </article>
            ))}
          </div>

          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Daily composition</h2>
                <p>Present, late and absent records per working day.</p>
              </div>
            </div>
            <div className="chart-frame">
              <ReportBar
                data={report.daily.map((day) => ({
                  label: day.date.slice(5),
                  present: day.present,
                  late: day.late,
                  absent: day.absent,
                }))}
                xKey="label"
                series={[
                  { key: 'present', name: 'Present', color: '#2e8b57' },
                  { key: 'late', name: 'Late', color: '#ffb054' },
                  { key: 'absent', name: 'Absent', color: '#ff4d5e' },
                ]}
              />
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Department summary</h2>
                <p>Counts across the selected window.</p>
              </div>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Department</th>
                    <th scope="col">Present</th>
                    <th scope="col">Late</th>
                    <th scope="col">Absent</th>
                    <th scope="col">Leave</th>
                    <th scope="col">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {report.departments.map((row) => (
                    <tr key={row.department}>
                      <td>
                        <strong>{row.department}</strong>
                      </td>
                      <td>{row.present}</td>
                      <td>{row.late}</td>
                      <td>{row.absent}</td>
                      <td>{row.leave}</td>
                      <td>
                        <strong>{row.rate}%</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Record preview</h2>
                <p>First 40 records in the window. The CSV contains the full set.</p>
              </div>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Staff</th>
                    <th scope="col">Department</th>
                    <th scope="col">Clock in</th>
                    <th scope="col">Clock out</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.slice(0, 40).map((row) => (
                    <tr key={row.id}>
                      <td>{formatShortDate(row.date)}</td>
                      <td>
                        <strong>{row.staffName}</strong>
                      </td>
                      <td>{row.department}</td>
                      <td>{row.clockIn ?? 'Not recorded'}</td>
                      <td>{row.clockOut ?? 'Not recorded'}</td>
                      <td>
                        <span className={`badge badge-${row.status}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <p className="tiny">Generated {new Date(report.generatedAt).toLocaleString('en-KE')} from mock attendance data.</p>
        </div>
      ) : (
        <section className="card" style={{ marginTop: 16 }}>
          <div className="empty-state">
            <FileText size={34} aria-hidden="true" />
            <p>Pick your filters and generate a report to see the preview and downloads here.</p>
          </div>
        </section>
      )}
    </div>
  );
}
