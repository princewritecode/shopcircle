import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/product';

interface WishlistState {
  items: Product[];
  isOpen: boolean;
}

const loadWishlistFromStorage = (): Product[] => {
  try {
    const saved = localStorage.getItem('shopcircle_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
  isOpen: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const index = state.items.findIndex(item => item.id === product.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
      localStorage.setItem('shopcircle_wishlist', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('shopcircle_wishlist', JSON.stringify(state.items));
    },
    toggleWishlistOpen: (state, action: PayloadAction<boolean | undefined>) => {
      state.isOpen = action.payload !== undefined ? action.payload : !state.isOpen;
    },
  },
});

export const { toggleWishlist, removeFromWishlist, toggleWishlistOpen } = wishlistSlice.actions;
export default wishlistSlice.reducer;
