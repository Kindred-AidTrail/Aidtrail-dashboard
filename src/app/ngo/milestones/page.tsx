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
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  DollarSign,
  FileCheck2,
  Layers,
  Sparkles
} from 'lucide-react';

interface MilestoneItem {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RELEASED';
  evidenceCid: string;
  approvalsCount: number;
  threshold: number;
  approvedBy: string[];
}

export default function NgoMilestonesPage() {
  const { isConnected, address, connect } = useWallet();
  const [selectedProgramId, setSelectedProgramId] = useState<number>(1);

  const [milestones, setMilestones] = useState<MilestoneItem[]>([
    {
      id: 1,
      title: 'Geological Survey & Borehole Drilling',
      description: 'Completion of 3 deep aquifer boreholes in Lodwar and surrounding rural pastoral communities.',
      amount: 35000,
      status: 'RELEASED',
      evidenceCid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
      approvalsCount: 2,
      threshold: 2,
      approvedBy: ['Kenya Red Cross Verifier', 'UNICEF Field Unit']
    },
    {
      id: 2,
      title: 'Solar Pump Installation & Storage Towers',
      description: 'Installation of three 10,000-liter elevated poly tanks and Grundfos solar submersible pumps.',
      amount: 40000,
      status: 'RELEASED',
      evidenceCid: 'bafybeic7r3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
      approvalsCount: 2,
      threshold: 2,
      approvedBy: ['Kenya Red Cross Verifier', 'Oxfam Regional Auditor']
    },
    {
      id: 3,
      title: 'Water Distribution Points & Community Kiosks',
      description: 'Construction of 6 community tap stands and sanitary washing zones.',
      amount: 37500,
      status: 'UNDER_REVIEW',
      evidenceCid: 'bafybeif9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6',
      approvalsCount: 1,
      threshold: 2,
      approvedBy: ['Kenya Red Cross Verifier']
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('25000');
  const [newEvidenceCid, setNewEvidenceCid] = useState('bafybeig4u3j2l1k0z9x8c7v6b5n4m3a2s1d0f9g8h7j6k5l4z3x2c1v0b');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [txState, setTxState] = useState<'simulating' | 'signing' | 'submitting' | 'confirmed' | 'failed'>('simulating');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalAllocated = milestones.reduce((sum, m) => sum + m.amount, 0);
  const totalReleased = milestones.filter((m) => m.status === 'RELEASED').reduce((sum, m) => sum + m.amount, 0);
  const programBudget = 150000;
  const unallocatedBudget = programBudget - totalAllocated;

  const handleCreateMilestone = async () => {
    if (!newTitle.trim()) {
      alert('Please enter a milestone title.');
      return;
    }
    const numAmt = parseFloat(newAmount);
    if (isNaN(numAmt) || numAmt <= 0) {
      alert('Please enter a valid milestone release sum.');
      return;
    }

    setIsSubmitting(true);
    setStatusModalOpen(true);
    setTxState('simulating');
    setErrorMessage(null);

    try {
      const amountUnits = toStroops(numAmt);
      const simResult = await contractClient.addMilestone(
        selectedProgramId,
        amountUnits,
        newEvidenceCid,
        address || 'GDEMO...'
      );

      if (!simResult.success) {
        setTxState('failed');
        setErrorMessage(simResult.error || 'Milestone simulation failed: Program budget exceeded.');
        setIsSubmitting(false);
        return;
      }

      setTxState('signing');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTxState('submitting');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockHash = '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b';
      setTxHash(mockHash);
      setTxState('confirmed');

      // Add to local state
      setMilestones((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          title: newTitle,
          description: newDescription,
          amount: numAmt,
          status: 'PENDING',
          evidenceCid: newEvidenceCid,
          approvalsCount: 0,
          threshold: 2,
          approvedBy: []
        }
      ]);

      setShowAddModal(false);
      setNewTitle('');
      setNewDescription('');
    } catch (err: any) {
      setTxState('failed');
      setErrorMessage(err.message || 'Milestone registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back link */}
      <Link href="/ngo" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to NGO Command Center</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="purple" size="md">Milestone Management</Badge>
            <span className="text-xs text-slate-400 font-mono">Multi-Sig Escrow Tranches</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Program Milestones & Verifier Tranches
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Define programmatic funding tranches tied to verifiable physical deliverables. Each tranche unlocks when independent verifiers reach quorum.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Milestone
        </Button>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Escrow Budget</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">${programBudget.toLocaleString()} USDC</div>
          <div className="text-[11px] text-slate-400 mt-1">Program #1: Turkana Borehole Project</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Allocated to Milestones</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">${totalAllocated.toLocaleString()} USDC</div>
          <div className="text-[11px] text-slate-400 mt-1">
            ${unallocatedBudget.toLocaleString()} unallocated headroom
          </div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Verified & Released</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">${totalReleased.toLocaleString()} USDC</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">2 of 3 milestones unlocked</div>
        </Card>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Active Tranches ({milestones.length})
        </h3>

        <div className="space-y-4">
          {milestones.map((m) => (
            <Card key={m.id} className="border-white/10 hover:border-white/20 transition-all bg-slate-900/70 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      Milestone #{m.id}
                    </span>
                    <h4 className="text-base font-bold text-white">{m.title}</h4>
                    {m.status === 'RELEASED' && <Badge variant="emerald" size="sm">Tranche Released</Badge>}
                    {m.status === 'UNDER_REVIEW' && <Badge variant="amber" size="sm">Under Verifier Review</Badge>}
                    {m.status === 'PENDING' && <Badge variant="purple" size="sm">Pending Verification</Badge>}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {m.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      Amount: ${m.amount.toLocaleString()} USDC
                    </span>
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verifier Quorum: {m.approvalsCount} of {m.threshold} Signed
                    </span>
                    <a
                      href={`https://ipfs.io/ipfs/${m.evidenceCid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-white underline decoration-white/20"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Evidence IPFS ({m.evidenceCid.substring(0, 10)}...)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-slate-400 tracking-wider block">Disbursement Sum</span>
                    <span className="text-lg font-bold font-mono text-white">${m.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <Card className="max-w-lg w-full border-purple-500/40 bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                <span>Add Program Milestone</span>
              </CardTitle>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Milestone Deliverable Title *
                </label>
                <Input
                  placeholder="e.g. Water Quality Testing & Lab Certification"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Milestone Scope & Requirements
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl bg-slate-950/80 border border-white/15 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe measurable physical evidence verifiers must confirm before release..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tranche Release Amount (USDC)
                </label>
                <Input
                  type="number"
                  placeholder="25000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  leftAddon="$"
                  helperText={`Max unallocated: $${unallocatedBudget.toLocaleString()} USDC`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  IPFS Photographic Evidence CID
                </label>
                <Input
                  placeholder="bafybei..."
                  value={newEvidenceCid}
                  onChange={(e) => setNewEvidenceCid(e.target.value)}
                  className="font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <Button variant="ghost" size="md" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                onClick={handleCreateMilestone}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Register Milestone on Soroban
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Transaction Status Modal */}
      <TransactionStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        state={txState}
        txHash={txHash}
        errorMessage={errorMessage}
        title="Registering Milestone Tranche on Soroban"
      />
    </div>
  );
}
