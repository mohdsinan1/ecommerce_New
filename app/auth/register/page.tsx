'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) { toast({ title: 'Please agree to the terms', variant: 'destructive' }); return; }
    if (password.length < 6) { toast({ title: 'Password must be at least 6 characters', variant: 'destructive' }); return; }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) {
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Account created!', description: 'Welcome to Lumière' });
      router.push('/');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex">
      {/* Left Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/60 to-transparent" />
        <div className="absolute bottom-16 left-12">
          <Link href="/" className="font-playfair text-3xl font-semibold text-white tracking-wider">Lumière</Link>
          <p className="text-white/70 text-sm mt-2 max-w-xs">Join thousands of women who choose elegance.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="font-playfair text-3xl font-semibold text-[#1A1A1A] tracking-wider">Lumière</Link>
          </div>

          <div className="mb-10">
            <p className="text-xs tracking-widest uppercase text-[#E8B4B8] mb-2">Join us</p>
            <h1 className="font-playfair text-3xl font-semibold text-[#1A1A1A]">Create Account</h1>
            <p className="text-[#8C7B75] text-sm mt-2">Start your style journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-[#8C7B75] mb-1.5 block">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="input-field" placeholder="Priya Sharma" required />
            </div>
            <div>
              <label className="text-xs font-medium text-[#8C7B75] mb-1.5 block">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="hello@example.com" required />
            </div>
            <div>
              <label className="text-xs font-medium text-[#8C7B75] mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input-field pr-12" placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7B75]">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 text-[#E8B4B8]" />
              <span className="text-xs text-[#8C7B75] leading-relaxed">
                I agree to Lumière's{' '}
                <a href="#" className="text-[#E8B4B8] hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-[#E8B4B8] hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#8C7B75] mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#E8B4B8] hover:text-[#D4969A] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
