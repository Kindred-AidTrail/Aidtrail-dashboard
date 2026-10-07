'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { QrCode, Copy, Check, Eye, EyeOff, ShieldCheck, Smartphone, Wifi, WifiOff } from 'lucide-react';

interface VoucherQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherId: number;
  programId: number;
  category: string;
  amount: number;
  securityToken: string;
  beneficiaryAddress: string;
}

export default function VoucherQrModal({
  isOpen,
  onClose,
  voucherId,
  programId,
  category,
  amount,
  securityToken,
  beneficiaryAddress
}: VoucherQrModalProps) {
  const [copied, setCopied] = useState(false);
  const [showLowBandwidthCode, setShowLowBandwidthCode] = useState(false);
  const [brightnessBoost, setBrightnessBoost] = useState(true);

  if (!isOpen) return null;

  // The payload payload formatted for the vendor camera scanner to decode
  const payloadData = JSON.stringify({
    type: 'AIDTRAIL_VOUCHER_REDEMPTION_V1',
    voucherId,
    programId,
    amount,
    token: securityToken,
    beneficiary: beneficiaryAddress,
    sig: 'ed25519_sim_sig_0987afbc'
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(securityToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG QR Code representation with high visual contrast for outdoor sunlight scanning
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    payloadData
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <Card className="max-w-sm w-full border-purple-500/40 bg-slate-900 shadow-2xl p-6 text-center space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Scan to Redeem
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-mono px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Voucher Info */}
        <div className="space-y-1">
          <Badge variant="cyan" size="md">{category}</Badge>
          <div className="text-3xl font-extrabold font-mono text-white pt-1">
            ${amount}.00 <span className="text-xs font-sans text-purple-300 font-normal">USDC</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Show this QR code to the cashier at the authorized merchant store.
          </p>
        </div>

        {/* QR Code Container with High Contrast border */}
        <div className="flex flex-col items-center justify-center">
          <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-purple-500/50">
            <img
              src={qrSvgUrl}
              alt="AidTrail Voucher QR"
              className="w-56 h-56 object-contain"
            />
          </div>
        </div>

        {/* Low-Bandwidth / Offline Fallback code */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">Offline SMS Code:</span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-mono text-[11px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="font-mono font-bold tracking-widest text-base text-yellow-300 bg-slate-900 py-1 px-2 rounded border border-white/5">
            {securityToken}
          </div>
          <span className="text-[10px] text-slate-500 block">
            Vendor can manually enter this 12-digit token if their camera cannot scan.
          </span>
        </div>

        {/* Done Button */}
        <Button variant="primary" size="md" className="w-full" onClick={onClose}>
          Done / Close QR
        </Button>
      </Card>
    </div>
  );
}
