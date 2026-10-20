'use client';

import { useCallback, useEffect, useRef } from 'react';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export const useRecaptcha = () => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
  const loaded = useRef(false);

  useEffect(() => {
    if (!siteKey || loaded.current) return;
    const existing = document.querySelector<HTMLScriptElement>('script[data-joash-recaptcha]');
    if (existing) {
      loaded.current = true;
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.joashRecaptcha = 'true';
    document.head.appendChild(script);
    loaded.current = true;
  }, [siteKey]);

  const execute = useCallback(
    async (action: string): Promise<string | undefined> => {
      if (!siteKey || !window.grecaptcha) return undefined;
      try {
        return await new Promise<string>((resolve, reject) => {
          window.grecaptcha?.ready(() => {
            window.grecaptcha
              ?.execute(siteKey, { action })
              .then(resolve)
              .catch(reject);
          });
        });
      } catch {
        return undefined;
      }
    },
    [siteKey],
  );

  return { execute, enabled: Boolean(siteKey) };
};
