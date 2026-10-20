'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-KE">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          background: '#fcfcfc',
          color: '#141522',
          padding: 24,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 520 }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, color: '#3d53db' }}>
            Error 500
          </p>
          <h1 style={{ fontSize: '2rem', margin: '10px 0 12px' }}>Joash Attend could not load.</h1>
          <p style={{ color: '#54577a', lineHeight: 1.6 }}>
            The application hit an unexpected error. Try again, or reach us on WhatsApp at +254 112 272 061.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                background: '#546fff',
                color: '#fff',
                border: 0,
                borderRadius: 999,
                padding: '12px 22px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <a
              href="https://wa.me/254112272061"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                border: '1px solid #c2c6e8',
                borderRadius: 999,
                padding: '12px 22px',
                fontWeight: 600,
                color: '#141522',
              }}
            >
              WhatsApp +254 112 272 061
            </a>
          </div>
          {error.digest ? <p style={{ color: '#8e92bc', fontSize: '0.78rem', marginTop: 18 }}>Reference: {error.digest}</p> : null}
        </div>
      </body>
    </html>
  );
}
