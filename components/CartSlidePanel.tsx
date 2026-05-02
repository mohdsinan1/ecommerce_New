'use client';

import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CartSlidePanel() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { user } = useAuth();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Slide Panel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0EAE6]">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-[#E8B4B8]" />
            <h2 className="font-playfair text-xl font-semibold text-[#1A1A1A]">
              Your Bag
            </h2>
            {totalItems > 0 && (
              <span className="bg-[#E8B4B8] text-white text-xs px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-[#8C7B75] hover:text-[#1A1A1A] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-[#E8B4B8] opacity-50" />
              <p className="font-playfair text-xl text-[#1A1A1A]">Sign in to view your bag</p>
              <p className="text-sm text-[#8C7B75]">Create an account to save items and checkout</p>
              <Link href="/auth/login" onClick={closeCart} className="btn-primary">
                Sign In
              </Link>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-[#E8B4B8] opacity-50" />
              <p className="font-playfair text-xl text-[#1A1A1A]">Your bag is empty</p>
              <p className="text-sm text-[#8C7B75]">Add some beautiful pieces to your collection</p>
              <Link href="/products" onClick={closeCart} className="btn-primary">
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-[#F8F5F2] rounded-xl p-3">
                  <div className="w-20 h-24 bg-[#F0EAE6] rounded-lg overflow-hidden flex-shrink-0 relative">
                    <img
                      src={item.products?.image_url || 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=200'}
                      alt={item.products?.name || 'Product'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-playfair text-sm font-medium text-[#1A1A1A] line-clamp-2 leading-snug">
                      {item.products?.name}
                    </h4>
                    {(item.size || item.color) && (
                      <p className="text-xs text-[#8C7B75] mt-1">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' · '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    <p className="text-sm font-semibold text-[#1A1A1A] mt-1">
                      ₹{((item.products?.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#E5DDD8] rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-[#F0EAE6] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-[#F0EAE6] transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-[#8C7B75] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {user && items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#F0EAE6] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8C7B75]">Subtotal</span>
              <span className="font-playfair text-xl font-semibold text-[#1A1A1A]">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-[#8C7B75] text-center">Shipping and taxes calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center block"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-[#8C7B75] hover:text-[#1A1A1A] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
