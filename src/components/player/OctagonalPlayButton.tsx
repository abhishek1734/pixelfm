'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { PixelIcon } from '@/components/common/PixelIcon';

// ============================================================
// OctagonalPlayButton — The signature PIXELIFY play/pause control
// Two-layer octagonal clip-path shape: outer coral fill acts as
// the "border", inner dark layer holds the icon. Pure CSS, no SVG.
// ============================================================

type ButtonSize = 'sm' | 'md' | 'lg';

interface OctagonalPlayButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: ButtonSize;
}

// Pixel dimensions per size variant
const SIZE_PX: Record<ButtonSize, number> = {
  sm: 40,
  md: 56,
  lg: 72,
};

// Icon size scaled to button size
const ICON_SIZE: Record<ButtonSize, 12 | 14 | 16 | 18 | 20 | 24 | 32> = {
  sm: 14,
  md: 18,
  lg: 24,
};

// Clip-path polygon giving sharp octagon shape
const OCTAGON_CLIP =
  'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';

// Inner layer inset (px) on each side — creates the "border" thickness
const INSET_PX: Record<ButtonSize, number> = {
  sm: 3,
  md: 3,
  lg: 4,
};

export function OctagonalPlayButton({
  isPlaying,
  onClick,
  disabled = false,
  size = 'md',
}: OctagonalPlayButtonProps) {
  const outerPx = SIZE_PX[size];
  const inset = INSET_PX[size];
  const innerPx = outerPx - inset * 2;
  const iconSize = ICON_SIZE[size];

  return (
    <button
      type="button"
      aria-label={isPlaying ? 'Pause' : 'Play'}
      aria-pressed={isPlaying}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center justify-center',
        'cursor-pointer select-none',
        'rounded-none border-none bg-transparent p-0',
        'focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-2',
        'active:translate-y-px',
        'transition-none',
        'group',
        disabled && 'opacity-40 pointer-events-none'
      )}
      style={{ width: outerPx, height: outerPx }}
    >
      {/* Outer octagon — coral accent color, acts as border / shadow fill */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center"
        style={{
          clipPath: OCTAGON_CLIP,
          backgroundColor: 'var(--color-accent-primary, #E98A9A)',
          width: outerPx,
          height: outerPx,
        }}
      />

      {/* Inner octagon — dark bg, holds the icon */}
      <span
        aria-hidden="true"
        className="absolute flex items-center justify-center group-hover:bg-bg-elevated"
        style={{
          clipPath: OCTAGON_CLIP,
          backgroundColor: 'var(--color-bg-elevated, #20263B)',
          width: innerPx,
          height: innerPx,
          // Slight brightness lift on hover handled via group-hover above
        }}
      />

      {/* Icon — rendered above both octagon layers */}
      <span className="relative z-10 flex items-center justify-center">
        <PixelIcon
          name={isPlaying ? 'pause' : 'play'}
          size={iconSize}
          color="var(--color-text-primary, #F0EAF7)"
        />
      </span>
    </button>
  );
}
