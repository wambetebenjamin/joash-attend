'use client';

import { useRef, useState } from 'react';
import { Check, Plus, Upload, X } from 'lucide-react';
import type { OrganisationSettings } from '@/types';

interface Props {
  initialSettings: OrganisationSettings;
}

export default function SettingsPanel({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [newLeaveType, setNewLeaveType] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const save = async () => {
    setBusy(true);
    setFeedback(null);
    try {
      const { logoUrl: _logoUrl, ...editable } = settings;
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editable),
      });
      const payload = (await response.json()) as { settings?: OrganisationSettings; error?: string };
      if (!response.ok || !payload.settings) {
        setFeedback({ kind: 'error', text: payload.error ?? 'Settings could not be saved.' });
        return;
      }
      setSettings(payload.settings);
      setFeedback({ kind: 'success', text: 'Organisation settings saved. New clock-ins use these rules.' });
    } catch {
      setFeedback({ kind: 'error', text: 'Network error. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    setFeedback(null);
    try {
      const body = new FormData();
      body.append('logo', file);
      const response = await fetch('/api/settings/logo', { method: 'POST', body });
      const payload = (await response.json()) as { logoUrl?: string; stored?: boolean; error?: string };
      if (!response.ok || !payload.logoUrl) {
        setFeedback({ kind: 'error', text: payload.error ?? 'The logo could not be uploaded.' });
        return;
      }
      setSettings((current) => ({ ...current, logoUrl: payload.logoUrl ?? null }));
      setFeedback({
        kind: 'success',
        text: payload.stored
          ? 'Logo uploaded to Vercel Blob.'
          : 'BLOB_READ_WRITE_TOKEN is not configured, so the logo is stored inline for this demo.',
      });
    } catch {
      setFeedback({ kind: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Organisation settings</h1>
          <p>Working hours and the grace period drive how every clock-in is classified.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={save} disabled={busy}>
          {busy ? 'Saving' : 'Save changes'}
        </button>
      </div>

      {feedback ? (
        <p className={`notice notice-${feedback.kind}`} role="status" style={{ marginBottom: 14 }}>
          {feedback.text}
        </p>
      ) : null}

      <div className="dash-grid" style={{ marginTop: 0 }}>
        <div className="dash-col">
          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Organisation identity</h2>
                <p>Shown on reports, emails and the staff portal.</p>
              </div>
            </div>
            <div className="stack gap-16">
              <div className="field">
                <label htmlFor="org-name">Organisation name</label>
                <input
                  id="org-name"
                  value={settings.name}
                  onChange={(event) => setSettings({ ...settings, name: event.target.value })}
                />
              </div>

              <div>
                <p className="field-hint" style={{ marginBottom: 8, fontWeight: 600 }}>Organisation logo</p>
                <div className="row gap-16 wrap">
                  <div
                    style={{
                      width: 92,
                      height: 92,
                      borderRadius: 16,
                      border: '1px dashed var(--color-neutral-200)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      background: 'var(--color-canvas-muted)',
                    }}
                  >
                    {settings.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={settings.logoUrl} alt="Organisation logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span className="tiny" style={{ textAlign: 'center' }}>No logo yet</span>
                    )}
                  </div>
                  <div className="stack gap-8">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/svg+xml,image/jpeg"
                      className="visually-hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) uploadLogo(file);
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload size={14} aria-hidden="true" /> {uploading ? 'Uploading' : 'Upload logo'}
                    </button>
                    <span className="field-hint">PNG, JPG or SVG. Maximum 2 MB. Stored in Vercel Blob.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Working hours and lateness</h2>
                <p>Clock-ins after the grace period are marked late.</p>
              </div>
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="work-start">Work starts</label>
                <input
                  id="work-start"
                  type="time"
                  value={settings.workStart}
                  onChange={(event) => setSettings({ ...settings, workStart: event.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="work-end">Work ends</label>
                <input
                  id="work-end"
                  type="time"
                  value={settings.workEnd}
                  onChange={(event) => setSettings({ ...settings, workEnd: event.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="grace">Grace period, minutes</label>
                <input
                  id="grace"
                  type="number"
                  min={0}
                  max={120}
                  value={settings.graceMinutes}
                  onChange={(event) => setSettings({ ...settings, graceMinutes: Number(event.target.value) })}
                />
                <span className="field-hint">Staff clocking in within this window are still present.</span>
              </div>
              <div className="field">
                <label htmlFor="payroll">Payroll export format</label>
                <select
                  id="payroll"
                  value={settings.payrollFormat}
                  onChange={(event) =>
                    setSettings({ ...settings, payrollFormat: event.target.value as OrganisationSettings['payrollFormat'] })
                  }
                >
                  <option value="csv">CSV, generic</option>
                  <option value="xlsx">XLSX workbook</option>
                  <option value="sage">Sage payroll</option>
                  <option value="quickbooks">QuickBooks</option>
                </select>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Leave types</h2>
                <p>These appear in the staff leave request form.</p>
              </div>
            </div>
            <div className="row wrap gap-8">
              {settings.leaveTypes.map((type) => (
                <span key={type} className="chip">
                  {type}
                  <button
                    type="button"
                    aria-label={`Remove ${type}`}
                    onClick={() => setSettings({ ...settings, leaveTypes: settings.leaveTypes.filter((item) => item !== type) })}
                    style={{ border: 0, background: 'transparent', color: 'inherit', display: 'inline-flex' }}
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
            <div className="row gap-8" style={{ marginTop: 16 }}>
              <input
                className="grow"
                value={newLeaveType}
                onChange={(event) => setNewLeaveType(event.target.value)}
                placeholder="Add a leave type"
                aria-label="New leave type"
                style={{ border: '1px solid var(--color-hairline)', borderRadius: 10, padding: '10px 12px', fontFamily: 'inherit' }}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={newLeaveType.trim().length < 3}
                onClick={() => {
                  const value = newLeaveType.trim();
                  if (!value || settings.leaveTypes.includes(value)) return;
                  setSettings({ ...settings, leaveTypes: [...settings.leaveTypes, value] });
                  setNewLeaveType('');
                }}
              >
                <Plus size={14} aria-hidden="true" /> Add
              </button>
            </div>
          </section>
        </div>

        <div className="dash-col">
          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Email notifications</h2>
                <p>Sent through nodemailer when SMTP is configured.</p>
              </div>
            </div>
            <div className="stack">
              {[
                { key: 'notifyLate' as const, label: 'Late arrival alerts', copy: 'Email HR when someone clocks in after the grace period.' },
                { key: 'notifyAbsent' as const, label: 'Absenteeism alerts', copy: 'Daily digest of staff with three or more consecutive absences.' },
                { key: 'notifyLeave' as const, label: 'Leave request alerts', copy: 'Notify approvers when a request is submitted.' },
              ].map((row) => (
                <div key={row.key} className="pref-row">
                  <div>
                    <strong>{row.label}</strong>
                    <small>{row.copy}</small>
                  </div>
                  <button
                    type="button"
                    className="switch"
                    data-on={settings[row.key]}
                    aria-pressed={settings[row.key]}
                    aria-label={row.label}
                    onClick={() => setSettings({ ...settings, [row.key]: !settings[row.key] })}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <div>
                <h2 className="heading-4">Compliance</h2>
                <p>How Joash Attend handles attendance data.</p>
              </div>
            </div>
            <ul className="stack gap-12" style={{ fontSize: '0.85rem', color: 'var(--color-ink-500)' }}>
              {[
                'Records held in region and processed under the Kenya Data Protection Act 2019.',
                'Biometric templates are stored as irreversible hashes, never raw fingerprints.',
                'Retention defaults to 24 months, configurable in your data processing agreement.',
                'Staff can request an export of their own record from the member portal.',
              ].map((item) => (
                <li key={item} className="row gap-8" style={{ alignItems: 'flex-start' }}>
                  <Check size={15} style={{ color: 'var(--color-success)', marginTop: 2, flex: 'none' }} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
