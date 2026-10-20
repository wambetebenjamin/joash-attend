'use client';

import { PropsWithChildren, useEffect, useRef, useState } from 'react';

interface RevealProps {
  delay?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, className }: PropsWithChildren<RevealProps>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ''}`}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
