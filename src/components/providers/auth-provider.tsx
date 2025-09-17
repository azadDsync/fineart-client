"use client";

import { useEffect, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading } = useAuthStore();

  const { data, isPending, error } = authClient.useSession();

  // Reflect loading state directly
  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);

  // Map session user to store
  useEffect(() => {
    if (data?.user) {
      const u = data.user as any;
      const toISO = (val: string | Date | null | undefined) =>
        !val ? new Date().toISOString() : typeof val === "string" ? val : val.toISOString();
      setUser({
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image || undefined,
        role: (u.role?.toUpperCase?.() === "ADMIN" ? "ADMIN" : "MEMBER") as "ADMIN" | "MEMBER",
        isStale: Boolean(u.isStale) || false,
        expiresAt: u.expiresAt ? toISO(u.expiresAt) : undefined,
        createdAt: toISO(u.createdAt),
        updatedAt: toISO(u.updatedAt),
      });
    } else if (!isPending) {
      setUser(null);
    }
  }, [data, isPending, setUser]);

  useEffect(() => {
    if (error) console.error("Session error:", error);
  }, [error]);

  return <>{children}</>;
}