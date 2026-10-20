'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      type="button"
      className={compact ? 'icon-button' : 'btn btn-ghost btn-sm'}
      onClick={() => signOut({ callbackUrl: '/' })}
      aria-label="Sign out"
      title="Sign out"
      style={compact ? undefined : { width: '100%' }}
    >
      <LogOut size={compact ? 16 : 15} aria-hidden="true" />
      {compact ? null : 'Sign out'}
    </button>
  );
}
