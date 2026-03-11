"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Home,
  Search,
  Briefcase,
  Calendar,
  User,
  Bookmark,
  Bell,
  Settings,
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  BarChart,
  LogOut,
} from "lucide-react";

const candidateNav = [
  { title: "Home / Feed", icon: Home, href: "/candidate" },
  { title: "Browse Jobs", icon: Search, href: "/candidate/jobs" },
  {
    title: "My Applications",
    icon: Briefcase,
    href: "/candidate/applications",
  },
  { title: "My Interviews", icon: Calendar, href: "/candidate/interviews" },
  { title: "Profile", icon: User, href: "/candidate/profile" },
  { title: "Saved Jobs", icon: Bookmark, href: "/candidate/saved-jobs" },
  { title: "Notifications", icon: Bell, href: "/candidate/notifications" },
  { title: "Settings", icon: Settings, href: "/candidate/settings" },
];

const hrNav = [
  { title: "Overview", icon: LayoutDashboard, href: "/hr" },
  { title: "My Company", icon: Building2, href: "/hr/company" },
  { title: "Jobs", icon: Briefcase, href: "/hr/jobs" },
  { title: "Candidates", icon: Users, href: "/hr/candidates" },
  { title: "Interviews", icon: MessageSquare, href: "/hr/interviews" },
  { title: "Reports", icon: BarChart, href: "/hr/reports" },
  { title: "Notifications", icon: Bell, href: "/hr/notifications" },
  { title: "Settings", icon: Settings, href: "/hr/settings" },
];

export function DashboardSidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const role = user?.role || "candidate";
  const navItems = role === "hr" ? hrNav : candidateNav;

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-primary/5">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-primary/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-105 transition-transform">
            H
          </div>
          <span className="font-bold text-xl tracking-tight hidden group-data-[collapsible=icon]:hidden md:block">
            Hire<span className="text-primary">Loop</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                      pathname === item.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-primary/5 text-muted-foreground hover:text-primary",
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-primary/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              <LogOut className="size-5" />
              <span className="group-data-[collapsible=icon]:hidden font-medium">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
