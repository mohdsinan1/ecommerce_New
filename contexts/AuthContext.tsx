'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile } from '@/lib/data';
import { authApi, initStore } from '@/lib/storage';

type AuthContextType = {
  user: Profile | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initStore();
    const current = authApi.currentUser();
    setUser(current);
    setLoading(false);
  }, []);

  async function refreshProfile() {
    const current = authApi.currentUser();
    setUser(current);
  }

  async function signIn(email: string, password: string) {
    const { user: u, error } = authApi.signIn(email, password);
    if (u) setUser(u);
    return { error: error ? new Error(error) : null };
  }

  async function signUp(email: string, password: string, fullName: string) {
    const { user: u, error } = authApi.signUp(email, password, fullName);
    if (u) setUser(u);
    return { error: error ? new Error(error) : null };
  }

  async function signOut() {
    authApi.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile: user, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
