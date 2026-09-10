import { createSlice } from '@reduxjs/toolkit';

const getCartFromStorage = () => {
  try {
    const items = localStorage.getItem('cartItems');
    return items ? JSON.parse(items) : [];
  } catch (error) {
    return [];
  }
};

const initialState = {
  cartItems: getCartFromStorage()
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? { ...x, qty: x.qty + (item.qty || 1) } : x
        );
      } else {
        state.cartItems.push({ ...item, qty: item.qty || 1 });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateQuantity(state, action) {
      const { product, qty } = action.payload;
      state.cartItems = state.cartItems.map((x) =>
        x.product === product ? { ...x, qty: Number(qty) } : x
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart(state, action) {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((x) => x.product !== productId);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart(state) {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  }
});

export const selectCart = (state) => state.cart;
export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
