'use client';

import React, { useState, useMemo } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { PixelAlbumArt } from '@/components/artwork/PixelAlbumArt';
import { MOCK_TRACKS } from '@/lib/mockData';
import { formatTime, cn } from '@/lib/utils';
import { Track } from '@/types/music';

// ============================================================
// SearchView — PIXELFM Retro Search Terminal
// Faithfully matches media_1789323172694.png
// Features:
// - Header with "Search"
// - Search input box with magnifying glass
// - "Browse All" 6 genre cards (Pop, Indie, Lo-Fi, Hip-Hop, Rock, Electronic)
// - "Suggested for You" 2-column grid of 10 tracks with duration and [+] add buttons
// - Real-time filtering with instant playback & add-to-queue action
// ============================================================

interface SearchViewProps {
  onPlayTrack: (track: Track, context?: Track[]) => void;
  initialQuery?: string;
}

export function SearchView({ onPlayTrack, initialQuery = '' }: SearchViewProps) {
  const { play, addToQueue } = usePlayer();
  const [query, setQuery] = useState(initialQuery);
  const [addedTrackId, setAddedTrackId] = useState<string | null>(null);

  // The 6 Browse All genres matching screenshot
  const browseGenres = [
    { name: 'Pop', pixelCover: 'neon-arcade' as const, query: 'Pop' },
    { name: 'Indie', pixelCover: 'focus' as const, query: 'Indie' },
    { name: 'Lo-Fi', pixelCover: 'chill-vibes' as const, query: 'Lo-Fi' },
    { name: 'Hip-Hop', pixelCover: 'pixel-sunset' as const, query: 'Hip-Hop' },
    { name: 'Rock', pixelCover: 'midnight-drive' as const, query: 'Rock' },
    { name: 'Electronic', pixelCover: 'star-gazer' as const, query: 'Electronic' },
  ];

  // The 10 suggested tracks matching media_1789323172694.png
  // Left: Midnight Drive, Forest Rain, Neon City, Coffee & Code, Star Gazer
  // Right: Pixel Sunset, Velvet Skies, Tokyo Lights, Butterflies, Static Love
  const suggestedTracks = useMemo(() => {
    const leftIds = ['track_01', 'track_fr', 'track_nc', 'track_cc', 'track_sg'];
    const rightIds = ['track_00', 'track_vs', 'track_tl', 'track_bf', 'track_sl'];
    
    const left = leftIds.map((id) => MOCK_TRACKS.find((t) => t.id === id)!).filter(Boolean);
    const right = rightIds.map((id) => MOCK_TRACKS.find((t) => t.id === id)!).filter(Boolean);

    return { left, right };
  }, []);

  // Real-time filtered tracks when searching
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    return MOCK_TRACKS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.artistName.toLowerCase().includes(q) ||
        t.albumName.toLowerCase().includes(q)
    );
  }, [query]);

  const handleTrackClick = (track: Track) => {
    onPlayTrack(track, MOCK_TRACKS);
  };

  const handleAddClick = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    addToQueue(track);
    setAddedTrackId(track.id);
    setTimeout(() => {
      setAddedTrackId(null);
    }, 1500);
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-6 md:px-8 md:py-8 select-none flex flex-col gap-7 max-w-7xl">
      {/* ─── Header ───────────────────────────────────────── */}
      <div>
        <h1 className="font-pixel text-2xl sm:text-3xl text-white font-bold tracking-tight">
          Search
        </h1>
      </div>

      {/* ─── Search Input Field ───────────────────────────── */}
      <div className="relative flex items-center">
        <span className="absolute left-4 pointer-events-none text-[#64748B]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs, artists, or playlists..."
          className="w-full pl-12 pr-10 py-3.5 bg-[#0D1520] border border-[#1E2B3E] rounded-xl text-sm text-white placeholder:text-[#64748B] outline-none focus:border-[#22C55E]/60 focus:ring-1 focus:ring-[#22C55E]/30 transition-all font-sans"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 text-[#64748B] hover:text-white transition-colors cursor-pointer text-sm"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* If there's an active query, show search results */}
      {searchResults !== null ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Results for &ldquo;{query}&rdquo; ({searchResults.length})
            </h2>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-[#22C55E] hover:underline cursor-pointer"
            >
              Clear
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#131C2A] border border-[#1E2B3E] flex items-center justify-center text-[#64748B] mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
              </div>
              <div className="font-pixel text-sm text-white mb-1">NO SIGNAL FOUND</div>
              <p className="text-xs text-[#64748B] font-sans">
                Try searching for another track or artist name.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              {searchResults.map((track) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackClick(track)}
                  className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#131C2A] border border-transparent hover:border-[#1E2B3E] transition-all cursor-pointer"
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

                  <div className="flex items-center gap-3 shrink-0 pl-2">
                    <span className="text-xs text-[#64748B] font-mono">
                      {formatTime(track.durationMs)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleAddClick(e, track)}
                      title="Add to queue"
                      className="w-7 h-7 rounded-lg border border-[#1E2B3E] bg-[#0A0F17] flex items-center justify-center text-[#94A3B8] hover:text-[#22C55E] hover:border-[#22C55E]/50 transition-colors cursor-pointer"
                    >
                      {addedTrackId === track.id ? (
                        <span className="text-[#22C55E] text-xs">✓</span>
                      ) : (
                        <span className="text-xs">+</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Default Search View: Browse All + Suggested For You */
        <>
          {/* ─── SECTION 1: Browse All ───────────────────────── */}
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-white tracking-tight">
              Browse All
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {browseGenres.map((genre) => (
                <div
                  key={genre.name}
                  onClick={() => setQuery(genre.query)}
                  className="group relative bg-[#0D1520] border border-[#1E2B3E] rounded-2xl p-2.5 hover:border-[#22C55E]/50 hover:bg-[#141E2D] transition-all cursor-pointer flex flex-col shadow-sm"
                >
                  {/* Aspect Ratio 16:9 Pixel Artwork Card */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#0A0F17] mb-2 flex items-center justify-center">
                    <PixelAlbumArt pixelCover={genre.pixelCover} size={160} showFrame={false} />
                  </div>

                  <div className="text-center font-medium text-xs text-white group-hover:text-[#22C55E] transition-colors font-sans py-0.5">
                    {genre.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── SECTION 2: Suggested for You ────────────────── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white tracking-tight">
                Suggested for You
              </h2>
              <button
                type="button"
                onClick={() => setQuery(' ')}
                className="text-xs font-semibold text-[#64748B] hover:text-[#94A3B8] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Show More</span>
                <span className="text-[10px]">&gt;</span>
              </button>
            </div>

            {/* 2-Column 10-Track Grid matching screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-1.5">
              
              {/* Left 5 Tracks */}
              <div className="flex flex-col gap-1.5">
                {suggestedTracks.left.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => handleTrackClick(track)}
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#131C2A] border border-transparent hover:border-[#1E2B3E] transition-all cursor-pointer"
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

                    <div className="flex items-center gap-3 shrink-0 pl-2">
                      <span className="text-xs text-[#64748B] font-mono">
                        {formatTime(track.durationMs)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleAddClick(e, track)}
                        title="Add to queue"
                        className="w-7 h-7 rounded-lg border border-[#1E2B3E] bg-[#0A0F17] flex items-center justify-center text-[#94A3B8] hover:text-[#22C55E] hover:border-[#22C55E]/50 transition-colors cursor-pointer"
                      >
                        {addedTrackId === track.id ? (
                          <span className="text-[#22C55E] text-xs">✓</span>
                        ) : (
                          <span className="text-xs">+</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right 5 Tracks */}
              <div className="flex flex-col gap-1.5">
                {suggestedTracks.right.map((track) => (
                  <div
                    key={track.id}
                    onClick={() => handleTrackClick(track)}
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#131C2A] border border-transparent hover:border-[#1E2B3E] transition-all cursor-pointer"
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

                    <div className="flex items-center gap-3 shrink-0 pl-2">
                      <span className="text-xs text-[#64748B] font-mono">
                        {formatTime(track.durationMs)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleAddClick(e, track)}
                        title="Add to queue"
                        className="w-7 h-7 rounded-lg border border-[#1E2B3E] bg-[#0A0F17] flex items-center justify-center text-[#94A3B8] hover:text-[#22C55E] hover:border-[#22C55E]/50 transition-colors cursor-pointer"
                      >
                        {addedTrackId === track.id ? (
                          <span className="text-[#22C55E] text-xs">✓</span>
                        ) : (
                          <span className="text-xs">+</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
