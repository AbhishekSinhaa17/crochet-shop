import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import { getProductImage } from "@/lib/utils";
import { Logger } from "@/lib/logger";
import { Analytics } from "@/lib/analytics";
import toast from "react-hot-toast";

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  compare_price?: number | null;
  image: string;
  stock: number;
  quantity: number;
}

export type CartOp = {
  type: "upsert" | "delete";
  productId: string;
  quantity?: number;
};

interface CartState {
  items: CartProduct[];
  processingIds: string[];
  isSyncing: boolean;
  pendingOps: Record<string, CartOp>;
  syncTimer: any;
  addItem: (product: Product, quantity?: number, userId?: string) => Promise<void>;
  removeItem: (productId: string, userId?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, userId?: string) => Promise<void>;
  setItems: (items: CartProduct[]) => void;
  syncWithDatabase: (userId: string, isMergingGuest?: boolean) => Promise<void>;
  clearCart: (shouldSync?: boolean) => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
  isProcessing: (productId: string) => boolean;
  flushCartQueue: (userId: string, retry?: boolean) => Promise<void>;
}

const mergeCart = (
  local: CartProduct[],
  db: CartProduct[],
  isMergingGuest: boolean = false,
  processingIds: string[] = []
): CartProduct[] => {
  if (!isMergingGuest) {
    const safeDbItems = db.filter(item => !processingIds.includes(item.id));
    const pendingLocalItems = local.filter(item => processingIds.includes(item.id));
    return [...safeDbItems, ...pendingLocalItems];
  }

  const map = new Map<string, CartProduct>();
  db.forEach(item => map.set(item.id, { ...item }));
  local.forEach(item => {
    const existing = map.get(item.id);
    if (existing) {
      map.set(item.id, {
        ...existing,
        quantity: Math.min(existing.quantity + item.quantity, existing.stock)
      });
    } else {
      map.set(item.id, { ...item });
    }
  });
  return Array.from(map.values());
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      processingIds: [],
      isSyncing: false,
      pendingOps: {},
      syncTimer: null,

      addItem: async (product: Product, quantity = 1, userId) => {
        const { items, processingIds, pendingOps, syncTimer } = get();

        const existing = items.find((i) => i.id === product.id);
        const newQuantity = existing
          ? Math.min(existing.quantity + quantity, product.stock)
          : Math.min(quantity, product.stock);

        const newItems = existing
          ? items.map((i) => (i.id === product.id ? { ...i, quantity: newQuantity } : i))
          : [
              ...items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                compare_price: product.compare_price,
                image: getProductImage(product.images),
                stock: product.stock,
                quantity: newQuantity,
              },
            ];

        // ✅ Optimistic UI update
        set({
          items: newItems,
          pendingOps: {
            ...pendingOps,
            [product.id]: { type: "upsert", productId: product.id, quantity: newQuantity },
          },
        });

        Analytics.addToCart(product.id, product.price, userId);

        if (userId) {
          if (syncTimer) clearTimeout(syncTimer);
          const timer = setTimeout(() => get().flushCartQueue(userId), 500);
          set({ syncTimer: timer });
        }
      },

      removeItem: async (productId: string, userId) => {
        const { items, pendingOps, syncTimer } = get();
        const newItems = items.filter((i) => i.id !== productId);

        // ✅ Optimistic UI update
        set({
          items: newItems,
          pendingOps: {
            ...pendingOps,
            [productId]: { type: "delete", productId },
          },
        });

        Analytics.removeFromCart(productId, userId);

        if (userId) {
          if (syncTimer) clearTimeout(syncTimer);
          const timer = setTimeout(() => get().flushCartQueue(userId), 500);
          set({ syncTimer: timer });
        }
      },

      updateQuantity: async (productId: string, quantity: number, userId) => {
        const { items, pendingOps, syncTimer } = get();
        if (quantity <= 0) return get().removeItem(productId, userId);

        const item = items.find((i) => i.id === productId);
        if (!item) return;

        const finalQuantity = Math.min(quantity, item.stock);
        const newItems = items.map((i) =>
          i.id === productId ? { ...i, quantity: finalQuantity } : i
        );

        // ✅ Optimistic UI update
        set({
          items: newItems,
          pendingOps: {
            ...pendingOps,
            [productId]: { type: "upsert", productId, quantity: finalQuantity },
          },
        });

        if (userId) {
          if (syncTimer) clearTimeout(syncTimer);
          const timer = setTimeout(() => get().flushCartQueue(userId), 500);
          set({ syncTimer: timer });
        }
      },

      flushCartQueue: async (userId: string, isRetry = false) => {
        const { pendingOps } = get();
        const ops = Object.values(pendingOps);
        if (ops.length === 0) return;

        // Mark items as processing
        const productIds = ops.map((op) => op.productId);
        set((state) => ({
          processingIds: Array.from(new Set([...state.processingIds, ...productIds])),
          pendingOps: {}, // Clear queue immediately to avoid double processing
        }));

        try {
          const response = await fetch("/api/cart/batch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operations: ops.map((op) => ({
                type: op.type,
                product_id: op.productId,
                quantity: op.quantity,
              })),
            }),
          });

          if (!response.ok) throw new Error("Batch sync failed");

          Logger.info(`Cart batch sync success: ${ops.length} ops`, { module: "cart", userId });
        } catch (err) {
          Logger.storeError("cart", "flushCartQueue", err);

          if (!isRetry) {
            Logger.info("Retrying cart batch sync...", { module: "cart", userId });
            // Add back to queue and retry once
            set((state) => ({
              pendingOps: { ...pendingOps, ...state.pendingOps },
            }));
            await get().flushCartQueue(userId, true);
          } else {
            toast.error("Cart sync failed after retry.");
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

          const response = await fetch("/api/cart", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          const { data: dbItems, error } = await response.json();
          if (error) throw new Error(error);

          const mappedDbItems: CartProduct[] = (dbItems || [])
            .filter((item: any) => item.product)
            .map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              compare_price: item.product.compare_price,
              image: getProductImage(item.product.images),
              stock: item.product.stock,
              quantity: item.quantity,
            }));

          const localItems = get().items;
          const inFlightItemIds = get().processingIds;
          const mergedItems = mergeCart(
            localItems,
            mappedDbItems,
            isMergingGuest,
            inFlightItemIds
          );

          set({ items: mergedItems });

          if (isMergingGuest && mergedItems.length > 0) {
            await Promise.all(
              mergedItems.map((item) =>
                fetch("/api/cart", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    product_id: item.id,
                    quantity: item.quantity,
                  }),
                })
              )
            );
          }

          Logger.info("Cart sync complete", {
            module: "cart",
            userId,
            count: mergedItems.length,
          });
        } catch (err) {
          Logger.storeError("cart", "syncWithDatabase", err);
          if (isMergingGuest) {
            toast.error("Initial cart sync failed.");
          }
        } finally {
          set({ isSyncing: false });
        }
      },

      setItems: (items) => set({ items }),

      clearCart: async (shouldSync = true) => {
        const prevItems = get().items;
        set({ items: [] });

        if (shouldSync) {
          try {
            // ✅ We don't import useAuthStore here, so we skip server sync on basic clear
            // Real sync is handled by AuthProvider on logout detection
            const response = await fetch("/api/cart", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ clear_all: true }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
          } catch (err) {
            Logger.storeError("cart", "clearCart", err);
            set({ items: prevItems });
            toast.error("Cleanup sync failed.");
          }
        }
      },

      getTotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      isProcessing: (productId: string) =>
        get().processingIds.includes(productId),
    }),
    {
      name: "crochet-cart",
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    }
  )
);