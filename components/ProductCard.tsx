'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/lib/data';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setLoading(true);
    await addToCart(product.id, 1);
    toast({ title: 'Added to bag', description: product.name });
    setLoading(false);
  }

  async function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    await toggleWishlist(product.id);
    toast({
      title: inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      description: product.name,
    });
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-[#F8F5F2] overflow-hidden">
          <img
            src={product.image_url || 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new_arrival && (
              <span className="bg-[#E8B4B8] text-white text-xs font-medium px-2.5 py-1 rounded-full">New</span>
            )}
            {discount > 0 && (
              <span className="bg-[#1A1A1A] text-white text-xs font-medium px-2.5 py-1 rounded-full">-{discount}%</span>
            )}
          </div>

          {/* Actions overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
              className="w-full bg-[#1A1A1A]/90 backdrop-blur-sm text-white py-2.5 rounded-xl text-xs font-medium tracking-widest uppercase hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingBag size={14} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              inWishlist
                ? 'bg-[#E8B4B8] text-white'
                : 'bg-white/80 text-[#8C7B75] hover:text-[#E8B4B8]'
            }`}
          >
            <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          {product.categories && (
            <p className="text-[10px] tracking-widest uppercase text-[#E8B4B8] mb-1">{product.categories.name}</p>
          )}
          <h3 className="font-playfair text-[#1A1A1A] font-medium leading-snug line-clamp-2 text-sm">
            {product.name}
          </h3>

          {/* Rating */}
          {product.review_count > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star
                    key={s}
                    size={10}
                    className={s <= Math.round(product.rating) ? 'text-[#C9A96E] fill-[#C9A96E]' : 'text-[#E5DDD8]'}
                  />
                ))}
              </div>
              <span className="text-[10px] text-[#8C7B75]">({product.review_count})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold text-[#1A1A1A]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compare_price && (
              <span className="text-sm text-[#8C7B75] line-through">
                ₹{product.compare_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
