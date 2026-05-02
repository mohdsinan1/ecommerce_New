'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import { Product, Category } from '@/lib/data';
import { productApi, categoryApi } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

type ProductForm = { name: string; slug: string; description: string; price: string; compare_price: string; category_id: string; image_url: string; sizes: string; colors: string; stock: string; is_featured: boolean; is_new_arrival: boolean; is_active: boolean; };
const emptyForm: ProductForm = { name: '', slug: '', description: '', price: '', compare_price: '', category_id: '', image_url: '', sizes: '', colors: '', stock: '0', is_featured: false, is_new_arrival: false, is_active: true };

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { setProducts(productApi.listAll()); setCategories(categoryApi.list()); setLoading(false); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(product: Product) {
    setEditing(product.id);
    setForm({ name: product.name, slug: product.slug, description: product.description, price: String(product.price), compare_price: product.compare_price ? String(product.compare_price) : '', category_id: product.category_id || '', image_url: product.image_url, sizes: (product.sizes || []).join(', '), colors: (product.colors || []).join(', '), stock: String(product.stock), is_featured: product.is_featured, is_new_arrival: product.is_new_arrival, is_active: product.is_active });
    setModalOpen(true);
  }
  function generateSlug(name: string) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

  function handleSave() {
    if (!form.name || !form.price) { toast({ title: 'Name and price are required', variant: 'destructive' }); return; }
    setSaving(true);
    const data = { name: form.name, slug: form.slug || generateSlug(form.name), description: form.description, price: parseFloat(form.price), compare_price: form.compare_price ? parseFloat(form.compare_price) : null, category_id: form.category_id || '', image_url: form.image_url, sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [], colors: form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [], stock: parseInt(form.stock) || 0, is_featured: form.is_featured, is_new_arrival: form.is_new_arrival, is_active: form.is_active };
    if (editing) { productApi.update(editing, data); toast({ title: 'Product updated!' }); }
    else { productApi.create(data); toast({ title: 'Product created!' }); }
    setProducts(productApi.listAll());
    setModalOpen(false); setSaving(false);
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    productApi.delete(id);
    setProducts(productApi.listAll());
    toast({ title: 'Product deleted' });
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.categories?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div><p className="text-xs tracking-widest uppercase text-[#E8B4B8] mb-1">Manage</p><h1 className="font-playfair text-3xl font-semibold text-[#1A1A1A]">Products</h1></div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Product</button>
      </div>
      <div className="relative mb-6 max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7B75]" /><input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" /></div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full"><thead><tr className="border-b border-[#F0EAE6]">{['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h} className="text-left text-xs font-medium text-[#8C7B75] uppercase tracking-wider px-6 py-4">{h}</th>)}</tr></thead>
            <tbody>
              {loading ? [...Array(6)].map((_, i) => <tr key={i} className="border-b border-[#F0EAE6]">{[...Array(6)].map((_, j) => <td key={j} className="px-6 py-4"><div className="h-4 bg-[#F0EAE6] rounded animate-pulse" /></td>)}</tr>)
              : filtered.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-[#8C7B75] text-sm">No products found</td></tr>
              : filtered.map(product => (
                <tr key={product.id} className="border-b border-[#F0EAE6] hover:bg-[#F8F5F2] transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F0EAE6] flex-shrink-0"><img src={product.image_url || ''} alt="" className="w-full h-full object-cover" /></div><div><p className="font-playfair text-sm font-medium text-[#1A1A1A] line-clamp-1">{product.name}</p><div className="flex gap-1 mt-1">{product.is_featured && <span className="text-[10px] bg-[#FFF0F1] text-[#E8B4B8] px-1.5 py-0.5 rounded-full">Featured</span>}{product.is_new_arrival && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full">New</span>}</div></div></div></td>
                  <td className="px-6 py-4 text-sm text-[#8C7B75]">{product.categories?.name || '—'}</td>
                  <td className="px-6 py-4"><p className="text-sm font-semibold text-[#1A1A1A]">₹{product.price.toLocaleString('en-IN')}</p>{product.compare_price && <p className="text-xs text-[#8C7B75] line-through">₹{product.compare_price.toLocaleString('en-IN')}</p>}</td>
                  <td className="px-6 py-4"><span className={`text-xs font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-500'}`}>{product.stock > 0 ? `${product.stock} units` : 'Out of stock'}</span></td>
                  <td className="px-6 py-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${product.is_active ? 'bg-green-50 text-green-600' : 'bg-[#F0EAE6] text-[#8C7B75]'}`}>{product.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => openEdit(product)} className="p-2 text-[#8C7B75] hover:text-[#E8B4B8] hover:bg-[#F8F5F2] rounded-lg transition-all"><Pencil size={14} /></button><button onClick={() => handleDelete(product.id)} className="p-2 text-[#8C7B75] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#F0EAE6]"><h2 className="font-playfair text-xl font-semibold text-[#1A1A1A]">{editing ? 'Edit Product' : 'Add New Product'}</h2><button onClick={() => setModalOpen(false)} className="text-[#8C7B75] hover:text-[#1A1A1A]"><X size={20} /></button></div>
            <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2"><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Product Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: generateSlug(e.target.value) }))} className="input-field" placeholder="Floral Chiffon Dress" /></div>
              <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Slug</label><input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="input-field" placeholder="floral-chiffon-dress" /></div>
              <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Category</label><select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="input-field"><option value="">Select category</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div>
              <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Price (₹) *</label><input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-field" placeholder="2499" /></div>
              <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Compare Price (₹)</label><input type="number" value={form.compare_price} onChange={e => setForm(f => ({ ...f, compare_price: e.target.value }))} className="input-field" placeholder="3499" /></div>
              <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Stock</label><input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input-field" placeholder="50" /></div>
              <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Sizes (comma separated)</label><input value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))} className="input-field" placeholder="XS, S, M, L, XL" /></div>
              <div><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Colors (comma separated)</label><input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} className="input-field" placeholder="Red, Blue, Black" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Image URL</label><input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} className="input-field" placeholder="https://..." /></div>
              <div className="sm:col-span-2"><label className="text-xs font-medium text-[#8C7B75] mb-1 block">Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field min-h-[100px] resize-none" placeholder="Product description..." /></div>
              <div className="sm:col-span-2 flex flex-wrap gap-6">
                {[{ key: 'is_featured', label: 'Featured Product' }, { key: 'is_new_arrival', label: 'New Arrival' }, { key: 'is_active', label: 'Active (visible)' }].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form[key as keyof ProductForm] as boolean} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="text-[#E8B4B8]" /><span className="text-sm text-[#2D2D2D]">{label}</span></label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 px-8 pb-8"><button onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button><button onClick={handleSave} disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
