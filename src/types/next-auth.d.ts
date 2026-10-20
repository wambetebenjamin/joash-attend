import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: 'admin' | 'member';
    staffId?: string;
  }

  interface Session {
    user: {
      id?: string;
      role?: 'admin' | 'member';
      staffId?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'admin' | 'member';
    staffId?: string;
  }
}
