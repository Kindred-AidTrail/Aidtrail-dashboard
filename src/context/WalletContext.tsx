'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isConnected, getPublicKey, signTransaction as freighterSignTx } from '@stellar/freighter-api';
import { STELLAR_NETWORK } from '../config/constants';

export interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isFreighterAvailable: boolean;
  network: string;
  connect: () => Promise<string | null>;
  disconnect: () => void;
  signTransaction: (xdr: string) => Promise<string>;
  connectDemoAccount: (address: string) => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check Freighter availability on mount
  useEffect(() => {
    async function checkFreighter() {
      try {
        const connected = await isConnected();
        setIsFreighterAvailable(!!connected);
      } catch {
        setIsFreighterAvailable(false);
      }
    }

    if (typeof window !== 'undefined') {
      checkFreighter();

      // Restore session if remembered
      const savedKey = localStorage.getItem('aidtrail_pubkey');
      if (savedKey) {
        setPublicKey(savedKey);
      }
    }
  }, []);

  const connect = useCallback(async (): Promise<string | null> => {
    setIsConnecting(true);
    setError(null);
    try {
      const hasFreighter = await isConnected();
      if (!hasFreighter) {
        throw new Error(
          'Freighter wallet extension not found. Please install Freighter from https://www.freighter.app/ or choose a Demo Persona below.'
        );
      }

      const key = await getPublicKey();
      if (!key) {
        throw new Error('User declined wallet connection request.');
      }

      setPublicKey(key);
      localStorage.setItem('aidtrail_pubkey', key);
      return key;
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aidtrail_pubkey');
      localStorage.removeItem('aidtrail_jwt');
    }
  }, []);

  const signTransaction = useCallback(
    async (xdr: string): Promise<string> => {
      try {
        const hasFreighter = await isConnected();
        if (hasFreighter) {
          const signed = await freighterSignTx(xdr, {
            networkPassphrase: STELLAR_NETWORK.PASSPHRASE,
          });
          return signed;
        }

        // If running in demo mode without Freighter extension, return xdr (simulated signature)
        return xdr;
      } catch (err: any) {
        throw new Error(`Wallet signing failed: ${err.message || 'Transaction rejected'}`);
      }
    },
    []
  );

  const connectDemoAccount = useCallback((address: string) => {
    setPublicKey(address);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aidtrail_pubkey', address);
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected: !!publicKey,
        isConnecting,
        isFreighterAvailable,
        network: STELLAR_NETWORK.NETWORK_NAME,
        connect,
        disconnect,
        signTransaction,
        connectDemoAccount,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
