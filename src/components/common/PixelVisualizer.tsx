'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

// ============================================================
// PIXELIFY — PixelVisualizer
// Animated retro pixel audio equalizer bars
// Step animations, lavender/coral alternating colors
// Supports both mock (CSS) mode and real analyserData mode
// ============================================================

// ─── Bar color helper ─────────────────────────────────────────
// Every 3rd bar (0-indexed: 2, 5, 8 …) is coral (accent-primary)
// All others are lavender (accent-secondary)
function getBarColor(index: number): string {
  return (index + 1) % 3 === 0
    ? 'var(--color-accent-primary, #E98A9A)'
    : 'var(--color-accent-secondary, #B7A7E5)';
}

// ─── Deterministic random helpers ────────────────────────────
// We pre-compute random durations/delays per bar using the bar index
// as a seed so they don't change on every render.
function pseudoRandom(seed: number): number {
  // Simple LCG to get deterministic value in [0, 1)
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── PixelVisualizer ─────────────────────────────────────────

export interface PixelVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  height?: number;
  className?: string;
  analyserData?: Uint8Array | null;
}

export function PixelVisualizer({
  isPlaying,
  barCount = 16,
  height = 40,
  className,
  analyserData = null,
}: PixelVisualizerProps) {
  // ── Analyser (Spotify) mode ───────────────────────────────
  // When analyserData is provided, mirror frequency data into bar heights
  const [analyserHeights, setAnalyserHeights] = useState<number[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!analyserData || !isPlaying) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const update = () => {
      // Sample `barCount` evenly-spaced buckets from the analyser array
      const step = Math.max(1, Math.floor(analyserData.length / barCount));
      const heights: number[] = [];
      for (let i = 0; i < barCount; i++) {
        const val = analyserData[i * step] ?? 0; // 0–255
        // Map to pixel height: min 4px, max `height`px
        const px = 4 + Math.round(((val / 255) * (height - 4)));
        heights.push(px);
      }
      setAnalyserHeights(heights);
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [analyserData, isPlaying, barCount, height]);

  // ── Mock mode bar metadata (stable across renders) ────────
  const barMeta = useMemo(
    () =>
      Array.from({ length: barCount }, (_, i) => ({
        // Duration: 0.4–1.2s, stepped
        duration: 0.4 + pseudoRandom(i * 3) * 0.8,
        // Delay: 0–0.5s
        delay: pseudoRandom(i * 7 + 1) * 0.5,
        // Max height for this bar: height*0.4 to height
        maxH: Math.round(height * 0.4 + pseudoRandom(i * 13 + 2) * height * 0.6),
        color: getBarColor(i),
      })),
    [barCount, height]
  );

  // ── Render ────────────────────────────────────────────────
  const isAnalyserMode = analyserData !== null && analyserData.length > 0;

  return (
    <div
      className={cn('flex items-end', className)}
      style={{ gap: '2px', height: `${height}px` }}
      aria-hidden="true"
    >
      {Array.from({ length: barCount }, (_, i) => {
        const meta = barMeta[i];

        // Analyser mode: direct height
        if (isAnalyserMode && isPlaying) {
          const barH = analyserHeights[i] ?? 4;
          return (
            <div
              key={i}
              style={{
                width: '3px',
                height: `${barH}px`,
                background: meta.color,
                imageRendering: 'pixelated',
                flexShrink: 0,
              }}
            />
          );
        }

        // Mock mode: CSS step animations when playing, flat when stopped
        return (
          <div
            key={i}
            style={{
              width: '3px',
              height: isPlaying ? undefined : '4px',
              minHeight: '4px',
              maxHeight: `${meta.maxH}px`,
              background: meta.color,
              imageRendering: 'pixelated',
              flexShrink: 0,
              // Use a simple keyframe via inline style animation
              animation: isPlaying
                ? `pixelVisualizerBar ${meta.duration.toFixed(2)}s steps(4) ${meta.delay.toFixed(2)}s infinite alternate`
                : 'none',
            }}
          />
        );
      })}

      {/* Inject keyframes for the bar animation once */}
      <style>{`
        @keyframes pixelVisualizerBar {
          0%   { height: 4px; }
          25%  { height: 40%; }
          50%  { height: 70%; }
          75%  { height: 55%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
}

// ─── PixelEqBars ─────────────────────────────────────────────
// Smaller 8-bar inline equalizer for track rows

export interface PixelEqBarsProps {
  isPlaying: boolean;
  height?: number;
  className?: string;
}

export function PixelEqBars({ isPlaying, height = 20, className }: PixelEqBarsProps) {
  const BAR_COUNT = 8;
  const MAX_HEIGHT = height;

  const barMeta = useMemo(
    () =>
      Array.from({ length: BAR_COUNT }, (_, i) => ({
        duration: 0.35 + pseudoRandom(i * 5 + 3) * 0.65,
        delay: pseudoRandom(i * 11 + 7) * 0.4,
        maxH: Math.round(8 + pseudoRandom(i * 17 + 9) * (MAX_HEIGHT - 8)),
        color: getBarColor(i),
      })),
    [MAX_HEIGHT]
  );

  return (
    <div
      className={cn('flex items-end', className)}
      style={{ gap: '2px', height: `${MAX_HEIGHT}px` }}
      aria-hidden="true"
    >
      {barMeta.map((meta, i) => (
        <div
          key={i}
          style={{
            width: '3px',
            height: isPlaying ? undefined : '4px',
            minHeight: '4px',
            maxHeight: `${meta.maxH}px`,
            background: meta.color,
            imageRendering: 'pixelated',
            flexShrink: 0,
            animation: isPlaying
              ? `pixelEqBar ${meta.duration.toFixed(2)}s steps(3) ${meta.delay.toFixed(2)}s infinite alternate`
              : 'none',
          }}
        />
      ))}

      <style>{`
        @keyframes pixelEqBar {
          0%   { height: 4px; }
          50%  { height: 60%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
}
