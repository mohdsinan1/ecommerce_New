'use client';

import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { user } = useAuth();

  const shipping = totalPrice >= 2999 ? 0 : 149;
  const total = totalPrice + shipping;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={56} className="text-[#E8B4B8] mx-auto mb-4 opacity-60" />
          <h2 className="font-playfair text-2xl text-[#1A1A1A] mb-2">Sign in to view your bag</h2>
          <p className="text-[#8C7B75] text-sm mb-6">Create an account to save items and checkout seamlessly</p>
          <Link href="/auth/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      <div className="bg-white border-b border-[#F0EAE6]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="section-subheading mb-3">Review</p>
          <h1 className="section-heading">
            Your Bag {totalItems > 0 && <span className="text-xl text-[#8C7B75] font-normal">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>}
          </h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center px-6">
          <ShoppingBag size={56} className="text-[#E8B4B8] mb-4 opacity-60" />
          <h2 className="font-playfair text-2xl text-[#1A1A1A] mb-2">Your bag is empty</h2>
          <p className="text-[#8C7B75] text-sm mb-8">Discover beautiful pieces to add to your collection</p>
          <Link href="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm flex gap-6">
                  <div className="w-28 h-32 bg-[#F8F5F2] rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.products?.image_url || 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=200'} alt={item.products?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        {item.products?.categories && <p className="text-[10px] tracking-widest uppercase text-[#E8B4B8] mb-1">{item.products.categories.name}</p>}
                        <h3 className="font-playfair font-medium text-[#1A1A1A]">{item.products?.name}</h3>
                        {(item.size || item.color) && <p className="text-xs text-[#8C7B75] mt-1">{item.size && `Size: ${item.size}`}{item.size && item.color && ' · '}{item.color && `Color: ${item.color}`}</p>}
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[#8C7B75] hover:text-red-400 transition-colors p-1"><Trash2 size={16} /></button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#E5DDD8] rounded-xl overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-[#F8F5F2] transition-colors"><Minus size={12} /></button>
                        <span className="px-4 py-2 text-sm font-medium border-x border-[#E5DDD8]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-[#F8F5F2] transition-colors"><Plus size={12} /></button>
                      </div>
                      <p className="font-semibold text-[#1A1A1A]">₹{((item.products?.price || 0) * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm sticky top-28">
                <h3 className="font-playfair text-xl font-semibold text-[#1A1A1A] mb-6">Order Summary</h3>
                <div className="flex gap-2 mb-6">
                  <div className="flex-1 flex items-center border border-[#E5DDD8] rounded-xl px-3 gap-2"><Tag size={14} className="text-[#8C7B75]" /><input type="text" placeholder="Enter coupon code" className="flex-1 py-2.5 text-sm bg-transparent focus:outline-none placeholder:text-[#8C7B75]" /></div>
                  <button className="btn-outline px-4 py-2.5 text-xs">Apply</button>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-[#8C7B75]">Subtotal ({totalItems} items)</span><span className="font-medium text-[#1A1A1A]">₹{totalPrice.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#8C7B75]">Shipping</span><span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium text-[#1A1A1A]'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                  {shipping > 0 && <p className="text-[10px] text-[#8C7B75] bg-[#F8F5F2] rounded-lg px-3 py-2">Add ₹{(2999 - totalPrice).toLocaleString('en-IN')} more to get FREE shipping</p>}
                  <div className="border-t border-[#F0EAE6] pt-3 flex justify-between"><span className="font-semibold text-[#1A1A1A]">Total</span><span className="font-playfair text-xl font-semibold text-[#1A1A1A]">₹{total.toLocaleString('en-IN')}</span></div>
                </div>
                <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">Checkout <ArrowRight size={16} /></Link>
                <Link href="/products" className="block text-center text-sm text-[#8C7B75] hover:text-[#1A1A1A] transition-colors mt-4">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
