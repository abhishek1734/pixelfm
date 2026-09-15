"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMusicData } from "@/contexts/MusicDataContext";
import { usePlayer } from "@/contexts/PlayerContext";

import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import NowPlayingDeck from "@/components/NowPlayingDeck";
import PixelCat from "@/components/PixelCat";
import DeviceManager from "@/components/DeviceManager";
import QueueDrawer from "@/components/QueueDrawer";
import CRTOverlay from "@/components/CRTOverlay";
import SettingsPanel from "@/components/SettingsPanel";
import ErrorBoundary from "@/components/ErrorBoundary";
import MiniPlayer from "@/components/MiniPlayer";
import DiscoverView from "@/components/views/DiscoverView";
import PlaylistDetailView from "@/components/views/PlaylistDetailView";
import AlbumDetailView from "@/components/views/AlbumDetailView";
import ArtistDetailView from "@/components/views/ArtistDetailView";

import { playChime } from "@/lib/audioEngine";
import { SpotifyAlbum, SpotifyPlaylist, SpotifyTrack, SpotifyArtist } from "@/lib/spotify";

// ============================================================
// Main Player Views — Personalized Station
// ============================================================

type NavView = "home" | "library" | "search" | "discover" | "deck" | "settings";
type HomeCategory = "all" | "radios" | "albums" | "top" | "playlists" | "releases";

const DEMO_MOCKUP_PLAYLISTS: SpotifyPlaylist[] = [
  {
    id: "demo-pl-1",
    name: "Sing Along ♫",
    uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
    description: "Sing along hits",
    owner: { display_name: "Spotify" },
    public: true,
    images: [{ url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80", width: 400, height: 400 }],
    tracks: { total: 0 },
  },
  {
    id: "demo-pl-2",
    name: "Feel Good Dance Music - Happy Dance ...",
    uri: "spotify:playlist:37i9dQZF1DXdPec7aLTmlC",
    description: "Feel good dance music",
    owner: { display_name: "Spotify" },
    public: true,
    images: [{ url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80", width: 400, height: 400 }],
    tracks: { total: 0 },
  },
  {
    id: "demo-pl-3",
    name: "Purane gane",
    uri: "spotify:playlist:37i9dQZF1EIecW8B8T0H6e",
    description: "Classic Hindi melodies",
    owner: { display_name: "Spotify" },
    public: true,
    images: [{ url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80", width: 400, height: 400 }],
    tracks: { total: 0 },
  },
  {
    id: "demo-pl-4",
    name: "Today's Hits",
    uri: "spotify:playlist:37i9dQZF1DXcBWIGoYBM5M",
    description: "Top charts today",
    owner: { display_name: "Spotify" },
    public: true,
    images: [{ url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80", width: 400, height: 400 }],
    tracks: { total: 0 },
  },
  {
    id: "demo-pl-5",
    name: "Lake Vibes",
    uri: "spotify:playlist:37i9dQZF1DX4WYpdgoIcn6",
    description: "Chilled ambient beats",
    owner: { display_name: "Spotify" },
    public: true,
    images: [{ url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80", width: 400, height: 400 }],
    tracks: { total: 0 },
  },
  {
    id: "demo-pl-6",
    name: "Late Night",
    uri: "spotify:playlist:37i9dQZF1DX3qCx52M4e6N",
    description: "Midnight drive synth",
    owner: { display_name: "Spotify" },
    public: true,
    images: [{ url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80", width: 400, height: 400 }],
    tracks: { total: 0 },
  },
];

function HomeView({
  soundFX,
  onNavigate,
}: {
  soundFX: boolean;
  onNavigate: (v: NavView) => void;
}) {
  const { user, isAuthenticated } = useAuth();
  const {
    playlists,
    likedTracks,
    albums,
    recentlyPlayed,
    topTracks,
    topArtists,
    featuredPlaylists,
    newReleases,
    isLoadingLibrary,
    refreshLibrary,
    libraryError,
    startRadio,
    openPlaylist,
    openAlbum,
    openArtist,
  } = useMusicData();

  const { playContext, playTracks, playTrack, isReady, externalDevice } = usePlayer();
  const [selectedCategory, setSelectedCategory] = useState<HomeCategory>("all");
  const [loadingRadioSeed, setLoadingRadioSeed] = useState<string | null>(null);

  // When authenticated, use strictly real Spotify playlists without mixing mockups
  const displayPlaylists =
    isAuthenticated && playlists.length > 0
      ? playlists
      : DEMO_MOCKUP_PLAYLISTS;

  // Identify radio / mix playlists (Daily Mix, Discover Weekly, Radio, Mix)
  const radioAndMixPlaylists = playlists.filter((p) => {
    const n = (p.name || "").toLowerCase();
    return n.includes("mix") || n.includes("radio") || n.includes("discover") || n.includes("radar");
  });

  const handleStartArtistRadio = async (artist: SpotifyArtist) => {
    if (soundFX) playChime("click");
    setLoadingRadioSeed(artist.name);
    try {
      const radioPl = await startRadio(artist.name);
      if (radioPl?.uri) {
        await playContext(radioPl.uri);
      } else {
        await playContext(artist.uri);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingRadioSeed(null);
    }
  };

  const handleStartTrackRadio = async (track: SpotifyTrack) => {
    if (soundFX) playChime("click");
    setLoadingRadioSeed(track.name);
    try {
      const radioPl = await startRadio(track.name);
      if (radioPl?.uri) {
        await playContext(radioPl.uri);
      } else {
        await playTracks([track.uri]);
      }
    } finally {
      setLoadingRadioSeed(null);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-4 pb-28 md:pb-6 overflow-y-auto h-full select-none">
      {/* Device Connection Banner */}
      <DeviceManager soundFX={soundFX} />

      {/* Top Station Status & Refresh Bar */}
      <div
        className="flex items-center justify-between px-3.5 py-2.5 rounded-[2px]"
        style={{
          backgroundColor: "#070E17",
          border: "1px solid #142236",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] text-[#22C55E] leading-none">■</span>
          <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#E2E8F0] tracking-wider uppercase truncate">
            WEB STATION AUDIO READY
          </span>
        </div>
        <button
          onClick={() => {
            if (soundFX) playChime("click");
            refreshLibrary();
          }}
          className="font-pixel text-[8px] px-2.5 sm:px-3 py-1 text-[#E2E8F0] hover:text-[#22C55E] transition-all rounded-[2px] flex-shrink-0"
          style={{
            backgroundColor: "#0B1422",
            border: "1px solid #16253B",
          }}
          title="Sync latest Spotify personalized content"
        >
          {isLoadingLibrary ? "SYNCING..." : "↺ SYNC"}
        </button>
      </div>

      {libraryError && (
        <div
          className="font-mono text-xs p-2 rounded-[2px]"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid #EF4444",
            color: "#FCA5A5",
          }}
        >
          Notice: {libraryError}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3x2 MY PLAYLISTS GRID — PRIMARY HERO SECTION */}
      {/* ============================================================ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-pixel text-[10px] text-[#22C55E] tracking-wider flex items-center gap-2"
            style={{ textShadow: "0 0 8px rgba(34, 197, 94, 0.4)" }}
          >
            <span>♫</span>
            <span>MY PLAYLISTS ({playlists.length || 5})</span>
          </span>
          <button
            onClick={() => {
              if (soundFX) playChime("click");
              onNavigate("library");
            }}
            className="font-mono text-[10px] text-[#64748B] hover:text-[#22C55E] transition-colors"
          >
            VIEW ALL ➔
          </button>
        </div>

        {/* 2 columns on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5">
          {displayPlaylists.slice(0, 6).map((pl) => (
            <div
              key={pl.id}
              className="group flex flex-col p-2.5 cursor-pointer transition-all duration-150 rounded-[2px] relative"
              style={{
                backgroundColor: "#070D17",
                border: "1px solid #142236",
              }}
              onClick={() => {
                if (soundFX) playChime("click");
                openPlaylist(pl.id, pl);
              }}
            >
              {/* Cover Art Container */}
              <div className="relative w-full aspect-square bg-[#090E16] rounded-[2px] overflow-hidden border border-[#142236] mb-2.5">
                {pl.images?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pl.images[0].url}
                    alt={pl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-[#334155]">
                    ♫
                  </div>
                )}
                {/* Hover Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-9 h-9 rounded-full bg-[#22C55E] flex items-center justify-center text-black text-sm font-bold shadow-lg">
                    ▶
                  </div>
                </div>
              </div>

              {/* Title + Track count + 3 dots menu button */}
              <div className="flex items-end justify-between gap-1">
                <div className="flex flex-col min-w-0 flex-1 pr-1">
                  <span
                    className="font-mono text-[11px] font-semibold text-[#F8FAFC] group-hover:text-[#22C55E] transition-colors truncate"
                    title={pl.name}
                  >
                    {pl.name}
                  </span>
                  <span className="font-mono text-[9px] text-[#64748B] mt-0.5">
                    {pl.tracks?.total || 0} tracks
                  </span>
                </div>

                {/* 3-dot context button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (soundFX) playChime("click");
                    playContext(pl.uri);
                  }}
                  className="text-[#64748B] hover:text-[#22C55E] px-1 text-sm font-bold leading-none transition-colors"
                  title="Options"
                >
                  ⋮
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Pills for Extended Content */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-[#142236]">
        {[
          { id: "all", label: "★ ALL STATIONS" },
          { id: "radios", label: "📻 RADIO & MIXES" },
          { id: "albums", label: "💽 ALBUMS" },
          { id: "top", label: "🔥 TOP ROTATION" },
          { id: "releases", label: "✨ NEW RELEASES" },
        ].map((tab) => {
          const active = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (soundFX) playChime("click");
                setSelectedCategory(tab.id as HomeCategory);
              }}
              className="font-pixel transition-all whitespace-nowrap rounded-[2px]"
              style={{
                fontSize: 7,
                padding: "5px 10px",
                border: active ? "1px solid #22C55E" : "1px solid #142236",
                backgroundColor: active ? "rgba(34, 197, 94, 0.12)" : "#070D17",
                color: active ? "#22C55E" : "#64748B",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: PERSONALIZED RADIO STATIONS & DAILY MIXES */}
      {/* ============================================================ */}
      {(selectedCategory === "all" || selectedCategory === "radios") && (
        <div>
          <div className="flex items-center justify-between mb-3 pb-1 border-b" style={{ borderColor: "var(--color-border)" }}>
            <span className="font-pixel text-[8px] text-[var(--color-amber)] tracking-wider">
              📻 PERSONALIZED RADIO & MIXES
            </span>
            <span className="font-mono-retro text-[9px] text-[var(--color-text-dim)]">
              Artist Radios · Daily Mixes · Algorithmic Stations
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Top Artist Radios */}
            {topArtists.slice(0, 4).map((artist) => (
              <div
                key={artist.id}
                className="card-pixel p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-[var(--color-amber)] transition-all group text-center relative overflow-hidden"
                style={{ backgroundColor: "var(--color-surface)" }}
                onClick={() => handleStartArtistRadio(artist)}
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--color-border)] group-hover:border-[var(--color-amber)] transition-all">
                  {artist.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--color-elevated)] flex items-center justify-center text-xl">
                      🎙
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0 w-full">
                  <span className="font-mono-retro text-xs text-[var(--color-text-primary)] truncate">
                    {artist.name}
                  </span>
                  <span className="font-pixel text-[7px] text-[var(--color-amber)] mt-0.5">
                    {loadingRadioSeed === artist.name ? "TUNING..." : "▶ ARTIST RADIO"}
                  </span>
                </div>
              </div>
            ))}

            {/* Saved Mix Playlists */}
            {radioAndMixPlaylists.slice(0, 4).map((mix) => (
              <div
                key={mix.id}
                className="card-pixel p-3 flex flex-col gap-2 cursor-pointer hover:border-[var(--color-phosphor)] transition-all group"
                style={{ backgroundColor: "var(--color-surface)" }}
                onClick={() => {
                  if (soundFX) playChime("click");
                  playContext(mix.uri);
                }}
              >
                <div className="relative w-full aspect-square bg-[var(--color-void)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
                  {mix.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mix.images[0].url}
                      alt={mix.name}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <span className="text-2xl">📻</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="font-pixel text-xs text-[var(--color-phosphor)]">▶ TUNE IN</span>
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono-retro text-xs text-[var(--color-text-primary)] truncate">
                    {mix.name}
                  </span>
                  <span className="font-pixel text-[6px] text-[var(--color-phosphor)]">
                    SPOTIFY MIX
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: SAVED ALBUMS */}
      {/* ============================================================ */}
      {(selectedCategory === "all" || selectedCategory === "albums") && (
        <div>
          <div className="flex items-center justify-between mb-3 pb-1 border-b" style={{ borderColor: "var(--color-border)" }}>
            <span className="font-pixel text-[8px] text-[var(--color-phosphor)] tracking-wider">
              💽 SAVED ALBUMS ({albums.length})
            </span>
          </div>

          {albums.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {albums.slice(0, 12).map((album) => (
                <div
                  key={album.id}
                  className="card-pixel p-2 flex flex-col gap-2 cursor-pointer hover:border-[var(--color-phosphor)] transition-all group"
                  onClick={() => {
                    if (soundFX) playChime("click");
                    openAlbum(album.id, album);
                  }}
                >
                  <div className="relative w-full aspect-square bg-[var(--color-void)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
                    {album.images?.[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={album.images[0].url}
                        alt={album.name}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: "pixelated" }}
                      />
                    ) : (
                      <span className="text-xl">💽</span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="font-pixel text-xs text-[var(--color-phosphor)]">▶ PLAY</span>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono-retro text-xs text-[var(--color-text-primary)] truncate">
                      {album.name}
                    </span>
                    <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)] truncate">
                      {album.artists?.[0]?.name || "Artist"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center font-mono-retro text-xs text-[var(--color-text-dim)] border border-dashed border-[var(--color-border)]">
              No saved albums found in your Spotify library. Save albums in Spotify or explore below!
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 3: TOP ROTATION / HEAVY ROTATION */}
      {/* ============================================================ */}
      {(selectedCategory === "all" || selectedCategory === "top") && (
        <div>
          <div className="flex items-center justify-between mb-3 pb-1 border-b" style={{ borderColor: "var(--color-border)" }}>
            <span className="font-pixel text-[8px] text-[var(--color-pink)] tracking-wider">
              🔥 YOUR TOP ROTATION (PERSONALIZED)
            </span>
            <span className="font-mono-retro text-[9px] text-[var(--color-text-dim)]">
              Most Played Songs on Your Account
            </span>
          </div>

          {topTracks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {topTracks.slice(0, 10).map((track, idx) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-pink)] transition-all group"
                  onClick={() => {
                    if (soundFX) playChime("click");
                    playTrack(track, topTracks);
                  }}
                >
                  <span
                    className="font-pixel text-xs w-6 text-center"
                    style={{ color: idx < 3 ? "var(--color-pink)" : "var(--color-text-dim)" }}
                  >
                    #{idx + 1}
                  </span>
                  {track.album?.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={track.album.images[0].url}
                      alt=""
                      className="w-10 h-10 object-cover flex-shrink-0"
                      style={{ imageRendering: "pixelated", border: "1px solid var(--color-border)" }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[var(--color-elevated)] flex items-center justify-center text-xs flex-shrink-0">
                      ♪
                    </div>
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-mono-retro text-xs text-[var(--color-text-primary)] truncate">
                      {track.name}
                    </span>
                    <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)] truncate">
                      {track.artists?.map((a) => a?.name || "").filter(Boolean).join(", ") || "Unknown Artist"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn-pixel opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ padding: "2px 6px", fontSize: 6 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartTrackRadio(track);
                      }}
                      title="Start Track Radio"
                    >
                      RADIO
                    </button>
                    <span className="btn-pixel btn-pixel-phosphor" style={{ padding: "3px 8px", fontSize: 7 }}>
                      ▶
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="font-mono-retro text-xs text-[var(--color-text-dim)] p-2">
              Playing your recent favorite tracks will personalize this section.
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 4: PLAYLISTS & LIKED SONGS */}
      {/* ============================================================ */}
      {(selectedCategory === "all" || selectedCategory === "playlists") && (
        <div>
          <div className="flex items-center justify-between mb-3 pb-1 border-b" style={{ borderColor: "var(--color-border)" }}>
            <span className="font-pixel text-[8px] text-[var(--color-phosphor)] tracking-wider">
              ♫ YOUR PLAYLISTS ({playlists.length})
            </span>
            <button
              onClick={() => onNavigate("library")}
              className="font-pixel text-[7px] text-[var(--color-text-dim)] hover:text-[var(--color-phosphor)]"
            >
              FULL LIBRARY ➔
            </button>
          </div>

          {/* Liked Songs Quick Action */}
          {likedTracks.length > 0 && (
            <div
              className="p-3 mb-3 flex items-center justify-between cursor-pointer hover:border-[var(--color-phosphor)] transition-all"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "2px solid var(--color-elevated)",
              }}
              onClick={() => {
                if (soundFX) playChime("click");
                playTracks(likedTracks.map((t) => t.uri));
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl text-[var(--color-pink)]">♥</span>
                <div className="flex flex-col">
                  <span className="font-pixel text-[8px] text-[var(--color-text-primary)]">
                    LIKED SONGS STATION
                  </span>
                  <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)]">
                    {likedTracks.length} saved songs
                  </span>
                </div>
              </div>
              <span className="btn-pixel btn-pixel-phosphor" style={{ padding: "4px 10px", fontSize: 8 }}>
                ▶ PLAY ALL
              </span>
            </div>
          )}

          {playlists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {playlists.slice(0, 8).map((pl) => (
                <div
                  key={pl.id}
                  className="card-pixel p-2.5 flex flex-col gap-2 cursor-pointer hover:border-[var(--color-phosphor)] transition-all group"
                  onClick={() => {
                    if (soundFX) playChime("click");
                    openPlaylist(pl.id, pl);
                  }}
                >
                  <div className="relative w-full aspect-square bg-[var(--color-void)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
                    {pl.images?.[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={pl.images[0].url}
                        alt={pl.name}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: "pixelated" }}
                      />
                    ) : (
                      <span className="text-2xl">♫</span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="font-pixel text-xs text-[var(--color-phosphor)]">▶ PLAY</span>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono-retro text-xs text-[var(--color-text-primary)] truncate">
                      {pl.name}
                    </span>
                    <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)]">
                      {pl?.tracks?.total ?? 0} tracks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center font-mono-retro text-xs text-[var(--color-text-dim)] border border-dashed border-[var(--color-border)]">
              No playlists found.
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 5: NEW RELEASES & FEATURED CURATION */}
      {/* ============================================================ */}
      {(selectedCategory === "all" || selectedCategory === "releases") && (
        <div>
          <div className="flex items-center justify-between mb-3 pb-1 border-b" style={{ borderColor: "var(--color-border)" }}>
            <span className="font-pixel text-[8px] text-[var(--color-phosphor)] tracking-wider">
              ✨ NEW RELEASES & FEATURED STATIONS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {newReleases.slice(0, 6).map((album) => (
              <div
                key={album.id}
                className="card-pixel p-2 flex flex-col gap-2 cursor-pointer hover:border-[var(--color-phosphor)] transition-all group"
                onClick={() => {
                  if (soundFX) playChime("click");
                  openAlbum(album.id, album);
                }}
              >
                <div className="relative w-full aspect-square bg-[var(--color-void)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
                  {album.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={album.images[0].url}
                      alt={album.name}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <span className="text-xl">✨</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="font-pixel text-xs text-[var(--color-phosphor)]">▶ VIEW</span>
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono-retro text-xs text-[var(--color-text-primary)] truncate">
                    {album.name}
                  </span>
                  <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)] truncate">
                    {album.artists?.[0]?.name || "Artist"}
                  </span>
                </div>
              </div>
            ))}

            {featuredPlaylists.slice(0, 6).map((pl) => (
              <div
                key={pl.id}
                className="card-pixel p-2 flex flex-col gap-2 cursor-pointer hover:border-[var(--color-amber)] transition-all group"
                onClick={() => {
                  if (soundFX) playChime("click");
                  openPlaylist(pl.id, pl);
                }}
              >
                <div className="relative w-full aspect-square bg-[var(--color-void)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
                  {pl.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pl.images[0].url}
                      alt={pl.name}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <span className="text-xl">📻</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="font-pixel text-xs text-[var(--color-amber)]">▶ VIEW</span>
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-mono-retro text-xs text-[var(--color-text-primary)] truncate">
                    {pl.name}
                  </span>
                  <span className="font-pixel text-[6px] text-[var(--color-amber)]">
                    FEATURED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 6: RECENTLY PLAYED HISTORY */}
      {/* ============================================================ */}
      {recentlyPlayed.length > 0 && (selectedCategory === "all" || selectedCategory === "top") && (
        <div>
          <div className="flex items-center justify-between mb-3 pb-1 border-b" style={{ borderColor: "var(--color-border)" }}>
            <span className="font-pixel text-[8px] text-[var(--color-amber)] tracking-wider">
              ◉ RECENT LISTENING HISTORY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {recentlyPlayed.slice(0, 8).map((track, i) => (
              <div
                key={`${track.id}-${i}`}
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[var(--color-surface)] border border-transparent hover:border-[var(--color-elevated)] transition-all"
                onClick={() => {
                  if (soundFX) playChime("click");
                  playTrack(track, recentlyPlayed);
                }}
              >
                {track.album?.images?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={track.album.images[0].url}
                    alt=""
                    className="w-9 h-9 object-cover flex-shrink-0"
                    style={{ imageRendering: "pixelated", border: "1px solid var(--color-border)" }}
                  />
                ) : (
                  <div className="w-9 h-9 bg-[var(--color-elevated)] flex items-center justify-center text-xs flex-shrink-0">
                    ♪
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-mono-retro text-xs text-[var(--color-text-primary)] truncate">
                    {track?.name || "Unknown Track"}
                  </span>
                  <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)] truncate">
                    {track?.artists?.length
                      ? track.artists.map((a) => a?.name || "").filter(Boolean).join(", ")
                      : "Unknown Artist"}
                  </span>
                </div>
                <span className="font-pixel text-[8px] text-[var(--color-phosphor)] flex-shrink-0">
                  ▶
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface LibraryPlaylistItem {
  id: string;
  name: string;
  songsCount: number;
  updatedAt: string;
  icon: string;
  imageUrl?: string;
  gradient?: string;
  uri?: string;
}

const DEFAULT_PINNED_CARDS: LibraryPlaylistItem[] = [
  {
    id: "pin-liked",
    name: "Liked Songs",
    songsCount: 312,
    updatedAt: "Updated today",
    icon: "♥",
    gradient: "linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #A855F7 100%)",
  },
  {
    id: "pin-chill",
    name: "Chill Vibes",
    songsCount: 89,
    updatedAt: "Updated 2 days ago",
    icon: "🌆",
    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "pin-late-night",
    name: "Late Night",
    songsCount: 102,
    updatedAt: "Updated 3 days ago",
    icon: "🌃",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "pin-study",
    name: "Study Focus",
    songsCount: 76,
    updatedAt: "Updated 5 days ago",
    icon: "🚂",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "pin-retro",
    name: "Retro Mix",
    songsCount: 54,
    updatedAt: "Updated 1 week ago",
    icon: "📼",
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80",
  },
];

const DEFAULT_ALL_PLAYLISTS: LibraryPlaylistItem[] = [
  {
    id: "pl-workout",
    name: "Workout",
    songsCount: 63,
    updatedAt: "Updated 2 days ago",
    icon: "🏋️",
    gradient: "linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)",
  },
  {
    id: "pl-bollywood",
    name: "Bollywood Classics",
    songsCount: 120,
    updatedAt: "Updated 1 week ago",
    icon: "📼",
    gradient: "linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #4F46E5 100%)",
  },
  {
    id: "pl-indie",
    name: "Indie Picks",
    songsCount: 48,
    updatedAt: "Updated 1 week ago",
    icon: "🪴",
    gradient: "linear-gradient(135deg, #064E3B 0%, #047857 50%, #10B981 100%)",
  },
  {
    id: "pl-road-trip",
    name: "Road Trip",
    songsCount: 92,
    updatedAt: "Updated 2 weeks ago",
    icon: "🚗",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "pl-lofi",
    name: "Lo-Fi Beats",
    songsCount: 111,
    updatedAt: "Updated 3 weeks ago",
    icon: "🌙",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "pl-chill-vibes-2",
    name: "Chill Vibes",
    songsCount: 89,
    updatedAt: "Updated 2 days ago",
    icon: "🌆",
    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "pl-study-focus-2",
    name: "Study Focus",
    songsCount: 76,
    updatedAt: "Updated 5 days ago",
    icon: "🚂",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "pl-party",
    name: "Party Mix",
    songsCount: 67,
    updatedAt: "Updated 1 week ago",
    icon: "🪩",
    gradient: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #C084FC 100%)",
  },
  {
    id: "pl-sad-hours",
    name: "Sad Hours",
    songsCount: 44,
    updatedAt: "Updated 2 weeks ago",
    icon: "🌧",
    gradient: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
  },
  {
    id: "pl-discover-weekly",
    name: "Discover Weekly",
    songsCount: 30,
    updatedAt: "Updated 3 weeks ago",
    icon: "✨",
    gradient: "linear-gradient(135deg, #1E1B4B 0%, #2E1065 50%, #581C87 100%)",
  },
];

function LibraryView({ soundFX }: { soundFX: boolean }) {
  const { isAuthenticated } = useAuth();
  const {
    playlists,
    likedTracks,
    albums,
    topArtists,
    isLoadingLibrary,
    openPlaylist,
    openAlbum,
    openArtist,
  } = useMusicData();
  const { playTrack, playTracks } = usePlayer();
  const [activeCategory, setActiveCategory] = useState<"playlists" | "artists" | "albums" | "liked" | "podcasts">("playlists");
  const [searchFilter, setSearchFilter] = useState("");
  const [sortOption, setSortOption] = useState("Recently played");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Determine real or demo pinned items
  const realPinned: LibraryPlaylistItem[] = [
    {
      id: "pin-liked",
      name: "Liked Songs",
      songsCount: likedTracks.length,
      updatedAt: "Updated today",
      icon: "♥",
      gradient: "linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #A855F7 100%)",
    },
    ...playlists.slice(0, 4).map((p) => ({
      id: p.id,
      name: p.name,
      songsCount: p.tracks?.total ?? 0,
      updatedAt: "Updated recently",
      icon: "♫",
      imageUrl: p.images?.[0]?.url,
      uri: p.uri,
    })),
    {
      id: "pin-create",
      name: "Create Playlist",
      songsCount: 0,
      updatedAt: "",
      icon: "+",
    },
  ];

  const realAllPlaylists: LibraryPlaylistItem[] = playlists.map((p, i) => ({
    id: p.id,
    name: p.name,
    songsCount: p.tracks?.total ?? 0,
    updatedAt: i === 0 ? "Updated 2 days ago" : i === 1 ? "Updated 5 days ago" : i < 4 ? "Updated 1 week ago" : "Updated recently",
    icon: "♫",
    imageUrl: p.images?.[0]?.url,
    uri: p.uri,
  }));

  const pinnedSource =
    isAuthenticated && (playlists.length > 0 || likedTracks.length > 0)
      ? realPinned
      : DEFAULT_PINNED_CARDS;

  const allPlaylistsSource =
    isAuthenticated && playlists.length > 0
      ? realAllPlaylists
      : DEFAULT_ALL_PLAYLISTS;

  // Filter items based on search input
  const query = searchFilter.trim().toLowerCase();

  const filteredPinned = pinnedSource.filter((item) =>
    !query || item.name.toLowerCase().includes(query)
  );

  const filteredPlaylists = allPlaylistsSource.filter((item) =>
    !query || item.name.toLowerCase().includes(query)
  );

  return (
    <div className="flex flex-col gap-5 p-3 sm:p-5 pb-32 overflow-y-auto h-full select-none">
      {/* ============================================================ */}
      {/* TOP HEADER: // YOUR LIBRARY + SEARCH BAR */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[13px] text-[#22C55E]">//</span>
            <span
              className="font-pixel text-[13px] text-[#F8FAFC] tracking-wider"
              style={{ textShadow: "0 0 10px rgba(34, 197, 94, 0.4)" }}
            >
              YOUR LIBRARY
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#64748B] mt-1">
            All your music, in one place.
          </span>
        </div>

        {/* Search Bar Input */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] w-full sm:w-64"
          style={{
            backgroundColor: "#070E1A",
            border: "1px solid #16253B",
          }}
        >
          <span className="text-xs text-[#64748B]">🔍</span>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search your library..."
            className="w-full bg-transparent font-mono text-[11px] text-[#E2E8F0] placeholder-[#475569] outline-none"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter("")}
              className="text-xs text-[#64748B] hover:text-[#E2E8F0]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* CATEGORY TABS BAR (PLAYLISTS, ARTISTS, ALBUMS, LIKED, PODCASTS) */}
      {/* ============================================================ */}
      <div
        className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar border-b"
        style={{ borderColor: "#142236" }}
      >
        {[
          { id: "playlists", label: "PLAYLISTS", icon: "≡" },
          { id: "artists", label: "ARTISTS", icon: "👤" },
          { id: "albums", label: "ALBUMS", icon: "◉" },
          { id: "liked", label: "LIKED SONGS", icon: "♡" },
          { id: "podcasts", label: "PODCASTS", icon: "🎙" },
        ].map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (soundFX) playChime("click");
                setActiveCategory(tab.id as typeof activeCategory);
              }}
              className="flex items-center gap-2 pb-2.5 px-1 font-pixel transition-all whitespace-nowrap relative"
              style={{
                fontSize: 8,
                color: isActive ? "#22C55E" : "#64748B",
                textShadow: isActive ? "0 0 8px rgba(34, 197, 94, 0.5)" : "none",
              }}
            >
              <span className="text-[10px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#22C55E]"
                  style={{ boxShadow: "0 0 6px #22C55E" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* SORT & VIEW TOOLBAR */}
      {/* ============================================================ */}
      <div className="flex items-center justify-end gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#64748B]">
          <span>Sort:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-[#070D17] border border-[#16253B] text-[#94A3B8] px-2 py-0.5 rounded-[2px] outline-none cursor-pointer"
          >
            <option value="Recently played">Recently played</option>
            <option value="Alphabetical">Alphabetical</option>
            <option value="Tracks count">Tracks count</option>
          </select>
        </div>

        {/* Grid and List Toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className="w-6 h-6 flex items-center justify-center rounded-[2px] transition-all"
            style={{
              border: viewMode === "grid" ? "1px solid #22C55E" : "1px solid #16253B",
              backgroundColor: viewMode === "grid" ? "rgba(34, 197, 94, 0.15)" : "#070E1A",
              color: viewMode === "grid" ? "#22C55E" : "#64748B",
            }}
            title="Grid View"
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode("list")}
            className="w-6 h-6 flex items-center justify-center rounded-[2px] transition-all"
            style={{
              border: viewMode === "list" ? "1px solid #22C55E" : "1px solid #16253B",
              backgroundColor: viewMode === "list" ? "rgba(34, 197, 94, 0.15)" : "#070E1A",
              color: viewMode === "list" ? "#22C55E" : "#64748B",
            }}
            title="List View"
          >
            ≡
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN VIEW: PLAYLISTS CATEGORY */}
      {/* ============================================================ */}
      {activeCategory === "playlists" && (
        <div className="flex flex-col gap-6">
          {/* SECTION 1: PINNED PLAYLISTS */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-xs text-[#64748B]">📌</span>
              <span className="font-pixel text-[8px] text-[#94A3B8] tracking-wider">
                Pinned
              </span>
            </div>

            {/* 6 Pinned Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {filteredPinned.map((card) => {
                const songs = card.id === "pin-liked" && likedTracks.length > 0 ? likedTracks.length : card.songsCount;
                return (
                  <div
                    key={card.id}
                    className="group flex flex-col p-2 rounded-[2px] cursor-pointer transition-all duration-150 relative hover:border-[#22C55E]"
                    style={{
                      backgroundColor: "#070D17",
                      border: "1px solid #142236",
                    }}
                    onClick={() => {
                      if (soundFX) playChime("click");
                      if (card.id === "pin-liked") {
                        setActiveCategory("liked");
                      } else if (card.id === "pin-create") {
                        const name = prompt("Enter new playlist name:");
                        if (name) alert(`Playlist "${name}" created on PixelFM!`);
                      } else {
                        const matching = playlists.find((p) => p.id === card.id);
                        openPlaylist(card.id, matching);
                      }
                    }}
                  >
                    {/* Cover Art Box */}
                    <div
                      className="relative w-full aspect-square rounded-[2px] overflow-hidden border border-[#162235] mb-2 flex items-center justify-center"
                      style={{
                        background: card.gradient || "#0A0F17",
                      }}
                    >
                      {card.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          style={{ imageRendering: "pixelated" }}
                        />
                      ) : card.id === "pin-liked" ? (
                        <div className="text-3xl text-white select-none animate-pulse">
                          ♥
                        </div>
                      ) : (
                        <span className="text-2xl">{card.icon}</span>
                      )}

                      {/* Hover play badge */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-black text-xs font-bold shadow-md">
                          ▶
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-[11px] font-semibold text-[#F8FAFC] group-hover:text-[#22C55E] transition-colors truncate">
                        {card.name}
                      </span>
                      {card.id !== "pin-create" && (
                        <span className="font-mono text-[9px] text-[#64748B] mt-0.5">
                          {songs} songs
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* In demo mode if pin-create isn't in filteredPinned */}
              {!filteredPinned.some((c) => c.id === "pin-create") && !query && (
                <div
                  className="group flex flex-col p-2 rounded-[2px] cursor-pointer transition-all duration-150 relative border-dashed hover:border-[#22C55E]"
                  style={{
                    backgroundColor: "#070D17",
                    border: "1px dashed #1E293B",
                  }}
                  onClick={() => {
                    if (soundFX) playChime("click");
                    const name = prompt("Enter new playlist name:");
                    if (name) alert(`Playlist "${name}" created on PixelFM!`);
                  }}
                >
                  <div className="relative w-full aspect-square rounded-[2px] bg-[#090E17] border border-[#162235] mb-2 flex items-center justify-center text-2xl text-[#64748B] group-hover:text-[#22C55E] transition-colors">
                    +
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-[11px] font-semibold text-[#64748B] group-hover:text-[#22C55E] transition-colors truncate">
                      Create Playlist
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: ALL PLAYLISTS (2-COLUMN COMPACT LIST OR GRID) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-pixel text-[8px] text-[#22C55E]">≡</span>
              <span className="font-pixel text-[8px] text-[#94A3B8] tracking-wider">
                All Playlists ({filteredPlaylists.length})
              </span>
            </div>

            {/* 2-Column Structured List / Grid */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-2.5" : "flex flex-col gap-2"}>
              {filteredPlaylists.map((pl) => (
                <div
                  key={pl.id}
                  className="group flex items-center justify-between p-2 rounded-[2px] cursor-pointer transition-all duration-150 hover:border-[#22C55E]"
                  style={{
                    backgroundColor: "#070D17",
                    border: "1px solid #142236",
                  }}
                  onClick={() => {
                    if (soundFX) playChime("click");
                    const matching = playlists.find((p) => p.id === pl.id);
                    openPlaylist(pl.id, matching);
                  }}
                >
                  {/* Left: Thumbnail + Title + Songs */}
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <div
                      className="w-11 h-11 rounded-[2px] overflow-hidden border border-[#162235] flex items-center justify-center flex-shrink-0"
                      style={{ background: pl.gradient || "#0A0F17" }}
                    >
                      {pl.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={pl.imageUrl}
                          alt={pl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          style={{ imageRendering: "pixelated" }}
                        />
                      ) : (
                        <span className="text-lg">{pl.icon}</span>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-[11px] font-semibold text-[#F8FAFC] group-hover:text-[#22C55E] transition-colors truncate">
                        {pl.name}
                      </span>
                      <span className="font-mono text-[9px] text-[#64748B] mt-0.5">
                        {pl.songsCount} songs
                      </span>
                    </div>
                  </div>

                  {/* Right: Updated Timestamp + 3-Dots Menu */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="hidden sm:inline font-mono text-[9px] text-[#64748B]">
                      {pl.updatedAt}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (soundFX) playChime("click");
                        const matching = playlists.find((p) => p.id === pl.id);
                        openPlaylist(pl.id, matching);
                      }}
                      className="text-[#64748B] hover:text-[#22C55E] px-1 text-sm font-bold transition-colors"
                      title="View Details"
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* OTHER CATEGORY VIEWS: ARTISTS, ALBUMS, LIKED SONGS, PODCASTS */}
      {/* ============================================================ */}
      {activeCategory === "artists" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {topArtists.map((artist) => (
            <div
              key={artist.id}
              className="card-pixel p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-[#22C55E] transition-all group text-center"
              style={{ backgroundColor: "#070D17" }}
              onClick={() => {
                if (soundFX) playChime("click");
                openArtist(artist.id, artist);
              }}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#162235] group-hover:border-[#22C55E] transition-all">
                {artist.images?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#162032] flex items-center justify-center text-xl">
                    👤
                  </div>
                )}
              </div>
              <span className="font-mono text-xs text-[#F8FAFC] truncate w-full">
                {artist.name}
              </span>
              <span className="font-pixel text-[6px] text-[#22C55E]">
                ARTIST
              </span>
            </div>
          ))}
        </div>
      )}

      {activeCategory === "albums" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {albums.map((album) => (
            <div
              key={album.id}
              className="card-pixel p-2.5 flex flex-col gap-2 cursor-pointer hover:border-[#22C55E] transition-all group"
              style={{ backgroundColor: "#070D17" }}
              onClick={() => {
                if (soundFX) playChime("click");
                openAlbum(album.id, album);
              }}
            >
              <div className="relative w-full aspect-square bg-[#0A0F17] border border-[#162235] flex items-center justify-center overflow-hidden">
                {album.images?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={album.images[0].url}
                    alt={album.name}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <span className="text-2xl">💽</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="font-pixel text-xs text-[#22C55E]">▶ VIEW</span>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-xs text-[#F8FAFC] truncate">
                  {album.name}
                </span>
                <span className="font-mono text-[10px] text-[#64748B] truncate">
                  {album.artists?.[0]?.name || "Artist"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeCategory === "liked" && (
        <div className="flex flex-col gap-3">
          <div
            className="p-3.5 flex items-center justify-between cursor-pointer rounded-[2px]"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #22C55E",
            }}
            onClick={() => {
              if (soundFX) playChime("click");
              if (likedTracks.length > 0) {
                playTrack(likedTracks[0], likedTracks);
              }
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl text-[#EC4899]">♥</span>
              <div className="flex flex-col">
                <span className="font-pixel text-[9px] text-[#F8FAFC]">
                  PLAY ALL LIKED SONGS
                </span>
                <span className="font-mono text-[10px] text-[#64748B]">
                  {likedTracks.length} tracks in your library
                </span>
              </div>
            </div>
            <span className="font-pixel text-[8px] text-[#22C55E] px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E] rounded-[2px]">
              ▶ PLAY ALL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {likedTracks.slice(0, 50).map((track, idx) => (
              <div
                key={track.id}
                className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[#0B1320] border border-[#142236] hover:border-[#22C55E] transition-all rounded-[2px]"
                onClick={() => {
                  if (soundFX) playChime("click");
                  playTrack(track, likedTracks);
                }}
              >
                <span className="font-mono text-[10px] text-[#64748B] w-5 text-right">
                  {idx + 1}
                </span>
                {track.album?.images?.[0]?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={track.album.images[0].url}
                    alt=""
                    className="w-9 h-9 object-cover rounded-[2px] flex-shrink-0"
                    style={{ imageRendering: "pixelated" }}
                  />
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-mono text-xs text-[#F8FAFC] truncate">
                    {track.name}
                  </span>
                  <span className="font-mono text-[10px] text-[#64748B] truncate">
                    {track.artists?.map((a) => a?.name || "").filter(Boolean).join(", ")}
                  </span>
                </div>
                <span className="text-xs text-[#22C55E]">▶</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeCategory === "podcasts" && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-4xl">🎙</span>
          <span className="font-pixel text-[9px] text-[#94A3B8]">
            NO PODCASTS IN LIBRARY YET
          </span>
          <span className="font-mono text-xs text-[#64748B] text-center max-w-sm">
            Subscribe to shows and episodes on Spotify and they will tune in here automatically.
          </span>
        </div>
      )}
    </div>
  );
}

function SearchView({ soundFX }: { soundFX: boolean }) {
  const {
    searchQuery,
    setSearchQuery,
    runSearch,
    searchResults,
    isSearching,
    clearSearch,
    openPlaylist,
    openAlbum,
    openArtist,
  } = useMusicData();
  const { playTrack } = usePlayer();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [activeFilter, setActiveFilter] = useState<"all" | "tracks" | "artists" | "albums" | "playlists">("all");

  // Debounced auto-search
  useEffect(() => {
    if (!inputValue.trim()) return;
    const timer = setTimeout(() => {
      runSearch(inputValue);
      setSearchQuery(inputValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, runSearch, setSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundFX) playChime("click");
    if (inputValue.trim()) {
      runSearch(inputValue);
      setSearchQuery(inputValue);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-5 pb-32 overflow-y-auto h-full select-none">
      {/* Search Header Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-[2px]"
          style={{
            backgroundColor: "#070E1A",
            border: "1px solid #16253B",
          }}
        >
          <span className="text-xs text-[#64748B]">🔍</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search tracks, artists, albums, or playlists..."
            className="w-full bg-transparent font-mono text-xs text-[#E2E8F0] placeholder-[#475569] outline-none"
          />
        </div>

        <button
          type="submit"
          className="btn-pixel btn-pixel-phosphor"
          style={{ padding: "8px 16px", fontSize: 8 }}
          disabled={isSearching}
        >
          {isSearching ? "..." : "SEARCH"}
        </button>

        {inputValue && (
          <button
            type="button"
            className="btn-pixel"
            onClick={() => {
              clearSearch();
              setInputValue("");
            }}
            style={{ padding: "8px 12px", fontSize: 8 }}
          >
            ✕
          </button>
        )}
      </form>

      {/* Category Filter Chips */}
      {searchResults && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "all", label: "ALL" },
            { id: "tracks", label: `TRACKS (${searchResults.tracks.length})` },
            { id: "artists", label: `ARTISTS (${searchResults.artists.length})` },
            { id: "albums", label: `ALBUMS (${searchResults.albums.length})` },
            { id: "playlists", label: `PLAYLISTS (${searchResults.playlists.length})` },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => {
                if (soundFX) playChime("click");
                setActiveFilter(chip.id as typeof activeFilter);
              }}
              className="font-pixel text-[7px] px-2.5 py-1 rounded-[2px] transition-all whitespace-nowrap"
              style={{
                border: activeFilter === chip.id ? "1px solid #22C55E" : "1px solid #142236",
                backgroundColor: activeFilter === chip.id ? "rgba(34, 197, 94, 0.12)" : "#070E1A",
                color: activeFilter === chip.id ? "#22C55E" : "#64748B",
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Results Container */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-6">
        {searchResults && (
          <>
            {/* Tracks */}
            {(activeFilter === "all" || activeFilter === "tracks") && searchResults.tracks.length > 0 && (
              <div>
                <div className="font-pixel text-[8px] text-[#22C55E] mb-2 pb-1 border-b border-[#142236]">
                  TRACKS ({searchResults.tracks.length})
                </div>
                <div className="flex flex-col gap-1">
                  {searchResults.tracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[#070E1A] border border-transparent hover:border-[#22C55E]/40 transition-all rounded-[2px] group"
                      onClick={() => {
                        if (soundFX) playChime("click");
                        playTrack(track, searchResults.tracks);
                      }}
                    >
                      {track.album?.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={track.album.images[0].url}
                          alt=""
                          className="w-10 h-10 object-cover flex-shrink-0 rounded-[2px]"
                          style={{ imageRendering: "pixelated", border: "1px solid #142236" }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-[#0A0F17] flex items-center justify-center text-[#22C55E] text-sm flex-shrink-0 rounded-[2px]">
                          ♫
                        </div>
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-mono text-xs text-[#F8FAFC] group-hover:text-[#22C55E] truncate">
                          {track.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#64748B] truncate">
                          {track.artists?.map((a) => a?.name || "").filter(Boolean).join(", ") || "Unknown Artist"}
                        </span>
                      </div>
                      <span className="btn-pixel text-[#22C55E] border-[#22C55E]/40 group-hover:border-[#22C55E] text-[7px] px-2 py-1 flex-shrink-0">
                        ▶ PLAY
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artists */}
            {(activeFilter === "all" || activeFilter === "artists") && searchResults.artists.length > 0 && (
              <div>
                <div className="font-pixel text-[8px] text-[#38BDF8] mb-2 pb-1 border-b border-[#142236]">
                  ARTISTS ({searchResults.artists.length})
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {searchResults.artists.map((artist) => (
                    <div
                      key={artist.id}
                      className="p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-[#38BDF8] border border-[#142236] bg-[#070D17] transition-all rounded-[2px] group text-center"
                      onClick={() => {
                        if (soundFX) playChime("click");
                        openArtist(artist.id, artist);
                      }}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-[#162235] group-hover:border-[#38BDF8] transition-all">
                        {artist.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={artist.images[0].url}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                            style={{ imageRendering: "pixelated" }}
                          />
                        ) : (
                          <div className="w-full h-full bg-[#162032] flex items-center justify-center text-xl">
                            👤
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-xs text-[#F8FAFC] group-hover:text-[#38BDF8] truncate w-full">
                        {artist.name}
                      </span>
                      <span className="font-pixel text-[6px] text-[#38BDF8]">
                        VIEW ARTIST
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Albums */}
            {(activeFilter === "all" || activeFilter === "albums") && searchResults.albums.length > 0 && (
              <div>
                <div className="font-pixel text-[8px] text-[#F59E0B] mb-2 pb-1 border-b border-[#142236]">
                  ALBUMS ({searchResults.albums.length})
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {searchResults.albums.map((album) => (
                    <div
                      key={album.id}
                      className="p-2 flex items-center gap-2.5 cursor-pointer border border-[#142236] hover:border-[#F59E0B] bg-[#070D17] transition-all rounded-[2px] group"
                      onClick={() => {
                        if (soundFX) playChime("click");
                        openAlbum(album.id, album);
                      }}
                    >
                      {album.images?.[0]?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={album.images[0].url}
                          alt=""
                          className="w-11 h-11 object-cover flex-shrink-0 rounded-[2px]"
                          style={{ imageRendering: "pixelated" }}
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-xs text-[#F8FAFC] group-hover:text-[#F59E0B] truncate">
                          {album.name}
                        </span>
                        <span className="font-mono text-[9px] text-[#64748B] truncate">
                          {album.artists?.[0]?.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playlists */}
            {(activeFilter === "all" || activeFilter === "playlists") && searchResults.playlists.length > 0 && (
              <div>
                <div className="font-pixel text-[8px] text-[#EC4899] mb-2 pb-1 border-b border-[#142236]">
                  PLAYLISTS ({searchResults.playlists.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {searchResults.playlists.map((pl) => (
                    <div
                      key={pl.id}
                      className="p-2 flex items-center gap-2.5 cursor-pointer border border-[#142236] hover:border-[#EC4899] bg-[#070D17] transition-all rounded-[2px] group"
                      onClick={() => {
                        if (soundFX) playChime("click");
                        openPlaylist(pl.id, pl);
                      }}
                    >
                      {pl.images?.[0]?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={pl.images[0].url}
                          alt=""
                          className="w-11 h-11 object-cover flex-shrink-0 rounded-[2px]"
                          style={{ imageRendering: "pixelated" }}
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-xs text-[#F8FAFC] group-hover:text-[#EC4899] truncate">
                          {pl.name}
                        </span>
                        <span className="font-mono text-[9px] text-[#64748B]">
                          {pl.tracks?.total ?? 0} tracks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state when no search yet */}
        {!searchResults && !isSearching && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="font-pixel text-[8px] text-[#64748B]">
              TYPE AN ARTIST, ALBUM, OR SONG TO EXPLORE SPOTIFY
            </span>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {["Daft Punk", "Lofi Beats", "Synthwave", "Cyberpunk", "City Pop", "Retrowave"].map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setInputValue(genre);
                    runSearch(genre);
                    setSearchQuery(genre);
                  }}
                  className="font-pixel text-[7px] px-3 py-1.5 bg-[#070E1A] border border-[#142236] text-[#94A3B8] hover:text-[#22C55E] hover:border-[#22C55E] rounded-[2px] transition-colors"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlayerPage() {
  const router = useRouter();
  const { isAuthenticated, isDemoMode, isLoading } = useAuth();
  const { currentTrack } = usePlayer();
  const { activeDetail, closeDetail, openAlbum } = useMusicData();
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [soundFX, setSoundFX] = useState(true);
  const [currentView, setCurrentView] = useState<NavView>("home");

  // Redirect unauthenticated non-demo users to landing
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isDemoMode) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, isDemoMode, router]);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center h-[100dvh]"
        style={{ backgroundColor: "var(--color-void)" }}
      >
        <div className="font-pixel text-[9px] text-[var(--color-phosphor)] animate-blink">
          INITIALIZING...
        </div>
      </div>
    );
  }

  const renderMainContent = () => {
    // 1. If an active detail view is open, render it first!
    if (activeDetail) {
      if (activeDetail.type === "playlist") {
        return (
          <PlaylistDetailView
            playlistId={activeDetail.id}
            initialPlaylist={activeDetail.data}
            onBack={closeDetail}
            soundFX={soundFX}
          />
        );
      }
      if (activeDetail.type === "album") {
        return (
          <AlbumDetailView
            albumId={activeDetail.id}
            initialAlbum={activeDetail.data}
            onBack={closeDetail}
            soundFX={soundFX}
          />
        );
      }
      if (activeDetail.type === "artist") {
        return (
          <ArtistDetailView
            artistId={activeDetail.id}
            initialArtist={activeDetail.data}
            onBack={closeDetail}
            soundFX={soundFX}
            onSelectAlbum={(alb) => openAlbum(alb.id, alb)}
          />
        );
      }
    }

    switch (currentView) {
      case "library":
        return <LibraryView soundFX={soundFX} />;
      case "discover":
        return <DiscoverView soundFX={soundFX} />;
      case "search":
        return <SearchView soundFX={soundFX} />;
      case "deck":
        return (
          <div className="flex flex-col items-center gap-3 p-3 pb-32 overflow-y-auto h-full w-full">
            <div className="w-full max-w-[380px]">
              <PixelCat />
            </div>
            <div className="w-full max-w-[380px]">
              <NowPlayingDeck
                soundFX={soundFX}
                onClose={() => setCurrentView("library")}
              />
            </div>
          </div>
        );
      case "settings":
        return (
          <SettingsPanel
            crtEnabled={crtEnabled}
            onToggleCRT={() => setCrtEnabled((v) => !v)}
            soundFX={soundFX}
            onToggleSoundFX={() => setSoundFX((v) => !v)}
          />
        );
      default: // home
        return <HomeView soundFX={soundFX} onNavigate={setCurrentView} />;
    }
  };

  return (
    <ErrorBoundary>
      <CRTOverlay enabled={crtEnabled} />

      <div
        className="flex flex-col h-[100dvh] overflow-hidden"
        style={{ backgroundColor: "var(--color-void)" }}
      >
        {/* Top Bar */}
        <TopBar
          crtEnabled={crtEnabled}
          onToggleCRT={() => {
            if (soundFX) playChime("click");
            setCrtEnabled((v) => !v);
          }}
          soundFX={soundFX}
        />

        {/* Main Station Layout */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Sidebar: Desktop vertical rail + Mobile bottom dock */}
          <Sidebar
            currentView={currentView}
            onNavigate={(v) => {
              if (activeDetail) closeDetail();
              setCurrentView(v);
            }}
            soundFX={soundFX}
          />

          {/* Center + Right Deck */}
          <div
            className="flex-1 overflow-hidden flex flex-col"
            style={{ position: "relative" }}
          >
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              {/* Center Panel (Home / Library / Search / Discover / Detail / Settings) */}
              <div className="flex-1 overflow-hidden">
                {renderMainContent()}
              </div>

              {/* Right Panel: Cat + Now Playing Deck (Persistent on desktop >= lg) */}
              <div
                className="hidden lg:flex flex-col items-center justify-start gap-3 p-3 overflow-y-auto"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  minWidth: 310,
                  borderLeft: "1px solid #142236",
                  backgroundColor: "#050911",
                  flexShrink: 0,
                }}
              >
                {/* Pixel Cat Module with screws */}
                <PixelCat />

                {/* Now Playing Deck Module with screws */}
                <NowPlayingDeck soundFX={soundFX} />
              </div>
            </div>

            {/* Collapsible Queue Drawer (Desktop >= md) */}
            <div className="hidden md:block">
              <QueueDrawer soundFX={soundFX} />
            </div>
          </div>
        </div>

        {/* Mobile Persistent Mini-Player (floating above bottom navigation dock) */}
        {currentTrack && currentView !== "deck" && (
          <MiniPlayer
            onOpenDeck={() => setCurrentView("deck")}
            soundFX={soundFX}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
