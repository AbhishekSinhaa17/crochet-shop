"use client";

import { useEffect } from "react";
import { Logger } from "@/lib/logger";

/**
 * Next.js root error.tsx — handles route-level errors
 * with a user-friendly recovery UI.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Logger.error("Unhandled route error", error, {
      module: "error.tsx",
      action: "route_error",
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          <svg
            className="w-10 h-10 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          We encountered an unexpected error loading this page.
          Your data is safe — please try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
