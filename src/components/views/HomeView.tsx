"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMusicData } from "@/contexts/MusicDataContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { playChime } from "@/lib/audioEngine";

// ============================================================
// HomeView — Pixel-perfect recreation of Home Tab (Image 5)
// ============================================================

interface HomeViewProps {
  soundFX: boolean;
  onNavigate: (view: "home" | "library" | "search" | "discover" | "deck" | "settings") => void;
}

const FALLBACK_CONTINUE_LISTENING = [
  { id: "cl-1", title: "Larusso", subtitle: "Titus Haskins", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80", isCurrent: true },
  { id: "cl-2", title: "Chill Vibes", subtitle: "Playlist", cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80", isCurrent: false },
  { id: "cl-3", title: "Aaj Bhi", subtitle: "Vishal Mishra", cover: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80", isCurrent: false },
  { id: "cl-4", title: "I Like Me Better", subtitle: "Lauv", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80", isCurrent: false },
  { id: "cl-5", title: "Midnight Drive", subtitle: "Jinsang", cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80", isCurrent: false },
];

const FALLBACK_MADE_FOR_YOU = [
  { id: "mfy-1", title: "Lo-Fi Seeds", icon: "🌱", color: "#6366F1" },
  { id: "mfy-2", title: "Night Drive", icon: "🚗", color: "#3B82F6" },
  { id: "mfy-3", title: "Focus Flow", icon: "💻", color: "#06B6D4" },
  { id: "mfy-4", title: "Indie Days", icon: "🪴", color: "#10B981" },
  { id: "mfy-5", title: "Retro Mix", icon: "📼", color: "#EC4899" },
  { id: "mfy-6", title: "Study Mode", icon: "📚", color: "#14B8A6" },
  { id: "mfy-7", title: "Mood Booster", icon: "🌅", color: "#F59E0B" },
  { id: "mfy-8", title: "Chill Vibes", icon: "🌆", color: "#8B5CF6" },
];

const FALLBACK_RECENT = [
  { id: "rc-1", title: "Larusso", artist: "Titus Haskins", duration: "2:27" },
  { id: "rc-2", title: "Chill Vibes", artist: "Playlist", duration: "3:12" },
  { id: "rc-3", title: "Aaj Bhi", artist: "Vishal Mishra", duration: "4:06" },
  { id: "rc-4", title: "I Like Me Better", artist: "Lauv", duration: "3:17" },
  { id: "rc-5", title: "Sana", artist: "Prateek Kuhad", duration: "4:32" },
];

const FALLBACK_PLAYLISTS = [
  { id: "fp-1", title: "Liked Songs", count: "312 songs", icon: "♥" },
  { id: "fp-2", title: "Workout", count: "63 songs", icon: "🏋️" },
  { id: "fp-3", title: "Indie Picks", count: "48 songs", icon: "🪴" },
  { id: "fp-4", title: "Sad Hours", count: "44 songs", icon: "🌧️" },
  { id: "fp-5", title: "Road Trip", count: "92 songs", icon: "🚗" },
];

const FALLBACK_TOP_MIXES = [
  { id: "tm-1", title: "Today's Hits", by: "By PIXELFM", icon: "🌆" },
  { id: "tm-2", title: "Lo-Fi Essentials", by: "By PIXELFM", icon: "✨" },
  { id: "tm-3", title: "Bollywood Classics", by: "By PIXELFM", icon: "📼" },
  { id: "tm-4", title: "Chill Instrumentals", by: "By PIXELFM", icon: "🌙" },
  { id: "tm-5", title: "Feel Good Mix", by: "By PIXELFM", icon: "🌅" },
];

export default function HomeView({ soundFX, onNavigate }: HomeViewProps) {
  const { user, isAuthenticated } = useAuth();
  const {
    playlists,
    likedTracks,
    recentlyPlayed,
    topTracks,
    featuredPlaylists,
    openPlaylist,
    openAlbum,
    openArtist,
  } = useMusicData();
  const { playTrack, playTracks, playContext, currentTrack } = usePlayer();

  const [heroAction, setHeroAction] = useState("REPEAT");

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
            Good Music, Brighter Days.
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#64748B] mt-0.5">
          A calmer mind, one song at a time.
        </span>
      </div>

      {/* TOP HERO BANNER (Image 5: Panoramic night skyline with silhouette cat + Right Menu) */}
      <div
        className="relative w-full rounded-[4px] overflow-hidden border border-[#162235] flex items-center justify-between min-h-[140px] p-5 sm:p-6"
        style={{
          background: "linear-gradient(135deg, #070D18 0%, #170E28 50%, #080D1A 100%)",
        }}
      >
        {/* Starry Night Sky and Skyline SVG */}
        <div className="absolute inset-0 pointer-events-none opacity-75">
          <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 800 200">
            {/* Stars */}
            <circle cx="80" cy="25" r="1.5" fill="#38BDF8" opacity="0.8" />
            <circle cx="160" cy="50" r="1" fill="#E2E8F0" opacity="0.5" />
            <circle cx="280" cy="20" r="1.5" fill="#EC4899" opacity="0.7" />
            <circle cx="380" cy="35" r="1" fill="#22C55E" opacity="0.6" />
            <circle cx="490" cy="18" r="1.5" fill="#F8FAFC" opacity="0.9" />
            <circle cx="580" cy="45" r="1" fill="#38BDF8" opacity="0.7" />

            {/* City Skyline Outline */}
            <path
              d="M0 200 L0 120 L35 120 L35 85 L75 85 L75 140 L115 140 L115 75 L165 75 L165 110 L220 110 L220 50 L275 50 L275 130 L325 130 L325 70 L380 70 L380 120 L440 120 L440 45 L500 45 L500 125 L560 125 L560 65 L620 65 L620 135 L700 135 L700 80 L760 80 L760 145 L800 145 L800 200 Z"
              fill="#060911"
            />
            {/* Glowing Windows */}
            <rect x="230" y="70" width="4" height="6" fill="#F59E0B" opacity="0.6" />
            <rect x="250" y="90" width="4" height="6" fill="#22C55E" opacity="0.6" />
            <rect x="340" y="85" width="4" height="6" fill="#38BDF8" opacity="0.6" />
            <rect x="460" y="65" width="4" height="6" fill="#EC4899" opacity="0.6" />
            <rect x="475" y="85" width="4" height="6" fill="#F59E0B" opacity="0.6" />

            {/* Silhouette of Cat sitting looking right */}
            <ellipse cx="560" cy="155" rx="16" ry="18" fill="#030508" />
            <polygon points="546,138 550,125 558,137" fill="#030508" />
            <polygon points="562,137 570,125 574,138" fill="#030508" />
          </svg>
        </div>

        {/* Right Menu Tags: PLAY, EXPLORE, FEEL, REPEAT */}
        <div className="relative z-10 ml-auto flex flex-col items-end gap-1 font-pixel text-[9px] tracking-widest text-[#64748B]">
          {["PLAY", "EXPLORE", "FEEL", "REPEAT"].map((item) => {
            const isActive = heroAction === item;
            return (
              <div
                key={item}
                onClick={() => {
                  if (soundFX) playChime("click");
                  setHeroAction(item);
                }}
                className={`cursor-pointer transition-colors flex flex-col items-end ${
                  isActive ? "text-[#22C55E]" : "hover:text-[#CBD5E1]"
                }`}
              >
                <span>{item}</span>
                {isActive && <div className="w-5 h-[2px] bg-[#22C55E] mt-0.5" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Continue Listening (Image 5: Wide Cards with Play indicator) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#22C55E]">▶</span>
            <span className="font-mono text-xs font-bold text-[#F8FAFC]">
              Continue Listening
            </span>
          </div>
          <span
            onClick={() => onNavigate("library")}
            className="font-pixel text-[8px] text-[#64748B] hover:text-[#22C55E] cursor-pointer"
          >
            See all →
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topTracks && topTracks.length > 0 ? (
            topTracks.slice(0, 5).map((track, idx) => (
              <div
                key={track.id}
                onClick={() => {
                  if (soundFX) playChime("click");
                  playTrack(track, topTracks);
                }}
                className="group flex items-center justify-between p-2.5 rounded-[2px] cursor-pointer transition-all hover:border-[#22C55E] bg-[#070D17] border border-[#142236]"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  {track.album?.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      className="w-10 h-10 object-cover rounded-[2px] flex-shrink-0"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[#162032] flex items-center justify-center text-xs text-[#22C55E] flex-shrink-0">
                      ♫
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-bold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {track.name}
                    </span>
                    <span className="font-mono text-[9px] text-[#64748B] truncate">
                      {track.artists?.[0]?.name}
                    </span>
                  </div>
                </div>

                {idx === 0 && (
                  <button className="w-6 h-6 rounded-full bg-[#22C55E] text-black text-[10px] flex items-center justify-center flex-shrink-0 shadow-md">
                    ▶
                  </button>
                )}
              </div>
            ))
          ) : (
            FALLBACK_CONTINUE_LISTENING.map((item, idx) => (
              <div
                key={item.id}
                className="group flex items-center justify-between p-2.5 rounded-[2px] cursor-pointer transition-all hover:border-[#22C55E] bg-[#070D17] border border-[#142236]"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-10 h-10 object-cover rounded-[2px] flex-shrink-0"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-bold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {item.title}
                    </span>
                    <span className="font-mono text-[9px] text-[#64748B] truncate">
                      {item.subtitle}
                    </span>
                  </div>
                </div>

                {idx === 0 && (
                  <button className="w-6 h-6 rounded-full bg-[#22C55E] text-black text-[10px] flex items-center justify-center flex-shrink-0 shadow-md">
                    ▶
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION 2: Made For You (Image 5: 8 Cards) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#22C55E]">✨</span>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                Made For You
              </span>
              <span className="font-mono text-[9px] text-[#64748B]">
                Playlists picked just for your vibe.
              </span>
            </div>
          </div>
          <span
            onClick={() => onNavigate("library")}
            className="font-pixel text-[8px] text-[#64748B] hover:text-[#22C55E] cursor-pointer"
          >
            See all →
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {FALLBACK_MADE_FOR_YOU.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (soundFX) playChime("click");
                onNavigate("discover");
              }}
              className="group flex flex-col justify-between p-2.5 rounded-[2px] cursor-pointer transition-all hover:border-[#22C55E] h-24 relative overflow-hidden"
              style={{
                backgroundColor: "#070D17",
                border: "1px solid #142236",
              }}
            >
              <div className="flex items-center justify-center text-2xl group-hover:scale-110 transition-transform my-auto">
                {item.icon}
              </div>

              <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: 3-Column Lower Grid (Image 5: Recently Played, Your Playlists, Top Mixes) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Column 1: Recently Played */}
        <div
          className="flex flex-col gap-2.5 p-3.5 rounded-[2px]"
          style={{
            backgroundColor: "#070D17",
            border: "1px solid #142236",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#F8FAFC]">
              <span className="text-[#22C55E]">🕒</span>
              <span>Recently Played</span>
            </div>
            <span className="font-pixel text-[8px] text-[#64748B] hover:text-[#22C55E] cursor-pointer">
              See all →
            </span>
          </div>

          {recentlyPlayed && recentlyPlayed.length > 0 ? (
            recentlyPlayed.slice(0, 5).map((track, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (soundFX) playChime("click");
                  playTrack(track);
                }}
                className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  {track.album?.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={track.album.images[0].url}
                      alt=""
                      className="w-7 h-7 object-cover rounded-[2px] flex-shrink-0"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-7 h-7 bg-[#162032] flex items-center justify-center text-xs text-[#22C55E] flex-shrink-0">
                      ♫
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {track.name}
                    </span>
                    <span className="font-mono text-[9px] text-[#64748B] truncate">
                      {track.artists?.[0]?.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-mono text-[10px] text-[#64748B]">
                    {Math.floor(track.duration_ms / 60000)}:
                    {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, "0")}
                  </span>
                  <span className="text-[#64748B] text-xs">•••</span>
                </div>
              </div>
            ))
          ) : (
            FALLBACK_RECENT.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <div className="w-7 h-7 bg-[#0E1624] border border-[#1E293B] rounded-[2px] flex items-center justify-center text-xs text-[#64748B] flex-shrink-0">
                    ♫
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {r.title}
                    </span>
                    <span className="font-mono text-[9px] text-[#64748B] truncate">
                      {r.artist}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-mono text-[10px] text-[#64748B]">{r.duration}</span>
                  <span className="text-[#64748B] text-xs">•••</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Column 2: Your Playlists (Abhishek's real playlists) */}
        <div
          className="flex flex-col gap-2.5 p-3.5 rounded-[2px]"
          style={{
            backgroundColor: "#070D17",
            border: "1px solid #142236",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#F8FAFC]">
              <span className="text-[#22C55E]">≡</span>
              <span>Your Playlists</span>
            </div>
            <span
              onClick={() => onNavigate("library")}
              className="font-pixel text-[8px] text-[#64748B] hover:text-[#22C55E] cursor-pointer"
            >
              See all →
            </span>
          </div>

          {/* First row: Liked Songs with heart */}
          <div
            onClick={() => {
              if (soundFX) playChime("click");
              onNavigate("library");
            }}
            className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2 min-w-0 pr-1">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-700 to-purple-600 rounded-[2px] flex items-center justify-center text-xs text-white flex-shrink-0">
                ♥
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                  Liked Songs
                </span>
                <span className="font-mono text-[9px] text-[#64748B] truncate">
                  {likedTracks.length || 312} songs
                </span>
              </div>
            </div>
            <span className="text-[#64748B] text-xs">•••</span>
          </div>

          {/* Subsequent playlists from Abhishek's Spotify account */}
          {playlists && playlists.length > 0 ? (
            playlists.slice(0, 4).map((pl) => (
              <div
                key={pl.id}
                onClick={() => {
                  if (soundFX) playChime("click");
                  openPlaylist(pl.id, pl);
                }}
                className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  {pl.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pl.images[0].url}
                      alt={pl.name}
                      className="w-7 h-7 object-cover rounded-[2px] flex-shrink-0"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-7 h-7 bg-[#162032] flex items-center justify-center text-xs text-[#22C55E] flex-shrink-0">
                      ♫
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {pl.name}
                    </span>
                    <span className="font-mono text-[9px] text-[#64748B] truncate">
                      {pl.tracks?.total || 0} songs
                    </span>
                  </div>
                </div>
                <span className="text-[#64748B] text-xs">•••</span>
              </div>
            ))
          ) : (
            FALLBACK_PLAYLISTS.slice(1).map((pl) => (
              <div
                key={pl.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <div className="w-7 h-7 bg-[#0E1624] border border-[#1E293B] rounded-[2px] flex items-center justify-center text-xs text-[#64748B] flex-shrink-0">
                    {pl.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {pl.title}
                    </span>
                    <span className="font-mono text-[9px] text-[#64748B] truncate">
                      {pl.count}
                    </span>
                  </div>
                </div>
                <span className="text-[#64748B] text-xs">•••</span>
              </div>
            ))
          )}
        </div>

        {/* Column 3: Top Mixes */}
        <div
          className="flex flex-col gap-2.5 p-3.5 rounded-[2px]"
          style={{
            backgroundColor: "#070D17",
            border: "1px solid #142236",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#F8FAFC]">
              <span className="text-[#22C55E]">📊</span>
              <span>Top Mixes</span>
            </div>
            <span className="font-pixel text-[8px] text-[#64748B] hover:text-[#22C55E] cursor-pointer">
              See all →
            </span>
          </div>

          {featuredPlaylists && featuredPlaylists.length > 0 ? (
            featuredPlaylists.slice(0, 5).map((pl) => (
              <div
                key={pl.id}
                onClick={() => {
                  if (soundFX) playChime("click");
                  openPlaylist(pl.id, pl);
                }}
                className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  {pl.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pl.images[0].url}
                      alt={pl.name}
                      className="w-7 h-7 object-cover rounded-[2px] flex-shrink-0"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-7 h-7 bg-[#162032] flex items-center justify-center text-xs text-[#22C55E] flex-shrink-0">
                      ♫
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {pl.name}
                    </span>
                    <span className="font-mono text-[9px] text-[#64748B] truncate">
                      By PIXELFM
                    </span>
                  </div>
                </div>
                <span className="text-[#64748B] text-xs">•••</span>
              </div>
            ))
          ) : (
            FALLBACK_TOP_MIXES.map((mix) => (
              <div
                key={mix.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <div className="w-7 h-7 bg-[#0E1624] border border-[#1E293B] rounded-[2px] flex items-center justify-center text-xs text-[#64748B] flex-shrink-0">
                    {mix.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {mix.title}
                    </span>
                    <span className="font-mono text-[9px] text-[#64748B] truncate">
                      {mix.by}
                    </span>
                  </div>
                </div>
                <span className="text-[#64748B] text-xs">•••</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
