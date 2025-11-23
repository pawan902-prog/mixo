// Error Handler Component
// Catches errors in child components and shows a friendly error message
// Uses react-error-boundary library for functional component approach

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Props interface - what this component expects
interface ErrorHandlerProps {
    children: React.ReactNode; // The components to wrap
    fallback?: React.ReactNode; // Optional custom error UI
}

// Error fallback component - shows when error occurs
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
    // Show error message to user
    React.useEffect(() => {
        toast.error(`An error occurred: ${error.message}`);
    }, [error.message]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="max-w-2xl w-full p-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                        Something went wrong
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error.message || 'An unexpected error occurred'}
                    </p>

                    {/* Action buttons */}
                    <div className="flex gap-4 justify-center">
                        <Button onClick={resetErrorBoundary} variant="default">
                            Try Again
                        </Button>
                        <Button onClick={() => window.location.reload()} variant="outline">
                            Reload Page
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

// Main Error Handler Component (Functional Component)
// This is what you import and use in your app
const ErrorHandler: React.FC<ErrorHandlerProps> = ({ children, fallback }) => {
    // Function to log errors (optional - for error tracking services)
    const logError = (error: Error, errorInfo: { componentStack: string }) => {
        // Log error to console for debugging
        console.error('Error caught by boundary:', error, errorInfo);

        // Here you can send errors to error tracking service
        // Example: logErrorToService(error, errorInfo);
    };

    // If custom fallback provided, use it
    if (fallback) {
        return (
            <ErrorBoundary
                FallbackComponent={({ error, resetErrorBoundary }) => (
                    <>{fallback}</>
                )}
                onError={logError}
            >
                {children}
            </ErrorBoundary>
        );
    }

    // Otherwise use default error UI
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
            {children}
        </ErrorBoundary>
    );
};

export default ErrorHandler;
