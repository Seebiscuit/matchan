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