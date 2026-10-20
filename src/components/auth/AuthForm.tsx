'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, Fingerprint, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { useRecaptcha } from '@/components/system/useRecaptcha';
import RecaptchaFallback from '@/components/system/RecaptchaFallback';

interface Props {
  mode: 'signin' | 'signup';
  googleEnabled: boolean;
  callbackUrl?: string;
}

export default function AuthForm({ mode, googleEnabled, callbackUrl = '/admin/dashboard' }: Props) {
  const router = useRouter();
  const { execute } = useRecaptcha();
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [challenge, setChallenge] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setChallenge(false);
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '');
    const password = String(data.get('password') ?? '');
    const name = String(data.get('name') ?? '');
    setBusy(true);

    try {
      if (mode === 'signup') {
        const token = await execute('signup');
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            organisation: String(data.get('organisation') ?? ''),
            recaptchaToken: token,
          }),
        });
        const payload = (await response.json()) as { error?: string; challengeRequired?: boolean };
        if (!response.ok) {
          setError(payload.error ?? 'Unable to create the account.');
          setChallenge(Boolean(payload.challengeRequired));
          return;
        }
        setNotice('Account created with the member role. Signing you in.');
        const result = await signIn('credentials', { email, password, redirect: false });
        if (result?.error) {
          setError('Account created, but automatic sign in failed. Please sign in manually.');
          return;
        }
        router.push('/member/dashboard');
        router.refresh();
        return;
      }

      const token = await execute('signin');
      const result = await signIn('credentials', {
        email,
        password,
        recaptchaToken: token ?? '',
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setError('Those credentials were not recognised. Use the demo accounts below or sign up.');
        return;
      }
      router.push(email === 'admin@joashattend.co.ke' ? callbackUrl : '/member/dashboard');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = (kind: 'admin' | 'member') => {
    const form = document.getElementById('auth-form') as HTMLFormElement | null;
    if (!form) return;
    (form.elements.namedItem('email') as HTMLInputElement).value =
      kind === 'admin' ? 'admin@joashattend.co.ke' : 'staff@joashattend.co.ke';
    (form.elements.namedItem('password') as HTMLInputElement).value = 'attendance2026';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        background: 'var(--color-canvas)',
      }}
    >
      <div
        style={{
          padding: '40px clamp(24px, 5vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: 560,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Link href="/" className="brand" style={{ marginBottom: 32 }}>
          <span className="brand-mark">
            <Fingerprint size={20} aria-hidden="true" />
          </span>
          <span>
            Joash Attend
            <span className="brand-sub">Every clock-in. Counted and clear.</span>
          </span>
        </Link>

        <h1 className="display-2" style={{ fontSize: '2rem' }}>
          {mode === 'signin' ? 'Sign in to your workspace' : 'Create your organisation account'}
        </h1>
        <p className="lede" style={{ marginTop: 8 }}>
          {mode === 'signin'
            ? 'Admins land on the attendance overview. Staff and students land on their personal record.'
            : 'New accounts start with the member role. An administrator promotes staff to admin.'}
        </p>

        {googleEnabled ? (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-block"
              style={{ marginTop: 22 }}
              onClick={() => signIn('google', { callbackUrl })}
            >
              <span style={{ fontWeight: 700, color: '#4285f4' }}>G</span> Continue with Google
            </button>
            <div className="row gap-12" style={{ margin: '18px 0' }}>
              <hr className="divider grow" />
              <span className="tiny">or use email</span>
              <hr className="divider grow" />
            </div>
          </>
        ) : null}

        <form id="auth-form" className="stack gap-16" onSubmit={submit} style={{ marginTop: googleEnabled ? 0 : 22 }}>
          {mode === 'signup' ? (
            <>
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" required placeholder="Wanjiku Kamau" autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="organisation">Organisation</label>
                <input id="organisation" name="organisation" required placeholder="Nairobi Academy" autoComplete="organization" />
              </div>
            </>
          ) : null}

          <div className="field">
            <label htmlFor="email">Email address</label>
            <div className="search-input" style={{ width: '100%' }}>
              <Mail size={15} aria-hidden="true" />
              <input id="email" name="email" type="email" required placeholder="you@organisation.co.ke" autoComplete="email" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                placeholder="At least eight characters"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                style={{ paddingLeft: 36, paddingRight: 42 }}
              />
              <Lock size={15} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--color-muted)' }} aria-hidden="true" />
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: 4, top: 4, border: 0, width: 32, height: 32 }}
              >
                {showPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {error ? (
            <p className="notice notice-error" role="alert">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="notice notice-success" role="status">
              {notice}
            </p>
          ) : null}
          <RecaptchaFallback visible={challenge} onDismiss={() => setChallenge(false)} />

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
            {busy ? 'Please wait' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="tiny" style={{ marginTop: 16 }}>
          <ShieldCheck size={13} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 4 }} />
          Protected by reCAPTCHA v3. Biometric templates never leave the device registry.
        </p>

        {mode === 'signin' ? (
          <div className="card card-flat" style={{ marginTop: 22, background: 'var(--color-canvas-muted)' }}>
            <p className="tiny" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Demo accounts
            </p>
            <div className="stack gap-8" style={{ marginTop: 10 }}>
              <div className="row between gap-8 wrap">
                <span style={{ fontSize: '0.82rem' }}>
                  <User size={12} aria-hidden="true" style={{ verticalAlign: '-1px', marginRight: 4 }} />
                  <strong>Admin</strong> admin@joashattend.co.ke
                </span>
                <button type="button" className="btn btn-quiet btn-sm" onClick={() => fillDemo('admin')}>
                  Use admin
                </button>
              </div>
              <div className="row between gap-8 wrap">
                <span style={{ fontSize: '0.82rem' }}>
                  <User size={12} aria-hidden="true" style={{ verticalAlign: '-1px', marginRight: 4 }} />
                  <strong>Staff</strong> staff@joashattend.co.ke
                </span>
                <button type="button" className="btn btn-quiet btn-sm" onClick={() => fillDemo('member')}>
                  Use staff
                </button>
              </div>
              <p className="tiny">Password for both demo accounts: attendance2026</p>
            </div>
          </div>
        ) : null}

        <p className="tiny" style={{ marginTop: 22 }}>
          {mode === 'signin' ? (
            <>
              No account yet?{' '}
              <Link href="/auth/signup" style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already enrolled?{' '}
              <Link href="/auth/signin" style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>

      <div
        style={{
          background: 'var(--color-ink)',
          color: '#fff',
          padding: 'clamp(24px, 5vw, 56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 22,
        }}
      >
        <p className="eyebrow" style={{ color: '#bac8ff' }}>
          Built for Kenyan organisations
        </p>
        <h2 className="display-2" style={{ color: '#fff', fontSize: '1.9rem' }}>
          Attendance that payroll and the board can both sign off.
        </h2>
        <ul className="stack gap-12" style={{ color: '#c8ccdd', fontSize: '0.9rem' }}>
          {[
            'Live clock-in feed from fingerprint and face ID devices.',
            'Late and absenteeism alerts before the morning briefing.',
            'Leave approvals that update the attendance calendar.',
            'PDF and CSV reports ready for payroll and audits.',
          ].map((item) => (
            <li key={item} className="row gap-8" style={{ alignItems: 'flex-start' }}>
              <span className="dot" style={{ color: '#546fff', marginTop: 7 }} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <Link href="/demo" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          Explore the demo dashboard
        </Link>
        <p className="tiny" style={{ color: '#8e92bc' }}>
          Joash Attend processes attendance data under the Kenya Data Protection Act 2019.
        </p>
      </div>
    </div>
  );
}
