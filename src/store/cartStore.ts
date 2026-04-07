import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import { getProductImage } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
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
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  setItems: (items: CartProduct[]) => void;
  clearCart: (shouldSync?: boolean) => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
  isProcessing: (productId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      processingIds: [],

      addItem: async (product: Product, quantity = 1) => {
        const { items, processingIds } = get();
        if (processingIds.includes(product.id)) return;

        const existing = items.find((i) => i.id === product.id);
        const newQuantity = existing 
          ? Math.min(existing.quantity + quantity, product.stock)
          : Math.min(quantity, product.stock);

        // ⚡ Optimistic Update
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
          const user = useAuthStore.getState().user;
          if (user && supabase) {
            const { error } = await supabase.from("cart_items").upsert({
              user_id: user.id,
              product_id: product.id,
              quantity: newQuantity
            }, { onConflict: 'user_id,product_id' });

            if (error) throw error;
          }
        } catch (err) {
          console.error("Cart add error:", err);
          set({ items }); // 🔁 Rollback
          toast.error("Failed to update cart. Please try again.");
        } finally {
          set((state) => ({
            processingIds: state.processingIds.filter(id => id !== product.id)
          }));
        }
      },

      removeItem: async (productId: string) => {
        const { items, processingIds } = get();
        if (processingIds.includes(productId)) return;

        // ⚡ Optimistic Update
        const newItems = items.filter((i) => i.id !== productId);
        
        set({ 
          items: newItems,
          processingIds: [...processingIds, productId]
        });

        try {
          const user = useAuthStore.getState().user;
          if (user && supabase) {
            const { error } = await supabase
              .from("cart_items")
              .delete()
              .eq("user_id", user.id)
              .eq("product_id", productId);

            if (error) throw error;
          }
        } catch (err) {
          console.error("Cart remove error:", err);
          set({ items }); // 🔁 Rollback
          toast.error("Failed to remove item.");
        } finally {
          set((state) => ({
            processingIds: state.processingIds.filter(id => id !== productId)
          }));
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        const { items, processingIds } = get();
        if (processingIds.includes(productId)) return;

        if (quantity <= 0) {
          return get().removeItem(productId);
        }

        const item = items.find(i => i.id === productId);
        if (!item) return;

        const finalQuantity = Math.min(quantity, item.stock);

        // ⚡ Optimistic Update
        const newItems = items.map((i) =>
          i.id === productId ? { ...i, quantity: finalQuantity } : i
        );

        set({ 
          items: newItems,
          processingIds: [...processingIds, productId]
        });

        try {
          const user = useAuthStore.getState().user;
          if (user && supabase) {
            const { error } = await supabase
              .from("cart_items")
              .update({ quantity: finalQuantity })
              .eq("user_id", user.id)
              .eq("product_id", productId);

            if (error) throw error;
          }
        } catch (err) {
          console.error("Cart update error:", err);
          set({ items }); // 🔁 Rollback
          toast.error("Failed to update quantity.");
        } finally {
          set((state) => ({
            processingIds: state.processingIds.filter(id => id !== productId)
          }));
        }
      },

      setItems: (items) => set({ items }),

      clearCart: async (shouldSync = true) => {
        const { items } = get();
        set({ items: [] });

        if (shouldSync) {
          try {
            const user = useAuthStore.getState().user;
            if (user && supabase) {
              const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id);
              if (error) throw error;
            }
          } catch (err) {
            console.error("Cart clear error:", err);
            set({ items }); // 🔁 Rollback
            toast.error("Failed to clear cart sync.");
          }
        }
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      isProcessing: (productId: string) => get().processingIds.includes(productId),
    }),
    { 
      name: "crochet-cart",
      partialize: (state) => ({ items: state.items }) // Don't persist processingIds
    }
  )
);