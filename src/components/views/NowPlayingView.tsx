'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { PixelAlbumArt } from '@/components/artwork/PixelAlbumArt';
import { PixelEqBars } from '@/components/common/PixelVisualizer';
import { MOCK_TRACKS } from '@/lib/mockData';
import { formatTime, cn } from '@/lib/utils';
import { Track } from '@/types/music';

// ============================================================
// NowPlayingView — PIXELFM Retro Expanded Player View
// Faithfully matches media_1789322141861.jpg
// Left Column:
//   - Framed Pixel Sunset Artwork + Track Title, Artist, Album, Green Heart, "..."
//   - Lyrics Deck with "||||| SYNCED" pill badge, glowing green active lyric
// Right Column:
//   - Queue / Related Tabbed Deck
//   - "Now Playing" row with live green EQ bars
//   - "Next Up" queue list (Midnight Drive, Forest Rain, Neon City, Coffee & Code, Star Gazer)
// ============================================================

interface NowPlayingViewProps {
  onBack?: () => void;
  onPlayTrack?: (track: Track, context?: Track[]) => void;
}

export function NowPlayingView({ onBack, onPlayTrack }: NowPlayingViewProps) {
  const { state, seek, toggleLike, play } = usePlayer();
  const [activeTab, setActiveTab] = useState<'queue' | 'related'>('queue');
  const [optionsOpen, setOptionsOpen] = useState(false);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);

  // Fallback to Pixel Sunset if current track is null
  const currentTrack = state.currentTrack ?? MOCK_TRACKS[0];
  const lyrics = currentTrack.lyrics ?? MOCK_TRACKS[0].lyrics ?? [];

  // Determine active lyric based on progress
  const currentMs = state.progressMs;
  let activeLyricIndex = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentMs >= lyrics[i].timeMs) {
      activeLyricIndex = i;
    } else {
      break;
    }
  }

  // Auto-scroll lyrics box to keep active lyric in center
  useEffect(() => {
    if (activeLyricRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const el = activeLyricRef.current;
      const topPos = el.offsetTop - container.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
      container.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
    }
  }, [activeLyricIndex]);

  // Queue tracks matching screenshot: Midnight Drive, Forest Rain, Neon City, Coffee & Code, Star Gazer
  const queueTracks = MOCK_TRACKS.slice(1, 6);

  const handleTrackClick = (track: Track) => {
    if (onPlayTrack) {
      onPlayTrack(track, MOCK_TRACKS);
    } else {
      play(track, MOCK_TRACKS);
    }
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-6 md:px-8 md:py-8 select-none flex flex-col">
      {/* ─── MAIN TWO-COLUMN CONTAINER ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1 max-w-7xl">
        
        {/* ─── LEFT COLUMN: Artwork, Track Info & Synced Lyrics (7 cols) ─── */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Top Section: Large Pixel Artwork + Meta */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Framed Pixel Artwork */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 shrink-0 rounded-2xl overflow-hidden bg-[#0A0F17] border-2 border-[#1E2B3E] shadow-2xl flex items-center justify-center">
              <PixelAlbumArt
                track={currentTrack}
                size={288}
                showFrame={false}
              />
            </div>

            {/* Track Info & Actions */}
            <div className="flex flex-col min-w-0">
              <h1 className="font-pixel text-xl sm:text-2xl text-white font-bold tracking-tight leading-relaxed">
                {currentTrack.name}
              </h1>

              <div className="text-base text-[#94A3B8] font-sans font-medium mt-2">
                {currentTrack.artistName}
              </div>

              <div className="text-xs text-[#64748B] font-sans mt-1">
                {currentTrack.albumName}
              </div>

              {/* Heart and Options Action Row */}
              <div className="flex items-center gap-4 mt-6">
                {/* Phosphor Green Heart */}
                <button
                  type="button"
                  onClick={() => toggleLike(currentTrack.id)}
                  title={currentTrack.isLiked ? 'Liked' : 'Like'}
                  className="text-[#22C55E] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={currentTrack.isLiked ? '#22C55E' : 'none'} stroke="#22C55E" strokeWidth="2">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>

                {/* More Options Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOptionsOpen(!optionsOpen)}
                    title="More options"
                    className="text-[#94A3B8] hover:text-white transition-colors cursor-pointer p-1"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                    </svg>
                  </button>

                  {optionsOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-[#131C2A] border border-[#1E2B3E] rounded-xl shadow-xl py-1 z-30 font-sans text-xs">
                      <button
                        type="button"
                        onClick={() => { setOptionsOpen(false); }}
                        className="w-full text-left px-3 py-2 text-white hover:bg-[#1A2638] flex items-center gap-2 cursor-pointer"
                      >
                        Add to Playlist
                      </button>
                      <button
                        type="button"
                        onClick={() => { setOptionsOpen(false); }}
                        className="w-full text-left px-3 py-2 text-white hover:bg-[#1A2638] flex items-center gap-2 cursor-pointer"
                      >
                        View Artist
                      </button>
                      <button
                        type="button"
                        onClick={() => { setOptionsOpen(false); }}
                        className="w-full text-left px-3 py-2 text-white hover:bg-[#1A2638] flex items-center gap-2 cursor-pointer"
                      >
                        Share Track
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Lyrics Container */}
          <div className="flex flex-col gap-3 mt-2">
            {/* Header: "Lyrics" on Left, "||||| SYNCED" on Right */}
            <div className="flex items-center justify-between">
              <h2 className="font-pixel text-xs text-white uppercase tracking-wider font-bold">
                Lyrics
              </h2>

              {/* SYNCED Pill Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-pixel-ui font-bold tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.15)]">
                {/* 5 Equalizer Mini-Bars */}
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 h-full bg-[#22C55E] animate-pulse" />
                  <span className="w-0.5 h-2/3 bg-[#22C55E] animate-pulse" style={{ animationDelay: '0.15s' }} />
                  <span className="w-0.5 h-full bg-[#22C55E] animate-pulse" style={{ animationDelay: '0.3s' }} />
                  <span className="w-0.5 h-1/2 bg-[#22C55E] animate-pulse" style={{ animationDelay: '0.45s' }} />
                  <span className="w-0.5 h-4/5 bg-[#22C55E] animate-pulse" style={{ animationDelay: '0.6s' }} />
                </div>
                <span>SYNCED</span>
              </div>
            </div>

            {/* Lyrics Box */}
            <div
              ref={lyricsContainerRef}
              className="relative bg-[#0D1520] border border-[#1B2738] rounded-2xl p-6 h-[260px] overflow-y-auto font-sans leading-loose select-none shadow-inner"
            >
              <div className="flex flex-col gap-2.5 py-4">
                {lyrics.map((line, idx) => {
                  const isActive = idx === activeLyricIndex;
                  return (
                    <div
                      key={idx}
                      ref={isActive ? activeLyricRef : null}
                      onClick={() => seek(line.timeMs)}
                      className={cn(
                        'text-base transition-all duration-200 cursor-pointer select-none font-medium',
                        isActive
                          ? 'text-[#22C55E] text-lg font-bold drop-shadow-[0_0_10px_rgba(34,197,94,0.45)] scale-[1.01] translate-x-1'
                          : 'text-[#8B9CB3] hover:text-white'
                      )}
                      title={'Click to jump to ' + formatTime(line.timeMs)}
                    >
                      {line.text}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ─── RIGHT COLUMN: Queue & Related Tabs Deck (5 cols) ───── */}
        <div className="lg:col-span-5 bg-[#0D1520] border border-[#1B2738] rounded-2xl p-5 flex flex-col shadow-xl">
          {/* Tab Navigation Header */}
          <div className="flex items-center justify-between border-b border-[#1B2738] pb-3 mb-4">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('queue')}
                className={cn(
                  'text-sm font-semibold transition-colors relative pb-1 cursor-pointer',
                  activeTab === 'queue'
                    ? 'text-white'
                    : 'text-[#64748B] hover:text-[#94A3B8]'
                )}
              >
                Queue
                {activeTab === 'queue' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#22C55E] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('related')}
                className={cn(
                  'text-sm font-semibold transition-colors relative pb-1 cursor-pointer',
                  activeTab === 'related'
                    ? 'text-white'
                    : 'text-[#64748B] hover:text-[#94A3B8]'
                )}
              >
                Related
                {activeTab === 'related' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#22C55E] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                )}
              </button>
            </div>

            {/* List/Queue Icon */}
            <div className="text-[#64748B]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
          </div>

          {/* Tab 1: Queue Content */}
          {activeTab === 'queue' ? (
            <div className="flex flex-col gap-4">
              {/* Now Playing Header */}
              <div>
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2 font-sans">
                  Now Playing
                </div>

                {/* Now Playing Active Track Row */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#131C2A] border border-[#1E2B3E]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#0A0F17] flex items-center justify-center">
                      <PixelAlbumArt track={currentTrack} size={44} showFrame={false} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-white truncate font-sans">
                        {currentTrack.name}
                      </span>
                      <span className="text-xs text-[#94A3B8] truncate font-sans">
                        {currentTrack.artistName}
                      </span>
                    </div>
                  </div>

                  {/* Animated Green Equalizer Bars */}
                  <div className="px-2">
                    <PixelEqBars isPlaying={state.isPlaying} height={14} />
                  </div>
                </div>
              </div>

              {/* Next Up Header */}
              <div>
                <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2 font-sans">
                  Next Up
                </div>

                {/* Next Up Track Rows List */}
                <div className="flex flex-col gap-1">
                  {queueTracks.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => handleTrackClick(track)}
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#141E2D] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#0A0F17] flex items-center justify-center relative">
                          <PixelAlbumArt track={track} size={44} showFrame={false} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#22C55E">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-white group-hover:text-[#22C55E] transition-colors truncate font-sans">
                            {track.name}
                          </span>
                          <span className="text-xs text-[#94A3B8] truncate font-sans">
                            {track.artistName}
                          </span>
                        </div>
                      </div>

                      {/* Duration */}
                      <span className="text-xs text-[#64748B] font-mono shrink-0 pl-2">
                        {formatTime(track.durationMs)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Tab 2: Related Content */
            <div className="flex flex-col gap-3 py-2">
              <div className="text-xs text-[#94A3B8] font-sans">
                More retro synth and lo-fi tracks matching {currentTrack.artistName}:
              </div>
              {MOCK_TRACKS.slice(6, 11).map((track) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackClick(track)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#141E2D] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#0A0F17]">
                      <PixelAlbumArt track={track} size={40} showFrame={false} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-white group-hover:text-[#22C55E] truncate">
                        {track.name}
                      </span>
                      <span className="text-xs text-[#94A3B8] truncate">
                        {track.artistName}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#64748B] font-mono">
                    {formatTime(track.durationMs)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
