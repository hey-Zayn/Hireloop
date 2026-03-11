"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Building2,
  Globe,
  MapPin,
  Users,
  Info,
  Plus,
  X,
} from "lucide-react";
import { useCompanyStore, type Company } from "@/lib/store/useCompanyStore";
import { toast } from "sonner";

interface CompanyFormProps {
  initialData?: Company | null;
  isEditing?: boolean;
  onSuccess?: () => void;
}



const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001-10000",
  "10001+",
];

export default function CompanyForm({
  initialData,
  isEditing = false,
  onSuccess,
}: CompanyFormProps) {
  const { registerCompany, updateCompany, isLoading } = useCompanyStore();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    industry: initialData?.industry || "",
    description: initialData?.description || "",
    website: initialData?.website || "",
    location: initialData?.location || "",
    size: initialData?.size || "11-50",
    socialLinks: initialData?.socialLinks || [""],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, size: value as Company["size"] }));
  };


  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index] = value;
    setFormData((prev) => ({ ...prev, socialLinks: newLinks }));
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, ""],
    }));
  };

  const removeSocialLink = (index: number) => {
    const newLinks = formData.socialLinks.filter((_: string, i: number) => i !== index);
    setFormData((prev) => ({ ...prev, socialLinks: newLinks }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        socialLinks: formData.socialLinks.filter((link: string) => link.trim() !== ""),
      };


      if (isEditing && initialData?._id) {
        await updateCompany(initialData._id, payload);
        toast.success("Company updated successfully!");
      } else {
        await registerCompany(payload);
        toast.success("Company registered successfully!");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };


  return (
    <Card className="border-primary/10 shadow-lg bg-white/50 backdrop-blur-sm dark:bg-gray-950/50">
      <CardHeader>
        <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 transition-transform hover:scale-110">
          <Building2 className="size-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">
          {isEditing ? "Update Company Details" : "Register Your Company"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Manage your company profile to attract the best talent."
            : "Tell us about your company to start posting jobs and hiring."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" /> Company
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. TechFlow Solutions"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-primary/5 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry" className="flex items-center gap-2">
                <Info className="size-4 text-muted-foreground" /> Industry
              </Label>
              <Input
                id="industry"
                name="industry"
                placeholder="e.g. Software Development"
                value={formData.industry}
                onChange={handleChange}
                required
                className="bg-primary/5 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="size-4 text-muted-foreground" /> Website URL
              </Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
                required
                className="bg-primary/5 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" /> Location
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
                required
                className="bg-primary/5 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size" className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" /> Company Size
              </Label>
              <Select
                onValueChange={handleSizeChange}
                defaultValue={formData.size}
              >
                <SelectTrigger className="bg-primary/5 border-none focus:ring-1 focus:ring-primary/30 h-10">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What does your company do? What's your mission?"
              value={formData.description}
              onChange={handleChange}
              required
              className="bg-primary/5 border-none focus-visible:ring-1 focus-visible:ring-primary/30 min-h-[120px]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Social Links (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialLink}
                className="h-8 gap-1 hover:bg-primary/5 rounded-lg"
              >
                <Plus className="size-3" /> Add Link
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.socialLinks.map((link: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="https://linkedin.com/company/..."
                    value={link}
                    onChange={(e) =>
                      handleSocialLinkChange(index, e.target.value)
                    }
                    className="bg-primary/5 border-none focus-visible:ring-1 focus-visible:ring-primary/30 h-9"
                  />

                  {formData.socialLinks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      className="size-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Register Company"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
