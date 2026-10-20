'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CalendarRange, X } from 'lucide-react';
import type { LeaveRequest } from '@/types';
import { formatShortDate, monthMatrix, parseISO } from '@/lib/date';

interface Props {
  initialLeaves: LeaveRequest[];
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function LeaveManager({ initialLeaves }: Props) {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [tab, setTab] = useState<'pending' | 'calendar'>('pending');
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const pending = useMemo(() => leaves.filter((leave) => leave.status === 'pending'), [leaves]);
  const approved = useMemo(() => leaves.filter((leave) => leave.status === 'approved'), [leaves]);
  const cells = useMemo(() => monthMatrix(cursor.year, cursor.month), [cursor]);

  const approvedOnDate = (date: string) => approved.filter((leave) => leave.startDate <= date && leave.endDate >= date);

  const review = async (leave: LeaveRequest, decision: 'approve' | 'reject') => {
    setBusyId(leave.id);
    setFeedback(null);
    try {
      const response = await fetch('/api/leaves/review', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaveId: leave.id, decision }),
      });
      const payload = (await response.json()) as { leave?: LeaveRequest; error?: string };
      if (!response.ok || !payload.leave) {
        setFeedback({ kind: 'error', text: payload.error ?? 'The decision could not be saved.' });
        return;
      }
      setLeaves((current) => current.map((entry) => (entry.id === payload.leave?.id ? (payload.leave as LeaveRequest) : entry)));
      setFeedback({
        kind: 'success',
        text: `${leave.staffName}'s ${leave.type.toLowerCase()} was ${decision === 'approve' ? 'approved' : 'rejected'}. A notification email was queued through nodemailer.`,
      });
    } catch {
      setFeedback({ kind: 'error', text: 'Network error. Please try again.' });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Leave management</h1>
          <p>
            {pending.length} request{pending.length === 1 ? '' : 's'} awaiting a decision. {approved.length} approved
            this cycle.
          </p>
        </div>
        <div className="billing-toggle" role="tablist" aria-label="Leave views">
          <button type="button" role="tab" aria-selected={tab === 'pending'} data-active={tab === 'pending'} onClick={() => setTab('pending')}>
            Requests
          </button>
          <button type="button" role="tab" aria-selected={tab === 'calendar'} data-active={tab === 'calendar'} onClick={() => setTab('calendar')}>
            Approved calendar
          </button>
        </div>
      </div>

      {feedback ? (
        <p className={`notice notice-${feedback.kind}`} role="status" style={{ marginBottom: 14 }}>
          {feedback.text}
        </p>
      ) : null}

      {tab === 'pending' ? (
        <section className="card">
          <div className="card-header">
            <div>
              <h2 className="heading-4">Pending leave requests</h2>
              <p>Approve or reject, and the attendance calendar updates immediately.</p>
            </div>
            <span className="badge badge-late">{pending.length} pending</span>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Staff</th>
                  <th scope="col">Leave type</th>
                  <th scope="col">Dates</th>
                  <th scope="col">Days</th>
                  <th scope="col">Reason</th>
                  <th scope="col">Decision</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <div className="cell-person">
                        <span className="avatar-circle avatar-sm avatar-tone-2">
                          {leave.staffName.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                        </span>
                        <span>
                          <strong>{leave.staffName}</strong>
                          <small>{leave.department}</small>
                        </span>
                      </div>
                    </td>
                    <td>{leave.type}</td>
                    <td>
                      {formatShortDate(leave.startDate)}
                      <br />
                      <span className="tiny">to {formatShortDate(leave.endDate)}</span>
                    </td>
                    <td>{leave.days}</td>
                    <td style={{ maxWidth: 260 }}>{leave.reason}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => review(leave, 'approve')}
                          disabled={busyId === leave.id}
                        >
                          <Check size={13} aria-hidden="true" /> Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => review(leave, 'reject')}
                          disabled={busyId === leave.id}
                        >
                          <X size={13} aria-hidden="true" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!pending.length ? <p className="empty-state">No leave requests are waiting. The queue is clear.</p> : null}
          </div>
        </section>
      ) : (
        <motion.section
          className="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="card-header">
            <div>
              <h2 className="heading-4">Approved leave calendar</h2>
              <p>Days with approved leave are shaded, even where several staff overlap.</p>
            </div>
            <div className="row gap-8">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setCursor((c) => {
                  const next = new Date(c.year, c.month - 1, 1);
                  return { year: next.getFullYear(), month: next.getMonth() };
                })}
              >
                Previous
              </button>
              <span className="chip">
                <CalendarRange size={14} aria-hidden="true" />
                {monthNames[cursor.month]} {cursor.year}
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setCursor((c) => {
                  const next = new Date(c.year, c.month + 1, 1);
                  return { year: next.getFullYear(), month: next.getMonth() };
                })}
              >
                Next
              </button>
            </div>
          </div>

          <div className="calendar" role="grid" aria-label="Approved leave calendar">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="calendar-head" role="columnheader">
                {day}
              </div>
            ))}
            {cells.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="calendar-cell empty" aria-hidden="true" />;
              const dayLeaves = approvedOnDate(date);
              return (
                <div
                  key={date}
                  className={`calendar-cell ${dayLeaves.length ? 'leave' : ''}`}
                  role="gridcell"
                  title={
                    dayLeaves.length
                      ? dayLeaves.map((leave) => `${leave.staffName} (${leave.type})`).join(', ')
                      : `${date}: no approved leave`
                  }
                >
                  <span className="day-number">{parseISO(date).getDate()}</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>
                    {dayLeaves.length ? `${dayLeaves.length} on leave` : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="table-wrap" style={{ marginTop: 20 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Staff</th>
                  <th scope="col">Type</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Days</th>
                </tr>
              </thead>
              <tbody>
                {approved.map((leave) => (
                  <tr key={leave.id}>
                    <td>
                      <strong>{leave.staffName}</strong>
                      <br />
                      <span className="tiny">{leave.department}</span>
                    </td>
                    <td>{leave.type}</td>
                    <td>{formatShortDate(leave.startDate)}</td>
                    <td>{formatShortDate(leave.endDate)}</td>
                    <td>{leave.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!approved.length ? <p className="empty-state">No approved leave in this cycle yet.</p> : null}
          </div>
        </motion.section>
      )}
    </div>
  );
}
