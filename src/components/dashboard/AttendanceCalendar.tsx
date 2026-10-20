'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AttendanceRecord } from '@/types';
import { formatTime, monthMatrix, parseISO } from '@/lib/date';

interface Props {
  records: AttendanceRecord[];
  initialYear: number;
  initialMonth: number;
}

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AttendanceCalendar({ records, initialYear, initialMonth }: Props) {
  const [cursor, setCursor] = useState({ year: initialYear, month: initialMonth });
  const lookup = useMemo(() => new Map(records.map((record) => [record.date, record])), [records]);
  const cells = useMemo(() => monthMatrix(cursor.year, cursor.month), [cursor]);
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString('en-KE', {
    month: 'long',
    year: 'numeric',
  });

  const shift = (direction: number) => {
    const next = new Date(cursor.year, cursor.month + direction, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
  };

  return (
    <div>
      <div className="row between" style={{ marginBottom: 14 }}>
        <button type="button" className="icon-button" aria-label="Previous month" onClick={() => shift(-1)}>
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <strong style={{ fontSize: '0.92rem' }}>{monthLabel}</strong>
        <button type="button" className="icon-button" aria-label="Next month" onClick={() => shift(1)}>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="calendar" role="grid" aria-label={`Attendance calendar for ${monthLabel}`}>
        {weekdayLabels.map((day) => (
          <div key={day} className="calendar-head" role="columnheader">
            {day}
          </div>
        ))}
        {cells.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="calendar-cell empty" aria-hidden="true" />;
          }
          const record = lookup.get(date);
          const dayNumber = parseISO(date).getDate();
          const status = record?.status;
          return (
            <div
              key={date}
              className={`calendar-cell ${status ?? ''}`}
              role="gridcell"
              title={
                record
                  ? `${date}: ${record.status}${record.clockIn ? `, in ${formatTime(record.clockIn)}` : ''}${
                      record.clockOut ? `, out ${formatTime(record.clockOut)}` : ''
                    }`
                  : `${date}: no record`
              }
            >
              <span className="day-number">{dayNumber}</span>
              <span style={{ fontSize: '0.6rem', textTransform: 'capitalize', fontWeight: 600 }}>
                {status ?? 'Off'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <span>
          <i className="swatch" style={{ background: 'var(--color-success-soft)' }} aria-hidden="true" />
          Present
        </span>
        <span>
          <i className="swatch" style={{ background: '#fff3dd' }} aria-hidden="true" />
          Late
        </span>
        <span>
          <i className="swatch" style={{ background: 'var(--color-danger-soft)' }} aria-hidden="true" />
          Absent
        </span>
        <span>
          <i className="swatch" style={{ background: 'var(--color-canvas-muted)', border: '1px solid var(--color-hairline)' }} aria-hidden="true" />
          Leave
        </span>
      </div>
    </div>
  );
}
