'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { PixelAlbumArt } from '@/components/artwork/PixelAlbumArt';
import { PixelIcon } from '@/components/common/PixelIcon';
import { PixelIconButton } from '@/components/common/PixelButton';
import { PixelEqBars } from '@/components/common/PixelVisualizer';
import { formatTime, cn } from '@/lib/utils';

// ============================================================
// QueuePanel — Retro 320px Slide-out Queue Deck
// Shows Currently Playing and interactive Next-Up track list
// ============================================================

interface QueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function QueuePanel({ isOpen, onClose, className }: QueuePanelProps) {
  const { state, play, removeFromQueue, clearQueue } = usePlayer();

  if (!isOpen) return null;

  const currentTrack = state.currentTrack;
  const queue = state.queue;
  const isPlaying = state.isPlaying;

  // Tracks upcoming after current
  const upcomingTracks = queue.filter((_, idx) => idx > state.queueIndex);

  return (
    <div
      className={cn(
        'w-[320px] h-full bg-bg-secondary border-l-2 border-border-subtle flex flex-col z-40 select-none shrink-0',
        className
      )}
    >
      {/* ─── Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-elevated border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-accent-primary" />
          <span className="font-pixel text-[10px] text-text-primary uppercase tracking-wider">
            PLAYBACK QUEUE
          </span>
        </div>
        <PixelIconButton label="Close queue" size="sm" onClick={onClose}>
          <PixelIcon name="close" size={14} />
        </PixelIconButton>
      </div>

      {/* ─── Scrollable Queue Body ─────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
        {/* NOW PLAYING SECTION */}
        <div>
          <div className="text-[10px] font-pixel-ui text-text-muted uppercase tracking-wider mb-2 px-1">
            NOW PLAYING
          </div>

          {currentTrack ? (
            <div className="p-2.5 bg-bg-surface border-2 border-accent-primary flex items-center gap-3">
              <PixelAlbumArt
                track={currentTrack}
                size={40}
                showFrame={false}
                className="border border-border-strong shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-pixel text-[10px] text-accent-primary truncate">
                  {currentTrack.name}
                </div>
                <div className="text-[11px] font-pixel-ui text-text-secondary truncate mt-0.5">
                  {currentTrack.artistName}
                </div>
              </div>
              <div className="shrink-0 flex items-center">
                {isPlaying ? (
                  <PixelEqBars height={14} isPlaying={true} />
                ) : (
                  <span className="text-[11px] font-mono text-text-muted">
                    {formatTime(currentTrack.durationMs)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-bg-surface border border-border-subtle text-center text-text-muted text-px-sm font-pixel-ui">
              NO TRACK LOADED
            </div>
          )}
        </div>

        {/* NEXT UP SECTION */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-pixel-ui text-text-muted uppercase tracking-wider">
              NEXT UP ({upcomingTracks.length})
            </span>
            {upcomingTracks.length > 0 && (
              <button
                type="button"
                onClick={clearQueue}
                className="text-[9px] font-pixel text-accent-primary hover:underline uppercase cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>

          {upcomingTracks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-border-subtle bg-bg-surface/50 text-center">
              <PixelIcon name="disc" size={28} color="var(--color-text-muted)" className="mb-2" />
              <div className="font-pixel text-[10px] text-text-muted mb-1">
                QUEUE EMPTY
              </div>
              <div className="text-[11px] font-pixel-ui text-text-muted/70">
                Add tracks from your library or search
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {upcomingTracks.map((track, i) => {
                const actualIndex = state.queueIndex + 1 + i;
                return (
                  <div
                    key={`${track.id}-${actualIndex}`}
                    className="group p-2 bg-bg-surface border border-border-subtle hover:border-border-strong hover:bg-bg-elevated flex items-center gap-2.5 transition-colors"
                  >
                    <span className="w-4 text-center text-[10px] font-mono text-text-muted">
                      {i + 1}
                    </span>
                    <PixelAlbumArt
                      track={track}
                      size={32}
                      showFrame={false}
                      className="shrink-0"
                    />
                    <div
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => play(track, queue)}
                    >
                      <div className="font-pixel text-[9px] text-text-primary group-hover:text-accent-primary truncate">
                        {track.name}
                      </div>
                      <div className="text-[10px] font-pixel-ui text-text-muted truncate">
                        {track.artistName}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-text-muted group-hover:hidden">
                        {formatTime(track.durationMs)}
                      </span>
                      <PixelIconButton
                        label="Remove from queue"
                        size="xs"
                        variant="ghost"
                        onClick={() => removeFromQueue(actualIndex)}
                        className="hidden group-hover:inline-flex text-accent-primary hover:bg-accent-primary/20"
                      >
                        <PixelIcon name="remove" size={12} />
                      </PixelIconButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
