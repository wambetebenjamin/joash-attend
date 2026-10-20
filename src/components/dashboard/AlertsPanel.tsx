'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MailCheck, Send } from 'lucide-react';
import { formatShortDate } from '@/lib/date';

interface Alert {
  staffId: string;
  name: string;
  department: string;
  lastSeen: string;
  consecutiveDays: number;
  contact: string;
}

export default function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  const [sent, setSent] = useState<Record<string, 'sending' | 'sent' | 'error'>>({});

  const sendReminder = async (alert: Alert) => {
    setSent((current) => ({ ...current, [alert.staffId]: 'sending' }));
    try {
      const response = await fetch('/api/attendance/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId: alert.staffId, consecutiveDays: alert.consecutiveDays }),
      });
      setSent((current) => ({ ...current, [alert.staffId]: response.ok ? 'sent' : 'error' }));
    } catch {
      setSent((current) => ({ ...current, [alert.staffId]: 'error' }));
    }
  };

  return (
    <section className="card" aria-label="Absenteeism alerts" id="alerts">
      <div className="card-header">
        <div>
          <h2 className="heading-4">Absenteeism alerts</h2>
          <p>Three or more consecutive working days without a clock-in.</p>
        </div>
        <span className="badge badge-absent">{alerts.length} flagged</span>
      </div>

      {alerts.length ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {alerts.map((alert) => (
            <motion.div
              key={alert.staffId}
              className="alert-item"
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.3 }}
            >
              <span className="avatar-circle avatar-sm avatar-tone-4">
                {alert.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
              </span>
              <div className="alert-body">
                <strong>{alert.name}</strong>
                <small>
                  {alert.department} · last seen {formatShortDate(alert.lastSeen)} · {alert.consecutiveDays} days
                </small>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${sent[alert.staffId] === 'sent' ? 'btn-quiet' : 'btn-ghost'}`}
                onClick={() => sendReminder(alert)}
                disabled={sent[alert.staffId] === 'sending' || sent[alert.staffId] === 'sent'}
                aria-label={`Send reminder to ${alert.name}`}
              >
                {sent[alert.staffId] === 'sent' ? (
                  <>
                    <MailCheck size={13} aria-hidden="true" /> Sent
                  </>
                ) : (
                  <>
                    <Send size={13} aria-hidden="true" />
                    {sent[alert.staffId] === 'sending' ? 'Sending' : 'Send Reminder'}
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="feed-empty">No staff have three consecutive absences. Good news for this week.</p>
      )}
      <p className="tiny" style={{ marginTop: 10 }}>
        Reminders are sent by email through nodemailer, and simulated when SMTP is not configured.
      </p>
    </section>
  );
}
