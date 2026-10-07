'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '../../context/WalletContext';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../i18n/context';
import { SupportedLanguage } from '../../i18n/translations';
import { RoleSwitcher } from './RoleSwitcher';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  ShieldCheck,
  Wallet,
  Globe,
  LogOut,
  ChevronDown,
  Layers,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import A11yControls from './A11yControls';

export function Navbar() {
  const pathname = usePathname();
  const { publicKey, connect, disconnect, isConnecting, network } = useWallet();
  const { user, signInWithSep10, isLoading: isAuthLoading } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/explorer', label: t.nav.explorer },
    { href: '/donor', label: t.roles.donor },
    { href: '/ngo', label: t.roles.ngo },
    { href: '/verifier', label: t.roles.verifier },
    { href: '/beneficiary', label: t.roles.beneficiary },
    { href: '/vendor', label: t.roles.vendor },
  ];

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage);
  };

  const truncatedAddress = publicKey
    ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090D16]/80 backdrop-blur-xl">
      {/* Top Banner: Persona Quick Switcher */}
      <div className="border-b border-white/5 bg-slate-950/60 px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <RoleSwitcher />
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Stellar {network}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
              <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-lg tracking-tight text-white flex items-center gap-2">
                <span>Kindred AidTrail</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  SOROBAN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide hidden sm:block">
                Transparent Aid & Grants
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                    isActive
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools: Language, Accessibility, Wallet Status */}
          <div className="flex items-center gap-2.5">
            {/* Accessibility Controls */}
            <A11yControls />

            {/* Language Selector */}
            <div className="relative flex items-center text-xs text-slate-300">
              <Globe className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
              <select
                aria-label="Select Language"
                value={language}
                onChange={handleLangChange}
                className="bg-slate-900 border border-white/10 rounded-xl pl-8 pr-6 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-400 appearance-none cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="sw">Kiswahili (SW)</option>
                <option value="ar">العربية (AR)</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 text-slate-400 pointer-events-none" />
            </div>

            {/* Wallet Connection Button */}
            {!publicKey ? (
              <Button
                variant="primary"
                size="sm"
                onClick={connect}
                isLoading={isConnecting}
                leftIcon={<Wallet className="w-4 h-4" />}
              >
                {t.nav.connectWallet}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {/* SEP-10 Sign-in trigger if not yet authenticated with token */}
                {!user ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signInWithSep10}
                    isLoading={isAuthLoading}
                  >
                    Sign In (SEP-10)
                  </Button>
                ) : (
                  <Badge variant="emerald" size="sm">
                    {user.role}
                  </Badge>
                )}

                <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-mono text-slate-200">{truncatedAddress}</span>
                  <button
                    onClick={disconnect}
                    title="Disconnect Wallet"
                    className="ml-1 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#090D16] p-4 space-y-3">
          <div className="pb-3 border-b border-white/5">
            <RoleSwitcher />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  'px-3 py-2 rounded-lg text-xs font-medium text-center',
                  pathname === link.href
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
