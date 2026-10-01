import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('shopcircle_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find(item => item.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      localStorage.setItem('shopcircle_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number; delta: number }>) => {
      const { productId, delta } = action.payload;
      const existing = state.items.find(item => item.product.id === productId);
      if (existing) {
        existing.quantity += delta;
        if (existing.quantity <= 0) {
          state.items = state.items.filter(item => item.product.id !== productId);
        }
      }
      localStorage.setItem('shopcircle_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      localStorage.setItem('shopcircle_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('shopcircle_cart');
    },
    toggleCartOpen: (state, action: PayloadAction<boolean | undefined>) => {
      state.isOpen = action.payload !== undefined ? action.payload : !state.isOpen;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, toggleCartOpen } = cartSlice.actions;
export default cartSlice.reducer;
