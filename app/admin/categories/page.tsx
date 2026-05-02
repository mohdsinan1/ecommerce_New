'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import { Category } from '@/lib/data';
import { categoryApi } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

type CatForm = { name: string; slug: string; description: string; image_url: string; sort_order: string; is_active: boolean; };
const emptyForm: CatForm = { name: '', slug: '', description: '', image_url: '', sort_order: '0', is_active: true };

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<CatForm>(emptyForm);
  const [search, setSearch] = useState('');

  useEffect(() => { setCategories(categoryApi.list(false)); setLoading(false); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(cat: Category) {
    setEditing(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, image_url: cat.image_url, sort_order: String(cat.sort_order), is_active: cat.is_active });
    setModalOpen(true);
  }
  function generateSlug(name: string) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

  function handleSave() {
    if (!form.name) { toast({ title: 'Name is required', variant: 'destructive' }); return; }
    const data = { name: form.name, slug: form.slug || generateSlug(form.name), description: form.description, image_url: form.image_url, parent_id: null, sort_order: parseInt(form.sort_order) || 0, is_active: form.is_active };
    if (editing) { categoryApi.update(editing, data); toast({ title: 'Category updated!' }); }
    else { categoryApi.create(data); toast({ title: 'Category created!' }); }
    setCategories(categoryApi.list(false));
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    categoryApi.delete(id);
    setCategories(categoryApi.list(false));
    toast({ title: 'Category deleted' });
  }

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><p className="text-xs tracking-widest uppercase text-[#E8B4B8] mb-1">Manage</p><h1 className="font-playfair text-3xl font-semibold text-[#1A1A1A]">Categories</h1></div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Category</button>
      </div>
      <div className="relative mb-6 max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7B75]" /><input type="text" placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" /></div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full"><thead><tr className="border-b border-[#F0EAE6]">{['Category', 'Slug', 'Order', 'Status', 'Actions'].map(h => <th key={h} className="text-left text-xs font-medium text-[#8C7B75] uppercase tracking-wider px-6 py-4">{h}</th>)}</tr></thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => <tr key={i} className="border-b border-[#F0EAE6]">{[...Array(5)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-[#F0EAE6] rounded animate-pulse" /></td>)}</tr>)
              : filtered.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-[#8C7B75] text-sm">No categories found</td></tr>
              : filtered.map(cat => (
                <tr key={cat.id} className="border-b border-[#F0EAE6] hover:bg-[#F8F5F2] transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F0EAE6] flex-shrink-0"><img src={cat.image_url || ''} alt="" className="w-full h-full object-cover" /></div><div><p className="font-playfair text-sm font-medium text-[#1A1A1A]">{cat.name}</p><p className="text-xs text-[#8C7B75] line-clamp-1">{cat.description}</p></div></div></td>
                  <td className="px-6 py-4 text-sm text-[#8C7B75] font-mono">{cat.slug}</td>
                  <td className="px-6 py-4 text-sm text-[#8C7B75]">{cat.sort_order}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cat.is_active ? 'bg-green-50 text-green-600' : 'bg-[#F0EAE6] text-[#8C7B75]'}`}>{cat.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => openEdit(cat)} className="p-2 text-[#8C7B75] hover:text-[#E8B4B8] hover:bg-[#F8F5F2] rounded-lg transition-all"><Pencil size={14} /></button><button onClick={() => handleDelete(cat.id)} className="p-2 text-[#8C7B75] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#F0EAE6]"><h2 className="font-playfair text-xl font-semibold text-[#1A1A1A]">{editing ? 'Edit Category' : 'Add New Category'}</h2><button onClick={() => setModalOpen(false)} className="text-[#8C7B75] hover:text-[#1A1A1A]"><X size={20} /></button></div>
            <div className="px-8 py-6 space-y-4">
              <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: generateSlug(e.target.value) }))} className="input-field" placeholder="Dresses" /></div>
              <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Slug</label><input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="input-field" placeholder="dresses" /></div>
              <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field min-h-[80px] resize-none" /></div>
              <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Image URL</label><input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="input-field" placeholder="https://..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="input-field" /></div>
                <div className="flex items-end"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} /><span className="text-sm text-[#2D2D2D]">Active</span></label></div>
              </div>
            </div>
            <div className="flex gap-3 px-8 pb-8"><button onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button><button onClick={handleSave} className="btn-primary flex-1">{editing ? 'Update' : 'Create'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
