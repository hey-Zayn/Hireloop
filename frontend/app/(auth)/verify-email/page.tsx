"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import PublicRoute from "@/components/PublicRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const { verifyEmail, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmail({ email, code });
      toast.success("Email verified successfully! You can now log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired code");
    }
  };

  return (
    <PublicRoute>
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 dark:bg-gray-900/50">
        <Card className="w-full max-w-md shadow-lg border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-center">
              Verify Email
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and the 6-digit code sent to your inbox
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
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
              <div className="space-y-4 flex flex-col items-center">
                <Label>Verification Code</Label>
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(val) => setCode(val)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full text-lg h-12"
                type="submit"
                disabled={isLoading || code.length !== 6 || !email}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Verify Account"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PublicRoute>
  );
}
