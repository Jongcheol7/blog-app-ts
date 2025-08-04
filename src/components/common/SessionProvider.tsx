"use client";
import { LayoutProps } from "@/types/layout";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({ children }: LayoutProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
