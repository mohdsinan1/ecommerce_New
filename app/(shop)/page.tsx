'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { Product } from '@/lib/data';
import { productApi } from '@/lib/storage';
import ProductCard from '@/components/ProductCard';

const heroImages = [
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

const categoryShowcase = [
  { name: 'Dresses', slug: 'dresses', image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500', description: 'Effortless elegance', size: 'large' },
  { name: 'Jewellery', slug: 'necklaces', image: 'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=500', description: 'Fine ornaments', size: 'small' },
  { name: 'Traditional Wear', slug: 'traditional', image: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=500', description: 'Heritage & grace', size: 'small' },
  { name: 'New Arrivals', slug: '', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500', description: 'Fresh collections', size: 'medium', filter: 'new' },
];

const testimonials = [
  { name: 'Priya S.', text: 'Absolutely stunning quality! The saree I ordered was exactly as pictured and the packaging was so elegant.', rating: 5, location: 'Mumbai' },
  { name: 'Ananya R.', text: 'The jewellery collection is breathtaking. I\'ve received so many compliments on my necklace.', rating: 5, location: 'Bangalore' },
  { name: 'Deepika M.', text: 'Fast delivery, beautiful products. Lumière has become my go-to for special occasions.', rating: 5, location: 'Delhi' },
];

const instagramPosts = [
  'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/2466756/pexels-photo-2466756.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=300',
];

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setFeaturedProducts(productApi.list({ featured: true, limit: 8 }));
    setNewArrivals(productApi.list({ newArrival: true, limit: 4 }));
    setLoading(false);
  }, []);

  return (
    <div className="bg-[#F8F5F2]">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        {heroImages.map((img, i) => (
          <div key={img} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>
        ))}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-xl">
              <p className="text-[#E8B4B8] text-xs tracking-[0.3em] uppercase mb-4 animate-fade-in">New Collection 2024</p>
              <h1 className="font-playfair text-5xl md:text-7xl font-semibold text-white leading-tight mb-6">
                Wear Your<br /><span className="italic text-[#E8B4B8]">Story</span>
              </h1>
              <p className="text-white/80 text-base md:text-lg mb-10 leading-relaxed max-w-sm">
                Discover timeless pieces crafted for the modern woman who values elegance and authenticity.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products" className="btn-blush">Shop Now</Link>
                <Link href="/products?filter=new" className="btn-outline border-white text-white hover:bg-white hover:text-[#1A1A1A]">New Arrivals</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroIndex(i)} className={`h-1 rounded-full transition-all duration-300 ${i === heroIndex ? 'w-8 bg-[#E8B4B8]' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
        <div className="absolute right-6 bottom-8 flex flex-col items-center gap-2">
          <span className="text-white/40 text-[10px] tracking-widest uppercase rotate-90 origin-center translate-y-4">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/40" />
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-white border-y border-[#F0EAE6]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'On orders above ₹2999' },
              { icon: RotateCcw, label: 'Easy Returns', sub: '15-day return policy' },
              { icon: Shield, label: 'Secure Payment', sub: '100% safe & encrypted' },
              { icon: Star, label: 'Premium Quality', sub: 'Handcrafted with love' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="p-3 bg-[#F8F5F2] rounded-full"><Icon size={20} className="text-[#E8B4B8]" /></div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{label}</p>
                  <p className="text-xs text-[#8C7B75]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="section-subheading mb-3">Browse by</p>
          <h2 className="section-heading">Our Collections</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-auto md:h-[500px]">
          <Link href={`/products?category=${categoryShowcase[0].slug}`} className="col-span-2 row-span-2 relative overflow-hidden rounded-2xl group cursor-pointer">
            <img src={categoryShowcase[0].image} alt={categoryShowcase[0].name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-white/70 text-xs tracking-widest uppercase mb-1">{categoryShowcase[0].description}</p>
              <h3 className="font-playfair text-3xl font-semibold text-white">{categoryShowcase[0].name}</h3>
              <span className="inline-flex items-center gap-2 text-[#E8B4B8] text-sm mt-2 group-hover:gap-3 transition-all">Shop now <ArrowRight size={14} /></span>
            </div>
          </Link>
          {categoryShowcase.slice(1).map((cat) => (
            <Link key={cat.name} href={cat.filter ? `/products?filter=${cat.filter}` : `/products?category=${cat.slug}`} className="relative overflow-hidden rounded-2xl group cursor-pointer">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white/80 text-[10px] tracking-widest uppercase mb-0.5">{cat.description}</p>
                <h3 className="font-playfair text-base md:text-lg font-semibold text-white leading-tight">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="section-subheading mb-3">Handpicked for you</p>
            <h2 className="section-heading">Featured Pieces</h2>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (<div key={i} className="bg-[#F8F5F2] rounded-2xl aspect-[3/4] animate-pulse" />))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map(product => (<ProductCard key={product.id} product={product} />))}
            </div>
          ) : (
            <div className="text-center py-16 text-[#8C7B75]"><p>Products coming soon. Check back shortly!</p></div>
          )}
          <div className="text-center mt-12">
            <Link href="/products" className="btn-outline inline-flex items-center gap-2">View All Products <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="relative py-32 overflow-hidden">
        <img src="https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1A1A1A]/70" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#E8B4B8] text-xs tracking-[0.3em] uppercase mb-4">Limited time</p>
          <h2 className="font-playfair text-4xl md:text-6xl font-semibold text-white mb-4">Up to 40% Off<br /><span className="italic text-[#E8B4B8]">Jewellery Collection</span></h2>
          <p className="text-white/70 mb-10 text-lg">Handcrafted pieces at exceptional prices. Limited stock available.</p>
          <Link href="/products?category=necklaces" className="btn-blush inline-flex items-center gap-2">Shop Sale <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="section-subheading mb-3">Just landed</p>
            <h2 className="section-heading">New Arrivals</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map(product => (<ProductCard key={product.id} product={product} />))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#E8B4B8] text-xs tracking-widest uppercase mb-3">What they say</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-white">Loved by Thousands</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex mb-4">{[...Array(t.rating)].map((_, i) => (<Star key={i} size={14} className="text-[#C9A96E] fill-[#C9A96E]" />))}</div>
                <p className="text-white/70 text-sm leading-relaxed mb-6 italic">&quot;{t.text}&quot;</p>
                <div>
                  <p className="font-playfair font-semibold text-white">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="section-subheading mb-3">Follow us</p>
          <h2 className="section-heading">@lumiere.fashion</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {instagramPosts.map((img, i) => (
            <a key={i} href="#" className="relative aspect-square overflow-hidden rounded-xl group">
              <img src={img} alt="Instagram" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-[#E8B4B8]/0 group-hover:bg-[#E8B4B8]/30 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium tracking-widest uppercase">View</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
