'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '../../../context/WalletContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Alert } from '../../../components/ui/Alert';
import TransactionStatusModal from '../../../components/ui/TransactionStatusModal';
import { contractClient, toStroops } from '../../../lib/contract-client';
import {
  ArrowLeft,
  Ticket,
  Plus,
  Upload,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  Users,
  Sparkles
} from 'lucide-react';

interface VoucherBatchItem {
  id: string;
  recipientAddress: string;
  amount: number;
  category: string;
  expiryDays: number;
}

interface IssuedVoucherRecord {
  id: number;
  programId: number;
  recipientHash: string;
  amount: number;
  category: string;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'RECLAIMED';
  expiresAt: string;
  issuedAt: string;
}

export default function NgoVouchersPage() {
  const { isConnected, address, connect } = useWallet();

  // Active Program #1 Stats
  const programVerifiedFunds = 75000;
  const currentIssuedTotal = 42500;
  const availableToIssue = programVerifiedFunds - currentIssuedTotal;

  // Single / Batch Issuance Inputs
  const [recipient, setRecipient] = useState('GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5');
  const [voucherAmount, setVoucherAmount] = useState('50');
  const [category, setCategory] = useState('Clean Water');
  const [expiryDays, setExpiryDays] = useState('30');

  // Batch Items in queue
  const [batchQueue, setBatchQueue] = useState<VoucherBatchItem[]>([
    {
      id: 'batch-1',
      recipientAddress: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      amount: 50,
      category: 'Clean Water',
      expiryDays: 30
    },
    {
      id: 'batch-2',
      recipientAddress: 'GDUKMGUGDZQK6YHYA5Z6TI2GLVEOJR6K2GTI2GLVEGYZ745PUMF43AOP',
      amount: 75,
      category: 'Nutritional Food',
      expiryDays: 30
    },
    {
      id: 'batch-3',
      recipientAddress: 'GCIZ42U2XEQA73B6Q76B6J5B7J3I56M6YJAZD5V4Q5P6L7N7O8P9Q1R2',
      amount: 50,
      category: 'Clean Water',
      expiryDays: 45
    }
  ]);

  // Existing History Records
  const [issuedRecords, setIssuedRecords] = useState<IssuedVoucherRecord[]>([
    {
      id: 101,
      programId: 1,
      recipientHash: 'recip_9a8b...4f21',
      amount: 50,
      category: 'Clean Water',
      status: 'REDEEMED',
      expiresAt: '2026-10-15',
      issuedAt: '2026-09-15'
    },
    {
      id: 102,
      programId: 1,
      recipientHash: 'recip_1c2d...7e89',
      amount: 50,
      category: 'Clean Water',
      status: 'ACTIVE',
      expiresAt: '2026-11-01',
      issuedAt: '2026-10-01'
    },
    {
      id: 103,
      programId: 1,
      recipientHash: 'recip_4e5f...0a12',
      amount: 100,
      category: 'Nutritional Food',
      status: 'EXPIRED',
      expiresAt: '2026-10-05',
      issuedAt: '2026-09-05'
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [txState, setTxState] = useState<'simulating' | 'signing' | 'submitting' | 'confirmed' | 'failed'>('simulating');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const batchTotal = batchQueue.reduce((acc, item) => acc + item.amount, 0);

  const handleAddToBatch = () => {
    if (!recipient.trim()) {
      alert('Please enter a recipient Stellar address.');
      return;
    }
    const amt = parseFloat(voucherAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid voucher amount.');
      return;
    }

    setBatchQueue((prev) => [
      ...prev,
      {
        id: `batch-${Date.now()}`,
        recipientAddress: recipient,
        amount: amt,
        category,
        expiryDays: parseInt(expiryDays, 10) || 30
      }
    ]);
  };

  const handleRemoveFromBatch = (id: string) => {
    setBatchQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExecuteBatchIssue = async () => {
    if (batchQueue.length === 0) {
      alert('Batch queue is empty.');
      return;
    }

    if (batchTotal > availableToIssue) {
      alert('Cannot issue vouchers: Batch total exceeds available verified escrow funds!');
      return;
    }

    setIsSubmitting(true);
    setStatusModalOpen(true);
    setTxState('simulating');
    setErrorMessage(null);

    try {
      // Simulate Soroban issuance
      const firstItem = batchQueue[0];
      const simResult = await contractClient.issueVoucher(
        1,
        firstItem.recipientAddress,
        toStroops(firstItem.amount),
        address || 'GDEMO...'
      );

      if (!simResult.success) {
        setTxState('failed');
        setErrorMessage(simResult.error || 'Voucher batch issuance rejected by Soroban contract.');
        setIsSubmitting(false);
        return;
      }

      setTxState('signing');
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setTxState('submitting');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockHash = '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c';
      setTxHash(mockHash);
      setTxState('confirmed');

      // Clear batch and append to records
      const newRecords: IssuedVoucherRecord[] = batchQueue.map((item, idx) => ({
        id: 200 + idx,
        programId: 1,
        recipientHash: `${item.recipientAddress.substring(0, 8)}...${item.recipientAddress.substring(item.recipientAddress.length - 4)}`,
        amount: item.amount,
        category: item.category,
        status: 'ACTIVE',
        expiresAt: '2026-11-15',
        issuedAt: '2026-10-07'
      }));

      setIssuedRecords((prev) => [...newRecords, ...prev]);
      setBatchQueue([]);
    } catch (err: any) {
      setTxState('failed');
      setErrorMessage(err.message || 'Batch issuance failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReclaimExpired = async (id: number) => {
    setStatusModalOpen(true);
    setTxState('simulating');
    setErrorMessage(null);

    try {
      const simResult = await contractClient.reclaimExpired(id, address || 'GDEMO...');
      if (!simResult.success) {
        setTxState('failed');
        setErrorMessage(simResult.error || 'Reclaim simulation rejected.');
        return;
      }

      setTxState('submitting');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTxHash('9f8e7d6c5b4a3210fedcba0987654321abcdef0123456789abcdef0123456789');
      setTxState('confirmed');

      setIssuedRecords((prev) =>
        prev.map((rec) => (rec.id === id ? { ...rec, status: 'RECLAIMED' } : rec))
      );
    } catch (err: any) {
      setTxState('failed');
      setErrorMessage(err.message || 'Reclaim failed.');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back button */}
      <Link href="/ngo" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to NGO Command Center</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="purple" size="md">Voucher Distribution Engine</Badge>
            <span className="text-xs text-slate-400 font-mono">Solvency Enforced</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Beneficiary Voucher Issuance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mint cryptographic aid vouchers to enrolled beneficiaries. Vouchers can be spent strictly with whitelisted local merchants for designated essentials.
          </p>
        </div>
      </div>

      {/* Solvency Invariant Status Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Verified Escrow Funds</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">${programVerifiedFunds.toLocaleString()} USDC</div>
          <div className="text-[11px] text-slate-400 mt-1">Unlocked via Milestone #1 & #2</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Active & Redeemed Vouchers</span>
            <Ticket className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">${currentIssuedTotal.toLocaleString()} USDC</div>
          <div className="text-[11px] text-slate-400 mt-1">850 beneficiary vouchers in circulation</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Available Issuance Ceiling</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">${availableToIssue.toLocaleString()} USDC</div>
          <div className="text-[11px] text-cyan-400/80 mt-1">Solvency Headroom remaining</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Issuance Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-purple-500/30 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ticket className="w-5 h-5 text-purple-400" />
                <span>Prepare Voucher for Beneficiary</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Enter recipient public key and aid category limits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Beneficiary Stellar Public Key *
                </label>
                <Input
                  placeholder="G..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Amount (USDC)
                  </label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={voucherAmount}
                    onChange={(e) => setVoucherAmount(e.target.value)}
                    leftAddon="$"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Validity (Days)
                  </label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Restricted Aid Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Clean Water">Clean Water & Sanitation</option>
                  <option value="Nutritional Food">Nutritional Food Rations</option>
                  <option value="Medical Pharmacy">Prescription Pharmacy & First Aid</option>
                  <option value="Shelter Materials">Shelter & Thermal Blankets</option>
                </select>
              </div>

              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={handleAddToBatch}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add to Batch Issuance Queue
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Batch Queue & Execution (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-white/10 bg-slate-900/60">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Staged Batch Queue ({batchQueue.length})</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Review queue before executing batch minting transaction on Soroban.
                </CardDescription>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Batch Total</span>
                <span className="text-base font-bold font-mono text-purple-300">${batchTotal.toLocaleString()} USDC</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {batchQueue.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-xl">
                  Batch queue is empty. Add recipients on the left to prepare distribution.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {batchQueue.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-white text-[11px]">
                            {item.recipientAddress.substring(0, 10)}...{item.recipientAddress.substring(item.recipientAddress.length - 6)}
                          </span>
                          <Badge variant="purple" size="sm">{item.category}</Badge>
                        </div>
                        <span className="text-[11px] text-slate-400">Valid for {item.expiryDays} days</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-emerald-400">${item.amount}</span>
                        <button
                          onClick={() => handleRemoveFromBatch(item.id)}
                          className="text-slate-500 hover:text-red-400 text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={batchQueue.length === 0}
                isLoading={isSubmitting}
                onClick={handleExecuteBatchIssue}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                {!isConnected ? 'Connect Wallet & Issue' : `Mint Batch (${batchQueue.length} Vouchers) on Soroban`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recently Issued Vouchers Table */}
      <Card className="border-white/10 bg-slate-900/60">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-base">Voucher Distribution Audit Records</CardTitle>
          <CardDescription className="text-xs">
            Complete on-chain history of issued vouchers for Program #1.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 uppercase font-mono text-[11px]">
                <tr>
                  <th className="pb-3 pl-2">Voucher ID</th>
                  <th className="pb-3">Recipient Hash</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Value</th>
                  <th className="pb-3">Expires</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {issuedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pl-2 font-mono text-purple-400">#{rec.id}</td>
                    <td className="py-3 font-mono text-slate-400">{rec.recipientHash}</td>
                    <td className="py-3">{rec.category}</td>
                    <td className="py-3 font-mono font-bold text-white">${rec.amount} USDC</td>
                    <td className="py-3 font-mono text-slate-400">{rec.expiresAt}</td>
                    <td className="py-3">
                      {rec.status === 'ACTIVE' && <Badge variant="cyan" size="sm">Active</Badge>}
                      {rec.status === 'REDEEMED' && <Badge variant="emerald" size="sm">Redeemed</Badge>}
                      {rec.status === 'EXPIRED' && <Badge variant="amber" size="sm">Expired</Badge>}
                      {rec.status === 'RECLAIMED' && <Badge variant="purple" size="sm">Reclaimed</Badge>}
                    </td>
                    <td className="py-3 text-right pr-2">
                      {rec.status === 'EXPIRED' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReclaimExpired(rec.id)}
                          leftIcon={<RotateCcw className="w-3 h-3 text-amber-400" />}
                        >
                          Reclaim Funds
                        </Button>
                      ) : (
                        <span className="text-slate-600 font-mono text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Status Modal */}
      <TransactionStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        state={txState}
        txHash={txHash}
        errorMessage={errorMessage}
        title="Processing Voucher Issuance on Soroban"
      />
    </div>
  );
}
