import Link from 'next/link';
import { AlertTriangle, MessageCircle } from 'lucide-react';

export const metadata = { title: 'Server error', robots: { index: false, follow: false } };

export default function ServerErrorPage() {
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
      <div style={{ textAlign: 'center', maxWidth: 540 }}>
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
          The service is having a moment.
        </h1>
        <p className="lede" style={{ marginTop: 12 }}>
          Joash Attend could not complete that request. Nothing in your attendance record was changed. Try
          again, or contact us on WhatsApp and we will look at it with you.
        </p>
        <div className="row center wrap gap-12" style={{ marginTop: 24 }}>
          <Link href="/admin/dashboard" className="btn btn-primary">
            Try Again
          </Link>
          <a
            className="btn btn-ghost"
            href="https://wa.me/254112272061?text=Hello%20Joash%20Attend%2C%20I%20hit%20an%20error%20on%20the%20dashboard."
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp +254 112 272 061
          </a>
        </div>
      </div>
    </main>
  );
}
