"use client";

import React, { useState, useEffect } from "react";
import { useMusicData } from "@/contexts/MusicDataContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { playChime } from "@/lib/audioEngine";

// ============================================================
// SearchView — Pixel-perfect recreation of Search Tab (Image 3)
// ============================================================

interface SearchViewProps {
  soundFX: boolean;
}

type FilterChip = "all" | "songs" | "artists" | "albums" | "playlists" | "podcasts";

// Reference trending searches from Image 3
const TRENDING_SEARCHES = [
  {
    id: "ts-1",
    title: "Arijit Singh",
    query: "Arijit Singh",
    bg: "linear-gradient(180deg, #7C2D12 0%, #1E1B4B 100%)",
    icon: "👤",
    art: "silhouette",
  },
  {
    id: "ts-2",
    title: "Chill",
    query: "Chill Vibes",
    bg: "linear-gradient(180deg, #1E1B4B 0%, #0F172A 100%)",
    icon: "🐱",
    art: "cat-window",
  },
  {
    id: "ts-3",
    title: "Lo-Fi",
    query: "Lo-Fi",
    bg: "linear-gradient(180deg, #312E81 0%, #0F172A 100%)",
    icon: "🌙",
    art: "moon",
  },
  {
    id: "ts-4",
    title: "Workout",
    query: "Workout",
    bg: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
    icon: "🏋️",
    badge: "NO EXCUSES",
  },
  {
    id: "ts-5",
    title: "Hindi Hits",
    query: "Hindi Hits",
    bg: "linear-gradient(180deg, #831843 0%, #312E81 100%)",
    icon: "📼",
    badge: "HINDI HITS",
  },
  {
    id: "ts-6",
    title: "Focus",
    query: "Focus Flow",
    bg: "linear-gradient(180deg, #1E293B 0%, #134E4A 100%)",
    icon: "☕",
    badge: "GOOD IDEAS",
  },
];

// Reference browse categories from Image 3
const BROWSE_CATEGORIES = [
  { id: "c-1", title: "New Releases", query: "New Releases", color: "#EC4899", icon: "✨", tag: "NEW" },
  { id: "c-2", title: "Charts", query: "Top 50", color: "#F59E0B", icon: "🏆", tag: "TOP" },
  { id: "c-3", title: "Mood", query: "Mood Booster", color: "#F43F5E", icon: "☁️", tag: "VIBE" },
  { id: "c-4", title: "Indie", query: "Indie Hits", color: "#10B981", icon: "🎸", tag: "INDIE" },
  { id: "c-5", title: "Pop", query: "Pop Hits", color: "#8B5CF6", icon: "🪩", tag: "POP" },
  { id: "c-6", title: "Hip-Hop", query: "Hip Hop", color: "#3B82F6", icon: "📻", tag: "HIPHOP" },
  { id: "c-7", title: "Rock", query: "Rock Classics", color: "#EF4444", icon: "🤘", tag: "ROCK" },
  { id: "c-8", title: "Sleep", query: "Sleep Sounds", color: "#6366F1", icon: "💤", tag: "SLEEP" },
];

export default function SearchView({ soundFX }: SearchViewProps) {
  const {
    searchQuery,
    setSearchQuery,
    runSearch,
    searchResults,
    isSearching,
    clearSearch,
    openPlaylist,
    openArtist,
  } = useMusicData();
  const { playTrack, playTracks } = usePlayer();

  const [inputValue, setInputValue] = useState(searchQuery || "");
  const [activeChip, setActiveChip] = useState<FilterChip>("all");

  // Debounced live search
  useEffect(() => {
    if (!inputValue.trim()) return;
    const timer = setTimeout(() => {
      runSearch(inputValue);
      setSearchQuery(inputValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, runSearch, setSearchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundFX) playChime("click");
    if (inputValue.trim()) {
      runSearch(inputValue);
      setSearchQuery(inputValue);
    }
  };

  const handleSelectQuickSearch = (query: string) => {
    if (soundFX) playChime("click");
    setInputValue(query);
    runSearch(query);
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 pb-28 md:pb-8 overflow-y-auto h-full select-none">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[14px] text-[#22C55E]">//</span>
          <span
            className="font-pixel text-[14px] text-[#F8FAFC] tracking-wider"
            style={{ textShadow: "0 0 10px rgba(34, 197, 94, 0.3)" }}
          >
            SEARCH
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#64748B] mt-0.5">
          Find your next favorite track.
        </span>
      </div>

      {/* Main Big Search Input with Neon Green Border (Image 3) */}
      <form onSubmit={handleSearchSubmit} className="relative w-full">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-[4px] transition-all"
          style={{
            backgroundColor: "#070D17",
            border: "1.5px solid #22C55E",
            boxShadow: "0 0 12px rgba(34, 197, 94, 0.2)",
          }}
        >
          <span className="text-sm text-[#22C55E] flex-shrink-0">🔍</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for songs, artists, albums, playlists..."
            className="w-full bg-transparent font-mono text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] outline-none"
          />
          {inputValue ? (
            <button
              type="button"
              onClick={() => {
                if (soundFX) playChime("click");
                clearSearch();
                setInputValue("");
              }}
              className="text-xs text-[#64748B] hover:text-[#22C55E] transition-colors flex-shrink-0 font-pixel"
            >
              ✕
            </button>
          ) : (
            <span className="hidden sm:inline-block font-mono text-[10px] text-[#64748B] whitespace-nowrap flex-shrink-0">
              Press ↵ to search
            </span>
          )}
        </div>
      </form>

      {/* Filter Chips: All, Songs, Artists, Albums, Playlists, Podcasts */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: "all", label: "All" },
          { id: "songs", label: "Songs" },
          { id: "artists", label: "Artists" },
          { id: "albums", label: "Albums" },
          { id: "playlists", label: "Playlists" },
          { id: "podcasts", label: "Podcasts" },
        ].map((chip) => {
          const isActive = activeChip === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => {
                if (soundFX) playChime("click");
                setActiveChip(chip.id as FilterChip);
              }}
              className="px-4 py-1.5 rounded-full font-mono text-xs transition-all whitespace-nowrap"
              style={{
                backgroundColor: isActive ? "#22C55E" : "#0A1220",
                color: isActive ? "#0A0F17" : "#94A3B8",
                fontWeight: isActive ? "bold" : "normal",
                border: isActive ? "1px solid #22C55E" : "1px solid #162235",
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: Trending Searches (Horizontal Scroll Cards) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#38BDF8]">📈</span>
            <span className="font-mono text-xs font-bold text-[#F8FAFC]">
              Trending Searches
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {TRENDING_SEARCHES.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectQuickSearch(item.query)}
              className="group flex flex-col justify-between p-3 rounded-[2px] cursor-pointer transition-all hover:border-[#22C55E] h-28 relative overflow-hidden"
              style={{
                background: item.bg,
                border: "1px solid #142236",
              }}
            >
              {/* Corner badge if any */}
              {item.badge && (
                <span className="font-pixel text-[6px] text-white/70 tracking-widest uppercase">
                  {item.badge}
                </span>
              )}

              {/* Decorative Pixel Art Center */}
              <div className="flex items-center justify-center text-3xl opacity-80 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              {/* Title Bottom */}
              <span className="font-mono text-xs font-bold text-[#F8FAFC] truncate">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Browse All (8 Pixel Category Cards) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#F59E0B]">📁</span>
          <span className="font-mono text-xs font-bold text-[#F8FAFC]">
            Browse all
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {BROWSE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectQuickSearch(cat.query)}
              className="group flex flex-col justify-between p-2.5 rounded-[2px] cursor-pointer transition-all hover:border-[#22C55E] h-24 relative overflow-hidden"
              style={{
                backgroundColor: "#070D17",
                border: "1px solid #142236",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-pixel text-[6px] px-1.5 py-0.5 rounded-[1px] text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.tag}
                </span>
                <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
              </div>

              <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate mt-2">
                {cat.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Top Results (3 Columns: Tracks, Artists, Playlists) */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#22C55E]">📗</span>
            <span className="font-mono text-xs font-bold text-[#F8FAFC]">
              Top Results
            </span>
          </div>
          <span className="font-pixel text-[8px] text-[#64748B] hover:text-[#22C55E] cursor-pointer">
            SEE ALL →
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Songs */}
          <div
            className="flex flex-col gap-2 p-3 rounded-[2px]"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #142236",
            }}
          >
            <div className="font-pixel text-[7px] text-[#22C55E] tracking-widest uppercase mb-1">
              SONGS
            </div>

            {/* If live search results exist, show them; otherwise show Image 3 mockups */}
            {searchResults?.tracks && searchResults.tracks.length > 0 ? (
              searchResults.tracks.slice(0, 3).map((track) => (
                <div
                  key={track.id}
                  onClick={() => {
                    if (soundFX) playChime("click");
                    playTrack(track, searchResults.tracks);
                  }}
                  className="flex items-center justify-between p-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <button className="w-6 h-6 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/40 text-[#22C55E] text-[10px] flex items-center justify-center group-hover:bg-[#22C55E] group-hover:text-black transition-all flex-shrink-0">
                      ▶
                    </button>
                    {track.album?.images?.[0]?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={track.album.images[0].url}
                        alt=""
                        className="w-8 h-8 object-cover rounded-[2px] flex-shrink-0"
                        style={{ imageRendering: "pixelated" }}
                      />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-xs text-[#F8FAFC] font-semibold truncate group-hover:text-[#22C55E]">
                        {track.name}
                      </span>
                      <span className="font-mono text-[9px] text-[#64748B] truncate">
                        {track.artists?.[0]?.name} • Song
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 text-xs">
                    <span className="text-[#22C55E]">♥</span>
                    <span className="text-[#64748B]">•••</span>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Fallback mockups from Image 3 */}
                {[
                  { title: "Larusso", artist: "Titus Haskins" },
                  { title: "Aaj Bhi", artist: "Vishal Mishra" },
                  { title: "I Like Me Better", artist: "Lauv" },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <button className="w-6 h-6 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/40 text-[#22C55E] text-[10px] flex items-center justify-center group-hover:bg-[#22C55E] group-hover:text-black transition-all flex-shrink-0">
                        ▶
                      </button>
                      <div className="w-8 h-8 bg-[#0E1624] border border-[#1E293B] rounded-[2px] flex items-center justify-center text-xs text-[#64748B] flex-shrink-0">
                        ♫
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-xs text-[#F8FAFC] font-semibold truncate group-hover:text-[#22C55E]">
                          {s.title}
                        </span>
                        <span className="font-mono text-[9px] text-[#64748B] truncate">
                          {s.artist} • Song
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 text-xs">
                      <span className="text-[#22C55E]">♥</span>
                      <span className="text-[#64748B]">•••</span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Column 2: Artists */}
          <div
            className="flex flex-col gap-2 p-3 rounded-[2px]"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #142236",
            }}
          >
            <div className="font-pixel text-[7px] text-[#38BDF8] tracking-widest uppercase mb-1">
              ARTISTS
            </div>

            {searchResults?.artists && searchResults.artists.length > 0 ? (
              searchResults.artists.slice(0, 3).map((artist) => (
                <div
                  key={artist.id}
                  onClick={() => {
                    if (soundFX) playChime("click");
                    openArtist(artist.id, artist);
                  }}
                  className="flex items-center justify-between p-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1E293B] border border-[#334155] flex-shrink-0">
                      {artist.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={artist.images[0].url}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                          style={{ imageRendering: "pixelated" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">👤</div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs text-[#F8FAFC] font-semibold truncate group-hover:text-[#38BDF8]">
                          {artist.name}
                        </span>
                        <span className="text-[10px] text-[#38BDF8]">✓</span>
                      </div>
                      <span className="font-mono text-[9px] text-[#64748B] truncate">
                        Artist
                      </span>
                    </div>
                  </div>
                  <span className="text-[#64748B] text-xs">•••</span>
                </div>
              ))
            ) : (
              <>
                {/* Fallback mockups from Image 3 */}
                {[
                  { name: "Arijit Singh" },
                  { name: "AP Dhillon" },
                  { name: "The Weeknd" },
                ].map((a, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectQuickSearch(a.name)}
                    className="flex items-center justify-between p-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <div className="w-8 h-8 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-xs text-white flex-shrink-0">
                        👤
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs text-[#F8FAFC] font-semibold truncate group-hover:text-[#38BDF8]">
                            {a.name}
                          </span>
                          <span className="text-[10px] text-[#38BDF8]">✓</span>
                        </div>
                        <span className="font-mono text-[9px] text-[#64748B] truncate">
                          Artist
                        </span>
                      </div>
                    </div>
                    <span className="text-[#64748B] text-xs">•••</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Column 3: Playlists */}
          <div
            className="flex flex-col gap-2 p-3 rounded-[2px]"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #142236",
            }}
          >
            <div className="font-pixel text-[7px] text-[#EC4899] tracking-widest uppercase mb-1">
              PLAYLISTS
            </div>

            {searchResults?.playlists && searchResults.playlists.length > 0 ? (
              searchResults.playlists.slice(0, 3).map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => {
                    if (soundFX) playChime("click");
                    openPlaylist(pl.id, pl);
                  }}
                  className="flex items-center justify-between p-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <div className="w-8 h-8 rounded-[2px] overflow-hidden bg-[#1E293B] border border-[#334155] flex-shrink-0">
                      {pl.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={pl.images[0].url}
                          alt={pl.name}
                          className="w-full h-full object-cover"
                          style={{ imageRendering: "pixelated" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">♫</div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-xs text-[#F8FAFC] font-semibold truncate group-hover:text-[#EC4899]">
                        {pl.name}
                      </span>
                      <span className="font-mono text-[9px] text-[#64748B] truncate">
                        Playlist • {pl.tracks?.total || 0} songs
                      </span>
                    </div>
                  </div>
                  <span className="text-[#64748B] text-xs">•••</span>
                </div>
              ))
            ) : (
              <>
                {/* Fallback mockups from Image 3 */}
                {[
                  { name: "Chill Vibes", likes: "1.2M likes" },
                  { name: "Workout Mix", likes: "980K likes" },
                  { name: "Late Night Drive", likes: "856K likes" },
                ].map((pl, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectQuickSearch(pl.name)}
                    className="flex items-center justify-between p-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <div className="w-8 h-8 rounded-[2px] bg-gradient-to-br from-purple-900 to-indigo-900 border border-[#334155] flex items-center justify-center text-xs text-white flex-shrink-0">
                        ♫
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-xs text-[#F8FAFC] font-semibold truncate group-hover:text-[#EC4899]">
                          {pl.name}
                        </span>
                        <span className="font-mono text-[9px] text-[#64748B] truncate">
                          Playlist • {pl.likes}
                        </span>
                      </div>
                    </div>
                    <span className="text-[#64748B] text-xs">•••</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
