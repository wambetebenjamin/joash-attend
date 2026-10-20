import LegalPage from '@/components/site/LegalPage';

export const metadata = {
  title: 'Terms of service',
  description: 'The terms that govern use of the Joash Attend biometric attendance platform by Kenyan schools, businesses and organisations.',
  alternates: { canonical: '/legal/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      updated="15 October 2026"
      intro="These terms govern access to Joash Attend, a biometric attendance management dashboard for organisations in Kenya. By creating an account or using a demo workspace you accept these terms."
      sections={[
        {
          heading: 'The service',
          paragraphs: [
            'Joash Attend provides a web dashboard that consolidates clock-in and clock-out events from compatible fingerprint and face ID terminals, produces attendance analytics, manages leave requests and exports reports.',
            'In the hosted demonstration, device synchronisation and email delivery are simulated. No real biometric hardware is connected, and simulated records must not be used as payroll records for real staff.',
          ],
        },
        {
          heading: 'Accounts and roles',
          paragraphs: [
            'Each person must use their own account. Administrators can create, edit and deactivate staff records under their organisation. New sign ups receive the member role, and only an administrator may grant administrator rights.',
            'You are responsible for keeping credentials confidential and for activity that occurs under your account.',
          ],
        },
        {
          heading: 'Acceptable use',
          paragraphs: ['You agree to use Joash Attend lawfully and in line with Kenyan employment and data protection law.'],
          bullets: [
            'Enrol only people who have given informed consent to biometric verification.',
            'Collect and use attendance data only for legitimate workforce or school administration purposes.',
            'Do not attempt to access another organisation\'s data, bypass role checks, or probe the API outside the documented endpoints.',
            'Do not upload unlawful, misleading or harmful content, including to the logo and leave request fields.',
          ],
        },
        {
          heading: 'Subscriptions and billing',
          paragraphs: [
            'Starter, Growth and Enterprise plans are billed in Kenyan shillings exclusive of VAT. Annual plans are invoiced once per year and monthly plans monthly in advance.',
            'Plan limits refer to enrolled people. Exceeding a limit prompts an upgrade rather than an automatic charge.',
          ],
        },
        {
          heading: 'Availability and support',
          paragraphs: [
            'We aim for high availability and schedule maintenance outside East Africa Time working hours where possible. Support is provided by email and WhatsApp during business hours in Nairobi.',
          ],
        },
        {
          heading: 'Intellectual property',
          paragraphs: [
            'Joash Attend retains ownership of the platform, its design system and documentation. Your organisation retains ownership of its staff records, attendance data and reports.',
          ],
        },
        {
          heading: 'Liability',
          paragraphs: [
            'To the extent permitted by Kenyan law, Joash Attend is not liable for indirect loss, including lost profits or payroll penalties, arising from reliance on simulated demo data or from inaccurate enrolment information supplied by your organisation.',
          ],
        },
        {
          heading: 'Governing law',
          paragraphs: [
            'These terms are governed by the laws of Kenya, and disputes are subject to the exclusive jurisdiction of the Kenyan courts. Questions can be sent to legal@joashattend.co.ke or WhatsApp +254 112 272 061.',
          ],
        },
      ]}
    />
  );
}
