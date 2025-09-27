import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MailCheck,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface VerifyPageProps {
  // In Next.js 15, searchParams is a Promise on the server and must be awaited
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  // Await searchParams before accessing its properties to avoid sync dynamic API error
  const resolvedSearchParams = (await searchParams) ?? {};
  const error = resolvedSearchParams.error;
  const message = resolvedSearchParams.message;

  const isInvalidToken = error === "invalid_token";
  const isVerificationSent = message === "email_verification_sent";

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  const isLoggedIn = !!session.data?.user;
  const isEmailVerified = !isInvalidToken && !isVerificationSent && isLoggedIn;

  if (!isInvalidToken && !isVerificationSent && !isLoggedIn) {
    notFound();
  }

  const icon = isInvalidToken
    ? <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
    : isVerificationSent
    ? <MailCheck className="mx-auto h-12 w-12 text-blue-500" />
    : <CheckCircle className="mx-auto h-12 w-12 text-green-500" />;

  const title = isInvalidToken
    ? "Verification Failed"
    : isVerificationSent
    ? "Verification Email Sent"
    : "Email Verified";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          {icon}
          <CardTitle className="text-2xl font-bold mt-2">{title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          {isInvalidToken && (
            <>
              <Alert variant="destructive">
                <AlertTitle>Invalid or Expired Link</AlertTitle>
                <AlertDescription>
                  The verification link is either invalid or expired. Please request a new one.
                </AlertDescription>
              </Alert>
              <Button asChild className="w-full mt-2">
                <Link href="/sign-in">Resend Verification Email</Link>
              </Button>
            </>
          )}

          {isVerificationSent && (
            <>
              <p className="text-muted-foreground">
                We&apos;ve sent a verification email to your inbox. Please check it and follow the link to verify your account.
              </p>
              <Button asChild className="w-full mt-2">
                <Link href="/sign-in">Back to Login</Link>
              </Button>
            </>
          )}

          {isEmailVerified && (
            <>
              <Alert variant="default">
                <AlertTitle>Email Successfully Verified</AlertTitle>
                <AlertDescription>
                  You can now log in and start using your account.
                </AlertDescription>
              </Alert>
              <Button asChild className="w-full mt-2">
                <Link href="/">Go to Home</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
