'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn, formatTime, clamp } from '@/lib/utils';
import { PixelIcon } from '@/components/common/PixelIcon';

// ============================================================
// PIXELIFY — PixelSlider
// Retro pixel-art progress bar and volume slider components
// Sharp corners, stepped animations, pixel-perfect thumb
// ============================================================

// ─── PixelProgressBar ────────────────────────────────────────

export interface PixelProgressBarProps {
  currentMs: number;
  totalMs: number;
  onSeek?: (ms: number) => void;
  isInteractive?: boolean;
  className?: string;
}

export function PixelProgressBar({
  currentMs,
  totalMs,
  onSeek,
  isInteractive = true,
  className,
}: PixelProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPercent, setHoverPercent] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Prevent division by zero
  const safeTotal = totalMs > 0 ? totalMs : 1;
  const progressPercent = clamp((currentMs / safeTotal) * 100, 0, 100);

  // Displayed percent — use drag position while dragging
  const displayPercent =
    isDragging && hoverPercent !== null ? hoverPercent : progressPercent;

  // ── Seek calculation ──────────────────────────────────────
  const getPercentFromEvent = useCallback(
    (e: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent): number => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      let clientX: number;
      if ('touches' in e) {
        clientX = (e as TouchEvent).touches[0]?.clientX ?? rect.left;
      } else {
        clientX = (e as MouseEvent).clientX;
      }
      const ratio = (clientX - rect.left) / rect.width;
      return clamp(ratio * 100, 0, 100);
    },
    []
  );

  const seekTo = useCallback(
    (percent: number) => {
      if (onSeek && totalMs > 0) {
        onSeek(Math.round((percent / 100) * totalMs));
      }
    },
    [onSeek, totalMs]
  );

  // ── Mouse handlers ────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isInteractive) return;
      e.preventDefault();
      const pct = getPercentFromEvent(e);
      setHoverPercent(pct);
      setIsDragging(true);
    },
    [isInteractive, getPercentFromEvent]
  );

  const handleTrackMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isInteractive) return;
      setHoverPercent(getPercentFromEvent(e));
    },
    [isInteractive, getPercentFromEvent]
  );

  // Global mouse move / up while dragging
  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent) => {
      setHoverPercent(getPercentFromEvent(e));
    };
    const onUp = (e: MouseEvent) => {
      const pct = getPercentFromEvent(e);
      seekTo(pct);
      setIsDragging(false);
      setHoverPercent(null);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, getPercentFromEvent, seekTo]);

  // Click on track (non-drag, quick tap)
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isInteractive || isDragging) return;
      const pct = getPercentFromEvent(e);
      seekTo(pct);
    },
    [isInteractive, isDragging, getPercentFromEvent, seekTo]
  );

  // Time label shown for hover position while dragging
  const hoverMs =
    hoverPercent !== null
      ? Math.round((hoverPercent / 100) * totalMs)
      : currentMs;

  return (
    <div
      className={cn('group flex flex-col gap-1 w-full select-none', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isDragging) setHoverPercent(null);
      }}
    >
      {/* Track hit area */}
      <div
        ref={trackRef}
        role={isInteractive ? 'slider' : undefined}
        aria-valuemin={0}
        aria-valuemax={totalMs}
        aria-valuenow={currentMs}
        aria-label="Playback progress"
        tabIndex={isInteractive ? 0 : -1}
        className={cn(
          'relative flex items-center w-full',
          'h-5', // 20px tall hit area for easy interaction
          isInteractive && 'cursor-pointer'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleTrackMouseMove}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (!isInteractive) return;
          if (e.key === 'ArrowRight') seekTo(clamp(progressPercent + 1, 0, 100));
          if (e.key === 'ArrowLeft') seekTo(clamp(progressPercent - 1, 0, 100));
        }}
      >
        {/* Track background — 4px tall */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
          style={{ height: '4px', background: '#2B324B' }}
        />

        {/* Filled portion */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2"
          style={{
            height: '4px',
            width: `${displayPercent}%`,
            background: 'var(--color-accent-primary, #E98A9A)',
            // No transition while dragging — precise pixel feel; subtle transition otherwise
            transition: isDragging ? 'none' : 'width 0.1s linear',
          }}
        />

        {/* Thumb — 12×12 square, only visible on hover/drag */}
        <div
          className={cn(
            'absolute top-1/2',
            'pointer-events-none',
            'transition-opacity duration-75',
            isHovered || isDragging ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            width: '12px',
            height: '12px',
            left: `${displayPercent}%`,
            transform: 'translateX(-50%) translateY(-50%)',
            background: 'var(--color-text-primary, #F0EAF7)',
            border: '1px solid var(--color-accent-primary, #E98A9A)',
            imageRendering: 'pixelated',
          }}
          aria-hidden
        />
      </div>

      {/* Time labels */}
      <div className="flex justify-between w-full">
        <span className="font-pixel-vt text-text-muted text-xs tabular-nums leading-none">
          {formatTime(isDragging && hoverPercent !== null ? hoverMs : currentMs)}
        </span>
        <span className="font-pixel-vt text-text-muted text-xs tabular-nums leading-none">
          {formatTime(totalMs)}
        </span>
      </div>
    </div>
  );
}

// ─── PixelVolumeSlider ────────────────────────────────────────

export interface PixelVolumeSliderProps {
  volume: number;       // 0–1
  isMuted: boolean;
  onVolumeChange: (v: number) => void;
  onMuteToggle: () => void;
  className?: string;
}

export function PixelVolumeSlider({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  className,
}: PixelVolumeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragVolume, setDragVolume] = useState<number | null>(null);

  // Effective display volume (accounts for mute and drag)
  const displayVolume =
    isDragging && dragVolume !== null ? dragVolume : isMuted ? 0 : volume;
  const displayPercent = clamp(displayVolume * 100, 0, 100);

  // Choose icon based on state
  const volumeIconName: 'volumeMute' | 'volumeLow' | 'volume' =
    isMuted || volume === 0
      ? 'volumeMute'
      : volume < 0.5
      ? 'volumeLow'
      : 'volume';

  // ── Helpers ───────────────────────────────────────────────
  const getVolumeFromEvent = useCallback(
    (e: MouseEvent | React.MouseEvent): number => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      return clamp(ratio, 0, 1);
    },
    []
  );

  // ── Mouse handlers ────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const v = getVolumeFromEvent(e);
      setDragVolume(v);
      setIsDragging(true);
    },
    [getVolumeFromEvent]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) return;
      const v = getVolumeFromEvent(e);
      onVolumeChange(v);
    },
    [isDragging, getVolumeFromEvent, onVolumeChange]
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent) => {
      setDragVolume(getVolumeFromEvent(e));
    };
    const onUp = (e: MouseEvent) => {
      const v = getVolumeFromEvent(e);
      onVolumeChange(v);
      setIsDragging(false);
      setDragVolume(null);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, getVolumeFromEvent, onVolumeChange]);

  return (
    <div
      className={cn(
        'flex items-center gap-2 group select-none',
        className
      )}
    >
      {/* Volume icon — toggles mute on click */}
      <button
        type="button"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        onClick={onMuteToggle}
        className={cn(
          'flex items-center justify-center',
          'w-6 h-6 shrink-0',
          'text-text-secondary hover:text-text-primary',
          'cursor-pointer rounded-none',
          'active:translate-y-px',
          'transition-colors duration-75',
          'focus-visible:outline-2 focus-visible:outline-accent-primary'
        )}
      >
        <PixelIcon name={volumeIconName} size={14} color="currentColor" />
      </button>

      {/* Volume track — 80px wide */}
      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(displayVolume * 100)}
        aria-label="Volume"
        tabIndex={0}
        className="relative flex items-center cursor-pointer"
        style={{ width: '80px', height: '16px' }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') onVolumeChange(clamp(volume + 0.05, 0, 1));
          if (e.key === 'ArrowLeft') onVolumeChange(clamp(volume - 0.05, 0, 1));
        }}
      >
        {/* Track background — 3px tall */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
          style={{ height: '3px', background: '#2B324B' }}
        />

        {/* Fill */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2"
          style={{
            height: '3px',
            width: `${displayPercent}%`,
            background: 'var(--color-accent-primary, #E98A9A)',
            transition: isDragging ? 'none' : 'width 0.08s linear',
          }}
        />

        {/* Thumb — hidden until hover or drag */}
        <div
          className={cn(
            'absolute top-1/2 pointer-events-none',
            'opacity-0 group-hover:opacity-100',
            isDragging && '!opacity-100'
          )}
          style={{
            width: '10px',
            height: '10px',
            left: `${displayPercent}%`,
            transform: 'translateX(-50%) translateY(-50%)',
            background: 'var(--color-text-primary, #F0EAF7)',
            border: '1px solid var(--color-accent-primary, #E98A9A)',
            imageRendering: 'pixelated',
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}
