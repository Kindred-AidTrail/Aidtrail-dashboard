'use client';

import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import TransactionStatusModal from '../../components/ui/TransactionStatusModal';
import { contractClient, toStroops } from '../../lib/contract-client';
import {
  HeartHandshake,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Lock,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

interface ProgramOption {
  id: number;
  name: string;
  category: string;
  targetUsd: number;
  raisedUsd: number;
  releasedUsd: number;
  ngoName: string;
  milestonesCount: number;
  completedMilestones: number;
}

const SAMPLE_PROGRAMS: ProgramOption[] = [
  {
    id: 1,
    name: 'Turkana Clean Water & Borehole Initiative',
    category: 'Water & Sanitation',
    targetUsd: 150000,
    raisedUsd: 112500,
    releasedUsd: 75000,
    ngoName: 'Oasis Relief East Africa',
    milestonesCount: 3,
    completedMilestones: 2,
  },
  {
    id: 2,
    name: 'Dadaab Refugee Nutritional Security Tranche 4',
    category: 'Emergency Nutrition',
    targetUsd: 250000,
    raisedUsd: 198000,
    releasedUsd: 120000,
    ngoName: 'Global Care Coalition',
    milestonesCount: 4,
    completedMilestones: 2,
  },
  {
    id: 3,
    name: 'Kilifi Solar-Powered Health Clinic Storage',
    category: 'Medical Infrastructure',
    targetUsd: 85000,
    raisedUsd: 42000,
    releasedUsd: 20000,
    ngoName: 'Kilifi Health Trust',
    milestonesCount: 3,
    completedMilestones: 1,
  },
];

export default function DonorPortalPage() {
  const { isConnected, address, connect } = useWallet();
  const [selectedProgramId, setSelectedProgramId] = useState<number>(1);
  const [amount, setAmount] = useState<string>('250');
  const [selectedToken, setSelectedToken] = useState<'USDC' | 'XLM'>('USDC');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [txState, setTxState] = useState<'simulating' | 'signing' | 'submitting' | 'confirmed' | 'failed'>('simulating');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedProgram = SAMPLE_PROGRAMS.find((p) => p.id === selectedProgramId) || SAMPLE_PROGRAMS[0];

  const handleQuickAmount = (val: string) => {
    setAmount(val);
  };

  const handleFundProgram = async () => {
    if (!isConnected || !address) {
      connect();
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    setIsSubmitting(true);
    setStatusModalOpen(true);
    setTxState('simulating');
    setErrorMessage(null);

    try {
      // Simulate Soroban contract call with 7-decimal stroops precision
      const simResult = await contractClient.fundProgram(
        selectedProgramId,
        toStroops(numAmount),
        address
      );

      if (!simResult.success) {
        setTxState('failed');
        setErrorMessage(simResult.error || 'Contract simulation failed: Program escrow cannot accept funds.');
        setIsSubmitting(false);
        return;
      }

      setTxState('signing');
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setTxState('submitting');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockHash = '7f8a9b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4';
      setTxHash(mockHash);
      setTxState('confirmed');
    } catch (err: any) {
      setTxState('failed');
      setErrorMessage(err.message || 'Donation submission failed on Stellar network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="emerald" size="md">Direct Aid Giving</Badge>
            <span className="text-xs text-slate-400 font-mono">100% Escrow Protected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Donor Impact Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fund verified humanitarian programs with conditional escrow release. Funds unlock only when independent verifiers sign off on real-world milestones.
          </p>
        </div>

        {!isConnected && (
          <Button variant="primary" size="md" onClick={connect} leftIcon={<Sparkles className="w-4 h-4" />}>
            Connect Donor Wallet
          </Button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Your Total Contributed</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">$14,250.00</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">Across 3 humanitarian programs</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Funds Verified & Released</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">$9,500.00</div>
          <div className="text-[11px] text-slate-400 mt-1">Verified with on-chain photographic proof</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Protected in Escrow</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">$4,750.00</div>
          <div className="text-[11px] text-slate-400 mt-1">Refundable if milestones fail</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Beneficiary Impact</span>
            <HeartHandshake className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">1,820</div>
          <div className="text-[11px] text-purple-400 mt-1">Direct food & clean water vouchers</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Funding Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-emerald-500/30 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Contribute to Program</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Your donation is held securely in the Soroban smart contract until milestone proof is approved.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Select Program */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Humanitarian Program
                </label>
                <select
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {SAMPLE_PROGRAMS.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      #{prog.id} - {prog.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Token */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Settlement Currency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedToken('USDC')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      selectedToken === 'USDC'
                        ? 'border-emerald-500 bg-emerald-500/15 text-white ring-1 ring-emerald-500'
                        : 'border-white/10 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    USDC (Stellar Stablecoin)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedToken('XLM')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      selectedToken === 'XLM'
                        ? 'border-cyan-500 bg-cyan-500/15 text-white ring-1 ring-cyan-500'
                        : 'border-white/10 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Native Lumens (XLM)
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Donation Amount ({selectedToken})
                </label>
                <Input
                  type="number"
                  placeholder="250"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  leftAddon="$"
                />

                {/* Quick Chips */}
                <div className="flex gap-2 mt-2.5">
                  {['50', '100', '250', '500', '1000'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleQuickAmount(chip)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors ${
                        amount === chip
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                          : 'border-white/10 bg-slate-950/50 text-slate-400 hover:text-white'
                      }`}
                    >
                      ${chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Escrow Guarantee Note */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Soroban Milestone Escrow</span>
                </div>
                <p>
                  Funds are sent directly to contract <span className="font-mono text-slate-300">CAID...TRAIL</span>. If the NGO fails to deliver verified milestones within the agreed duration, you retain rights to trigger a full refund.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
                onClick={handleFundProgram}
                leftIcon={<HeartHandshake className="w-4 h-4" />}
              >
                {!isConnected ? 'Connect Wallet & Fund' : `Deposit $${amount} to Program Escrow`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Selected Program Progress & Milestones (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-white/10 bg-slate-900/60">
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="cyan">{selectedProgram.category}</Badge>
                <span className="text-xs font-mono text-slate-400">Managed by {selectedProgram.ngoName}</span>
              </div>
              <CardTitle className="text-xl mt-2 text-white">{selectedProgram.name}</CardTitle>
              <CardDescription className="text-xs">
                Escrow Solvency: ${(selectedProgram.raisedUsd - selectedProgram.releasedUsd).toLocaleString()} USDC currently locked pending verification
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">Escrow Funded: ${selectedProgram.raisedUsd.toLocaleString()}</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {Math.round((selectedProgram.raisedUsd / selectedProgram.targetUsd) * 100)}% of ${selectedProgram.targetUsd.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (selectedProgram.raisedUsd / selectedProgram.targetUsd) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Milestones Flow */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  Conditional Release Milestones
                </h4>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">Milestone 1: Geological Survey & Borehole Drilling</span>
                          <Badge variant="emerald" size="sm">Released</Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Tranche release: $35,000 USDC. Multi-sig approved by Kenya Red Cross & UNICEF verifiers.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">$35,000</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">Milestone 2: Solar Pump Installation & Storage Towers</span>
                          <Badge variant="emerald" size="sm">Released</Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Tranche release: $40,000 USDC. Evidence verified with geotagged photographic report.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">$40,000</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/15 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-amber-500/20 text-amber-400 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">Milestone 3: Water Distribution Points & Beneficiary Onboarding</span>
                          <Badge variant="amber" size="sm">Under Verifier Review</Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Tranche requested: $37,500 USDC. Currently awaiting 2 of 3 independent verifier signoffs.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-amber-300 font-bold">$37,500</span>
                  </div>
                </div>
              </div>

              {/* Donor refund policy */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-white">Need to Trigger Escrow Refund?</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    If milestones exceed expiration deadlines without fulfillment, donors can recall unspent funds directly.
                  </p>
                </div>
                <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                  Check Refund Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction Status Modal */}
      <TransactionStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        state={txState}
        txHash={txHash}
        errorMessage={errorMessage}
        title="Funding Humanitarian Program Escrow"
      />
    </div>
  );
}
