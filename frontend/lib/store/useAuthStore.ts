import { create } from "zustand";
import { axiosInstance } from "../axios";

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatar?: string;
    phone?: string;
    companyId?: string;

}


interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    error: string | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    message: string | null;

    signup: (payload: Record<string, unknown>) => Promise<void>;
    login: (payload: Record<string, unknown>) => Promise<void>;
    logout: () => Promise<void>;
    verifyEmail: (payload: { email: string; code: string }) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (payload: { token: string; newPassword: string }) => Promise<void>;
    updateAvatar: (file: File) => Promise<void>;
    updateUser: (payload: Record<string, unknown>) => Promise<void>;


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

    signup: async (payload: Record<string, unknown>) => {

        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/users/register", payload);
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error signing up",
                isLoading: false,
            });
            throw error;
        }
    },


    login: async (payload: Record<string, unknown>) => {

        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/users/login", payload);
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error logging in",
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
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error verifying email",
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
        } catch {
            set({ isCheckingAuth: false, isAuthenticated: false, user: null });
        }

    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post("/users/logout");
            set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
            throw error;
        }
    },


    forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/users/forgot-password", { email });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error sending reset email",
                isLoading: false,
            });
            throw error;
        }
    },


    resetPassword: async ({ token, newPassword }: { token: string; newPassword: string }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post("/users/reset-password", { token, newPassword });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error resetting password",
                isLoading: false,
            });
            throw error;
        }
    },

    updateAvatar: async (file: File) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const response = await axiosInstance.put("/users/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            set((state) => ({
                user: state.user ? { ...state.user, avatar: response.data.avatar } : null,
                isLoading: false,
                message: response.data.message
            }));
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error updating avatar",
                isLoading: false,
            });
            throw error;
        }
    },

    updateUser: async (payload: Record<string, unknown>) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.put("/users/update", payload);
            set({
                user: response.data.user,
                isLoading: false,
                message: response.data.message
            });
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            set({
                error: err.response?.data?.message || "Error updating user info",
                isLoading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),

    clearMessage: () => set({ message: null }),
}));
