"use client";
import { RoleGate } from "@/components/auth/RoleGate";
import { AdminNav } from "./AdminNav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate allow={["ADMIN"]} redirectTo="/">
      <div className="min-h-screen">
      <AdminNav />
      <div className="mx-auto  max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
      </div>
    </RoleGate>
  );
}
