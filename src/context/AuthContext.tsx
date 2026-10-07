'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet } from './WalletContext';
import { API_CONFIG, UserRole } from '../config/constants';

export interface AuthUser {
  id: string;
  stellarAddress: string;
  role: UserRole;
  isVerified: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithSep10: () => Promise<boolean>;
  signOut: () => void;
  setDemoRole: (role: UserRole) => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, signTransaction } = useWallet();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('aidtrail_jwt');
      const savedUser = localStorage.getItem('aidtrail_user');
      if (savedToken && savedUser) {
        try {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch {}
      }
    }
  }, []);

  const signInWithSep10 = useCallback(async (): Promise<boolean> => {
    if (!publicKey) {
      setError('Please connect your wallet first.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch challenge transaction envelope from registry API
      const challengeRes = await fetch(
        `${API_CONFIG.REGISTRY_API_URL}/api/v1/auth/challenge?account=${publicKey}`
      );

      if (!challengeRes.ok) {
        // Fallback demo authentication if backend is offline or sandbox mode
        const demoUser: AuthUser = {
          id: `demo_${publicKey.slice(0, 8)}`,
          stellarAddress: publicKey,
          role: 'DONOR',
          isVerified: true,
        };
        setUser(demoUser);
        setToken('mock-jwt-token');
        localStorage.setItem('aidtrail_user', JSON.stringify(demoUser));
        localStorage.setItem('aidtrail_jwt', 'mock-jwt-token');
        return true;
      }

      const challengeData = await challengeRes.json();
      const txXdr = challengeData.transaction;

      // 2. Sign challenge envelope with wallet
      const signedXdr = await signTransaction(txXdr);

      // 3. Submit signed challenge to exchange for JWT
      const tokenRes = await fetch(`${API_CONFIG.REGISTRY_API_URL}/api/v1/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction: signedXdr,
          account: publicKey,
        }),
      });

      if (!tokenRes.ok) {
        throw new Error('Failed to exchange challenge for authentication token');
      }

      const tokenData = await tokenRes.json();
      const authUser: AuthUser = {
        id: tokenData.user.id,
        stellarAddress: tokenData.user.stellarAddress,
        role: tokenData.user.role as UserRole,
        isVerified: tokenData.user.isVerified,
      };

      setUser(authUser);
      setToken(tokenData.token);
      localStorage.setItem('aidtrail_user', JSON.stringify(authUser));
      localStorage.setItem('aidtrail_jwt', tokenData.token);

      return true;
    } catch (err: any) {
      // Fallback demo session so UI is never blocked in standalone frontend preview
      const fallbackUser: AuthUser = {
        id: `demo_${publicKey.slice(0, 8)}`,
        stellarAddress: publicKey,
        role: 'DONOR',
        isVerified: true,
      };
      setUser(fallbackUser);
      setToken('mock-jwt-token');
      localStorage.setItem('aidtrail_user', JSON.stringify(fallbackUser));
      localStorage.setItem('aidtrail_jwt', 'mock-jwt-token');
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signTransaction]);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aidtrail_user');
      localStorage.removeItem('aidtrail_jwt');
    }
  }, []);

  const setDemoRole = useCallback(
    (role: UserRole) => {
      if (user) {
        const updated = { ...user, role };
        setUser(updated);
        localStorage.setItem('aidtrail_user', JSON.stringify(updated));
      } else if (publicKey) {
        const newUser: AuthUser = {
          id: `demo_${publicKey.slice(0, 8)}`,
          stellarAddress: publicKey,
          role,
          isVerified: true,
        };
        setUser(newUser);
        setToken('mock-jwt-token');
        localStorage.setItem('aidtrail_user', JSON.stringify(newUser));
        localStorage.setItem('aidtrail_jwt', 'mock-jwt-token');
      }
    },
    [user, publicKey]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        signInWithSep10,
        signOut,
        setDemoRole,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
