"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  LayoutDashboard,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Briefcase,
  Building2,
  Search,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function DashboardNavbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const role = user?.role || "candidate";

  return (
    <header className="h-16 border-b border-primary/5 bg-white/50 backdrop-blur-md dark:bg-gray-950/50 sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="hover:bg-primary/5 transition-colors" />
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search for jobs, candidates, or interviews..."
            className="pl-10 h-10 bg-primary/5 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-primary/5 rounded-full transition-colors group">
          <Bell className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white dark:border-gray-950" />
        </button>
        <div className="h-8 w-px bg-primary/10 mx-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer group hover:bg-primary/5 p-1.5 rounded-xl transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">
                  {user?.fullName}
                </p>
                <p className="text-xs text-muted-foreground capitalize mt-1">
                  {user?.role} Account
                </p>
              </div>
              <Avatar className="size-10 border-2 border-primary/10 group-hover:border-primary/30 transition-all">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-2 p-2 rounded-xl shadow-xl border-primary/5"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">
                  {user?.fullName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-primary/5" />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={role === "hr" ? "/hr" : "/candidate"}
                  className="flex items-center gap-2 cursor-pointer rounded-lg py-2"
                >
                  <LayoutDashboard className="size-4 text-primary" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={role === "hr" ? "/hr/company" : "/candidate/profile"}
                  className="flex items-center gap-2 cursor-pointer rounded-lg py-2"
                >
                  {role === "hr" ? (
                    <Building2 className="size-4 text-primary" />
                  ) : (
                    <UserIcon className="size-4 text-primary" />
                  )}
                  <span>{role === "hr" ? "My Company" : "Profile"}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={role === "hr" ? "/hr/jobs" : "/candidate/applications"}
                  className="flex items-center gap-2 cursor-pointer rounded-lg py-2"
                >
                  <Briefcase className="size-4 text-primary" />
                  <span>{role === "hr" ? "Jobs" : "My Applications"}</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-primary/5" />
            <DropdownMenuItem asChild>
              <Link
                href={role === "hr" ? "/hr/settings" : "/candidate/settings"}
                className="flex items-center gap-2 cursor-pointer rounded-lg py-2"
              >
                <SettingsIcon className="size-4 text-primary" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-primary/5" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg py-2"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
