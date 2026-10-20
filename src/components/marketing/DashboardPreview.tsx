'use client';

import Link from 'next/link';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarCheck,
  FileBarChart2,
  Fingerprint,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import { DailyAttendanceBar } from '@/components/charts/AttendanceCharts';
import { formatTime } from '@/lib/date';
import type { LiveEvent } from '@/types';

interface Props {
  summary: {
    present: number;
    absent: number;
    late: number;
    attendanceRate: number;
    monthRate: number;
  };
  daily: { label: string; rate: number; present: number; absent: number }[];
  feed: LiveEvent[];
}

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, active: true },
  { label: 'Staff directory', icon: Users, active: false },
  { label: 'Leave', icon: CalendarCheck, active: false },
  { label: 'Devices', icon: Fingerprint, active: false },
  { label: 'Reports', icon: FileBarChart2, active: false },
  { label: 'Settings', icon: Settings, active: false },
];

export default function DashboardPreview({ summary, daily, feed }: Props) {
  return (
    <section className="preview-section" aria-label="Dashboard preview">
      <div className="container">
        <div className="row between wrap gap-16" style={{ marginBottom: 20 }}>
          <div>
            <p className="eyebrow">The dashboard</p>
            <h2 className="display-2" style={{ marginTop: 8, fontSize: '1.7rem' }}>
              One screen for the whole morning register.
            </h2>
          </div>
          <Link href="/demo" className="btn btn-ghost">
            Open the full demo
          </Link>
        </div>

        <div className="preview-frame">
          <div className="preview-chrome">
            <span className="preview-dot" aria-hidden="true" />
            <span className="preview-dot" aria-hidden="true" />
            <span className="preview-dot" aria-hidden="true" />
            <span className="preview-url">app.joashattend.co.ke/admin/dashboard</span>
          </div>

          <div className="preview-body">
            <div className="preview-nav" aria-hidden="true">
              <p className="tiny" style={{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Workspace
              </p>
              <div className="stack gap-4" style={{ marginTop: 10 }}>
                {navItems.map((item) => (
                  <span key={item.label} className="preview-nav-item" data-active={item.active}>
                    <item.icon size={15} aria-hidden="true" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="preview-main">
              <div className="row between">
                <div>
                  <p className="heading-4" style={{ fontSize: '1rem' }}>Attendance overview</p>
                  <p className="tiny">Live picture of today across every department</p>
                </div>
                <span className="badge badge-present">
                  <span className="dot live-dot" aria-hidden="true" /> Live
                </span>
              </div>

              <div className="preview-kpis">
                {[
                  { label: 'Present', value: summary.present, tone: 'var(--color-success-ink)' },
                  { label: 'Late', value: summary.late, tone: 'var(--color-warning-ink)' },
                  { label: 'Absent', value: summary.absent, tone: 'var(--color-danger-ink)' },
                  { label: 'This month', value: `${summary.monthRate}%`, tone: 'var(--color-primary-700)' },
                ].map((kpi) => (
                  <div className="preview-kpi" key={kpi.label}>
                    <span className="tiny">{kpi.label}</span>
                    <strong style={{ color: kpi.tone }}>{kpi.value}</strong>
                  </div>
                ))}
              </div>

              <div>
                <p className="tiny" style={{ marginBottom: 6 }}>Daily attendance rate, last 30 days</p>
                <div style={{ width: '100%', height: 168 }}>
                  <DailyAttendanceBar data={daily.slice(-14)} />
                </div>
              </div>
            </div>

            <div className="preview-side">
              <p className="tiny" style={{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Live clock-ins
              </p>
              <div className="stack" style={{ marginTop: 10 }}>
                {feed.slice(0, 5).map((event) => (
                  <div key={event.id} className="preview-feed-row">
                    <span
                      className="icon-tile"
                      style={{
                        width: 26,
                        height: 26,
                        marginBottom: 0,
                        background: event.type === 'clock-in' ? 'var(--color-success-soft)' : 'var(--color-canvas-muted)',
                        color: event.type === 'clock-in' ? 'var(--color-success-ink)' : 'var(--color-ink-500)',
                      }}
                    >
                      {event.type === 'clock-in' ? (
                        <ArrowDownLeft size={12} aria-hidden="true" />
                      ) : (
                        <ArrowUpRight size={12} aria-hidden="true" />
                      )}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: '0.78rem', display: 'block' }}>{event.staffName}</strong>
                      <span className="tiny">{event.department}</span>
                    </div>
                    <span className="tiny" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatTime(event.time)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="tiny" style={{ marginTop: 14 }}>
                Polled from the mock device bridge every 30 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
