'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderApi } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Check, CreditCard, Truck } from 'lucide-react';

type ShippingForm = { full_name: string; phone: string; address: string; city: string; state: string; zip: string; country: string; };

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirm'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  const shipping = totalPrice >= 2999 ? 0 : 149;
  const total = totalPrice + shipping;

  const [form, setForm] = useState<ShippingForm>({
    full_name: profile?.full_name || '', phone: profile?.phone || '', address: profile?.address || '',
    city: profile?.city || '', state: profile?.state || '', zip: profile?.zip || '', country: profile?.country || 'India',
  });

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function placeOrder() {
    if (!user || items.length === 0) return;
    setLoading(true);
    const order = orderApi.create(
      { user_id: user.id, status: 'confirmed', total_amount: total, shipping_name: form.full_name, shipping_address: form.address, shipping_city: form.city, shipping_state: form.state, shipping_zip: form.zip, shipping_country: form.country, shipping_phone: form.phone, payment_method: paymentMethod, payment_status: paymentMethod === 'cod' ? 'pending' : 'paid', notes: '' },
      items.map(item => ({ product_id: item.product_id, quantity: item.quantity, price: item.products?.price || 0, size: item.size, color: item.color }))
    );
    await clearCart();
    setOrderId(order.id);
    setStep('confirm');
    setLoading(false);
  }

  if (!user) return (<div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center"><div className="text-center"><h2 className="font-playfair text-2xl text-[#1A1A1A] mb-4">Please sign in to checkout</h2><Link href="/auth/login" className="btn-primary">Sign In</Link></div></div>);

  if (step === 'confirm') return (
    <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-xl">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={36} className="text-green-500" /></div>
        <h2 className="font-playfair text-3xl font-semibold text-[#1A1A1A] mb-3">Order Confirmed!</h2>
        <p className="text-[#8C7B75] text-sm mb-2">Thank you for shopping with Lumière</p>
        <p className="text-[10px] text-[#8C7B75] font-mono bg-[#F8F5F2] rounded-lg px-3 py-2 mt-4 mb-8">Order #{orderId.slice(0, 8).toUpperCase()}</p>
        <div className="space-y-3"><Link href="/orders" className="btn-primary block w-full">Track My Order</Link><Link href="/products" className="btn-outline block w-full">Continue Shopping</Link></div>
      </div>
    </div>
  );

  if (items.length === 0) return (<div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center text-center"><div><h2 className="font-playfair text-2xl text-[#1A1A1A] mb-4">Your bag is empty</h2><Link href="/products" className="btn-primary">Shop Now</Link></div></div>);

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      <div className="bg-white border-b border-[#F0EAE6]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="section-subheading mb-2">Secure</p><h1 className="section-heading">Checkout</h1>
          <div className="flex items-center justify-center gap-8 mt-8">
            {['shipping', 'payment'].map((s, i) => (
              <div key={s} className={`flex items-center gap-2 text-sm font-medium ${step === s ? 'text-[#E8B4B8]' : 'text-[#8C7B75]'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step === s ? 'border-[#E8B4B8] bg-[#E8B4B8] text-white' : (i === 0 && step === 'payment') ? 'border-green-400 bg-green-400 text-white' : 'border-[#E5DDD8] text-[#8C7B75]'}`}>
                  {i === 0 && step === 'payment' ? <Check size={12} /> : i + 1}
                </div>
                <span className="capitalize hidden sm:block">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6"><Truck size={20} className="text-[#E8B4B8]" /><h2 className="font-playfair text-xl font-semibold text-[#1A1A1A]">Shipping Address</h2></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2"><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Full Name *</label><input name="full_name" value={form.full_name} onChange={handleInput} className="input-field" placeholder="Priya Sharma" required /></div>
                  <div className="sm:col-span-2"><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Phone Number *</label><input name="phone" value={form.phone} onChange={handleInput} className="input-field" placeholder="+91 98765 43210" required /></div>
                  <div className="sm:col-span-2"><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Street Address *</label><input name="address" value={form.address} onChange={handleInput} className="input-field" placeholder="123 Main Street, Apartment 4B" required /></div>
                  <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">City *</label><input name="city" value={form.city} onChange={handleInput} className="input-field" placeholder="Mumbai" required /></div>
                  <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">State *</label><input name="state" value={form.state} onChange={handleInput} className="input-field" placeholder="Maharashtra" required /></div>
                  <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">PIN Code *</label><input name="zip" value={form.zip} onChange={handleInput} className="input-field" placeholder="400001" required /></div>
                  <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Country</label><input name="country" value={form.country} onChange={handleInput} className="input-field" /></div>
                </div>
                <button onClick={() => { if (!form.full_name || !form.phone || !form.address || !form.city || !form.state || !form.zip) { toast({ title: 'Please fill all required fields', variant: 'destructive' }); return; } setStep('payment'); }} className="btn-primary mt-6 w-full">Continue to Payment</button>
              </div>
            )}
            {step === 'payment' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6"><CreditCard size={20} className="text-[#E8B4B8]" /><h2 className="font-playfair text-xl font-semibold text-[#1A1A1A]">Payment Method</h2></div>
                <div className="space-y-3 mb-8">
                  {[{ value: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives' }, { value: 'upi', label: 'UPI', sub: 'Pay via GPay, PhonePe, Paytm, etc.' }, { value: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' }].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === opt.value ? 'border-[#E8B4B8] bg-[#F8F5F2]' : 'border-[#F0EAE6] hover:border-[#E8B4B8]/50'}`}>
                      <input type="radio" value={opt.value} checked={paymentMethod === opt.value} onChange={e => setPaymentMethod(e.target.value)} className="text-[#E8B4B8]" />
                      <div><p className="font-medium text-[#1A1A1A] text-sm">{opt.label}</p><p className="text-xs text-[#8C7B75]">{opt.sub}</p></div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('shipping')} className="btn-outline flex-1">Back</button>
                  <button onClick={placeOrder} disabled={loading} className="btn-primary flex-1 disabled:opacity-50">{loading ? 'Placing Order...' : `Place Order · ₹${total.toLocaleString('en-IN')}`}</button>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-28">
              <h3 className="font-playfair text-lg font-semibold text-[#1A1A1A] mb-5">Order Summary</h3>
              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-16 bg-[#F8F5F2] rounded-lg overflow-hidden flex-shrink-0"><img src={item.products?.image_url || ''} alt="" className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0"><p className="font-playfair text-xs font-medium text-[#1A1A1A] line-clamp-2">{item.products?.name}</p><p className="text-xs text-[#8C7B75]">Qty: {item.quantity}</p><p className="text-xs font-semibold text-[#1A1A1A]">₹{((item.products?.price || 0) * item.quantity).toLocaleString('en-IN')}</p></div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#F0EAE6] pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-[#8C7B75]">Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#8C7B75]">Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t border-[#F0EAE6]"><span>Total</span><span className="font-playfair text-lg">₹{total.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
