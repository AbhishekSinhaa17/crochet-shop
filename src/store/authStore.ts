import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { Profile } from "@/types";

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  initialized: boolean;
  setUser: (user: any | null) => void;
  setProfile: (profile: Profile | null) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  initialized: false,

  setUser: (user) => {
    set({ 
      user, 
      isAdmin: user?.app_metadata?.role === "admin" || false 
    });
  },

  setProfile: (profile) => set({ 
    profile,
    isAdmin: profile?.role === "admin"
  }),

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (!error && profile) {
        set({ 
          profile, 
          isAdmin: profile.role === "admin" 
        });
      }
    } catch (err) {
      console.error("AuthStore: Error fetching profile", err);
    }
  },

  initialize: async () => {
    if (get().initialized) return;

    // Get initial session using getSession (fast, cached)
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    set({ user, initialized: true, loading: !user });

    if (user) {
      await get().fetchProfile();
    }
    
    set({ loading: false });

    // Listen for changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      
      if (newUser?.id !== get().user?.id) {
        set({ user: newUser, loading: !!newUser });
        
        if (newUser) {
          await get().fetchProfile();
        } else {
          set({ profile: null, isAdmin: false });
        }
        set({ loading: false });
      }
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAdmin: false });
  }
}));
