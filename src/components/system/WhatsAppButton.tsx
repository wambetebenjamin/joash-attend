'use client';

import { MessageCircle } from 'lucide-react';

const MESSAGE =
  'Hello Joash Attend, I would like to set up a biometric attendance system for my organisation.';

export default function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254112272061';
  const href = `https://wa.me/${number}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <>
      <a
        className="whatsapp-button float-button"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle size={26} strokeWidth={2.2} aria-hidden="true" />
      </a>
      <span className="float-tooltip right" role="tooltip">
        Chat with us on WhatsApp
      </span>
    </>
  );
}
