'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('AidTrail ServiceWorker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('ServiceWorker registration skipped or failed:', error);
        });
    }
  }, []);

  return null;
}
