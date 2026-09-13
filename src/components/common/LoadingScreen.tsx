'use client';

import React, { useState, useEffect } from 'react';
import { PixelCat } from '@/components/mascot/PixelCat';
import { PixelFMLogo } from '@/components/common/PixelFMLogo';
import { cn } from '@/lib/utils';

// ============================================================
// LoadingScreen — PIXELFM Retro Boot / Splash Screen
// Matches media_1789322141852.png:
// - Phosphor green headphones logo
// - PIXELFM brand header
// - "Your music. A more pixelated world."
// - Sleeping pixel cat perched atop the striped progress bar
// - "Loading your music..." status ticker
// ============================================================

interface LoadingScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export function LoadingScreen({
  onComplete,
  minDurationMs = 2000,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(12);
  const [isDone, setIsDone] = useState(false);
  const [statusText, setStatusText] = useState('Loading your music...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatusText('Ready to play!');
          setTimeout(() => {
            setIsDone(true);
            onComplete?.();
          }, 350);
          return 100;
        }
        if (prev > 45 && prev < 70) {
          setStatusText('Waking up the audio engine...');
        } else if (prev >= 70) {
          setStatusText('Synthesizing 16-bit soundscapes...');
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, minDurationMs / 18);

    return () => clearInterval(interval);
  }, [minDurationMs, onComplete]);

  if (isDone) return null;

  return (
    <div
      onClick={() => {
        setIsDone(true);
        onComplete?.();
      }}
      className={cn(
        'fixed inset-0 z-[9999] bg-[#0A0F17] flex flex-col items-center justify-center p-6 select-none cursor-pointer',
        'transition-opacity duration-300',
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
      title="Click anywhere to skip intro"
    >
      {/* ─── Center Hero ───────────────────────────────────── */}
      <div className="flex flex-col items-center max-w-md w-full text-center">
        {/* Authentic PixelFMLogo (Badge + PIXELFM Typography) */}
        <PixelFMLogo size="xl" layout="col" className="mb-4" />

        {/* Tagline — Sentence case, clean monospace, with ample breathing room */}
        <p className="font-mono text-[13px] md:text-[14px] text-[#7E8B9B] tracking-normal mb-16">
          Your music. A more pixelated world.
        </p>

        {/* ─── Cat on Progress Bar Container (spaced well below tagline) ─── */}
        <div className="relative w-full max-w-[340px] mb-4">
          {/* Sleeping Cat positioned directly on the progress bar */}
          <div className="absolute -top-[45px] left-[54%] -translate-x-1/2 z-10 pointer-events-auto">
            <PixelCat size="md" showZzz={true} />
          </div>

          {/* Progress Bar Capsule */}
          <div className="w-full h-5 bg-[#0A131D] border-2 border-[#1E3347] rounded-md p-0.5 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            <div
              className="h-full animate-stripe-progress transition-all duration-150 rounded-sm"
              style={{ width: `${Math.min(100, Math.max(8, progress))}%` }}
            />
          </div>
        </div>

        {/* Status Ticker */}
        <div className="font-mono text-[12px] text-[#7E8B9B] tracking-wide mt-2">
          {statusText}
        </div>
      </div>
    </div>
  );
}
