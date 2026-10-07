import React from 'react';
import { clsx } from 'clsx';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ type = 'info', title, children, className }: AlertProps) {
  const styles = {
    info: {
      bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200',
      icon: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
  };

  const current = styles[type];

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm text-sm',
        current.bg,
        className
      )}
    >
      {current.icon}
      <div className="space-y-0.5">
        {title && <h4 className="font-semibold text-white text-sm">{title}</h4>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
