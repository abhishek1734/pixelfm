'use client';

import React, { useEffect, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { PixelAlbumArt } from '@/components/artwork/PixelAlbumArt';
import { PixelProgressBar, PixelVolumeSlider } from '@/components/common/PixelSlider';
import { PixelVisualizer } from '@/components/common/PixelVisualizer';
import { formatTime, cn } from '@/lib/utils';
import { MOCK_TRACKS } from '@/lib/mockData';

// ============================================================
// ExpandedPlayer — PIXELFM Now Playing / Hi-Fi Room
// Faithfully matches media_1789322141861.jpg
// Includes:
// - Header: "< PLAYING FROM Chill Vibes" + action icons
// - Left Column: Large framed artwork, track details, green heart,
//   and interactive synced lyrics box with phosphor green active line
// - Right Column: Queue & Related tabbed deck + animated equalizer
// - Bottom Bar: Full player controls with green scrubber
// ============================================================

interface ExpandedPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpandedPlayer({ isOpen, onClose }: ExpandedPlayerProps) {
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
    play,
  } = usePlayer();

  const [activeDeckTab, setActiveDeckTab] = React.useState<'queue' | 'related'>('queue');
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener (Escape closes, Space toggles play)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        if (state.isPlaying) {
          pause();
        } else {
          resume();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, state.isPlaying, pause, resume]);

  // Current track and fallback
  const currentTrack = state.currentTrack || MOCK_TRACKS[0];
  const isPlaying = state.isPlaying;

  // Track lyrics
  const lyrics = currentTrack.lyrics || [
    { timeMs: 0, text: "Neon lights reflecting on the street" },
    { timeMs: 12000, text: "Driving slow with nowhere else to be" },
    { timeMs: 24000, text: "Synthesizers humming in the night" },
    { timeMs: 36000, text: "Everything is gonna be alright" },
    { timeMs: 48000, text: "Pixelated memories fade away" },
    { timeMs: 60000, text: "Waiting for another sunny day" },
    { timeMs: 76000, text: "The horizon glows in purple pink and gold" },
    { timeMs: 92000, text: "A retro story waiting to unfold" },
  ];

  // Determine active lyric line index based on current progressMs
  const activeLyricIndex = lyrics.reduce((accIndex, line, idx) => {
    return state.progressMs >= line.timeMs ? idx : accIndex;
  }, 0);

  // Auto-scroll lyrics box to keep active line centered
  useEffect(() => {
    if (lyricsContainerRef.current) {
      const activeEl = lyricsContainerRef.current.children[activeLyricIndex] as HTMLElement;
      if (activeEl) {
        lyricsContainerRef.current.scrollTo({
          top: activeEl.offsetTop - lyricsContainerRef.current.offsetTop - 60,
          behavior: 'smooth',
        });
      }
    }
  }, [activeLyricIndex]);

  if (!isOpen) return null;

  const handlePlayToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  // Up next tracks for queue
  const queueTracks = state.queue.length > 0 ? state.queue : MOCK_TRACKS.slice(0, 8);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] bg-[#0A0F17] flex flex-col select-none overflow-hidden animate-pixel-fade-in'
      )}
    >
      {/* ─── Top Header Bar: "< PLAYING FROM Chill Vibes" ─── */}
      <header className="h-16 px-6 border-b border-[#1E2B3E] flex items-center justify-between bg-[#0E1521]/90 backdrop-blur-md shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#131C2A] border border-[#1E2B3E] flex items-center justify-center text-white group-hover:border-[#22C55E]/50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-[#64748B] group-hover:text-[#94A3B8] transition-colors font-mono">
            PLAYING FROM <span className="text-white font-bold">Chill Vibes</span>
          </span>
        </button>

        {/* Action icons on right */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#131C2A] border border-[#1E2B3E] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#22C55E]/40 transition-colors cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>
      </header>

      {/* ─── Main Two-Column Layout ─────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-6 py-6 md:px-12 md:py-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
        {/* LEFT COLUMN: Large Art, Details, Synced Lyrics Box */}
        <section className="flex-1 flex flex-col max-w-xl mx-auto w-full">
          {/* Framed Album Art Hero */}
          <div className="relative aspect-square w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-[#131C2A] border-2 border-[#1E2B3E] shadow-2xl p-2.5 mb-6">
            <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center bg-[#0A0F17]">
              <PixelAlbumArt track={currentTrack} size={320} showFrame={false} />
            </div>
          </div>

          {/* Track Info & Green Heart Row */}
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="min-w-0 pr-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight truncate">
                {currentTrack.name}
              </h2>
              <p className="text-base text-[#94A3B8] font-medium mt-0.5 truncate">
                {currentTrack.artistName}
              </p>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                {currentTrack.albumName}
              </p>
            </div>

            {/* Green Heart Button */}
            <button
              type="button"
              onClick={() => toggleLike(currentTrack.id)}
              className="p-2.5 rounded-full bg-[#131C2A] border border-[#1E2B3E] text-[#64748B] hover:text-[#22C55E] hover:border-[#22C55E]/40 transition-all cursor-pointer flex-shrink-0"
              title={currentTrack.isLiked ? 'Unlike' : 'Like'}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={currentTrack.isLiked ? '#22C55E' : 'none'}
                stroke={currentTrack.isLiked ? '#22C55E' : 'currentColor'}
                strokeWidth="2"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          {/* ── Synced Lyrics Box (Matches Screenshot) ───────── */}
          <div className="bg-[#131C2A] border border-[#1E2B3E] rounded-xl p-4 md:p-5 flex flex-col flex-1 min-h-[220px] max-h-[300px] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2B3E] mb-3">
              <span className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                SYNCED LYRICS
              </span>
              <span className="text-[10px] font-mono text-[#64748B]">
                CLICK TO SEEK
              </span>
            </div>

            <div
              ref={lyricsContainerRef}
              className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar font-sans select-none"
            >
              {lyrics.map((line, idx) => {
                const isActive = idx === activeLyricIndex;
                const isPast = idx < activeLyricIndex;

                return (
                  <p
                    key={`${line.timeMs}-${idx}`}
                    onClick={() => seek(line.timeMs)}
                    className={cn(
                      'text-sm md:text-base font-semibold transition-all duration-300 cursor-pointer rounded-lg px-2.5 py-1.5',
                      isActive &&
                        'text-[#22C55E] bg-[#22C55E]/10 border-l-4 border-[#22C55E] scale-[1.02] shadow-[0_0_15px_rgba(34,197,94,0.15)] font-bold',
                      isPast && 'text-[#94A3B8] hover:text-white',
                      !isActive && !isPast && 'text-[#475569] hover:text-[#94A3B8]'
                    )}
                  >
                    {line.text}
                  </p>
                );
              })}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Queue & Related Tabs Deck + Equalizer */}
        <section className="flex-1 flex flex-col max-w-xl mx-auto w-full bg-[#131C2A] border border-[#1E2B3E] rounded-2xl p-5 shadow-sm">
          {/* Deck Header Tabs */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1E2B3E] mb-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveDeckTab('queue')}
                className={cn(
                  'text-sm font-bold tracking-wide transition-colors cursor-pointer pb-1',
                  activeDeckTab === 'queue'
                    ? 'text-white border-b-2 border-[#22C55E]'
                    : 'text-[#64748B] hover:text-white'
                )}
              >
                Queue
              </button>
              <button
                type="button"
                onClick={() => setActiveDeckTab('related')}
                className={cn(
                  'text-sm font-bold tracking-wide transition-colors cursor-pointer pb-1',
                  activeDeckTab === 'related'
                    ? 'text-white border-b-2 border-[#22C55E]'
                    : 'text-[#64748B] hover:text-white'
                )}
              >
                Related
              </button>
            </div>

            <span className="text-xs font-mono text-[#64748B]">
              {queueTracks.length} TRACKS
            </span>
          </div>

          {/* Queue Track List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[280px]">
            {activeDeckTab === 'queue' ? (
              queueTracks.map((track, i) => {
                const isCurrent = currentTrack.id === track.id;
                return (
                  <div
                    key={`${track.id}-${i}`}
                    onClick={() => play(track, queueTracks)}
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-[#1E2B3E] hover:bg-[#162234] transition-all cursor-pointer group',
                      isCurrent && 'bg-[#162234] border-[#22C55E]/30'
                    )}
                  >
                    {/* Index or Equalizer */}
                    <span className="w-5 text-center text-xs font-mono text-[#64748B]">
                      {isCurrent && isPlaying ? (
                        <span className="text-[#22C55E]">▶</span>
                      ) : (
                        i + 1
                      )}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#0A0F17] flex-shrink-0">
                      <PixelAlbumArt track={track} size={40} showFrame={false} />
                    </div>

                    {/* Title & Artist */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          'text-[13px] font-semibold truncate',
                          isCurrent ? 'text-[#22C55E]' : 'text-white group-hover:text-[#22C55E]'
                        )}
                      >
                        {track.name}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] truncate mt-0.5 font-sans">
                        {track.artistName}
                      </div>
                    </div>

                    {/* Duration */}
                    <span className="text-xs font-mono text-[#64748B] pr-2">
                      {formatTime(track.durationMs)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-[#94A3B8]">
                <p className="text-sm font-semibold text-white mb-1">
                  Similar 16-Bit Artists
                </p>
                <p className="text-xs text-[#64748B] max-w-xs">
                  More synthwave, retro chiptune, and nostalgic ambient melodies like The Retros.
                </p>
              </div>
            )}
          </div>

          {/* Equalizer Visualizer at bottom of deck */}
          <div className="mt-4 pt-4 border-t border-[#1E2B3E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span className="text-[10px] font-mono text-[#64748B] uppercase">
                SPECTRUM DUAL CHANNEL
              </span>
            </div>
            <div className="h-6 flex items-end">
              <PixelVisualizer isPlaying={isPlaying} barCount={16} height={24} />
            </div>
          </div>
        </section>
      </main>

      {/* ─── Bottom Integrated Playback Controls ───────────── */}
      <footer className="bg-[#0E1521] border-t border-[#1E2B3E] px-6 py-3.5 shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          {/* Progress Slider with Timestamps */}
          <div className="w-full flex items-center gap-3">
            <span className="text-xs font-mono text-[#94A3B8] w-12 text-right">
              {formatTime(state.progressMs)}
            </span>
            <div className="flex-1">
              <PixelProgressBar
                currentMs={state.progressMs}
                totalMs={currentTrack.durationMs}
                onSeek={seek}
                isInteractive={true}
              />
            </div>
            <span className="text-xs font-mono text-[#94A3B8] w-12">
              {formatTime(currentTrack.durationMs)}
            </span>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="w-32 hidden md:block">
              {/* Optional left slot */}
            </div>

            {/* Master Control Buttons */}
            <div className="flex items-center gap-5 mx-auto">
              <button
                type="button"
                onClick={toggleShuffle}
                className={cn(
                  'p-2 text-sm transition-colors cursor-pointer',
                  state.shuffle ? 'text-[#22C55E]' : 'text-[#64748B] hover:text-white'
                )}
                title="Shuffle"
              >
                🔀
              </button>

              <button
                type="button"
                onClick={prev}
                className="p-2 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                title="Previous"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              {/* Large Green Play/Pause Button */}
              <button
                type="button"
                onClick={handlePlayToggle}
                className="w-12 h-12 rounded-full bg-[#22C55E] text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={next}
                className="p-2 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                title="Next"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={toggleRepeat}
                className={cn(
                  'p-2 text-sm transition-colors cursor-pointer',
                  state.repeat !== 'off' ? 'text-[#22C55E]' : 'text-[#64748B] hover:text-white'
                )}
                title="Repeat"
              >
                🔁
              </button>
            </div>

            {/* Volume on right */}
            <div className="w-36 flex items-center justify-end">
              <PixelVolumeSlider
                volume={state.volume}
                isMuted={state.isMuted}
                onVolumeChange={setVolume}
                onMuteToggle={toggleMute}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
