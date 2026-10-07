'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import {
  ShieldCheck,
  Eye,
  HeartHandshake,
  Users,
  Store,
  Award,
  ArrowRight,
  TrendingUp,
  Lock,
  QrCode,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '../i18n/context';

export default function HomePage() {
  const { t } = useI18n();

  const liveMetrics = [
    {
      label: t.metrics.totalFunded,
      value: '1,250,000 XLM',
      usd: '~$142,500 USD',
      change: '+14.2% this month',
      color: 'emerald',
    },
    {
      label: t.metrics.totalReleased,
      value: '820,000 XLM',
      usd: 'Verified by M-of-N consensus',
      change: '100% On-Chain Evidence',
      color: 'cyan',
    },
    {
      label: t.metrics.vouchersRedeemed,
      value: '1,250 Vouchers',
      usd: '38 Whitelisted Merchants',
      change: 'Zero intermediary loss',
      color: 'violet',
    },
    {
      label: t.metrics.solvencyRatio,
      value: '100.0% Solvency',
      usd: 'Funded ≥ Released ≥ Allocated',
      change: 'Cryptographically Proven',
      color: 'amber',
    },
  ];

  const rolePortals = [
    {
      title: t.roles.donor,
      badge: 'Capital Providers',
      desc: 'Lock donations into audited Soroban escrow. Track impact in real-time and reclaim unreleased funds if programs cancel.',
      href: '/donor',
      icon: HeartHandshake,
      action: 'Fund a Program',
      gradient: 'from-emerald-500/10 to-transparent hover:border-emerald-500/40',
    },
    {
      title: t.roles.ngo,
      badge: 'Relief Agencies',
      desc: 'Initialize aid programs, propose measurable milestones, upload evidence, and issue vouchers in bulk to verified households.',
      href: '/ngo',
      icon: ShieldCheck,
      action: 'Manage Programs',
      gradient: 'from-cyan-500/10 to-transparent hover:border-cyan-500/40',
    },
    {
      title: t.roles.verifier,
      badge: 'Independent Consensus',
      desc: 'Inspect IPFS evidence and field photos. Sign milestone approvals using M-of-N threshold signatures to release tranches.',
      href: '/verifier',
      icon: Award,
      action: 'Audit Milestones',
      gradient: 'from-violet-500/10 to-transparent hover:border-violet-500/40',
    },
    {
      title: t.roles.beneficiary,
      badge: 'Aid Recipients',
      desc: 'Low-bandwidth, mobile-first voucher wallet. Display offline-ready QR codes at local whitelisted merchants to receive groceries.',
      href: '/beneficiary',
      icon: Users,
      action: 'Open Voucher Wallet',
      gradient: 'from-amber-500/10 to-transparent hover:border-amber-500/40',
    },
    {
      title: t.roles.vendor,
      badge: 'Local Merchants',
      desc: 'Scan recipient QR codes using any device camera. Receive direct, guaranteed contract token payouts into your merchant wallet.',
      href: '/vendor',
      icon: Store,
      action: 'Merchant Terminal',
      gradient: 'from-blue-500/10 to-transparent hover:border-blue-500/40',
    },
    {
      title: t.roles.explorer,
      badge: 'Zero Login Required',
      desc: 'Public audit directory. Search programs, verify solvency formulas, view pseudonymous voucher feeds, and stream tamper-evident CSV reports.',
      href: '/explorer',
      icon: Eye,
      action: 'Explore Audit Ledger',
      gradient: 'from-slate-500/10 to-transparent hover:border-slate-500/40',
    },
  ];

  return (
    <div className="space-y-24 py-4">
      {/* 1. Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-semibold text-emerald-400 border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Soroban Smart Contracts v22 • Stellar Testnet First</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-white leading-tight sm:leading-none">
          Transparent Aid Disbursement <br className="hidden sm:inline" />
          <span className="text-gradient">Backed by Cryptographic Proof</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.tagline}. Donor capital stays locked in Soroban contracts until independent auditors verify milestones. NGOs issue targeted digital vouchers; local merchants receive direct automated settlement.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/explorer">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Explore Public Audit Trail
            </Button>
          </Link>
          <Link href="/donor">
            <Button variant="secondary" size="lg" leftIcon={<HeartHandshake className="w-5 h-5 text-emerald-400" />}>
              Fund a Program
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Live Transparency Metrics Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveMetrics.map((metric, i) => (
          <Card key={i} className="border-white/5 hover:border-emerald-500/30">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400">{metric.label}</span>
              <div className="text-2xl font-bold font-display text-white">{metric.value}</div>
              <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                <span>{metric.usd}</span>
                <span className="text-emerald-400 font-semibold">{metric.change}</span>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* 3. Role Portals Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Role-Based Humanitarian Workflows
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Choose your role to interact with smart contract disbursals or audit the flow of funds in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rolePortals.map((portal) => {
            const Icon = portal.icon;
            return (
              <Card
                key={portal.title}
                className={`bg-gradient-to-b ${portal.gradient} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-emerald-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {portal.badge}
                    </span>
                  </div>
                  <CardTitle className="text-xl mb-2">{portal.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed text-slate-300">
                    {portal.desc}
                  </CardDescription>
                </div>

                <div className="pt-6">
                  <Link href={portal.href} className="w-full">
                    <Button variant="secondary" size="sm" className="w-full justify-between">
                      <span>{portal.action}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. The 4-Stage Transparent Aid Cycle Flow */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden border-emerald-500/20">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <Badge variant="cyan" size="md">
            The Trust Architecture
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
            How AidTrail Protects Every Single Donation
          </h2>
          <p className="text-sm text-slate-300">
            Smart contract guarantees eliminate leakage, bribery, and administrative diversion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-semibold text-white text-base">Locked Escrow</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Donors fund the aid program. Tokens are locked inside Soroban smart contract custody with non-custodial proportional refund rights.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-semibold text-white text-base">M-of-N Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              NGOs submit milestone completion evidence to IPFS. Independent verifiers inspect proof and sign on-chain approvals to unlock funds.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-semibold text-white text-base">Targeted Vouchers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              NGOs batch-issue claimable balance vouchers to verified beneficiaries, strictly locked to certified merchant categories (Food, Health).
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="font-semibold text-white text-base">Direct Merchant Payout</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Beneficiaries redeem QR codes at whitelisted merchants. Contract transfers tokens directly to the vendor with zero intermediary hands.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
