import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'cyan' | 'violet' | 'amber' | 'rose' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'emerald',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/10',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-sm shadow-cyan-500/10',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-sm shadow-violet-500/10',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-sm shadow-amber-500/10',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-sm shadow-rose-500/10',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-lg',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 border tracking-wide uppercase',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
      {children}
    </span>
  );
}
