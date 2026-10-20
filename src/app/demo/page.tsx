import Link from 'next/link';
import { ArrowRight, Lock, MonitorSmartphone } from 'lucide-react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import DemoPreview from '@/components/marketing/DemoPreview';
import DemoRequestForm from '@/components/marketing/DemoRequestForm';
import Reveal from '@/components/system/Reveal';
import SmoothScroll from '@/components/system/SmoothScroll';
import {
  DEMO_ORG,
  getDailyAttendanceRates,
  getDepartmentBreakdown,
  getDepartmentWeek,
  getLiveEvents,
  getMonthlyTrend,
  getTodaySummary,
} from '@/lib/mock';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Live demo',
  description:
    'Explore the Joash Attend admin dashboard with read only demo data for a fictional 80 staff organisation with three departments.',
  alternates: { canonical: '/demo' },
};

export default function DemoPage() {
  const summary = getTodaySummary();
  const daily = getDailyAttendanceRates(30);
  const monthly = getMonthlyTrend();
  const departments = getDepartmentBreakdown();
  const week = getDepartmentWeek();
  const live = getLiveEvents(0);
  const feed = live.events.slice(0, 8).map((event) => ({
    id: event.id,
    staffName: event.staffName,
    department: event.department,
    time: event.time,
    type: event.type,
    status: event.status,
  }));

  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <main>
        <section style={{ background: '#fff', borderBottom: '1px solid var(--color-hairline)' }}>
          <div className="container" style={{ paddingTop: 48, paddingBottom: 40 }}>
            <Reveal>
              <p className="eyebrow">Interactive demo</p>
              <h1 className="display-2" style={{ marginTop: 10, maxWidth: 760 }}>
                Walk through the dashboard your administrators will use.
              </h1>
              <p className="lede" style={{ marginTop: 14, maxWidth: 680 }}>
                This is a read only preview of Joash Attend, populated with realistic mock data for{' '}
                <strong>{DEMO_ORG.name}</strong>: {DEMO_ORG.staff} staff across {DEMO_ORG.departments} departments.
                {` ${DEMO_ORG.description}`}
              </p>
              <div className="row wrap gap-12" style={{ marginTop: 24 }}>
                <Link href="#request-demo" className="btn btn-primary">
                  Start a free trial <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link href="/auth/signup" className="btn btn-ghost">
                  Create an account
                </Link>
                <span className="row gap-8 tiny">
                  <Lock size={13} aria-hidden="true" /> No login required
                </span>
                <span className="row gap-8 tiny">
                  <MonitorSmartphone size={13} aria-hidden="true" /> Nothing is saved
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-tight">
          <div className="container">
            <DemoPreview
              summary={summary}
              daily={daily}
              monthly={monthly}
              departments={departments}
              week={week}
              feed={feed}
            />
          </div>
        </section>

        <section className="section-tight" id="request-demo" style={{ background: '#fff', borderTop: '1px solid var(--color-hairline)' }}>
          <div className="container">
            <div className="cta-band">
              <div>
                <p className="eyebrow" style={{ color: '#bac8ff' }}>Free trial</p>
                <h2 className="display-2" style={{ color: '#fff', marginTop: 10 }}>
                  Take this from demo to your own register.
                </h2>
                <p className="lede" style={{ marginTop: 12 }}>
                  A 14 day trial includes your departments, your staff list and one simulated device. Sign
                  in with the demo accounts from the sign in page to see the admin and staff views, or send us
                  the details below and we will set up the workspace for you.
                </p>
                <div className="row wrap gap-12" style={{ marginTop: 22 }}>
                  <Link href="/auth/signin" className="btn btn-primary">
                    Open the admin sign in
                  </Link>
                  <Link href="/#pricing" className="btn btn-ghost" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
                    Compare plans
                  </Link>
                </div>
              </div>
              <div className="cta-form">
                <DemoRequestForm compact />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
