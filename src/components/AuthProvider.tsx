"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { supabase } from "@/lib/supabase/client";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser, setUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initial fetch
    fetchUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setUser(user);
        
        if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && user)) {
          // 🕒 Small delay to ensure stores are synced
          setTimeout(() => {
            if (user?.id) useWishlistStore.getState().fetchWishlist(user.id);
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          useWishlistStore.getState().clearWishlist();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUser, setUser]);

  // Hydration safety: ensure client-side only rendering of children if needed
  // However, usually we want to render children immediately to avoid page flicker
  // But if components depend on auth state, they should handle the "loading" state themselves.
  
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
