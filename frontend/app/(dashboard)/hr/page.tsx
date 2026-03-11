"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  Calendar,
  FileText,
  UserPlus,
  Trophy,
  Plus,
  BarChart3,
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";




const stats = [
  {
    title: "Total Jobs Posted",
    value: "24",
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "New Applications",
    value: "156",
    icon: FileText,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  {
    title: "Interviews (Today)",
    value: "8",
    icon: Calendar,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    title: "Pending CV Scores",
    value: "42",
    icon: BarChart3,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    title: "Shortlisted",
    value: "18",
    icon: Users,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Hire Rate",
    value: "12%",
    icon: Trophy,
    color: "text-pink-600",
    bg: "bg-pink-100",
  },
];

const chartData = [
  { name: "Frontend", apps: 45 },
  { name: "Backend", apps: 32 },
  { name: "Design", apps: 28 },
  { name: "Product", apps: 15 },
  { name: "DevOps", apps: 12 },
];

const pipelineData = [
  { stage: "Applied", count: 120 },
  { stage: "Scored", count: 85 },
  { stage: "Interviewed", count: 42 },
  { stage: "Shortlisted", count: 18 },
  { stage: "Hired", count: 5 },
];

const activities = [
  {
    text: "Ali Raza just completed his interview",
    time: "Just now",
    status: "Completed",
  },
  {
    text: "3 new applications on Senior React Dev",
    time: "12 mins ago",
    status: "New",
  },
  {
    text: "CV scoring complete for 5 candidates",
    time: "45 mins ago",
    status: "Processing",
  },
];

export default function HRDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            HR Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.fullName}. Here&apos;s what&apos;s happening today.
          </p>

        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-primary/10 hover:bg-primary/5"
          >
            View Analytics
          </Button>
          <Button className="rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all gap-2">
            <Plus className="size-4" /> Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-none shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className={`p-3 rounded-xl ${stat.bg} mb-3`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </p>
              <h3 className="text-xl font-bold mt-1 tracking-tight">
                {stat.value}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Charts & Pipeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Applications per Department
                </CardTitle>
                <CardDescription>
                  Recent job posting performance
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                      cursor={{ fill: "rgba(var(--primary), 0.05)" }}
                    />
                    <Bar
                      dataKey="apps"
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-primary/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  Hiring Pipeline Funnel
                </CardTitle>
                <CardDescription>Overall conversion tracking</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pipelineData}>
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="stage"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-primary/5 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <CardDescription>Essential HR shortcuts</CardDescription>
              </div>
              <TrendingUp className="size-5 text-primary opacity-50" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 rounded-2xl border-primary/10 hover:bg-primary/5 hover:border-primary/30 transition-all"
              >
                <Plus className="size-6 text-primary" />
                <span>Post New Job</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 rounded-2xl border-primary/10 hover:bg-primary/5 hover:border-primary/30 transition-all"
              >
                <UserPlus className="size-6 text-primary" />
                <span>Invite Candidate</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 rounded-2xl border-primary/10 hover:bg-primary/5 hover:border-primary/30 transition-all"
              >
                <FileText className="size-6 text-primary" />
                <span>View Reports</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activity Feed */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-primary/5 shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Activity Feed</CardTitle>
                <CardDescription>Live updates via Socket.io</CardDescription>
              </div>
              <div
                className="size-2 bg-green-500 rounded-full animate-pulse"
                title="Live"
              />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-primary/5">
                {activities.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 hover:bg-primary/5 transition-colors group flex gap-3"
                  >
                    <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                      <Clock className="size-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                        {item.text}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">
                          {item.time}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] h-4 px-1.5 font-normal"
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4">
                <Button
                  variant="ghost"
                  className="w-full text-primary hover:bg-primary/5 rounded-xl group"
                >
                  See all activity{" "}
                  <ChevronRight className="ml-1 size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
