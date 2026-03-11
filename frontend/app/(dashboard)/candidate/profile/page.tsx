"use client";

import { useEffect, useState } from "react";
import {
  useProfileStore,
  Education,
  Experience,
} from "@/lib/store/useProfileStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import {
  MapPin,
  Mail,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  Code2,
  Calendar,
  Edit,
  Sparkles,
  Camera,
  Plus,
  Trash2,
  Link as LinkIcon,
  X,
  FileText,
  Eye,
  Check,
  Ban,
  Upload,
  Image as ImageIcon,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  const {
    profile,
    getProfile,
    upsertProfile,
    addProject,
    updateProject,
    deleteProject,
    addEducation,
    updateEducation,
    deleteEducation,
    isLoading,
    uploadBanner,
    deleteBanner,
    deleteResume,
    uploadResume,
  } = useProfileStore();

  const { user, updateUser } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Modal States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false);
  const [isEditExperienceOpen, setIsEditExperienceOpen] = useState(false);
  const [isAddEducationOpen, setIsAddEducationOpen] = useState(false);
  const [isEditEducationOpen, setIsEditEducationOpen] = useState(false);
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false);

  // Form States
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phone: "",
    headline: "",
    bio: "",
    location: "",
    linkedIn: "",
    github: "",
    portfolio: "",
    isOpenToWork: false,
  });

  const [projectFormData, setProjectFormData] = useState({
    _id: "",
    title: "",
    description: "",
    link: "",
    technologies: [] as string[],
    image: null as File | null,
    previewUrl: "",
  });
  const [newSkill, setNewSkill] = useState("");

  const [experienceFormData, setExperienceFormData] = useState({
    _id: "",
    company: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
  });
  const [educationFormData, setEducationFormData] = useState({
    _id: "",
    institution: "",
    degree: "",
    field: "",
    startYear: 2020,
    endYear: 2024,
    current: false,
  });

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (profile && user && !isInitialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        location: profile.location || "",
        linkedIn: profile.linkedIn || "",
        github: profile.github || "",
        portfolio: profile.portfolio || "",
        isOpenToWork: profile.isOpenToWork || false,
      });
      setIsInitialized(true);
    }
  }, [profile, user, isInitialized]);

  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        fullName: editFormData.fullName,
        phone: editFormData.phone,
      });
      await upsertProfile({
        headline: editFormData.headline,
        bio: editFormData.bio,
        location: editFormData.location,
        linkedIn: editFormData.linkedIn,
        github: editFormData.github,
        portfolio: editFormData.portfolio,
        isOpenToWork: editFormData.isOpenToWork,
      });
      setIsEditProfileOpen(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", projectFormData.title);
      formData.append("description", projectFormData.description);
      formData.append("link", projectFormData.link);
      formData.append(
        "technologies",
        JSON.stringify(projectFormData.technologies),
      );
      if (projectFormData.image) {
        formData.append("image", projectFormData.image);
      }

      if (projectFormData._id) {
        await updateProject(projectFormData._id, formData);
        toast.success("Project updated successfully");
      } else {
        await addProject(formData);
        toast.success("Project added successfully");
      }

      setIsAddProjectOpen(false);
      setIsEditProjectOpen(false);
      setProjectFormData({
        _id: "",
        title: "",
        description: "",
        link: "",
        technologies: [],
        image: null,
        previewUrl: "",
      });
    } catch {
      toast.error("Failed to save project");
    }
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Partial<Experience> = {
        company: experienceFormData.company,
        title: experienceFormData.title,
        description: experienceFormData.description,
        startDate: experienceFormData.startDate,
        endDate: experienceFormData.current
          ? undefined
          : experienceFormData.endDate,
        current: experienceFormData.current,
      };

      if (experienceFormData._id) {
        await useProfileStore
          .getState()
          .updateExperience(experienceFormData._id, payload);
        toast.success("Experience updated");
      } else {
        await useProfileStore.getState().addExperience(payload as Experience);
        toast.success("Experience added");
      }
      setIsAddExperienceOpen(false);
      setIsEditExperienceOpen(false);
    } catch {
      toast.error("Error saving experience");
    }
  };

  const handleAddEducationSubmit = async (payload: Education) => {
    try {
      if (payload._id) {
        await updateEducation(payload._id, payload);
        toast.success("Education updated successfully");
      } else {
        await addEducation(payload);
        toast.success("Education added successfully");
      }
      setIsAddEducationOpen(false);
      setIsEditEducationOpen(false);
    } catch {
      toast.error("Failed to save education");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center space-y-4">
        <Briefcase className="size-12 text-muted-foreground opacity-20" />
        <h2 className="text-2xl font-bold">No profile found</h2>
        <p className="text-muted-foreground">
          Please complete your onboarding to see your profile.
        </p>
        <Link href="/candidate/setup">
          <Button className="rounded-md px-8 h-11">Set up Profile</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto pb-20 space-y-8 animate-in fade-in duration-700 font-sans px-4">
      {/* Header Section */}
      <section className="bg-white dark:bg-slate-900 rounded-md overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        {/* Banner Area */}
        <div className="relative h-48 md:h-72 group/banner">
          {profile.banner ? (
            <Image
              src={profile.banner}
              alt="Profile Banner"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="size-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              ></div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/banner:opacity-100 transition-opacity" />

          {/* Banner Actions */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/banner:opacity-100 transition-all transform translate-y-2 group-hover/banner:translate-y-0">
            <label className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-md transition-colors border border-white/20 shadow-lg">
              <Camera className="size-5" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadBanner(file);
                }}
              />
            </label>
            {profile.banner && (
              <button
                onClick={() => confirm("Delete banner?") && deleteBanner()}
                className="bg-white/20 hover:bg-red-500/50 backdrop-blur-md text-white p-2 rounded-md transition-colors border border-white/20 shadow-lg"
              >
                <Trash2 className="size-5" />
              </button>
            )}
          </div>
        </div>

        <div className="relative px-8 pb-10 flex flex-col md:flex-row gap-8">
          {/* Avatar Area */}
          <div className="relative -mt-20 md:-mt-24 group">
            <div className="relative size-32 md:size-48 rounded-full border-[8px] border-white dark:border-slate-900 bg-slate-100 overflow-hidden shadow-2xl ring-1 ring-slate-100/50">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.fullName || "User Avatar"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="size-full flex items-center justify-center bg-slate-200 text-6xl font-bold text-slate-400">
                  {user?.fullName?.charAt(0)}
                </div>
              )}
              <label className="absolute bottom-4 right-4 size-10 bg-primary text-white flex items-center justify-center rounded-md shadow-lg cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="size-5" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      useAuthStore.getState().updateAvatar(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="flex-1 mt-4 md:mt-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white break-words">
                    {user?.fullName}
                  </h1>
                  {profile.isOpenToWork && (
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 rounded-md font-semibold text-xs transition-colors bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                    >
                      <Sparkles className="size-3 mr-1" /> Open to Work
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-muted-foreground font-medium break-words">
                  {profile.headline || "Digital Professional"}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
                    <MapPin className="size-4 text-primary" />{" "}
                    {profile.location || "Remote"}
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
                    <Mail className="size-4 text-blue-500" /> {user?.email}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 h-fit">
                <div className="flex items-center gap-2 mr-4 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-md border border-slate-100 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-500">
                    {profile.isOpenToWork ? "Available" : "Unavailable"}
                  </span>
                  <Switch
                    checked={editFormData.isOpenToWork}
                    onCheckedChange={(val) => {
                      setEditFormData({ ...editFormData, isOpenToWork: val });
                      upsertProfile({ ...profile, isOpenToWork: val });
                      toast.success(
                        val ? "Set to Open to Work" : "Set to Unavailable",
                      );
                    }}
                  />
                </div>

                <Link href={profile.linkedIn || "#"}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-md shadow-sm"
                  >
                    <Linkedin className="size-4" />
                  </Button>
                </Link>
                <Link href={profile.github || "#"}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-md shadow-sm"
                  >
                    <Github className="size-4" />
                  </Button>
                </Link>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-2 rounded-md shadow-sm"
                  onClick={() => toast.info("Hire feature coming soon!")}
                >
                  Connect Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="rounded-md border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 rounded-md font-medium"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-md border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Connect
              </h3>
              <div className="flex gap-3">
                {profile.portfolio && (
                  <Link
                    href={profile.portfolio}
                    target="_blank"
                    className="size-10 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Globe className="size-5" />
                  </Link>
                )}
                {profile.github && (
                  <Link
                    href={profile.github}
                    target="_blank"
                    className="size-10 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                  >
                    <Github className="size-5" />
                  </Link>
                )}
                {profile.linkedIn && (
                  <Link
                    href={profile.linkedIn}
                    target="_blank"
                    className="size-10 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-colors"
                  >
                    <Linkedin className="size-5" />
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          {/* About Section */}
          <section className="bg-white dark:bg-slate-900 rounded-md p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="size-5 text-primary" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  About Me
                </h2>
              </div>
              <Dialog
                open={isEditProfileOpen}
                onOpenChange={setIsEditProfileOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit className="size-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-md border-slate-200 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900">
                      Refine Your Professional Bio
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleEditProfileSubmit}
                    className="space-y-6 pt-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">
                          Full Name
                        </Label>
                        <Input
                          value={editFormData.fullName}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              fullName: e.target.value,
                            })
                          }
                          className="rounded-md border-slate-200 focus:ring-primary shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">
                          Phone
                        </Label>
                        <Input
                          value={editFormData.phone}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              phone: e.target.value,
                            })
                          }
                          className="rounded-md border-slate-200 focus:ring-primary shadow-sm"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="font-bold text-slate-700">
                          Professional Headline
                        </Label>
                        <Input
                          value={editFormData.headline}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              headline: e.target.value,
                            })
                          }
                          className="rounded-md border-slate-200 focus:ring-primary shadow-sm"
                          placeholder="e.g. Senior Full Stack Developer"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="font-bold text-slate-700">
                          Bio (Rich Text Editor)
                        </Label>
                        <div className="rounded-md border border-slate-200 overflow-hidden shadow-sm">
                          <ReactQuill
                            theme="snow"
                            value={editFormData.bio}
                            onChange={(val) =>
                              setEditFormData({ ...editFormData, bio: val })
                            }
                            className="bg-white min-h-[200px]"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">
                          Location
                        </Label>
                        <Input
                          value={editFormData.location}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              location: e.target.value,
                            })
                          }
                          className="rounded-md border-slate-200 focus:ring-primary shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">
                          Portfolio URL
                        </Label>
                        <Input
                          value={editFormData.portfolio}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              portfolio: e.target.value,
                            })
                          }
                          className="rounded-md border-slate-200 focus:ring-primary shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">
                          LinkedIn URL
                        </Label>
                        <Input
                          value={editFormData.linkedIn}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              linkedIn: e.target.value,
                            })
                          }
                          className="rounded-md border-slate-200 focus:ring-primary shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-slate-700">
                          GitHub URL
                        </Label>
                        <Input
                          value={editFormData.github}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              github: e.target.value,
                            })
                          }
                          className="rounded-md border-slate-200 focus:ring-primary shadow-sm"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-linear-to-r from-primary to-indigo-600 text-white font-black py-6 rounded-md shadow-xl hover:scale-[1.01] transition-transform"
                    >
                      Excute Premium Update
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div
              className="prose dark:prose-invert max-w-none w-full break-words text-slate-600 dark:text-slate-300 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{
                __html:
                  profile.bio ||
                  "No biography provided yet. Showcase your professional journey here.",
              }}
            />
          </section>

          {/* Resume Section */}
          <section className="bg-white dark:bg-slate-900 rounded-md p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Professional Assets
                </h2>
              </div>

              <label className="cursor-pointer">
                <div className="bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold px-4 py-2 rounded-md border border-slate-200 shadow-sm transition-all flex items-center gap-2 text-sm">
                  <Upload className="size-4" />{" "}
                  {profile.cvUrl ? "Update CV" : "Upload CV"}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadResume(file);
                  }}
                />
              </label>
            </div>

            {profile.cvUrl ? (
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-100 dark:border-slate-700 gap-4">
                <div className="flex items-center gap-4">
                  <FileText className="size-10 text-rose-500" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Professional_Resume.pdf
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(profile.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Dialog
                    open={isResumePreviewOpen}
                    onOpenChange={setIsResumePreviewOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-md shadow-sm px-5 font-semibold"
                      >
                        <Eye className="size-4 mr-2" /> Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden rounded-md border-slate-200 shadow-2xl flex flex-col">
                      <DialogHeader className="p-4 border-b">
                        <DialogTitle className="text-xl font-bold">
                          Resume Preview
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex-1 w-full bg-slate-100 relative min-h-[500px]">
                        <iframe
                          src={`${profile.cvUrl}#toolbar=0`}
                          className="size-full border-none"
                          title="Resume Preview"
                          allowFullScreen
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-semibold"
                    onClick={() =>
                      confirm("Are you sure you want to remove your resume?") &&
                      deleteResume()
                    }
                  >
                    <Trash2 className="size-4 mr-2" /> Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 py-16 bg-slate-50 dark:bg-slate-800/20 rounded-md border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
                <FileText className="size-12 text-slate-300 mb-4" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  No Resume Attached
                </h2>
                <p className="text-muted-foreground text-sm font-medium mb-6 max-w-xs mx-auto">
                  Upload a professional CV to showcase your qualifications
                </p>
                <label className="cursor-pointer">
                  <div className="bg-primary text-white font-semibold px-8 py-2.5 rounded-md shadow-sm transition-all">
                    Select Resume File
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadResume(file);
                    }}
                  />
                </label>
              </div>
            )}
          </section>

          {/* Experience Section */}
          <section className="bg-white dark:bg-slate-900 rounded-md p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <Briefcase className="size-5 text-primary" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Experience
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md font-semibold px-4 border-slate-200 hover:bg-primary hover:text-white transition-all"
                onClick={() => {
                  setExperienceFormData({
                    _id: "",
                    company: "",
                    title: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                  });
                  setIsAddExperienceOpen(true);
                }}
              >
                <Plus className="size-4 mr-2" /> Add Experience
              </Button>

              <Dialog
                open={isAddExperienceOpen || isEditExperienceOpen}
                onOpenChange={(val) => {
                  setIsAddExperienceOpen(val && !experienceFormData._id);
                  setIsEditExperienceOpen(val && !!experienceFormData._id);
                }}
              >
                <DialogContent className="max-w-xl rounded-md border-slate-200 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900">
                      {experienceFormData._id
                        ? "Edit Experience"
                        : "New Experience Record"}
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleExperienceSubmit}
                    className="space-y-6 pt-4"
                  >
                    <div className="space-y-2">
                      <Label className="font-bold">
                        Company / Organization
                      </Label>
                      <Input
                        value={experienceFormData.company}
                        onChange={(e) =>
                          setExperienceFormData({
                            ...experienceFormData,
                            company: e.target.value,
                          })
                        }
                        required
                        className="rounded-md border-slate-200"
                        placeholder="e.g. Google"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Professional Title</Label>
                      <Input
                        value={experienceFormData.title}
                        onChange={(e) =>
                          setExperienceFormData({
                            ...experienceFormData,
                            title: e.target.value,
                          })
                        }
                        required
                        className="rounded-md border-slate-200"
                        placeholder="e.g. Senior Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">
                        Roles & Responsibilities
                      </Label>
                      <Textarea
                        value={experienceFormData.description}
                        onChange={(e) =>
                          setExperienceFormData({
                            ...experienceFormData,
                            description: e.target.value,
                          })
                        }
                        className="rounded-md border-slate-200 min-h-[120px]"
                        placeholder="Describe your impact and achievements..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">Start Date</Label>
                        <Input
                          type="date"
                          value={
                            experienceFormData.startDate
                              ? new Date(experienceFormData.startDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setExperienceFormData({
                              ...experienceFormData,
                              startDate: e.target.value,
                            })
                          }
                          required
                          className="rounded-md border-slate-200"
                        />
                      </div>
                      {!experienceFormData.current && (
                        <div className="space-y-2">
                          <Label className="font-bold">End Date</Label>
                          <Input
                            type="date"
                            value={
                              experienceFormData.endDate
                                ? new Date(experienceFormData.endDate)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setExperienceFormData({
                                ...experienceFormData,
                                endDate: e.target.value,
                              })
                            }
                            className="rounded-md border-slate-200"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-md border border-slate-100">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                        checked={experienceFormData.current}
                        onChange={(e) =>
                          setExperienceFormData({
                            ...experienceFormData,
                            current: e.target.checked,
                          })
                        }
                        id="currEx"
                      />
                      <Label
                        htmlFor="currEx"
                        className="font-bold text-slate-700"
                      >
                        Currently active in this role
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-md py-6 font-semibold bg-primary text-white hover:bg-primary/90 shadow-sm transition-all"
                    >
                      {experienceFormData._id
                        ? "Update Experience"
                        : "Save Experience"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-12">
              {profile.experience?.map((exp, i) => (
                <div key={i} className="group relative">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">
                        {exp.title}
                      </h4>
                      <div className="flex items-center gap-3 text-base text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">{exp.company}</span>
                        <span className="size-1 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          <Calendar className="size-3 text-primary" />
                          {new Date(exp.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          —
                          {exp.current
                            ? "PRESENT"
                            : exp.endDate
                              ? new Date(exp.endDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", year: "numeric" },
                                )
                              : "NA"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-full text-slate-400 hover:text-primary hover:bg-primary/10"
                        onClick={() => {
                          setExperienceFormData({
                            _id: exp._id!,
                            company: exp.company,
                            title: exp.title,
                            description: exp.description || "",
                            startDate: exp.startDate as string,
                            endDate: (exp.endDate as string) || "",
                            current: exp.current,
                          });
                          setIsEditExperienceOpen(true);
                        }}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                        onClick={async () => {
                          if (confirm("Permanently delete this record?")) {
                            try {
                              await useProfileStore
                                .getState()
                                .deleteExperience(exp._id!);
                              toast.success("Entry removed");
                            } catch {
                              toast.error("Deletion failed");
                            }
                          }
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-4 text-sm font-medium max-w-4xl border-l-2 border-slate-100 dark:border-slate-800 pl-6 ml-1 break-words">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
              {!profile.experience?.length && (
                <div className="text-center py-10 bg-slate-50/50 rounded-md border-2 border-dashed border-slate-100">
                  <p className="text-muted-foreground font-bold italic">
                    No professional records found. Add your first experience to
                    build credibility.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Portfolio Section */}
          <section className="bg-white dark:bg-slate-900 rounded-md p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="size-5 text-primary" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Portfolio Gallery
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md font-semibold px-4 border-slate-200 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-800 transition-all"
                onClick={() => {
                  setProjectFormData({
                    _id: "",
                    title: "",
                    description: "",
                    link: "",
                    technologies: [],
                    image: null,
                    previewUrl: "",
                  });
                  setIsAddProjectOpen(true);
                }}
              >
                <Plus className="size-4 mr-2" /> Publish Project
              </Button>

              {/* Project Add/Edit Dialog */}
              <Dialog
                open={isAddProjectOpen || isEditProjectOpen}
                onOpenChange={(val) => {
                  setIsAddProjectOpen(val && !projectFormData._id);
                  setIsEditProjectOpen(val && !!projectFormData._id);
                }}
              >
                <DialogContent className="max-w-xl rounded-md border-slate-200 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900">
                      {projectFormData._id
                        ? "Edit Portfolio Work"
                        : "New Project Spotlight"}
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handleAddProjectSubmit}
                    className="space-y-6 pt-4"
                  >
                    <div className="space-y-2">
                      <Label className="font-bold">Project Name</Label>
                      <Input
                        value={projectFormData.title}
                        onChange={(e) =>
                          setProjectFormData({
                            ...projectFormData,
                            title: e.target.value,
                          })
                        }
                        required
                        className="rounded-md border-slate-200"
                        placeholder="e.g. AI-Powered CRM"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Deep Dive Description</Label>
                      <Textarea
                        value={projectFormData.description}
                        onChange={(e) =>
                          setProjectFormData({
                            ...projectFormData,
                            description: e.target.value,
                          })
                        }
                        className="rounded-md border-slate-200 min-h-[100px]"
                        placeholder="What problem did you solve?"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">
                          Live Architecture / URL
                        </Label>
                        <Input
                          value={projectFormData.link}
                          onChange={(e) =>
                            setProjectFormData({
                              ...projectFormData,
                              link: e.target.value,
                            })
                          }
                          className="rounded-md border-slate-200"
                          placeholder="https://your-project.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Tech Stack</Label>
                        <div className="flex gap-2 mb-2 flex-wrap">
                          {projectFormData.technologies.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-bold"
                            >
                              {skill}
                              <X
                                className="size-3 cursor-pointer text-slate-400 hover:text-rose-500"
                                onClick={() =>
                                  setProjectFormData({
                                    ...projectFormData,
                                    technologies:
                                      projectFormData.technologies.filter(
                                        (t) => t !== skill,
                                      ),
                                  })
                                }
                              />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (
                                  newSkill.trim() &&
                                  !projectFormData.technologies.includes(
                                    newSkill.trim(),
                                  )
                                ) {
                                  setProjectFormData({
                                    ...projectFormData,
                                    technologies: [
                                      ...projectFormData.technologies,
                                      newSkill.trim(),
                                    ],
                                  });
                                  setNewSkill("");
                                }
                              }
                            }}
                            placeholder="Add skill..."
                            className="rounded-md border-slate-200"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              if (
                                newSkill.trim() &&
                                !projectFormData.technologies.includes(
                                  newSkill.trim(),
                                )
                              ) {
                                setProjectFormData({
                                  ...projectFormData,
                                  technologies: [
                                    ...projectFormData.technologies,
                                    newSkill.trim(),
                                  ],
                                });
                                setNewSkill("");
                              }
                            }}
                            className="rounded-md bg-slate-50 hover:bg-primary hover:text-white font-bold"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Showcase Image</Label>
                      {projectFormData.image && (
                        <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-100 mb-2 border border-slate-200 shadow-inner">
                          <Image
                            src={URL.createObjectURL(projectFormData.image)}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 size-8 rounded-full shadow-lg"
                            onClick={() =>
                              setProjectFormData({
                                ...projectFormData,
                                image: null,
                              })
                            }
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      )}
                      {!projectFormData.image &&
                        projectFormData._id &&
                        profile.projects?.find(
                          (p) => p._id === projectFormData._id,
                        )?.image && (
                          <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-100 mb-2 border border-slate-200 shadow-inner">
                            <Image
                              src={
                                profile.projects.find(
                                  (p) => p._id === projectFormData._id,
                                )!.image!
                              }
                              alt="Existing"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      <Input
                        type="file"
                        onChange={(e) =>
                          setProjectFormData({
                            ...projectFormData,
                            image: e.target.files?.[0] || null,
                          })
                        }
                        className="rounded-md border-slate-200 cursor-pointer"
                        accept="image/*"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-md py-6 font-semibold bg-primary text-white shadow-sm transition-all"
                    >
                      {isLoading
                        ? "Saving..."
                        : projectFormData._id
                          ? "Update Project"
                          : "Launch Project"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {profile.projects?.map((project, i) => (
                <div
                  key={i}
                  className="group relative rounded-md overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="size-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                        <Code2 className="size-16 text-slate-200 dark:text-slate-800" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 flex flex-col justify-end">
                      <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {project.link && (
                          <Link
                            href={project.link}
                            target="_blank"
                            className="bg-white text-slate-900 px-4 py-2 rounded-md font-semibold text-xs hover:bg-slate-50 transition-colors"
                          >
                            Preview
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setProjectFormData({
                              _id: project._id!,
                              title: project.title,
                              description: project.description || "",
                              link: project.link || "",
                              technologies: project.technologies || [],
                              image: null,
                              previewUrl: "",
                            });
                            setIsEditProjectOpen(true);
                          }}
                          className="bg-slate-900 text-white px-4 py-2 rounded-md font-semibold text-xs hover:bg-slate-800 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2 translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="size-9 rounded-full shadow-2xl overflow-hidden"
                        onClick={() =>
                          confirm("Destroy this project listing?") &&
                          deleteProject(project._id!)
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {project.title}
                      </h4>
                      <div className="flex gap-1 flex-wrap justify-end max-w-[50%]">
                        {project.technologies?.slice(0, 3).map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-3 leading-relaxed flex-1 break-words">
                      {project.description ||
                        "Experimental digital product built using modern architectural patterns and best practices."}
                    </p>
                  </div>
                </div>
              ))}

            {(!profile.projects || profile.projects.length === 0) && (
        <div className="col-span-full py-20 bg-slate-50 dark:bg-slate-900/40 rounded-md border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-center">
            <div className="size-16 rounded-md bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
              <FolderPlus className="size-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Your Showcase is Empty</h3>
              <p className="text-muted-foreground text-sm font-medium max-w-sm">Publish your projects to showcase your technical brilliance.</p>
            </div>
            <Button
              onClick={() => setIsAddProjectOpen(true)}
              className="mt-2 bg-primary text-white font-semibold px-8 py-2 rounded-md transition-all"
            >
              Add Your First Project
            </Button>
        </div>
      )}
            </div>
          </section>

          {/* Education Section */}
          <section className="bg-white dark:bg-slate-900 rounded-md p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <GraduationCap className="size-5 text-primary" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Education
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-md font-semibold px-4 border-slate-200 hover:bg-primary hover:text-white transition-all"
                onClick={() => {
                  setEducationFormData({
                    _id: "",
                    institution: "",
                    degree: "",
                    field: "",
                    startYear: 2020,
                    endYear: 2024,
                    current: false,
                  });
                  setIsAddEducationOpen(true);
                }}
              >
                <Plus className="size-4 mr-2" /> Add Education
              </Button>

              <Dialog
                open={isAddEducationOpen || isEditEducationOpen}
                onOpenChange={(val) => {
                  setIsAddEducationOpen(val && !educationFormData._id);
                  setIsEditEducationOpen(val && !!educationFormData._id);
                }}
              >
                <DialogContent className="max-w-xl rounded-md border-slate-200 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-slate-900">
                      {educationFormData._id
                        ? "Edit Education"
                        : "Add Education Record"}
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddEducationSubmit(educationFormData);
                    }}
                    className="space-y-6 pt-4"
                  >
                    <div className="space-y-2">
                      <Label className="font-bold">
                        Institution / University
                      </Label>
                      <Input
                        value={educationFormData.institution}
                        onChange={(e) =>
                          setEducationFormData({
                            ...educationFormData,
                            institution: e.target.value,
                          })
                        }
                        required
                        className="rounded-md border-slate-200"
                        placeholder="e.g. Stanford University"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">Degree Type</Label>
                        <Input
                          value={educationFormData.degree}
                          onChange={(e) =>
                            setEducationFormData({
                              ...educationFormData,
                              degree: e.target.value,
                            })
                          }
                          required
                          className="rounded-md border-slate-200"
                          placeholder="e.g. Bachelor of Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Field of Mastery</Label>
                        <Input
                          value={educationFormData.field}
                          onChange={(e) =>
                            setEducationFormData({
                              ...educationFormData,
                              field: e.target.value,
                            })
                          }
                          required
                          className="rounded-md border-slate-200"
                          placeholder="e.g. Computer Science"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">Start Year</Label>
                        <Input
                          type="number"
                          value={educationFormData.startYear}
                          onChange={(e) =>
                            setEducationFormData({
                              ...educationFormData,
                              startYear: parseInt(e.target.value),
                            })
                          }
                          required
                          className="rounded-md border-slate-200"
                        />
                      </div>
                      {!educationFormData.current && (
                        <div className="space-y-2">
                          <Label className="font-bold">Completion Year</Label>
                          <Input
                            type="number"
                            value={educationFormData.endYear}
                            onChange={(e) =>
                              setEducationFormData({
                                ...educationFormData,
                                endYear: parseInt(e.target.value),
                              })
                            }
                            className="rounded-md border-slate-200"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-md border border-blue-100">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                        checked={educationFormData.current}
                        onChange={(e) =>
                          setEducationFormData({
                            ...educationFormData,
                            current: e.target.checked,
                          })
                        }
                        id="currEdu"
                      />
                      <Label
                        htmlFor="currEdu"
                        className="font-bold text-blue-900"
                      >
                        Enrolled in active study
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-md py-6 font-semibold bg-primary text-white shadow-sm"
                    >
                      {educationFormData._id
                        ? "Update Education"
                        : "Save Education"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-12">
              {profile.education?.map((edu, i) => (
                <div key={i} className="group relative">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">
                        {edu.degree} in {edu.field}
                      </h4>
                      <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                        {edu.institution}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        <Calendar className="size-3" />
                        {edu.startYear} —{" "}
                        {edu.current ? "ACTIVE" : edu.endYear || "PRESENT"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          setEducationFormData({
                            _id: edu._id!,
                            institution: edu.institution,
                            degree: edu.degree,
                            field: edu.field,
                            startYear: edu.startYear,
                            endYear: edu.endYear || new Date().getFullYear(),
                            current: edu.current,
                          });
                          setIsEditEducationOpen(true);
                        }}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                        onClick={async () => {
                          if (confirm("Expunge this academic record?")) {
                            try {
                              await deleteEducation(edu._id!);
                              toast.success("Credential removed");
                            } catch {
                              toast.error("Process failed");
                            }
                          }
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  {i < (profile.education?.length || 0) - 1 && (
                    <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mt-10" />
                  )}
                </div>
              ))}
              {!profile.education?.length && (
                <div className="text-center py-10 bg-slate-50 rounded-md border-2 border-dashed border-slate-100">
                  <p className="text-muted-foreground font-bold italic">
                    Educational background not yet synchronized.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
