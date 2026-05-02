'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, MapPin, Save, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function AccountPage() {
  const router = useRouter();
  const { user, profile, signOut, refreshProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', city: '', state: '', zip: '', country: 'India' });

  useEffect(() => {
    if (profile) {
      setForm({ full_name: profile.full_name || '', phone: profile.phone || '', address: profile.address || '', city: profile.city || '', state: profile.state || '', zip: profile.zip || '', country: profile.country || 'India' });
    }
  }, [profile]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login');
  }, [user, authLoading, router]);

  if (!user) return (
    <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center">
      <div className="text-[#8C7B75] font-playfair text-lg">Loading...</div>
    </div>
  );

  async function handleSave() {
    setSaving(true);
    authApi.updateProfile(user!.id, form);
    await refreshProfile();
    toast({ title: 'Profile updated!' });
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      <div className="bg-white border-b border-[#F0EAE6]"><div className="max-w-4xl mx-auto px-6 py-12"><p className="section-subheading mb-3">Manage</p><h1 className="section-heading">My Account</h1></div></div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-20 h-20 bg-[#F0EAE6] rounded-full flex items-center justify-center mx-auto mb-4"><User size={32} className="text-[#E8B4B8]" /></div>
              <h3 className="font-playfair text-lg font-semibold text-[#1A1A1A]">{profile?.full_name || 'Customer'}</h3>
              <p className="text-xs text-[#8C7B75] mt-1">{profile?.email}</p>
              {profile?.role === 'admin' && <span className="inline-block mt-2 text-[10px] bg-[#FFF0F1] text-[#E8B4B8] px-2 py-0.5 rounded-full font-medium">Admin</span>}
            </div>
            <Link href="/orders" className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"><Package size={18} className="text-[#E8B4B8]" /><span className="text-sm text-[#1A1A1A]">My Orders</span></Link>
            <Link href="/wishlist" className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"><Heart size={18} className="text-[#E8B4B8]" /><span className="text-sm text-[#1A1A1A]">Wishlist</span></Link>
            {profile?.role === 'admin' && <Link href="/admin" className="flex items-center gap-3 bg-[#1A1A1A] rounded-2xl p-4 shadow-sm"><MapPin size={18} className="text-[#E8B4B8]" /><span className="text-sm text-white">Admin Panel</span></Link>}
            <button onClick={async () => { await signOut(); router.push('/'); }} className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow w-full text-left"><LogOut size={18} className="text-red-400" /><span className="text-sm text-red-400">Sign Out</span></button>
          </div>
          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="font-playfair text-xl font-semibold text-[#1A1A1A] mb-6">Profile Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2"><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Full Name</label><input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="input-field" /></div>
                <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="+91 98765 43210" /></div>
                <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Country</label><input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="input-field" /></div>
                <div className="sm:col-span-2"><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Address</label><input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="input-field" placeholder="123 Main Street" /></div>
                <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">City</label><input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input-field" /></div>
                <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">State</label><input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="input-field" /></div>
                <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">PIN Code</label><input value={form.zip} onChange={e => setForm(f => ({ ...f, zip: e.target.value }))} className="input-field" /></div>
              </div>
              <button onClick={handleSave} disabled={saving} className="btn-primary mt-8 flex items-center gap-2 disabled:opacity-50"><Save size={16} />{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
