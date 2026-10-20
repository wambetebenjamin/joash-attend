'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'joash_attend_loader_seen';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) return;
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setVisible(true);
    const started = Date.now();

    const tick = window.setInterval(() => {
      const elapsed = (Date.now() - started) / 3000;
      setProgress(Math.min(100, Math.round(elapsed * 100)));
    }, 60);

    const skipTimer = window.setTimeout(() => setCanSkip(true), 1000);
    const closeTimer = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setVisible(false);
    }, 3000);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(skipTimer);
      window.clearTimeout(closeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="loader-screen" role="status" aria-live="polite" aria-label="Loading Joash Attend">
      {reducedMotion ? (
        <p className="loader-percentage">{progress}%</p>
      ) : (
        <>
          <svg
            className="loader-fingerprint"
            width="104"
            height="104"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
            <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
            <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
            <path d="M2 12a10 10 0 0 1 18-6" />
            <path d="M2 16h.01" />
            <path d="M21.8 16c.2-2 .131-5.354 0-6" />
            <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
            <path d="M8.65 22c.21-.66.45-1.32.57-2" />
            <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
          </svg>
          <p className="loader-percentage">{progress}%</p>
          <p className="loader-label">Loading Joash Attend</p>
        </>
      )}
      {canSkip ? (
        <button
          type="button"
          className="btn btn-ghost btn-sm loader-skip"
          onClick={() => {
            sessionStorage.setItem(STORAGE_KEY, '1');
            setVisible(false);
          }}
        >
          Skip
        </button>
      ) : null}
    </div>
  );
}
