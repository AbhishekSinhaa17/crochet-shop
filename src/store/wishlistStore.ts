import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase/client";

interface WishlistState {
  items: string[];
  processingIds: string[];
  toggleWishlist: (product: Product, userId: string) => Promise<void>;
  fetchWishlist: (userId: string) => Promise<void>;
  setItems: (productIds: string[]) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      processingIds: [],

      toggleWishlist: async (product, userId) => {
        if (!userId) {
          toast.error("Please sign in to manage wishlist");
          return;
        }

        const { items, processingIds } = get();
        
        // 🚫 Prevent spam clicks for the SAME product
        if (processingIds.includes(product.id)) return;
        
        const alreadyExists = items.includes(product.id);
        
        // ⚡ Optimistic Update
        const updatedItems = alreadyExists
          ? items.filter((id) => id !== product.id)
          : [...items, product.id];
          
        set((state) => ({ 
          items: updatedItems,
          processingIds: [...state.processingIds, product.id]
        }));

        try {
          if (alreadyExists) {
            const { error } = await supabase
              .from("wishlist")
              .delete()
              .eq("user_id", userId)
              .eq("product_id", product.id);

            if (error) throw error;
          } else {
            const { error } = await supabase
              .from("wishlist")
              .insert({
                user_id: userId,
                product_id: product.id,
              });

            // Handle unique constraint violation (23505) safely
            if (error && error.code !== "23505") throw error;
          }

          toast.success(alreadyExists ? "Removed from wishlist" : "Added to wishlist");
        } catch (err: any) {
          console.error(`Wishlist error [${product.id}]:`, err);
          
          // 🔁 Rollback on failure
          set({ items });
          toast.error("Failed to update wishlist");
        } finally {
          set((state) => ({
            processingIds: state.processingIds.filter(id => id !== product.id)
          }));
        }
      },

      fetchWishlist: async (userId) => {
        if (!userId) {
          set({ items: [] });
          return;
        }

        try {
          const { data, error } = await supabase
            .from("wishlist")
            .select("product_id")
            .eq("user_id", userId);

          if (error) throw error;
          if (data) {
            set({ items: data.map((item) => item.product_id) });
          }
        } catch (err) {
          console.error("Error fetching wishlist:", err);
        }
      },

      setItems: (productIds: string[]) => set({ items: productIds }),

      clearWishlist: () => set({ items: [], processingIds: [] }),

      isInWishlist: (productId: string) => get().items.includes(productId),
    }),
    {
      name: "crochet-wishlist",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
