import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database" as const,
  },
  callbacks: {
    async session({ session, user }: { session: Session; user: AdapterUser }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isAdmin = user.email === process.env.ADMIN_EMAIL;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
