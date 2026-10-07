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
import { contractClient } from '../../../lib/contract-client';
import {
  ArrowLeft,
  Store,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Building,
  DollarSign,
  AlertTriangle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface VendorItem {
  address: string;
  businessName: string;
  category: string;
  isRegistered: boolean;
  totalSettledUsd: number;
  location: string;
}

export default function NgoVendorsPage() {
  const { isConnected, address, connect } = useWallet();

  const [vendors, setVendors] = useState<VendorItem[]>([
    {
      address: 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
      businessName: 'Lodwar Water Services & Purification Co.',
      category: 'Clean Water',
      isRegistered: true,
      totalSettledUsd: 14200,
      location: 'Lodwar Central, Turkana'
    },
    {
      address: 'GDUKMGUGDZQK6YHYA5Z6TI2GLVEOJR6K2GTI2GLVEGYZ745PUMF43AOP',
      businessName: 'Sahara Grain & Flour Depot',
      category: 'Nutritional Food',
      isRegistered: true,
      totalSettledUsd: 22800,
      location: 'Kakuma Town, Turkana'
    },
    {
      address: 'GCIZ42U2XEQA73B6Q76B6J5B7J3I56M6YJAZD5V4Q5P6L7N7O8P9Q1R2',
      businessName: 'Turkana Community Pharmacy & Diagnostics',
      category: 'Medical Pharmacy',
      isRegistered: true,
      totalSettledUsd: 8750,
      location: 'Lokitaung, Turkana'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [vendorAddress, setVendorAddress] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorCategory, setVendorCategory] = useState('Clean Water');
  const [vendorLocation, setVendorLocation] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [txState, setTxState] = useState<'simulating' | 'signing' | 'submitting' | 'confirmed' | 'failed'>('simulating');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegisterVendor = async () => {
    if (!vendorAddress.trim() || !vendorName.trim()) {
      alert('Please fill out vendor name and Stellar address.');
      return;
    }

    setIsSubmitting(true);
    setStatusModalOpen(true);
    setTxState('simulating');
    setErrorMessage(null);

    try {
      const simResult = await contractClient.registerVendor(
        vendorAddress,
        vendorCategory,
        address || 'GDEMO...'
      );

      if (!simResult.success) {
        setTxState('failed');
        setErrorMessage(simResult.error || 'Vendor registration simulation failed on Soroban.');
        setIsSubmitting(false);
        return;
      }

      setTxState('signing');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTxState('submitting');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockHash = '5c4b3a2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b';
      setTxHash(mockHash);
      setTxState('confirmed');

      setVendors((prev) => [
        ...prev,
        {
          address: vendorAddress,
          businessName: vendorName,
          category: vendorCategory,
          isRegistered: true,
          totalSettledUsd: 0,
          location: vendorLocation || 'East Africa'
        }
      ]);

      setShowAddModal(false);
      setVendorAddress('');
      setVendorName('');
    } catch (err: any) {
      setTxState('failed');
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveVendor = async (targetAddr: string) => {
    if (!confirm('Are you sure you want to revoke this vendor from the on-chain whitelist?')) {
      return;
    }

    setStatusModalOpen(true);
    setTxState('simulating');
    setErrorMessage(null);

    try {
      const simResult = await contractClient.removeVendor(targetAddr, address || 'GDEMO...');
      if (!simResult.success) {
        setTxState('failed');
        setErrorMessage(simResult.error || 'Vendor revocation failed.');
        return;
      }

      setTxState('submitting');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setTxHash('3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b');
      setTxState('confirmed');

      setVendors((prev) =>
        prev.map((v) => (v.address === targetAddr ? { ...v, isRegistered: false } : v))
      );
    } catch (err: any) {
      setTxState('failed');
      setErrorMessage(err.message || 'Vendor removal failed.');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Back button */}
      <Link href="/ngo" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to NGO Command Center</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="purple" size="md">Merchant Whitelist</Badge>
            <span className="text-xs text-slate-400 font-mono">Anti-Fraud Protection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Whitelisted Merchant Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain authorized local merchant vendors. Beneficiaries can only redeem aid vouchers at verified vendors in authorized categories.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Whitelist New Merchant
        </Button>
      </div>

      {/* Vendors Table */}
      <Card className="border-white/10 bg-slate-900/60">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-base">Registered Merchants ({vendors.length})</CardTitle>
          <CardDescription className="text-xs">
            Merchants actively recorded in the Soroban smart contract storage map.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 uppercase font-mono text-[11px]">
                <tr>
                  <th className="pb-3 pl-2">Merchant Name</th>
                  <th className="pb-3">Stellar Public Key</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Total Redeemed</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {vendors.map((v) => (
                  <tr key={v.address} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pl-2 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-amber-400" />
                        <span>{v.businessName}</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-slate-400 text-[11px]">
                      {v.address.substring(0, 8)}...{v.address.substring(v.address.length - 4)}
                    </td>
                    <td className="py-3">
                      <Badge variant="cyan" size="sm">{v.category}</Badge>
                    </td>
                    <td className="py-3 text-slate-400">{v.location}</td>
                    <td className="py-3 font-mono font-bold text-emerald-400">
                      ${v.totalSettledUsd.toLocaleString()} USDC
                    </td>
                    <td className="py-3">
                      {v.isRegistered ? (
                        <Badge variant="emerald" size="sm">Whitelisted</Badge>
                      ) : (
                        <Badge variant="amber" size="sm">Suspended</Badge>
                      )}
                    </td>
                    <td className="py-3 text-right pr-2">
                      {v.isRegistered && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVendor(v.address)}
                          className="hover:text-red-400"
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                        >
                          Revoke
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <Card className="max-w-md w-full border-purple-500/40 bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <span>Whitelist Local Merchant</span>
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
                  Merchant Business Name *
                </label>
                <Input
                  placeholder="e.g. Turkana Essential Groceries Ltd"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Merchant Stellar Address *
                </label>
                <Input
                  placeholder="G..."
                  value={vendorAddress}
                  onChange={(e) => setVendorAddress(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Approved Voucher Category
                </label>
                <select
                  value={vendorCategory}
                  onChange={(e) => setVendorCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/80 border border-white/15 px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Clean Water">Clean Water & Sanitation</option>
                  <option value="Nutritional Food">Nutritional Food Rations</option>
                  <option value="Medical Pharmacy">Prescription Pharmacy & First Aid</option>
                  <option value="Shelter Materials">Shelter & Construction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Physical Settlement Location
                </label>
                <Input
                  placeholder="e.g. Kakuma Camp Sector 2"
                  value={vendorLocation}
                  onChange={(e) => setVendorLocation(e.target.value)}
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
                onClick={handleRegisterVendor}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Sign on Soroban
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
        title="Updating Merchant Whitelist on Soroban"
      />
    </div>
  );
}
