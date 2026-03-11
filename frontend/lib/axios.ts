import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Response interceptor to handle global errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optional: Clear local storage or state if necessary
            // window.location.href = '/login'; 
            // Note: We'll handle state clearing in the store or via a specialized event
        }
        return Promise.reject(error);
    }
);
