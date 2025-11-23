// Error Handler Component
// Catches errors in child components and shows a friendly error message
// Note: React requires class components for error boundaries, so we use a wrapper pattern

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Props interface - what this component expects
interface ErrorHandlerProps {
    children: ReactNode; // The components to wrap
    fallback?: ReactNode; // Optional custom error UI
}

// State interface - what state this component manages
interface ErrorHandlerState {
    hasError: boolean; // Did an error occur?
    error: Error | null; // The error object
    errorInfo: ErrorInfo | null; // Additional error information
}

// Class component for error boundary (React requires this)
// This catches errors that happen in child components
class ErrorBoundary extends Component<ErrorHandlerProps, ErrorHandlerState> {
    constructor(props: ErrorHandlerProps) {
        super(props);
        // Set initial state - no errors yet
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    // This method is called when an error occurs in a child component
    static getDerivedStateFromError(error: Error): ErrorHandlerState {
        // Update state to show error
        return {
            hasError: true,
            error: error,
            errorInfo: null,
        };
    }

    // This method is called after an error occurs
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console for debugging
        console.error('Error caught by boundary:', error, errorInfo);

        // Show error message to user
        toast.error(`An error occurred: ${error.message}`);

        // Save error info to state
        this.setState({
            errorInfo: errorInfo,
        });
    }

    // Function to reset error state and try again
    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    // Render method - decides what to show
    render() {
        // If there's an error, show error UI
        if (this.state.hasError) {
            // If custom fallback UI provided, use it
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Otherwise, show default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                    <Card className="max-w-2xl w-full p-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                                Something went wrong
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {this.state.error?.message || 'An unexpected error occurred'}
                            </p>

                            {/* Show error details if available */}
                            {this.state.errorInfo && (
                                <details className="mb-6 text-left">
                                    <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Error Details
                                    </summary>
                                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-xs overflow-auto max-h-60">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}

                            {/* Action buttons */}
                            <div className="flex gap-4 justify-center">
                                <Button onClick={this.handleReset} variant="default">
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

        // If no error, render children normally
        return this.props.children;
    }
}

// Functional component wrapper (beginner-friendly interface)
// This is what you import and use in your app
const ErrorHandler: React.FC<ErrorHandlerProps> = ({ children, fallback }) => {
    return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
};

export default ErrorHandler;
