// ===== TYPES =====
export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_price: number | null;
  category_id: string;
  image_url: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  sold_count: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category;
  product_images?: ProductImage[];
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  sort_order: number;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  body: string;
  is_verified: boolean;
  created_at: string;
  profiles?: { full_name: string };
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  size: string;
  color: string;
  created_at: string;
  products?: Product;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products?: Product;
};

export type Order = {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  shipping_phone: string;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  profiles?: Profile;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  products?: Product;
};

// ===== HELPERS =====
export function genId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ===== SEED CATEGORIES =====
export const seedCategories: Category[] = [
  { id: 'cat-1', name: 'Dresses', slug: 'dresses', description: 'Elegant dresses for every occasion', image_url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500', parent_id: null, sort_order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-2', name: 'Traditional Wear', slug: 'traditional', description: 'Heritage and grace', image_url: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=500', parent_id: null, sort_order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-3', name: 'Necklaces', slug: 'necklaces', description: 'Fine necklaces', image_url: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=500', parent_id: null, sort_order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-4', name: 'Earrings', slug: 'earrings', description: 'Stunning earrings', image_url: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=500', parent_id: null, sort_order: 4, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-5', name: 'Bangles', slug: 'bangles', description: 'Beautiful bangles', image_url: 'https://images.pexels.com/photos/10983783/pexels-photo-10983783.jpeg?auto=compress&cs=tinysrgb&w=500', parent_id: null, sort_order: 5, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-6', name: 'Tops & Blouses', slug: 'tops', description: 'Chic tops and blouses', image_url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500', parent_id: null, sort_order: 6, is_active: true, created_at: '2024-01-01T00:00:00Z' },
];

// ===== SEED PRODUCTS =====
export const seedProducts: Product[] = [
  { id: 'p-1', name: 'Floral Chiffon Maxi Dress', slug: 'floral-chiffon-maxi-dress', description: 'A beautiful floral chiffon maxi dress perfect for summer outings and garden parties. Features a flowing silhouette with delicate floral prints.', price: 3499, compare_price: 4999, category_id: 'cat-1', image_url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['summer', 'floral'], sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Blush Pink', 'Sky Blue', 'Ivory'], stock: 45, sold_count: 120, rating: 4.7, review_count: 28, is_featured: true, is_new_arrival: false, is_active: true, created_at: '2024-06-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z' },
  { id: 'p-2', name: 'Silk Banarasi Saree', slug: 'silk-banarasi-saree', description: 'Handwoven pure silk Banarasi saree with intricate gold zari work. A timeless piece for weddings and festive occasions.', price: 12999, compare_price: 18999, category_id: 'cat-2', image_url: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['wedding', 'silk', 'handwoven'], sizes: ['Free Size'], colors: ['Royal Red', 'Deep Purple', 'Emerald Green'], stock: 15, sold_count: 89, rating: 4.9, review_count: 42, is_featured: true, is_new_arrival: false, is_active: true, created_at: '2024-05-15T00:00:00Z', updated_at: '2024-05-15T00:00:00Z' },
  { id: 'p-3', name: 'Kundan Pearl Necklace Set', slug: 'kundan-pearl-necklace-set', description: 'Exquisite Kundan necklace set adorned with pearls and semi-precious stones. Includes matching earrings.', price: 4999, compare_price: 7499, category_id: 'cat-3', image_url: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['kundan', 'pearls', 'bridal'], sizes: [], colors: ['Gold', 'Rose Gold'], stock: 30, sold_count: 200, rating: 4.8, review_count: 55, is_featured: true, is_new_arrival: true, is_active: true, created_at: '2024-08-01T00:00:00Z', updated_at: '2024-08-01T00:00:00Z' },
  { id: 'p-4', name: 'Embroidered Anarkali Suit', slug: 'embroidered-anarkali-suit', description: 'Stunning embroidered Anarkali suit with dupatta. Perfect for festive celebrations and family gatherings.', price: 5999, compare_price: 8499, category_id: 'cat-2', image_url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['festive', 'anarkali'], sizes: ['S', 'M', 'L', 'XL'], colors: ['Midnight Blue', 'Wine Red', 'Teal'], stock: 25, sold_count: 75, rating: 4.6, review_count: 19, is_featured: true, is_new_arrival: true, is_active: true, created_at: '2024-09-01T00:00:00Z', updated_at: '2024-09-01T00:00:00Z' },
  { id: 'p-5', name: 'Jhumka Earrings — Gold Plated', slug: 'jhumka-earrings-gold-plated', description: 'Traditional gold-plated Jhumka earrings with intricate filigree work and pearl drops. Lightweight and comfortable.', price: 1299, compare_price: 1999, category_id: 'cat-4', image_url: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['jhumka', 'gold'], sizes: [], colors: ['Gold', 'Antique Gold'], stock: 60, sold_count: 310, rating: 4.5, review_count: 67, is_featured: true, is_new_arrival: false, is_active: true, created_at: '2024-04-01T00:00:00Z', updated_at: '2024-04-01T00:00:00Z' },
  { id: 'p-6', name: 'Velvet A-Line Dress', slug: 'velvet-a-line-dress', description: 'Luxurious velvet A-line dress with a flattering silhouette. Perfect for evening events and cocktail parties.', price: 4299, compare_price: null, category_id: 'cat-1', image_url: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['velvet', 'evening'], sizes: ['XS', 'S', 'M', 'L'], colors: ['Black', 'Burgundy', 'Navy'], stock: 20, sold_count: 55, rating: 4.4, review_count: 12, is_featured: true, is_new_arrival: true, is_active: true, created_at: '2024-10-01T00:00:00Z', updated_at: '2024-10-01T00:00:00Z' },
  { id: 'p-7', name: 'Gold Bangle Set (Set of 4)', slug: 'gold-bangle-set-4', description: 'Set of 4 beautifully crafted gold-plated bangles with stone setting. Stackable design for a modern traditional look.', price: 2499, compare_price: 3499, category_id: 'cat-5', image_url: 'https://images.pexels.com/photos/10983783/pexels-photo-10983783.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['bangles', 'gold', 'set'], sizes: ['2.4', '2.6', '2.8'], colors: ['Gold'], stock: 40, sold_count: 145, rating: 4.3, review_count: 33, is_featured: true, is_new_arrival: false, is_active: true, created_at: '2024-03-01T00:00:00Z', updated_at: '2024-03-01T00:00:00Z' },
  { id: 'p-8', name: 'Chikankari Cotton Kurti', slug: 'chikankari-cotton-kurti', description: 'Hand-embroidered Chikankari cotton kurti from Lucknow. Breathable fabric ideal for summer styling.', price: 1899, compare_price: 2499, category_id: 'cat-6', image_url: 'https://images.pexels.com/photos/2466756/pexels-photo-2466756.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['cotton', 'chikankari', 'summer'], sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Peach', 'Mint'], stock: 50, sold_count: 230, rating: 4.6, review_count: 48, is_featured: false, is_new_arrival: true, is_active: true, created_at: '2024-10-15T00:00:00Z', updated_at: '2024-10-15T00:00:00Z' },
  { id: 'p-9', name: 'Diamond-Cut Chandbali Earrings', slug: 'diamond-cut-chandbali-earrings', description: 'Statement Chandbali earrings with diamond-cut detailing and meenakari work. Perfect for bridal look.', price: 3299, compare_price: 4999, category_id: 'cat-4', image_url: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['chandbali', 'bridal'], sizes: [], colors: ['Gold & Green', 'Gold & Red'], stock: 18, sold_count: 92, rating: 4.7, review_count: 21, is_featured: false, is_new_arrival: true, is_active: true, created_at: '2024-11-01T00:00:00Z', updated_at: '2024-11-01T00:00:00Z' },
  { id: 'p-10', name: 'Layered Temple Necklace', slug: 'layered-temple-necklace', description: 'Magnificent layered temple necklace inspired by South Indian temple jewellery. A showstopper piece.', price: 6999, compare_price: 9999, category_id: 'cat-3', image_url: 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['temple', 'south-indian', 'bridal'], sizes: [], colors: ['Gold'], stock: 10, sold_count: 48, rating: 4.9, review_count: 15, is_featured: false, is_new_arrival: false, is_active: true, created_at: '2024-07-01T00:00:00Z', updated_at: '2024-07-01T00:00:00Z' },
  { id: 'p-11', name: 'Printed Wrap Dress', slug: 'printed-wrap-dress', description: 'Trendy printed wrap dress with a flattering V-neckline. Versatile piece that transitions from day to night.', price: 2799, compare_price: 3999, category_id: 'cat-1', image_url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['wrap', 'printed'], sizes: ['XS', 'S', 'M', 'L'], colors: ['Floral Blue', 'Abstract Red'], stock: 35, sold_count: 68, rating: 4.3, review_count: 14, is_featured: false, is_new_arrival: false, is_active: true, created_at: '2024-06-15T00:00:00Z', updated_at: '2024-06-15T00:00:00Z' },
  { id: 'p-12', name: 'Silk Thread Bangles (Set of 12)', slug: 'silk-thread-bangles-set-12', description: 'Colourful silk thread bangles with stone embellishments. Set of 12 bangles in assorted colours.', price: 899, compare_price: 1299, category_id: 'cat-5', image_url: 'https://images.pexels.com/photos/10983783/pexels-photo-10983783.jpeg?auto=compress&cs=tinysrgb&w=600', tags: ['silk-thread', 'colourful'], sizes: ['2.4', '2.6', '2.8'], colors: ['Multi-colour'], stock: 80, sold_count: 420, rating: 4.2, review_count: 88, is_featured: false, is_new_arrival: false, is_active: true, created_at: '2024-02-01T00:00:00Z', updated_at: '2024-02-01T00:00:00Z' },
];

// ===== SEED REVIEWS =====
export const seedReviews: Review[] = [
  { id: 'r-1', product_id: 'p-1', user_id: 'seed-user-1', rating: 5, title: 'Absolutely gorgeous!', body: 'The fabric quality is amazing and it fits perfectly. Received so many compliments.', is_verified: true, created_at: '2024-07-15T00:00:00Z', profiles: { full_name: 'Priya S.' } },
  { id: 'r-2', product_id: 'p-2', user_id: 'seed-user-2', rating: 5, title: 'Worth every penny', body: 'The zari work is breathtaking. This is a true heirloom piece. Packaging was elegant too.', is_verified: true, created_at: '2024-06-20T00:00:00Z', profiles: { full_name: 'Ananya R.' } },
  { id: 'r-3', product_id: 'p-3', user_id: 'seed-user-3', rating: 5, title: 'Stunning necklace set', body: 'Received so many compliments at my sister\'s wedding. The pearls are beautiful.', is_verified: true, created_at: '2024-09-10T00:00:00Z', profiles: { full_name: 'Deepika M.' } },
  { id: 'r-4', product_id: 'p-5', user_id: 'seed-user-1', rating: 4, title: 'Beautiful earrings', body: 'Very pretty and lightweight. Perfect for daily wear. Slightly different shade from the picture.', is_verified: true, created_at: '2024-05-01T00:00:00Z', profiles: { full_name: 'Priya S.' } },
  { id: 'r-5', product_id: 'p-8', user_id: 'seed-user-2', rating: 5, title: 'Perfect summer kurti', body: 'The Chikankari work is so delicate and beautiful. Very comfortable fabric.', is_verified: true, created_at: '2024-11-05T00:00:00Z', profiles: { full_name: 'Ananya R.' } },
];

// ===== SEED ADMIN USER =====
export const seedAdmin: Profile = {
  id: 'admin-001',
  email: 'admin@lumiere.in',
  full_name: 'Admin User',
  avatar_url: '',
  phone: '+91 98765 43210',
  address: '42 Fashion Street',
  city: 'Mumbai',
  state: 'Maharashtra',
  zip: '400001',
  country: 'India',
  role: 'admin',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};
