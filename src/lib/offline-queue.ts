import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface OfflineRedemptionItem {
  id?: string;
  voucherId: number | string;
  programId?: number | string;
  amount: number | string;
  vendorAddress: string;
  beneficiaryAddress: string;
  securityToken?: string;
  category?: string;
  timestamp?: number;
  status?: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
}

interface AidTrailDB extends DBSchema {
  redemptions: {
    key: string;
    value: OfflineRedemptionItem & { id: string; timestamp: number };
  };
}

const DB_NAME = 'aidtrail_offline_redemptions_db';
const DB_VERSION = 1;

export class OfflineQueue {
  private dbPromise: Promise<IDBPDatabase<AidTrailDB>> | null = null;

  private getDB(): Promise<IDBPDatabase<AidTrailDB>> {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('IndexedDB not supported in server environment'));
    }

    if (!this.dbPromise) {
      this.dbPromise = openDB<AidTrailDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('redemptions')) {
            db.createObjectStore('redemptions', { keyPath: 'id' });
          }
        },
      });
    }
    return this.dbPromise;
  }

  public async enqueue(item: OfflineRedemptionItem): Promise<string> {
    const id = item.id || `offline_voucher_${item.voucherId}_${Date.now()}`;
    const payload = {
      ...item,
      id,
      timestamp: item.timestamp || Date.now(),
      status: 'QUEUED' as const,
    };

    try {
      const db = await this.getDB();
      await db.put('redemptions', payload);
    } catch {
      // In-memory fallback if IndexedDB is blocked
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('aidtrail_offline_queue') || '[]');
        existing.push(payload);
        localStorage.setItem('aidtrail_offline_queue', JSON.stringify(existing));
      }
    }
    return id;
  }

  public async getQueue(): Promise<OfflineRedemptionItem[]> {
    try {
      const db = await this.getDB();
      return await db.getAll('redemptions');
    } catch {
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('aidtrail_offline_queue') || '[]');
      }
      return [];
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      await db.delete('redemptions', id);
    } catch {
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('aidtrail_offline_queue') || '[]');
        const filtered = existing.filter((i: any) => i.id !== id);
        localStorage.setItem('aidtrail_offline_queue', JSON.stringify(filtered));
      }
    }
  }

  public async clear(): Promise<void> {
    try {
      const db = await this.getDB();
      await db.clear('redemptions');
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aidtrail_offline_queue');
      }
    }
  }

  /**
   * Synchronizes queued items sequentially with anti-collision pause
   */
  public async sync(
    syncFn: (item: OfflineRedemptionItem) => Promise<{ success: boolean; txHash?: string }>
  ): Promise<{ syncedCount: number; errors: number }> {
    const items = await this.getQueue();
    let syncedCount = 0;
    let errors = 0;

    for (const item of items) {
      try {
        const res = await syncFn(item);
        if (res.success && item.id) {
          await this.remove(item.id);
          syncedCount++;
          // Stagger requests to prevent Stellar account sequence collisions
          await new Promise((r) => setTimeout(r, 600));
        } else {
          errors++;
        }
      } catch {
        errors++;
      }
    }

    return { syncedCount, errors };
  }
}

export const offlineQueue = new OfflineQueue();
