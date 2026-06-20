'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

export interface CartItem {
  cartId: string;
  productId: string;
  productSlug: string;
  productName: string;
  productEmoji: string;
  format: string;
  quantity: number;
  paper: string;
  finish: string;
  unitPrice: number;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; cartId: string }
  | { type: 'UPDATE_QTY'; cartId: string; quantity: number; unitPrice: number; totalPrice: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'HYDRATE'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items };
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.format === action.payload.format &&
          i.paper === action.payload.paper &&
          i.finish === action.payload.finish
      );
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.cartId === existing.cartId
              ? { ...i, quantity: action.payload.quantity, totalPrice: action.payload.totalPrice, unitPrice: action.payload.unitPrice }
              : i
          ),
        };
      }
      return { ...state, isOpen: true, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.cartId !== action.cartId) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartId === action.cartId
            ? { ...i, quantity: action.quantity, unitPrice: action.unitPrice, totalPrice: action.totalPrice }
            : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'cartId'>) => void;
  removeItem: (cartId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('karibprint_cart');
      if (stored) {
        dispatch({ type: 'HYDRATE', items: JSON.parse(stored) });
      }
    } catch {}
    // Intentional one-time sync from localStorage on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('karibprint_cart', JSON.stringify(state.items));
    }
  }, [state.items, hydrated]);

  const totalItems = state.items.length;
  const totalPrice = state.items.reduce((sum, i) => sum + i.totalPrice, 0);

  const addItem = (item: Omit<CartItem, 'cartId'>) => {
    const cartId = `${item.productId}-${item.format}-${item.paper}-${item.finish}-${Date.now()}`;
    dispatch({ type: 'ADD_ITEM', payload: { ...item, cartId } });
  };

  const removeItem = (cartId: string) => dispatch({ type: 'REMOVE_ITEM', cartId });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  const openCart = () => dispatch({ type: 'OPEN' });
  const closeCart = () => dispatch({ type: 'CLOSE' });

  return (
    <CartContext.Provider value={{ items: state.items, isOpen: state.isOpen, totalItems, totalPrice, addItem, removeItem, clearCart, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
