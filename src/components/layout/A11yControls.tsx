'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Eye, Sun, Moon, Type, Activity, Volume2 } from 'lucide-react';

export default function A11yControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load saved preferences
    const savedContrast = localStorage.getItem('aidtrail_high_contrast') === 'true';
    const savedMotion = localStorage.getItem('aidtrail_reduced_motion') === 'true';
    const savedFontSize = (localStorage.getItem('aidtrail_font_size') as any) || 'normal';

    if (savedContrast) {
      setHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
    if (savedMotion) {
      setReducedMotion(true);
      document.documentElement.classList.add('reduce-motion');
    }
    if (savedFontSize !== 'normal') {
      setFontSizeLevel(savedFontSize);
      document.documentElement.classList.add(`font-size-${savedFontSize}`);
    }
  }, []);

  const toggleHighContrast = () => {
    const newVal = !highContrast;
    setHighContrast(newVal);
    localStorage.setItem('aidtrail_high_contrast', String(newVal));
    if (newVal) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const toggleReducedMotion = () => {
    const newVal = !reducedMotion;
    setReducedMotion(newVal);
    localStorage.setItem('aidtrail_reduced_motion', String(newVal));
    if (newVal) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const cycleFontSize = () => {
    let next: 'normal' | 'large' | 'xlarge' = 'normal';
    if (fontSizeLevel === 'normal') next = 'large';
    else if (fontSizeLevel === 'large') next = 'xlarge';
    else next = 'normal';

    document.documentElement.classList.remove('font-size-large', 'font-size-xlarge');
    if (next !== 'normal') {
      document.documentElement.classList.add(`font-size-${next}`);
    }
    setFontSizeLevel(next);
    localStorage.setItem('aidtrail_font_size', next);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility options"
        className="p-2 rounded-xl border border-white/10 hover:border-white/20 bg-slate-900/60 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
        title="Accessibility Settings (High Contrast, Large Text, Reduced Motion)"
      >
        <Eye className="w-4 h-4 text-cyan-400" />
        <span className="hidden sm:inline font-mono">A11y</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 p-4 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl z-50 space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Accessibility Mode</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white font-mono"
            >
              ✕
            </button>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300">High Contrast (Sunlight)</span>
            <button
              onClick={toggleHighContrast}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors ${
                highContrast ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {highContrast ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Reduced Motion</span>
            <button
              onClick={toggleReducedMotion}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors ${
                reducedMotion ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Text Size */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Text Scaling</span>
            <button
              onClick={cycleFontSize}
              className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 font-mono text-[11px] font-bold hover:bg-slate-700"
            >
              {fontSizeLevel.toUpperCase()}
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 font-mono text-center">
            WCAG 2.1 AAA Field Optimizations
          </div>
        </div>
      )}
    </div>
  );
}
