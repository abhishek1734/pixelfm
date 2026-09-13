'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { PixelAlbumArt } from '@/components/artwork/PixelAlbumArt';
import { PixelProgressBar, PixelVolumeSlider } from '@/components/common/PixelSlider';
import { PixelVisualizer } from '@/components/common/PixelVisualizer';
import { formatTime, cn } from '@/lib/utils';

// ============================================================
// PlayerBar — PIXELFM Persistent Audio Dock
// Faithfully matches media_1789322141854.jpg
// Includes:
// - Left: Album art thumbnail, Track name, Artist, Green Heart
// - Center: Shuffle, Previous, Phosphor Green Play/Pause, Next, Repeat + Timeline
// - Right: Visualizer, Queue toggle, Volume slider, Expand button
// ============================================================

interface PlayerBarProps {
  onExpand?: () => void;
  onQueueToggle?: () => void;
  isQueueOpen?: boolean;
  className?: string;
}

export function PlayerBar({
  onExpand,
  onQueueToggle,
  isQueueOpen = false,
  className,
}: PlayerBarProps) {
  const {
    state,
    resume,
    pause,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
  } = usePlayer();

  const currentTrack = state.currentTrack;
  const isPlaying = state.isPlaying;

  const handlePlayToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 h-[84px]',
        'bg-[#0E1521] border-t border-[#1B2738] shadow-[0_-8px_20px_rgba(0,0,0,0.6)]',
        'flex items-center justify-between px-4 md:px-6 select-none',
        className
      )}
    >
      {/* ─── LEFT: Now Playing Info ────────────────────────── */}
      <div className="flex items-center gap-3 w-[220px] md:w-[280px] shrink-0 min-w-0">
        <div
          onClick={onExpand}
          className="cursor-pointer transition-transform hover:scale-105 shrink-0 rounded-lg overflow-hidden bg-[#0A0F17]"
          title="Click to expand player"
        >
          <PixelAlbumArt
            track={currentTrack}
            size={52}
            showFrame={false}
          />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div
            onClick={onExpand}
            className="text-[13px] font-bold text-white hover:text-[#22C55E] cursor-pointer truncate font-sans"
            title={currentTrack ? `${currentTrack.name} — ${currentTrack.artistName}` : 'No Track'}
          >
            {currentTrack ? currentTrack.name : 'PIXELFM HI-FI'}
          </div>
          <div className="text-[11px] text-[#94A3B8] truncate mt-0.5 font-sans">
            {currentTrack ? currentTrack.artistName : 'STANDBY MODE'}
          </div>
        </div>

        {currentTrack && (
          <button
            type="button"
            onClick={() => toggleLike(currentTrack.id)}
            title={currentTrack.isLiked ? 'Unlike' : 'Like'}
            className="p-1.5 rounded-full text-[#64748B] hover:text-[#22C55E] transition-colors cursor-pointer shrink-0"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={currentTrack.isLiked ? '#22C55E' : 'none'}
              stroke={currentTrack.isLiked ? '#22C55E' : 'currentColor'}
              strokeWidth="2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        )}
      </div>

      {/* ─── CENTER: Playback Deck & Progress ───────────────── */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-[560px] px-2 md:px-4">
        {/* Buttons Row */}
        <div className="flex items-center gap-4 md:gap-5 mb-1.5">
          {/* Shuffle */}
          <button
            type="button"
            onClick={toggleShuffle}
            className={cn(
              'text-xs transition-colors cursor-pointer',
              state.shuffle ? 'text-[#22C55E]' : 'text-[#64748B] hover:text-white'
            )}
            title="Toggle Shuffle"
          >
            🔀
          </button>

          {/* Previous Track */}
          <button
            type="button"
            onClick={prev}
            className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer p-1"
            title="Previous track"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          {/* Master Round Phosphor Green Play/Pause Button */}
          <button
            type="button"
            onClick={handlePlayToggle}
            className="w-10 h-10 rounded-full bg-[#22C55E] text-black flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next Track */}
          <button
            type="button"
            onClick={next}
            className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer p-1"
            title="Next track"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>

          {/* Repeat */}
          <button
            type="button"
            onClick={toggleRepeat}
            className={cn(
              'text-xs transition-colors cursor-pointer',
              state.repeat !== 'off' ? 'text-[#22C55E]' : 'text-[#64748B] hover:text-white'
            )}
            title={`Repeat mode: ${state.repeat}`}
          >
            🔁
          </button>
        </div>

        {/* Progress Bar with Digital Timestamps */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#94A3B8] w-10 text-right">
            {formatTime(state.progressMs)}
          </span>
          <div className="flex-1">
            <PixelProgressBar
              currentMs={state.progressMs}
              totalMs={currentTrack?.durationMs || 180000}
              onSeek={seek}
              isInteractive={true}
            />
          </div>
          <span className="text-[11px] font-mono text-[#94A3B8] w-10">
            {formatTime(currentTrack?.durationMs || 180000)}
          </span>
        </div>
      </div>

      {/* ─── RIGHT: Visualizer & System Controls ────────────── */}
      <div className="flex items-center justify-end gap-2 md:gap-3 w-[220px] md:w-[280px] shrink-0">
        {/* Mini Audio Equalizer Display */}
        <div className="hidden lg:flex items-center mr-1">
          <PixelVisualizer isPlaying={isPlaying} barCount={8} height={18} />
        </div>

        {/* Queue Drawer Toggle */}
        <button
          type="button"
          onClick={onQueueToggle}
          title="Toggle Queue"
          className={cn(
            'p-2 rounded-lg transition-colors cursor-pointer',
            isQueueOpen
              ? 'bg-[#1E2B3E] text-[#22C55E]'
              : 'text-[#94A3B8] hover:text-white hover:bg-[#131C2A]'
          )}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>

        {/* Compact Volume Slider */}
        <div className="hidden sm:block">
          <PixelVolumeSlider
            volume={state.volume}
            isMuted={state.isMuted}
            onVolumeChange={setVolume}
            onMuteToggle={toggleMute}
          />
        </div>

        {/* Fullscreen Expand Button */}
        <button
          type="button"
          onClick={onExpand}
          title="Expand Now Playing"
          className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#131C2A] transition-colors cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

