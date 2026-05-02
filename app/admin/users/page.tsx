'use client';

import { useEffect, useState } from 'react';
import { Search, Shield, User } from 'lucide-react';
import { Profile } from '@/lib/data';
import { authApi } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { setUsers(authApi.listUsers()); setLoading(false); }, []);

  function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    authApi.toggleRole(userId);
    setUsers(authApi.listUsers());
    toast({ title: `Role updated to ${newRole}` });
  }

  const filtered = users.filter(u => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.id.includes(search));

  return (
    <div className="p-8">
      <div className="mb-8"><p className="text-xs tracking-widest uppercase text-[#E8B4B8] mb-1">Manage</p><h1 className="font-playfair text-3xl font-semibold text-[#1A1A1A]">Users</h1></div>
      <div className="relative mb-6 max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7B75]" /><input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" /></div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full"><thead><tr className="border-b border-[#F0EAE6]">{['User', 'Location', 'Role', 'Joined', 'Actions'].map(h => <th key={h} className="text-left text-xs font-medium text-[#8C7B75] uppercase tracking-wider px-6 py-4">{h}</th>)}</tr></thead>
            <tbody>
              {loading ? [...Array(6)].map((_, i) => <tr key={i} className="border-b border-[#F0EAE6]">{[...Array(5)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-[#F0EAE6] rounded animate-pulse" /></td>)}</tr>)
              : filtered.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-[#8C7B75] text-sm">No users found</td></tr>
              : filtered.map(user => (
                <tr key={user.id} className="border-b border-[#F0EAE6] hover:bg-[#F8F5F2] transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-[#F0EAE6] rounded-full flex items-center justify-center"><User size={16} className="text-[#8C7B75]" /></div><div><p className="text-sm font-medium text-[#1A1A1A]">{user.full_name || 'No name'}</p><p className="text-xs text-[#8C7B75]">{user.email}</p></div></div></td>
                  <td className="px-6 py-4 text-sm text-[#8C7B75]">{[user.city, user.state].filter(Boolean).join(', ') || '—'}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${user.role === 'admin' ? 'bg-[#FFF0F1] text-[#E8B4B8]' : 'bg-[#F0EAE6] text-[#8C7B75]'}`}>{user.role === 'admin' && <Shield size={10} />}{user.role}</span></td>
                  <td className="px-6 py-4 text-xs text-[#8C7B75]">{new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-6 py-4"><button onClick={() => toggleRole(user.id, user.role)} className="text-xs text-[#E8B4B8] hover:text-[#D4969A] transition-colors font-medium">{user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
