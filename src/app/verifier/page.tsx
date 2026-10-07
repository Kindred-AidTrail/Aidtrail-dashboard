'use client';

import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import TransactionStatusModal from '../../components/ui/TransactionStatusModal';
import { contractClient } from '../../lib/contract-client';
import {
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  Clock,
  ExternalLink,
  DollarSign,
  AlertOctagon,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Sparkles,
  Users
} from 'lucide-react';

interface PendingMilestone {
  id: number;
  programId: number;
  programTitle: string;
  ngoName: string;
  title: string;
  description: string;
  releaseAmount: number;
  evidenceCid: string;
  evidencePhotos: string[];
  evidenceNotes: string;
  currentApprovals: number;
  requiredQuorum: number;
  signers: string[];
  hasCurrentSigned: boolean;
}

const PENDING_MILESTONES: PendingMilestone[] = [
  {
    id: 3,
    programId: 1,
    programTitle: 'Turkana Clean Water & Borehole Initiative',
    ngoName: 'Oasis Relief East Africa',
    title: 'Water Distribution Points & Community Kiosks',
    description: 'Construction of 6 community tap stands, piping connections to borehole pump, and sanitary concrete washing aprons in Kakuma.',
    releaseAmount: 37500,
    evidenceCid: 'bafybeif9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6',
    evidencePhotos: [
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1578496781379-7dcfb995293d?auto=format&fit=crop&w=600&q=80'
    ],
    evidenceNotes: 'Geotagged inspections conducted on 2026-10-04. Flow rate verified at 18.5 m³/hr with WHO safe drinking standards certified by Kenya Ministry of Water.',
    currentApprovals: 1,
    requiredQuorum: 2,
    signers: ['Kenya Red Cross Verifier (GDUKM...4AOP)'],
    hasCurrentSigned: false
  },
  {
    id: 2,
    programId: 2,
    programTitle: 'Dadaab Refugee Nutritional Security Tranche 4',
    ngoName: 'Global Care Coalition',
    title: 'High-Protein Nutrient Flour & Infant Formula Distribution',
    description: 'Warehouse delivery receipt and biometric distribution logs for 12,000 enrolled infant mothers.',
    releaseAmount: 60000,
    evidenceCid: 'bafybeic7r3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    evidencePhotos: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80'
    ],
    evidenceNotes: 'Verified biometric deduplication logs against UNHCR database. Zero double-claim anomalies detected.',
    currentApprovals: 0,
    requiredQuorum: 2,
    signers: [],
    hasCurrentSigned: false
  }
];

export default function VerifierPortalPage() {
  const { isConnected, address, connect } = useWallet();
  const [activeMilestones, setActiveMilestones] = useState<PendingMilestone[]>(PENDING_MILESTONES);
  const [selectedMilestone, setSelectedMilestone] = useState<PendingMilestone>(PENDING_MILESTONES[0]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [txState, setTxState] = useState<'simulating' | 'signing' | 'submitting' | 'confirmed' | 'failed'>('simulating');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApproveMilestone = async (milestone: PendingMilestone) => {
    if (!isConnected || !address) {
      connect();
      return;
    }

    setIsSubmitting(true);
    setStatusModalOpen(true);
    setTxState('simulating');
    setErrorMessage(null);

    try {
      const simResult = await contractClient.releaseMilestone(
        milestone.programId,
        milestone.id,
        address
      );

      if (!simResult.success) {
        setTxState('failed');
        setErrorMessage(simResult.error || 'Milestone approval simulation failed: Verifier not authorized or already signed.');
        setIsSubmitting(false);
        return;
      }

      setTxState('signing');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTxState('submitting');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockHash = '8d7c6b5a4e3f2109fedcba0987654321abcdef0123456789abcdef0123456789';
      setTxHash(mockHash);
      setTxState('confirmed');

      // Update state
      setActiveMilestones((prev) =>
        prev.map((m) =>
          m.id === milestone.id
            ? {
                ...m,
                currentApprovals: m.currentApprovals + 1,
                hasCurrentSigned: true,
                signers: [...m.signers, `Current Verifier (${address.substring(0, 6)}...${address.substring(address.length - 4)})`]
              }
            : m
        )
      );

      setSelectedMilestone((prev) => ({
        ...prev,
        currentApprovals: prev.currentApprovals + 1,
        hasCurrentSigned: true,
        signers: [...prev.signers, `Current Verifier (${address.substring(0, 6)}...${address.substring(address.length - 4)})`]
      }));
    } catch (err: any) {
      setTxState('failed');
      setErrorMessage(err.message || 'Milestone verification signature failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="cyan" size="md">Independent Verifier Quorum</Badge>
            <span className="text-xs text-slate-400 font-mono">M-of-N Cryptographic Attestation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Milestone Verification & Attestation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review physical deliverable evidence, geotagged proof photographs, and sign Soroban release transactions to unlock escrow tranches.
          </p>
        </div>

        {!isConnected && (
          <Button variant="primary" size="md" onClick={connect} leftIcon={<Sparkles className="w-4 h-4" />}>
            Connect Verifier Wallet
          </Button>
        )}
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Pending Your Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {activeMilestones.filter((m) => !m.hasCurrentSigned).length} Milestones
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Requiring independent multi-sig signoff</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Escrow Pending</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">$97,500 USDC</div>
          <div className="text-[11px] text-slate-400 mt-1">Across 2 humanitarian tranches</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Lifetime Attestations</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">18 Tranches</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% cryptographic reproducibility</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Queue List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Pending Milestone Pipeline ({activeMilestones.length})
          </h3>

          <div className="space-y-3">
            {activeMilestones.map((m) => {
              const isSelected = selectedMilestone.id === m.id;
              const hasReachedQuorum = m.currentApprovals >= m.requiredQuorum;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMilestone(m)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500'
                      : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-cyan-400">Prog #{m.programId} - M#{m.id}</span>
                    <Badge variant={m.hasCurrentSigned ? 'emerald' : 'amber'} size="sm">
                      {m.hasCurrentSigned ? 'Signed by You' : 'Signature Pending'}
                    </Badge>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{m.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{m.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="font-mono font-bold text-emerald-400">${m.releaseAmount.toLocaleString()} USDC</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Quorum: {m.currentApprovals} / {m.requiredQuorum}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Inspection & Signoff (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-white/10 bg-slate-900/80">
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="cyan">{selectedMilestone.programTitle}</Badge>
                <span className="text-xs font-mono text-slate-400">NGO: {selectedMilestone.ngoName}</span>
              </div>
              <CardTitle className="text-xl mt-2 text-white">{selectedMilestone.title}</CardTitle>
              <CardDescription className="text-xs leading-relaxed text-slate-300">
                {selectedMilestone.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Quorum Progress Bar */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Independent Verifier Consensus</span>
                  </span>
                  <span className="font-mono font-bold text-cyan-400">
                    {selectedMilestone.currentApprovals} of {selectedMilestone.requiredQuorum} Signatures Collected
                  </span>
                </div>

                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (selectedMilestone.currentApprovals / selectedMilestone.requiredQuorum) * 100)}%`
                    }}
                  />
                </div>

                {selectedMilestone.signers.length > 0 && (
                  <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300 block">Existing Signatures:</span>
                    {selectedMilestone.signers.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* IPFS Photographic Evidence */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <span>Field Deliverable Evidence</span>
                  </h4>
                  <a
                    href={`https://ipfs.io/ipfs/${selectedMilestone.evidenceCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                  >
                    <span>IPFS CID: {selectedMilestone.evidenceCid.substring(0, 10)}...</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {selectedMilestone.evidencePhotos.map((photoUrl, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-white/10 group aspect-video">
                      <img
                        src={photoUrl}
                        alt="Evidence photograph"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] text-slate-300 font-mono flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>Turkana, Kenya (Geotagged)</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-300 italic bg-slate-950/60 p-3 rounded-xl border border-white/5 mt-3">
                  "{selectedMilestone.evidenceNotes}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {selectedMilestone.hasCurrentSigned ? (
                  <Alert variant="success" title="Milestone Attestation Signed">
                    You have already provided your cryptographic signature for this milestone release tranche.
                  </Alert>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      isLoading={isSubmitting}
                      onClick={() => handleApproveMilestone(selectedMilestone)}
                      leftIcon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
                    >
                      {!isConnected ? 'Connect Wallet & Sign' : `Sign & Unlock $${selectedMilestone.releaseAmount.toLocaleString()} USDC`}
                    </Button>

                    <Button
                      variant="ghost"
                      size="lg"
                      className="hover:text-red-400 hover:bg-red-500/10"
                      leftIcon={<AlertOctagon className="w-4 h-4" />}
                      onClick={() => alert('Discrepancy report recorded in auditor audit trail.')}
                    >
                      Flag Discrepancy
                    </Button>
                  </div>
                )}
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
        title="Signing Milestone Attestation on Soroban"
      />
    </div>
  );
}
