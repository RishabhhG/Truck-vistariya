import { HOST } from "../utils/constant";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: HOST,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if it exists
    const token = localStorage.getItem("token"); // Assuming you're storing token in local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      console.error("API error:", error.response.data);
      // You can handle different status codes here
      if (error.response.status === 401) {
        // Handle unauthorized access, e.g., redirect to login
      }
    } else {
      console.error("Network error:", error);
    }
    return Promise.reject(error);
  }
);
