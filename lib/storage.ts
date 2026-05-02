'use client';

import {
  Profile, Category, Product, Review, CartItem, WishlistItem, Order, OrderItem,
  genId, seedCategories, seedProducts, seedReviews, seedAdmin,
} from './data';

// ===== INIT =====
function getStore<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}
function setStore<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}
function getObj<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}
function setObj<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function initStore() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('_lumiere_init')) {
    setStore('categories', seedCategories);
    setStore('products', seedProducts);
    setStore('reviews', seedReviews);
    setStore('users', [seedAdmin]);
    setStore('orders', []);
    setStore('order_items', []);
    setStore('cart_items', []);
    setStore('wishlist_items', []);
    localStorage.setItem('_lumiere_init', '1');
  }
}

// ===== CATEGORIES =====
export const categoryApi = {
  list: (activeOnly = true): Category[] => {
    const all = getStore<Category>('categories');
    return activeOnly ? all.filter(c => c.is_active).sort((a, b) => a.sort_order - b.sort_order) : all.sort((a, b) => a.sort_order - b.sort_order);
  },
  get: (id: string): Category | undefined => getStore<Category>('categories').find(c => c.id === id),
  getBySlug: (slug: string): Category | undefined => getStore<Category>('categories').find(c => c.slug === slug),
  create: (cat: Omit<Category, 'id' | 'created_at'>): Category => {
    const all = getStore<Category>('categories');
    const newCat: Category = { ...cat, id: genId(), created_at: new Date().toISOString() };
    setStore('categories', [...all, newCat]);
    return newCat;
  },
  update: (id: string, updates: Partial<Category>): Category | null => {
    const all = getStore<Category>('categories');
    const idx = all.findIndex(c => c.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates };
    setStore('categories', all);
    return all[idx];
  },
  delete: (id: string) => {
    setStore('categories', getStore<Category>('categories').filter(c => c.id !== id));
  },
};

// ===== PRODUCTS =====
function attachCategory(p: Product): Product {
  const cat = categoryApi.get(p.category_id);
  return { ...p, categories: cat };
}

export const productApi = {
  list: (opts?: { activeOnly?: boolean; categorySlug?: string; featured?: boolean; newArrival?: boolean; search?: string; minPrice?: number; maxPrice?: number; sort?: string; limit?: number }): Product[] => {
    let all = getStore<Product>('products').map(attachCategory);
    const o = opts || {};
    if (o.activeOnly !== false) all = all.filter(p => p.is_active);
    if (o.categorySlug) {
      const cat = categoryApi.getBySlug(o.categorySlug);
      if (cat) all = all.filter(p => p.category_id === cat.id);
    }
    if (o.featured) all = all.filter(p => p.is_featured);
    if (o.newArrival) all = all.filter(p => p.is_new_arrival);
    if (o.search) { const q = o.search.toLowerCase(); all = all.filter(p => p.name.toLowerCase().includes(q)); }
    if (o.minPrice !== undefined) all = all.filter(p => p.price >= o.minPrice!);
    if (o.maxPrice !== undefined) all = all.filter(p => p.price <= o.maxPrice!);
    if (o.sort === 'price-asc') all.sort((a, b) => a.price - b.price);
    else if (o.sort === 'price-desc') all.sort((a, b) => b.price - a.price);
    else if (o.sort === 'popular') all.sort((a, b) => b.sold_count - a.sold_count);
    else if (o.sort === 'rating') all.sort((a, b) => b.rating - a.rating);
    else all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (o.limit) all = all.slice(0, o.limit);
    return all;
  },
  listAll: (): Product[] => getStore<Product>('products').map(attachCategory),
  getBySlug: (slug: string): Product | null => {
    const p = getStore<Product>('products').find(p => p.slug === slug && p.is_active);
    return p ? attachCategory(p) : null;
  },
  getById: (id: string): Product | null => {
    const p = getStore<Product>('products').find(p => p.id === id);
    return p ? attachCategory(p) : null;
  },
  create: (data: Partial<Product>): Product => {
    const all = getStore<Product>('products');
    const now = new Date().toISOString();
    const prod: Product = {
      id: genId(), name: data.name || '', slug: data.slug || '', description: data.description || '',
      price: data.price || 0, compare_price: data.compare_price ?? null, category_id: data.category_id || '',
      image_url: data.image_url || '', tags: data.tags || [], sizes: data.sizes || [], colors: data.colors || [],
      stock: data.stock || 0, sold_count: 0, rating: 0, review_count: 0,
      is_featured: data.is_featured || false, is_new_arrival: data.is_new_arrival || false, is_active: data.is_active !== false,
      created_at: now, updated_at: now,
    };
    setStore('products', [...all, prod]);
    return attachCategory(prod);
  },
  update: (id: string, updates: Partial<Product>): Product | null => {
    const all = getStore<Product>('products');
    const idx = all.findIndex(p => p.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...updates, updated_at: new Date().toISOString() };
    setStore('products', all);
    return attachCategory(all[idx]);
  },
  delete: (id: string) => {
    setStore('products', getStore<Product>('products').filter(p => p.id !== id));
  },
};

// ===== REVIEWS =====
export const reviewApi = {
  listByProduct: (productId: string): Review[] =>
    getStore<Review>('reviews').filter(r => r.product_id === productId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  create: (data: { product_id: string; user_id: string; rating: number; title: string; body: string; userName: string }): Review => {
    const all = getStore<Review>('reviews');
    const review: Review = {
      id: genId(), product_id: data.product_id, user_id: data.user_id,
      rating: data.rating, title: data.title, body: data.body,
      is_verified: true, created_at: new Date().toISOString(),
      profiles: { full_name: data.userName },
    };
    setStore('reviews', [...all, review]);
    // Update product rating
    const reviews = [...all.filter(r => r.product_id === data.product_id), review];
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    productApi.update(data.product_id, { rating: Math.round(avgRating * 10) / 10, review_count: reviews.length });
    return review;
  },
};

// ===== AUTH =====
export const authApi = {
  currentUser: (): Profile | null => getObj<Profile>('current_user'),
  signUp: (email: string, password: string, fullName: string): { user: Profile | null; error: string | null } => {
    const users = getStore<Profile & { password: string }>('users');
    if (users.find(u => u.email === email)) return { user: null, error: 'Email already exists' };
    const now = new Date().toISOString();
    const newUser: Profile & { password: string } = {
      id: genId(), email, password, full_name: fullName, avatar_url: '', phone: '',
      address: '', city: '', state: '', zip: '', country: 'India', role: 'user',
      created_at: now, updated_at: now,
    };
    setStore('users', [...users, newUser]);
    const { password: _, ...profile } = newUser;
    setObj('current_user', profile);
    return { user: profile, error: null };
  },
  signIn: (email: string, password: string): { user: Profile | null; error: string | null } => {
    const users = getStore<Profile & { password: string }>('users');
    const found = users.find(u => u.email === email);
    if (!found) return { user: null, error: 'Invalid email or password' };
    if (found.password && found.password !== password) return { user: null, error: 'Invalid email or password' };
    const { password: _, ...profile } = found;
    setObj('current_user', profile);
    return { user: profile, error: null };
  },
  signOut: () => { localStorage.removeItem('current_user'); },
  updateProfile: (userId: string, updates: Partial<Profile>): Profile | null => {
    const users = getStore<Profile & { password?: string }>('users');
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates, updated_at: new Date().toISOString() };
    setStore('users', users);
    const { password: _, ...profile } = users[idx];
    setObj('current_user', profile as Profile);
    return profile as Profile;
  },
  listUsers: (): Profile[] => getStore<Profile & { password?: string }>('users').map(({ password, ...rest }: any) => rest),
  toggleRole: (userId: string): Profile | null => {
    const users = getStore<Profile & { password?: string }>('users');
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) return null;
    users[idx].role = users[idx].role === 'admin' ? 'user' : 'admin';
    setStore('users', users);
    return users[idx] as Profile;
  },
};

// ===== CART =====
export const cartApi = {
  list: (userId: string): CartItem[] => {
    return getStore<CartItem>('cart_items')
      .filter(c => c.user_id === userId)
      .map(item => ({ ...item, products: productApi.getById(item.product_id) || undefined }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  add: (userId: string, productId: string, quantity = 1, size = '', color = ''): CartItem => {
    const all = getStore<CartItem>('cart_items');
    const existing = all.find(c => c.user_id === userId && c.product_id === productId && c.size === size && c.color === color);
    if (existing) {
      existing.quantity += quantity;
      setStore('cart_items', all);
      return { ...existing, products: productApi.getById(productId) || undefined };
    }
    const item: CartItem = { id: genId(), user_id: userId, product_id: productId, quantity, size, color, created_at: new Date().toISOString() };
    setStore('cart_items', [...all, item]);
    return { ...item, products: productApi.getById(productId) || undefined };
  },
  updateQty: (itemId: string, quantity: number) => {
    const all = getStore<CartItem>('cart_items');
    if (quantity <= 0) { setStore('cart_items', all.filter(c => c.id !== itemId)); return; }
    const idx = all.findIndex(c => c.id === itemId);
    if (idx !== -1) { all[idx].quantity = quantity; setStore('cart_items', all); }
  },
  remove: (itemId: string) => {
    setStore('cart_items', getStore<CartItem>('cart_items').filter(c => c.id !== itemId));
  },
  clear: (userId: string) => {
    setStore('cart_items', getStore<CartItem>('cart_items').filter(c => c.user_id !== userId));
  },
};

// ===== WISHLIST =====
export const wishlistApi = {
  list: (userId: string): WishlistItem[] =>
    getStore<WishlistItem>('wishlist_items')
      .filter(w => w.user_id === userId)
      .map(item => ({ ...item, products: productApi.getById(item.product_id) || undefined })),
  add: (userId: string, productId: string): WishlistItem => {
    const all = getStore<WishlistItem>('wishlist_items');
    const item: WishlistItem = { id: genId(), user_id: userId, product_id: productId, created_at: new Date().toISOString() };
    setStore('wishlist_items', [...all, item]);
    return { ...item, products: productApi.getById(productId) || undefined };
  },
  remove: (userId: string, productId: string) => {
    setStore('wishlist_items', getStore<WishlistItem>('wishlist_items').filter(w => !(w.user_id === userId && w.product_id === productId)));
  },
  isIn: (userId: string, productId: string): boolean =>
    getStore<WishlistItem>('wishlist_items').some(w => w.user_id === userId && w.product_id === productId),
};

// ===== ORDERS =====
export const orderApi = {
  listByUser: (userId: string): Order[] => {
    const orders = getStore<Order>('orders').filter(o => o.user_id === userId);
    const allItems = getStore<OrderItem>('order_items');
    return orders.map(o => ({
      ...o,
      order_items: allItems.filter(i => i.order_id === o.id).map(i => ({ ...i, products: productApi.getById(i.product_id) || undefined })),
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  listAll: (): Order[] => {
    const orders = getStore<Order>('orders');
    const allItems = getStore<OrderItem>('order_items');
    const users = getStore<Profile>('users');
    return orders.map(o => ({
      ...o,
      profiles: users.find(u => u.id === o.user_id),
      order_items: allItems.filter(i => i.order_id === o.id).map(i => ({ ...i, products: productApi.getById(i.product_id) || undefined })),
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  create: (data: Omit<Order, 'id' | 'created_at' | 'updated_at'>, items: { product_id: string; quantity: number; price: number; size: string; color: string }[]): Order => {
    const now = new Date().toISOString();
    const order: Order = { ...data, id: genId(), created_at: now, updated_at: now };
    const orderItems: OrderItem[] = items.map(i => ({ id: genId(), order_id: order.id, ...i }));
    setStore('orders', [...getStore<Order>('orders'), order]);
    setStore('order_items', [...getStore<OrderItem>('order_items'), ...orderItems]);
    return { ...order, order_items: orderItems };
  },
  updateStatus: (orderId: string, status: string) => {
    const all = getStore<Order>('orders');
    const idx = all.findIndex(o => o.id === orderId);
    if (idx !== -1) { all[idx].status = status as any; all[idx].updated_at = new Date().toISOString(); setStore('orders', all); }
  },
  stats: () => {
    const products = getStore<Product>('products');
    const orders = getStore<Order>('orders');
    const users = getStore<Profile>('users');
    const revenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total_amount, 0);
    return { products: products.length, orders: orders.length, users: users.length, revenue };
  },
};
