'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CartItem } from '@/lib/data';
import { cartApi } from '@/lib/storage';
import { useAuth } from './AuthContext';

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCart = useCallback(() => {
    if (user) { setItems(cartApi.list(user.id)); }
    else { setItems([]); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  async function addToCart(productId: string, quantity = 1, size = '', color = '') {
    if (!user) return;
    cartApi.add(user.id, productId, quantity, size, color);
    fetchCart();
    setIsOpen(true);
  }

  async function removeFromCart(itemId: string) {
    cartApi.remove(itemId);
    fetchCart();
  }

  async function updateQuantity(itemId: string, quantity: number) {
    cartApi.updateQty(itemId, quantity);
    fetchCart();
  }

  async function clearCart() {
    if (!user) return;
    cartApi.clear(user.id);
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.products?.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, loading, isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
