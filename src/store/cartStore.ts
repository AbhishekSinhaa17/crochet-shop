import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import { getProductImage } from "@/lib/utils";


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
  addItem: (product: Product, quantity?: number, supabase?: any) => void;
  removeItem: (productId: string, supabase?: any) => void;
  updateQuantity: (productId: string, quantity: number, supabase?: any) => void;
  setItems: (items: CartProduct[]) => void;
  clearCart: (supabase?: any) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: async (product: Product, quantity = 1, supabase?: any) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          let newItems;
          if (existing) {
            newItems = state.items.map((i) =>
              i.id === product.id
                ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) }
                : i
            );
          } else {
            newItems = [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                compare_price: product.compare_price,
                image: getProductImage(product.images),
                stock: product.stock,
                quantity,
              },
            ];
          }

          // Sync with Supabase if provided
          if (supabase) {
            const syncCart = async () => {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const item = newItems.find(i => i.id === product.id);
                if (item) {
                  await supabase.from("cart_items").upsert({
                    user_id: user.id,
                    product_id: product.id,
                    quantity: item.quantity
                  }, { onConflict: 'user_id,product_id' });
                }
              }
            };
            syncCart();
          }

          return { items: newItems };
        });
      },

      removeItem: async (productId: string, supabase?: any) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== productId);
          
          if (supabase) {
            const syncRemove = async () => {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", productId);
              }
            };
            syncRemove();
          }

          return { items: newItems };
        });
      },

      updateQuantity: async (productId: string, quantity: number, supabase?: any) => {
        if (quantity <= 0) {
          get().removeItem(productId, supabase);
          return;
        }
        set((state) => {
          const newItems = state.items.map((i) =>
            i.id === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          );

          if (supabase) {
            const syncUpdate = async () => {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                await supabase.from("cart_items").update({ quantity }).eq("user_id", user.id).eq("product_id", productId);
              }
            };
            syncUpdate();
          }

          return { items: newItems };
        });
      },

      setItems: (items) => set({ items }),

      clearCart: async (supabase?: any) => {
        set({ items: [] });
        if (supabase) {
          const syncClear = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from("cart_items").delete().eq("user_id", user.id);
            }
          };
          syncClear();
        }
      },

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    { name: "crochet-cart" }
  )
);