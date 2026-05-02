'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { items, loading } = useWishlist();
  const { user } = useAuth();

  if (!user) return (
    <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center text-center px-6">
      <div>
        <Heart size={56} className="text-[#E8B4B8] mx-auto mb-4 opacity-60" />
        <h2 className="font-playfair text-2xl text-[#1A1A1A] mb-2">Sign in to view your wishlist</h2>
        <p className="text-[#8C7B75] text-sm mb-6">Save your favourite pieces and never lose track</p>
        <Link href="/auth/login" className="btn-primary">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      <div className="bg-white border-b border-[#F0EAE6]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="section-subheading mb-3">Saved</p>
          <h1 className="section-heading">
            My Wishlist {items.length > 0 && <span className="text-xl text-[#8C7B75] font-normal">({items.length})</span>}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <div className="aspect-[3/4] bg-[#F0EAE6] animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#F0EAE6] rounded animate-pulse" />
                  <div className="h-4 bg-[#F0EAE6] rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={56} className="text-[#E8B4B8] mx-auto mb-4 opacity-60" />
            <h2 className="font-playfair text-2xl text-[#1A1A1A] mb-2">Your wishlist is empty</h2>
            <p className="text-[#8C7B75] text-sm mb-8">Click the heart icon on any product to save it here</p>
            <Link href="/products" className="btn-primary">Explore Collections</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map(item => item.products && (
              <ProductCard key={item.id} product={item.products} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
