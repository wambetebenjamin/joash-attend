'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Plus, RefreshCw, ScanFace, Wifi, WifiOff, X } from 'lucide-react';
import type { BiometricDevice } from '@/types';
import { useRecaptcha } from '@/components/system/useRecaptcha';

interface Props {
  initialDevices: BiometricDevice[];
  locations: string[];
}

const relative = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

export default function DeviceManager({ initialDevices, locations }: Props) {
  const { execute } = useRecaptcha();
  const [devices, setDevices] = useState(initialDevices);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ deviceId: '', location: locations[0] ?? '', type: 'fingerprint' });
  const [busy, setBusy] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [lastSyncResult, setLastSyncResult] = useState<{
    pulledRecords: number;
    latencyMs: number;
    deviceId: string;
  } | null>(null);

  const addDevice = async () => {
    setBusy(true);
    setFeedback(null);
    const recaptchaToken = await execute('device_create');
    try {
      const response = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });
      const payload = (await response.json()) as { device?: BiometricDevice; error?: string };
      if (!response.ok || !payload.device) {
        setFeedback({ kind: 'error', text: payload.error ?? 'The device could not be registered.' });
        return;
      }
      setDevices((current) => [payload.device as BiometricDevice, ...current]);
      setFeedback({ kind: 'success', text: `${payload.device.deviceId} registered at ${payload.device.location}.` });
      setModal(false);
      setForm({ deviceId: '', location: locations[0] ?? '', type: 'fingerprint' });
    } catch {
      setFeedback({ kind: 'error', text: 'Network error. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const sync = async (device: BiometricDevice) => {
    setSyncing(device.id);
    setFeedback(null);
    try {
      const response = await fetch('/api/devices/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: device.deviceId }),
      });
      const payload = (await response.json()) as {
        pulledRecords?: number;
        latencyMs?: number;
        devices?: BiometricDevice[];
        error?: string;
      };
      if (!response.ok) {
        setFeedback({ kind: 'error', text: payload.error ?? 'Sync failed.' });
        return;
      }
      if (payload.devices) setDevices(payload.devices);
      setLastSyncResult({
        pulledRecords: payload.pulledRecords ?? 0,
        latencyMs: payload.latencyMs ?? 0,
        deviceId: device.deviceId,
      });
      setFeedback({
        kind: 'success',
        text: `Mock sync complete for ${device.deviceId}. ${payload.pulledRecords ?? 0} clock events pulled in ${
          payload.latencyMs ?? 0
        } ms.`,
      });
    } catch {
      setFeedback({ kind: 'error', text: 'The mock sync endpoint did not respond.' });
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Biometric devices</h1>
          <p>
            {devices.filter((device) => device.status === 'online').length} online,{' '}
            {devices.filter((device) => device.status === 'offline').length} offline. Device sync is simulated, no
            hardware SDK is required.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setModal(true)}>
          <Plus size={16} aria-hidden="true" /> Add device
        </button>
      </div>

      {feedback ? (
        <p className={`notice notice-${feedback.kind}`} role="status" style={{ marginBottom: 14 }}>
          {feedback.text}
        </p>
      ) : null}

      <div className="grid grid-2">
        {devices.map((device, index) => (
          <motion.section
            key={device.id}
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: index * 0.05 }}
            aria-label={`Device ${device.deviceId}`}
          >
            <div className="card-header">
              <div className="row gap-12">
                <span className={`icon-tile ${device.status === 'online' ? 'green' : 'red'}`} style={{ marginBottom: 0 }}>
                  {device.type === 'fingerprint' ? <Fingerprint size={20} aria-hidden="true" /> : <ScanFace size={20} aria-hidden="true" />}
                </span>
                <div>
                  <h2 className="heading-4">{device.deviceId}</h2>
                  <p>{device.location}</p>
                </div>
              </div>
              <span
                className={device.status === 'online' ? 'badge badge-online' : 'badge badge-offline'}
                style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}
              >
                {device.status === 'online' ? <Wifi size={12} aria-hidden="true" /> : <WifiOff size={12} aria-hidden="true" />}
                {device.status}
              </span>
            </div>

            <div className="grid grid-2" style={{ gap: 12 }}>
              <div>
                <p className="tiny">Device type</p>
                <strong style={{ fontSize: '0.88rem', textTransform: 'capitalize' }}>
                  {device.type === 'face-id' ? 'Face ID' : 'Fingerprint'}
                </strong>
              </div>
              <div>
                <p className="tiny">Firmware</p>
                <strong style={{ fontSize: '0.88rem' }}>{device.firmware}</strong>
              </div>
              <div>
                <p className="tiny">Enrolled users</p>
                <strong style={{ fontSize: '0.88rem' }}>{device.enrolledUsers}</strong>
              </div>
              <div>
                <p className="tiny">Last sync</p>
                <strong style={{ fontSize: '0.88rem' }}>{relative(device.lastSync)}</strong>
              </div>
            </div>

            <div className="row between wrap gap-8" style={{ marginTop: 18 }}>
              <span className="tiny">{new Date(device.lastSync).toLocaleString('en-KE')}</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => sync(device)}
                disabled={syncing === device.id}
              >
                <RefreshCw size={14} aria-hidden="true" style={{ animation: syncing === device.id ? 'softPulse 1s infinite' : undefined }} />
                {syncing === device.id ? 'Syncing' : 'Sync now'}
              </button>
            </div>
          </motion.section>
        ))}
      </div>

      {lastSyncResult ? (
        <section className="card" style={{ marginTop: 16 }}>
          <div className="card-header">
            <div>
              <h2 className="heading-4">Last sync payload</h2>
              <p>Shape returned by POST /api/devices/sync for {lastSyncResult.deviceId}.</p>
            </div>
            <span className="badge badge-info">{lastSyncResult.latencyMs} ms</span>
          </div>
          <pre
            style={{
              background: 'var(--color-canvas-muted)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 12,
              padding: 16,
              fontSize: '0.76rem',
              overflowX: 'auto',
              margin: 0,
            }}
          >
{JSON.stringify(
  {
    status: 'synced',
    deviceId: lastSyncResult.deviceId,
    pulledRecords: lastSyncResult.pulledRecords,
    pushedRecords: 0,
    latencyMs: lastSyncResult.latencyMs,
    clockEvents: [{ staffCode: 'JA-0001', direction: 'clock-in', verification: 'fingerprint' }],
  },
  null,
  2,
)}
          </pre>
        </section>
      ) : null}

      {modal ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Add device">
          <div className="modal">
            <div className="modal-head">
              <div>
                <h2 className="heading-4">Register a device</h2>
                <p>No SDK connection is made. The device is stored in Vercel KV for the demo.</p>
              </div>
              <button type="button" className="icon-button" aria-label="Close" onClick={() => setModal(false)}>
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            <div className="stack gap-16">
              <div className="field">
                <label htmlFor="device-id">Device ID</label>
                <input
                  id="device-id"
                  value={form.deviceId}
                  onChange={(event) => setForm({ ...form, deviceId: event.target.value })}
                  placeholder="ZKT-FP-4410"
                />
                <span className="field-hint">Printed on the back of the terminal, for example ZKT-FP-4410.</span>
              </div>
              <div className="field">
                <label htmlFor="device-location">Location name</label>
                <input
                  id="device-location"
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                  placeholder="Nairobi Main Campus, Gate B"
                />
              </div>
              <div className="field">
                <label htmlFor="device-type">Device type</label>
                <select
                  id="device-type"
                  value={form.type}
                  onChange={(event) => setForm({ ...form, type: event.target.value })}
                >
                  <option value="fingerprint">Fingerprint</option>
                  <option value="face-id">Face ID</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={addDevice} disabled={busy || form.deviceId.length < 4}>
                {busy ? 'Registering' : 'Add device'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
