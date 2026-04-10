"use client";

import { useEffect, useState, ReactNode, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Sparkles, Heart } from "lucide-react";
import { Logger } from "@/lib/logger";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { initializeAuth, user, loading, initialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [storesHydrated, setStoresHydrated] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);

  const lastSyncedUserId = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const rehydrateStores = async () => {
      try {
        await Promise.all([
          useCartStore.persist.rehydrate(),
          useWishlistStore.persist.rehydrate(),
        ]);
        setStoresHydrated(true);
      } catch (err) {
        Logger.error("Failed to rehydrate stores", err);
        setStoresHydrated(true);
      }
    };

    rehydrateStores();
    initializeAuth();

    // 🕒 Timeout to prevent permanent hang
    const timer = setTimeout(() => {
      setShowTimeout(true);
      // Log diagnostic info to help debug production issues
      Logger.warn("Auth initialization is taking longer than expected", {
        module: "auth-provider",
        mounted,
        storesHydrated,
        loading,
        initialized,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      });
    }, 10000);

    return () => clearTimeout(timer);
  }, [initializeAuth]);

  // 🔄 Coordination Effect: Handles side effects when user state changes
  useEffect(() => {
    if (!initialized || !storesHydrated) return;

    const syncStores = async () => {
      if (user?.id) {
        // ✅ Login or Session Restore detected
        if (lastSyncedUserId.current === user.id) return;
        
        const isNewUser = lastSyncedUserId.current === null;
        lastSyncedUserId.current = user.id;

        Logger.info(`Syncing stores for user: ${user.id}`, { module: "auth", isMergingGuest: isNewUser });
        
        // Parallel sync with idempotency
        await Promise.allSettled([
          useCartStore.getState().syncWithDatabase(user.id, isNewUser),
          useWishlistStore.getState().syncWithDatabase(user.id, isNewUser),
        ]);
      } else {
        // ✅ Logout detected
        if (lastSyncedUserId.current === null) return;
        
        Logger.info("User signed out, clearing sensitive stores", { module: "auth" });
        lastSyncedUserId.current = null;
        
        useCartStore.getState().clearCart(false);
        useWishlistStore.getState().clearWishlist();
      }
    };

    syncStores();
  }, [user?.id, initialized, storesHydrated]);


  if (!mounted || !storesHydrated || (loading && !initialized)) {
    return (
      <GlobalAuthLoader 
        isStuck={showTimeout} 
        onBypass={() => setStoresHydrated(true)} 
        diagnostics={{ mounted, storesHydrated, loading, initialized }}
      />
    );
  }

  return <>{children}</>;
}

function GlobalAuthLoader({ 
  isStuck, 
  onBypass,
  diagnostics 
}: { 
  isStuck?: boolean; 
  onBypass?: () => void;
  diagnostics?: any;
}) {
  const isEnvMissing = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-500">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />

      <div className="relative z-10 flex flex-col items-center max-w-md px-4 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-linear-to-tr from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
          <div className="relative w-20 h-20 bg-linear-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
        </div>

        <h2 className="text-xl font-display font-bold text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2">
          Initializing Your Experience
        </h2>

        {!isStuck ? (
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Setting up secure sync...</span>
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 animate-fade-in">
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-4 leading-relaxed">
              {isEnvMissing 
                ? "Configuration issue detected: Missing environment variables on deployment."
                : "The connection is taking longer than usual. This might be due to a slow network."}
            </p>
            <button
              onClick={onBypass}
              className="px-6 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Enter Anyway
            </button>
            <p className="mt-3 text-[10px] text-gray-400 dark:text-gray-500 font-mono">
              Status: M{+diagnostics?.mounted} H{+diagnostics?.storesHydrated} L{+diagnostics?.loading} I{+diagnostics?.initialized}
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-12 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
        <Heart className="w-3 h-3 text-rose-400" />
        <span>Crafting something beautiful</span>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
