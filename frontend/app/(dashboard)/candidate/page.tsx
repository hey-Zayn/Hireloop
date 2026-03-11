"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { Card, CardContent } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Eye,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";


export default function CandidateDashboard() {
  const { user } = useAuthStore();

  const stats = [
    {
      title: "Jobs Applied",
      value: "12",
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Interviews Done",
      value: "4",
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Shortlisted",
      value: "3",
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Profile Views",
      value: "48",
      icon: Eye,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      premium: true,
    },
  ];

  const recommendedJobs = [
    {
      title: "Senior Frontend Engineer",
      company: "TechCorp",
      location: "Remote",
      salary: "$120k - $150k",
      match: 92,
      tags: ["React", "Next.js", "TypeScript"],
    },
    {
      title: "Full Stack Developer",
      company: "ScaleUp",
      location: "New York, NY",
      salary: "$100k - $130k",
      match: 88,
      tags: ["Node.js", "React", "MongoDB"],
    },
  ];

  const activities = [
    {
      text: "Your interview for Senior React Dev at TechCorp is ready",
      time: "2 hours ago",
      type: "interview",
    },
    {
      text: "Your CV was scored — you scored 84/100",
      time: "5 hours ago",
      type: "scoring",
    },
    {
      text: "You were shortlisted at FinanceApp!",
      time: "Yesterday",
      type: "shortlist",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground shadow-2xl">
        <Sparkles className="absolute top-4 right-4 size-24 text-white/10 -rotate-12" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Good morning, {user?.fullName?.split(" ")[0]}! 👋
          </h1>
            <p className="text-primary-foreground/90 text-lg">
              You have{" "}
              <span className="font-bold underline decoration-secondary">
                2 interviews pending
              </span>{" "}
              this week. You&apos;re doing great!
            </p>

          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Profile Completion</span>
              <span>75%</span>
            </div>
            <Progress
              value={75}
              className="h-3 bg-white/20"
              indicatorClassName="bg-white"
            />
            <p className="text-xs text-primary-foreground/70 italic bg-white/10 inline-block px-3 py-1 rounded-full mt-2">
              💡 Tip: Add your latest projects to get 3x more interview invites.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl", stat.bg)}>
                <stat.icon className={cn("size-6", stat.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {stat.value}
                  </h3>
                  {stat.premium && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700 text-[10px] uppercase tracking-wider h-4 px-1"
                    >
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="size-6 text-primary" />
              AI-Matched Jobs
            </h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary hover:bg-primary/5"
            >
              View all jobs <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {recommendedJobs.map((job) => (
              <Card
                key={job.title}
                className="group border-primary/5 hover:border-primary/20 transition-all overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                          {job.match}% match
                        </Badge>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                      </div>
                      <p className="font-medium text-gray-600 dark:text-gray-400">
                        {job.company}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="size-4" /> {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-4" /> {job.salary}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {job.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] font-medium bg-gray-50 dark:bg-gray-800"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="h-11 px-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      Quick Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
          <Card className="border-primary/5 shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-primary/5">
                {activities.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 hover:bg-primary/5 transition-colors cursor-pointer group"
                  >
                    <p className="text-sm font-medium pr-4 leading-relaxed group-hover:text-primary transition-colors">
                      {item.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                      <Clock className="size-3" /> {item.time}
                    </p>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full h-12 text-sm text-muted-foreground hover:text-primary rounded-t-none"
              >
                View notification history
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
