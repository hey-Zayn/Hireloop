"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/useAuthStore";
import PublicRoute from "@/components/PublicRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email",
      );
    }
  };

  if (isSubmitted) {
    return (
      <PublicRoute>
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 dark:bg-gray-900/50">
          <Card className="w-full max-w-md shadow-lg border-primary/10">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Check your email
              </CardTitle>
              <CardDescription>
                We&apos;ve sent a password reset link to{" "}
                <span className="font-semibold">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-4">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </PublicRoute>
    );
  }

  return (
    <PublicRoute>
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 dark:bg-gray-900/50">
        <Card className="w-full max-w-md shadow-lg border-primary/10">
          <CardHeader className="space-y-1">
            <Link
              href="/login"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
            <CardTitle className="text-3xl font-bold tracking-tight text-center pt-4">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and we&apos;ll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full text-lg h-12"
                type="submit"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PublicRoute>
  );
}
