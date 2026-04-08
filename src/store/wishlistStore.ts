import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { Logger } from "@/lib/logger";
import { Analytics } from "@/lib/analytics";
import { resilientCall } from "@/lib/api-utils";
import { useAuthStore } from "./useAuthStore";

interface WishlistState {
  items: string[];
  processingIds: string[];
  isSyncing: boolean;
  toggleWishlist: (product: Product, userId: string) => Promise<void>;
  syncWithDatabase: (userId: string, isMergingGuest?: boolean) => Promise<void>;
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
          processingIds: [...state.processingIds, product.id],
        }));

        try {
          if (alreadyExists) {
            const { error } = await supabase
              .from("wishlist")
              .delete()
              .eq("user_id", userId)
              .eq("product_id", product.id);

            if (error) throw error;
            Analytics.removeFromWishlist(product.id, userId);
          } else {
            // 🛡️ Use Upsert to prevent 409 Conflict if already in DB
            const { error } = await supabase.from("wishlist").upsert(
              {
                user_id: userId,
                product_id: product.id,
              },
              { onConflict: "user_id,product_id" },
            );

            if (error) throw error;
            Analytics.addToWishlist(product.id, userId);
          }

          toast.success(
            alreadyExists ? "Removed from wishlist" : "Added to wishlist",
          );
        } catch (err: any) {
          Logger.storeError("wishlist", "toggleWishlist", err);
          set({ items: prevItems }); // 🔁 Rollback
          toast.error("Wishlist sync issue.");
        } finally {
          set((state) => ({
            processingIds: state.processingIds.filter(
              (id) => id !== product.id,
            ),
          }));
        }
      },

      syncWithDatabase: async (
        userId: string,
        isMergingGuest: boolean = false,
      ) => {
        if (!userId) return;

        if (get().isSyncing) {
          Logger.debug("Wishlist sync in progress, skipping", {
            module: "wishlist",
            userId,
          });
          return;
        }

        try {
          set({ isSyncing: true });

          // 1. Fetch current wishlist from DB
          const { data, error } = (await resilientCall(
            async () =>
              await supabase
                .from("wishlist")
                .select("product_id")
                .eq("user_id", userId),
            "wishlist/syncFetch",
          )) as { data: any[] | null; error: any };

          if (error) throw error;

          const dbItemIds: string[] = (data || []).map(
            (item: any) => item.product_id,
          );
          const localItemIds = get().items;
          const inFlightItemIds = get().processingIds;

          // 2. Deterministic Merge
          let mergedItemIds: string[];
          if (isMergingGuest) {
            mergedItemIds = Array.from(
              new Set([...dbItemIds, ...localItemIds]),
            );
          } else {
            // DB is source of truth, EXCEPT for items currently being processed (optimistic updates taking precedence)
            const safeDbItems = dbItemIds.filter(
              (id) => !inFlightItemIds.includes(id),
            );
            const pendingLocalItems = localItemIds.filter((id) =>
              inFlightItemIds.includes(id),
            );
            mergedItemIds = Array.from(
              new Set([...safeDbItems, ...pendingLocalItems]),
            );
          }

          // 3. Store Update
          set({ items: mergedItemIds });

          // 🛡️ 4. BULK Upserts ONLY on guest merge
          if (isMergingGuest && mergedItemIds.length > 0) {
            const upsertData = mergedItemIds.map((id) => ({
              user_id: userId,
              product_id: id,
            }));

            const { error: syncError } = (await resilientCall(
              async () =>
                await supabase
                  .from("wishlist")
                  .upsert(upsertData, { onConflict: "user_id,product_id" }),
              "wishlist/bulkSync",
            )) as { error: any };

            if (syncError) throw syncError;
          }

          Logger.info("Wishlist sync complete", {
            module: "wishlist",
            userId,
            count: mergedItemIds.length,
          });
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
          const { data, error } = (await resilientCall(
            async () =>
              await supabase
                .from("wishlist")
                .select("product_id")
                .eq("user_id", userId),
            "wishlist/fetch",
          )) as { data: any[] | null; error: any };

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
