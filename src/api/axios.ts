// Axios Configuration
// This file sets up axios (HTTP client) with interceptors for error handling

import axios, { AxiosError, AxiosInstance } from 'axios';
import { toast } from 'react-toastify';
import { ApiError } from '@/types';

// The base URL for all API calls
const BASE_URL = 'https://mixo-fe-backend-task.vercel.app';

// Create an axios instance with default settings
const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL, // All requests will start with this URL
    timeout: 30000, // Request will timeout after 30 seconds
    headers: {
        'Content-Type': 'application/json', // Tell server we're sending JSON
    },
});

// Request Interceptor
// This runs BEFORE every API request
axiosInstance.interceptors.request.use(
    (config) => {
        // Add authentication token if user is logged in
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // Continue with the request
    },
    (error: AxiosError) => {
        // If request setup fails, reject it
        return Promise.reject(error);
    }
);

// Response Interceptor
// This runs AFTER every API response
axiosInstance.interceptors.response.use(
    (response) => {
        // If successful, just return the response
        return response;
    },
    (error: AxiosError<ApiError>) => {
        // If there's an error, handle it here

        // Get error message from response or use default
        const errorMessage =
            error.response?.data?.message || error.message || 'An unexpected error occurred';
        const statusCode = error.response?.status;

        // Don't show error for cancelled requests
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        // Show different error messages based on status code
        if (statusCode === 400) {
            toast.error(`Bad Request: ${errorMessage}`);
        } else if (statusCode === 401) {
            toast.error('Unauthorized: Please login again');
        } else if (statusCode === 403) {
            toast.error('Forbidden: You do not have permission');
        } else if (statusCode === 404) {
            toast.error('Not Found: Resource not available');
        } else if (statusCode === 500) {
            toast.error('Server Error: Please try again later');
        } else if (statusCode === 503) {
            toast.error('Service Unavailable: Server is temporarily unavailable');
        } else {
            // Handle network errors
            if (error.code === 'ECONNABORTED') {
                toast.error('Request timeout: Please check your connection');
            } else if (error.code === 'ERR_NETWORK') {
                toast.error('Network Error: Please check your internet connection');
            } else {
                toast.error(errorMessage);
            }
        }

        // Reject the promise so components can handle it
        return Promise.reject(error);
    }
);

// Export the configured axios instance
export default axiosInstance;
