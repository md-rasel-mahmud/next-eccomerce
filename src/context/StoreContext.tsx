"use client";
import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { CartItem, Product } from "../types/types";

// Define the store state
interface StoreState {
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

// Define action types
type Action =
  | { type: "ADD_TO_CART"; product: Product; quantity?: number }
  | { type: "REMOVE_FROM_CART"; product: string }
  | { type: "UPDATE_QUANTITY"; product: string; quantity: number }
  | { type: "CLEAR_CART" };

// Initial state
const initialState: StoreState = {
  cart: [],
  subtotal: 0,
  shipping: 0,
  total: 0,
};

// Create the store context
const StoreContext = createContext<{
  state: StoreState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Calculate totals after cart changes
const calculateTotals = (
  cart: CartItem[]
): { subtotal: number; shipping: number; total: number } => {
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.product.salePrice || item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 10 : 0; // Fixed shipping fee
  const total = subtotal + shipping;

  return { subtotal, shipping, total };
};

// Reducer function to handle state changes
const storeReducer = (state: StoreState, action: Action): StoreState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItemIndex = state.cart.findIndex(
        (item) => item.productId === action.product._id
      );

      let updatedCart: CartItem[];

      if (existingItemIndex !== -1) {
        // If item exists in cart, update quantity
        updatedCart = state.cart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.quantity || 1) }
            : item
        );
      } else {
        // Add new item to cart
        updatedCart = [
          ...state.cart,
          {
            productId: action.product._id,
            product: action.product,
            quantity: action.quantity || 1,
          },
        ];
      }

      const totals = calculateTotals(updatedCart);
      return { ...state, cart: updatedCart, ...totals };
    }

    case "REMOVE_FROM_CART": {
      const updatedCart = state.cart.filter(
        (item) => item.productId !== action.productId
      );
      const totals = calculateTotals(updatedCart);
      return { ...state, cart: updatedCart, ...totals };
    }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        const updatedCart = state.cart.filter(
          (item) => item.productId !== action.productId
        );
        const totals = calculateTotals(updatedCart);
        return { ...state, cart: updatedCart, ...totals };
      }

      const updatedCart = state.cart.map((item) =>
        item.productId === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );

      const totals = calculateTotals(updatedCart);
      return { ...state, cart: updatedCart, ...totals };
    }

    case "CLEAR_CART":
      return { ...initialState };

    default:
      return state;
  }
};

// Store provider component
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Persist cart to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state.cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [state.cart]);

  // Load cart from localStorage on initial load
  React.useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as CartItem[];

        // Initialize state with stored cart and calculate totals
        if (parsedCart.length > 0) {
          dispatch({ type: "CLEAR_CART" });
          parsedCart.forEach((item) => {
            dispatch({
              type: "ADD_TO_CART",
              product: item.product,
              quantity: item.quantity,
            });
          });
        }
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the store context
export const useStore = () => useContext(StoreContext);
