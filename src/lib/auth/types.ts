import 'next-auth';

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'USER';
  isApproved: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: AuthUser;
  }
} 