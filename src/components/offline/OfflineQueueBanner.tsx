'use client';

import React, { useEffect, useState } from 'react';
import { offlineQueue, OfflineRedemptionItem } from '../../lib/offline-queue';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function OfflineQueueBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncSuccess, setLastSyncSuccess] = useState(false);

  const refreshQueueStatus = async () => {
    try {
      const items = await offlineQueue.getQueue();
      setQueueCount(items.length);
    } catch {
      // IndexedDB might not be available in SSR
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);
    refreshQueueStatus();

    const handleOnline = async () => {
      setIsOnline(true);
      // Auto-trigger sync when network reconnects
      handleSyncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(refreshQueueStatus, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setLastSyncSuccess(false);

    try {
      await offlineQueue.sync(async (item: OfflineRedemptionItem) => {
        // Simulated contract submission for offline item
        await new Promise((res) => setTimeout(res, 800));
        return { success: true, txHash: `synced_hash_${item.voucherId}` };
      });

      await refreshQueueStatus();
      setLastSyncSuccess(true);
      setTimeout(() => setLastSyncSuccess(false), 4000);
    } catch (err) {
      console.error('Error syncing offline queue:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Only display if offline, or if items are queued, or right after sync success
  if (isOnline && queueCount === 0 && !lastSyncSuccess) {
    return null;
  }

  return (
    <div className="bg-slate-900 border-b border-white/10 px-4 py-2.5 transition-all animate-fade-in">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          {!isOnline ? (
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <WifiOff className="w-4 h-4" />
              </span>
              <span>Offline Mode Active: Transactions will be queued locally in IndexedDB</span>
            </div>
          ) : lastSyncSuccess ? (
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <span>Offline redemptions synchronized with Stellar network!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Wifi className="w-4 h-4" />
              </span>
              <span>Internet restored: {queueCount} offline redemption(s) pending sync</span>
            </div>
          )}

          {queueCount > 0 && (
            <Badge variant="amber" size="sm">
              {queueCount} Queued
            </Badge>
          )}
        </div>

        {queueCount > 0 && isOnline && (
          <Button
            variant="secondary"
            size="sm"
            isLoading={isSyncing}
            onClick={handleSyncNow}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
          >
            Sync Queued Items
          </Button>
        )}
      </div>
    </div>
  );
}
