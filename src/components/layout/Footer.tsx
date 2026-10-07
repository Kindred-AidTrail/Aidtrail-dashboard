import React from 'react';
import Link from 'next/link';
import { CONTRACT_CONFIG, API_CONFIG } from '../../config/constants';
import { ShieldCheck, ExternalLink, Github, Heart } from 'lucide-react';

export function Footer() {
  const contractId = CONTRACT_CONFIG.AIDTRAIL_CONTRACT_ID;
  const truncatedContractId = `${contractId.slice(0, 8)}...${contractId.slice(-8)}`;
  const explorerUrl = `${API_CONFIG.EXPLORER_BASE_URL}/contract/${contractId}`;

  return (
    <footer className="border-t border-white/10 bg-[#070A12] mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-display font-bold text-base text-white">Kindred AidTrail</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Transparent aid and grant disbursement platform on Stellar and Soroban. Donors fund, verifiers attest, NGOs issue, beneficiaries redeem.
            </p>
          </div>

          {/* Column 2: On-Chain Protocol */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              On-Chain Protocol
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono"
                >
                  <span>Contract: {truncatedContractId}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Network: Stellar Testnet</li>
              <li>Soroban SDK: v22.0.1</li>
              <li>Invariants: Solvency Invariant Enforced</li>
            </ul>
          </div>

          {/* Column 3: Roles & Portals */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Platform Views
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/explorer" className="hover:text-white transition-colors">Public Audit Explorer</Link></li>
              <li><Link href="/donor" className="hover:text-white transition-colors">Donor Funding Portal</Link></li>
              <li><Link href="/ngo" className="hover:text-white transition-colors">NGO Program Manager</Link></li>
              <li><Link href="/verifier" className="hover:text-white transition-colors">Verifier Consensus Hub</Link></li>
              <li><Link href="/beneficiary" className="hover:text-white transition-colors">Beneficiary Wallet</Link></li>
              <li><Link href="/vendor" className="hover:text-white transition-colors">Merchant Payouts</Link></li>
            </ul>
          </div>

          {/* Column 4: Compliance & Standards */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Compliance & Security
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>SEP-10 Stellar Web Authentication</li>
              <li>AES-256-GCM Zero Plaintext PII</li>
              <li>GDPR Article 17 Cryptographic Shredding</li>
              <li>Tamper-Evident SHA-256 S3 Hashes</li>
              <li>M-of-N Multi-Verifier Threshold</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Kindred AidTrail Foundation. Open-source Apache-2.0 License.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built for humanity with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> on Stellar
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
