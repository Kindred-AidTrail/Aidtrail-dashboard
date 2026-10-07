import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface QueuedRedemption {
  id: string;
  voucherId: string;
  beneficiaryAddress: string;
  vendorAddress: string;
  amount: string;
  category: string;
  capturedAt: string;
  status: 'QUEUED' | 'SYNCING' | 'SYNCED' | 'FAILED';
  retryCount: number;
  errorMessage?: string;
  txHash?: string;
}

interface AidTrailDB extends DBSchema {
  redemptions: {
    key: string;
    value: QueuedRedemption;
    indexes: { 'by-status': string; 'by-time': string };
  };
}

const DB_NAME = 'aidtrail_offline_db';
const DB_VERSION = 1;

export class OfflineQueueService {
  private dbPromise: Promise<IDBPDatabase<AidTrailDB>> | null = null;

  private getDB(): Promise<IDBPDatabase<AidTrailDB>> {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('IndexedDB unavailable on server'));
    }

    if (!this.dbPromise) {
      this.dbPromise = openDB<AidTrailDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          const store = db.createObjectStore('redemptions', {
            keyPath: 'id',
          });
          store.createIndex('by-status', 'status');
          store.createIndex('by-time', 'capturedAt');
        },
      });
    }
    return this.dbPromise;
  }

  /**
   * Enqueues a redemption intent when offline or in low-connectivity state
   */
  public async enqueueRedemption(
    redemption: Omit<QueuedRedemption, 'id' | 'capturedAt' | 'status' | 'retryCount'>
  ): Promise<QueuedRedemption> {
    const db = await this.getDB();
    const item: QueuedRedemption = {
      ...redemption,
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      capturedAt: new Date().toISOString(),
      status: 'QUEUED',
      retryCount: 0,
    };

    await db.put('redemptions', item);
    return item;
  }

  /**
   * Retrieves all items currently in the queue
   */
  public async getAllQueued(): Promise<QueuedRedemption[]> {
    try {
      const db = await this.getDB();
      return await db.getAll('redemptions');
    } catch {
      return [];
    }
  }

  /**
   * Retrieves items waiting to be synced
   */
  public async getPending(): Promise<QueuedRedemption[]> {
    try {
      const db = await this.getDB();
      const all = await db.getAll('redemptions');
      return all.filter((r) => r.status === 'QUEUED' || r.status === 'FAILED');
    } catch {
      return [];
    }
  }

  /**
   * Updates status of a queued redemption
   */
  public async updateStatus(
    id: string,
    status: QueuedRedemption['status'],
    details?: { txHash?: string; errorMessage?: string }
  ): Promise<void> {
    const db = await this.getDB();
    const existing = await db.get('redemptions', id);
    if (existing) {
      existing.status = status;
      if (status === 'SYNCING') {
        existing.retryCount += 1;
      }
      if (details?.txHash) existing.txHash = details.txHash;
      if (details?.errorMessage) existing.errorMessage = details.errorMessage;
      await db.put('redemptions', existing);
    }
  }

  /**
   * Deletes a synced or cancelled item
   */
  public async remove(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('redemptions', id);
  }

  /**
   * Clears all synced records
   */
  public async clearSynced(): Promise<void> {
    const db = await this.getDB();
    const all = await db.getAll('redemptions');
    for (const item of all) {
      if (item.status === 'SYNCED') {
        await db.delete('redemptions', item.id);
      }
    }
  }
}

export const offlineQueue = new OfflineQueueService();
