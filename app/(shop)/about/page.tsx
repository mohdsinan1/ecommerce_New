'use client';

import Link from 'next/link';
import { ArrowRight, Gem, Palette, Heart, Leaf } from 'lucide-react';

const values = [
  { icon: Gem, title: 'Craftsmanship', description: 'Every piece is carefully crafted by skilled artisans who pour their heart into creating timeless beauty.' },
  { icon: Palette, title: 'Design Excellence', description: 'We blend traditional aesthetics with contemporary design to create pieces that are both classic and modern.' },
  { icon: Heart, title: 'Customer Love', description: 'Our community of 50,000+ women inspires us daily. Your happiness is our greatest achievement.' },
  { icon: Leaf, title: 'Sustainability', description: 'We are committed to ethical sourcing and sustainable practices for a better tomorrow.' },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F8F5F2]">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <img src="https://images.pexels.com/photos/2466756/pexels-photo-2466756.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="About Lumière" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1A1A1A]/60" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#E8B4B8] text-xs tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h1 className="font-playfair text-5xl md:text-6xl font-semibold text-white leading-tight mb-6">Where Elegance Meets <span className="italic text-[#E8B4B8]">Everyday</span></h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-lg mx-auto">Born from a passion for timeless beauty, Lumière celebrates the modern Indian woman with curated fashion and fine jewellery.</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#E8B4B8] mb-4">The Beginning</p>
            <h2 className="font-playfair text-4xl font-semibold text-[#1A1A1A] mb-6 leading-tight">A vision rooted in heritage, designed for today</h2>
            <div className="text-[#8C7B75] text-sm leading-relaxed space-y-4">
              <p>Lumière was founded in 2020 with a simple vision: to make luxury fashion accessible to every woman. We believe that elegance is not a privilege — it&apos;s a right.</p>
              <p>From handwoven Banarasi sarees to contemporary chiffon dresses, from Kundan necklaces to minimalist gold bangles — every piece in our collection tells a story of craftsmanship, tradition, and modern design.</p>
              <p>Today, we serve over 50,000 women across India who share our belief that true beauty lies in authenticity and attention to detail.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Fashion" className="rounded-2xl object-cover h-64 w-full" />
            <img src="https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Jewellery" className="rounded-2xl object-cover h-64 w-full mt-12" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="section-subheading mb-3">What we stand for</p>
            <h2 className="section-heading">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center group">
                <div className="w-16 h-16 bg-[#F8F5F2] rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-[#E8B4B8] transition-colors duration-300">
                  <Icon size={28} className="text-[#E8B4B8] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-playfair text-lg font-semibold text-[#1A1A1A] mb-3">{title}</h3>
                <p className="text-sm text-[#8C7B75] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-[#1A1A1A]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[{ num: '50K+', label: 'Happy Customers' }, { num: '2,000+', label: 'Products' }, { num: '100+', label: 'Artisan Partners' }, { num: '4.8★', label: 'Average Rating' }].map(({ num, label }) => (
              <div key={label}><p className="font-playfair text-4xl font-semibold text-[#E8B4B8] mb-2">{num}</p><p className="text-sm text-white/60">{label}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <p className="section-subheading mb-3">Ready to explore?</p>
        <h2 className="font-playfair text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-6 leading-tight">Begin Your Style Journey</h2>
        <p className="text-[#8C7B75] text-sm max-w-md mx-auto mb-10">Discover handcrafted pieces that celebrate your unique story. Every purchase supports artisan communities across India.</p>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2">Shop the Collection <ArrowRight size={16} /></Link>
      </section>
    </div>
  );
}
