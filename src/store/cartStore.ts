import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import { getProductImage } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { Logger } from "@/lib/logger";
import { Analytics } from "@/lib/analytics";
import { resilientCall } from "@/lib/api-utils";
import { useAuthStore } from "./useAuthStore";
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

interface CartState {
  items: CartProduct[];
  processingIds: string[];
  isSyncing: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  setItems: (items: CartProduct[]) => void;
  syncWithDatabase: (userId: string, isMergingGuest?: boolean) => Promise<void>;
  clearCart: (shouldSync?: boolean) => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
  isProcessing: (productId: string) => boolean;
}

/**
 * 🛒 Deterministic Merge Strategy
 */
const mergeCart = (
  local: CartProduct[], 
  db: CartProduct[], 
  isMergingGuest: boolean = false
): CartProduct[] => {
  const map = new Map<string, CartProduct>();
  db.forEach(item => map.set(item.id, { ...item }));
  local.forEach(item => {
    const existing = map.get(item.id);
    if (existing) {
      if (isMergingGuest) {
        map.set(item.id, {
          ...existing,
          quantity: Math.min(existing.quantity + item.quantity, existing.stock)
        });
      } else {
        map.set(item.id, { ...existing });
      }
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

      addItem: async (product: Product, quantity = 1) => {
        const { items, processingIds } = get();
        if (processingIds.includes(product.id)) return;

        const existing = items.find((i) => i.id === product.id);
        const newQuantity = existing 
          ? Math.min(existing.quantity + quantity, product.stock)
          : Math.min(quantity, product.stock);

        const prevItems = [...items];
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

        set({ 
          items: newItems,
          processingIds: [...processingIds, product.id]
        });

        try {
          const userId = useAuthStore.getState().user?.id;
          
          if (userId) {
            const { error } = await resilientCall(async () => 
              await supabase.from("cart_items").upsert({
                user_id: userId,
                product_id: product.id,
                quantity: newQuantity
              }, { onConflict: 'user_id,product_id' }),
              `cart/addItem/${product.id}`
            ) as { error: any };
            if (error) throw error;
          }
          
          Analytics.addToCart(product.id, product.price, userId);
        } catch (err) {
          Logger.storeError("cart", "addItem", err);
          set({ items: prevItems });
          toast.error("Sync issue. Item saved locally.");
        } finally {
          set((state) => ({
            processingIds: state.processingIds.filter(id => id !== product.id)
          }));
        }
      },

      removeItem: async (productId: string) => {
        const { items, processingIds } = get();
        if (processingIds.includes(productId)) return;

        const prevItems = [...items];
        const newItems = items.filter((i) => i.id !== productId);
        
        set({ 
          items: newItems,
          processingIds: [...processingIds, productId]
        });

        try {
          const userId = useAuthStore.getState().user?.id;
          
          if (userId) {
            const { error } = await resilientCall(async () => 
              await supabase
                .from("cart_items")
                .delete()
                .eq("user_id", userId)
                .eq("product_id", productId),
              `cart/removeItem/${productId}`
            ) as { error: any };
            if (error) throw error;
          }
          Analytics.removeFromCart(productId, userId);
        } catch (err) {
          Logger.storeError("cart", "removeItem", err);
          set({ items: prevItems });
          toast.error("Failed to remove.");
        } finally {
          set((state) => ({
            processingIds: state.processingIds.filter(id => id !== productId)
          }));
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        const { items, processingIds } = get();
        if (processingIds.includes(productId)) return;

        if (quantity <= 0) return get().removeItem(productId);

        const item = items.find(i => i.id === productId);
        if (!item) return;

        const prevItems = [...items];
        const finalQuantity = Math.min(quantity, item.stock);
        const newItems = items.map((i) =>
          i.id === productId ? { ...i, quantity: finalQuantity } : i
        );

        set({ 
          items: newItems,
          processingIds: [...processingIds, productId]
        });

        try {
          const userId = useAuthStore.getState().user?.id;
          
          if (userId) {
            const { error } = await resilientCall(async () => 
              await supabase
                .from("cart_items")
                .update({ quantity: finalQuantity })
                .eq("user_id", userId)
                .eq("product_id", productId),
              `cart/updateQuantity/${productId}`
            ) as { error: any };
            if (error) throw error;
          }
        } catch (err) {
          Logger.storeError("cart", "updateQuantity", err);
          set({ items: prevItems });
          toast.error("Failed to update.");
        } finally {
          set((state) => ({
            processingIds: state.processingIds.filter(id => id !== productId)
          }));
        }
      },

      syncWithDatabase: async (userId: string, isMergingGuest: boolean = false) => {
        if (!userId) return;

        if (get().isSyncing) {
            Logger.debug("Syncing in progress, skipping", { module: "cart", userId });
            return;
        }

        try {
          set({ isSyncing: true });

          // 1. Fetch DB items with resilience
          const { data: dbItems, error } = await resilientCall(async () => 
            await supabase
              .from("cart_items")
              .select("*, product:products(*)")
              .eq("user_id", userId),
            "cart/syncFetch"
          ) as { data: any[] | null; error: any };

          if (error) throw error;

          const mappedDbItems: CartProduct[] = (dbItems as any[] || [])
            .filter((item: any) => item.product) 
            .map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              compare_price: item.product.compare_price,
              image: getProductImage(item.product.images),
              stock: item.product.stock,
              quantity: item.quantity
            }));

          // 2. Deterministic Merge Logic
          const localItems = get().items;
          const mergedItems = mergeCart(localItems, mappedDbItems, isMergingGuest);

          // 3. Store Update
          set({ items: mergedItems });

          // 🛡️ Phase 4: BULK SYNCHRONIZATION (The Critical Fix)
          // Instead of firing 10 separate requests, send ONE bulk upsert.
          // This reduces network overhead and prevents connection pool exhaustion.
          if (mergedItems.length > 0) {
              const upsertData = mergedItems.map(item => ({
                  user_id: userId,
                  product_id: item.id,
                  quantity: item.quantity
              }));

              const { error: syncError } = await resilientCall(async () => 
                await supabase
                  .from("cart_items")
                  .upsert(upsertData, { onConflict: 'user_id,product_id' }),
                "cart/bulkSync"
              ) as { error: any };

              if (syncError) throw syncError;
          }

          Logger.info("Cart sync complete (Bulk)", { module: "cart", userId, count: mergedItems.length });
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
            const userId = useAuthStore.getState().user?.id;
            if (userId) {
              const { error } = await resilientCall(async () => 
                await supabase.from("cart_items").delete().eq("user_id", userId),
                "cart/clear"
              ) as { error: any };
              if (error) throw error;
            }
          } catch (err) {
            Logger.storeError("cart", "clearCart", err);
            set({ items: prevItems });
            toast.error("Cleanup sync failed.");
          }
        }
      },

      getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      isProcessing: (productId: string) => get().processingIds.includes(productId),
    }),
    { 
      name: "crochet-cart",
      skipHydration: true, 
      partialize: (state) => ({ items: state.items })
    }
  )
);