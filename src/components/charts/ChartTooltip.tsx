'use client';

import type { TooltipProps } from 'recharts';

interface Props extends TooltipProps<number, string> {
  unit?: string;
  suffix?: string;
}

export default function ChartTooltip({ active, payload, label, unit = '', suffix = '' }: Props) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--color-hairline)',
        borderRadius: 10,
        padding: '10px 12px',
        boxShadow: '0 12px 30px rgba(20,21,34,0.12)',
        fontSize: '0.78rem',
      }}
    >
      <p style={{ fontWeight: 700, color: 'var(--color-ink)', marginBottom: 6 }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey as string} style={{ color: entry.color, display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          <span style={{ textTransform: 'capitalize' }}>{String(entry.name)}</span>
          <strong style={{ color: 'var(--color-ink)' }}>
            {entry.value}
            {unit}
            {suffix}
          </strong>
        </p>
      ))}
    </div>
  );
}
