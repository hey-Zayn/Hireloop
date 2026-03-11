"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useCompanyStore } from "@/lib/store/useCompanyStore";
import CompanyForm from "@/components/dashboard/hr/CompanyForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Globe,
  Users,
  ExternalLink,
  Edit,
  Plus,
  ShieldCheck,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";


export default function HRCompanyPage() {
  const { user } = useAuthStore();
  const { company, getMyCompany, isLoading } = useCompanyStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user?.companyId) {
      getMyCompany(user.companyId);
    }
  }, [user, getMyCompany]);

  if (isLoading && !company) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-2 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Case 1: HR has no company registered yet
  if (!company && !isRegistering) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="size-24 bg-primary/5 rounded-full flex items-center justify-center mb-4">
          <Building2 className="size-12 text-primary/40" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-3xl font-bold tracking-tight">
            No Company Registered
          </h1>
          <p className="text-muted-foreground">
            You haven&apos;t registered your company yet. Registering a company
            allows you to post jobs, manage candidates, and build your brand.
          </p>

        </div>
        <Button
          size="lg"
          onClick={() => setIsRegistering(true)}
          className="rounded-xl px-8 shadow-lg shadow-primary/20"
        >
          <Plus className="mr-2 size-5" /> Register My Company
        </Button>
      </div>
    );
  }

  // Case 2: HR is in the process of registering or editing
  if (isRegistering || isEditing) {
    return (
      <div className="max-w-4xl mx-auto py-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              setIsRegistering(false);
              setIsEditing(false);
            }}
            className="rounded-xl hover:bg-primary/5"
          >
            ← Back to Profile
          </Button>
        </div>
        <CompanyForm
          initialData={isEditing ? company : undefined}
          isEditing={isEditing}
          onSuccess={() => {
            setIsRegistering(false);
            setIsEditing(false);
          }}
        />
      </div>
    );
  }

  // Case 3: Display Company Profile
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/5 p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
          <div className="size-24 bg-white dark:bg-gray-900 rounded-3xl shadow-xl flex items-center justify-center p-4 border border-primary/10">
            {company?.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            ) : (

              <Building2 className="size-12 text-primary" />
            )}
          </div>
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight">
                {company?.name}
              </h1>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-none py-1 px-3"
              >
                {company?.industry}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <ShieldCheck className="size-3 text-green-500" /> Verified
              </Badge>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" /> {company?.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-4" /> {company?.size} employees
              </span>
              <a
                href={company?.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-primary hover:underline"
              >
                <Globe className="size-4" /> Website{" "}
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            className="rounded-xl gap-2 shadow-lg shadow-primary/20"
          >
            <Edit className="size-4" /> Edit Profile
          </Button>
        </div>

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Description */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-primary/5 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>About Company</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {company?.description}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/5 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle>Live Updates & Stats</CardTitle>
              <CardDescription>
                Real-time performance of your company profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-primary/[0.03] border border-primary/5 text-center space-y-1">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Active Jobs
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary/[0.03] border border-primary/5 text-center space-y-1">
                  <p className="text-2xl font-bold">452</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Total Applications
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary/[0.03] border border-primary/5 text-center space-y-1">
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Response Rate
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">
                    Profile Completion
                  </span>
                  <span className="font-bold">85%</span>
                </div>
                <Progress value={85} className="h-2 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Info & Social */}
        <div className="space-y-8">
          <Card className="border-primary/5 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Quick Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Joined HireLoop
                  </p>
                  <p className="text-sm font-semibold">
                    {company?.createdAt ? new Date(company.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    }) : "Recently"}

                  </p>

                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold capitalize">
                      {company?.status}
                    </p>
                    <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/5 shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Social Presence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company?.socialLinks && company.socialLinks.length > 0 ? (
                company.socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 transition-colors group border border-transparent hover:border-primary/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <Globe className="size-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium truncate max-w-[150px]">
                        {link.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                      </span>
                    </div>
                    <ExternalLink className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4 italic">
                  No social links added yet.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white space-y-4 shadow-xl shadow-primary/20">
            <h4 className="font-bold text-lg leading-tight">
              Post your next big opportunity today!
            </h4>
            <p className="text-xs text-white/80">
              Reaching out to over 50k active candidates ready to join your
              journey.
            </p>
            <Link href="/hr/jobs">
              <Button
                variant="secondary"
                className="w-full rounded-xl font-bold mt-2 hover:bg-white hover:text-primary transition-all"
              >
                Create Job Posting
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
