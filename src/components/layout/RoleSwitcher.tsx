'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import { UserRole } from '../../config/constants';
import { Shield, Users, HeartHandshake, Store, Eye, Award } from 'lucide-react';
import { clsx } from 'clsx';

export const DEMO_PERSONAS: {
  role: UserRole;
  title: string;
  address: string;
  desc: string;
  icon: any;
}[] = [
  {
    role: 'PUBLIC',
    title: 'Public Watchdog',
    address: '',
    desc: 'Transparent read-only audit of all disbursements',
    icon: Eye,
  },
  {
    role: 'DONOR',
    title: 'Philanthropic Donor',
    address: 'GCAX7Y8Z9W0V1U2T3S4R5Q6P7O8N9M0L1K2J3I4H5G6F7E8D9C0B1A2Z',
    desc: 'Fund programs with XLM & track milestone impact',
    icon: HeartHandshake,
  },
  {
    role: 'NGO',
    title: 'Relief Agency (NGO)',
    address: 'GDH6VCO5HQ3QYEMD3S5A6H6O43T5SXRHYXWJ4Q74P5POG2BJZG27Y5W4',
    desc: 'Create aid programs, request releases, issue vouchers',
    icon: Shield,
  },
  {
    role: 'VERIFIER',
    title: 'Independent Auditor',
    address: 'GCABG722A76MOKP7J3S7X4CVUXJ27DFG7T2RUX2K2H6ECLWGYX4XU5Z2',
    desc: 'Inspect IPFS evidence and sign M-of-N milestone approvals',
    icon: Award,
  },
  {
    role: 'BENEFICIARY',
    title: 'Aid Recipient',
    address: 'GBZXN7PIRZGNMHGA728VY3CW2QEMPL4UKNM42CRXS2VAEBFA4T6EOC43',
    desc: 'Mobile-first QR voucher wallet for merchant redemptions',
    icon: Users,
  },
  {
    role: 'VENDOR',
    title: 'Whitelisted Merchant',
    address: 'GBUY6V5B4N3M2X1Z0K9J8H7G6F5D4S3A2P1O0I9U8Y7T6R5E4W3Q2Z1X',
    desc: 'Scan recipient QR codes to claim instant contract settlement',
    icon: Store,
  },
];

export function RoleSwitcher() {
  const { user, setDemoRole } = useAuth();
  const { connectDemoAccount } = useWallet();

  const currentRole = user?.role || 'PUBLIC';

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none">
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mr-1 hidden sm:inline">
        View as:
      </span>
      {DEMO_PERSONAS.map((persona) => {
        const Icon = persona.icon;
        const isActive = currentRole === persona.role;

        return (
          <button
            key={persona.role}
            onClick={() => {
              if (persona.address) {
                connectDemoAccount(persona.address);
              }
              setDemoRole(persona.role);
            }}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap',
              isActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            )}
            title={persona.desc}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{persona.title}</span>
          </button>
        );
      })}
    </div>
  );
}
