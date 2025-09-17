"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, OctagonAlert, User, Mail, Lock, ArrowLeft } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

import { authClient } from "@/lib/auth-client";
import { SignUpData, signupSchema } from "@/types/auth-schema";
import { toast } from "sonner";



const SOCIAL_PROVIDERS = [
  { provider: "google", icon: FaGoogle, label: "Google" },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-green-100/20" />
      <div className="relative w-full max-w-md">
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
              
              <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
              <p className="text-gray-600">Join Fineart & Modeling Club and start your journey</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      disabled={isFormDisabled}
                      {...register("name")}
                      className="pl-9 h-10"
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      disabled={isFormDisabled}
                      {...register("email")}
                      className="pl-9 h-10"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      disabled={isFormDisabled}
                      {...register("password")}
                      className="pl-9 pr-9 h-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      disabled={isFormDisabled}
                      {...register("confirmPassword")}
                      className="pl-9 pr-9 h-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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

                <Button
                  type="submit"
                  className="w-full h-10 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 cursor-pointer"
                  disabled={isFormDisabled}
                >
                  {isFormDisabled ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                  </div>
                </div>

                <div className="mt-4">
                  {SOCIAL_PROVIDERS.map(({ provider, icon: Icon, label }) => (
                    <Button
                      key={provider}
                      variant="outline"
                      className="w-full h-10 cursor-pointer"
                      onClick={() => handleSocialSignIn(provider)}
                      disabled={isFormDisabled}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-4">
                    Sign in here
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
