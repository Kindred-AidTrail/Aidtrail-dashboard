'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../../services/api-client';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ArrowLeft, ExternalLink, Store } from 'lucide-react';
import { getExplorerTxUrl, getExplorerAccountUrl } from '../../../config/env';

export default function VendorPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await apiClient.getVendorPayouts();
        setPayouts(res.payouts || []);
      } catch (err) {
        console.error('Failed to fetch payouts:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <Link href="/explorer" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Programs Directory</span>
      </Link>

      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="emerald" size="md">Direct Settlement</Badge>
          <span className="text-xs text-slate-400 font-mono">On-Chain Payouts</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Whitelisted Vendor Payout History
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Every redemption dispatches tokens directly from the Soroban contract to the verified merchant.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading vendor payouts...</p>
        </div>
      ) : payouts.length === 0 ? (
        <Card className="text-center py-16 text-slate-400 text-xs">
          No merchant payouts recorded in indexed programs yet.
        </Card>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Merchant Address</th>
                  <th className="py-3 px-4">Voucher</th>
                  <th className="py-3 px-4">Disbursed Amount</th>
                  <th className="py-3 px-4">Ledger</th>
                  <th className="py-3 px-4">Transaction Hash</th>
                  <th className="py-3 px-4">Explorer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-slate-200">
                      <a
                        href={getExplorerAccountUrl(p.vendorAddress)}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-emerald-400 flex items-center gap-1.5"
                      >
                        <Store className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{p.vendorAddress.slice(0, 6)}...{p.vendorAddress.slice(-4)}</span>
                      </a>
                    </td>
                    <td className="py-3 px-4 text-cyan-300">#{p.voucherId.toString()}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      {(Number(p.amount) / 1e7).toLocaleString()} XLM
                    </td>
                    <td className="py-3 px-4 text-slate-400">#{p.ledger}</td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-[150px]">
                      {p.txHash}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <a
                        href={getExplorerTxUrl(p.txHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
