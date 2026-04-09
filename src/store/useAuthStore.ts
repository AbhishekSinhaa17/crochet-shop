import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { Profile } from "@/types";
import { Logger } from "@/lib/logger";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  isAdmin: boolean;
  role: "admin" | "user" | null;
  setUser: (user: User | null) => Promise<void>;
  initializeAuth: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// 🔒 Module-level variables to ensure singleton behavior
let initializationPromise: Promise<void> | null = null;
let isListenerAttached = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  role: null,
  loading: true, // Start in loading state
  initialized: false,
  isAdmin: false,

  setUser: async (user) => {
    // Prevent redundant profile fetches if user ID is the same
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
          loading: false,
        });
      } else {
        set({ loading: false, profile: null, role: null, isAdmin: false });
      }
    } catch (err) {
      Logger.storeError("auth", "fetchProfile", err);
      set({ loading: false });
    }
  },

  initializeAuth: async () => {
    // 1. If already initializing, return the existing promise
    if (initializationPromise) return initializationPromise;

    // 2. If already initialized, we're done
    if (get().initialized && get().user) return Promise.resolve();

    initializationPromise = (async () => {
      set({ loading: true });

      try {
        // 🔒 Attached listener ONLY ONCE
        if (!isListenerAttached) {
          supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            const user = session?.user ?? null;
            Logger.info(`Auth transition: ${event}`, { module: "auth", userId: user?.id });
            
            if (event === "SIGNED_OUT") {
              set({ user: null, profile: null, role: null, isAdmin: false, loading: false, initialized: true });
            } else if (user) {
              await get().setUser(user);
            } else {
              set({ loading: false, initialized: true });
            }
          });
          isListenerAttached = true;
        }

        // 🚀 Call getUser() ONLY ONCE to get initial state
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          set({ user: null, profile: null, isAdmin: false, loading: false, initialized: true });
          return;
        }

        await get().setUser(user);
      } catch (error) {
        Logger.storeError("auth", "initializeAuth", error);
        set({ user: null, loading: false, initialized: true });
      } finally {
        initializationPromise = null;
      }
    })();

    return initializationPromise;
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await supabase.auth.signOut();
      set({
        user: null,
        profile: null,
        role: null,
        isAdmin: false,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      Logger.storeError("auth", "signOut", error);
      set({ loading: false });
    }
  },
}));

