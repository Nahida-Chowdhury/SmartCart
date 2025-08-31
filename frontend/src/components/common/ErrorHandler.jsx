import React, { useState, useEffect } from "react";
import NotFound from "./NotFound";
import ServerError from "./ServerError";

const ErrorHandler = ({ children }) => {
  const [error, setError] = useState(null);

  // Handle fetch errors globally
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          // Handle different HTTP error statuses
          const errorData = {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
          };

          // Store error for global handling
          setError(errorData);

          // You can also throw to be caught by local catch blocks
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (err) {
        setError({
          status: 0, // Network error
          statusText: err.message,
          url: args[0],
        });
        throw err;
      }
    };

    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Reset error
  const resetError = () => {
    setError(null);
  };

  // Render appropriate error page based on status code
  if (error) {
    switch (error.status) {
      case 404:
        return <NotFound />;
      case 500:
      case 502:
      case 503:
        return <ServerError error={error} onRetry={resetError} />;
      case 401:
      case 403:
        // Redirect to login or show auth error
        return (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl mb-4">Authentication Required</h1>
            <p className="mb-4">Please login to access this page.</p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Go to Login
            </button>
          </div>
        );
      default:
        return <ServerError error={error} onRetry={resetError} />;
    }
  }

  return children;
};

// Higher Order Component for component-level error handling
export const withErrorHandling = (WrappedComponent) => {
  return (props) => (
    <ErrorHandler>
      <WrappedComponent {...props} />
    </ErrorHandler>
  );
};

export default ErrorHandler;
