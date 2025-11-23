import { AxiosError } from 'axios';
import { ApiError } from '@/types';

/**
 * Extract error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError;
        return apiError?.message || error.message || 'An unexpected error occurred';
    }

    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    return 'An unexpected error occurred';
};

/**
 * Extract error status code
 */
export const getErrorStatus = (error: unknown): number | undefined => {
    if (error instanceof AxiosError) {
        return error.response?.status;
    }
    return undefined;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
    if (error instanceof AxiosError) {
        return error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
    }
    return false;
};

/**
 * Check if error is a timeout error
 */
export const isTimeoutError = (error: unknown): boolean => {
    if (error instanceof AxiosError) {
        return error.code === 'ECONNABORTED';
    }
    return false;
};

