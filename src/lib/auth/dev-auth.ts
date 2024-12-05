import { AuthUser } from "./types";

export const devUsers: AuthUser[] = [
  {
    id: "admin-dev",
    email: "admin@dev.local",
    name: "Admin User",
    role: "ADMIN",
    isApproved: true,
  },
  {
    id: "user-dev",
    email: "user@dev.local",
    name: "Regular User",
    role: "USER",
    isApproved: true,
  },
  {
    id: "pending-dev",
    email: "pending@dev.local",
    name: "Pending User",
    role: "USER",
    isApproved: false,
  },
];

export function isDevLoginEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === 'true' || process.env.NODE_ENV === 'development';
} 