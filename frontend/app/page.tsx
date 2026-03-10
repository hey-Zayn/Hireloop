"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-primary/10">
          <div className="flex items-center space-x-6 mb-8">
            <div className="bg-primary/10 p-4 rounded-full">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back!
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your account and settings
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Full Name
              </label>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {user?.fullName}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email Address
              </label>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User Role
              </label>
              <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                {user?.role}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account Status
              </label>
              <p className="text-lg font-medium text-green-600 dark:text-green-400">
                Verified
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="destructive"
              className="flex items-center space-x-2 px-6 h-12 rounded-xl transition-all hover:scale-105 active:scale-95"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
