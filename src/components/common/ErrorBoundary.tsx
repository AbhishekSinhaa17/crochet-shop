"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary — catches React rendering errors
 * and displays a user-friendly fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Logger.error("React ErrorBoundary caught an error", error, {
      module: "ErrorBoundary",
      action: "componentDidCatch",
      componentStack: errorInfo.componentStack as unknown as string,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 bg-linear-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-rose-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>

            {/* Description */}
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              We hit an unexpected issue. Don&apos;t worry — your data is safe.
              Please try refreshing or go back to the home page.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-linear-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
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

            {/* Error detail in dev */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-8 text-left bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <summary className="text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer">
                  Error details (dev only)
                </summary>
                <pre className="mt-2 text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap overflow-auto max-h-48">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
