import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { findUserByCredentials } from "@/lib/timesheet-store";

const ONE_DAY = 60 * 60 * 24;
const THIRTY_DAYS = ONE_DAY * 30;

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  // Cookie upper bound = longest "remember me" session.
  // Actual JWT expiry is shortened in the jwt callback when remember is off.
  session: {
    strategy: "jwt",
    maxAge: THIRTY_DAYS,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        const email = credentials?.email ?? "";
        const password = credentials?.password ?? "";
        const remember =
          credentials?.remember === "true" || credentials?.remember === "on";
        const user = findUserByCredentials(email, password);

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          remember,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.remember = Boolean(user.remember);
        const maxAge = token.remember ? THIRTY_DAYS : ONE_DAY;
        token.exp = Math.floor(Date.now() / 1000) + maxAge;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
      }

      return session;
    },
  },
};
