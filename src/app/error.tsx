'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, MessageCircle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Joash Attend] Route error', error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        background: 'var(--color-canvas)',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 540 }} role="alert">
        <span
          style={{
            width: 88,
            height: 88,
            borderRadius: 26,
            background: 'var(--color-danger-soft)',
            color: 'var(--color-danger-ink)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 22,
          }}
          aria-hidden="true"
        >
          <AlertTriangle size={42} />
        </span>
        <p className="eyebrow">Error 500</p>
        <h1 className="display-2" style={{ marginTop: 10, fontSize: '2rem' }}>
          Something failed on our side.
        </h1>
        <p className="lede" style={{ marginTop: 12 }}>
          The attendance service could not complete that request. Your data is safe. Try again, and if it keeps
          failing reach the team on WhatsApp.
        </p>
        <div className="row center wrap gap-12" style={{ marginTop: 24 }}>
          <button type="button" className="btn btn-primary" onClick={reset}>
            <RotateCcw size={16} aria-hidden="true" /> Try Again
          </button>
          <a
            className="btn btn-ghost"
            href="https://wa.me/254112272061?text=Hello%20Joash%20Attend%2C%20I%20hit%20an%20error%20on%20the%20dashboard."
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp +254 112 272 061
          </a>
          <Link href="/" className="btn btn-ghost">
            Back home
          </Link>
        </div>
        {error.digest ? <p className="tiny" style={{ marginTop: 18 }}>Reference: {error.digest}</p> : null}
      </div>
    </main>
  );
}
