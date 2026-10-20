'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const STORAGE_KEY = 'joash_attend_consent';

interface Preferences {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
}

const defaultPreferences: Preferences = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: false,
  updatedAt: '',
};

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences);
  const [saved, setSaved] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Preferences;
        setPrefs({ ...defaultPreferences, ...parsed, necessary: true });
        return;
      }
    } catch {
      // A malformed value simply falls back to the banner.
    }
    const timer = window.setTimeout(() => {
      setShowBanner(true);
      setBannerVisible(true);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('consent-visible', bannerVisible);
    return () => document.body.classList.remove('consent-visible');
  }, [bannerVisible]);

  const persist = (next: Preferences) => {
    const payload = { ...next, necessary: true as const, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setPrefs(payload);
    setShowBanner(false);
    setBannerVisible(false);
    setOpen(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  };

  const acceptAll = () =>
    persist({ necessary: true, functional: true, analytics: true, marketing: true, updatedAt: '' });

  if (!showBanner && !open) {
    return saved ? (
      <div className="cookie-banner" role="status">
        <div className="cookie-inner">
          <p className="cookie-copy">Cookie preferences saved. You can update them any time from the cookie policy.</p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSaved(false)}>
            Dismiss
          </button>
        </div>
      </div>
    ) : null;
  }

  return (
    <>
      {showBanner ? (
        <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
          <div className="cookie-inner">
            <div className="cookie-copy">
              <strong>We use cookies to keep attendance records accurate.</strong>
              Joash Attend uses necessary cookies to run the dashboard, and optional cookies to
              understand how the product is used. We follow the Kenya Data Protection Act 2019, and
              you can change your choices at any time. Read our{' '}
              <Link href="/legal/cookie-policy" style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>
                cookie policy
              </Link>
              .
            </div>
            <div className="cookie-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(true)}>
                Manage Preferences
              </button>
              <button type="button" className="btn btn-primary" onClick={acceptAll}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Cookie preferences">
          <div className="modal" style={{ maxWidth: 520 }}>
            <div className="modal-head">
              <div>
                <h2 className="heading-4">Cookie preferences</h2>
                <p>Choose which categories Joash Attend may store on this device.</p>
              </div>
              <button type="button" className="icon-button" aria-label="Close preferences" onClick={() => setOpen(false)}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="pref-row">
              <div>
                <strong>Necessary</strong>
                <small>Session, security and attendance integrity. Always on and required to operate.</small>
              </div>
              <button type="button" className="switch" data-on="true" disabled aria-label="Necessary cookies, always on" />
            </div>

            <div className="pref-row">
              <div>
                <strong>Functional</strong>
                <small>Remembers your dashboard layout, filters and language choices.</small>
              </div>
              <button
                type="button"
                className="switch"
                data-on={prefs.functional}
                aria-label="Functional cookies"
                aria-pressed={prefs.functional}
                onClick={() => setPrefs((current) => ({ ...current, functional: !current.functional }))}
              />
            </div>

            <div className="pref-row">
              <div>
                <strong>Analytics</strong>
                <small>Aggregated usage insight through Vercel Analytics. No biometric data is collected.</small>
              </div>
              <button
                type="button"
                className="switch"
                data-on={prefs.analytics}
                aria-label="Analytics cookies"
                aria-pressed={prefs.analytics}
                onClick={() => setPrefs((current) => ({ ...current, analytics: !current.analytics }))}
              />
            </div>

            <div className="pref-row">
              <div>
                <strong>Marketing</strong>
                <small>Measures campaign performance for demo requests. Off by default.</small>
              </div>
              <button
                type="button"
                className="switch"
                data-on={prefs.marketing}
                aria-label="Marketing cookies"
                aria-pressed={prefs.marketing}
                onClick={() => setPrefs((current) => ({ ...current, marketing: !current.marketing }))}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={() => persist(prefs)}>
                Save preferences
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
