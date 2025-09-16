"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { OctagonAlert } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { SignInData, signInSchema } from "@/types/auth-schema";
import { toast } from "sonner";



// Social providers configuration
const SOCIAL_PROVIDERS = [
  { provider: "google", icon: FaGoogle, label: "Google" },
  // { provider: "github", icon: FaGithub, label: "GitHub" },
] as const;

export default function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
        },
        {
          onSuccess: () => {
            reset();
            router.push("/");
          },
          onError: (error) => {
            const errorMessage =
              error?.error?.message ||
              "Failed to sign in. Please check your credentials.";

            if (errorMessage == "Email not verified") {
              toast.success("email sent please verify!")
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
        callbackURL: process.env.NEXT_PUBLIC_MAKE_ME_PRO_CLIENT_URL,
      });
    } catch (error: unknown) {
      console.log(error);
      setServerError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-green-100/20 pointer-events-none" />
      <div className="relative w-full max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              
              <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
              <p className="text-gray-600">Sign in to your Fineart & Modeling Club account</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Email Field */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-12"
                      disabled={isFormDisabled}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>
                {/* Password Field */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12"
                      disabled={isFormDisabled}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                  )}
                </div>
                {/* Server Error Alert */}
                {serverError && (
                  <Alert variant="destructive" className="bg-destructive/10">
                    <OctagonAlert className="h-4 w-4" />
                    <AlertTitle>{serverError}</AlertTitle>
                  </Alert>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isFormDisabled}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 cursor-pointer"
                  disabled={isFormDisabled}
                >
                  {isFormDisabled ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-3">
                  {SOCIAL_PROVIDERS.map(({ provider, icon: Icon, label }) => (
                    <Button
                      key={provider}
                      variant="outline"
                      className="h-12 w-full cursor-pointer"
                      disabled={isFormDisabled}
                      onClick={() => handleSocialSignIn(provider)}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-4"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
