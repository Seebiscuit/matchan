import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { devUsers, isDevLoginEnabled } from "./dev-auth";
import { AuthUser } from "./types";
import { usersRepository } from "@/lib/api/repository/users";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(!isDevLoginEnabled ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ] : []),
    ...(isDevLoginEnabled ? [
      CredentialsProvider({
        id: "dev-login",
        name: "Development Login",
        credentials: {
          email: { label: "Email", type: "email" },
        },
        async authorize(credentials) {
          const email = credentials?.email;
          if (!email) return null;
          return usersRepository.findOrCreateFromEmail(email);
        },
      }),
    ] : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.role = (user as AuthUser).role;
        token.isApproved = (user as AuthUser).isApproved;
      }
      return {
        ...token,
        role: token.role ?? 'USER',
        isApproved: token.isApproved ?? false,
      };
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub!,
          role: token.role as 'ADMIN' | 'USER',
          isApproved: token.isApproved as boolean,
        },
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}; 