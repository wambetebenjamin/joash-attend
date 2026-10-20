import LegalPage from '@/components/site/LegalPage';

export const metadata = {
  title: 'Cookie policy',
  description: 'How Joash Attend uses cookies and local storage, and how to manage your consent under the Kenya Data Protection Act 2019.',
  alternates: { canonical: '/legal/cookie-policy' },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie policy"
      updated="15 October 2026"
      intro="Joash Attend uses a small number of cookies and browser storage entries to keep you signed in, remember your consent choices and understand how the site is used. Your preferences are stored in the local storage key joash_attend_consent."
      sections={[
        {
          heading: 'Necessary cookies',
          paragraphs: [
            'These are required for the service to function and cannot be switched off in the consent manager. They cover session authentication, security checks and protection against cross site request forgery.',
            'Authentication sessions are held by our sign in provider and expire after seven days of inactivity.',
          ],
        },
        {
          heading: 'Functional storage',
          paragraphs: [
            'Functional storage remembers your dashboard filters, your last selected report range, the loader having been shown in the session, and your cookie preferences in the key joash_attend_consent.',
          ],
        },
        {
          heading: 'Analytics cookies',
          paragraphs: [
            'When you allow analytics, Vercel Analytics and Speed Insights collect aggregated, privacy friendly measurements such as page views, load time and device category. No biometric templates, attendance records or leave reasons are ever included in analytics.',
          ],
        },
        {
          heading: 'Marketing cookies',
          paragraphs: [
            'Marketing cookies are off by default. If you turn them on, we record which campaign brought you to a demo request. We do not run third party advertising networks on Joash Attend.',
          ],
        },
        {
          heading: 'reCAPTCHA',
          paragraphs: [
            'Forms are protected by Google reCAPTCHA v3, which sets its own cookies to score whether a submission is likely to be automated. The secret key is held on the server only. Google processes this data under its own privacy terms.',
          ],
        },
        {
          heading: 'Managing your choices',
          paragraphs: [
            'Use the Manage Preferences button on the consent banner, or clear the joash_attend_consent key in your browser storage to be asked again. Blocking necessary cookies will prevent you from signing in.',
            'Questions about cookies can be sent to privacy@joashattend.co.ke.',
          ],
        },
      ]}
    />
  );
}
