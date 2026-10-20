import Image from 'next/image';
import Link from 'next/link';
import {
  AlarmClock,
  ArrowRight,
  BellRing,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Download,
  FileSpreadsheet,
  Fingerprint,
  Hospital,
  Laptop,
  MapPin,
  ScanFace,
  ShieldCheck,
  UserPlus,
  UserX,
  Users,
} from 'lucide-react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import SmoothScroll from '@/components/system/SmoothScroll';
import Reveal from '@/components/system/Reveal';
import PricingSection from '@/components/marketing/PricingSection';
import DemoRequestForm from '@/components/marketing/DemoRequestForm';
import { getTodaySummary } from '@/lib/mock';

export const dynamic = 'force-dynamic';

const steps = [
  {
    title: 'Install the biometric device',
    copy: 'We help you mount a fingerprint or face ID terminal at each entrance, then connect it to your Joash Attend workspace.',
    icon: ScanFace,
  },
  {
    title: 'Register staff or students',
    copy: 'Add people in bulk with a CSV, or one by one in the staff directory. Each person gets a unique enrolment code.',
    icon: UserPlus,
  },
  {
    title: 'Devices sync clock-ins and clock-outs',
    copy: 'Our mock device bridge pulls verification events every few minutes. No hardware SDK, no cabling headaches.',
    icon: Fingerprint,
  },
  {
    title: 'Admins review and download reports',
    copy: 'Attendance lands on the dashboard in real time, ready for payroll, board reporting and ministry returns.',
    icon: Download,
  },
];

const features = [
  { title: 'Real time clock-in feed', copy: 'Every verification appears on the dashboard within seconds, with staff name, department and status.', icon: Clock3, tone: '' },
  { title: 'Late arrival alerts', copy: 'The grace period you set decides when a clock-in becomes late. Alerts reach HR without anyone checking.', icon: AlarmClock, tone: 'amber' },
  { title: 'Absenteeism tracking', copy: 'Spot consecutive absences early and send a reminder email from the alerts panel in one click.', icon: UserX, tone: 'red' },
  { title: 'Leave management', copy: 'Staff request leave, admins approve or reject, and the calendar updates the attendance record automatically.', icon: CalendarCheck, tone: 'green' },
  { title: 'Payroll export', copy: 'Download CSV or PDF summaries that drop straight into your payroll workbook, with days worked and lateness.', icon: FileSpreadsheet, tone: '' },
  { title: 'Multi location support', copy: 'Run a main campus, a branch and a depot from one workspace. Each device maps to a named location.', icon: MapPin, tone: 'green' },
  { title: 'Role based access', copy: 'Admins see the whole organisation. Staff and students see only their own record and leave requests.', icon: ShieldCheck, tone: 'grey' },
  { title: 'Kenya hosted data', copy: 'Records stay in region and are handled under the Kenya Data Protection Act 2019, with a DPA on request.', icon: Building2, tone: 'amber' },
];

const useCases = [
  { title: 'Schools', copy: 'Track teacher and learner attendance per stream, then share term summaries with the board.', icon: Users, image: '/images/school-students.jpg' },
  { title: 'Factories', copy: 'Shift based clock-ins at the gate, with overtime hours ready for payroll every Friday.', icon: Building2, image: '/images/team-meeting.jpg' },
  { title: 'Offices', copy: 'Hybrid teams clock in at reception or on the branch terminal, with department level reporting.', icon: Laptop, image: '/images/hero-office.jpg' },
  { title: 'Hospitals', copy: 'Ward by ward rosters and locum cover, so patient care never depends on an attendance guess.', icon: Hospital, image: '/images/hr-manager.jpg' },
  { title: 'NGOs', copy: 'Field officers and programme staff across counties, consolidated into one donor ready report.', icon: ShieldCheck, image: '/images/office-collaboration.jpg' },
];

const testimonials = [
  {
    quote:
      'Our payroll used to take three days because we were reconciling paper registers. Now I export the CSV on the 28th and the numbers already agree with the gate.',
    name: 'Grace Wanjiru',
    role: 'HR Manager, Nairobi Academy Group',
    initials: 'GW',
  },
  {
    quote:
      'The late arrival panel changed how we manage the morning shift. Supervisors see it before the 8am briefing instead of at the end of the week.',
    name: 'Peter Otieno',
    role: 'Operations Manager, Thika Foods',
    initials: 'PO',
  },
  {
    quote:
      'I approved twelve leave requests in one sitting, and the attendance calendar updated itself. My deputy no longer keeps a second spreadsheet.',
    name: 'Halima Abdi',
    role: 'School Administrator, Mombasa Road Campus',
    initials: 'HA',
  },
];

export default function LandingPage() {
  const summary = getTodaySummary();

  return (
    <>
      <SmoothScroll />
      <SiteHeader />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="dot live-dot" aria-hidden="true" />
                Biometric attendance for Kenya
              </p>
              <h1 className="display-1">
                Every clock-in.
                <br />
                Counted and clear.
              </h1>
              <p className="lede" style={{ maxWidth: 520 }}>
                Joash Attend turns fingerprint and face ID clock-ins into a live attendance picture.
                Know who is present, who is late and who is absent, then send payroll ready reports
                from the same dashboard.
              </p>

              <div className="hero-actions">
                <Link href="/demo#request-demo" className="btn btn-primary btn-lg">
                  Request a Demo <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <Link href="#pricing" className="btn btn-ghost btn-lg">
                  View Pricing
                </Link>
              </div>

              <div className="hero-note">
                <span className="row gap-8">
                  <CheckCircle2 size={15} style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                  No hardware SDK required
                </span>
                <span className="row gap-8">
                  <CheckCircle2 size={15} style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                  Set up in a week
                </span>
                <span className="row gap-8">
                  <CheckCircle2 size={15} style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                  Data hosted in Kenya
                </span>
              </div>

              <div className="hero-trust">
                <div>
                  <strong>{summary.present + summary.late}</strong>
                  present today in the demo
                </div>
                <div>
                  <strong>80</strong>
                  staff enrolled
                </div>
                <div>
                  <strong>{summary.attendanceRate}%</strong>
                  attendance today
                </div>
                <div>
                  <strong>3</strong>
                  departments tracked
                </div>
              </div>
            </div>

            <div className="hero-media">
              <Image
                src="/images/hero-office.jpg"
                alt="East African professionals reviewing attendance on a tablet in a Nairobi office"
                width={500}
                height={333}
                priority
                sizes="(max-width: 900px) 100vw, 520px"
              />
              <div className="hero-float top">
                <p className="hero-float-label">Live clock-ins</p>
                <p className="hero-float-value">{summary.present + summary.late} today</p>
                <div className="hero-float-row" style={{ marginTop: 6 }}>
                  <span className="dot" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
                  Syncing from 3 devices
                </div>
              </div>
              <div className="hero-float bottom">
                <p className="hero-float-label">Attendance rate</p>
                <p className="hero-float-value">{summary.monthRate}%</p>
                <div className="hero-float-row" style={{ marginTop: 6 }}>
                  This month, all departments
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-tight" style={{ borderTop: '1px solid var(--color-hairline)', background: '#fff' }}>
          <div className="container row between wrap gap-24">
            <p className="tiny" style={{ letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
              Designed for
            </p>
            <div className="row wrap gap-24">
              {['Schools', 'Factories', 'Offices', 'Hospitals', 'NGOs'].map((item) => (
                <span key={item} className="row gap-8 muted" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="how-it-works">
          <div className="container">
            <Reveal>
              <div style={{ maxWidth: 640 }}>
                <p className="eyebrow">How it works</p>
                <h2 className="display-2" style={{ marginTop: 10 }}>
                  From device install to a signed off payroll.
                </h2>
                <p className="lede" style={{ marginTop: 12 }}>
                  Four steps stand between your current paper register and an attendance record your
                  finance team can trust.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-4" style={{ marginTop: 36 }}>
              {steps.map((step, index) => (
                <Reveal key={step.title} delay={index * 80}>
                  <article className="step-card">
                    <div className="row between">
                      <span className="icon-tile" style={{ marginBottom: 0 }}>
                        <step.icon size={20} aria-hidden="true" />
                      </span>
                      <span className="step-index">Step {index + 1}</span>
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="features" style={{ background: '#fff', borderTop: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}>
          <div className="container">
            <Reveal>
              <div className="row between wrap gap-24" style={{ alignItems: 'flex-end' }}>
                <div style={{ maxWidth: 620 }}>
                  <p className="eyebrow">Features</p>
                  <h2 className="display-2" style={{ marginTop: 10 }}>
                    The attendance detail that payroll keeps asking for.
                  </h2>
                </div>
                <Link href="/demo" className="btn btn-ghost">
                  Open the live demo <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-4" style={{ marginTop: 34 }}>
              {features.map((feature, index) => (
                <Reveal key={feature.title} delay={index * 50}>
                  <article className="feature-card">
                    <span className={`icon-tile ${feature.tone}`}>
                      <feature.icon size={20} aria-hidden="true" />
                    </span>
                    <h3>{feature.title}</h3>
                    <p>{feature.copy}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="use-cases">
          <div className="container">
            <Reveal>
              <div style={{ maxWidth: 640 }}>
                <p className="eyebrow">Use cases</p>
                <h2 className="display-2" style={{ marginTop: 10 }}>Built where the register used to hang.</h2>
                <p className="lede" style={{ marginTop: 12 }}>
                  One product, five operating realities. Each workspace is configured around how your
                  people actually arrive and leave.
                </p>
              </div>
            </Reveal>

            <div className="usecase-grid" style={{ marginTop: 34 }}>
              {useCases.map((useCase, index) => (
                <Reveal key={useCase.title} delay={index * 60} className="usecase-item">
                  <article
                    className="feature-card"
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      padding: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={useCase.image}
                      alt={`${useCase.title} using Joash Attend biometric attendance`}
                      width={500}
                      height={333}
                      sizes="(max-width: 900px) 100vw, 33vw"
                      style={{ height: 170, width: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '4px 20px 22px' }}>
                      <span className="row gap-8" style={{ color: 'var(--color-primary-600)', fontWeight: 700, fontSize: '0.82rem' }}>
                        <useCase.icon size={16} aria-hidden="true" />
                        {useCase.title}
                      </span>
                      <p style={{ marginTop: 8 }}>{useCase.copy}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="pricing" style={{ background: '#fff', borderTop: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)' }}>
          <div className="container">
            <PricingSection />
          </div>
        </section>

        <section className="section" id="testimonials">
          <div className="container">
            <Reveal>
              <div style={{ maxWidth: 620 }}>
                <p className="eyebrow">Testimonials</p>
                <h2 className="display-2" style={{ marginTop: 10 }}>What administrators tell us after one term.</h2>
              </div>
            </Reveal>

            <div className="grid grid-3" style={{ marginTop: 32 }}>
              {testimonials.map((testimonial, index) => (
                <Reveal key={testimonial.name} delay={index * 80}>
                  <article className="quote-card">
                    <span className="badge badge-neutral" style={{ alignSelf: 'flex-start' }}>
                      5.0 out of 5
                    </span>
                    <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
                    <div className="quote-person">
                      <span className={`avatar-circle avatar-tone-${index}`}>{testimonial.initials}</span>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.88rem' }}>{testimonial.name}</strong>
                        <span className="tiny">{testimonial.role}</span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-tight" id="request-demo">
          <div className="container">
            <Reveal>
              <div className="cta-band">
                <div>
                  <p className="eyebrow" style={{ color: '#bac8ff' }}>Request a demo</p>
                  <h2 className="display-2" style={{ color: '#fff', marginTop: 10 }}>
                    See your own attendance data in 20 minutes.
                  </h2>
                  <p className="lede" style={{ marginTop: 12 }}>
                    We will load your departments and a typical week of clock-ins into a sandbox, then
                    walk through reports with your HR or administration team. No hardware needed for
                    the session.
                  </p>
                  <div className="row wrap gap-16" style={{ marginTop: 24, color: '#c8ccdd', fontSize: '0.86rem' }}>
                    <span className="row gap-8">
                      <MapPin size={15} aria-hidden="true" /> Nairobi, Kenya
                    </span>
                    <span className="row gap-8">
                      <BellRing size={15} aria-hidden="true" /> Reply within one working day
                    </span>
                  </div>
                </div>
                <div className="cta-form">
                  <DemoRequestForm compact />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
