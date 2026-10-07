'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Alert } from '../ui/Alert';
import { contractClient } from '../../lib/contract-client';
import { offlineQueue } from '../../lib/offline-queue';
import { Store, CheckCircle2, ShieldCheck, DollarSign, ArrowRight, Sparkles, WifiOff, ExternalLink } from 'lucide-react';

interface SettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherData: {
    voucherId: number;
    programId: number;
    amount: number;
    category: string;
    beneficiary: string;
    token: string;
  } | null;
  vendorAddress: string;
  onSettlementSuccess: (txHash: string, isOffline: boolean) => void;
}

export default function SettlementModal({
  isOpen,
  onClose,
  voucherData,
  vendorAddress,
  onSettlementSuccess
}: SettlementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOfflineQueued, setIsOfflineQueued] = useState(false);

  if (!isOpen || !voucherData) return null;

  const handleExecuteSettlement = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    // Check if browser is online
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    if (!isOnline) {
      // Save to IndexedDB offline queue
      try {
        await offlineQueue.enqueue({
          voucherId: voucherData.voucherId,
          programId: voucherData.programId,
          amount: voucherData.amount,
          vendorAddress: vendorAddress,
          beneficiaryAddress: voucherData.beneficiary,
          securityToken: voucherData.token
        });
        setIsOfflineQueued(true);
        setTimeout(() => {
          onSettlementSuccess('OFFLINE_INDEXED_DB', true);
          onClose();
        }, 1200);
      } catch (err: any) {
        setErrorMessage('Failed to cache offline redemption.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      // Simulate on-chain contract settlement: redeem_voucher
      const simResult = await contractClient.redeemVoucher(
        voucherData.voucherId,
        vendorAddress,
        vendorAddress
      );

      if (!simResult.success) {
        setErrorMessage(simResult.error || 'Contract rejected redemption: Category mismatch or already redeemed.');
        setIsSubmitting(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockHash = '4f8a9b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4';
      onSettlementSuccess(mockHash, false);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Settlement failed on Stellar network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <Card className="max-w-md w-full border-amber-500/40 bg-slate-900 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-400" />
            <span className="text-base font-bold text-white">Disbursement Settlement</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-mono text-lg">
            ✕
          </button>
        </div>

        {/* Voucher Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="cyan" size="sm">{voucherData.category}</Badge>
            <span className="text-xs font-mono text-slate-400">Voucher #{voucherData.voucherId}</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-xs text-slate-300">Direct Contract Payout:</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              ${voucherData.amount}.00 <span className="text-xs font-normal text-slate-400">USDC</span>
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 space-y-1">
            <div className="flex justify-between">
              <span>Beneficiary:</span>
              <span className="text-slate-300">
                {voucherData.beneficiary.substring(0, 8)}...{voucherData.beneficiary.substring(voucherData.beneficiary.length - 4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Recipient Store:</span>
              <span className="text-slate-300">
                {vendorAddress.substring(0, 8)}...{vendorAddress.substring(vendorAddress.length - 4)}
              </span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <Alert variant="error" title="Redemption Error">
            {errorMessage}
          </Alert>
        )}

        {isOfflineQueued && (
          <Alert variant="info" title="Offline Queue Activated">
            No internet detected. Transaction stored safely in IndexedDB and will auto-sync once back online.
          </Alert>
        )}

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            The contract transfers ${voucherData.amount} USDC directly into your Stellar merchant wallet. No intermediary fees.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" size="md" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            onClick={handleExecuteSettlement}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Confirm & Claim Payout
          </Button>
        </div>
      </Card>
    </div>
  );
}
