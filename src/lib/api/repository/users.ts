import { prisma } from "@/lib/db/prisma";
import { UserRole } from "@prisma/client";
import { devUsers } from "@/lib/auth/dev-auth";

export interface CreateUserInput {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  isApproved?: boolean;
}

export const usersRepository = {
  findOrCreateFromEmail: async (email: string) => {
    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      // Check dev users
      const devUser = devUsers.find(u => u.email === email);
      if (devUser) {
        // Create user from dev data
        user = await prisma.user.create({
          data: {
            id: devUser.id,
            email: devUser.email,
            name: devUser.name,
            role: devUser.role,
            isApproved: devUser.isApproved,
            password: '', // Required by schema but not used with OAuth
          }
        });
      }
    }

    return user;
  },

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  create: async (input: CreateUserInput) => {
    return prisma.user.create({
      data: {
        id: input.id,
        email: input.email,
        name: input.name,
        role: input.role ?? 'USER',
        isApproved: input.isApproved ?? false,
        password: '', // Required by schema but not used with OAuth
      }
    });
  },
}; 