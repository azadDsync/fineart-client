"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/use-current-user";
import { LoadingSpinner } from "@/components/ui/loading";

interface RoleGateProps {
  children: React.ReactNode;
  allow: Array<"ADMIN" | "MEMBER">;
  redirectTo?: string;
}

export function RoleGate({ children, allow, redirectTo = "/" }: RoleGateProps) {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();
  const authorized = user && allow.includes(user.role);

  useEffect(() => {
    if (!isLoading && !authorized) {
      router.replace(redirectTo);
    }
  }, [isLoading, authorized, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!authorized) return null;
  return <>{children}</>;
}
