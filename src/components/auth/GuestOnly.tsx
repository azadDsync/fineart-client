"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/use-current-user";

interface GuestOnlyProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function GuestOnly({ children, redirectTo = "/" }: GuestOnlyProps) {
  const { isLoading, isAuthenticated } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  if (isAuthenticated) return null;
  return <>{children}</>;
}
