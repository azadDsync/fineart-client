"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { Eye, EyeOff, OctagonAlert} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

import { authClient } from "@/lib/auth-client";
import { SignUpData, signupSchema } from "@/types/auth-schema";
import { toast } from "sonner";



const SOCIAL_PROVIDERS = [
  { provider: "google", icon: FaGoogle, label: "Sign up with Google" },
];



export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  // setValue, watch,
    reset,
  } = useForm<SignUpData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (data: SignUpData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            reset();
            toast.success('email verification link sent!')
            router.push('/verify?message=email_verification_sent')
          },
          onError: (error) => {
            const errorMessage =
              error?.error?.message ||
              "Failed to create account. Please try again.";
            setServerError(errorMessage);
          },
        }
      );
    } catch (error) {
      console.log(error);
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setServerError(null);
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: process.env.NEXT_PUBLIC_MAKE_ME_PRO_CLIENT_URL,
      });
    } catch (error) {
      console.log(error);
      setServerError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
    <div className="mx-auto grid w-[350px] gap-6 border-2 rounded-lg p-6 border-black shadow-[8px_8px_0px_#000] panel-fill">
      <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-balance text-muted-foreground">
            Enter your information to create an account
          </p>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Max Robinson"
              required
              disabled={isFormDisabled}
               {...register("name")}
               className="input-fill"
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>
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
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                disabled={isFormDisabled}
                 {...register("confirmPassword")}
                 className="input-fill"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>
          {serverError && (
            <Alert variant="destructive" className="bg-destructive/10">
              <OctagonAlert className="h-4 w-4" />
              <AlertTitle>{serverError}</AlertTitle>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isFormDisabled}>
            {isFormDisabled ? "Creating account..." : "Create account"}
          </Button>
          {SOCIAL_PROVIDERS.map(({ provider, icon: Icon, label }) => (
            <Button
              key={provider}
              variant="outline"
              className="w-full"
              onClick={() => handleSocialSignIn(provider)}
              disabled={isFormDisabled}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          ))}
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
