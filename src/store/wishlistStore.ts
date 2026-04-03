import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface WishlistState {
  items: string[]; // Array of product IDs
  toggleWishlist: (product: Product, supabase: any) => Promise<void>;
  setItems: (productIds: string[]) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: async (product: Product, supabase: any) => {
        try {
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            console.error("Auth error in toggleWishlist:", authError);
            return;
          }

          const isCurrentlyWishlisted = get().items.includes(product.id);

          if (isCurrentlyWishlisted) {
            // Optimistic: remove from local state first
            set((state) => ({
              items: state.items.filter((id) => id !== product.id),
            }));
            // Sync with Supabase
            const { error } = await supabase
              .from("wishlist")
              .delete()
              .eq("user_id", user.id)
              .eq("product_id", product.id);
            
            if (error) {
              console.error("Failed to remove from wishlist:", error);
              // Rollback on failure
              set((state) => ({
                items: [...state.items, product.id],
              }));
            }
          } else {
            // Optimistic: add to local state first
            set((state) => ({
              items: [...state.items, product.id],
            }));
            // Sync with Supabase
            const { error } = await supabase.from("wishlist").upsert({
              user_id: user.id,
              product_id: product.id,
            });
            
            if (error) {
              console.error("Failed to add to wishlist:", error);
              // Rollback on failure
              set((state) => ({
                items: state.items.filter((id) => id !== product.id),
              }));
            }
          }
        } catch (err) {
          console.error("Unexpected error in toggleWishlist:", err);
        }
      },

      setItems: (productIds: string[]) => set({ items: productIds }),

      isInWishlist: (productId: string) => get().items.includes(productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "crochet-wishlist" }
  )
);
