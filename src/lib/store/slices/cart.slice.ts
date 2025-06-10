import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "@/types/types";

interface CartState {
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  shippingId: string;
  total: number;
}

// 🟡 Utility: Load from localStorage
const loadCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// 🟡 Utility: Save to localStorage
const saveCart = (cart: CartItem[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (err) {
    console.error("Failed to save cart:", err);
  }
};

// 🟢 Utility: Calculate totals
const calculateTotals = (cart: CartItem[]) => {
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
};

const initialCart = loadCart();
const initialTotals = calculateTotals(initialCart);

const initialState: CartState = {
  cart: initialCart,
  shippingId: "",
  ...initialTotals,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>
    ) => {
      const { product, quantity = 1 } = action.payload;

      const existing = state.cart.find(
        (item) => item.productId === product._id
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.cart.push({
          productId: product._id,
          product,
          quantity,
        });
      }

      const totals = calculateTotals(state.cart);
      Object.assign(state, totals);
      saveCart(state.cart); // 🔴 persist to localStorage
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
      const totals = calculateTotals(state.cart);
      Object.assign(state, totals);
      saveCart(state.cart);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.cart.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) item.quantity = action.payload.quantity;
      const totals = calculateTotals(state.cart);
      Object.assign(state, totals);
      saveCart(state.cart);
    },

    clearCart: (state) => {
      state.cart = [];
      const totals = calculateTotals(state.cart);
      Object.assign(state, totals);
      saveCart(state.cart);
    },

    updateShipping: (
      state,
      action: PayloadAction<{ shippingId: string; shippingCharge: number }>
    ) => {
      state.shippingId = action.payload.shippingId;
      state.shipping = action.payload.shippingCharge;
      state.total = state.subtotal + state.shipping;
      saveCart(state.cart); // 🔴 persist to localStorage
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  updateShipping,
} = cartSlice.actions;
export default cartSlice.reducer;
