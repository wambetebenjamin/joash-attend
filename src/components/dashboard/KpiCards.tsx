'use client';

import { useEffect, useRef } from 'react';
import { CalendarCheck2, Clock3, UserCheck, UserX } from 'lucide-react';

interface Props {
  present: number;
  absent: number;
  late: number;
  monthRate: number;
  total: number;
  todayRate: number;
}

export default function KpiCards({ present, absent, late, monthRate, total, todayRate }: Props) {
  const scope = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    const animate = async () => {
      const { gsap } = await import('gsap');
      if (cancelled || !scope.current) return;
      ctx = gsap.context(() => {
        const nodes = scope.current?.querySelectorAll<HTMLElement>('[data-count]') ?? [];
        nodes.forEach((node) => {
          const target = Number(node.dataset.count ?? 0);
          const decimals = target % 1 === 0 ? 0 : 1;
          const proxy = { value: 0 };
          gsap.to(proxy, {
            value: target,
            duration: 1.15,
            ease: 'power2.out',
            onUpdate: () => {
              node.textContent = proxy.value.toFixed(decimals);
            },
          });
        });
        if (scope.current) {
          gsap.from(scope.current.querySelectorAll('[data-kpi]'), {
            y: 14,
            opacity: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
          });
        }
      }, scope);
    };

    animate();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  const cards = [
    {
      label: 'Present today',
      value: present,
      suffix: '',
      meta: `${todayRate}% of those expected`,
      icon: UserCheck,
      bg: 'var(--color-success-soft)',
      fg: 'var(--color-success-ink)',
    },
    {
      label: 'Absent today',
      value: absent,
      suffix: '',
      meta: `Out of ${total} expected today`,
      icon: UserX,
      bg: 'var(--color-danger-soft)',
      fg: 'var(--color-danger-ink)',
    },
    {
      label: 'Late today',
      value: late,
      suffix: '',
      meta: 'Beyond the grace period',
      icon: Clock3,
      bg: 'var(--color-warning-soft)',
      fg: 'var(--color-warning-ink)',
    },
    {
      label: 'Attendance this month',
      value: monthRate,
      suffix: '%',
      meta: 'Present or late, working days',
      icon: CalendarCheck2,
      bg: 'var(--color-primary-100)',
      fg: 'var(--color-primary-700)',
    },
  ];

  return (
    <div className="kpi-grid" ref={scope}>
      {cards.map((card) => (
        <article className="kpi-card" key={card.label} data-kpi>
          <div className="kpi-top">
            <span className="kpi-label">{card.label}</span>
            <span className="kpi-icon" style={{ background: card.bg, color: card.fg }}>
              <card.icon size={17} aria-hidden="true" />
            </span>
          </div>
          <p className="kpi-value">
            <span data-count={card.value}>{card.value}</span>
            {card.suffix}
          </p>
          <p className="kpi-meta">{card.meta}</p>
        </article>
      ))}
    </div>
  );
}
