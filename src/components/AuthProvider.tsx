"use client";

import { useEffect, useState, ReactNode, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Sparkles, Heart } from "lucide-react";
import { Logger } from "@/lib/logger";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { fetchUser, setUser, loading, initialized } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [storesHydrated, setStoresHydrated] = useState(false);
  
  // ⏱️ Focus Refetch Throttling (2 minutes)
  const lastFocusRefetch = useRef<number>(0);
  const REFETCH_THROTTLE_MS = 2 * 60 * 1000;

  useEffect(() => {
    setMounted(true);
    
    // 🛡️ Manual Rehydration for SSR Safety (skipHydration: true)
    const rehydrateStores = async () => {
      try {
        await Promise.all([
          useCartStore.persist.rehydrate(),
          useWishlistStore.persist.rehydrate()
        ]);
        setStoresHydrated(true);
      } catch (err) {
        Logger.error("Failed to rehydrate stores", err);
        setStoresHydrated(true); // Proceed anyway to avoid permanent loader
      }
    };
    
    rehydrateStores();
    fetchUser();

    // 🔄 Global Auth State Synchronization
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        Logger.info(`Auth event: ${event}`, { module: "auth", userId: user?.id });

        // Update central auth state
        await setUser(user);
        
        switch (event) {
          case 'SIGNED_IN':
          case 'USER_UPDATED':
            if (user?.id) {
              // 🔄 Sync features from DB and merge with current local state
              void useCartStore.getState().syncWithDatabase(user.id);
              void useWishlistStore.getState().syncWithDatabase(user.id);
            }
            break;
            
          case 'SIGNED_OUT':
            // 🧹 Clear user-specific state while keeping structure for guest
            useCartStore.getState().clearCart(false);
            useWishlistStore.getState().clearWishlist();
            break;
        }
      }
    );

    // 🌐 Multi-Tab Synchronization (Throttled)
    const handleFocus = () => {
      const now = Date.now();
      const currentUser = useAuthStore.getState().user;
      
      if (
        currentUser?.id && 
        now - lastFocusRefetch.current > REFETCH_THROTTLE_MS
      ) {
        lastFocusRefetch.current = now;
        Logger.debug("Refetching data on window focus", { module: "sync" });
        void useCartStore.getState().syncWithDatabase(currentUser.id);
        void useWishlistStore.getState().syncWithDatabase(currentUser.id);
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchUser, setUser]);

  // 🛡️ Global Loader: Prevent UI flickers & hydration mismatches
  // Show loader while initial auth is being determined OR stores are hydrating
  if (!mounted || !storesHydrated || (loading && !initialized)) {
    return <GlobalAuthLoader />;
  }

  return <>{children}</>;
}

/**
 * 🎨 Production-Grade Global Loader
 * Prevents "Login flicker" by showing a premium branded state
 */
function GlobalAuthLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-500">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-linear-to-tr from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
          <div className="relative w-20 h-20 bg-linear-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
        </div>

        <h2 className="text-xl font-display font-bold text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2">
          Initializing Your Experience
        </h2>
        
        <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Setting up secure sync...</span>
        </div>
      </div>

      <div className="absolute bottom-12 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
        <Heart className="w-3 h-3 text-rose-400" />
        <span>Crafting something beautiful</span>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
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
