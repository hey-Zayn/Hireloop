"use client";

import { useEffect, useState } from "react";
import { useProfileStore, Education, Experience } from "@/lib/store/useProfileStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  X
} from "lucide-react";
import { toast } from "sonner";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { profile, getProfile, upsertProfile, addProject, deleteProject, isLoading } = useProfileStore();

  const { user, updateUser } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Modal States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false);
  const [isEditExperienceOpen, setIsEditExperienceOpen] = useState(false);
  const [isAddEducationOpen, setIsAddEducationOpen] = useState(false);

  // Form States
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phone: "",
    headline: "",
    bio: "",
    location: "",
    linkedIn: "",
    github: "",
    portfolio: ""
  });

  const [projectFormData, setProjectFormData] = useState({
    title: "",
    description: "",
    link: "",
    technologies: [] as string[],
    image: null as File | null
  });
  const [newSkill, setNewSkill] = useState("");

  const [experienceFormData, setExperienceFormData] = useState({
    _id: "",
    company: "",
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false
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
        portfolio: profile.portfolio || ""
      });
      setIsInitialized(true);
    }
  }, [profile, user, isInitialized]);

  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({ fullName: editFormData.fullName, phone: editFormData.phone });
      await upsertProfile({
        headline: editFormData.headline,
        bio: editFormData.bio,
        location: editFormData.location,
        linkedIn: editFormData.linkedIn,
        github: editFormData.github,
        portfolio: editFormData.portfolio
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
      formData.append("technologies", JSON.stringify(projectFormData.technologies));
      if (projectFormData.image) {
        formData.append("image", projectFormData.image);
      }
      await addProject(formData);
      setIsAddProjectOpen(false);
      setProjectFormData({ title: "", description: "", link: "", technologies: [], image: null });
      toast.success("Project added successfully");
    } catch {
      toast.error("Failed to add project");
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
          endDate: experienceFormData.current ? undefined : experienceFormData.endDate,
          current: experienceFormData.current
       };

       if (experienceFormData._id) {
          await useProfileStore.getState().updateExperience(experienceFormData._id, payload);
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
      await useProfileStore.getState().addEducation(payload);
      setIsAddEducationOpen(false);
      toast.success("Education added successfully");
    } catch {
      toast.error("Failed to add education");
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
        <div className="p-4 bg-primary/5 rounded-full">
           <Briefcase className="size-12 text-primary opacity-20" />
        </div>
        <h2 className="text-2xl font-bold">No profile found</h2>
        <p className="text-muted-foreground">Please complete your onboarding to see your profile.</p>
        <Link href="/candidate/setup">
          <Button className="rounded-xl px-8">Set up Profile</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto pb-20 space-y-8 animate-in fade-in duration-700 font-sans px-4">
      {/* Header Section */}
      <section className="bg-white dark:bg-slate-900 rounded-md overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        <div className="relative h-48 md:h-64 bg-linear-to-r from-[#D946EF] via-[#A855F7] to-[#8B5CF6]">
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
           <div className="absolute top-0 right-0 w-full h-full bg-linear-to-b from-transparent to-black/10"></div>
        </div>

        <div className="relative px-8 pb-10 flex flex-col md:flex-row gap-8">
           <div className="relative -mt-20 md:-mt-24 group">
              <div className="relative size-32 md:size-48 rounded-full border-[8px] border-white dark:border-slate-900 bg-slate-100 overflow-hidden shadow-xl">
                 {user?.avatar ? (
                    <Image src={user.avatar} alt={user.fullName || "User Avatar"} fill className="object-cover" />
                 ) : (
                    <div className="size-full flex items-center justify-center bg-slate-200 text-6xl font-bold text-slate-400">
                       {user?.fullName?.charAt(0)}
                    </div>
                 )}
                 <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="size-8 text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (file) {
                          useAuthStore.getState().updateAvatar(file);
                       }
                    }} />
                 </label>
              </div>
           </div>

            <div className="flex-1 mt-4 md:mt-8 space-y-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                     <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{user?.fullName}</h1>
                     <p className="text-lg text-muted-foreground font-medium">{profile.headline || "Digital Professional"}</p>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-50 dark:bg-slate-800/50 w-fit px-3 py-1 rounded-md border border-slate-100 dark:border-slate-700 font-bold">
                        <MapPin className="size-4 text-primary" /> {profile.location || "Earth"}
                     </div>
                  </div>

                 <div className="flex items-center gap-3">
                    <Link href={`mailto:${user?.email}`}>
                       <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:border-primary/50 transition-colors">
                          <Mail className="size-4" />
                       </Button>
                    </Link>
                    <Link href={profile.linkedIn || "#"}>
                       <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:border-primary/50 transition-colors">
                          <Linkedin className="size-4" />
                       </Button>
                    </Link>
                    <Link href={profile.github || "#"}>
                       <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:border-primary/50 transition-colors">
                          <Github className="size-4" />
                       </Button>
                    </Link>
                    <Button className="bg-[#fb7185] hover:bg-[#f43f5e] text-white font-bold px-8 rounded-full shadow-lg shadow-rose-200/50 ml-2" onClick={() => toast.info("Hire feature coming soon!")}>
                       Hire Me
                    </Button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                 <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                       <Briefcase className="size-6 text-primary" />
                    </div>
                    <div>
                       <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Work</p>
                       <p className="text-sm font-bold truncate max-w-[200px]">{profile.experience?.[0]?.company || "Freelance"}</p>
                    </div>
                 </div>
                 <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                       <GraduationCap className="size-6 text-blue-500" />
                    </div>
                    <div>
                       <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Education</p>
                       <p className="text-sm font-bold truncate max-w-[200px]">{profile.education?.[0]?.institution || "Unspecified"}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="rounded-md border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
              <CardContent className="p-8 space-y-6">
                 <h3 className="text-xl font-bold">Skills</h3>
                 <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                       <Badge key={skill} variant="outline" className="px-4 py-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-md bg-slate-50/5 hover:bg-slate-100 transition-colors">
                          {skill}
                       </Badge>
                    ))}
                 </div>
              </CardContent>
           </Card>

           <Card className="rounded-md border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-slate-900">
              <CardContent className="p-8 space-y-6">
                 <h3 className="text-xl font-bold">Social Profiles</h3>
                 <div className="flex gap-4">
                    <Link href={profile.portfolio || "#"} className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                       <Globe className="size-5" />
                    </Link>
                    <Link href={profile.github || "#"} className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-slate-700 transition-all transform hover:scale-110">
                       <Github className="size-5" />
                    </Link>
                    <Link href={profile.linkedIn || "#"} className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-all transform hover:scale-110">
                       <Linkedin className="size-5" />
                    </Link>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
            {/* About Me Section */}
            <div className="bg-white dark:bg-slate-900 rounded-md p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold">About Me</h3>
                     <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                        <DialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="rounded-md hover:bg-slate-100">
                              <Edit className="size-4 text-slate-400" />
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-md">
                           <DialogHeader>
                              <DialogTitle className="text-2xl font-bold px-2">Edit Profile Details</DialogTitle>
                           </DialogHeader>
                             <form onSubmit={handleEditProfileSubmit} className="space-y-6 p-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <Label>Full Name</Label>
                                      <Input 
                                         value={editFormData.fullName} 
                                         onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})} 
                                         className="rounded-md"
                                      />
                                   </div>
                                   <div className="space-y-2">
                                      <Label>Phone</Label>
                                      <Input 
                                         value={editFormData.phone} 
                                         onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} 
                                         className="rounded-md"
                                      />
                                   </div>
                                </div>
                                <div className="space-y-2">
                                   <Label>Professional Headline</Label>
                                   <Input 
                                      value={editFormData.headline} 
                                      onChange={(e) => setEditFormData({...editFormData, headline: e.target.value})} 
                                      className="rounded-md"
                                   />
                                </div>
                                <div className="space-y-2">
                                   <Label>Bio</Label>
                                   <Textarea 
                                      value={editFormData.bio} 
                                      onChange={(e) => setEditFormData({...editFormData, bio: e.target.value})} 
                                      className="rounded-md min-h-[120px]"
                                   />
                                </div>
                                <div className="space-y-2">
                                   <Label>Location</Label>
                                   <Input 
                                      value={editFormData.location} 
                                      onChange={(e) => setEditFormData({...editFormData, location: e.target.value})} 
                                      className="rounded-md"
                                   />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <Label>LinkedIn</Label>
                                      <Input 
                                         value={editFormData.linkedIn} 
                                         onChange={(e) => setEditFormData({...editFormData, linkedIn: e.target.value})} 
                                         className="rounded-md"
                                      />
                                   </div>
                                   <div className="space-y-2">
                                      <Label>Github</Label>
                                      <Input 
                                         value={editFormData.github} 
                                         onChange={(e) => setEditFormData({...editFormData, github: e.target.value})} 
                                         className="rounded-md"
                                      />
                                   </div>
                                </div>
                                <Button type="submit" className="w-full rounded-md py-6 font-bold text-lg">
                                   Save Changes
                                </Button>
                             </form>
                          </DialogContent>
                       </Dialog>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl whitespace-pre-wrap">
                       {profile.bio || "No biography provided yet. HireLoop helps companies find the best talent."}
                    </p>
                 </div>

                 {/* Experience Section */}
                 <div className="bg-white dark:bg-slate-900 rounded-md p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold">Experience</h3>
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-md font-bold text-primary"
                        onClick={() => {
                           setExperienceFormData({ _id: "", company: "", title: "", description: "", startDate: "", endDate: "", current: false });
                           setIsAddExperienceOpen(true);
                        }}
                     >
                        <Plus className="size-4 mr-2" /> Add
                     </Button>
                     
                     <Dialog open={isAddExperienceOpen || isEditExperienceOpen} onOpenChange={(val) => {
                        setIsAddExperienceOpen(val && !experienceFormData._id);
                        setIsEditExperienceOpen(val && !!experienceFormData._id);
                     }}>
                        <DialogContent className="max-w-xl rounded-md">
                             <DialogHeader>
                                <DialogTitle className="text-2xl font-bold px-2">
                                   {experienceFormData._id ? "Edit Experience" : "Add Experience"}
                                </DialogTitle>
                             </DialogHeader>
                             <form onSubmit={handleExperienceSubmit} className="space-y-4 p-2">
                                <div className="space-y-2">
                                   <Label>Company</Label>
                                   <Input 
                                      value={experienceFormData.company} 
                                      onChange={(e) => setExperienceFormData({...experienceFormData, company: e.target.value})}
                                      required 
                                      className="rounded-md" 
                                   />
                                </div>
                                <div className="space-y-2">
                                   <Label>Title</Label>
                                   <Input 
                                      value={experienceFormData.title} 
                                      onChange={(e) => setExperienceFormData({...experienceFormData, title: e.target.value})}
                                      required 
                                      className="rounded-md" 
                                   />
                                </div>
                                <div className="space-y-2">
                                   <Label>Description</Label>
                                   <Textarea 
                                      value={experienceFormData.description} 
                                      onChange={(e) => setExperienceFormData({...experienceFormData, description: e.target.value})}
                                      className="rounded-md" 
                                   />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <Label>Start Date</Label>
                                      <Input 
                                         type="date" 
                                         value={experienceFormData.startDate ? new Date(experienceFormData.startDate).toISOString().split('T')[0] : ""} 
                                         onChange={(e) => setExperienceFormData({...experienceFormData, startDate: e.target.value})}
                                         required 
                                         className="rounded-md" 
                                      />
                                   </div>
                                   {!experienceFormData.current && (
                                      <div className="space-y-2">
                                         <Label>End Date</Label>
                                         <Input 
                                            type="date" 
                                            value={experienceFormData.endDate ? new Date(experienceFormData.endDate).toISOString().split('T')[0] : ""} 
                                            onChange={(e) => setExperienceFormData({...experienceFormData, endDate: e.target.value})}
                                            className="rounded-md" 
                                         />
                                      </div>
                                   )}
                                </div>
                                <div className="flex items-center gap-2">
                                   <input 
                                      type="checkbox" 
                                      checked={experienceFormData.current} 
                                      onChange={(e) => setExperienceFormData({...experienceFormData, current: e.target.checked})}
                                      id="currEx" 
                                   />
                                   <Label htmlFor="currEx">I am currently working here</Label>
                                </div>
                                <Button type="submit" className="w-full rounded-md py-6 font-bold">
                                   {experienceFormData._id ? "Update" : "Add"} Experience
                                </Button>
                             </form>
                          </DialogContent>
                       </Dialog>
                    </div>

                  <div className="space-y-10">
                     {profile.experience?.map((exp, i) => (
                        <div key={i} className="group relative flex flex-col gap-2">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{exp.title}</h4>
                                 <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{exp.company}</p>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-md text-slate-400 hover:text-primary"
                                    onClick={() => {
                                       setExperienceFormData({
                                          _id: exp._id!,
                                          company: exp.company,
                                          title: exp.title,
                                          description: exp.description || "",
                                          startDate: exp.startDate as string,
                                          endDate: exp.endDate as string || "",
                                          current: exp.current
                                       });
                                       setIsEditExperienceOpen(true);
                                    }}
                                 >
                                    <Edit className="size-4" />
                                 </Button>
                                 <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-md text-slate-400 hover:text-red-500"
                                    onClick={async () => {
                                       if(confirm("Are you sure you want to delete this experience?")) {
                                          try {
                                             await useProfileStore.getState().deleteExperience(exp._id!);
                                             toast.success("Experience deleted");
                                          } catch {
                                             toast.error("Failed to delete experience");
                                          }
                                       }
                                    }}
                                 >
                                    <Trash2 className="size-4" />
                                 </Button>
                              </div>
                           </div>
                           <p className="text-sm text-muted-foreground font-bold flex items-center gap-2">
                              <Calendar className="size-4 text-primary/60" />
                              {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} - 
                              {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                           </p>
                           {exp.description && (
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-2 text-sm max-w-3xl">
                                 {exp.description}
                              </p>
                           )}
                           {i < (profile.experience?.length || 0) - 1 && (
                              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mt-6" />
                           )}
                        </div>
                     ))}
                     {!profile.experience?.length && <p className="text-muted-foreground italic">No experience added yet.</p>}
                  </div>
                 </div>

                 {/* Portfolio Section */}
                 <div className="bg-white dark:bg-slate-900 rounded-md p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-bold">Portfolio Projects</h3>
                       <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
                          <DialogTrigger asChild>
                             <Button variant="ghost" size="sm" className="rounded-md font-bold text-primary">
                                <Plus className="size-4 mr-2" /> Upload Project
                             </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl rounded-md">
                             <DialogHeader>
                                <DialogTitle className="text-2xl font-bold px-2">Upload Project</DialogTitle>
                             </DialogHeader>
                             <form onSubmit={handleAddProjectSubmit} className="space-y-6 p-2">
                                <div className="space-y-2">
                                   <Label>Title</Label>
                                   <Input 
                                      value={projectFormData.title} 
                                      onChange={(e) => setProjectFormData({...projectFormData, title: e.target.value})} 
                                      required
                                      className="rounded-md"
                                   />
                                </div>
                                <div className="space-y-2">
                                   <Label>Description</Label>
                                   <Textarea 
                                      value={projectFormData.description} 
                                      onChange={(e) => setProjectFormData({...projectFormData, description: e.target.value})} 
                                      className="rounded-md min-h-[100px]"
                                   />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <Label>Link (optional)</Label>
                                      <Input 
                                         value={projectFormData.link} 
                                         onChange={(e) => setProjectFormData({...projectFormData, link: e.target.value})} 
                                         className="rounded-md"
                                         placeholder="https://..."
                                      />
                                   </div>
                                   <div className="space-y-2">
                                      <Label>Technologies</Label>
                                      <div className="flex gap-2 mb-2 flex-wrap">
                                         {projectFormData.technologies.map(skill => (
                                            <Badge key={skill} variant="secondary" className="gap-1 px-2 py-1 rounded-md">
                                               {skill}
                                               <X className="size-3 cursor-pointer" onClick={() => setProjectFormData({...projectFormData, technologies: projectFormData.technologies.filter(t => t !== skill)})} />
                                            </Badge>
                                         ))}
                                      </div>
                                      <div className="flex gap-2">
                                         <Input 
                                            value={newSkill} 
                                            onChange={(e) => setNewSkill(e.target.value)} 
                                            onKeyDown={(e) => {
                                               if(e.key === 'Enter') {
                                                  e.preventDefault();
                                                  if(newSkill.trim() && !projectFormData.technologies.includes(newSkill.trim())) {
                                                     setProjectFormData({...projectFormData, technologies: [...projectFormData.technologies, newSkill.trim()]});
                                                     setNewSkill("");
                                                  }
                                               }
                                            }}
                                            placeholder="Press Enter to add"
                                            className="rounded-md"
                                         />
                                         <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => {
                                               if(newSkill.trim() && !projectFormData.technologies.includes(newSkill.trim())) {
                                                  setProjectFormData({...projectFormData, technologies: [...projectFormData.technologies, newSkill.trim()]});
                                                  setNewSkill("");
                                               }
                                            }}
                                            className="rounded-md"
                                         >Add</Button>
                                      </div>
                                   </div>
                                </div>
                                <div className="space-y-2">
                                   <Label>Project Image</Label>
                                   {projectFormData.image && (
                                       <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-100 mb-2 border border-slate-200">
                                          <Image src={URL.createObjectURL(projectFormData.image)} alt="Preview" fill className="object-cover" />
                                          <Button 
                                             type="button" 
                                             variant="destructive" 
                                             size="icon" 
                                             className="absolute top-2 right-2 size-8 rounded-md"
                                             onClick={() => setProjectFormData({...projectFormData, image: null})}
                                          >
                                             <Trash2 className="size-4" />
                                          </Button>
                                       </div>
                                    )}
                                   <Input 
                                      type="file" 
                                      onChange={(e) => setProjectFormData({...projectFormData, image: e.target.files?.[0] || null})} 
                                      className="rounded-md"
                                      accept="image/*"
                                   />
                                </div>
                                <Button type="submit" className="w-full rounded-md py-6 font-bold text-lg">
                                   {isLoading ? "Uploading..." : "Publish Project"}
                                </Button>
                             </form>
                          </DialogContent>
                       </Dialog>
                    </div>
 
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {profile.projects?.map((project, i) => (
                          <div key={i} className="group relative rounded-md overflow-hidden aspect-square shadow-lg shadow-slate-200/50 border border-slate-100">
                             {project.image ? (
                                <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                             ) : (
                                <div className="size-full bg-slate-100 flex items-center justify-center">
                                   <Code2 className="size-12 text-slate-200" />
                                </div>
                             )}
                             <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                                <div className="absolute top-4 right-4 flex gap-2">
                                   <Button 
                                      variant="destructive" 
                                      size="icon" 
                                      className="size-8 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => project._id && deleteProject(project._id)}
                                   >
                                      <Trash2 className="size-4" />
                                   </Button>
                                </div>
                                <h4 className="text-white font-bold">{project.title}</h4>
                                <p className="text-white/70 text-xs truncate">{project.description}</p>
                                <div className="flex gap-2 mt-2">
                                   {project.link && (
                                      <Link href={project.link} target="_blank">
                                         <LinkIcon className="size-4 text-white hover:text-primary transition-colors" />
                                      </Link>
                                   )}
                                </div>
                             </div>
                          </div>
                       ))}
                       {(!profile.projects || profile.projects.length === 0) && (
                          <div className="col-span-1 md:col-span-3 h-48 rounded-md border-2 border-slate-100 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground bg-slate-50/50">
                             <Sparkles className="size-8 opacity-20" />
                             <p className="font-medium text-sm">Add projects to showcase your professional work</p>
                          </div>
                       )}
                    </div>
                 </div>
 
                 {/* Education Section */}
                 <div className="bg-white dark:bg-slate-900 rounded-md p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-bold">Education</h3>
                       <Dialog open={isAddEducationOpen} onOpenChange={setIsAddEducationOpen}>
                          <DialogTrigger asChild>
                             <Button variant="ghost" size="sm" className="rounded-md font-bold text-primary">
                                <Plus className="size-4 mr-2" /> Add
                             </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl rounded-md">
                             <DialogHeader>
                                <DialogTitle className="text-2xl font-bold px-2">Add Education</DialogTitle>
                             </DialogHeader>
                             <form onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                handleAddEducationSubmit({
                                   institution: (form.elements.namedItem('institution') as HTMLInputElement).value,
                                   degree: (form.elements.namedItem('degree') as HTMLInputElement).value,
                                   field: (form.elements.namedItem('field') as HTMLInputElement).value,
                                   startYear: parseInt((form.elements.namedItem('startYear') as HTMLInputElement).value),
                                   endYear: (form.elements.namedItem('current') as HTMLInputElement).checked ? undefined : parseInt((form.elements.namedItem('endYear') as HTMLInputElement).value),
                                   current: (form.elements.namedItem('current') as HTMLInputElement).checked
                                });
                             }} className="space-y-4 p-2">
                                <div className="space-y-2">
                                   <Label>Institution</Label>
                                   <Input name="institution" required className="rounded-md" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <Label>Degree</Label>
                                      <Input name="degree" required className="rounded-md" />
                                   </div>
                                   <div className="space-y-2">
                                      <Label>Field of Study</Label>
                                      <Input name="field" required className="rounded-md" />
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      <Label>Start Year</Label>
                                      <Input name="startYear" type="number" required className="rounded-md" />
                                   </div>
                                   <div className="space-y-2">
                                      <Label>End Year</Label>
                                      <Input name="endYear" type="number" className="rounded-md" />
                                   </div>
                                </div>
                                <div className="flex items-center gap-2">
                                   <input type="checkbox" name="current" id="currEdu" />
                                   <Label htmlFor="currEdu">I am currently studying here</Label>
                                </div>
                                <Button type="submit" className="w-full rounded-md py-6 font-bold">Add Education</Button>
                             </form>
                          </DialogContent>
                       </Dialog>
                    </div>
                    <div className="space-y-10">
                       {profile.education?.map((edu, i) => (
                          <div key={i} className="group relative flex flex-col gap-2">
                             <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                   <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{edu.degree} in {edu.field}</h4>
                                   <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{edu.institution}</p>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 rounded-md text-slate-400 hover:text-red-500"
                                      onClick={async () => {
                                         if(confirm("Are you sure you want to delete this education entry?")) {
                                            try {
                                               await useProfileStore.getState().deleteEducation(edu._id!);
                                               toast.success("Education deleted");
                                            } catch {
                                               toast.error("Failed to delete education");
                                            }
                                         }
                                      }}
                                   >
                                      <Trash2 className="size-4" />
                                   </Button>
                                </div>
                             </div>
                             <p className="text-sm text-muted-foreground font-bold flex items-center gap-2">
                                <GraduationCap className="size-4 text-primary/60" />
                                {edu.startYear} - {edu.current ? 'Present' : edu.endYear || ''}
                             </p>
                             {i < (profile.education?.length || 0) - 1 && (
                                <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mt-6" />
                             )}
                          </div>
                       ))}
                       {!profile.education?.length && <p className="text-muted-foreground italic">No education history added yet.</p>}
                    </div>
                 </div>
              </div>
           </div>
        </div>
  );
}
