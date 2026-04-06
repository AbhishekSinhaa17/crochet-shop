import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { Profile } from "@/types";

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  isAdmin: boolean;
  setUser: (user: any | null) => Promise<void>;
  fetchUser: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  isAdmin: false,

  setUser: async (user) => {
    if (user?.id === get().user?.id && get().initialized) return;

    set({ user, loading: !!user, initialized: true });
    
    if (user) {
      await get().fetchProfile(user.id);
    } else {
      set({ profile: null, isAdmin: false, loading: false });
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
        set({ 
          profile, 
          isAdmin: profile.role === "admin",
          loading: false 
        });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.error("AuthStore: Error fetching profile", err);
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    // Prevent double initialization
    if (get().initialized && get().user) return;

    set({ loading: true });

    try {
      // 1. Try getSession first (faster, cached)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      let user = session?.user ?? null;

      // 2. Fallback to getUser if no session or preferred for security
      if (!user) {
        const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();
        user = fetchedUser;
      }

      await get().setUser(user);
      console.log("Auth initialized");
    } catch (error) {
      console.error("AuthStore: Error fetching user", error);
      set({ user: null, profile: null, isAdmin: false, loading: false, initialized: true });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAdmin: false, loading: false });
  },
}));
