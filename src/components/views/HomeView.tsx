"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMusicData } from "@/contexts/MusicDataContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { playChime } from "@/lib/audioEngine";

// ============================================================
// HomeView — High-Fidelity Pixel Art Recreation of Image 5
// ============================================================

interface HomeViewProps {
  soundFX: boolean;
  onNavigate: (view: "home" | "library" | "search" | "discover" | "deck" | "settings") => void;
}

// Pixel art artwork cards for "Made For You" (Image 5)
function ArtLoFiSeeds() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      <rect width="80" height="80" fill="#1A102F" />
      {/* Window frame */}
      <rect x="15" y="10" width="50" height="45" fill="#2E1B4E" stroke="#4C2882" strokeWidth="2" />
      {/* Window panes */}
      <line x1="40" y1="10" x2="40" y2="55" stroke="#4C2882" strokeWidth="2" />
      <line x1="15" y1="32" x2="65" y2="32" stroke="#4C2882" strokeWidth="2" />
      {/* Stars in window */}
      <rect x="25" y="18" width="2" height="2" fill="#E9D5FF" />
      <rect x="52" y="24" width="2" height="2" fill="#E9D5FF" />
      <rect x="32" y="40" width="2" height="2" fill="#E9D5FF" />
      {/* Plant on sill */}
      <rect x="36" y="52" width="8" height="6" fill="#B45309" />
      <rect x="38" y="44" width="4" height="8" fill="#22C55E" />
      <rect x="34" y="46" width="4" height="4" fill="#16A34A" />
      <rect x="42" y="46" width="4" height="4" fill="#16A34A" />
      {/* Shelf */}
      <rect x="10" y="58" width="60" height="4" fill="#3B2063" />
    </svg>
  );
}

function ArtNightDrive() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      <rect width="80" height="80" fill="#0A0F24" />
      {/* City skyline distant */}
      <rect x="8" y="25" width="12" height="30" fill="#151D3B" />
      <rect x="24" y="18" width="16" height="37" fill="#1B254B" />
      <rect x="44" y="28" width="14" height="27" fill="#151D3B" />
      <rect x="62" y="20" width="12" height="35" fill="#1E2B58" />
      {/* Windows in skyline */}
      <rect x="28" y="24" width="2" height="3" fill="#EC4899" />
      <rect x="34" y="30" width="2" height="3" fill="#38BDF8" />
      <rect x="66" y="26" width="2" height="3" fill="#F59E0B" />
      {/* Road */}
      <polygon points="0,80 30,55 50,55 80,80" fill="#182038" />
      {/* Road stripes */}
      <line x1="40" y1="58" x2="40" y2="78" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />
      {/* Car */}
      <rect x="34" y="62" width="12" height="7" fill="#EF4444" rx="1" />
      <rect x="32" y="66" width="16" height="4" fill="#DC2626" />
      <rect x="33" y="68" width="2" height="2" fill="#FEF08A" />
      <rect x="45" y="68" width="2" height="2" fill="#FEF08A" />
    </svg>
  );
}

function ArtFocusFlow() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      <rect width="80" height="80" fill="#0B1320" />
      {/* Desk */}
      <rect x="10" y="55" width="60" height="6" fill="#1E293B" />
      <rect x="14" y="61" width="4" height="15" fill="#0F172A" />
      <rect x="62" y="61" width="4" height="15" fill="#0F172A" />
      {/* Monitor */}
      <rect x="25" y="20" width="30" height="24" fill="#0F172A" stroke="#334155" strokeWidth="2" />
      <rect x="28" y="23" width="24" height="18" fill="#0284C7" />
      {/* Code lines on monitor */}
      <line x1="31" y1="27" x2="45" y2="27" stroke="#BAE6FD" strokeWidth="1.5" />
      <line x1="31" y1="31" x2="49" y2="31" stroke="#38BDF8" strokeWidth="1.5" />
      <line x1="31" y1="35" x2="41" y2="35" stroke="#22C55E" strokeWidth="1.5" />
      {/* Monitor stand */}
      <rect x="38" y="44" width="4" height="11" fill="#334155" />
      <rect x="34" y="54" width="12" height="2" fill="#475569" />
      {/* Coffee mug */}
      <rect x="18" y="48" width="5" height="7" fill="#F8FAFC" />
      <path d="M 20 44 Q 21 42 20 40" stroke="#94A3B8" strokeWidth="1" fill="none" />
    </svg>
  );
}

function ArtIndieDays() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      <rect width="80" height="80" fill="#0F2922" />
      {/* Boombox body */}
      <rect x="14" y="25" width="52" height="32" rx="2" fill="#0D5C46" stroke="#10B981" strokeWidth="2" />
      {/* Handle */}
      <path d="M 28 25 L 28 17 L 52 17 L 52 25" stroke="#10B981" strokeWidth="2" fill="none" />
      {/* Left Speaker */}
      <circle cx="28" cy="41" r="8" fill="#064E3B" stroke="#34D399" strokeWidth="1.5" />
      <circle cx="28" cy="41" r="3" fill="#047857" />
      {/* Right Speaker */}
      <circle cx="52" cy="41" r="8" fill="#064E3B" stroke="#34D399" strokeWidth="1.5" />
      <circle cx="52" cy="41" r="3" fill="#047857" />
      {/* Center Cassette Door */}
      <rect x="38" y="35" width="8" height="12" fill="#047857" stroke="#34D399" strokeWidth="1" />
      {/* Antenna */}
      <line x1="20" y1="17" x2="12" y2="8" stroke="#34D399" strokeWidth="1.5" />
    </svg>
  );
}

function ArtRetroMix() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      <rect width="80" height="80" fill="#2D1124" />
      {/* Cassette tape body */}
      <rect x="12" y="22" width="56" height="36" rx="3" fill="#BE185D" stroke="#F472B6" strokeWidth="2" />
      {/* Label sticker */}
      <rect x="18" y="26" width="44" height="20" fill="#FDF2F8" />
      <rect x="22" y="29" width="36" height="4" fill="#DB2777" />
      {/* Spool holes */}
      <circle cx="30" cy="38" r="4" fill="#831843" stroke="#F472B6" strokeWidth="1.5" />
      <circle cx="50" cy="38" r="4" fill="#831843" stroke="#F472B6" strokeWidth="1.5" />
      <rect x="34" y="36" width="12" height="4" fill="#BE185D" />
      {/* Tape bottom wedge */}
      <polygon points="20,58 26,50 54,50 60,58" fill="#9D174D" />
      <circle cx="25" cy="54" r="1.5" fill="#FDF2F8" />
      <circle cx="55" cy="54" r="1.5" fill="#FDF2F8" />
    </svg>
  );
}

function ArtStudyMode() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      <rect width="80" height="80" fill="#0A2533" />
      {/* Sunset sky */}
      <rect x="0" y="0" width="80" height="45" fill="#164E63" />
      <rect x="0" y="25" width="80" height="20" fill="#0E7490" opacity="0.6" />
      {/* Sun */}
      <circle cx="40" cy="30" r="10" fill="#FDE047" />
      {/* Rolling hills */}
      <ellipse cx="20" cy="55" rx="35" ry="15" fill="#15803D" />
      <ellipse cx="65" cy="58" rx="40" ry="18" fill="#166534" />
      {/* Train track */}
      <line x1="0" y1="62" x2="80" y2="62" stroke="#334155" strokeWidth="2" />
      {/* Train */}
      <rect x="25" y="52" width="30" height="9" fill="#0284C7" rx="1" />
      <rect x="27" y="54" width="5" height="4" fill="#FEF08A" />
      <rect x="34" y="54" width="5" height="4" fill="#FEF08A" />
      <rect x="41" y="54" width="5" height="4" fill="#FEF08A" />
      <rect x="48" y="54" width="5" height="4" fill="#FEF08A" />
    </svg>
  );
}

function ArtMoodBooster() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      <defs>
        <linearGradient id="mbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4C1D95" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="80%" stopColor="#C026D3" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" fill="url(#mbGrad)" />
      {/* Moon/Sun */}
      <circle cx="40" cy="35" r="14" fill="#FEF08A" />
      {/* Cloud bars */}
      <rect x="15" y="42" width="35" height="3" fill="#4C1D95" rx="1" />
      <rect x="25" y="47" width="40" height="3" fill="#581C87" rx="1" />
      <rect x="35" y="52" width="30" height="2" fill="#701A75" rx="1" />
      {/* Distant mountains */}
      <polygon points="0,80 25,60 50,80" fill="#2E1065" />
      <polygon points="35,80 60,58 80,80" fill="#3B0764" />
    </svg>
  );
}

function ArtChillVibes() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
      <defs>
        <linearGradient id="cvGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#311042" />
          <stop offset="60%" stopColor="#701A75" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" fill="url(#cvGrad)" />
      {/* Setting Sun */}
      <circle cx="40" cy="46" r="16" fill="#F97316" />
      <circle cx="40" cy="46" r="11" fill="#FDE047" />
      {/* City skyline silhouettes */}
      <rect x="6" y="42" width="10" height="38" fill="#110726" />
      <rect x="20" y="32" width="12" height="48" fill="#180B33" />
      <rect x="36" y="48" width="10" height="32" fill="#0F0521" />
      <rect x="50" y="36" width="12" height="44" fill="#180B33" />
      <rect x="65" y="44" width="9" height="36" fill="#110726" />
      {/* Lit windows */}
      <rect x="23" y="38" width="2" height="3" fill="#FEF08A" />
      <rect x="27" y="44" width="2" height="3" fill="#F472B6" />
      <rect x="53" y="42" width="2" height="3" fill="#38BDF8" />
    </svg>
  );
}

const MADE_FOR_YOU_ITEMS = [
  { id: "mfy-1", title: "Lo-Fi Seeds", Component: ArtLoFiSeeds },
  { id: "mfy-2", title: "Night Drive", Component: ArtNightDrive },
  { id: "mfy-3", title: "Focus Flow", Component: ArtFocusFlow },
  { id: "mfy-4", title: "Indie Days", Component: ArtIndieDays },
  { id: "mfy-5", title: "Retro Mix", Component: ArtRetroMix },
  { id: "mfy-6", title: "Study Mode", Component: ArtStudyMode },
  { id: "mfy-7", title: "Mood Booster", Component: ArtMoodBooster },
  { id: "mfy-8", title: "Chill Vibes", Component: ArtChillVibes },
];

const DEFAULT_CONTINUE_TRACKS = [
  { id: "ct-1", title: "Larusso", artist: "Titus Haskins", isPlaying: true },
  { id: "ct-2", title: "Chill Vibes", artist: "Playlist", isPlaying: false },
  { id: "ct-3", title: "Aaj Bhi", artist: "Vishal Mishra", isPlaying: false },
  { id: "ct-4", title: "I Like Me Better", artist: "Lauv", isPlaying: false },
  { id: "ct-5", title: "Midnight Drive", artist: "Jinsang", isPlaying: false },
];

const DEFAULT_RECENT_TRACKS = [
  { id: "rt-1", title: "Larusso", artist: "Titus Haskins", duration: "2:27" },
  { id: "rt-2", title: "Chill Vibes", artist: "Playlist", duration: "3:12" },
  { id: "rt-3", title: "Aaj Bhi", artist: "Vishal Mishra", duration: "4:06" },
  { id: "rt-4", title: "I Like Me Better", artist: "Lauv", duration: "3:17" },
  { id: "rt-5", title: "Sana", artist: "Prateek Kuhad", duration: "4:32" },
];

const DEFAULT_PLAYLISTS = [
  { id: "pl-1", title: "Liked Songs", count: "312 songs", icon: "♥", bg: "from-indigo-600 to-purple-600" },
  { id: "pl-2", title: "Workout", count: "63 songs", icon: "🏋️", bg: "from-amber-700 to-amber-900" },
  { id: "pl-3", title: "Indie Picks", count: "48 songs", icon: "🪴", bg: "from-emerald-700 to-green-900" },
  { id: "pl-4", title: "Sad Hours", count: "44 songs", icon: "🌧️", bg: "from-slate-700 to-slate-900" },
  { id: "pl-5", title: "Road Trip", count: "92 songs", icon: "🚗", bg: "from-rose-700 to-pink-900" },
];

const DEFAULT_TOP_MIXES = [
  { id: "tm-1", title: "Today's Hits", by: "By PIXELFM", icon: "🌇", bg: "from-blue-700 to-indigo-900" },
  { id: "tm-2", title: "Lo-Fi Essentials", by: "By PIXELFM", icon: "✨", bg: "from-purple-700 to-indigo-900" },
  { id: "tm-3", title: "Bollywood Classics", by: "By PIXELFM", icon: "📼", bg: "from-pink-700 to-rose-900" },
  { id: "tm-4", title: "Chill Instrumentals", by: "By PIXELFM", icon: "🌙", bg: "from-cyan-700 to-blue-900" },
  { id: "tm-5", title: "Feel Good Mix", by: "By PIXELFM", icon: "🌅", bg: "from-amber-600 to-orange-800" },
];

export default function HomeView({ soundFX, onNavigate }: HomeViewProps) {
  const {
    playlists,
    likedTracks,
    recentlyPlayed,
    topTracks,
    featuredPlaylists,
    openPlaylist,
  } = useMusicData();
  const { playTrack } = usePlayer();

  const [activeMenuTag, setActiveMenuTag] = useState("REPEAT");

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 pb-28 md:pb-8 overflow-y-auto h-full select-none">
      {/* Title & Subtitle (Clean Modern Monospace matching Image 5) */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#22C55E]">//</span>
          <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
            Good Music, Brighter Days.
          </span>
        </div>
        <span className="font-mono text-xs sm:text-sm text-[#94A3B8] mt-1 tracking-normal font-normal">
          A calmer mind, one song at a time.
        </span>
      </div>

      {/* ============================================================ */}
      {/* HERO BANNER: Panoramic Night Skyline with Cat Silhouette (Image 5) */}
      {/* ============================================================ */}
      <div
        className="relative w-full rounded-[4px] overflow-hidden border border-[#16253B] flex items-center justify-between min-h-[140px] sm:min-h-[155px] p-4 sm:p-6"
        style={{
          background: "linear-gradient(180deg, #090615 0%, #170C2D 45%, #2B1147 75%, #15092A 100%)",
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.7), 0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* Rich Pixel Art Panoramic Cityscape SVG */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            viewBox="0 0 1000 200"
            style={{ imageRendering: "pixelated" }}
          >
            {/* Stars */}
            <circle cx="50" cy="20" r="1.5" fill="#F8FAFC" opacity="0.9" />
            <circle cx="120" cy="45" r="1" fill="#C084FC" opacity="0.8" />
            <circle cx="180" cy="25" r="2" fill="#38BDF8" opacity="0.85" />
            <circle cx="260" cy="55" r="1.5" fill="#F472B6" opacity="0.75" />
            <circle cx="340" cy="30" r="1" fill="#FEF08A" opacity="0.9" />
            <circle cx="420" cy="40" r="2" fill="#E2E8F0" opacity="0.8" />
            <circle cx="500" cy="20" r="1.5" fill="#38BDF8" opacity="0.7" />
            <circle cx="580" cy="48" r="1" fill="#F8FAFC" opacity="0.8" />
            <circle cx="680" cy="28" r="2" fill="#F472B6" opacity="0.85" />
            <circle cx="780" cy="50" r="1.5" fill="#38BDF8" opacity="0.7" />
            <circle cx="880" cy="22" r="2" fill="#FEF08A" opacity="0.9" />

            {/* Distant background towers */}
            <rect x="40" y="70" width="40" height="130" fill="#100A24" />
            <rect x="110" y="55" width="55" height="145" fill="#140D2D" />
            <rect x="200" y="80" width="50" height="120" fill="#100A24" />
            <rect x="290" y="50" width="60" height="150" fill="#180F35" />
            <rect x="380" y="75" width="50" height="125" fill="#140D2D" />
            <rect x="470" y="40" width="65" height="160" fill="#1D1240" />
            <rect x="570" y="70" width="55" height="130" fill="#140D2D" />
            <rect x="660" y="55" width="60" height="145" fill="#180F35" />
            <rect x="760" y="80" width="50" height="120" fill="#100A24" />

            {/* Midground highrise buildings with spires */}
            <polygon points="135,55 137,35 139,55" fill="#2E1B5B" />
            <polygon points="320,50 322,25 324,50" fill="#38216D" />
            <polygon points="502,40 504,18 506,40" fill="#43267E" />
            <polygon points="690,55 692,30 694,55" fill="#38216D" />

            {/* Foreground dark skyline */}
            <rect x="20" y="110" width="50" height="90" fill="#090514" />
            <rect x="85" y="90" width="45" height="110" fill="#0B061A" />
            <rect x="150" y="125" width="60" height="75" fill="#090514" />
            <rect x="230" y="95" width="55" height="105" fill="#0C071C" />
            <rect x="310" y="120" width="50" height="80" fill="#090514" />
            <rect x="380" y="85" width="65" height="115" fill="#0E0822" />
            <rect x="465" y="115" width="50" height="85" fill="#090514" />
            <rect x="535" y="90" width="70" height="110" fill="#0E0822" />
            <rect x="630" y="110" width="50" height="90" fill="#0B061A" />
            <rect x="700" y="130" width="60" height="70" fill="#090514" />

            {/* Glowing neon windows (pink, purple, cyan, warm yellow) */}
            <rect x="95" y="105" width="4" height="6" fill="#F472B6" />
            <rect x="105" y="120" width="4" height="6" fill="#38BDF8" />
            <rect x="95" y="135" width="4" height="6" fill="#FEF08A" />
            <rect x="115" y="150" width="4" height="6" fill="#EC4899" />
            <rect x="245" y="110" width="4" height="6" fill="#38BDF8" />
            <rect x="260" y="125" width="4" height="6" fill="#FEF08A" />
            <rect x="245" y="145" width="4" height="6" fill="#22C55E" />
            <rect x="395" y="100" width="4" height="6" fill="#F472B6" />
            <rect x="415" y="115" width="4" height="6" fill="#38BDF8" />
            <rect x="405" y="135" width="4" height="6" fill="#FEF08A" />
            <rect x="425" y="150" width="4" height="6" fill="#EC4899" />
            <rect x="550" y="105" width="4" height="6" fill="#22C55E" />
            <rect x="575" y="120" width="4" height="6" fill="#F472B6" />
            <rect x="560" y="140" width="4" height="6" fill="#38BDF8" />

            {/* Foreground Rooftop Cat Silhouette (Sitting looking right) */}
            <g transform="translate(580, 120)">
              {/* Cat Body */}
              <ellipse cx="22" cy="42" rx="15" ry="18" fill="#030206" />
              {/* Cat Head */}
              <circle cx="22" cy="22" r="11" fill="#030206" />
              {/* Ears */}
              <polygon points="12,18 16,6 20,16" fill="#030206" />
              <polygon points="24,16 28,6 32,18" fill="#030206" />
              {/* Tail curving up */}
              <path d="M 9 48 Q 2 40 4 30 Q 5 24 9 26" stroke="#030206" strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </div>

        {/* Right Menu: PLAY / EXPLORE / FEEL / REPEAT with neon green indicator */}
        <div className="relative z-10 ml-auto flex flex-col items-end gap-1.5 font-mono text-[11px] sm:text-xs font-bold tracking-widest text-[#94A3B8]">
          {["PLAY", "EXPLORE", "FEEL", "REPEAT"].map((item) => {
            const isActive = activeMenuTag === item;
            return (
              <div
                key={item}
                onClick={() => {
                  if (soundFX) playChime("click");
                  setActiveMenuTag(item);
                }}
                className={`cursor-pointer transition-colors flex flex-col items-end ${
                  isActive ? "text-[#22C55E]" : "hover:text-[#F8FAFC]"
                }`}
              >
                <span>{item}</span>
                {isActive && <div className="w-6 h-[2px] bg-[#22C55E] mt-0.5 shadow-[0_0_6px_#22C55E]" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: Continue Listening (5 Wide Horizontal Cards) */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#22C55E] text-xs">▶</span>
            <span className="font-mono text-sm font-bold text-[#F8FAFC]">
              Continue Listening
            </span>
          </div>
          <span
            onClick={() => onNavigate("library")}
            className="font-mono text-xs text-[#64748B] hover:text-[#22C55E] cursor-pointer transition-colors"
          >
            See all →
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topTracks && topTracks.length > 0 ? (
            topTracks.slice(0, 5).map((t, idx) => (
              <div
                key={t.id}
                onClick={() => {
                  if (soundFX) playChime("click");
                  playTrack(t, topTracks);
                }}
                className="group flex items-center justify-between p-2 rounded-[3px] cursor-pointer transition-all hover:border-[#22C55E] bg-[#070D18] border border-[#142236]"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  {t.album?.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.album.images[0].url}
                      alt=""
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
                      {t.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B] truncate">
                      {t.artists?.[0]?.name}
                    </span>
                  </div>
                </div>

                {idx === 0 && (
                  <button className="w-6 h-6 rounded-full bg-[#22C55E] text-black text-[10px] flex items-center justify-center flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]">
                    ▶
                  </button>
                )}
              </div>
            ))
          ) : (
            DEFAULT_CONTINUE_TRACKS.map((t) => (
              <div
                key={t.id}
                className="group flex items-center justify-between p-2 rounded-[3px] cursor-pointer transition-all hover:border-[#22C55E] bg-[#070D18] border border-[#142236]"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <div className="w-10 h-10 bg-[#0E1624] border border-[#1E293B] rounded-[2px] flex items-center justify-center text-xs text-[#64748B] flex-shrink-0">
                    ♫
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-bold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {t.title}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B] truncate">
                      {t.artist}
                    </span>
                  </div>
                </div>

                {t.isPlaying && (
                  <button className="w-6 h-6 rounded-full bg-[#22C55E] text-black text-[10px] flex items-center justify-center flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]">
                    ▶
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: Made For You (Image 5: 8 Vertical Cards with Square Pixel Art) */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#22C55E] text-xs">✨</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#F8FAFC]">
                Made For You
              </span>
              <span className="hidden sm:inline font-mono text-xs text-[#64748B]">
                Playlists picked just for your vibe.
              </span>
            </div>
          </div>
          <span
            onClick={() => onNavigate("library")}
            className="font-mono text-xs text-[#64748B] hover:text-[#22C55E] cursor-pointer transition-colors"
          >
            See all →
          </span>
        </div>

        {/* 8 Vertical Square-Art Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {MADE_FOR_YOU_ITEMS.map((item) => {
            const ArtComponent = item.Component;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (soundFX) playChime("click");
                  onNavigate("discover");
                }}
                className="group flex flex-col p-2 rounded-[3px] cursor-pointer transition-all hover:border-[#22C55E] bg-[#070D18] border border-[#142236]"
              >
                {/* Square Pixel Art Container */}
                <div className="w-full aspect-square rounded-[2px] overflow-hidden border border-[#16253B] mb-2 relative group-hover:scale-105 transition-transform">
                  <ArtComponent />
                </div>

                {/* Title */}
                <span className="font-mono text-xs font-semibold text-[#CBD5E1] group-hover:text-[#22C55E] truncate text-center">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: 3-Column Lower Section (Recently Played, Your Playlists, Top Mixes) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Column 1: Recently Played */}
        <div
          className="flex flex-col gap-2 p-3.5 rounded-[3px]"
          style={{
            backgroundColor: "#070D18",
            border: "1px solid #142236",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#F8FAFC]">
              <span className="text-[#22C55E]">🕒</span>
              <span>Recently Played</span>
            </div>
            <span className="font-mono text-xs text-[#64748B] hover:text-[#22C55E] cursor-pointer">
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
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  {track.album?.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={track.album.images[0].url}
                      alt=""
                      className="w-8 h-8 object-cover rounded-[2px] flex-shrink-0"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#162032] flex items-center justify-center text-xs text-[#22C55E] flex-shrink-0">
                      ♫
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {track.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B] truncate">
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
            DEFAULT_RECENT_TRACKS.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <div className="w-8 h-8 bg-[#0E1624] border border-[#1E293B] rounded-[2px] flex items-center justify-center text-xs text-[#64748B] flex-shrink-0">
                    ♫
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {r.title}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B] truncate">
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

        {/* Column 2: Your Playlists */}
        <div
          className="flex flex-col gap-2 p-3.5 rounded-[3px]"
          style={{
            backgroundColor: "#070D18",
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
              className="font-mono text-xs text-[#64748B] hover:text-[#22C55E] cursor-pointer"
            >
              See all →
            </span>
          </div>

          {/* Liked Songs Row */}
          <div
            onClick={() => {
              if (soundFX) playChime("click");
              onNavigate("library");
            }}
            className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-1">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2px] flex items-center justify-center text-xs text-white flex-shrink-0 shadow-sm">
                ♥
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                  Liked Songs
                </span>
                <span className="font-mono text-[10px] text-[#64748B] truncate">
                  {likedTracks.length || 312} songs
                </span>
              </div>
            </div>
            <span className="text-[#64748B] text-xs">•••</span>
          </div>

          {/* Real Playlists from Abhishek's Spotify account */}
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
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  {pl.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pl.images[0].url}
                      alt=""
                      className="w-8 h-8 object-cover rounded-[2px] flex-shrink-0"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#162032] flex items-center justify-center text-xs text-[#22C55E] flex-shrink-0">
                      ♫
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {pl.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B] truncate">
                      {pl.tracks?.total || 0} songs
                    </span>
                  </div>
                </div>
                <span className="text-[#64748B] text-xs">•••</span>
              </div>
            ))
          ) : (
            DEFAULT_PLAYLISTS.slice(1).map((pl) => (
              <div
                key={pl.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <div className={`w-8 h-8 bg-gradient-to-br ${pl.bg} rounded-[2px] flex items-center justify-center text-xs text-white flex-shrink-0`}>
                    {pl.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {pl.title}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B] truncate">
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
          className="flex flex-col gap-2 p-3.5 rounded-[3px]"
          style={{
            backgroundColor: "#070D18",
            border: "1px solid #142236",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#F8FAFC]">
              <span className="text-[#22C55E]">📊</span>
              <span>Top Mixes</span>
            </div>
            <span className="font-mono text-xs text-[#64748B] hover:text-[#22C55E] cursor-pointer">
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
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  {pl.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pl.images[0].url}
                      alt=""
                      className="w-8 h-8 object-cover rounded-[2px] flex-shrink-0"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#162032] flex items-center justify-center text-xs text-[#22C55E] flex-shrink-0">
                      ♫
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {pl.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B] truncate">
                      By PIXELFM
                    </span>
                  </div>
                </div>
                <span className="text-[#64748B] text-xs">•••</span>
              </div>
            ))
          ) : (
            DEFAULT_TOP_MIXES.map((mix) => (
              <div
                key={mix.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <div className={`w-8 h-8 bg-gradient-to-br ${mix.bg} rounded-[2px] flex items-center justify-center text-xs text-white flex-shrink-0`}>
                    {mix.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#22C55E]">
                      {mix.title}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B] truncate">
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
