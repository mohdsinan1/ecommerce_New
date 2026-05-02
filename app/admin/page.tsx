'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { orderApi } from '@/lib/storage';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = orderApi.stats();
    setStats(s);
    setRecentOrders(orderApi.listAll().slice(0, 5));
    setLoading(false);
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-50 text-blue-600', link: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-[#FFF0F1] text-[#E8B4B8]', link: '/admin/orders' },
    { label: 'Total Users', value: stats.users, icon: Users, color: 'bg-green-50 text-green-600', link: '/admin/users' },
    { label: 'Revenue Earned', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'bg-yellow-50 text-yellow-600', link: '/admin/orders' },
  ];

  const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', shipped: 'bg-orange-100 text-orange-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

  return (
    <div className="p-8">
      <div className="mb-8"><p className="text-xs tracking-widest uppercase text-[#E8B4B8] mb-1">Overview</p><h1 className="font-playfair text-3xl font-semibold text-[#1A1A1A]">Dashboard</h1></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map(({ label, value, icon: Icon, color, link }) => (
          <Link href={link} key={label} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4"><div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><Icon size={22} /></div><ArrowUpRight size={16} className="text-[#8C7B75] group-hover:text-[#E8B4B8] transition-colors" /></div>
            <p className="font-playfair text-2xl font-semibold text-[#1A1A1A]">{loading ? <span className="block h-7 w-20 bg-[#F0EAE6] rounded animate-pulse" /> : value}</p>
            <p className="text-sm text-[#8C7B75] mt-1">{label}</p>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0EAE6]"><h2 className="font-playfair text-lg font-semibold text-[#1A1A1A]">Recent Orders</h2><Link href="/admin/orders" className="text-xs text-[#E8B4B8] hover:text-[#D4969A] transition-colors">View all</Link></div>
        <div className="overflow-x-auto">
          <table className="w-full"><thead><tr className="border-b border-[#F0EAE6]">{['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => <th key={h} className="text-left text-xs font-medium text-[#8C7B75] uppercase tracking-wider px-6 py-4">{h}</th>)}</tr></thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => <tr key={i} className="border-b border-[#F0EAE6]">{[...Array(5)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-[#F0EAE6] rounded animate-pulse" /></td>)}</tr>)
              : recentOrders.length === 0 ? <tr><td colSpan={5} className="px-6 py-10 text-center text-[#8C7B75] text-sm">No orders yet</td></tr>
              : recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-[#F0EAE6] hover:bg-[#F8F5F2] transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-[#1A1A1A]">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-[#2D2D2D]">{order.shipping_name || 'Customer'}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#1A1A1A]">₹{order.total_amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || ''}`}>{order.status}</span></td>
                  <td className="px-6 py-4 text-xs text-[#8C7B75]">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
