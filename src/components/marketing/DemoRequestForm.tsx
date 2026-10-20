'use client';

import { FormEvent, useState } from 'react';
import { useRecaptcha } from '@/components/system/useRecaptcha';
import RecaptchaFallback from '@/components/system/RecaptchaFallback';

interface Props {
  compact?: boolean;
}

export default function DemoRequestForm({ compact = false }: Props) {
  const { execute } = useRecaptcha();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [challenge, setChallenge] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    setChallenge(false);

    const token = await execute('contact');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          organisation: data.get('organisation'),
          phone: data.get('phone'),
          size: data.get('size'),
          message: data.get('message'),
          recaptchaToken: token,
        }),
      });
      const payload = (await response.json()) as { error?: string; challengeRequired?: boolean };
      if (!response.ok) {
        setStatus('error');
        setMessage(payload.error ?? 'We could not send the request. Please try again.');
        setChallenge(Boolean(payload.challengeRequired));
        return;
      }
      setStatus('sent');
      setMessage('Request received. Our Nairobi team will reply on WhatsApp or email within one working day.');
      form.reset();
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again or reach us on WhatsApp.');
    }
  };

  if (status === 'sent') {
    return (
      <div className="notice notice-success" role="status">
        <strong>Demo request received.</strong>
        <p style={{ marginTop: 6 }}>{message}</p>
        <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setStatus('idle')}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="stack gap-12">
      <div className={compact ? 'stack gap-12' : 'form-grid'}>
        <div className="field">
          <label htmlFor="demo-name">Full name</label>
          <input id="demo-name" name="name" required minLength={2} placeholder="Wanjiku Kamau" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="demo-email">Work email</label>
          <input id="demo-email" name="email" type="email" required placeholder="you@organisation.co.ke" autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="demo-organisation">Organisation</label>
          <input id="demo-organisation" name="organisation" required placeholder="Nairobi Academy" autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor="demo-phone">Phone or WhatsApp</label>
          <input id="demo-phone" name="phone" required placeholder="+254 7XX XXX XXX" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="demo-size">People to enrol</label>
          <select id="demo-size" name="size" defaultValue="51-200">
            <option value="1-50">1 to 50</option>
            <option value="51-200">51 to 200</option>
            <option value="201-500">201 to 500</option>
            <option value="500+">More than 500</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="demo-message">What do you want to track?</label>
          <input id="demo-message" name="message" required minLength={10} defaultValue="We need daily staff attendance and lateness reports." />
        </div>
      </div>

      <div className="row wrap between gap-12">
        <p className="tiny" style={{ maxWidth: 320 }}>
          By requesting a demo you agree to our privacy policy. We never sell your data.
        </p>
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending request' : 'Request a Demo'}
        </button>
      </div>

      {status === 'error' ? (
        <p className="notice notice-error" role="alert">
          {message}
        </p>
      ) : null}
      <RecaptchaFallback visible={challenge} onDismiss={() => setChallenge(false)} />
      <p className="tiny">Protected by reCAPTCHA v3. Google privacy and terms apply.</p>
    </form>
  );
}
