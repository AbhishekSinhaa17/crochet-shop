import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { Logger } from "@/lib/logger";
import { Analytics } from "@/lib/analytics";

export type WishlistOp = {
  type: "add" | "remove";
  productId: string;
};

interface WishlistState {
  items: string[];
  processingIds: string[];
  isSyncing: boolean;
  pendingOps: Record<string, WishlistOp>;
  syncTimer: any;
  toggleWishlist: (product: Product, userId: string) => Promise<void>;
  syncWithDatabase: (userId: string, isMergingGuest?: boolean) => Promise<void>;
  fetchWishlist: (userId: string) => Promise<void>;
  setItems: (productIds: string[]) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  flushWishlistQueue: (userId: string, isRetry?: boolean) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      processingIds: [],
      isSyncing: false,
      pendingOps: {},
      syncTimer: null,

      toggleWishlist: async (product, userId) => {
        if (!userId) {
          toast.error("Please sign in to manage wishlist");
          return;
        }

        const { items, pendingOps, syncTimer } = get();
        const alreadyExists = items.includes(product.id);

        // ✅ Optimistic Update
        const updatedItems = alreadyExists
          ? items.filter((id) => id !== product.id)
          : [...items, product.id];

        set({
          items: updatedItems,
          pendingOps: {
            ...pendingOps,
            [product.id]: {
              type: alreadyExists ? "remove" : "add",
              productId: product.id,
            },
          },
        });

        // 🧠 Reset timer
        if (syncTimer) clearTimeout(syncTimer);
        const timer = setTimeout(() => get().flushWishlistQueue(userId), 500);
        set({ syncTimer: timer });

        toast.success(alreadyExists ? "Removed from wishlist" : "Added to wishlist");
        
        if (alreadyExists) {
          Analytics.removeFromWishlist(product.id, userId);
        } else {
          Analytics.addToWishlist(product.id, userId);
        }
      },

      flushWishlistQueue: async (userId: string, isRetry = false) => {
        const { pendingOps } = get();
        const ops = Object.values(pendingOps);
        if (ops.length === 0) return;

        const productIds = ops.map((op) => op.productId);
        set((state) => ({
          processingIds: Array.from(new Set([...state.processingIds, ...productIds])),
          pendingOps: {},
        }));

        if (typeof window !== "undefined" && !navigator.onLine) {
          set((state) => ({
            pendingOps: { ...pendingOps, ...state.pendingOps },
            processingIds: state.processingIds.filter((id) => !productIds.includes(id)),
          }));
          return;
        }

        try {
          const response = await fetch("/api/wishlist/batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operations: ops.map((op) => ({
                type: op.type,
                product_id: op.productId,
              })),
            }),
          });

          if (!response.ok) throw new Error("Wishlist batch sync failed");

          Logger.info(`Wishlist batch sync success: ${ops.length} ops`, { module: "wishlist", userId });
        } catch (err) {
          Logger.storeError("wishlist", "flushWishlistQueue", err);

          if (typeof window !== "undefined" && navigator.onLine) {
            if (!isRetry) {
              Logger.info("Retrying wishlist batch sync with delay...", { module: "wishlist", userId });
              set((state) => ({
                pendingOps: { ...pendingOps, ...state.pendingOps },
              }));
              // Artificial delay before retry to handle 429s
              setTimeout(() => {
                get().flushWishlistQueue(userId, true);
              }, 2000);
            } else {
              toast.error("Wishlist sync issues. Please refresh.");
            }
          } else {
            set((state) => ({
              pendingOps: { ...pendingOps, ...state.pendingOps },
            }));
          }
        } finally {
          set((state) => ({
            processingIds: state.processingIds.filter((id) => !productIds.includes(id)),
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
      partialize: (state) => ({ 
        items: state.items,
        pendingOps: state.pendingOps 
      }),
    }
  )
);