import { create } from "zustand";
import { axiosInstance } from "../axios";

interface Company {
    _id: string;
    name: string;
    slug: string;
    industry: string;
    logo?: string;
    description: string;
    website: string;
    location: string;
    socialLinks: string[];
    owner: string | any;
    size: "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1001-5000" | "5001-10000" | "10001+";
    status: "active" | "inactive";
    createdAt: string;
    updatedAt: string;
}

interface CompanyState {
    company: Company | null;
    isLoading: boolean;
    error: string | null;
    message: string | null;

    registerCompany: (payload: any) => Promise<void>;
    getMyCompany: (id: string) => Promise<void>;
    updateCompany: (id: string, payload: any) => Promise<void>;
    clearError: () => void;
    clearMessage: () => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
    company: null,
    isLoading: false,
    error: null,
    message: null,

    registerCompany: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/companies/register", payload);
            set({
                company: response.data.company,
                message: response.data.message,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Error registering company",
                isLoading: false,
            });
            throw error;
        }
    },

    getMyCompany: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/companies/${id}`);
            set({ company: response.data.company, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Error fetching company",
                isLoading: false,
            });
        }
    },

    updateCompany: async (id, payload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put(`/companies/update/${id}`, payload);
            set({
                company: response.data.company,
                message: response.data.message,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Error updating company",
                isLoading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
    clearMessage: () => set({ message: null }),
}));
