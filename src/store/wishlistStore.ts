import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { Logger } from "@/lib/logger";
import { Analytics } from "@/lib/analytics";
import { resilientCall } from "@/lib/api-utils";

interface WishlistState {
  items: string[];
  processingIds: string[];
  isSyncing: boolean;
  toggleWishlist: (product: Product, userId: string) => Promise<void>;
  syncWithDatabase: (userId: string) => Promise<void>;
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
      isSyncing: false,

      toggleWishlist: async (product, userId) => {
        if (!userId) {
          toast.error("Please sign in to manage wishlist");
          return;
        }

        const { items, processingIds } = get();
        if (processingIds.includes(product.id)) return;
        
        const prevItems = [...items];
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
            const { error } = await resilientCall(async () => 
              await supabase
                .from("wishlist")
                .delete()
                .eq("user_id", userId)
                .eq("product_id", product.id)
            ) as { error: any };
            if (error) throw error;
            Analytics.removeFromWishlist(product.id, userId);
          } else {
            // 🛡️ Use Upsert to prevent 409 Conflict if already in DB
            const { error } = await resilientCall(async () => 
              await supabase.from("wishlist").upsert({ 
                user_id: userId, 
                product_id: product.id 
              }, { onConflict: 'user_id,product_id' })
            ) as { error: any };
            if (error) throw error;
            Analytics.addToWishlist(product.id, userId);
          }

          toast.success(alreadyExists ? "Removed from wishlist" : "Added to wishlist");
        } catch (err: any) {
          Logger.storeError("wishlist", "toggleWishlist", err);
          set({ items: prevItems }); // 🔁 Rollback
          toast.error("Error syncing wishlist.");
        } finally {
          set((state) => ({
            processingIds: state.processingIds.filter(id => id !== product.id)
          }));
        }
      },

      syncWithDatabase: async (userId: string) => {
        if (!userId) return;

        // 🛡️ Idempotent Sync Guard
        if (get().isSyncing) {
            Logger.debug("Wishlist sync already in progress, skipping", { module: "wishlist", userId });
            return;
        }

        try {
          set({ isSyncing: true });

          // 1. Fetch current wishlist from DB
          const { data, error } = await resilientCall(async () => 
            await supabase
              .from("wishlist")
              .select("product_id")
              .eq("user_id", userId)
          ) as { data: any[] | null; error: any };

          if (error) throw error;

          const dbItemIds = (data || []).map((item: any) => item.product_id);
          const localItemIds = get().items;

          // 2. Deterministic Merge: Unique Set
          const mergedItemIds = Array.from(new Set([...dbItemIds, ...localItemIds]));

          // 3. Store Update
          set({ items: mergedItemIds });

          // 4. Sync new items back to DB using UPSERT to avoid 409s
          const newLocalItems = localItemIds.filter(id => !dbItemIds.includes(id));
          if (newLocalItems.length > 0) {
            const syncPromises = newLocalItems.map(id => 
              resilientCall(async () => 
                await supabase.from("wishlist").upsert({ 
                  user_id: userId, 
                  product_id: id 
                }, { onConflict: 'user_id,product_id' })
              )
            );
            await Promise.all(syncPromises);
          }

          Logger.info("Wishlist sync complete", { module: "wishlist", userId });
        } catch (err) {
          Logger.storeError("wishlist", "syncWithDatabase", err);
        } finally {
          set({ isSyncing: false });
        }
      },

      fetchWishlist: async (userId) => {
        if (!userId) {
          set({ items: [] });
          return;
        }

        try {
          const { data, error } = await resilientCall(async () => 
            await supabase
              .from("wishlist")
              .select("product_id")
              .eq("user_id", userId)
          ) as { data: any[] | null; error: any };

          if (error) throw error;
          if (data) set({ items: data.map((item: any) => item.product_id) });
        } catch (err) {
          Logger.storeError("wishlist", "fetchWishlist", err);
        }
      },

      setItems: (productIds: string[]) => set({ items: productIds }),
      clearWishlist: () => set({ items: [], processingIds: [] }),
      isInWishlist: (productId: string) => get().items.includes(productId),
    }),
    {
      name: "crochet-wishlist",
      skipHydration: true, 
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
