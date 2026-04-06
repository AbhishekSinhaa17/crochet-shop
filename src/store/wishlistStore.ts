import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase/client";

interface WishlistState {
  items: string[];
  isProcessing: boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  setItems: (productIds: string[]) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isProcessing: false,

      toggleWishlist: async (product) => {
        if (get().isProcessing) return;
        
        try {
          set({ isProcessing: true });
          const {
            data: { session },
          } = await supabase.auth.getSession();
          const user = session?.user;

          if (!user) {
            toast.error("Please sign in to manage wishlist");
            return;
          }

          const { data: existing } = await supabase
            .from("wishlist")
            .select("id")
            .eq("user_id", user.id)
            .eq("product_id", product.id)
            .maybeSingle();

          if (existing) {
            const { error } = await supabase
              .from("wishlist")
              .delete()
              .eq("user_id", user.id)
              .eq("product_id", product.id);

            if (error) throw error;

            set((state) => ({
              items: state.items.filter((id) => id !== product.id),
            }));
            toast.success("Removed from wishlist");
          } else {
            const { error } = await supabase.from("wishlist").insert({
              user_id: user.id,
              product_id: product.id,
            });

            if (error) throw error;

            set((state) => ({
              items: [...state.items, product.id],
            }));
            toast.success("Added to wishlist");
          }
        } catch (err: any) {
          console.error(err);
          toast.error(err.message || "Something went wrong");
        } finally {
          set({ isProcessing: false });
        }
      },

      setItems: (productIds: string[]) => set({ items: productIds }),

      clearWishlist: () => set({ items: [] }),

      isInWishlist: (productId: string) => get().items.includes(productId),
    }),
    {
      name: "crochet-wishlist",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
