import { AuthUser } from "./types";

export const devUsers: AuthUser[] = [
  {
    id: "admin-dev",
    email: "admin@dev.local",
    name: "Sima",
    role: "ADMIN",
    isApproved: true,
  },
  {
    id: "atara",
    email: "atara@gmail.com",
    name: "Atara",
    role: "USER",
    isApproved: true,
  },
  {
    id: "miri",
    email: "miri@gmail.com",
    name: "Miri",
    role: "USER",
    isApproved: true,
  },
  {
    id: "gary",
    email: "gary@gmail.com",
    name: "Gary",
    role: "ADMIN",
    isApproved: true,
  },
  {
    id: "alysa",
    email: "alysa@gmail.com",
    name: "Alysa",
    role: "USER",
    isApproved: true,
  },
  {
    id: "user-dev",
    email: "user@dev.local",
    name: "Regular User",
    role: "USER",
    isApproved: true,
  },
];

export function isDevLoginEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_DEV_LOGIN === 'true' || process.env.NODE_ENV === 'development';
} 