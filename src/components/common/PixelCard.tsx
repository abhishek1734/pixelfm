import React from 'react';
import { cn } from '@/lib/utils';

// ============================================================
// PIXELIFY — PixelCard components
// Sharp pixel surfaces: card, panel, skeleton, divider
// Zero border radius, 1–2px borders throughout
// ============================================================

// ─── PixelCard ───────────────────────────────────────────────

export interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  active?: boolean;
}

export function PixelCard({
  children,
  className,
  onClick,
  hoverable = false,
  active = false,
}: PixelCardProps) {
  const baseClasses = cn(
    'bg-bg-surface border border-border-subtle',
    'rounded-none',
    hoverable && [
      'cursor-pointer',
      'hover:bg-bg-elevated hover:border-border-strong',
      'hover:-translate-y-px',
    ],
    active && 'border-accent-primary',
    className
  );

  // Render as <button> for semantic click targets
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          baseClasses,
          'w-full text-left block',
          'focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-1'
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        hoverable &&
          'focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-1'
      )}
      tabIndex={hoverable ? 0 : undefined}
      role={hoverable ? 'button' : undefined}
    >
      {children}
    </div>
  );
}

// ─── PixelPanel ──────────────────────────────────────────────

export interface PixelPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  headerAction?: React.ReactNode;
}

export function PixelPanel({
  children,
  className,
  title,
  headerAction,
}: PixelPanelProps) {
  const hasHeader = title !== undefined || headerAction !== undefined;

  return (
    <div
      className={cn(
        'bg-bg-secondary border border-border-subtle rounded-none',
        className
      )}
    >
      {/* Optional pixel-style header */}
      {hasHeader && (
        <div
          className={cn(
            'flex items-center justify-between',
            'bg-bg-elevated',
            'px-3 py-2',
            'border-b border-border-subtle'
          )}
        >
          {title && (
            <span
              className={cn(
                'font-pixel-ui text-px-sm text-text-muted',
                'uppercase tracking-wider leading-none'
              )}
            >
              {title}
            </span>
          )}
          {headerAction && (
            <div className="flex items-center ml-auto">{headerAction}</div>
          )}
        </div>
      )}

      {/* Panel body */}
      <div>{children}</div>
    </div>
  );
}

// ─── PixelSkeleton ───────────────────────────────────────────

export interface PixelSkeletonProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export function PixelSkeleton({
  className,
  width,
  height,
}: PixelSkeletonProps) {
  const resolveSize = (v: number | string | undefined) =>
    v === undefined ? undefined : typeof v === 'number' ? `${v}px` : v;

  return (
    <div
      className={cn(
        'bg-bg-elevated rounded-none',
        // Step-based opacity pulse — not smooth, retro pixel feel
        'animate-pixel-pulse',
        className
      )}
      style={{
        width: resolveSize(width),
        height: resolveSize(height),
        imageRendering: 'pixelated',
      }}
      aria-hidden="true"
    />
  );
}

// ─── PixelDivider ────────────────────────────────────────────

export interface PixelDividerProps {
  className?: string;
}

export function PixelDivider({ className }: PixelDividerProps) {
  return (
    <hr
      className={cn(
        'border-0 border-t border-border-subtle w-full my-0',
        className
      )}
      aria-hidden="true"
    />
  );
}
