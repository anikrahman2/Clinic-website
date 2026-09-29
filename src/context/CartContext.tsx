import React, { createContext, useContext, useState, useEffect } from 'react';
import type { DiagnosticTest } from '../types/index.js';
import { useToast } from './ToastContext.js';

interface CartContextType {
  cart: DiagnosticTest[];
  addToCart: (test: DiagnosticTest) => void;
  removeFromCart: (testId: string) => void;
  clearCart: () => void;
  isInCart: (testId: string) => boolean;
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'jharna_diagnostic_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<DiagnosticTest[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (test: DiagnosticTest) => {
    if (cart.some((item) => item._id === test._id)) {
      showToast(`${test.name} is already in your test basket`, 'info');
      setIsCartOpen(true);
      return;
    }
    setCart((prev) => [...prev, test]);
    showToast(`Added ${test.name} to test basket`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (testId: string) => {
    setCart((prev) => prev.filter((item) => item._id !== testId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (testId: string) => {
    return cart.some((item) => item._id === testId);
  };

  const totalCount = cart.length;
  const subtotal = cart.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
