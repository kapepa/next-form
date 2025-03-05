import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Set your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors if needed (e.g., for authentication)
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify request config (e.g., add auth token)
    const token = localStorage.getItem("token"); // Example: Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default axiosInstance;