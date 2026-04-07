import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again or head back home.",
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] border border-red-100 dark:border-red-900/30 shadow-xl shadow-red-100/20 dark:shadow-black/20",
        className
      )}
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
        <div className="relative w-24 h-24 bg-linear-to-br from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
      </div>

      <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
        {message}
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-gray-900/10 active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        )}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-100/50 active:scale-95"
        >
          <Home className="w-5 h-5" />
          Go Home
        </Link>
      </div>
    </motion.div>
  );
}
