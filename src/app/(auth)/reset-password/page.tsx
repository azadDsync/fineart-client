import ResetPasswordForm from "@/components/auth/reset-password-form";
import { redirect } from "next/navigation";
interface PageProps {
  searchParams: Promise<{ token: string }>;
}
export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const token = (await searchParams).token;
  if (!token) {
    redirect("/sign-in");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 sm:px-6">
      <ResetPasswordForm token={token} />
    </div>
  );
}
