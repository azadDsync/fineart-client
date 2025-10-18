"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";

import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Alert, AlertTitle } from "@/components/ui/alert";

import { OctagonAlert } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { SignInData, signInSchema } from "@/types/auth-schema";
import { toast } from "sonner";

// Social providers configuration
const SOCIAL_PROVIDERS = [
  { provider: "google", icon: FaGoogle, label: "Continue with Google" },
  // { provider: "github", icon: FaGithub, label: "GitHub" },
] as const;

export default function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data: SignInData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/profile",
        },
        {
          onSuccess: () => {
            reset();
          },
          onError: (error) => {
            const errorMessage =
              error?.error?.message ||
              "Failed to sign in. Please check your credentials.";

            if (errorMessage == "Email not verified") {
              toast.success("email sent please verify!");
            }
            setServerError(`${errorMessage},check your email`);
          },
        }
      );
    } catch (error: unknown) {
      console.log(error);
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google") => {
    setServerError(null);
    setIsLoading(true);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${process.env.NEXT_PUBLIC_CLIENT_URL}/profile`,
      });
    } catch (error: unknown) {
      console.log(error);
      setServerError(`Failed to sign in with ${provider}. Please try again.`);
    }
    setIsLoading(false);
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="mx-auto grid w-[350px] gap-6 border-2 rounded-lg p-6 border-black shadow-[8px_8px_0px_#000] panel-fill">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              disabled={isFormDisabled}
              {...register("email")}
              className="input-fill"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isFormDisabled}
                {...register("password")}
                className="input-fill"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          {serverError && (
            <Alert variant="destructive" className="bg-destructive/10">
              <OctagonAlert className="h-4 w-4" />
              <AlertTitle>{serverError}</AlertTitle>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isFormDisabled}>
            {isFormDisabled ? "Logging in..." : "Login"}
          </Button>
          {SOCIAL_PROVIDERS.map(({ provider, icon: Icon, label }) => (
            <Button
              key={provider}
              variant="outline"
              className="w-full"
              disabled={isFormDisabled}
              onClick={() => handleSocialSignIn(provider)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
