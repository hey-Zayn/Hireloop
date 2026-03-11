"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  const { user, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && user) {
      if (user.role === "hr") {
        router.replace("/hr");
      } else {
        router.replace("/candidate");
      }
    }
  }, [user, isCheckingAuth, router]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Loader2 className="size-6 text-primary animate-spin" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
              Redirecting you...
            </h2>
            <p className="text-muted-foreground text-sm">
              Please wait while we prepare your dashboard.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
