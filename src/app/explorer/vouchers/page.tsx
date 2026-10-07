'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../../services/api-client';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AID_CATEGORIES } from '../../../config/constants';
import { ArrowLeft, ShieldAlert, CheckCircle2, Clock, RotateCcw } from 'lucide-react';

export default function VouchersAuditPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await apiClient.getVouchersAudit();
        setVouchers(res.vouchers || []);
      } catch (err) {
        console.error('Failed to fetch vouchers audit:', err);
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
          <Badge variant="cyan" size="md">Privacy-Preserving Audit</Badge>
          <span className="text-xs text-slate-400 font-mono">Pseudonymous Feeds</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Public Voucher Transparency Feed
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Every digital voucher is indexed directly from the smart contract. Beneficiary addresses are protected using cryptographically salted pseudonyms (<code>anon_...</code>) to prevent surveillance.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading indexed vouchers...</p>
        </div>
      ) : vouchers.length === 0 ? (
        <Card className="text-center py-16 text-slate-400 text-xs">
          No vouchers currently issued in indexed programs.
        </Card>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Voucher ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Beneficiary Pseudonym</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Issued Ledger</th>
                  <th className="py-3 px-4">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {vouchers.map((v) => {
                  const cat = AID_CATEGORIES[v.category] || AID_CATEGORIES.FOOD;
                  let statusBadge = <Badge variant="cyan" size="sm">Active</Badge>;
                  if (v.isRedeemed) statusBadge = <Badge variant="emerald" size="sm">Redeemed</Badge>;
                  else if (v.isReclaimed) statusBadge = <Badge variant="rose" size="sm">Reclaimed</Badge>;
                  else if (v.isExpired) statusBadge = <Badge variant="amber" size="sm">Expired</Badge>;

                  return (
                    <tr key={v.onChainVoucherId} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white font-semibold">#{v.onChainVoucherId}</td>
                      <td className="py-3 px-4">
                        <span className="font-sans px-2 py-0.5 rounded text-[11px]" style={{ backgroundColor: cat.bgColor, color: cat.color }}>
                          {cat.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-cyan-300">{v.beneficiaryAnonId}</td>
                      <td className="py-3 px-4 text-white font-bold">{(Number(v.amount) / 1e7).toLocaleString()} XLM</td>
                      <td className="py-3 px-4 font-sans">{statusBadge}</td>
                      <td className="py-3 px-4 text-slate-400">#{v.issuedLedger}</td>
                      <td className="py-3 px-4 text-slate-400 font-sans text-[11px]">
                        {new Date(v.expiresAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
