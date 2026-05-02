'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome back!' });
      router.push('/');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex">
      {/* Left Image Panel */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/60 to-transparent" />
        <div className="absolute bottom-16 left-12">
          <Link href="/" className="font-playfair text-3xl font-semibold text-white tracking-wider">Lumière</Link>
          <p className="text-white/70 text-sm mt-2 max-w-xs">Where elegance meets everyday luxury.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="font-playfair text-3xl font-semibold text-[#1A1A1A] tracking-wider">Lumière</Link>
          </div>

          <div className="mb-10">
            <p className="text-xs tracking-widest uppercase text-[#E8B4B8] mb-2">Welcome back</p>
            <h1 className="font-playfair text-3xl font-semibold text-[#1A1A1A]">Sign In</h1>
            <p className="text-[#8C7B75] text-sm mt-2">Continue your style journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-[#8C7B75] mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="hello@example.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-medium text-[#8C7B75]">Password</label>
                <a href="#" className="text-xs text-[#E8B4B8] hover:text-[#D4969A]">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Your password"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7B75]">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[#8C7B75] mt-8">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-[#E8B4B8] hover:text-[#D4969A] font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
