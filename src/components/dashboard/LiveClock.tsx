'use client';

import { useEffect, useState } from 'react';

export default function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="chip" aria-label="Current time in Nairobi">
      <span className="dot live-dot" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
      {now
        ? `${now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Africa/Nairobi' })} EAT`
        : 'Nairobi time'}
    </span>
  );
}
