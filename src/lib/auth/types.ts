import 'next-auth';
import { UserRole } from '@prisma/client';

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  isApproved: boolean;
};

declare module 'next-auth' {
  interface Session {
    user: AuthUser;
  }
} 