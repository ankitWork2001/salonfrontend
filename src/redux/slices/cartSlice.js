import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    visible: false,
    isCartScreenFocused: false, // New property
  },
  reducers: {
    setCart(state, action) {
      state.items = action.payload;
    },
    showCartPopup(state) {
      state.visible = true;
    },
    hideCartPopup(state) {
      state.visible = false;
    },
    // New reducers to control global visibility
    setCartScreenFocused(state, action) {
      state.isCartScreenFocused = action.payload;
    },
    clearCartState(state) {
      state.items = [];
      state.visible = false;
    }
  }
});

export const {
  setCart,
  showCartPopup,
  hideCartPopup,
  setCartScreenFocused, // Export this
  clearCartState
} = cartSlice.actions;

export default cartSlice.reducer;
