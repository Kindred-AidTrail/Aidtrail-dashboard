'use client';

import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { getExplorerTxUrl } from '../../config/env';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

export type TxStepStatus =
  | 'SIMULATING'
  | 'READY_TO_SIGN'
  | 'SUBMITTING'
  | 'SUCCESS'
  | 'ERROR';

export interface TransactionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: TxStepStatus;
  title: string;
  txHash?: string;
  ledger?: number;
  simulationFee?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export function TransactionStatusModal({
  isOpen,
  onClose,
  status,
  title,
  txHash,
  ledger,
  simulationFee,
  errorMessage,
  onRetry,
}: TransactionStatusModalProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const explorerUrl = txHash ? getExplorerTxUrl(txHash) : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="py-4 space-y-6">
        {/* Step 1: Simulating */}
        {status === 'SIMULATING' && (
          <div className="text-center py-6 space-y-4">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <ShieldCheck className="w-7 h-7 text-cyan-400 absolute" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Simulating Soroban Transaction</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Verifying smart contract footprints, authorization checks, and resource limits prior to on-chain signing.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Ready to Sign */}
        {status === 'READY_TO_SIGN' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto animate-pulse">
              <FileCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Awaiting Wallet Signature</h4>
              <p className="text-xs text-slate-400 mt-1">
                Please approve and sign the transaction envelope in your Freighter wallet extension.
              </p>
            </div>
            {simulationFee && (
              <div className="bg-slate-900/80 border border-white/10 rounded-xl p-3 text-xs flex justify-between text-slate-300">
                <span>Estimated Network Fee:</span>
                <span className="font-mono text-emerald-400">{simulationFee} stroops</span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Submitting */}
        {status === 'SUBMITTING' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin mx-auto" />
            <div>
              <h4 className="text-base font-semibold text-white">Submitting to Stellar Testnet</h4>
              <p className="text-xs text-slate-400 mt-1">
                Broadcasting transaction envelope to Soroban RPC consensus network. Waiting for ledger inclusion...
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {status === 'SUCCESS' && (
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-display">Transaction Confirmed!</h4>
              <p className="text-xs text-slate-300 mt-1">
                The smart contract invocation was successfully verified and committed to the ledger.
              </p>
            </div>

            {/* Transaction Hash & Ledger Details */}
            <div className="bg-slate-950/80 border border-white/10 rounded-xl p-4 text-left space-y-2.5">
              {ledger && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Ledger Block:</span>
                  <span className="font-mono text-emerald-400 font-semibold">#{ledger}</span>
                </div>
              )}
              {txHash && (
                <div className="space-y-1">
                  <span className="text-slate-400 text-xs">Transaction Hash:</span>
                  <div className="flex items-center justify-between bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300">
                    <span className="truncate mr-2">{txHash}</span>
                    <button
                      onClick={handleCopy}
                      className="p-1 hover:text-white transition-colors"
                      title="Copy transaction hash"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              {explorerUrl && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold glass-panel hover:bg-slate-800 text-slate-200 border-white/10 transition-colors"
                >
                  <span>View on StellarExpert</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <Button variant="primary" size="md" onClick={onClose} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Error */}
        {status === 'ERROR' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Execution Failed</h4>
              <p className="text-xs text-rose-300/90 mt-1 max-w-sm mx-auto">
                {errorMessage || 'The smart contract rejected the transaction.'}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              {onRetry && (
                <Button variant="outline" size="md" onClick={onRetry} className="flex-1">
                  Retry Simulation
                </Button>
              )}
              <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
