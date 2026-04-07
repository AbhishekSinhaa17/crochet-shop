import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { Profile } from "@/types";

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  isAdmin: boolean;
  role: "admin" | "user" | null;
  setUser: (user: any | null) => Promise<void>;
  fetchUser: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// 🔒 Internal lock to prevent concurrent initialization calls
let initializationPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  role: null,
  loading: true, // Start in loading state
  initialized: false,
  isAdmin: false,

  setUser: async (user) => {
    // Only update if user ID changed or we're not initialized yet
    if (user?.id === get().user?.id && get().initialized) {
      set({ loading: false });
      return;
    }

    set({ user, loading: !!user, initialized: true });
    
    if (user) {
      await get().fetchProfile(user.id);
    } else {
      set({ profile: null, role: null, isAdmin: false, loading: false });
    }
  },

  fetchProfile: async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && profile) {
        const isAdmin = profile.role === "admin";
        set({ 
          profile, 
          role: profile.role,
          isAdmin,
          loading: false 
        });
      } else {
        set({ loading: false, profile: null, role: null, isAdmin: false });
      }
    } catch (err) {
      console.error("AuthStore: Error fetching profile", err);
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    // 🛡️ Concurrency Lock: If already fetching, return the existing promise
    if (initializationPromise) {
      return initializationPromise;
    }

    // If already initialized with a user, no need to fetch again
    if (get().initialized && get().user) {
      return Promise.resolve();
    }

    initializationPromise = (async () => {
      set({ loading: true });

      try {
        // 1. Try getSession first (faster, often cached in memory/cookie)
        const { data: { session } } = await supabase.auth.getSession();
        
        let user = session?.user ?? null;

        // 2. Fallback to getUser for security if session looks stale or missing
        if (!user) {
          const { data: { user: fetchedUser } } = await supabase.auth.getUser();
          user = fetchedUser;
        }

        await get().setUser(user);
      } catch (error) {
        console.error("AuthStore: Error fetching user", error);
        set({ user: null, profile: null, isAdmin: false, loading: false, initialized: true });
      } finally {
        initializationPromise = null;
      }
    })();

    return initializationPromise;
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      // State is cleared by the onAuthStateChange listener in AuthProvider,
      // but we do it here too for instant UI feedback.
      set({ 
        user: null, 
        profile: null, 
        role: null,
        isAdmin: false, 
        loading: false,
        initialized: true 
      });
    } catch (error) {
      console.error("AuthStore: Error signing out", error);
    }
  },
}));
