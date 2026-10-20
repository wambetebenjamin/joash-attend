'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import type { LeaveRequest } from '@/types';
import { formatShortDate } from '@/lib/date';
import { useRecaptcha } from '@/components/system/useRecaptcha';
import RecaptchaFallback from '@/components/system/RecaptchaFallback';

interface Props {
  leaveTypes: string[];
  history: LeaveRequest[];
  staffName: string;
}

export default function LeaveRequestForm({ leaveTypes, history, staffName }: Props) {
  const { execute } = useRecaptcha();
  const [type, setType] = useState(leaveTypes[0] ?? 'Annual leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [items, setItems] = useState(history);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [challenge, setChallenge] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setChallenge(false);

    if (!startDate || !endDate) {
      setFeedback({ kind: 'error', text: 'Choose both a start date and an end date.' });
      return;
    }
    if (endDate < startDate) {
      setFeedback({ kind: 'error', text: 'The end date must fall on or after the start date.' });
      return;
    }
    if (reason.trim().length < 10) {
      setFeedback({ kind: 'error', text: 'Give at least ten characters of reason for the record.' });
      return;
    }

    setBusy(true);
    const token = await execute('leave_request');
    try {
      const response = await fetch('/api/leaves/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, startDate, endDate, reason, recaptchaToken: token }),
      });
      const payload = (await response.json()) as {
        leave?: LeaveRequest;
        error?: string;
        challengeRequired?: boolean;
        captcha?: { simulated: boolean; score: number };
      };
      if (!response.ok || !payload.leave) {
        setFeedback({ kind: 'error', text: payload.error ?? 'The request could not be submitted.' });
        setChallenge(Boolean(payload.challengeRequired));
        return;
      }
      setItems((current) => [payload.leave as LeaveRequest, ...current]);
      setFeedback({
        kind: 'success',
        text: `Request submitted for ${payload.leave.days} day(s). Your supervisor has been notified.${
          payload.captcha?.simulated ? ' reCAPTCHA is simulated in this demo environment.' : ''
        }`,
      });
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch {
      setFeedback({ kind: 'error', text: 'Network error. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dash-grid" style={{ marginTop: 0 }}>
      <section className="card" id="request-leave" aria-label="Request leave">
        <div className="card-header">
          <div>
            <h2 className="heading-4">Request leave</h2>
            <p>Submissions are verified with reCAPTCHA v3 and sent to your approver.</p>
          </div>
        </div>

        <form className="stack gap-16" onSubmit={submit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="leave-type">Leave type</label>
              <select id="leave-type" value={type} onChange={(event) => setType(event.target.value)}>
                {leaveTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="leave-start">Start date</label>
              <input id="leave-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="leave-end">End date</label>
              <input id="leave-end" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="leave-reason">Reason</label>
              <input
                id="leave-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Brief reason for the record"
                required
              />
            </div>
          </div>
          <div className="row between wrap gap-12">
            <p className="tiny">Approvals usually land within one working day.</p>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              <Send size={14} aria-hidden="true" />
              {busy ? 'Submitting' : 'Submit request'}
            </button>
          </div>
          {feedback ? (
            <p className={`notice notice-${feedback.kind}`} role="status">
              {feedback.text}
            </p>
          ) : null}
          <RecaptchaFallback visible={challenge} onDismiss={() => setChallenge(false)} />
          <p className="tiny">Protected by reCAPTCHA v3. Google privacy and terms apply.</p>
        </form>
      </section>

      <section className="card" id="leave-history" aria-label="Leave history">
        <div className="card-header">
          <div>
            <h2 className="heading-4">My leave history</h2>
            <p>{items.length} request(s) for {staffName}.</p>
          </div>
        </div>
        {items.length ? (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
            {items.slice(0, 8).map((leave) => (
              <motion.div
                key={leave.id}
                className="alert-item"
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
              >
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
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="empty-state">You have not requested leave yet.</p>
        )}
      </section>
    </div>
  );
}
