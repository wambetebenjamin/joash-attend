'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarCheck,
  FileBarChart2,
  Fingerprint,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import SignOutButton from './SignOutButton';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const adminNav: NavItem[] = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/staff', label: 'Staff directory', icon: Users },
  { href: '/admin/leaves', label: 'Leave management', icon: CalendarCheck },
  { href: '/admin/devices', label: 'Devices', icon: Fingerprint },
  { href: '/admin/reports', label: 'Reports', icon: FileBarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const memberNav: NavItem[] = [
  { href: '/member/dashboard', label: 'My attendance', icon: LayoutDashboard },
  { href: '/member/dashboard#request-leave', label: 'Request leave', icon: CalendarCheck },
];

interface Props {
  role: 'admin' | 'member';
  name: string;
  email: string;
  organisation: string;
}

export default function AppSidebar({ role, name, email, organisation }: Props) {
  const pathname = usePathname();
  const items = role === 'admin' ? adminNav : memberNav;
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return (
    <aside className="sidebar" aria-label="Workspace navigation">
      <div className="sidebar-brand">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Fingerprint size={20} aria-hidden="true" />
          </span>
          <span>
            Joash Attend
            <span className="brand-sub">{role === 'admin' ? 'Admin workspace' : 'Staff portal'}</span>
          </span>
        </Link>
      </div>

      <nav className="sidebar-nav" aria-label="Main">
        <p className="sidebar-section-label" style={{ paddingTop: 0 }}>Workspace</p>
        {items.map((item) => {
          const active = pathname === item.href.split('#')[0];
          return (
            <Link key={item.href} href={item.href} className="sidebar-link" data-active={active}>
              <item.icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}

        <p className="sidebar-section-label">Organisation</p>
        <div className="chip" style={{ margin: '4px 8px', justifyContent: 'space-between' }}>
          <span className="dot" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
          {organisation}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="avatar-circle avatar-sm avatar-tone-1">{initials || 'JA'}</span>
          <div style={{ minWidth: 0 }}>
            <strong style={{ fontSize: '0.84rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </strong>
            <small style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{email}</small>
          </div>
        </div>
        <SignOutButton />
        <p className="tiny" style={{ padding: '10px 8px 0' }}>
          Demo workspace. Device sync and mail are simulated.
        </p>
      </div>
    </aside>
  );
}
