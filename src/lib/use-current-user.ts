"use client";

import { authClient } from "./auth-client";
import { useAuthStore } from "@/store";
import type { User } from "@/types/api";

/**
 * useCurrentUser merges the reactive Better Auth session with our persisted Zustand store.
 * Prefer this over directly reading the store when you need live auth status (loading, etc.).
 */
export function useCurrentUser() {
  const { data, isPending, error } = authClient.useSession();
  const user = useAuthStore((s) => s.user);
  let current: User | null = user;
  if (!current && data?.user) {
    const raw = data.user as unknown as {
      id: string;
      name: string;
      email: string;
      emailVerified?: boolean;
      image?: string | null;
      role?: string;
      isStale?: boolean;
      expiresAt?: string | Date | null;
      createdAt: string | Date;
      updatedAt: string | Date;
    };
    const toISO = (v: string | Date | null | undefined) =>
      !v
        ? new Date().toISOString()
        : typeof v === "string"
        ? v
        : v.toISOString();
    current = {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      emailVerified: Boolean(raw.emailVerified),
      image: raw.image || undefined,
      role: raw.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "MEMBER",
      isStale: Boolean(raw.isStale),
      expiresAt: raw.expiresAt ? toISO(raw.expiresAt) : undefined,
      createdAt: toISO(raw.createdAt),
      updatedAt: toISO(raw.updatedAt),
    };
  }
  return {
    user: current,
    isLoading: isPending,
    error,
    isAuthenticated: !!current,
  } as const;
}
