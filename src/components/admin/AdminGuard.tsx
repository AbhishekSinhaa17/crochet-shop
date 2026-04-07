"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

interface AdminGuardProps {
  children: ReactNode;
}

/**
 * 🛡️ AdminGuard (Client-Side Protection)
 * Ensures only authenticated admins can view the wrapped content.
 * Acts as a secondary layer to Middleware (Edge Protection).
 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, role, loading, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // 🧠 Wait for the store to initialize before making decisions
    if (!loading && initialized) {
      if (!user || role !== "admin") {
        console.warn("[AdminGuard] Access denied. Redirecting...");
        router.push("/");
      }
    }
  }, [user, role, loading, initialized, router]);

  // 1. Show Branded Loader while checking auth
  if (loading || !initialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Verifying Admin Access...</p>
      </div>
    );
  }

  // 2. Fallback UI if somehow the effect hasn't redirected yet
  if (!user || role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            You do not have the required permissions to view this page. Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

  // 3. Render Admin Content
  return <>{children}</>;
}
