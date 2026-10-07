'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '../../services/api-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AID_CATEGORIES } from '../../config/constants';
import {
  Search,
  Filter,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function ExplorerPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const cat = selectedCategory === 'ALL' ? undefined : selectedCategory;
        const res = await apiClient.getPrograms(1, 20, cat);
        setPrograms(res.programs || []);
      } catch (err) {
        console.error('Error fetching programs:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedCategory]);

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.onChainId.toString().includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan" size="md">
              Zero Login Required
            </Badge>
            <span className="text-xs text-slate-400">Public Audit Trail</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Humanitarian Disbursement Ledger
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time public transparency for all humanitarian aid programs. Verify on-chain solvency invariants, inspect milestone evidence, and trace grant disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/explorer/vouchers">
            <Button variant="secondary" size="sm">
              Vouchers Feed
            </Button>
          </Link>
          <Link href="/explorer/payouts">
            <Button variant="secondary" size="sm">
              Vendor Payouts
            </Button>
          </Link>
          <Link href="/explorer/export">
            <Button variant="outline" size="sm" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
              CSV Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96">
          <Input
            placeholder="Search programs by title or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={clsx(
              'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border',
              selectedCategory === 'ALL'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/20'
            )}
          >
            All Categories
          </button>
          {Object.values(AID_CATEGORIES).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border',
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-white/5 hover:border-white/20'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Program Cards Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading verified on-chain programs...</p>
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-2xl space-y-2">
          <h3 className="text-base font-semibold text-white">No Programs Found</h3>
          <p className="text-xs text-slate-400">No aid programs matched your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => {
            const funded = BigInt(prog.totalFunded || '0');
            const target = BigInt(prog.targetAmount || '1');
            const fundedPercent = Math.min(100, Number((funded * BigInt(100)) / target));
            const categoryMeta = AID_CATEGORIES[prog.category] || AID_CATEGORIES.FOOD;

            return (
              <Card key={prog.id} className="flex flex-col justify-between hover:border-emerald-500/40">
                <div>
                  {/* Card Header Top */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border"
                      style={{
                        backgroundColor: categoryMeta.bgColor,
                        color: categoryMeta.color,
                        borderColor: categoryMeta.borderColor,
                      }}
                    >
                      {categoryMeta.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Program #{prog.onChainId.toString()}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <CardTitle className="text-lg leading-snug line-clamp-1 mb-2">
                    {prog.title}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2 leading-relaxed mb-4">
                    {prog.description}
                  </CardDescription>

                  {/* Funding Progress Bar */}
                  <div className="space-y-1.5 py-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Escrow Funded:</span>
                      <span className="font-semibold text-emerald-400">{fundedPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${fundedPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-0.5">
                      <span>{(Number(prog.totalFunded) / 1e7).toLocaleString()} XLM</span>
                      <span>Target: {(Number(prog.targetAmount) / 1e7).toLocaleString()} XLM</span>
                    </div>
                  </div>

                  {/* Disbursal Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Released</span>
                      <p className="font-mono text-slate-200">
                        {(Number(prog.totalReleased) / 1e7).toLocaleString()} XLM
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Redeemed</span>
                      <p className="font-mono text-cyan-400 font-semibold">
                        {(Number(prog.totalRedeemed) / 1e7).toLocaleString()} XLM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-6">
                  <Link href={`/explorer/program/${prog.onChainId.toString()}`}>
                    <Button variant="secondary" size="sm" className="w-full justify-between">
                      <span>Inspect Audit Trail</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
