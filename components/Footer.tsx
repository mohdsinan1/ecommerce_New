import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="section-subheading text-[#E8B4B8] mb-3">Stay in touch</p>
          <h3 className="font-playfair text-3xl font-semibold mb-4 text-white">
            Join Our Inner Circle
          </h3>
          <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
            Get exclusive access to new arrivals, style inspiration, and members-only offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-[#E8B4B8] transition-colors text-white"
            />
            <button type="submit" className="btn-blush whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-playfair text-2xl font-semibold text-white tracking-wider">Lumière</span>
            <p className="text-white/50 text-sm mt-4 leading-relaxed">
              Crafting timeless elegance for the modern woman. Where fashion meets artistry.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 bg-white/10 rounded-lg text-white/60 hover:text-[#E8B4B8] hover:bg-white/20 transition-all">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg text-white/60 hover:text-[#E8B4B8] hover:bg-white/20 transition-all">
                <Facebook size={16} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg text-white/60 hover:text-[#E8B4B8] hover:bg-white/20 transition-all">
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-playfair font-semibold text-white mb-5">Shop</h4>
            <ul className="space-y-3">
              {['New Arrivals', 'Dresses', 'Traditional Wear', 'Necklaces', 'Earrings', 'Bangles'].map((item) => (
                <li key={item}>
                  <Link href="/products" className="text-white/50 text-sm hover:text-[#E8B4B8] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-playfair font-semibold text-white mb-5">Help</h4>
            <ul className="space-y-3">
              {[
                { label: 'Size Guide', href: '#' },
                { label: 'Shipping Policy', href: '#' },
                { label: 'Returns & Exchange', href: '#' },
                { label: 'Track Order', href: '/orders' },
                { label: 'Care Instructions', href: '#' },
                { label: 'FAQ', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/50 text-sm hover:text-[#E8B4B8] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair font-semibold text-white mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin size={15} className="mt-0.5 text-[#E8B4B8] flex-shrink-0" />
                <span>42 Fashion Street, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Phone size={15} className="text-[#E8B4B8] flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[#E8B4B8] transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail size={15} className="text-[#E8B4B8] flex-shrink-0" />
                <a href="mailto:hello@lumiere.in" className="hover:text-[#E8B4B8] transition-colors">hello@lumiere.in</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © 2024 Lumière. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 mt-4 md:mt-0">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-white/40 text-xs hover:text-[#E8B4B8] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
