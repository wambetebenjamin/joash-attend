'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Fingerprint, Menu, X } from 'lucide-react';

const links = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#features', label: 'Features' },
  { href: '/#use-cases', label: 'Use cases' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/demo', label: 'Live demo' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label="Joash Attend home">
          <span className="brand-mark">
            <Fingerprint size={22} aria-hidden="true" />
          </span>
          <span>
            Joash Attend
            <span className="brand-sub">Biometric attendance</span>
          </span>
        </Link>

        <nav className={`site-nav ${open ? 'open' : ''}`} aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link href="/auth/signin" className="btn btn-ghost btn-sm">
            Sign in
          </Link>
          <Link href="/demo#request-demo" className="btn btn-primary btn-sm">
            Request a Demo
          </Link>
          <button
            type="button"
            className="icon-button mobile-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
