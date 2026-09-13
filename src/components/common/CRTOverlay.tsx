'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// ============================================================
// CRTOverlay — Full-screen retro CRT scanline + vignette effect
// Renders three layered elements: scanlines, a moving scan beam,
// and a radial vignette darkening the edges.
// ============================================================

interface CRTOverlayProps {
  enabled: boolean;
}

export function CRTOverlay({ enabled }: CRTOverlayProps) {
  if (!enabled) return null;

  return (
    <>
      {/* Scanlines layer */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
        }}
      />

      {/* Moving scan line beam */}
      <div
        aria-hidden="true"
        className="fixed left-0 right-0 pointer-events-none z-[9999]"
        style={{
          height: '3px',
          background:
            'linear-gradient(to bottom, transparent, rgba(255,255,255,0.03) 50%, transparent)',
          animation: 'scanLine 8s linear infinite',
        }}
      />

      {/* Vignette layer */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.35) 100%)',
        }}
      />
    </>
  );
}

// ============================================================
// PixelBadge — Small retro status/label badge
// Sharp corners, 1px border, uppercase tracking, pixel-ui font
// ============================================================

type BadgeVariant = 'default' | 'accent' | 'warm' | 'lavender' | 'muted';

interface PixelBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-bg-elevated border-border-subtle text-text-secondary',
  accent:   'bg-accent-primary/10 border-accent-primary text-accent-primary',
  warm:     'bg-accent-warm/10 border-accent-warm text-accent-warm',
  lavender: 'bg-accent-secondary/10 border-accent-secondary text-accent-secondary',
  muted:    'bg-bg-surface border-border-subtle text-text-muted',
};

export function PixelBadge({
  children,
  variant = 'default',
  className,
}: PixelBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        'border px-1.5 py-0.5',
        'font-pixel-ui text-[10px] uppercase tracking-wider',
        'rounded-none',
        'leading-none select-none',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
