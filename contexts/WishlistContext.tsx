'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { WishlistItem } from '@/lib/data';
import { wishlistApi } from '@/lib/storage';
import { useAuth } from './AuthContext';

type WishlistContextType = {
  items: WishlistItem[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(() => {
    if (user) { setItems(wishlistApi.list(user.id)); }
    else { setItems([]); }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  async function addToWishlist(productId: string) {
    if (!user) return;
    wishlistApi.add(user.id, productId);
    fetchWishlist();
  }

  async function removeFromWishlist(productId: string) {
    if (!user) return;
    wishlistApi.remove(user.id, productId);
    fetchWishlist();
  }

  function isInWishlist(productId: string) {
    return user ? wishlistApi.isIn(user.id, productId) : false;
  }

  async function toggleWishlist(productId: string) {
    if (isInWishlist(productId)) await removeFromWishlist(productId);
    else await addToWishlist(productId);
  }

  return (
    <WishlistContext.Provider value={{ items, loading, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
