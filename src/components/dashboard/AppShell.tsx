'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AppSidebar from './AppSidebar';
import AppTopbar, { MobileNav, MobileNavList } from './AppTopbar';

interface Props {
  role: 'admin' | 'member';
  name: string;
  email: string;
  organisation: string;
  notifications?: string[];
  children: React.ReactNode;
}

const titles: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard': { title: 'Attendance overview', subtitle: 'Live picture of today across every department' },
  '/admin/staff': { title: 'Staff directory', subtitle: 'Everyone enrolled on the biometric devices' },
  '/admin/leaves': { title: 'Leave management', subtitle: 'Requests waiting for a decision and approved leave' },
  '/admin/devices': { title: 'Biometric devices', subtitle: 'Mock device registry and sync status' },
  '/admin/reports': { title: 'Reports', subtitle: 'Build, preview and download attendance reports' },
  '/admin/settings': { title: 'Organisation settings', subtitle: 'Working hours, leave types and notifications' },
  '/member/dashboard': { title: 'My attendance', subtitle: 'Your personal record, calendar and leave requests' },
};

export default function AppShell({ role, name, email, organisation, notifications, children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta =
    titles[pathname] ??
    (pathname.startsWith('/admin/staff/')
      ? { title: 'Staff profile', subtitle: 'Attendance history, summary and leave record' }
      : { title: 'Workspace', subtitle: 'Joash Attend' });

  return (
    <div className="app-shell">
      <AppSidebar role={role} name={name} email={email} organisation={organisation} />
      <div className="app-main">
        <AppTopbar
          title={meta.title}
          subtitle={meta.subtitle}
          name={name}
          email={email}
          notifications={notifications}
          onOpenNav={() => setMobileOpen(true)}
        />
        <main className="page">{children}</main>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <MobileNavList role={role} />
      </MobileNav>
    </div>
  );
}
