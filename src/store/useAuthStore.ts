import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { Logger } from "@/lib/logger";
import { useCartStore } from "./cartStore";
import { useWishlistStore } from "./wishlistStore";

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
    if (user?.id === get().user?.id && get().initialized) {
      set({ loading: false });
      return;
    }

    set({ user, loading: !!user, initialized: true });

    if (user) {
      await get().fetchProfile(user.id);
    } else {
      set({ profile: null, role: null, isAdmin: false, loading: false });
      useCartStore.getState().clearCart(false);
      useWishlistStore.getState().clearWishlist();
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

  fetchUser: async () => {
    if (initializationPromise) {
      return initializationPromise;
    }

    if (get().initialized && get().user) {
      return Promise.resolve();
    }

    initializationPromise = (async () => {
      set({ loading: true });

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          Logger.warn("Session error, clearing auth", {
            module: "auth",
            error: sessionError.message,
          });
          await supabase.auth.signOut({ scope: "local" });
          set({
            user: null,
            profile: null,
            isAdmin: false,
            loading: false,
            initialized: true,
          });
          return;
        }

        let user = session?.user ?? null;

        if (!user) {
          const {
            data: { user: fetchedUser },
            error: userError,
          } = await supabase.auth.getUser();

          if (
            userError?.message?.includes("Refresh Token Not Found") ||
            userError?.message?.includes("Invalid Refresh Token")
          ) {
            Logger.warn("Invalid refresh token, clearing session", {
              module: "auth",
            });
            await supabase.auth.signOut({ scope: "local" });
            set({
              user: null,
              profile: null,
              isAdmin: false,
              loading: false,
              initialized: true,
            });
            return;
          }

          user = fetchedUser;
        }

        await get().setUser(user);
      } catch (error) {
        Logger.storeError("auth", "fetchUser", error);
        set({
          user: null,
          profile: null,
          isAdmin: false,
          loading: false,
          initialized: true,
        });
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
        initialized: true,
      });
    } catch (error) {
      Logger.storeError("auth", "signOut", error);
    }
  },
}));
