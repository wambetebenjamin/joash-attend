'use client';

import Link from 'next/link';
import { Bell, ExternalLink, Menu, X } from 'lucide-react';
import LiveClock from './LiveClock';
import SignOutButton from './SignOutButton';

interface Props {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  notifications?: string[];
  onOpenNav: () => void;
}

export default function AppTopbar({ title, subtitle, name, email, notifications = [], onOpenNav }: Props) {
  return (
    <div className="topbar">
      <div className="row gap-8" style={{ minWidth: 0 }}>
        <button type="button" className="icon-button mobile-toggle" aria-label="Open navigation" onClick={onOpenNav}>
          <Menu size={18} aria-hidden="true" />
        </button>
        <div className="topbar-title">
          {title}
          <span>{subtitle}</span>
        </div>
      </div>

      <div className="topbar-actions">
        <LiveClock />
        <details style={{ position: 'relative' }}>
          <summary
            className="icon-button"
            aria-label="Notifications"
            style={{ listStyle: 'none', cursor: 'pointer' }}
          >
            <Bell size={17} aria-hidden="true" />
          </summary>
          <div
            className="card"
            style={{ position: 'absolute', right: 0, top: 46, width: 300, zIndex: 900, padding: 16 }}
            role="region"
            aria-label="Notifications"
          >
            <p className="tiny" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Today
            </p>
            <ul className="stack gap-8" style={{ marginTop: 10 }}>
              {(notifications.length ? notifications : ['No new notifications.', 'Device sync runs every 30 seconds.']).map(
                (note) => (
                  <li key={note} style={{ fontSize: '0.82rem', color: 'var(--color-ink-500)' }}>
                    <span
                      className="dot"
                      style={{ color: 'var(--color-primary)', display: 'inline-block', marginRight: 8 }}
                      aria-hidden="true"
                    />
                    {note}
                  </li>
                ),
              )}
            </ul>
          </div>
        </details>
        <Link href="/" className="icon-button" aria-label="View public site" title="View public site">
          <ExternalLink size={16} aria-hidden="true" />
        </Link>
        <span className="avatar-circle avatar-tone-0" style={{ width: 36, height: 36, fontSize: '0.78rem' }}>
          {name
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')}
        </span>
        <span className="visually-hidden">{email}</span>
        <SignOutButton compact />
      </div>
    </div>
  );
}

export function MobileNav({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      className="modal-backdrop"
      style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
    >
      <div
        className="modal"
        style={{ maxWidth: 320, margin: 0, borderRadius: 0, height: '100vh', padding: 22 }}
      >
        <div className="row between" style={{ marginBottom: 14 }}>
          <strong>Navigation</strong>
          <button type="button" className="icon-button" aria-label="Close navigation" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function MobileNavList({ role }: { role: 'admin' | 'member' }) {
  const items =
    role === 'admin'
      ? [
          ['/admin/dashboard', 'Overview'],
          ['/admin/staff', 'Staff directory'],
          ['/admin/leaves', 'Leave management'],
          ['/admin/devices', 'Devices'],
          ['/admin/reports', 'Reports'],
          ['/admin/settings', 'Settings'],
        ]
      : [
          ['/member/dashboard', 'My attendance'],
          ['/member/dashboard#request-leave', 'Request leave'],
        ];
  return (
    <div className="sidebar-nav">
      {items.map(([href, label]) => (
        <Link key={href} href={href} className="sidebar-link">
          {label}
        </Link>
      ))}
    </div>
  );
}
