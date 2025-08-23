import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  decreaseQuantity: (id: string) => void
  clearCart: () => void // Add this line
  cartItemCount: number
}

export const getUseCartStore = () => {
  return create<CartStore>()(
    persist(
      (set, get) => ({
        items: [],
        addToCart: (item) => {
          const currentItems = get().items
          const existingItem = currentItems.find(cartItem => cartItem.id === item.id)
          
          if (existingItem) {
            set({
              items: currentItems.map(cartItem =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            })
          } else {
            set({
              items: [...currentItems, { ...item, quantity: 1 }],
            })
          }
        },
        removeFromCart: (id) => {
          set({
            items: get().items.filter(item => item.id !== id),
          })
        },
        decreaseQuantity: (id) => {
          const currentItems = get().items
          const existingItem = currentItems.find(item => item.id === id)
          
          if (existingItem && existingItem.quantity > 1) {
            set({
              items: currentItems.map(item =>
                item.id === id
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
            })
          } else {
            set({
              items: currentItems.filter(item => item.id !== id),
            })
          }
        },
        clearCart: () => set({ items: [] }), // Add this function
        get cartItemCount() {
          return get().items.reduce((total, item) => total + item.quantity, 0)
        },
      }),
      {
        name: 'cart-storage',
      }
    )
  )
}