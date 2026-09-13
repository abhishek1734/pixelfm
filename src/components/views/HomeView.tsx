'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { PixelAlbumArt } from '@/components/artwork/PixelAlbumArt';
import { PixelEqBars } from '@/components/common/PixelVisualizer';
import {
  MOCK_PLAYLISTS,
  MOCK_RECENTLY_PLAYED,
  MOCK_TRACKS,
} from '@/lib/mockData';
import { formatTime, getTimeOfDay, cn } from '@/lib/utils';
import { NavPage, Playlist, Track } from '@/types/music';

// ============================================================
// HomeView — PIXELFM Retro Music Dashboard
// Faithfully matches media_1789322141854.jpg
// Includes:
// - Header with "Good Evening" and "Discover your next favorite track."
// - Curated Playlists Deck (Chill Vibes, Late Night, Focus, Discover Weekly, Release Radar)
// - Recently Played Grid (Midnight Drive, Pixel Sunset, Forest Rain, Neon City, Coffee & Code, Star Gazer)
// - Recommended For You interactive track table
// ============================================================

interface HomeViewProps {
  onNavigate: (page: NavPage) => void;
  onPlayPlaylist: (playlist: Playlist) => void;
  onPlayTrack: (track: Track, context?: Track[]) => void;
}

export function HomeView({ onNavigate, onPlayPlaylist, onPlayTrack }: HomeViewProps) {
  const { state, toggleLike } = usePlayer();

  const tod = getTimeOfDay();
  const greeting = tod === 'morning' ? 'Good Morning' : tod === 'afternoon' ? 'Good Afternoon' : 'Good Evening';

  // The 5 curated cards from screenshot
  const curatedCards = [
    {
      playlist: MOCK_PLAYLISTS[0], // Chill Vibes
      name: 'Chill Vibes',
      desc: 'Lo-fi beats and relaxing melodies',
      pixelCover: 'chill-vibes' as const,
    },
    {
      playlist: MOCK_PLAYLISTS[1], // Late Night
      name: 'Late Night',
      desc: 'Ambient sounds for late hours',
      pixelCover: 'midnight-drive' as const,
    },
    {
      playlist: MOCK_PLAYLISTS[2], // Focus
      name: 'Focus',
      desc: 'Instrumental tracks to help you concentrate',
      pixelCover: 'focus' as const,
    },
    {
      playlist: MOCK_PLAYLISTS[3], // Discover Weekly
      name: 'Discover Weekly',
      desc: 'Fresh music picked just for you',
      pixelCover: 'space-station' as const,
    },
    {
      playlist: MOCK_PLAYLISTS[4], // Release Radar
      name: 'Release Radar',
      desc: 'Catch all the latest music from artists you follow',
      pixelCover: 'retro-computer' as const,
    },
  ];

  return (
    <div className="h-full overflow-y-auto px-6 py-6 md:px-8 md:py-8 flex flex-col gap-8 select-none">
      {/* ─── HEADER: Greeting & Tagline ───────────────────── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          {greeting}
        </h1>
        <p className="text-sm md:text-base text-[#94A3B8] mt-1 font-sans">
          Discover your next favorite track.
        </p>
      </div>

      {/* ─── SECTION 1: Curated Playlists Cards Row ────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {curatedCards.map((card) => (
          <div
            key={card.name}
            onClick={() => onPlayPlaylist(card.playlist)}
            className="group relative bg-[#131C2A] border border-[#1E2B3E] rounded-xl p-3.5 hover:border-[#22C55E]/50 hover:bg-[#162234] transition-all duration-200 cursor-pointer flex flex-col shadow-sm"
          >
            {/* Artwork Container */}
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#0A0F17] mb-3 flex items-center justify-center">
              <PixelAlbumArt pixelCover={card.pixelCover} size={180} showFrame={false} />

              {/* Hover Green Play Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayPlaylist(card.playlist);
                }}
                className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-[#22C55E] text-black flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-105 cursor-pointer z-10"
                title={`Play ${card.name}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>

            {/* Title & Description */}
            <div className="font-semibold text-[14px] text-white group-hover:text-[#22C55E] transition-colors truncate">
              {card.name}
            </div>
            <div className="text-[12px] text-[#94A3B8] line-clamp-2 mt-1 font-sans leading-relaxed">
              {card.desc}
            </div>
          </div>
        ))}
      </div>

      {/* ─── SECTION 2: Recently Played Row ────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Recently Played
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('recently-played')}
            className="text-xs font-semibold text-[#22C55E] hover:underline cursor-pointer"
          >
            SEE ALL
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {MOCK_RECENTLY_PLAYED.slice(0, 6).map((track) => {
            const isCurrent = state.currentTrack?.id === track.id;

            return (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track, MOCK_RECENTLY_PLAYED)}
                className="group relative bg-[#131C2A] border border-[#1E2B3E] rounded-xl p-3 hover:border-[#22C55E]/50 hover:bg-[#162234] transition-all duration-200 cursor-pointer flex flex-col shadow-sm"
              >
                {/* Artwork */}
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#0A0F17] mb-2.5 flex items-center justify-center">
                  <PixelAlbumArt track={track} size={150} showFrame={false} />

                  {/* Play button overlay */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayTrack(track, MOCK_RECENTLY_PLAYED);
                    }}
                    className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-[#22C55E] text-black flex items-center justify-center shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-105 cursor-pointer z-10"
                    title={`Play ${track.name}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>

                  {/* Active playing indicator badge */}
                  {isCurrent && state.isPlaying && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-[#22C55E]/50">
                      <PixelEqBars height={10} isPlaying={true} />
                    </div>
                  )}
                </div>

                <div className={cn(
                  'font-medium text-[13px] truncate transition-colors',
                  isCurrent ? 'text-[#22C55E]' : 'text-white group-hover:text-[#22C55E]'
                )}>
                  {track.name}
                </div>
                <div className="text-[11px] text-[#94A3B8] truncate mt-0.5 font-sans">
                  {track.artistName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 3: Recommended Tracks Table ───────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Recommended For You
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('library')}
            className="text-xs font-semibold text-[#22C55E] hover:underline cursor-pointer"
          >
            VIEW ALL
          </button>
        </div>

        <div className="border border-[#1E2B3E] rounded-xl bg-[#131C2A] overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1E2B3E] text-[11px] font-semibold text-[#64748B] uppercase font-sans">
            <span className="w-8 text-center">#</span>
            <span className="w-10"></span>
            <span className="flex-1">TITLE / ARTIST</span>
            <span className="hidden md:block w-48">ALBUM</span>
            <span className="w-16 text-right">TIME</span>
            <span className="w-10"></span>
          </div>

          {/* Track Rows */}
          {MOCK_TRACKS.slice(0, 8).map((track, i) => {
            const isCurrent = state.currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 border-b border-[#1E2B3E]/40 hover:bg-[#162234] transition-colors group cursor-pointer',
                  isCurrent && 'bg-[#162234] border-l-4 border-l-[#22C55E]'
                )}
                onClick={() => onPlayTrack(track, MOCK_TRACKS)}
              >
                {/* Track Number or Animated Equalizer */}
                <span className="w-8 text-center text-[12px] font-sans text-[#64748B]">
                  {isCurrent && state.isPlaying ? (
                    <PixelEqBars height={12} isPlaying={true} />
                  ) : (
                    String(i + 1).padStart(2, '0')
                  )}
                </span>

                {/* Artwork Thumbnail */}
                <div className="w-10 h-10 shrink-0 rounded overflow-hidden bg-[#0A0F17]">
                  <PixelAlbumArt track={track} size={40} showFrame={false} />
                </div>

                {/* Title & Artist */}
                <div className="flex-1 min-w-0 pr-2">
                  <div
                    className={cn(
                      'text-[13px] font-medium truncate font-sans',
                      isCurrent ? 'text-[#22C55E]' : 'text-white group-hover:text-[#22C55E]'
                    )}
                  >
                    {track.name}
                  </div>
                  <div className="text-[11px] text-[#94A3B8] truncate mt-0.5 font-sans">
                    {track.artistName}
                  </div>
                </div>

                {/* Album Name */}
                <div className="hidden md:block w-48 text-[12px] text-[#94A3B8] truncate font-sans">
                  {track.albumName}
                </div>

                {/* Duration */}
                <div className="w-16 text-right font-mono text-[12px] text-[#94A3B8]">
                  {formatTime(track.durationMs)}
                </div>

                {/* Like Button */}
                <div className="w-10 flex justify-end" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => toggleLike(track.id)}
                    title={track.isLiked ? 'Unlike' : 'Like'}
                    className="p-1.5 text-[#64748B] hover:text-[#22C55E] transition-colors cursor-pointer"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={track.isLiked ? '#22C55E' : 'none'}
                      stroke={track.isLiked ? '#22C55E' : 'currentColor'}
                      strokeWidth="2"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
