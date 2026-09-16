"use client";

import React, { useState } from "react";
import { useMusicData } from "@/contexts/MusicDataContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { playChime } from "@/lib/audioEngine";

// ============================================================
// DiscoverView — Pixel-perfect recreation of Discover Tab (Image 4)
// ============================================================

interface DiscoverViewProps {
  soundFX: boolean;
}

const TRENDING_NOW_CARDS = [
  { id: "tn-1", title: "Viral 50", subtitle: "Global", icon: "🌐", bg: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)", query: "Viral 50" },
  { id: "tn-2", title: "Indie Rising", subtitle: "New Artists", icon: "🌇", bg: "linear-gradient(135deg, #451A03 0%, #7C2D12 100%)", query: "Indie Rising" },
  { id: "tn-3", title: "Lo-Fi Vibes", subtitle: "Chill", icon: "🌆", bg: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)", query: "Lo-Fi Beats" },
  { id: "tn-4", title: "Workout Mode", subtitle: "Energy", icon: "🏋️", bg: "linear-gradient(135deg, #18181B 0%, #27272A 100%)", query: "Workout" },
  { id: "tn-5", title: "Mood Booster", subtitle: "Feel Good", icon: "🌅", bg: "linear-gradient(135deg, #701A75 0%, #831843 100%)", query: "Mood Booster" },
  { id: "tn-6", title: "Sleep Sounds", subtitle: "Rest", icon: "🌙", bg: "linear-gradient(135deg, #0B132B 0%, #1C2541 100%)", query: "Sleep" },
  { id: "tn-7", title: "Bollywood Hits", subtitle: "India", icon: "📼", bg: "linear-gradient(135deg, #831843 0%, #9D174D 100%)", query: "Bollywood Hits" },
  { id: "tn-8", title: "Top 50 India", subtitle: "India", icon: "🕌", bg: "linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)", query: "Top 50 India" },
];

const GENRE_CARDS = [
  { id: "g-1", title: "Pop", icon: "📼", color: "#EC4899", query: "Pop" },
  { id: "g-2", title: "Rock", icon: "🎸", color: "#EF4444", query: "Rock" },
  { id: "g-3", title: "Hip-Hop", icon: "🧢", color: "#3B82F6", query: "Hip Hop" },
  { id: "g-4", title: "Indie", icon: "🪴", color: "#10B981", query: "Indie" },
  { id: "g-5", title: "Electronic", icon: "🎛️", color: "#06B6D4", query: "Electronic" },
  { id: "g-6", title: "R&B", icon: "💖", color: "#F43F5E", query: "R&B" },
  { id: "g-7", title: "Jazz", icon: "🎷", color: "#F59E0B", query: "Jazz" },
  { id: "g-8", title: "Classical", icon: "🎹", color: "#8B5CF6", query: "Classical" },
];

const MOOD_CARDS = [
  { id: "m-1", title: "Focus", icon: "💻", query: "Deep Focus" },
  { id: "m-2", title: "Relax", icon: "🏖️", query: "Peaceful Retreat" },
  { id: "m-3", title: "Workout", icon: "👟", query: "Beast Mode" },
  { id: "m-4", title: "Party", icon: "🪩", query: "Party Hits" },
  { id: "m-5", title: "Study", icon: "☕", query: "Study Lofi" },
  { id: "m-6", title: "Rainy Days", icon: "🌧️", query: "Rain Ambient" },
  { id: "m-7", title: "Road Trip", icon: "🚗", query: "Road Trip Classic" },
  { id: "m-8", title: "Late Night", icon: "🌃", query: "Late Night Drive" },
];

const FALLBACK_NEW_RELEASES = [
  { id: "rel-1", title: "Eternal Sunshine", artist: "Ariana Grande", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80" },
  { id: "rel-2", title: "HIT ME HARD AND SOFT", artist: "Billie Eilish", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80" },
  { id: "rel-3", title: "Short n' Sweet", artist: "Sabrina Carpenter", cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80" },
  { id: "rel-4", title: "MAYHEM", artist: "Lady Gaga", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80" },
  { id: "rel-5", title: "Charm", artist: "Clairo", cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80" },
  { id: "rel-6", title: "Cutouts", artist: "The Smile", cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80" },
];

export default function DiscoverView({ soundFX }: DiscoverViewProps) {
  const {
    newReleases,
    openAlbum,
    openPlaylist,
    runSearch,
    setSearchQuery,
  } = useMusicData();
  const { playContext } = usePlayer();

  const [heroTab, setHeroTab] = useState("MOODS");
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundFX) playChime("click");
    if (searchInput.trim()) {
      runSearch(searchInput);
      setSearchQuery(searchInput);
    }
  };

  const handleCardClick = (query: string) => {
    if (soundFX) playChime("click");
    runSearch(query);
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 pb-28 md:pb-8 overflow-y-auto h-full select-none">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[14px] text-[#22C55E]">//</span>
            <span
              className="font-pixel text-[14px] text-[#F8FAFC] tracking-wider"
              style={{ textShadow: "0 0 10px rgba(34, 197, 94, 0.3)" }}
            >
              DISCOVER
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#64748B] mt-0.5">
            New sounds. Familiar feelings.
          </span>
        </div>

        {/* Right Search Bar (Image 4) */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-[3px]"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #162235",
            }}
          >
            <span className="text-xs text-[#64748B]">🔍</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for moods, genres, or vibes..."
              className="w-full bg-transparent font-mono text-xs text-[#CBD5E1] placeholder-[#475569] outline-none"
            />
          </div>
        </form>
      </div>

      {/* TOP HERO BANNER (City skyline with cat gazing at window + Good Music Finds You + Right Nav) */}
      <div
        className="relative w-full rounded-[4px] overflow-hidden border border-[#162235] flex items-center justify-between min-h-[140px] p-5 sm:p-6"
        style={{
          background: "linear-gradient(135deg, #070D18 0%, #161226 50%, #0F172A 100%)",
        }}
      >
        {/* Decorative Skyline SVG Background with Stars and Cat Silhouette */}
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 800 200">
            {/* Stars */}
            <circle cx="100" cy="30" r="1.5" fill="#38BDF8" opacity="0.8" />
            <circle cx="250" cy="45" r="1" fill="#E2E8F0" opacity="0.6" />
            <circle cx="420" cy="20" r="1.5" fill="#EC4899" opacity="0.7" />
            <circle cx="560" cy="40" r="1" fill="#22C55E" opacity="0.5" />
            <circle cx="680" cy="25" r="1.5" fill="#F8FAFC" opacity="0.9" />

            {/* City Skyline Silhouette */}
            <path
              d="M0 200 L0 120 L40 120 L40 90 L80 90 L80 140 L120 140 L120 80 L160 80 L160 110 L210 110 L210 60 L260 60 L260 130 L310 130 L310 75 L360 75 L360 115 L420 115 L420 50 L480 50 L480 125 L540 125 L540 70 L600 70 L600 135 L680 135 L680 85 L740 85 L740 140 L800 140 L800 200 Z"
              fill="#060911"
            />
            {/* Glowing Windows */}
            <rect x="220" y="80" width="4" height="6" fill="#F59E0B" opacity="0.6" />
            <rect x="235" y="95" width="4" height="6" fill="#22C55E" opacity="0.6" />
            <rect x="330" y="90" width="4" height="6" fill="#38BDF8" opacity="0.6" />
            <rect x="440" y="70" width="4" height="6" fill="#EC4899" opacity="0.6" />
            <rect x="455" y="90" width="4" height="6" fill="#F59E0B" opacity="0.6" />

            {/* Cat Silhouette sitting on sill looking out */}
            <ellipse cx="370" cy="155" rx="14" ry="18" fill="#030508" />
            <polygon points="358,138 362,126 368,137" fill="#030508" />
            <polygon points="372,137 378,126 382,138" fill="#030508" />
            {/* Coffee Mug on ledge */}
            <rect x="400" y="152" width="10" height="12" rx="2" fill="#E2E8F0" opacity="0.7" />
          </svg>
        </div>

        {/* Left Text Overlay */}
        <div className="relative z-10 flex flex-col max-w-md">
          <span
            className="font-pixel text-base sm:text-lg text-[#F8FAFC] tracking-wide"
            style={{ textShadow: "0 0 12px rgba(255, 255, 255, 0.2)" }}
          >
            Good Music Finds You.
          </span>
          <span className="font-mono text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
            Explore new artists, playlists and sounds every day.
          </span>
        </div>

        {/* Right Vertical Nav Links (Image 4) */}
        <div className="relative z-10 hidden md:flex flex-col items-end gap-1 font-pixel text-[8px] tracking-widest text-[#64748B]">
          {["NEW", "ARTISTS", "PLAYLISTS", "GENRES", "MOODS"].map((t) => {
            const isActive = heroTab === t;
            return (
              <div
                key={t}
                onClick={() => {
                  if (soundFX) playChime("click");
                  setHeroTab(t);
                }}
                className={`cursor-pointer transition-colors flex flex-col items-end ${
                  isActive ? "text-[#22C55E]" : "hover:text-[#CBD5E1]"
                }`}
              >
                <span>{t}</span>
                {isActive && <div className="w-4 h-[2px] bg-[#22C55E] mt-0.5" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Trending Now (Image 4: 8 Cards) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">🔥</span>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                Trending Now
              </span>
              <span className="font-mono text-[9px] text-[#64748B]">
                What&apos;s hot on PIXELFM
              </span>
            </div>
          </div>
          <span className="font-pixel text-[8px] text-[#64748B] hover:text-[#22C55E] cursor-pointer">
            See all →
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {TRENDING_NOW_CARDS.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item.query)}
              className="group flex flex-col justify-between p-2.5 rounded-[2px] cursor-pointer transition-all hover:border-[#22C55E] h-28 relative overflow-hidden"
              style={{
                background: item.bg,
                border: "1px solid #162235",
              }}
            >
              <div className="flex items-center justify-center text-3xl opacity-85 group-hover:scale-110 transition-transform my-auto">
                {item.icon}
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-[#F8FAFC] truncate">
                  {item.title}
                </span>
                <span className="font-mono text-[8px] text-[#94A3B8] truncate">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Browse by Genre (Image 4: 8 Cards) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#22C55E]">≡</span>
            <span className="font-mono text-xs font-bold text-[#F8FAFC]">
              Browse by Genre
            </span>
          </div>
          <span className="font-pixel text-[8px] text-[#64748B] hover:text-[#22C55E] cursor-pointer">
            See all →
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {GENRE_CARDS.map((g) => (
            <div
              key={g.id}
              onClick={() => handleCardClick(g.query)}
              className="group flex flex-col justify-between p-2.5 rounded-[2px] cursor-pointer transition-all hover:border-[#22C55E] h-24 relative overflow-hidden"
              style={{
                backgroundColor: "#070D17",
                border: "1px solid #142236",
              }}
            >
              <div className="flex items-center justify-center text-2xl group-hover:scale-110 transition-transform my-auto">
                {g.icon}
              </div>

              <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate">
                {g.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: For Your Mood (Image 4: 8 Cards) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#22C55E]">😊</span>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                For Your Mood
              </span>
              <span className="font-mono text-[9px] text-[#64748B]">
                Soundtrack your moment
              </span>
            </div>
          </div>
          <span className="font-pixel text-[8px] text-[#64748B] hover:text-[#22C55E] cursor-pointer">
            See all →
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {MOOD_CARDS.map((m) => (
            <div
              key={m.id}
              onClick={() => handleCardClick(m.query)}
              className="group flex flex-col justify-between p-2.5 rounded-[2px] cursor-pointer transition-all hover:border-[#22C55E] h-24 relative overflow-hidden"
              style={{
                backgroundColor: "#070D17",
                border: "1px solid #142236",
              }}
            >
              <div className="flex items-center justify-center text-2xl group-hover:scale-110 transition-transform my-auto">
                {m.icon}
              </div>

              <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate">
                {m.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: New Releases (Image 4: 6 Cards) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#22C55E]">✨</span>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                New Releases
              </span>
              <span className="font-mono text-[9px] text-[#64748B]">
                Fresh tracks from around the world
              </span>
            </div>
          </div>
          <span className="font-pixel text-[8px] text-[#64748B] hover:text-[#22C55E] cursor-pointer">
            See all →
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {newReleases && newReleases.length > 0 ? (
            newReleases.slice(0, 6).map((album) => (
              <div
                key={album.id}
                onClick={() => {
                  if (soundFX) playChime("click");
                  openAlbum(album.id, album);
                }}
                className="group flex items-center gap-2.5 p-2 rounded-[2px] cursor-pointer transition-all hover:border-[#22C55E] bg-[#070D17] border border-[#142236]"
              >
                {album.images?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={album.images[0].url}
                    alt={album.name}
                    className="w-10 h-10 object-cover rounded-[2px] flex-shrink-0"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <div className="w-10 h-10 bg-[#162032] flex items-center justify-center text-xs text-[#22C55E] flex-shrink-0">
                    ♫
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                    {album.name}
                  </span>
                  <span className="font-mono text-[9px] text-[#64748B] truncate">
                    {album.artists?.[0]?.name}
                  </span>
                </div>
              </div>
            ))
          ) : (
            FALLBACK_NEW_RELEASES.map((rel) => (
              <div
                key={rel.id}
                onClick={() => handleCardClick(rel.title)}
                className="group flex items-center gap-2.5 p-2 rounded-[2px] cursor-pointer transition-all hover:border-[#22C55E] bg-[#070D17] border border-[#142236]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rel.cover}
                  alt={rel.title}
                  className="w-10 h-10 object-cover rounded-[2px] flex-shrink-0"
                  style={{ imageRendering: "pixelated" }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                    {rel.title}
                  </span>
                  <span className="font-mono text-[9px] text-[#64748B] truncate">
                    {rel.artist}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
