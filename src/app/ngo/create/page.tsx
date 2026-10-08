'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ArrowRight,
  Sparkles,
  FileText,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function CreateProgramPage() {
  const router = useRouter();
  const { isConnected, address, connect } = useWallet();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Water & Sanitation',
    country: 'Kenya',
    targetAmount: '100000',
    tokenAsset: 'USDC',
    durationDays: '180',
    verifierThreshold: '2',
    verifierAddresses: [
      'GDUKMGUGDZQK6YHYA5Z6TI2GLVEOJR6K2GTI2GLVEGYZ745PUMF43AOP',
      'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      'GCIZ42U2XEQA73B6Q76B6J5B7J3I56M6YJAZD5V4Q5P6L7N7O8P9Q1R2'
    ],
    metadataCid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [txState, setTxState] = useState<'simulating' | 'signing' | 'submitting' | 'confirmed' | 'failed'>('simulating');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.title.trim()) {
      alert('Please provide a title for the humanitarian program.');
      return;
    }
    setStep((prev) => Math.min(4, prev + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitProgram = async () => {
    if (!isConnected || !address) {
      connect();
      return;
    }

    setIsSubmitting(true);
    setStatusModalOpen(true);
    setTxState('simulating');
    setErrorMessage(null);

    try {
      const budgetUnits = toStroops(formData.targetAmount || '0');
      const simResult = await contractClient.createProgram(
        formData.title,
        budgetUnits,
        address
      );

      if (!simResult.success) {
        setTxState('failed');
        setErrorMessage(simResult.error || 'Program creation simulation failed on Soroban.');
        setIsSubmitting(false);
        return;
      }

      setTxState('signing');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTxState('submitting');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockHash = '4e8b1a3d9c7f6e5d4c3b2a10987654321fedcba0987654321abcdef012345678';
      setTxHash(mockHash);
      setTxState('confirmed');
    } catch (err: any) {
      setTxState('failed');
      setErrorMessage(err.message || 'Transaction submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back button */}
      <Link href="/ngo" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to NGO Command Center</span>
      </Link>

      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="purple" size="md">NGO Program Wizard</Badge>
          <span className="text-xs text-slate-400 font-mono">Step {step} of 4</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Create On-Chain Aid Program
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Deploy an immutable escrow smart contract program on Stellar Soroban with multi-verifier milestones and strict solvency invariants.
        </p>
      </div>

      {/* Wizard Step Tracker */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {[
          { num: 1, title: 'Basics', icon: FileText },
          { num: 2, title: 'Budget', icon: DollarSign },
          { num: 3, title: 'Verifiers', icon: ShieldCheck },
          { num: 4, title: 'Deploy', icon: Sparkles },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;

          return (
            <div
              key={s.num}
              className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center gap-2 transition-all ${
                isActive
                  ? 'border-purple-500 bg-purple-500/10 text-white ring-1 ring-purple-500'
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                  : 'border-white/5 bg-slate-900/40 text-slate-500'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isActive
                    ? 'bg-purple-500 text-white'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <div className="text-center sm:text-left">
                <span className="text-xs font-semibold block">{s.title}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card className="border-white/10 bg-slate-900/70">
        <CardContent className="pt-6 space-y-6">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Program Title *
                </label>
                <Input
                  placeholder="e.g. Turkana Drought Relief & Solar Water Wells Tranche 2"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Aid Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Emergency Food & Nutrition">Emergency Food & Nutrition</option>
                    <option value="Medical & Health Services">Medical & Health Services</option>
                    <option value="Shelter & Displacement">Shelter & Displacement</option>
                    <option value="Education & Child Protection">Education & Child Protection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Country / Region
                  </label>
                  <Input
                    placeholder="e.g. Kenya (Turkana County)"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Humanitarian Mission Description
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl bg-slate-950/80 border border-white/15 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Detail the target humanitarian objectives, beneficiary community selection criteria, and expected outcomes..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: BUDGET & FINANCIAL */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Funding Target Amount (USD)
                  </label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={formData.targetAmount}
                    onChange={(e) => updateField('targetAmount', e.target.value)}
                    leftAddon="$"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Disbursement Currency
                  </label>
                  <select
                    value={formData.tokenAsset}
                    onChange={(e) => updateField('tokenAsset', e.target.value)}
                    className="w-full rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="USDC">USDC (Centre Consortium - Stellar Testnet)</option>
                    <option value="XLM">Native Stellar Lumens (XLM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Program Operational Duration (Days)
                </label>
                <Input
                  type="number"
                  placeholder="180"
                  value={formData.durationDays}
                  onChange={(e) => updateField('durationDays', e.target.value)}
                  helperText="Unspent escrow balances become refundable to donors after expiration."
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Solvency Invariant Rule</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The Soroban contract mathematically enforces that total vouchers issued can NEVER exceed verified milestone disbursements released from escrow.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: VERIFIERS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Required Verifier Quorum (M of N)
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    className="w-24 text-center font-bold"
                    value={formData.verifierThreshold}
                    onChange={(e) => updateField('verifierThreshold', e.target.value)}
                  />
                  <span className="text-xs text-slate-400">
                    of {formData.verifierAddresses.length} independent verifiers must attest each milestone
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Independent Verifier Stellar Public Keys
                </label>
                <div className="space-y-2">
                  {formData.verifierAddresses.map((addr, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-purple-400 w-6">#{idx + 1}</span>
                      <Input
                        value={addr}
                        readOnly
                        className="font-mono text-[11px] bg-slate-950/90 text-slate-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & DEPLOY */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/20 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Program Summary Specification
                </h4>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-slate-400">Program:</span>
                  <span className="font-semibold text-white">{formData.title || 'Untitled Program'}</span>

                  <span className="text-slate-400">Category:</span>
                  <span className="text-slate-200">{formData.category}</span>

                  <span className="text-slate-400">Target Budget:</span>
                  <span className="font-mono text-emerald-400 font-bold">${Number(formData.targetAmount).toLocaleString()} {formData.tokenAsset}</span>

                  <span className="text-slate-400">Verifier Quorum:</span>
                  <span className="text-slate-200">{formData.verifierThreshold} of {formData.verifierAddresses.length} Multi-Sig</span>

                  <span className="text-slate-400">Metadata CID:</span>
                  <span className="font-mono text-cyan-400 text-[11px] truncate">{formData.metadataCid}</span>
                </div>
              </div>

              <Alert variant="info" title="Ready to sign with NGO Admin Key">
                Submitting will call <code className="text-white">create_program</code> on the Soroban smart contract. Please ensure your wallet has testnet XLM for gas.
              </Alert>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {step > 1 ? (
              <Button variant="ghost" size="md" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Previous Step
              </Button>
            ) : <div />}

            {step < 4 ? (
              <Button variant="primary" size="md" onClick={handleNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Next Step
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                onClick={handleSubmitProgram}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                {!isConnected ? 'Connect Wallet & Create' : 'Deploy Program to Soroban'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Status Modal */}
      <TransactionStatusModal
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          if (txState === 'confirmed') {
            router.push('/ngo/milestones?programId=1');
          }
        }}
        state={txState}
        txHash={txHash}
        errorMessage={errorMessage}
        title="Deploying Aid Program on Soroban"
      />
    </div>
  );
}
