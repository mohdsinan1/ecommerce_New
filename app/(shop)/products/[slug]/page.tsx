'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Star, Truck, RotateCcw, Shield, ChevronLeft, ChevronRight, Minus, Plus, Send } from 'lucide-react';
import Link from 'next/link';
import { Product, Review } from '@/lib/data';
import { productApi, reviewApi } from '@/lib/storage';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const allImages = product ? [product.image_url].filter(Boolean) : [];

  useEffect(() => {
    const prod = productApi.getBySlug(params.slug as string);
    if (!prod) { setLoading(false); return; }
    setProduct(prod);
    if (prod.sizes?.length > 0) setSelectedSize(prod.sizes[0]);
    if (prod.colors?.length > 0) setSelectedColor(prod.colors[0]);
    const related = productApi.list({ categorySlug: prod.categories?.slug, limit: 4 }).filter(p => p.id !== prod.id);
    setRelatedProducts(related);
    setReviews(reviewApi.listByProduct(prod.id));
    setLoading(false);
  }, [params.slug]);

  async function handleAddToCart() {
    if (!user) { router.push('/auth/login'); return; }
    if (!product) return;
    setAddingToCart(true);
    await addToCart(product.id, quantity, selectedSize, selectedColor);
    toast({ title: 'Added to bag!', description: `${quantity}x ${product.name}` });
    setAddingToCart(false);
  }

  async function handleSubmitReview() {
    if (!user || !product) return;
    setSubmittingReview(true);
    reviewApi.create({ product_id: product.id, user_id: user.id, rating: reviewRating, title: reviewTitle, body: reviewBody, userName: profile?.full_name || 'Customer' });
    setReviews(reviewApi.listByProduct(product.id));
    setProduct(productApi.getBySlug(params.slug as string));
    setReviewTitle(''); setReviewBody(''); setReviewRating(5);
    toast({ title: 'Review submitted!' });
    setSubmittingReview(false);
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-[#F0EAE6] rounded-2xl animate-pulse" />
        <div className="space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-6 bg-[#F0EAE6] rounded animate-pulse" style={{ width: `${80 - i * 10}%` }} />)}</div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-24">
      <h2 className="font-playfair text-2xl text-[#1A1A1A] mb-4">Product not found</h2>
      <Link href="/products" className="btn-outline">Back to Shop</Link>
    </div>
  );

  const inWishlist = isInWishlist(product.id);
  const discount = product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;

  return (
    <div className="bg-[#F8F5F2]">
      <div className="bg-white border-b border-[#F0EAE6]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-[#8C7B75]">
            <Link href="/" className="hover:text-[#E8B4B8]">Home</Link><span>/</span>
            <Link href="/products" className="hover:text-[#E8B4B8]">Products</Link>
            {product.categories && (<><span>/</span><Link href={`/products?category=${product.categories.slug}`} className="hover:text-[#E8B4B8]">{product.categories.name}</Link></>)}
            <span>/</span><span className="text-[#1A1A1A] line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
              <img src={allImages[currentImage] || 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=600'} alt={product.name} className="w-full h-full object-cover" />
              {product.is_new_arrival && <span className="absolute top-4 left-4 bg-[#E8B4B8] text-white text-xs font-medium px-3 py-1 rounded-full">New Arrival</span>}
              {discount > 0 && <span className="absolute top-4 right-4 bg-[#1A1A1A] text-white text-xs font-medium px-3 py-1 rounded-full">{discount}% Off</span>}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {product.categories && <Link href={`/products?category=${product.categories.slug}`} className="text-xs tracking-widest uppercase text-[#E8B4B8] hover:text-[#D4969A] transition-colors">{product.categories.name}</Link>}
            <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-[#1A1A1A] leading-tight">{product.name}</h1>

            {product.review_count > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'text-[#C9A96E] fill-[#C9A96E]' : 'text-[#E5DDD8]'} />)}</div>
                <span className="text-sm text-[#8C7B75]">{product.rating.toFixed(1)} ({product.review_count} reviews)</span>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="font-playfair text-3xl font-semibold text-[#1A1A1A]">₹{product.price.toLocaleString('en-IN')}</span>
              {product.compare_price && <span className="text-lg text-[#8C7B75] line-through">₹{product.compare_price.toLocaleString('en-IN')}</span>}
              {discount > 0 && <span className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">Save {discount}%</span>}
            </div>

            <p className="text-[#8C7B75] text-sm leading-relaxed">{product.description}</p>

            {product.sizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3"><h4 className="text-sm font-semibold text-[#1A1A1A]">Size</h4><button className="text-xs text-[#E8B4B8] underline">Size Guide</button></div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-xl text-sm border transition-all ${selectedSize === size ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[#E5DDD8] text-[#2D2D2D] hover:border-[#E8B4B8]'}`}>{size}</button>)}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Color: <span className="font-normal text-[#8C7B75]">{selectedColor}</span></h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 rounded-xl text-sm border transition-all ${selectedColor === color ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-[#E5DDD8] text-[#2D2D2D] hover:border-[#E8B4B8]'}`}>{color}</button>)}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Quantity</h4>
              <div className="flex items-center border border-[#E5DDD8] rounded-xl w-fit overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-[#F8F5F2] transition-colors"><Minus size={14} /></button>
                <span className="px-6 py-3 text-sm font-medium border-x border-[#E5DDD8]">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-4 py-3 hover:bg-[#F8F5F2] transition-colors"><Plus size={14} /></button>
              </div>
              <p className="text-xs text-[#8C7B75] mt-2">{product.stock} in stock</p>
            </div>

            <div className="flex gap-4 pt-2">
              <button onClick={handleAddToCart} disabled={addingToCart || product.stock === 0} className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingBag size={16} />{product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding...' : 'Add to Bag'}
              </button>
              <button onClick={async () => { if (!user) { router.push('/auth/login'); return; } await toggleWishlist(product.id); toast({ title: inWishlist ? 'Removed from wishlist' : 'Added to wishlist' }); }}
                className={`p-4 rounded-full border transition-all ${inWishlist ? 'bg-[#E8B4B8] border-[#E8B4B8] text-white' : 'border-[#E5DDD8] text-[#8C7B75] hover:border-[#E8B4B8] hover:text-[#E8B4B8]'}`}>
                <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="border-t border-[#F0EAE6] pt-6 grid grid-cols-3 gap-4">
              {[{ icon: Truck, label: 'Free Delivery', sub: 'Above ₹2999' }, { icon: RotateCcw, label: 'Easy Returns', sub: '15 days' }, { icon: Shield, label: 'Secure Payment', sub: '100% Safe' }].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center"><Icon size={18} className="text-[#E8B4B8] mx-auto mb-1" /><p className="text-xs font-medium text-[#1A1A1A]">{label}</p><p className="text-[10px] text-[#8C7B75]">{sub}</p></div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20">
          <div className="border-t border-[#F0EAE6] pt-12">
            <h2 className="font-playfair text-2xl font-semibold text-[#1A1A1A] mb-8">Customer Reviews</h2>
            {reviews.length === 0 ? <p className="text-[#8C7B75] text-sm mb-8">No reviews yet. Be the first to review this product!</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {reviews.map(review => (
                  <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div><p className="font-medium text-[#1A1A1A] text-sm">{review.profiles?.full_name || 'Customer'}</p>{review.is_verified && <span className="text-[10px] text-green-600">Verified Purchase</span>}</div>
                      <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= review.rating ? 'text-[#C9A96E] fill-[#C9A96E]' : 'text-[#E5DDD8]'} />)}</div>
                    </div>
                    {review.title && <p className="font-medium text-sm text-[#1A1A1A] mb-2">{review.title}</p>}
                    <p className="text-sm text-[#8C7B75] leading-relaxed">{review.body}</p>
                    <p className="text-[10px] text-[#8C7B75] mt-3">{new Date(review.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Review Form */}
            {user ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl">
                <h3 className="font-playfair text-lg font-semibold text-[#1A1A1A] mb-6">Write a Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[#8C7B75] mb-2 block">Rating</label>
                    <div className="flex gap-1">{[1,2,3,4,5].map(s => <button key={s} onClick={() => setReviewRating(s)} className="p-1"><Star size={24} className={s <= reviewRating ? 'text-[#C9A96E] fill-[#C9A96E]' : 'text-[#E5DDD8]'} /></button>)}</div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#8C7B75] mb-1 block">Title</label>
                    <input value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} className="input-field" placeholder="Summary of your experience" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#8C7B75] mb-1 block">Your Review</label>
                    <textarea value={reviewBody} onChange={e => setReviewBody(e.target.value)} className="input-field min-h-[100px] resize-none" placeholder="Tell us about this product..." />
                  </div>
                  <button onClick={handleSubmitReview} disabled={submittingReview || !reviewBody} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                    <Send size={14} />{submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#8C7B75]"><Link href="/auth/login" className="text-[#E8B4B8] hover:underline">Sign in</Link> to write a review.</p>
            )}
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10"><p className="section-subheading mb-3">You may also like</p><h2 className="section-heading">Related Pieces</h2></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">{relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
