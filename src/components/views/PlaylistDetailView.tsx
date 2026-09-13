'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { PixelAlbumArt } from '@/components/artwork/PixelAlbumArt';
import { PixelIcon } from '@/components/common/PixelIcon';
import { PixelButton, PixelIconButton } from '@/components/common/PixelButton';
import { PixelEqBars } from '@/components/common/PixelVisualizer';
import { formatTime, cn } from '@/lib/utils';
import { Playlist, Track } from '@/types/music';

// ============================================================
// PlaylistDetailView — Retro Album & Playlist Tracklist Deck
// Large framed playlist artwork banner + interactive tracklist
// ============================================================

interface PlaylistDetailViewProps {
  playlist: Playlist;
  onPlayTrack: (track: Track, context: Track[]) => void;
  onBack: () => void;
}

export function PlaylistDetailView({
  playlist,
  onPlayTrack,
  onBack,
}: PlaylistDetailViewProps) {
  const { state, toggleLike } = usePlayer();
  const tracks = playlist.tracks || [];

  const totalDurationMs = tracks.reduce((acc, t) => acc + t.durationMs, 0);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      onPlayTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 flex flex-col gap-6 select-none">
      {/* ─── Back Navigation ──────────────────────────────── */}
      <div>
        <PixelButton variant="ghost" size="sm" onClick={onBack}>
          <span className="flex items-center gap-1.5 font-pixel text-[9px]">
            <PixelIcon name="chevronLeft" size={12} />
            BACK TO LIBRARY
          </span>
        </PixelButton>
      </div>

      {/* ─── Playlist Hero Deck ───────────────────────────── */}
      <div className="p-6 bg-bg-surface border-2 border-border-strong flex flex-col md:flex-row items-center md:items-end gap-6 shadow-[6px_6px_0px_#0B0E18]">
        <div className="shrink-0">
          <PixelAlbumArt track={tracks[0]} size={160} showFrame={true} />
        </div>

        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="text-[10px] font-pixel-ui text-accent-primary uppercase tracking-widest mb-1">
            DIGITAL AUDIO COMPILATION
          </div>

          <h1 className="font-pixel text-[22px] md:text-[30px] text-text-primary mb-2 leading-tight">
            {playlist.name}
          </h1>

          <p className="font-pixel-ui text-px-sm text-text-secondary max-w-xl mb-4 leading-relaxed">
            {playlist.description ||
              'A collection of 16-bit analog soundscapes and synthesized frequency modulations.'}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[11px] font-mono text-text-muted mb-5">
            <span>BY {playlist.ownerName || 'PIXELIFY ARCHIVE'}</span>
            <span>•</span>
            <span>{tracks.length} TRACKS</span>
            <span>•</span>
            <span>APPROX {Math.round(totalDurationMs / 60000)} MIN</span>
          </div>

          <div className="flex items-center gap-3">
            <PixelButton variant="primary" size="md" onClick={handlePlayAll}>
              <span className="flex items-center gap-2">
                <PixelIcon name="play" size={14} />
                PLAY ALL
              </span>
            </PixelButton>
          </div>
        </div>
      </div>

      {/* ─── Tracklist Table ──────────────────────────────── */}
      <div className="border border-border-subtle bg-bg-surface">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle text-[10px] font-mono text-text-muted uppercase">
          <span className="w-6 text-center">#</span>
          <span className="w-10"></span>
          <span className="flex-1">TITLE</span>
          <span className="hidden md:block w-44">ALBUM</span>
          <span className="w-16 text-right">TIME</span>
          <span className="w-8"></span>
        </div>

        {tracks.map((track, i) => {
          const isCurrent = state.currentTrack?.id === track.id;
          return (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track, tracks)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 border-b border-border-subtle/40 hover:bg-bg-elevated transition-colors group cursor-pointer',
                isCurrent && 'bg-bg-elevated border-l-2 border-l-accent-primary'
              )}
            >
              {/* # Index or Animated EQ */}
              <span className="w-6 text-center text-[10px] font-mono text-text-muted">
                {isCurrent && state.isPlaying ? (
                  <PixelEqBars height={12} isPlaying={true} />
                ) : (
                  String(i + 1).padStart(2, '0')
                )}
              </span>

              {/* Artwork Thumbnail */}
              <div className="w-10 h-10 shrink-0">
                <PixelAlbumArt track={track} size={40} showFrame={false} />
              </div>

              {/* Title & Artist */}
              <div className="flex-1 min-w-0 pr-2">
                <div
                  className={cn(
                    'font-pixel text-[10px] truncate',
                    isCurrent ? 'text-accent-primary' : 'text-text-primary group-hover:text-accent-primary'
                  )}
                >
                  {track.name}
                </div>
                <div className="text-[11px] font-pixel-ui text-text-muted truncate mt-0.5">
                  {track.artistName}
                </div>
              </div>

              {/* Album */}
              <div className="hidden md:block w-44 text-[11px] font-pixel-ui text-text-muted truncate">
                {track.albumName}
              </div>

              {/* Duration */}
              <div className="w-16 text-right font-mono text-[11px] text-text-muted">
                {formatTime(track.durationMs)}
              </div>

              {/* Like Button */}
              <div className="w-8 flex justify-end" onClick={(e) => e.stopPropagation()}>
                <PixelIconButton
                  label="Like"
                  size="xs"
                  onClick={() => toggleLike(track.id)}
                >
                  <PixelIcon
                    name={track.isLiked ? 'heartFilled' : 'heart'}
                    size={12}
                    color={track.isLiked ? 'var(--color-accent-primary)' : 'currentColor'}
                  />
                </PixelIconButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
