'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Order } from '@/lib/data';
import { orderApi } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', shipped: 'bg-orange-100 text-orange-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { setOrders(orderApi.listAll()); setLoading(false); }, []);

  function updateStatus(orderId: string, status: string) {
    orderApi.updateStatus(orderId, status);
    setOrders(orderApi.listAll());
    toast({ title: 'Order status updated' });
  }

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.id.includes(search) || o.shipping_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8">
      <div className="mb-8"><p className="text-xs tracking-widest uppercase text-[#E8B4B8] mb-1">Manage</p><h1 className="font-playfair text-3xl font-semibold text-[#1A1A1A]">Orders</h1></div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7B75]" /><input type="text" placeholder="Search by order ID or name..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" /></div>
        <div className="flex gap-2">
          <button onClick={() => setFilterStatus('')} className={`px-4 py-2 rounded-xl text-xs border transition-all ${!filterStatus ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white border-[#E5DDD8] text-[#2D2D2D] hover:border-[#E8B4B8]'}`}>All</button>
          {statuses.map(s => <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-xl text-xs border transition-all capitalize ${filterStatus === s ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white border-[#E5DDD8] text-[#2D2D2D] hover:border-[#E8B4B8]'}`}>{s}</button>)}
        </div>
      </div>
      <div className="space-y-3">
        {loading ? [...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)
        : filtered.length === 0 ? <div className="bg-white rounded-2xl p-12 text-center text-[#8C7B75] text-sm">No orders found</div>
        : filtered.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-4 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                <div><p className="text-xs text-[#8C7B75]">Order</p><p className="text-sm font-mono font-medium text-[#1A1A1A]">#{order.id.slice(0, 8).toUpperCase()}</p></div>
                <div><p className="text-xs text-[#8C7B75]">Customer</p><p className="text-sm font-medium text-[#1A1A1A]">{order.shipping_name}</p></div>
                <div><p className="text-xs text-[#8C7B75]">Total</p><p className="text-sm font-semibold text-[#1A1A1A]">₹{order.total_amount.toLocaleString('en-IN')}</p></div>
                <div><p className="text-xs text-[#8C7B75] mb-1">Status</p><select value={order.status} onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value); }} onClick={e => e.stopPropagation()} className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize border-0 cursor-pointer ${statusColors[order.status] || ''}`}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><p className="text-xs text-[#8C7B75]">Date</p><p className="text-xs text-[#1A1A1A]">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div>
              </div>
              {expandedOrder === order.id ? <ChevronUp size={16} className="text-[#8C7B75] flex-shrink-0" /> : <ChevronDown size={16} className="text-[#8C7B75] flex-shrink-0" />}
            </div>
            {expandedOrder === order.id && (
              <div className="border-t border-[#F0EAE6] px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><h4 className="text-xs font-semibold text-[#8C7B75] uppercase tracking-widest mb-3">Items</h4><div className="space-y-2">{order.order_items?.map(item => (<div key={item.id} className="flex items-center gap-3"><div className="w-12 h-12 bg-[#F8F5F2] rounded-lg overflow-hidden flex-shrink-0"><img src={item.products?.image_url || ''} alt="" className="w-full h-full object-cover" /></div><div><p className="text-sm font-medium text-[#1A1A1A]">{item.products?.name}</p><p className="text-xs text-[#8C7B75]">Qty: {item.quantity} · ₹{item.price.toLocaleString('en-IN')} each</p></div></div>))}</div></div>
                <div><h4 className="text-xs font-semibold text-[#8C7B75] uppercase tracking-widest mb-3">Shipping Details</h4><div className="text-sm text-[#2D2D2D] space-y-1"><p className="font-medium">{order.shipping_name}</p><p className="text-[#8C7B75]">{order.shipping_address}</p><p className="text-[#8C7B75]">{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p><p className="text-[#8C7B75]">{order.shipping_phone}</p></div><div className="mt-4 pt-4 border-t border-[#F0EAE6]"><p className="text-xs text-[#8C7B75]">Payment: <span className="font-medium text-[#1A1A1A] uppercase">{order.payment_method}</span> — <span className={`capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{order.payment_status}</span></p></div></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
