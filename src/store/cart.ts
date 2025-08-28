import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  image?: string;
  rating?: number;
  description?: string;
  category?: string;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  cartItemCount: number;
}

export const getUseCartStore = () => {
  return create<CartStore>()(
    persist(
      (set, get) => ({
        items: [],
        cartItemCount: 0,

        addToCart: (newItem: CartItem) => {
          const items = get().items;
          const existingItem = items.find((item) => item.id === newItem.id);

          if (existingItem) {
            set({
              items: items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            });
          } else {
            set({
              items: [...items, { ...newItem, quantity: 1 }],
            });
          }

          // Update cart count
          const updatedItems = get().items;
          set({
            cartItemCount: updatedItems.reduce(
              (total, item) => total + item.quantity,
              0
            ),
          });
        },

        removeFromCart: (id: string) => {
          set({
            items: get().items.filter((item) => item.id !== id),
          });

          // Update cart count
          const updatedItems = get().items;
          set({
            cartItemCount: updatedItems.reduce(
              (total, item) => total + item.quantity,
              0
            ),
          });
        },

        decreaseQuantity: (id: string) => {
          const items = get().items;
          const existingItem = items.find((item) => item.id === id);

          if (existingItem && existingItem.quantity > 1) {
            set({
              items: items.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
            });
          } else {
            set({
              items: items.filter((item) => item.id !== id),
            });
          }

          // Update cart count
          const updatedItems = get().items;
          set({
            cartItemCount: updatedItems.reduce(
              (total, item) => total + item.quantity,
              0
            ),
          });
        },

        clearCart: () => {
          set({ items: [], cartItemCount: 0 });
        },
      }),
      {
        name: 'cart-storage',
      }
    )
  );
};


