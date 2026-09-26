'use client';

import { useEffect, useState } from 'react';

const MIN_DISPLAY_MS = 900;
const FADE_MS = 500;

export function LoadingScreen() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFadingOut(true), MIN_DISPLAY_MS);
    const removeTimer = setTimeout(() => setIsMounted(false), MIN_DISPLAY_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#111111] transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="relative w-20 h-20 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#D4AF37] animate-spin"></div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#D4AF37] text-[#111111] text-lg font-serif">
          JK
        </div>
      </div>
      <p className="text-xs tracking-[0.3em] text-[#D4AF37] uppercase font-medium">
        Joviter&apos;s Kitchen
      </p>
    </div>
  );
}