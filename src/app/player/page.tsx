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

import { playChime } from "@/lib/audioEngine";
import { SpotifyAlbum, SpotifyPlaylist, SpotifyTrack, SpotifyArtist } from "@/lib/spotify";

// ============================================================
// Main Player Views — Personalized Station
// ============================================================

type NavView = "home" | "library" | "search" | "settings";
type HomeCategory = "all" | "radios" | "albums" | "top" | "playlists" | "releases";

function HomeView({
  soundFX,
  onNavigate,
}: {
  soundFX: boolean;
  onNavigate: (v: NavView) => void;
}) {
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
  } = useMusicData();

  const { playContext, playTracks, isReady, externalDevice } = usePlayer();
  const [selectedCategory, setSelectedCategory] = useState<HomeCategory>("all");
  const [loadingRadioSeed, setLoadingRadioSeed] = useState<string | null>(null);

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
        // Fallback: search tracks by artist
        const res = await playContext(artist.uri);
        return res;
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
    <div className="flex flex-col gap-6 p-4 overflow-y-auto h-full">
      {/* Device Connection Banner */}
      <DeviceManager soundFX={soundFX} />

      {/* Top Station Status & Refresh */}
      <div
        className="flex items-center justify-between p-3"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "2px solid var(--color-elevated)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="led-dot"
            style={{
              width: 8,
              height: 8,
              backgroundColor: isReady ? "#22C55E" : externalDevice ? "#F59E0B" : "#334155",
              boxShadow: isReady ? "0 0 6px #22C55E" : externalDevice ? "0 0 6px #F59E0B" : "none",
            }}
          />
          <span className="font-pixel text-[9px] text-[var(--color-text-primary)]">
            {isReady
              ? "STATION AUDIO SYNTH ONLINE"
              : externalDevice
              ? `SYNCED: ${externalDevice.device.name}`
              : "PERSONALIZED DECK READY"}
          </span>
        </div>
        <button
          onClick={() => {
            if (soundFX) playChime("click");
            refreshLibrary();
          }}
          className="btn-pixel"
          style={{ padding: "4px 10px", fontSize: 7 }}
          title="Sync latest Spotify personalized content"
        >
          {isLoadingLibrary ? "SYNCING..." : "↺ REFRESH"}
        </button>
      </div>

      {libraryError && (
        <div
          className="font-mono-retro text-xs p-2"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid #EF4444",
            color: "#FCA5A5",
          }}
        >
          Notice: {libraryError}
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: "all", label: "★ ALL STATIONS" },
          { id: "radios", label: "📻 RADIO & MIXES" },
          { id: "albums", label: "💽 ALBUMS" },
          { id: "top", label: "🔥 TOP ROTATION" },
          { id: "playlists", label: "♫ PLAYLISTS" },
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
              className="font-pixel transition-all whitespace-nowrap"
              style={{
                fontSize: 8,
                padding: "6px 12px",
                border: active ? "1px solid var(--color-phosphor)" : "1px solid var(--color-border)",
                backgroundColor: active ? "rgba(34,197,94,0.15)" : "var(--color-surface)",
                color: active ? "var(--color-phosphor)" : "var(--color-text-secondary)",
                boxShadow: active ? "0 0 8px rgba(34,197,94,0.3)" : "none",
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
                    playContext(album.uri);
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
                    playTracks([track.uri]);
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
                    playContext(pl.uri);
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
                  playContext(album.uri);
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

            {featuredPlaylists.slice(0, 6).map((pl) => (
              <div
                key={pl.id}
                className="card-pixel p-2 flex flex-col gap-2 cursor-pointer hover:border-[var(--color-amber)] transition-all group"
                onClick={() => {
                  if (soundFX) playChime("click");
                  playContext(pl.uri);
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
                    <span className="font-pixel text-xs text-[var(--color-amber)]">▶ TUNE</span>
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
                  playTracks([track.uri]);
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

function LibraryView({ soundFX }: { soundFX: boolean }) {
  const { playlists, likedTracks, albums, isLoadingLibrary } = useMusicData();
  const { playContext, playTracks } = usePlayer();
  const [tab, setTab] = useState<"all" | "playlists" | "albums" | "liked">("all");

  if (isLoadingLibrary && playlists.length === 0 && likedTracks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="font-pixel text-[9px] text-[var(--color-text-dim)] animate-blink">
          LOADING SPOTIFY LIBRARY...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto h-full">
      {/* Filter Tabs */}
      <div className="flex gap-2 pb-1 border-b border-[var(--color-border)]">
        {[
          { id: "all", label: "ALL" },
          { id: "playlists", label: `PLAYLISTS (${playlists.length})` },
          { id: "albums", label: `ALBUMS (${albums.length})` },
          { id: "liked", label: `LIKED (${likedTracks.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              if (soundFX) playChime("click");
              setTab(t.id as "all" | "playlists" | "albums" | "liked");
            }}
            className="font-pixel text-[8px] px-3 py-1.5 transition-all"
            style={{
              backgroundColor: tab === t.id ? "rgba(34,197,94,0.15)" : "transparent",
              color: tab === t.id ? "var(--color-phosphor)" : "var(--color-text-dim)",
              border: tab === t.id ? "1px solid var(--color-phosphor)" : "1px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Liked Songs */}
      {(tab === "all" || tab === "liked") && likedTracks.length > 0 && (
        <div>
          <div
            className="font-pixel text-[8px] text-[var(--color-phosphor)] mb-2 pb-1"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            ♥ LIKED SONGS ({likedTracks.length})
          </div>
          <button
            className="btn-pixel btn-pixel-phosphor w-full"
            style={{ padding: "8px 16px", fontSize: 8, justifyContent: "center" }}
            onClick={() => {
              if (soundFX) playChime("click");
              playTracks(likedTracks.map((t) => t.uri));
            }}
          >
            ▶ PLAY ALL {likedTracks.length} LIKED SONGS
          </button>
        </div>
      )}

      {/* Albums */}
      {(tab === "all" || tab === "albums") && albums.length > 0 && (
        <div>
          <div
            className="font-pixel text-[8px] text-[var(--color-phosphor)] mb-2 pb-1"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            💽 SAVED ALBUMS ({albums.length})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {albums.map((album) => (
              <div
                key={album.id}
                className="card-pixel p-2.5 flex flex-col gap-2 cursor-pointer hover:border-[var(--color-phosphor)] transition-all group"
                onClick={() => {
                  if (soundFX) playChime("click");
                  playContext(album.uri);
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
                    <span className="text-2xl">💽</span>
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
        </div>
      )}

      {/* Playlists */}
      {(tab === "all" || tab === "playlists") && (
        <div>
          <div
            className="font-pixel text-[8px] text-[var(--color-phosphor)] mb-2 pb-1"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            ♫ ALL PLAYLISTS ({playlists.length})
          </div>
          {playlists.length === 0 ? (
            <div className="font-mono-retro text-xs text-[var(--color-text-dim)] p-2">
              No playlists found.
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="flex items-center gap-3 p-2 cursor-pointer transition-all hover:border-[var(--color-phosphor)]"
                  style={{
                    backgroundColor: "var(--color-void)",
                    border: "1px solid var(--color-border)",
                  }}
                  onClick={() => {
                    if (soundFX) playChime("click");
                    playContext(pl.uri);
                  }}
                >
                  {pl.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pl.images[0].url}
                      alt={pl.name}
                      style={{
                        width: 44,
                        height: 44,
                        imageRendering: "pixelated",
                        border: "1px solid var(--color-border)",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        backgroundColor: "var(--color-elevated)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      ♫
                    </div>
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span
                      className="font-mono-retro truncate"
                      style={{ fontSize: 12, color: "var(--color-text-primary)" }}
                    >
                      {pl?.name || "Untitled Playlist"}
                    </span>
                    <span
                      className="font-mono-retro"
                      style={{ fontSize: 10, color: "var(--color-text-dim)" }}
                    >
                      {pl?.tracks?.total ?? 0} tracks · {pl?.owner?.display_name || "Spotify"}
                    </span>
                  </div>
                  <span
                    className="font-pixel"
                    style={{ fontSize: 10, color: "var(--color-phosphor)", flexShrink: 0 }}
                  >
                    ▶
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchView({ soundFX }: { soundFX: boolean }) {
  const { searchQuery, setSearchQuery, runSearch, searchResults, isSearching, clearSearch } =
    useMusicData();
  const { playTracks, playContext } = usePlayer();
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundFX) playChime("click");
    runSearch(inputValue);
    setSearchQuery(inputValue);
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="SEARCH ARTIST, SONG, OR PLAYLIST..."
          className="flex-1 font-mono-retro"
          style={{
            backgroundColor: "var(--color-void)",
            border: "2px solid var(--color-elevated)",
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--color-text-primary)",
            outline: "none",
          }}
        />
        <button
          type="submit"
          className="btn-pixel btn-pixel-phosphor"
          style={{ padding: "8px 16px", fontSize: 8 }}
          disabled={isSearching}
        >
          {isSearching ? "..." : "SEARCH"}
        </button>
        {searchResults && (
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

      <div className="overflow-y-auto flex-1">
        {searchResults && (
          <>
            {searchResults.tracks.length > 0 && (
              <div className="mb-6">
                <div
                  className="font-pixel text-[8px] text-[var(--color-amber)] mb-2 pb-1"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  TRACKS ({searchResults.tracks.length})
                </div>
                <div className="flex flex-col gap-1">
                  {searchResults.tracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[var(--color-surface)] border border-transparent hover:border-[var(--color-elevated)] transition-all"
                      onClick={() => {
                        if (soundFX) playChime("click");
                        playTracks([track.uri]);
                      }}
                    >
                      {track.album?.images?.[0]?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={track.album.images[0].url}
                          alt=""
                          className="w-10 h-10 object-cover flex-shrink-0"
                          style={{ imageRendering: "pixelated", border: "1px solid var(--color-border)" }}
                        />
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-mono-retro text-xs text-[var(--color-text-primary)] truncate">
                          {track.name}
                        </span>
                        <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)] truncate">
                          {track.artists?.map((a) => a?.name || "").filter(Boolean).join(", ") || "Unknown Artist"}
                        </span>
                      </div>
                      <span className="btn-pixel" style={{ padding: "4px 8px", fontSize: 8, flexShrink: 0 }}>
                        ▶ PLAY
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.albums && searchResults.albums.length > 0 && (
              <div className="mb-6">
                <div
                  className="font-pixel text-[8px] text-[var(--color-phosphor)] mb-2 pb-1"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  ALBUMS ({searchResults.albums.length})
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {searchResults.albums.map((album) => (
                    <div
                      key={album.id}
                      className="card-pixel p-2 flex items-center gap-2 cursor-pointer hover:border-[var(--color-phosphor)] transition-all"
                      onClick={() => {
                        if (soundFX) playChime("click");
                        playContext(album.uri);
                      }}
                    >
                      {album.images?.[0]?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={album.images[0].url}
                          alt=""
                          className="w-10 h-10 object-cover flex-shrink-0"
                          style={{ imageRendering: "pixelated" }}
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono-retro text-xs text-[var(--color-text-primary)] truncate">
                          {album.name}
                        </span>
                        <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)] truncate">
                          {album.artists?.[0]?.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.playlists.length > 0 && (
              <div>
                <div
                  className="font-pixel text-[8px] text-[var(--color-amber)] mb-2 pb-1"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  PLAYLISTS ({searchResults.playlists.length})
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {searchResults.playlists.map((pl) => (
                    <div
                      key={pl.id}
                      className="card-pixel p-2 flex items-center gap-2 cursor-pointer hover:border-[var(--color-phosphor)] transition-all"
                      onClick={() => {
                        if (soundFX) playChime("click");
                        playContext(pl.uri);
                      }}
                    >
                      {pl.images?.[0]?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={pl.images[0].url}
                          alt=""
                          className="w-10 h-10 object-cover flex-shrink-0"
                          style={{ imageRendering: "pixelated" }}
                        />
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono-retro text-xs text-[var(--color-text-primary)] truncate">
                          {pl.name}
                        </span>
                        <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)]">
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

        {!searchResults && !isSearching && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <span className="font-pixel text-[8px] text-[var(--color-text-dim)]">
              TYPE AN ARTIST, ALBUM, OR SONG TO EXPLORE
            </span>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Daft Punk", "Lofi Beats", "Synthwave", "Cyberpunk", "City Pop", "Retrowave"].map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setInputValue(genre);
                    runSearch(genre);
                  }}
                  className="btn-pixel"
                  style={{ padding: "4px 8px", fontSize: 7 }}
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
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "var(--color-void)" }}
      >
        <div className="font-pixel text-[9px] text-[var(--color-phosphor)] animate-blink">
          INITIALIZING...
        </div>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (currentView) {
      case "library":
        return <LibraryView soundFX={soundFX} />;
      case "search":
        return <SearchView soundFX={soundFX} />;
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
        className="flex flex-col h-screen"
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
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            soundFX={soundFX}
          />

          {/* Center + Right Deck */}
          <div
            className="flex-1 overflow-hidden flex flex-col"
            style={{ position: "relative" }}
          >
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              {/* Center Panel (Home / Library / Search / Settings) */}
              <div className="flex-1 overflow-hidden">
                {renderMainContent()}
              </div>

              {/* Right Panel: Cat + Now Playing Deck */}
              <div
                className="flex flex-col items-center justify-start gap-4 p-4 overflow-y-auto"
                style={{
                  width: "100%",
                  maxWidth: 420,
                  minWidth: 320,
                  borderLeft: "2px solid var(--color-elevated)",
                  backgroundColor: "var(--color-surface)",
                  flexShrink: 0,
                }}
              >
                {/* Pixel Cat */}
                <div
                  className="w-full flex items-center justify-center py-2"
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <PixelCat />
                </div>

                {/* Now Playing Deck */}
                <NowPlayingDeck soundFX={soundFX} />
              </div>
            </div>

            {/* Collapsible Queue Drawer */}
            <QueueDrawer soundFX={soundFX} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
