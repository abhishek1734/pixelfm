'use client';

import React from 'react';
import Image from 'next/image';
import { Track, PixelCoverTheme } from '@/types/music';
import { PIXEL_COVER_MAP, MidnightDriveCover } from './PixelCovers';
import { PixelSkeleton } from '@/components/common/PixelCard';
import { cn } from '@/lib/utils';

// ============================================================
// PixelAlbumArt — Retro Framed Album Art Display
// Compliant with Spotify Developer Terms: Spotify artwork is
// presented without distortion, framed in a retro digital casing.
// Original pixel-art artwork is rendered for mock/demo tracks.
// ============================================================

interface PixelAlbumArtProps {
  track?: Track | null;
  size?: number;
  showFrame?: boolean;
  pixelCover?: PixelCoverTheme;
  className?: string;
  isLoading?: boolean;
}

export function PixelAlbumArt({
  track,
  size = 140,
  showFrame = true,
  pixelCover,
  className,
  isLoading = false,
}: PixelAlbumArtProps) {
  if (isLoading) {
    return <PixelSkeleton width={size} height={size} className={className} />;
  }

  // Determine cover theme
  const theme: PixelCoverTheme =
    pixelCover || track?.pixelCover || 'midnight-drive';
  const SvgCover = PIXEL_COVER_MAP[theme] || MidnightDriveCover;

  const content = track?.albumImageUrl ? (
    <div
      className="relative overflow-hidden bg-bg-surface"
      style={{ width: size, height: size }}
    >
      <Image
        src={track.albumImageUrl}
        alt={track.albumName || track.name || 'Album Art'}
        width={size}
        height={size}
        className="object-cover"
        style={{ imageRendering: 'pixelated' }}
        unoptimized
      />
    </div>
  ) : (
    <SvgCover size={size} />
  );

  if (!showFrame) {
    return (
      <div
        className={cn('shrink-0 select-none overflow-hidden', className)}
        style={{ width: size, height: size }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative shrink-0 select-none p-1.5 bg-bg-surface border-2 border-border-subtle shadow-[3px_3px_0px_#0B0E18]',
        className
      )}
      style={{ width: size + 16, height: size + 16 }}
    >
      {/* Pixel Corner Accents */}
      <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-accent-primary" />
      <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent-primary" />
      <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-accent-primary" />
      <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-accent-primary" />

      {/* Artwork Canvas */}
      <div className="overflow-hidden border border-border-strong">{content}</div>

      {/* Bottom Hardware Bezel Status LEDs */}
      {size >= 80 && (
        <div className="flex items-center justify-between mt-1 px-1">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-accent-primary" />
            <span className="w-1.5 h-1.5 bg-accent-secondary" />
            <span className="w-1.5 h-1.5 bg-accent-warm" />
          </div>
          <span className="text-[7px] font-pixel text-text-muted tracking-widest">
            HI-FI
          </span>
        </div>
      )}
    </div>
  );
}
