'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const SCRIPT =
  'Welcome to Joash Attend. This is a biometric attendance system built for Kenyan schools, offices, and organisations. Staff and students clock in with a fingerprint or face ID device, and managers get a live dashboard showing who is present, who is late, and who is absent, right now. Generate payroll-ready reports, manage leave requests, and track every department from one screen. Request a demo and see it in action.';

export default function VoiceTour() {
  const [supported, setSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [armed, setArmed] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(SCRIPT);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.lang = 'en-KE';
    utterance.volume = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setHasPlayed(true);
    };
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setHasPlayed(true);
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }

    const arm = (event?: Event) => {
      if (armed) return;
      const target = event?.target as HTMLElement | null;
      if (target?.closest('.voice-button')) return;
      setArmed(true);
      speak();
      window.removeEventListener('scroll', arm);
      window.removeEventListener('pointerdown', arm);
      window.removeEventListener('keydown', arm);
    };

    window.addEventListener('scroll', arm, { passive: true, once: true });
    window.addEventListener('pointerdown', arm, { once: true });
    window.addEventListener('keydown', arm, { once: true });

    return () => {
      window.removeEventListener('scroll', arm);
      window.removeEventListener('pointerdown', arm);
      window.removeEventListener('keydown', arm);
      window.speechSynthesis.cancel();
    };
  }, [armed, speak]);

  const label = speaking || !hasPlayed ? 'Site voice tour, click to mute' : 'Replay tour';

  return (
    <>
      <button
        type="button"
        className="voice-button float-button"
        data-speaking={speaking}
        aria-label={label}
        aria-pressed={speaking}
        title="Hear what this site is about"
        onClick={() => {
          if (speaking) {
            stop();
          } else {
            speak();
          }
        }}
      >
        {speaking ? (
          <VolumeX size={24} strokeWidth={2.1} aria-hidden="true" />
        ) : (
          <Volume2 size={24} strokeWidth={2.1} aria-hidden="true" />
        )}
      </button>
      <span className="float-tooltip left" role="tooltip">
        {speaking ? 'Click to mute the tour' : hasPlayed ? 'Replay tour' : 'Hear what this site is about'}
      </span>
      {!supported ? <span className="sr-only">Voice tour is not supported in this browser.</span> : null}
    </>
  );
}
