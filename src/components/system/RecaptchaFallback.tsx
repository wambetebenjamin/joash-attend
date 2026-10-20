'use client';

interface Props {
  visible: boolean;
  onDismiss?: () => void;
}

export default function RecaptchaFallback({ visible, onDismiss }: Props) {
  if (!visible) return null;
  const v2Key = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY;

  return (
    <div className="notice notice-warn" role="alert" style={{ marginTop: 12 }}>
      <strong>Extra verification needed.</strong>{' '}
      {v2Key
        ? 'Please complete the checkbox challenge below and submit again.'
        : 'Our risk check could not confirm this submission. Please try again, or contact us on WhatsApp for help.'}
      {v2Key ? <div className="g-recaptcha" data-sitekey={v2Key} style={{ marginTop: 10 }} /> : null}
      {onDismiss ? (
        <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={onDismiss}>
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
