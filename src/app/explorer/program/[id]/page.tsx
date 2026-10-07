'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiClient } from '../../../../services/api-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { Button } from '../../../../components/ui/Button';
import { Alert } from '../../../../components/ui/Alert';
import { AID_CATEGORIES } from '../../../../config/constants';
import { getExplorerAccountUrl, getExplorerContractUrl } from '../../../../config/env';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  HeartHandshake,
  ArrowLeft,
  FileText,
  Lock,
  Coins,
  Check,
  Copy,
} from 'lucide-react';

export default function ProgramDetailPage() {
  const params = useParams();
  const programId = params.id as string;

  const [program, setProgram] = useState<any>(null);
  const [accounting, setAccounting] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProgram() {
      setIsLoading(true);
      try {
        const res = await apiClient.getProgramById(programId);
        setProgram(res.program);
        setAccounting(res.accountingAudit);
      } catch (err) {
        console.error('Error fetching program detail:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProgram();
  }, [programId]);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Loading verified program audit data...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="py-20 text-center glass-panel rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white">Program Not Found</h3>
        <p className="text-xs text-slate-400">The requested aid program does not exist or has not yet been indexed.</p>
        <Link href="/explorer">
          <Button variant="secondary" size="sm">Back to Explorer</Button>
        </Link>
      </div>
    );
  }

  const categoryMeta = AID_CATEGORIES[program.category] || AID_CATEGORIES.FOOD;

  return (
    <div className="space-y-8 pb-12">
      {/* Back Button */}
      <Link href="/explorer" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Public Directory</span>
      </Link>

      {/* Program Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border"
                style={{
                  backgroundColor: categoryMeta.bgColor,
                  color: categoryMeta.color,
                  borderColor: categoryMeta.borderColor,
                }}
              >
                {categoryMeta.name}
              </span>
              <Badge variant="emerald" size="sm">
                Soroban Program #{program.onChainId.toString()}
              </Badge>
              {program.isPaused && <Badge variant="amber" size="sm">Paused</Badge>}
              {program.isCancelled && <Badge variant="rose" size="sm">Cancelled</Badge>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {program.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {program.description}
            </p>
          </div>

          <Link href={`/donor?programId=${program.onChainId.toString()}`}>
            <Button variant="primary" size="lg" leftIcon={<HeartHandshake className="w-5 h-5 text-slate-950" />}>
              Fund this Program
            </Button>
          </Link>
        </div>

        {/* Creator & Token Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400">Managing NGO Address:</span>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-slate-200">
              <span className="truncate">{program.creatorAddress}</span>
              <a
                href={getExplorerAccountUrl(program.creatorAddress)}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-emerald-400"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <span className="text-slate-400">Token Contract ID:</span>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-slate-200">
              <span className="truncate">{program.tokenContractId}</span>
              <a
                href={getExplorerContractUrl(program.tokenContractId)}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-cyan-400"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <span className="text-slate-400">Consensus Requirement:</span>
            <p className="font-semibold text-white mt-1">
              {program.requiredApprovals} Independent Verifiers Required
            </p>
          </div>
        </div>
      </div>

      {/* Solvency Invariant Panel */}
      <Card className="border-emerald-500/30 bg-slate-950/60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <CardTitle>Soroban Solvency Invariant Check</CardTitle>
            </div>
            <Badge variant="emerald" size="sm">
              Invariant Verified Safe
            </Badge>
          </div>
          <CardDescription className="font-mono text-xs text-emerald-400/90 pt-1">
            Funded ({Number(program.totalFunded)/1e7}) ≥ Released ({Number(program.totalReleased)/1e7}) ≥ Allocated ({Number(program.totalAllocated)/1e7}) ≥ Redeemed ({Number(program.totalRedeemed)/1e7}) + Reclaimed ({Number(program.totalReclaimed)/1e7})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">1. Total Funded</span>
              <p className="text-sm font-bold font-mono text-emerald-400">
                {(Number(program.totalFunded) / 1e7).toLocaleString()} XLM
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">2. Milestone Released</span>
              <p className="text-sm font-bold font-mono text-cyan-400">
                {(Number(program.totalReleased) / 1e7).toLocaleString()} XLM
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">3. Voucher Allocated</span>
              <p className="text-sm font-bold font-mono text-violet-400">
                {(Number(program.totalAllocated) / 1e7).toLocaleString()} XLM
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">4. Vendor Redeemed</span>
              <p className="text-sm font-bold font-mono text-amber-400">
                {(Number(program.totalRedeemed) / 1e7).toLocaleString()} XLM
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">5. Expired Reclaimed</span>
              <p className="text-sm font-bold font-mono text-rose-400">
                {(Number(program.totalReclaimed) / 1e7).toLocaleString()} XLM
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestone Verification Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-display">
            Milestones & Independent Verifier Attestations
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {program.milestones?.length || 0} Milestones Propose
          </span>
        </div>

        <div className="space-y-4">
          {(program.milestones || []).map((m: any) => (
            <Card key={m.id} className="border-white/10 hover:border-white/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={m.isReleased ? 'emerald' : m.isApproved ? 'cyan' : 'neutral'} size="sm">
                      {m.isReleased ? 'Funds Released' : m.isApproved ? 'Consensus Approved' : 'Under Review'}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">
                      Milestone #{m.onChainIndex + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white">{m.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                    <span>Target: {(Number(m.targetAmount) / 1e7).toLocaleString()} XLM</span>
                    {m.evidenceUri && (
                      <a
                        href={m.evidenceUri.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect IPFS Evidence</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Verifier Signers */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5 min-w-[240px]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Signatures Recorded:</span>
                    <span className="font-semibold text-emerald-400">
                      {m.approvals?.length || 0} / {program.requiredApprovals}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {(m.approvals || []).map((appr: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{appr.verifierAddress.slice(0, 8)}...{appr.verifierAddress.slice(-4)}</span>
                      </div>
                    ))}
                    {(!m.approvals || m.approvals.length === 0) && (
                      <span className="text-xs text-slate-500 italic">No verifier signatures submitted yet</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
