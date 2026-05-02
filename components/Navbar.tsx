'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const navLinks = [
  {
    label: 'Collections',
    href: '/products',
    children: [
      { label: 'All Products', href: '/products' },
      { label: 'New Arrivals', href: '/products?filter=new' },
      { label: 'Featured', href: '/products?filter=featured' },
    ],
  },
  {
    label: 'Clothing',
    href: '/products?category=clothing',
    children: [
      { label: 'Dresses', href: '/products?category=dresses' },
      { label: 'Traditional Wear', href: '/products?category=traditional' },
      { label: 'Tops & Blouses', href: '/products?category=tops' },
    ],
  },
  {
    label: 'Jewellery',
    href: '/products?category=jewellery',
    children: [
      { label: 'Necklaces', href: '/products?category=necklaces' },
      { label: 'Earrings', href: '/products?category=earrings' },
      { label: 'Bangles', href: '/products?category=bangles' },
    ],
  },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const { totalItems, openCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-[#F8F5F2]/90 backdrop-blur-sm'}`}>
        {/* Top announcement bar */}
        <div className="bg-[#1A1A1A] text-white text-center py-2 px-2 text-[10px] sm:text-xs tracking-widest uppercase truncate sm:whitespace-normal">
          Free shipping on orders above ₹2999 &nbsp;|&nbsp; New arrivals every Friday
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              className="md:hidden text-[#1A1A1A] p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-1 md:flex-none text-center md:text-left">
              <span className="font-playfair text-2xl font-semibold text-[#1A1A1A] tracking-wider">
                Lumière
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 mx-8">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-sm text-[#2D2D2D] hover:text-[#E8B4B8] transition-colors font-medium tracking-wide"
                  >
                    {link.label}
                    {link.children && <ChevronDown size={14} className={`transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />}
                  </Link>
                  {link.children && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 bg-white shadow-xl rounded-xl py-3 min-w-[180px] border border-[#F0EAE6] mt-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-5 py-2.5 text-sm text-[#2D2D2D] hover:text-[#E8B4B8] hover:bg-[#F8F5F2] transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-[#1A1A1A] hover:text-[#E8B4B8] transition-colors"
              >
                <Search size={20} />
              </button>

              <Link href="/wishlist" className="p-2 text-[#1A1A1A] hover:text-[#E8B4B8] transition-colors relative">
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E8B4B8] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <button
                onClick={openCart}
                className="p-2 text-[#1A1A1A] hover:text-[#E8B4B8] transition-colors relative"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#1A1A1A] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 text-[#1A1A1A] hover:text-[#E8B4B8] transition-colors"
                >
                  <User size={20} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full bg-white shadow-xl rounded-xl py-3 min-w-[180px] border border-[#F0EAE6] mt-2">
                    {user ? (
                      <>
                        <div className="px-5 py-2 border-b border-[#F0EAE6] mb-2">
                          <p className="text-xs text-[#8C7B75]">Signed in as</p>
                          <p className="text-sm font-medium text-[#1A1A1A] truncate">{profile?.full_name || user.email}</p>
                        </div>
                        <Link href="/account" className="block px-5 py-2 text-sm text-[#2D2D2D] hover:text-[#E8B4B8] hover:bg-[#F8F5F2]" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                        <Link href="/orders" className="block px-5 py-2 text-sm text-[#2D2D2D] hover:text-[#E8B4B8] hover:bg-[#F8F5F2]" onClick={() => setUserMenuOpen(false)}>My Orders</Link>
                        <Link href="/wishlist" className="block px-5 py-2 text-sm text-[#2D2D2D] hover:text-[#E8B4B8] hover:bg-[#F8F5F2]" onClick={() => setUserMenuOpen(false)}>Wishlist</Link>
                        {profile?.role === 'admin' && (
                          <Link href="/admin" className="block px-5 py-2 text-sm text-[#E8B4B8] hover:bg-[#F8F5F2] font-medium" onClick={() => setUserMenuOpen(false)}>Admin Panel</Link>
                        )}
                        <div className="border-t border-[#F0EAE6] mt-2 pt-2">
                          <button
                            onClick={() => { signOut(); setUserMenuOpen(false); }}
                            className="block w-full text-left px-5 py-2 text-sm text-red-500 hover:bg-[#F8F5F2]"
                          >
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" className="block px-5 py-2.5 text-sm text-[#2D2D2D] hover:text-[#E8B4B8] hover:bg-[#F8F5F2]" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                        <Link href="/auth/register" className="block px-5 py-2.5 text-sm text-[#2D2D2D] hover:text-[#E8B4B8] hover:bg-[#F8F5F2]" onClick={() => setUserMenuOpen(false)}>Create Account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-[#F0EAE6] bg-white/95 backdrop-blur-sm px-4 py-4">
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for dresses, jewellery..."
                className="input-field flex-1"
                autoFocus
              />
              <button type="submit" className="btn-primary px-6 py-2.5">
                Search
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-28 px-6 md:hidden overflow-y-auto">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block py-3 text-lg font-playfair text-[#1A1A1A] border-b border-[#F0EAE6]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="pl-4 mt-1 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block py-2 text-sm text-[#8C7B75] hover:text-[#E8B4B8]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-6 space-y-3">
              {user ? (
                <>
                  <Link href="/account" className="block btn-outline w-full text-center" onClick={() => setMobileOpen(false)}>My Account</Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="w-full text-red-500 border border-red-200 py-3 rounded-full text-sm">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-primary block w-full text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link href="/auth/register" className="btn-outline block w-full text-center" onClick={() => setMobileOpen(false)}>Create Account</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
