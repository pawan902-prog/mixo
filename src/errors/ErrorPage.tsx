import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home } from 'lucide-react';

const ErrorPage: React.FC = () => {
    const error = useRouteError();

    let errorMessage = 'An unexpected error occurred';
    let errorStatus = 500;

    if (isRouteErrorResponse(error)) {
        errorMessage = error.statusText || error.data?.message || errorMessage;
        errorStatus = error.status;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="max-w-lg w-full p-8 text-center">
                <div className="mb-6">
                    <div className="text-6xl font-bold text-red-500 dark:text-red-400 mb-2">
                        {errorStatus}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Oops! Something went wrong
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {errorMessage}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                    >
                        Reload Page
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ErrorPage;

