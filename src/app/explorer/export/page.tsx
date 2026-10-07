'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { API_CONFIG } from '../../../config/constants';
import { ArrowLeft, FileSpreadsheet, Download, ShieldCheck, Database, Check } from 'lucide-react';

export default function ExportAuditReportsPage() {
  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  const handleDownloadCsv = (type: 'disbursements' | 'milestones') => {
    setDownloadingType(type);
    const url = `${API_CONFIG.REGISTRY_API_URL}/api/v1/audit/export/csv?type=${type}`;
    window.open(url, '_blank');
    setTimeout(() => setDownloadingType(null), 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Link href="/explorer" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Programs Directory</span>
      </Link>

      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="cyan" size="md">Auditor Toolkit</Badge>
          <span className="text-xs text-slate-400 font-mono">Open Data Initiative</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Streaming CSV Audit Exports
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Download tamper-evident, machine-readable datasets of all on-chain humanitarian transactions for external watchdog analysis, ESG reporting, and academic research.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report 1: Disbursements */}
        <Card className="flex flex-col justify-between border-white/10 hover:border-emerald-500/40">
          <div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg mb-2">Voucher Disbursements Ledger</CardTitle>
            <CardDescription className="text-xs leading-relaxed text-slate-300">
              Full transaction log of every voucher issued, redeemed, or reclaimed. Contains pseudonymized recipient hashes, merchant recipient addresses, ledger block numbers, and transaction hashes.
            </CardDescription>

            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1 text-[11px] font-mono text-slate-400">
              <p>Format: CSV (Comma-Separated)</p>
              <p>Encoding: UTF-8</p>
              <p>Privacy: GDPR Pseudonymized</p>
            </div>
          </div>

          <div className="pt-6">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              isLoading={downloadingType === 'disbursements'}
              onClick={() => handleDownloadCsv('disbursements')}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Disbursements CSV
            </Button>
          </div>
        </Card>

        {/* Report 2: Milestones */}
        <Card className="flex flex-col justify-between border-white/10 hover:border-cyan-500/40">
          <div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit mb-4">
              <Database className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg mb-2">Milestones & Verifier Consensus</CardTitle>
            <CardDescription className="text-xs leading-relaxed text-slate-300">
              Complete chronological audit of program tranches, requested release sums, verifier attestation signatures, and IPFS photographic evidence URIs.
            </CardDescription>

            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1 text-[11px] font-mono text-slate-400">
              <p>Format: CSV (Comma-Separated)</p>
              <p>Encoding: UTF-8</p>
              <p>Evidence: IPFS Hash Linked</p>
            </div>
          </div>

          <div className="pt-6">
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              isLoading={downloadingType === 'milestones'}
              onClick={() => handleDownloadCsv('milestones')}
              leftIcon={<Download className="w-4 h-4 text-cyan-400" />}
            >
              Download Milestones CSV
            </Button>
          </div>
        </Card>
      </div>

      <div className="glass-panel rounded-2xl p-6 border-white/10 space-y-3 text-xs text-slate-300">
        <h4 className="font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Cryptographic Reproducibility Guarantee</span>
        </h4>
        <p className="leading-relaxed">
          All CSV datasets generated by AidTrail correspond 1-to-1 with on-chain Soroban events published to the Stellar network. Anyone can independently verify every ledger block and transaction hash by running our open-source indexer worker or querying the Soroban RPC directly.
        </p>
      </div>
    </div>
  );
}
