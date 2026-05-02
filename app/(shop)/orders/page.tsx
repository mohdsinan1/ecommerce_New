'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Order } from '@/lib/data';
import { orderApi } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200', confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-orange-50 text-orange-700 border-orange-200', delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setOrders(orderApi.listByUser(user.id));
    setLoading(false);
  }, [user]);

  if (!user) return (<div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center text-center"><div><h2 className="font-playfair text-2xl text-[#1A1A1A] mb-4">Please sign in to view your orders</h2><Link href="/auth/login" className="btn-primary">Sign In</Link></div></div>);

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      <div className="bg-white border-b border-[#F0EAE6]"><div className="max-w-4xl mx-auto px-6 py-12"><p className="section-subheading mb-3">Track</p><h1 className="section-heading">My Orders</h1></div></div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (<div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-24" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24"><Package size={56} className="text-[#E8B4B8] mx-auto mb-4 opacity-60" /><h2 className="font-playfair text-2xl text-[#1A1A1A] mb-2">No orders yet</h2><p className="text-[#8C7B75] text-sm mb-8">Your order history will appear here</p><Link href="/products" className="btn-primary">Start Shopping</Link></div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-6 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#F8F5F2] rounded-full flex items-center justify-center"><Package size={18} className="text-[#E8B4B8]" /></div>
                    <div><p className="font-medium text-[#1A1A1A] text-sm">#{order.id.slice(0, 8).toUpperCase()}</p><p className="text-xs text-[#8C7B75]">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border capitalize ${statusColors[order.status] || ''}`}>{order.status}</span>
                    <span className="font-semibold text-[#1A1A1A]">₹{order.total_amount.toLocaleString('en-IN')}</span>
                    {expandedOrder === order.id ? <ChevronUp size={16} className="text-[#8C7B75]" /> : <ChevronDown size={16} className="text-[#8C7B75]" />}
                  </div>
                </div>
                {expandedOrder === order.id && (
                  <div className="border-t border-[#F0EAE6] px-6 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-[#8C7B75] uppercase tracking-widest mb-3">Items Ordered</h4>
                        <div className="space-y-3">
                          {order.order_items?.map(item => (
                            <div key={item.id} className="flex gap-3">
                              <div className="w-14 h-14 bg-[#F8F5F2] rounded-lg overflow-hidden flex-shrink-0"><img src={item.products?.image_url || ''} alt="" className="w-full h-full object-cover" /></div>
                              <div><p className="font-playfair text-sm font-medium text-[#1A1A1A]">{item.products?.name}</p><p className="text-xs text-[#8C7B75]">Qty: {item.quantity} · ₹{item.price.toLocaleString('en-IN')}</p></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-[#8C7B75] uppercase tracking-widest mb-3">Delivery Details</h4>
                        <p className="text-sm text-[#1A1A1A] font-medium">{order.shipping_name}</p>
                        <p className="text-sm text-[#8C7B75]">{order.shipping_address}</p>
                        <p className="text-sm text-[#8C7B75]">{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                        <p className="text-sm text-[#8C7B75]">{order.shipping_phone}</p>
                        <div className="mt-4 flex gap-2"><span className="text-xs text-[#8C7B75]">Payment:</span><span className="text-xs font-medium text-[#1A1A1A] uppercase">{order.payment_method}</span><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${order.payment_status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>{order.payment_status}</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
