"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Briefcase, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Phone,
  Linkedin,
  Github,
  Award,
  X,
  Code2
} from "lucide-react";
import Image from "next/image";



import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "identity", title: "Identity", icon: User },
  { id: "expertise", title: "Expertise", icon: Briefcase },
  { id: "presence", title: "Presence", icon: Globe },
  { id: "projects", title: "Projects", icon: Code2 },
  { id: "review", title: "Review", icon: CheckCircle2 },
];


export default function OnboardingPage() {
  const router = useRouter();
  const { profile, upsertProfile, getProfile, uploadResume, addProject, deleteProject } = useProfileStore();


  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    phone: "",
    headline: "",
    bio: "",
    skills: [] as string[],
    experienceYears: 0,
    salaryExpected: "",
    location: "",
    portfolio: "",
    linkedIn: "",
    github: "",
    isOpenToWork: true,
  });

  const [skillInput, setSkillInput] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  // Project temporary state
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    link: "",
    technologies: ""
  });
  const [projectImage, setProjectImage] = useState<File | null>(null);


  useEffect(() => {

    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (profile && !isInitialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        phone: profile.phone || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        skills: profile.skills || [],
        experienceYears: profile.experienceYears || 0,
        salaryExpected: profile.salaryExpected || "",
        location: profile.location || "",
        portfolio: profile.portfolio || "",
        linkedIn: profile.linkedIn || "",
        github: profile.github || "",
        isOpenToWork: profile.isOpenToWork ?? true,
      });
      setIsInitialized(true);
    }
  }, [profile, isInitialized]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const nextStep = () => {
    if (currentStep === 0 && !formData.headline) {
      toast.error("Headline is required to help recruiters find you.");
      return;
    }
    if (currentStep === 1 && formData.skills.length === 0) {
      toast.error("Please add at least one skill.");
      return;
    }
    if (currentStep === 3 && (profile?.projects?.length || 0) === 0) {
      toast.warning("Adding projects can significantly increase your hire-rate!");
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };



  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    try {
      if (resumeFile) {
        await uploadResume(resumeFile);
      }
      await upsertProfile(formData);
      toast.success("Profile setup complete! Welcome aboard.");
      router.push("/candidate");
    } catch {
       // Error handled by store
    }
  };

  const handleAddProject = async () => {
    if (!projectForm.title) return toast.error("Title is required");
    const fd = new FormData();
    fd.append("title", projectForm.title);
    fd.append("description", projectForm.description);
    fd.append("link", projectForm.link);
    fd.append("technologies", projectForm.technologies);
    if (projectImage) fd.append("image", projectImage);

    try {
      await addProject(fd);
      setIsAddingProject(false);
      setProjectForm({ title: "", description: "", link: "", technologies: "" });
      setProjectImage(null);
    } catch {
      // Error handled
    }
  };


  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="outline" className="px-4 py-1 border-primary/20 text-primary bg-primary/5 rounded-full mb-4">
            <Sparkles className="size-3 mr-2" />
            Complete Your Journey
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">

            Let&apos;s build your professional identity
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete these {STEPS.length} steps to unlock AI job matching and quick apply.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
             {STEPS.map((step, idx) => {
               const Icon = step.icon;
               const isActive = idx === currentStep;
               const isCompleted = idx < currentStep;
               return (
                 <div key={step.id} className="flex flex-col items-center gap-2 group">
                   <div className={cn(
                     "size-10 rounded-2xl flex items-center justify-center transition-all duration-300",
                     isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" : 
                     isCompleted ? "bg-green-100 text-green-600 dark:bg-green-900/30" : "bg-white dark:bg-slate-800 text-muted-foreground border border-slate-200 dark:border-slate-700"
                   )}>
                     {isCompleted ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}
                   </div>
                   <span className={cn(
                     "text-xs font-semibold",
                     isActive ? "text-primary" : "text-muted-foreground"
                   )}>
                     {step.title}
                   </span>
                 </div>
               )
             })}
          </div>
          <Progress value={progress} className="h-2 rounded-full overflow-hidden" />
        </div>

        {/* Form Content */}
        <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            {currentStep === 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Personal Details</h2>
                  <p className="text-muted-foreground">This helps us introduce you to top companies.</p>
                </div>
                
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        name="phone"
                        placeholder="+1 (555) 000-0000" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume / CV (PDF or Doc)</Label>
                    <Input 
                      id="resume" 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="h-12 rounded-xl py-2 cursor-pointer"
                    />
                  </div>
                  
                  <div className="space-y-2">

                    <Label htmlFor="headline">Professional Headline <span className="text-destructive">*</span></Label>
                    <Input 
                      id="headline" 
                      name="headline"
                      placeholder="e.g. Senior Frontend Engineer | React & Next.js" 
                      value={formData.headline}
                      onChange={handleInputChange}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Tell recruiters about yourself (Bio)</Label>
                    <Textarea 
                      id="bio" 
                      name="bio"
                      placeholder="Share your goals and what you enjoy building..." 
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="min-h-[120px] rounded-xl resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Your Expertise</h2>
                  <p className="text-muted-foreground">Add your core technical skills and experience level.</p>
                </div>
                
                <div className="grid gap-6">
                   <div className="space-y-2">
                    <Label>Core Skills <span className="text-destructive">*</span></Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="e.g. React" 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        className="h-12 rounded-xl"
                      />
                      <Button type="button" onClick={addSkill} className="h-12 rounded-xl px-6">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {formData.skills.map(skill => (
                        <Badge key={skill} className="pl-3 py-1 pr-1 bg-primary/10 text-primary border-none rounded-lg hover:bg-primary/20">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-destructive">
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experienceYears">Years of Experience</Label>
                      <Input 
                        id="experienceYears" 
                        name="experienceYears"
                        type="number"
                        value={formData.experienceYears}
                        onChange={handleInputChange}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryExpected">Salary Expectation (Annually)</Label>
                      <Input 
                        id="salaryExpected" 
                        name="salaryExpected"
                        placeholder="e.g. $120k - $150k" 
                        value={formData.salaryExpected}
                        onChange={handleInputChange}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Preferred Location / Remote</Label>
                    <Input 
                      id="location" 
                      name="location"
                      placeholder="e.g. Remote or San Francisco, CA" 
                      value={formData.location}
                      onChange={handleInputChange}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Online Presence</h2>
                  <p className="text-muted-foreground">Links to your portfolio and social professional networks.</p>
                </div>
                
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input 
                        id="portfolio" 
                        name="portfolio"
                        placeholder="https://yourportfolio.com" 
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        className="pl-10 h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input 
                        id="linkedIn" 
                        name="linkedIn"
                        placeholder="https://linkedin.com/in/username" 
                        value={formData.linkedIn}
                        onChange={handleInputChange}
                        className="pl-10 h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub Profile</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input 
                        id="github" 
                        name="github"
                        placeholder="https://github.com/username" 
                        value={formData.github}
                        onChange={handleInputChange}
                        className="pl-10 h-12 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Portfolio Projects</h2>
                  <p className="text-muted-foreground">Showcase your best work with images and details.</p>
                </div>

                <div className="space-y-4">
                  {profile?.projects?.map((project) => (
                    <div key={project._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        {project.image && (
                          <div className="relative size-12 rounded-lg overflow-hidden border">
                            <Image src={project.image} alt={project.title} fill className="object-cover" />
                          </div>
                        )}

                        <div>
                          <p className="font-bold">{project.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{project.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => project._id && deleteProject(project._id)} className="text-destructive hover:bg-destructive/10">
                        <X className="size-4" />
                      </Button>

                    </div>
                  ))}

                  {isAddingProject ? (
                    <div className="p-6 bg-white dark:bg-slate-900 border-2 border-primary/20 border-dashed rounded-3xl space-y-4">
                      <div className="grid gap-4">
                        <Input placeholder="Project Title *" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="h-12 rounded-xl" />
                        <Textarea placeholder="Details about what you built..." value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="rounded-xl" />
                        <Input placeholder="Technologies (comma separated)" value={projectForm.technologies} onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })} className="h-12 rounded-xl" />
                        <Input placeholder="Project Link (Link to Demo/Repo)" value={projectForm.link} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })} className="h-12 rounded-xl" />
                        <div>
                          <Label className="text-xs mb-2 block">Project Preview Image</Label>
                          <Input type="file" accept="image/*" onChange={(e) => setProjectImage(e.target.files?.[0] || null)} className="h-12 rounded-xl py-2" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddProject} className="flex-1 rounded-xl">Save Project</Button>
                        <Button variant="ghost" onClick={() => setIsAddingProject(false)} className="rounded-xl">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setIsAddingProject(true)} className="w-full h-16 border-dashed border-2 hover:bg-primary/5 rounded-2xl flex items-center justify-center gap-2">
                       <Code2 className="size-5" /> Add New Project
                    </Button>
                  )}
                </div>
              </div>
            )}

            {currentStep === 4 && (

              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                 <div className="text-center space-y-4 py-6">
                    <div className="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="size-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">You&apos;re almost there!</h2>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                      Review your profile and submit. You can update these details anytime from settings.
                    </p>
                 </div>

                 <div className="grid gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="flex justify-between border-b pb-2 dark:border-slate-700">
                      <span className="font-medium">Headline</span>
                      <span>{formData.headline}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 dark:border-slate-700">
                      <span className="font-medium">Skills Count</span>
                      <span>{formData.skills.length} skills added</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Job Matching</span>
                      <Badge className="bg-green-500">Enabled</Badge>
                    </div>
                 </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between pt-10">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="h-12 px-6 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="mr-2 size-4" /> Back
              </Button>

              <div className="flex gap-3">
                 {currentStep < 4 ? (
                   <>
                    {(currentStep === 0 || currentStep === 2 || currentStep === 3) && (
                       <Button variant="ghost" onClick={nextStep} className="h-12 px-6 rounded-xl text-muted-foreground">
                         Skip for now
                       </Button>
                    )}
                    <Button onClick={nextStep} className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
                      Next Step <ArrowRight className="ml-2 size-4" />
                    </Button>
                   </>
                 ) : (
                   <Button onClick={handleSubmit} className="h-12 px-12 rounded-xl shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 text-lg font-bold">
                     Get Started <Sparkles className="ml-2 size-4" />
                   </Button>
                 )}
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

