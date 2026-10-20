import Link from 'next/link';
import { Fingerprint } from 'lucide-react';

const columns = [
  {
    heading: 'Product',
    links: [
      { href: '/#how-it-works', label: 'How it works' },
      { href: '/#features', label: 'Features' },
      { href: '/#pricing', label: 'Pricing' },
      { href: '/demo', label: 'Live demo' },
    ],
  },
  {
    heading: 'Workspace',
    links: [
      { href: '/admin/dashboard', label: 'Admin dashboard' },
      { href: '/member/dashboard', label: 'Staff portal' },
      { href: '/auth/signin', label: 'Sign in' },
      { href: '/auth/signup', label: 'Create account' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/legal/privacy-policy', label: 'Privacy policy' },
      { href: '/legal/terms', label: 'Terms of service' },
      { href: '/legal/cookie-policy', label: 'Cookie policy' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand" style={{ color: '#fff' }}>
              <span className="brand-mark light">
                <Fingerprint size={22} aria-hidden="true" />
              </span>
              <span>
                Joash Attend
                <span className="brand-sub" style={{ color: '#8e92bc' }}>
                  Every clock-in. Counted and clear.
                </span>
              </span>
            </Link>
            <p>
              Biometric attendance management for Kenyan schools, businesses and organisations.
              Device sync is simulated through a documented API, so you can evaluate the full
              workflow before you buy hardware.
            </p>
            <p style={{ marginTop: 14 }}>
              <a href="https://wa.me/254112272061" target="_blank" rel="noopener noreferrer">
                WhatsApp +254 112 272 061
              </a>
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="footer-heading">{column.heading}</p>
              <div className="footer-links">
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Joash Attend. Built in Nairobi, Kenya.</span>
          <span>Data processed in Kenya under the Data Protection Act 2019.</span>
        </div>
      </div>
    </footer>
  );
}
