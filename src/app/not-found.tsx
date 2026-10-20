import Link from 'next/link';
import { Fingerprint } from 'lucide-react';

export const metadata = { title: 'Record not found' };

export default function NotFound() {
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
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <span
          style={{
            width: 88,
            height: 88,
            borderRadius: 26,
            background: 'var(--color-primary-100)',
            color: 'var(--color-primary-700)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 22,
          }}
          aria-hidden="true"
        >
          <Fingerprint size={44} />
        </span>
        <p className="eyebrow">Error 404</p>
        <h1 className="display-2" style={{ marginTop: 10, fontSize: '2rem' }}>
          This record does not exist.
        </h1>
        <p className="lede" style={{ marginTop: 12 }}>
          The page or attendance record you asked for is not on file. It may have been archived, or the link
          may have been typed incorrectly.
        </p>
        <div className="row center wrap gap-12" style={{ marginTop: 24 }}>
          <Link href="/admin/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
          <Link href="/" className="btn btn-ghost">
            Public site
          </Link>
        </div>
        <p className="tiny" style={{ marginTop: 20 }}>
          Need help? WhatsApp +254 112 272 061.
        </p>
      </div>
    </main>
  );
}
