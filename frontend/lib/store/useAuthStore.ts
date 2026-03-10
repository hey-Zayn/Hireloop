import { create } from "zustand";
import { axiosInstance } from "../axios";

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    error: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    message: string | null;

    signup: (payload: any) => Promise<void>;
    login: (payload: any) => Promise<void>;
    logout: () => Promise<void>;
    verifyEmail: (payload: { email: string; code: string }) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (payload: { token: string; newPassword: string }) => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
    clearMessage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/users/register", payload);
            set({ message: response.data.message, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Error signing up",
                isLoading: false,
            });
            throw error;
        }
    },

    login: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/users/login", payload);
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Error logging in",
                isLoading: false,
            });
            throw error;
        }
    },

    verifyEmail: async ({ email, code }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/users/verify-email", { email, code });
            set({ message: response.data.message, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Error verifying email",
                isLoading: false,
            });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axiosInstance.get("/users/profile");
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ isCheckingAuth: false, isAuthenticated: false, user: null });
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post("/users/logout");
            set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        } catch (error: any) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/users/forgot-password", { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Error sending reset email",
                isLoading: false,
            });
            throw error;
        }
    },

    resetPassword: async ({ token, newPassword }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/users/reset-password", { token, newPassword });
            set({ message: response.data.message, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || "Error resetting password",
                isLoading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
    clearMessage: () => set({ message: null }),
}));
