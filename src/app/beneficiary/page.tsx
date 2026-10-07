'use client';

import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  QrCode,
  Droplets,
  Apple,
  Pill,
  Home,
  Clock,
  CheckCircle2,
  MapPin,
  Store,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  WifiOff
} from 'lucide-react';
import VoucherQrModal from '../../components/beneficiary/VoucherQrModal';

interface BeneficiaryVoucher {
  id: number;
  programId: number;
  category: 'WATER' | 'FOOD' | 'HEALTH' | 'SHELTER';
  categoryLabel: string;
  amountUsd: number;
  remainingAmountUsd: number;
  merchantRestriction: string;
  expiresAt: string;
  isExpiringSoon: boolean;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED';
  securityToken: string;
}

const BENEFICIARY_VOUCHERS: BeneficiaryVoucher[] = [
  {
    id: 101,
    programId: 1,
    category: 'WATER',
    categoryLabel: 'Clean Drinking Water',
    amountUsd: 50,
    remainingAmountUsd: 50,
    merchantRestriction: 'Whitelisted Water Kiosks & Distribution Points',
    expiresAt: '2026-11-05',
    isExpiringSoon: false,
    status: 'ACTIVE',
    securityToken: 'AID-WAT-9042-8819'
  },
  {
    id: 102,
    programId: 2,
    category: 'FOOD',
    categoryLabel: 'Emergency Nutrition Rations',
    amountUsd: 75,
    remainingAmountUsd: 75,
    merchantRestriction: 'Authorized Grain Depots & Food Merchants',
    expiresAt: '2026-10-18',
    isExpiringSoon: true,
    status: 'ACTIVE',
    securityToken: 'AID-NUT-1124-7730'
  },
  {
    id: 98,
    programId: 1,
    category: 'HEALTH',
    categoryLabel: 'Primary Care & Pharmacy',
    amountUsd: 30,
    remainingAmountUsd: 0,
    merchantRestriction: 'Turkana Community Pharmacy',
    expiresAt: '2026-09-30',
    isExpiringSoon: false,
    status: 'REDEEMED',
    securityToken: 'AID-MED-4401-2291'
  }
];

export default function BeneficiaryWalletPage() {
  const { isConnected, address, connect } = useWallet();
  const [vouchers, setVouchers] = useState<BeneficiaryVoucher[]>(BENEFICIARY_VOUCHERS);
  const [selectedVoucherForQr, setSelectedVoucherForQr] = useState<BeneficiaryVoucher | null>(null);
  const [activeTab, setActiveTab] = useState<'vouchers' | 'merchants' | 'history'>('vouchers');

  const activeVouchers = vouchers.filter((v) => v.status === 'ACTIVE');
  const totalBalance = activeVouchers.reduce((acc, v) => acc + v.remainingAmountUsd, 0);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'WATER':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'FOOD':
        return <Apple className="w-5 h-5 text-emerald-400" />;
      case 'HEALTH':
        return <Pill className="w-5 h-5 text-purple-400" />;
      default:
        return <Home className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-12">
      {/* Mobile Header / Balance Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/60 via-slate-900 to-slate-950 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-purple-200 uppercase tracking-wider">Beneficiary Pass</span>
            </div>
            <Badge variant="purple" size="sm">AidTrail ID #4029</Badge>
          </div>

          <div>
            <span className="text-xs text-slate-300 block mb-1">Total Available Aid Balance</span>
            <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
              ${totalBalance}.00 <span className="text-sm font-sans font-normal text-purple-300">USDC</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-300">
            <span>{activeVouchers.length} Active Vouchers</span>
            <span className="flex items-center gap-1 text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Contract Escrow Guaranteed</span>
            </span>
          </div>
        </div>

        {/* Decorative blur circle */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-slate-900/80 p-1.5 border border-white/10 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('vouchers')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'vouchers'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          My Vouchers ({activeVouchers.length})
        </button>
        <button
          onClick={() => setActiveTab('merchants')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'merchants'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Nearby Merchants
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Redemption History
        </button>
      </div>

      {/* Tab: Vouchers List */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          {activeVouchers.map((voucher) => (
            <Card
              key={voucher.id}
              className="border-white/10 hover:border-purple-500/40 transition-all bg-slate-900/70 p-5 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    {getCategoryIcon(voucher.category)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{voucher.categoryLabel}</h4>
                    <span className="text-xs text-slate-400 block">{voucher.merchantRestriction}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-extrabold font-mono text-emerald-400">
                    ${voucher.remainingAmountUsd}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">USDC</span>
                </div>
              </div>

              {voucher.isExpiringSoon && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-300">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>Expires in 11 days ({voucher.expiresAt}). Redeem soon!</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs font-mono text-slate-400">Passcode: {voucher.securityToken}</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedVoucherForQr(voucher)}
                  leftIcon={<QrCode className="w-4 h-4" />}
                >
                  Show QR to Merchant
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Nearby Merchants */}
      {activeTab === 'merchants' && (
        <div className="space-y-3">
          {[
            {
              name: 'Lodwar Water Services Point #1',
              category: 'Clean Water',
              distance: '350 meters away',
              address: 'Lodwar Central Market Stand 14',
              isOpen: true
            },
            {
              name: 'Sahara Grain & Nutritional Depot',
              category: 'Food Rations',
              distance: '800 meters away',
              address: 'Kakuma Road Sector 2',
              isOpen: true
            },
            {
              name: 'Turkana Community Pharmacy',
              category: 'Medical',
              distance: '1.2 km away',
              address: 'Health Post Plaza',
              isOpen: false
            }
          ].map((m, idx) => (
            <Card key={idx} className="border-white/10 bg-slate-900/60 p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-semibold text-white">{m.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{m.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-cyan-400 font-mono">
                    <MapPin className="w-3 h-3" />
                    {m.distance}
                  </span>
                </div>
              </div>
              <Badge variant={m.isOpen ? 'emerald' : 'slate'} size="sm">
                {m.isOpen ? 'Open Now' : 'Closed'}
              </Badge>
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Redemption History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <Card className="border-white/10 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Medical Pharmacy Supplies</span>
                <span className="text-[11px] text-slate-400 font-mono">Redeemed at Turkana Community Pharmacy</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">2026-09-28 • Tx #489a...21c0</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-mono font-bold text-slate-300">-$30.00 USDC</span>
                <Badge variant="emerald" size="sm" className="mt-1">Completed</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedVoucherForQr && (
        <VoucherQrModal
          isOpen={!!selectedVoucherForQr}
          onClose={() => setSelectedVoucherForQr(null)}
          voucherId={selectedVoucherForQr.id}
          programId={selectedVoucherForQr.programId}
          category={selectedVoucherForQr.categoryLabel}
          amount={selectedVoucherForQr.remainingAmountUsd}
          securityToken={selectedVoucherForQr.securityToken}
          beneficiaryAddress={address || 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'}
        />
      )}
    </div>
  );
}
