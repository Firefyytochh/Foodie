import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  cartItemCount: number; // Add this line
}

const useCartStoreInternal = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartItemCount: 0, // Initialize cartItemCount
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          let updatedItems;
          if (existingItem) {
            updatedItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else {
            updatedItems = [...state.items, { ...item, quantity: 1 }];
          }
          return { items: updatedItems, cartItemCount: updatedItems.reduce((total, item) => total + item.quantity, 0) };
        }),
      removeFromCart: (id) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          return { items: updatedItems, cartItemCount: updatedItems.reduce((total, item) => total + item.quantity, 0) };
        }),
      decreaseQuantity: (id) =>
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
              : item
          );
          return { items: updatedItems, cartItemCount: updatedItems.reduce((total, item) => total + item.quantity, 0) };
        }),
      clearCart: () => set({ items: [], cartItemCount: 0 }),
    }),
    {
      name: 'cart-storage', // unique name
    }
  )
);

export const getUseCartStore = () => useCartStoreInternal;


