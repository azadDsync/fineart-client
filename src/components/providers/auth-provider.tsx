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
      const u = data.user;
      const toISO = (val: string | Date | null | undefined) =>
        !val
          ? new Date().toISOString()
          : typeof val === "string"
          ? val
          : val.toISOString();
      // safely read an optional expires value that may not exist on the typed user
      const expiresVal = (() => {
        const obj = u as Record<string, unknown>;
        const raw = obj["expiresAt"] ?? obj["expires_at"] ?? undefined;
        return typeof raw === "string" || raw instanceof Date ? raw : undefined;
      })();
      setUser({
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: Boolean(u.emailVerified),
        image: u.image || undefined,
        role: (u.role?.toUpperCase?.() === "ADMIN" ? "ADMIN" : "MEMBER") as
          | "ADMIN"
          | "MEMBER",
        isStale: Boolean(u.isStale) || false,
        expiresAt: expiresVal ? toISO(expiresVal) : undefined,
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
