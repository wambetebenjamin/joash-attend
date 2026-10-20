import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CookieConsent from '@/components/system/CookieConsent';
import LoadingScreen from '@/components/system/LoadingScreen';
import VoiceTour from '@/components/system/VoiceTour';
import WhatsAppButton from '@/components/system/WhatsAppButton';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://joashattend.co.ke'),
  title: {
    default: 'Joash Attend | Biometric attendance, counted and clear',
    template: '%s | Joash Attend',
  },
  description:
    'Joash Attend is a biometric attendance management dashboard for Kenyan schools, businesses and organisations. Live clock-ins, absenteeism alerts, leave management and payroll-ready reports.',
  keywords: [
    'biometric attendance Kenya',
    'staff attendance system',
    'school attendance software',
    'time and attendance Nairobi',
    'payroll export Kenya',
  ],
  authors: [{ name: 'Joash Attend' }],
  openGraph: {
    title: 'Joash Attend | Every clock-in. Counted and clear.',
    description:
      'A biometric attendance dashboard built for Kenyan schools, offices and organisations. Device sync is simulated, so you can try the full workflow today.',
    url: '/',
    siteName: 'Joash Attend',
    locale: 'en_KE',
    type: 'website',
    images: [{ url: '/images/hero-office.jpg', width: 500, height: 333, alt: 'Joash Attend team review' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joash Attend | Every clock-in. Counted and clear.',
    description: 'Biometric attendance management for Kenyan schools, businesses and organisations.',
    images: ['/images/hero-office.jpg'],
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#546fff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div id="main-content">{children}</div>
        <LoadingScreen />
        <CookieConsent />
        <VoiceTour />
        <WhatsAppButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
