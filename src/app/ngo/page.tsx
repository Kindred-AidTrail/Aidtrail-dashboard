'use client';

import React from 'react';
import Link from 'next/link';
import { useWallet } from '../../context/WalletContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  FolderPlus,
  Milestone,
  Ticket,
  Store,
  DollarSign,
  ShieldCheck,
  Users,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function NgoCommandCenterPage() {
  const { isConnected, address, connect } = useWallet();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="purple" size="md">NGO Command Center</Badge>
            <span className="text-xs text-slate-400 font-mono">Operations & Program Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Aid Program Operations Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create humanitarian programs, structure verifier-approved milestones, issue solvency-backed vouchers, and manage whitelisted merchant vendors.
          </p>
        </div>

        {!isConnected ? (
          <Button variant="primary" size="md" onClick={connect} leftIcon={<Sparkles className="w-4 h-4" />}>
            Connect NGO Wallet
          </Button>
        ) : (
          <Link href="/ngo/create">
            <Button variant="primary" size="md" leftIcon={<FolderPlus className="w-4 h-4" />}>
              Create New Program
            </Button>
          </Link>
        )}
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Active Programs</span>
            <FolderPlus className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">3</div>
          <div className="text-[11px] text-purple-400 font-medium mt-1">2 in Kenya, 1 in Somalia</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Escrow Funds</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">$485,000</div>
          <div className="text-[11px] text-emerald-400 mt-1">$215,000 verified & released</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Vouchers Issued</span>
            <Ticket className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">1,240</div>
          <div className="text-[11px] text-slate-400 mt-1">94% redemption completion rate</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Registered Vendors</span>
            <Store className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">28</div>
          <div className="text-[11px] text-amber-400 mt-1">Across 4 essential supply categories</div>
        </Card>
      </div>

      {/* Module Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/ngo/create" className="group block">
          <Card className="h-full border-white/10 group-hover:border-purple-500/50 transition-all bg-slate-900/70 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit group-hover:scale-105 transition-transform">
                <FolderPlus className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg text-white">1. Program Creation Wizard</CardTitle>
              <CardDescription className="text-xs text-slate-400 leading-relaxed">
                Configure smart contract parameters, multi-verifier quorum thresholds, target funding limits, and humanitarian mission metadata.
              </CardDescription>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs text-purple-400 font-semibold">
              <span>Launch Wizard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href="/ngo/milestones" className="group block">
          <Card className="h-full border-white/10 group-hover:border-cyan-500/50 transition-all bg-slate-900/70 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit group-hover:scale-105 transition-transform">
                <Milestone className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg text-white">2. Milestones & Evidence</CardTitle>
              <CardDescription className="text-xs text-slate-400 leading-relaxed">
                Add deliverables, attach IPFS proof documents and photographs, and monitor M-of-N independent verifier approvals for tranche release.
              </CardDescription>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs text-cyan-400 font-semibold">
              <span>Manage Milestones</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href="/ngo/vouchers" className="group block">
          <Card className="h-full border-white/10 group-hover:border-emerald-500/50 transition-all bg-slate-900/70 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit group-hover:scale-105 transition-transform">
                <Ticket className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg text-white">3. Batch Voucher Distribution</CardTitle>
              <CardDescription className="text-xs text-slate-400 leading-relaxed">
                Issue cryptographic aid vouchers with strict solvency validation against released funds, custom categories, and expiration dates.
              </CardDescription>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <span>Issue Vouchers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Vendors Link Section */}
      <Card className="border-white/10 bg-slate-900/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Vendor Directory & Whitelist Registration</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Onboard and approve merchant vendors permitted to accept and settle beneficiary vouchers.
            </p>
          </div>
        </div>
        <Link href="/ngo/vendors">
          <Button variant="secondary" size="md" leftIcon={<Store className="w-4 h-4 text-amber-400" />}>
            Open Vendor Directory
          </Button>
        </Link>
      </Card>
    </div>
  );
}
