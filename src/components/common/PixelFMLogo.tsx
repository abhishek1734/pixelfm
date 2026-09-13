'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// ============================================================
// PixelFMLogo — PIXELFM Official Brand Logo
// Faithfully matches media_1789323306278.png
// Features:
// - Dark teal rounded badge with pixel headphones
// - All-green "PIXELFM" bold retro pixel typography
// ============================================================

interface PixelFMLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  layout?: 'row' | 'col';
}

export function PixelFMLogo({
  size = 'md',
  showText = true,
  className,
  layout = 'row',
}: PixelFMLogoProps) {
  const badgeSize =
    size === 'sm'
      ? 'w-8 h-8'
      : size === 'lg'
      ? 'w-12 h-12'
      : size === 'xl'
      ? 'w-16 h-16'
      : 'w-9 h-9';
  const iconSize =
    size === 'sm' ? 18 : size === 'lg' ? 28 : size === 'xl' ? 36 : 22;
  const textSize =
    size === 'sm'
      ? 'text-[14px]'
      : size === 'lg'
      ? 'text-[22px]'
      : size === 'xl'
      ? 'text-[26px]'
      : 'text-[17px]';

  return (
    <div
      className={cn(
        'select-none',
        layout === 'col' ? 'flex flex-col items-center gap-3' : 'flex items-center gap-3',
        className
      )}
    >
      {/* Dark Teal Badge with Pixel Headphones */}
      <div
        className={cn(
          badgeSize,
          'rounded-xl bg-[#0E2822] border border-[#164D3F]',
          'flex items-center justify-center shrink-0',
          'shadow-[0_0_16px_rgba(34,197,94,0.22)]'
        )}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 20 20"
          fill="none"
          shapeRendering="crispEdges"
        >
          {/* Top Headband */}
          <rect x="6" y="3" width="8" height="2" fill="#22C55E" />
          {/* Stepped Down Band Corners */}
          <rect x="4" y="4" width="2" height="2" fill="#22C55E" />
          <rect x="14" y="4" width="2" height="2" fill="#22C55E" />
          {/* Vertical Band Sides */}
          <rect x="3" y="6" width="2" height="4" fill="#22C55E" />
          <rect x="15" y="6" width="2" height="4" fill="#22C55E" />

          {/* Left Earcup */}
          <rect x="2" y="9" width="4" height="7" rx="1" fill="#22C55E" />
          <rect x="3" y="10" width="2" height="5" fill="#0A1814" />

          {/* Right Earcup */}
          <rect x="14" y="9" width="4" height="7" rx="1" fill="#22C55E" />
          <rect x="15" y="10" width="2" height="5" fill="#0A1814" />
        </svg>
      </div>

      {/* Brand Typography: PIXELFM in Phosphor Green */}
      {showText && (
        <span
          className={cn(
            'font-pixel font-bold text-[#22C55E] tracking-wider leading-none',
            'drop-shadow-[0_0_10px_rgba(34,197,94,0.35)]',
            textSize
          )}
        >
          PIXELFM
        </span>
      )}
    </div>
  );
}
