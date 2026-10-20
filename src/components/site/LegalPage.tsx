import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

interface Props {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalPage({ title, updated, intro, sections }: Props) {
  return (
    <>
      <SiteHeader />
      <main className="section-tight">
        <div className="container" style={{ maxWidth: 900 }}>
          <Link href="/" className="row gap-8 tiny" style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>
            <ArrowLeft size={14} aria-hidden="true" /> Back to home
          </Link>
          <h1 className="display-2" style={{ marginTop: 14, fontSize: '2.2rem' }}>
            {title}
          </h1>
          <p className="tiny" style={{ marginTop: 8 }}>
            Last updated {updated} · Joash Attend, Nairobi, Kenya
          </p>
          <p className="lede" style={{ marginTop: 16 }}>
            {intro}
          </p>

          <div className="card" style={{ marginTop: 26 }}>
            <nav aria-label="On this page">
              <p className="tiny" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                On this page
              </p>
              <ol style={{ margin: '10px 0 0 18px', fontSize: '0.86rem', color: 'var(--color-ink-500)' }}>
                {sections.map((section, index) => (
                  <li key={section.heading} style={{ marginBottom: 4 }}>
                    <a href={`#section-${index + 1}`} style={{ color: 'var(--color-primary-600)' }}>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="stack gap-24" style={{ marginTop: 30 }}>
            {sections.map((section, index) => (
              <section key={section.heading} id={`section-${index + 1}`}>
                <h2 className="heading-3" style={{ fontSize: '1.2rem' }}>
                  {index + 1}. {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="muted" style={{ marginTop: 10, fontSize: '0.92rem', lineHeight: 1.7 }}>
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="stack gap-8" style={{ marginTop: 12 }}>
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="row gap-8"
                        style={{ alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--color-ink-500)' }}
                      >
                        <span className="dot" style={{ color: 'var(--color-primary)', marginTop: 7 }} aria-hidden="true" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="card" style={{ marginTop: 32, background: 'var(--color-canvas-muted)' }}>
            <h2 className="heading-4">Questions about this policy</h2>
            <p className="muted" style={{ marginTop: 8, fontSize: '0.9rem' }}>
              Write to the Joash Attend data protection contact at privacy@joashattend.co.ke, or send a WhatsApp
              message to +254 112 272 061. We respond to data subject requests within seven working days, as
              required by the Kenya Data Protection Act 2019.
            </p>
            <div className="row gap-12 wrap" style={{ marginTop: 14 }}>
              <Link href="/legal/privacy-policy" className="btn btn-ghost btn-sm">
                Privacy policy
              </Link>
              <Link href="/legal/terms" className="btn btn-ghost btn-sm">
                Terms of service
              </Link>
              <Link href="/legal/cookie-policy" className="btn btn-ghost btn-sm">
                Cookie policy
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
