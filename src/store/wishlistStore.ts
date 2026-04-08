import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { Logger } from "@/lib/logger";
import { Analytics } from "@/lib/analytics";
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

        // ✅ Optimistic Update
        const updatedItems = alreadyExists
          ? items.filter((id) => id !== product.id)
          : [...items, product.id];

        set({
          items: updatedItems,
          processingIds: [...processingIds, product.id],
        });

        try {
          if (alreadyExists) {
            // ✅ API Route use karo
            const response = await fetch("/api/wishlist", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ product_id: product.id }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            Analytics.removeFromWishlist(product.id, userId);
          } else {
            // ✅ API Route use karo
            const response = await fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ product_id: product.id }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            Analytics.addToWishlist(product.id, userId);
          }

          toast.success(
            alreadyExists ? "Removed from wishlist" : "Added to wishlist"
          );
        } catch (err: any) {
          Logger.storeError("wishlist", "toggleWishlist", err);
          set({ items: prevItems }); // Rollback
          toast.error("Wishlist sync issue.");
        } finally {
          set((state) => ({
            processingIds: state.processingIds.filter(
              (id) => id !== product.id
            ),
          }));
        }
      },

      syncWithDatabase: async (
        userId: string,
        isMergingGuest: boolean = false
      ) => {
        if (!userId) return;
        if (get().isSyncing) return;

        try {
          set({ isSyncing: true });

          // ✅ API Route use karo
          const response = await fetch("/api/wishlist", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          const { data, error } = await response.json();
          if (error) throw new Error(error);

          const dbItemIds: string[] = (data || [])
            .filter((item: any) => item.product)
            .map((item: any) => item.product.id);

          const localItemIds = get().items;
          const inFlightItemIds = get().processingIds;

          // ✅ Merge Logic
          let mergedItemIds: string[];
          if (isMergingGuest) {
            mergedItemIds = Array.from(
              new Set([...dbItemIds, ...localItemIds])
            );
          } else {
            const safeDbItems = dbItemIds.filter(
              (id) => !inFlightItemIds.includes(id)
            );
            const pendingLocalItems = localItemIds.filter((id) =>
              inFlightItemIds.includes(id)
            );
            mergedItemIds = Array.from(
              new Set([...safeDbItems, ...pendingLocalItems])
            );
          }

          set({ items: mergedItemIds });

          // ✅ Guest merge - bulk sync
          if (isMergingGuest && mergedItemIds.length > 0) {
            await Promise.all(
              mergedItemIds.map((id) =>
                fetch("/api/wishlist", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ product_id: id }),
                })
              )
            );
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

      fetchWishlist: async (userId: string) => {
        if (!userId) {
          set({ items: [] });
          return;
        }

        try {
          // ✅ API Route use karo
          const response = await fetch("/api/wishlist", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          const { data, error } = await response.json();
          if (error) throw new Error(error);

          if (data) {
            set({
              items: data
                .filter((item: any) => item.product)
                .map((item: any) => item.product.id),
            });
          }
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
    }
  )
);