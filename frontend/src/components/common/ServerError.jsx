import React from "react";
import { Link } from "react-router-dom";

const ServerError = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">
        {error?.status || "500"}
      </h1>

      <h2 className="text-2xl font-semibold mb-2">
        {error?.status === 500 ? "Server Error" : "Connection Issue"}
      </h2>

      <p className="text-lg text-gray-600 mb-4 max-w-md">
        {error?.status === 500
          ? "Our servers are experiencing issues. Please try again shortly."
          : "Unable to connect to the server. Please check your internet connection."}
      </p>

      {error?.url && (
        <p className="text-sm text-gray-500 mb-4">
          Failed to load: {error.url}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Try Again
        </button>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Reload Page
        </button>

        <Link
          to="/"
          className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition text-center"
        >
          Go Home
        </Link>
      </div>

      {/* Optional: Show details in development */}
      {process.env.NODE_ENV === "development" && error && (
        <details className="mt-6 text-left max-w-md">
          <summary className="cursor-pointer text-sm text-gray-500">
            Error Details (Development)
          </summary>
          <pre className="bg-gray-200 p-3 rounded mt-2 text-xs overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ServerError;
