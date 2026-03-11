import { create } from "zustand";
import { axiosInstance } from "../axios";

export interface Education {
    _id?: string;
    institution: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
    current: boolean;
}

export interface Experience {
    _id?: string;
    company: string;
    title: string;
    description?: string;
    startDate: Date | string;
    endDate?: Date | string;
    current: boolean;
}

export interface Project {
    _id?: string;
    title: string;
    description?: string;
    link?: string;
    image?: string;
    technologies: string[];
}


export interface CandidateProfile {
    _id: string;
    userId: string;
    phone: string;
    headline: string;
    bio: string;
    cvUrl: string;
    skills: string[];
    experienceYears: number;
    location: string;
    linkedIn: string;
    github: string;
    portfolio: string;
    isOpenToWork: boolean;
    salaryExpected: string;
    education: Education[];
    experience: Experience[];
    projects: Project[];
    createdAt: string;
    updatedAt: string;
}


interface ProfileState {
    profile: CandidateProfile | null;
    isLoading: boolean;
    error: string | null;
    message: string | null;

    getProfile: () => Promise<void>;
    upsertProfile: (payload: Record<string, unknown>) => Promise<void>;

    addEducation: (payload: Education) => Promise<void>;
    updateEducation: (id: string, payload: Partial<Education>) => Promise<void>;
    deleteEducation: (id: string) => Promise<void>;

    addExperience: (payload: Experience) => Promise<void>;
    updateExperience: (id: string, payload: Partial<Experience>) => Promise<void>;
    deleteExperience: (id: string) => Promise<void>;
    
    uploadResume: (file: File) => Promise<void>;
    addProject: (formData: FormData) => Promise<void>;
    updateProject: (id: string, formData: FormData) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;


    clearError: () => void;
}


export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    isLoading: false,
    error: null,
    message: null,

    getProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/candidates/profile");
            set({ profile: response.data.data, isLoading: false });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            // Don't set error if profile just doesn't exist yet (404)

            if (err.response?.status === 404) {
                set({ profile: null, isLoading: false });
            } else {
                set({
                    error: err.response?.data?.message || "Error fetching profile",
                    isLoading: false,
                });
            }
        }
    },

    upsertProfile: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/candidates/profile", payload);
            set({
                profile: response.data.data,
                message: response.data.message,
                isLoading: false
            });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error updating profile",

                isLoading: false,
            });
            throw error;
        }
    },

    addEducation: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post("/candidates/education", payload);
            // Refresh profile after update
            const response = await axiosInstance.get("/candidates/profile");
            set({ profile: response.data.data, isLoading: false });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error adding education",

                isLoading: false,
            });
            throw error;
        }
    },

    updateEducation: async (id, payload) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.put(`/candidates/education/${id}`, payload);
            const response = await axiosInstance.get("/candidates/profile");
            set({ profile: response.data.data, isLoading: false });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error updating education",
                isLoading: false,
            });
            throw error;
        }
    },

    deleteEducation: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/candidates/education/${id}`);
            const response = await axiosInstance.get("/candidates/profile");
            set({ profile: response.data.data, isLoading: false });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error deleting education",
                isLoading: false,
            });
            throw error;
        }
    },

    addExperience: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post("/candidates/experience", payload);
            // Refresh profile after update
            const response = await axiosInstance.get("/candidates/profile");
            set({ profile: response.data.data, isLoading: false });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error adding experience",

                isLoading: false,
            });
            throw error;
        }
    },

    updateExperience: async (id, payload) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.put(`/candidates/experience/${id}`, payload);
            const response = await axiosInstance.get("/candidates/profile");
            set({ profile: response.data.data, isLoading: false });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error updating experience",
                isLoading: false,
            });
            throw error;
        }
    },

    deleteExperience: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/candidates/experience/${id}`);
            const response = await axiosInstance.get("/candidates/profile");
            set({ profile: response.data.data, isLoading: false });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error deleting experience",
                isLoading: false,
            });
            throw error;
        }
    },


    uploadResume: async (file: File) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append("resume", file);
            await axiosInstance.post("/candidates/resume/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const response = await axiosInstance.get("/candidates/profile");
            set({ profile: response.data.data, isLoading: false });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error uploading resume",

                isLoading: false,
            });
            throw error;
        }
    },

    addProject: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post("/candidates/project", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const response = await axiosInstance.get("/candidates/profile");
            set({ profile: response.data.data, isLoading: false });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error adding project",

                isLoading: false,
            });
            throw error;
        }
    },

    updateProject: async (id, formData) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.put(`/candidates/project/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const response = await axiosInstance.get("/candidates/profile");
            set({ profile: response.data.data, isLoading: false });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error updating project",

                isLoading: false,
            });
            throw error;
        }
    },

    deleteProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.delete(`/candidates/project/${id}`);
            const response = await axiosInstance.get("/candidates/profile");
            set({ profile: response.data.data, isLoading: false });
        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error deleting project",

                isLoading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

}));
