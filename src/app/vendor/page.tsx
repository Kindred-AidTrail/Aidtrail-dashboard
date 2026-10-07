'use client';

import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import SettlementModal from '../../components/vendor/SettlementModal';
import {
  QrCode,
  Scan,
  Store,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  Wifi,
  WifiOff,
  Sparkles,
  Camera,
  ExternalLink
} from 'lucide-react';

interface ScannedVoucher {
  voucherId: number;
  programId: number;
  amount: number;
  category: string;
  beneficiary: string;
  token: string;
}

interface SettledTransaction {
  id: string;
  voucherId: number;
  amount: number;
  beneficiaryHash: string;
  timestamp: string;
  txHash: string;
  isOffline: boolean;
}

export default function VendorPortalPage() {
  const { isConnected, address, connect } = useWallet();

  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scannedVoucher, setScannedVoucher] = useState<ScannedVoucher | null>(null);
  const [settlementModalOpen, setSettlementModalOpen] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const [settledHistory, setSettledHistory] = useState<SettledTransaction[]>([
    {
      id: 'settle-1',
      voucherId: 101,
      amount: 50,
      beneficiaryHash: 'GBBD...FLA5',
      timestamp: '2026-10-07 14:22:10',
      txHash: '3f2e1d0c...9a8b',
      isOffline: false
    },
    {
      id: 'settle-2',
      voucherId: 94,
      amount: 25,
      beneficiaryHash: 'GDUK...4AOP',
      timestamp: '2026-10-07 11:05:40',
      txHash: '7c6b5a4e...2109',
      isOffline: false
    }
  ]);

  const vendorStoreName = 'Lodwar Water Services & Purification Co.';
  const vendorCategory = 'Clean Water';

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanError(null);

    setTimeout(() => {
      setIsScanning(false);
      // Simulated decoded voucher
      const decoded: ScannedVoucher = {
        voucherId: 105,
        programId: 1,
        amount: 50,
        category: 'Clean Water',
        beneficiary: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
        token: 'AID-WAT-9042-8819'
      };

      setScannedVoucher(decoded);
    }, 1200);
  };

  const handleManualLookup = () => {
    if (!manualCode.trim()) {
      setScanError('Please enter a voucher passcode.');
      return;
    }

    setScanError(null);
    const decoded: ScannedVoucher = {
      voucherId: 106,
      programId: 1,
      amount: 50,
      category: 'Clean Water',
      beneficiary: 'GCIZ42U2XEQA73B6Q76B6J5B7J3I56M6YJAZD5V4Q5P6L7N7O8P9Q1R2',
      token: manualCode.toUpperCase()
    };
    setScannedVoucher(decoded);
  };

  const handleSettlementSuccess = (hash: string, isOffline: boolean) => {
    if (!scannedVoucher) return;

    const newTx: SettledTransaction = {
      id: `settle-${Date.now()}`,
      voucherId: scannedVoucher.voucherId,
      amount: scannedVoucher.amount,
      beneficiaryHash: `${scannedVoucher.beneficiary.substring(0, 4)}...${scannedVoucher.beneficiary.substring(scannedVoucher.beneficiary.length - 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      txHash: hash === 'OFFLINE_INDEXED_DB' ? 'Queued (IndexedDB)' : `${hash.substring(0, 8)}...`,
      isOffline
    };

    setSettledHistory((prev) => [newTx, ...prev]);
    setScannedVoucher(null);
    setManualCode('');
  };

  const totalSettledToday = settledHistory.reduce((sum, h) => sum + h.amount, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="amber" size="md">Merchant Point of Sale</Badge>
            <span className="text-xs text-slate-400 font-mono">Whitelisted Vendor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Vendor Redemption Terminal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Scan beneficiary aid vouchers to instantly verify eligibility and claim direct USDC payout from the smart contract escrow.
          </p>
        </div>

        {!isConnected && (
          <Button variant="primary" size="md" onClick={connect} leftIcon={<Sparkles className="w-4 h-4" />}>
            Connect Merchant Wallet
          </Button>
        )}
      </div>

      {/* Merchant Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Merchant Store</span>
            <Store className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-white truncate">{vendorStoreName}</div>
          <div className="text-[11px] text-amber-400 font-medium mt-1">Category: {vendorCategory}</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Today's Total Redeemed</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">${totalSettledToday}.00 USDC</div>
          <div className="text-[11px] text-slate-400 mt-1">{settledHistory.length} successful disbursements</div>
        </Card>

        <Card className="border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Contract Settlement</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">Instant Payout</div>
          <div className="text-[11px] text-cyan-400 mt-1">Direct to Stellar merchant wallet</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: QR Scanner & Manual Input (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-amber-500/30 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Scan className="w-5 h-5 text-amber-400" />
                <span>Camera Viewfinder Scanner</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Position beneficiary QR code inside the viewfinder window.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Simulated Camera Window */}
              <div className="relative rounded-2xl bg-black/80 border-2 border-dashed border-amber-500/50 aspect-video flex flex-col items-center justify-center overflow-hidden p-6">
                {isScanning ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
                    <span className="text-xs font-mono text-amber-300">Reading QR payload...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-amber-400">
                      <Camera className="w-10 h-10" />
                    </div>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Optical scanner active. Works smoothly in offline mode with IndexedDB fallback.
                    </p>
                  </div>
                )}

                {/* Laser scan line animation overlay */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse top-1/2" />
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleSimulateScan}
                disabled={isScanning}
                leftIcon={<QrCode className="w-4 h-4" />}
              >
                {isScanning ? 'Scanning Camera...' : 'Simulate Customer QR Scan'}
              </Button>

              {/* Manual Passcode Fallback */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Or Enter 12-Digit SMS Token
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="AID-WAT-9042-8819"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="font-mono text-xs uppercase"
                  />
                  <Button variant="secondary" size="md" onClick={handleManualLookup}>
                    Verify
                  </Button>
                </div>
              </div>

              {scanError && (
                <Alert variant="error" title="Validation Failed">
                  {scanError}
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Scanned Voucher Verification Card (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-white/10 bg-slate-900/60 h-full flex flex-col justify-between">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Voucher Verification Result</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Smart contract eligibility and balance validation.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6 flex-1 flex flex-col justify-between">
              {scannedVoucher ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="emerald" size="md">Valid & Unredeemed</Badge>
                      <span className="text-xs font-mono text-purple-300">Voucher #{scannedVoucher.voucherId}</span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xs text-slate-300">Redeemable Sum:</span>
                      <span className="text-3xl font-extrabold font-mono text-emerald-400">
                        ${scannedVoucher.amount}.00 <span className="text-xs font-sans text-slate-400 font-normal">USDC</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 pt-2 border-t border-white/5 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Authorized Category:</span>
                        <span className="font-semibold text-white">{scannedVoucher.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Security Token:</span>
                        <span className="font-mono text-yellow-300">{scannedVoucher.token}</span>
                      </div>
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-slate-400">Beneficiary:</span>
                        <span className="text-slate-300 truncate max-w-[200px]">{scannedVoucher.beneficiary}</span>
                      </div>
                    </div>
                  </div>

                  <Alert variant="info" title="Category Authorization Match">
                    This voucher matches your store category ({vendorCategory}). You are authorized to disburse goods and claim funds.
                  </Alert>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => setSettlementModalOpen(true)}
                    leftIcon={<DollarSign className="w-5 h-5 text-emerald-400" />}
                  >
                    Confirm Goods Handover & Claim ${scannedVoucher.amount} USDC
                  </Button>
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-2xl my-auto">
                  Scan a beneficiary QR code on the left to verify voucher validity and release items.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Disbursed Transactions */}
      <Card className="border-white/10 bg-slate-900/60">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            <span>Merchant Payout Ledger</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Direct Soroban contract payouts credited to this merchant account.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 uppercase font-mono text-[11px]">
                <tr>
                  <th className="pb-3 pl-2">Voucher ID</th>
                  <th className="pb-3">Beneficiary</th>
                  <th className="pb-3">Disbursed Amount</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Transaction Hash</th>
                  <th className="pb-3 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {settledHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pl-2 font-mono text-purple-400">#{item.voucherId}</td>
                    <td className="py-3 font-mono text-slate-400">{item.beneficiaryHash}</td>
                    <td className="py-3 font-mono font-bold text-emerald-400">+${item.amount}.00 USDC</td>
                    <td className="py-3 font-mono text-slate-400">{item.timestamp}</td>
                    <td className="py-3 font-mono text-cyan-400">{item.txHash}</td>
                    <td className="py-3 text-right pr-2">
                      <Badge variant={item.isOffline ? 'amber' : 'emerald'} size="sm">
                        {item.isOffline ? 'Queued Offline' : 'Ledger Settled'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Settlement Modal */}
      <SettlementModal
        isOpen={settlementModalOpen}
        onClose={() => setSettlementModalOpen(false)}
        voucherData={scannedVoucher}
        vendorAddress={address || 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'}
        onSettlementSuccess={handleSettlementSuccess}
      />
    </div>
  );
}
