import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import type { Provider } from 'next-auth/providers';
import { findUser, verifyPassword } from './users';
import { verifyRecaptcha } from './recaptcha';
import type { Role } from '@/types';

const providers: Provider[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

providers.push(
  Credentials({
    id: 'credentials',
    name: 'Organisation account',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
      recaptchaToken: { label: 'reCAPTCHA token', type: 'text' },
    },
    authorize: async (credentials) => {
      const email = typeof credentials?.email === 'string' ? credentials.email : '';
      const password = typeof credentials?.password === 'string' ? credentials.password : '';
      if (!email || !password) return null;
      const captcha = await verifyRecaptcha(
        typeof credentials?.recaptchaToken === 'string' ? credentials.recaptchaToken : undefined,
        'signin',
      );
      if (!captcha.success) return null;
      const user = await findUser(email);
      if (!user) return null;
      if (!verifyPassword(password, user.passwordHash)) return null;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        staffId: user.staffId,
      };
    },
  }),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET ?? 'joash-attend-development-secret-change-me',
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 },
  providers,
  pages: { signIn: '/auth/signin', error: '/auth/signin' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? 'member';
        token.staffId = user.staffId;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as Role) ?? 'member';
        session.user.staffId = token.staffId as string | undefined;
        session.user.id = (token.id as string) ?? token.sub;
      }
      return session;
    },
  },
});
