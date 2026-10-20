'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';
import type { LiveEvent } from '@/types';
import { formatTime } from '@/lib/date';

interface Props {
  initialEvents: LiveEvent[];
  initialCursor: number;
}

export default function LiveFeed({ initialEvents, initialCursor }: Props) {
  const [events, setEvents] = useState<LiveEvent[]>(initialEvents);
  const [cursor, setCursor] = useState(initialCursor);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [polling, setPolling] = useState(false);
  const cursorRef = useRef(initialCursor);

  const poll = useCallback(async () => {
    setPolling(true);
    try {
      const response = await fetch(`/api/attendance/live?since=${cursorRef.current}`, { cache: 'no-store' });
      if (!response.ok) return;
      const payload = (await response.json()) as { events: LiveEvent[]; cursor: number };
      if (payload.events.length) {
        setEvents((current) => [...payload.events, ...current].slice(0, 14));
      }
      cursorRef.current = payload.cursor;
      setCursor(payload.cursor);
      setUpdatedAt(new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // A failed poll keeps the previous list on screen.
    } finally {
      setPolling(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(poll, 30000);
    return () => window.clearInterval(timer);
  }, [poll]);

  return (
    <section className="card" aria-label="Live clock-in feed">
      <div className="card-header">
        <div>
          <h2 className="heading-4">Live clock-in feed</h2>
          <p>Polling the device bridge every 30 seconds{cursor ? `, ${cursor} events today` : ''}.</p>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={poll}
          disabled={polling}
          aria-label="Refresh the live feed now"
        >
          <RefreshCw size={14} aria-hidden="true" style={{ animation: polling ? 'softPulse 1s infinite' : undefined }} />
          {polling ? 'Syncing' : 'Refresh'}
        </button>
      </div>

      <div className="feed" role="log" aria-live="polite">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              className="feed-item"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <span
                className="icon-tile"
                style={{
                  marginBottom: 0,
                  width: 34,
                  height: 34,
                  background: event.type === 'clock-in' ? 'var(--color-success-soft)' : 'var(--color-canvas-muted)',
                  color: event.type === 'clock-in' ? 'var(--color-success-ink)' : 'var(--color-ink-500)',
                }}
              >
                {event.type === 'clock-in' ? (
                  <ArrowDownLeft size={15} aria-hidden="true" />
                ) : (
                  <ArrowUpRight size={15} aria-hidden="true" />
                )}
              </span>
              <div className="feed-main">
                <strong>{event.staffName}</strong>
                <small>
                  {event.department} · {event.type === 'clock-in' ? 'Clock in' : 'Clock out'}
                </small>
              </div>
              <span className={event.status === 'late' ? 'badge badge-late' : 'badge badge-present'}>
                {event.status}
              </span>
              <span className="feed-time">{formatTime(event.time)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {!events.length ? <p className="feed-empty">No clock-ins recorded yet today.</p> : null}
      </div>
      <p className="tiny" style={{ marginTop: 10 }}>
        {updatedAt ? `Last synced at ${updatedAt} EAT. ` : ''}Mock data from the simulated device bridge.
      </p>
    </section>
  );
}
