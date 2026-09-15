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

import { playChime } from "@/lib/audioEngine";

// ============================================================
// Main Player Views
// ============================================================

type NavView = "home" | "library" | "search" | "settings";

function HomeView({
  soundFX,
  onNavigate,
}: {
  soundFX: boolean;
  onNavigate: (v: NavView) => void;
}) {
  const { playlists, recentlyPlayed, likedTracks, isLoadingLibrary, refreshLibrary, libraryError } =
    useMusicData();
  const { playContext, playTracks, isReady, externalDevice } = usePlayer();

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto h-full">
      {/* Device connection banner */}
      <DeviceManager soundFX={soundFX} />

      {/* Top Welcome / Status Bar */}
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
              ? "WEB STATION AUDIO READY"
              : externalDevice
              ? `CONNECT SYNC: ${externalDevice.device.name}`
              : "SPOTIFY READY — SELECT MUSIC"}
          </span>
        </div>
        <button
          onClick={() => {
            if (soundFX) playChime("click");
            refreshLibrary();
          }}
          className="btn-pixel"
          style={{ padding: "4px 8px", fontSize: 7 }}
          title="Refresh Spotify Library"
        >
          {isLoadingLibrary ? "SYNCING..." : "↺ SYNC"}
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

      {/* Quick Launch: Playlists */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-1 border-b" style={{ borderColor: "var(--color-border)" }}>
          <span className="font-pixel text-[8px] text-[var(--color-phosphor)] tracking-wider">
            ♫ MY PLAYLISTS ({playlists.length})
          </span>
          <button
            onClick={() => onNavigate("library")}
            className="font-pixel text-[7px] text-[var(--color-text-dim)] hover:text-[var(--color-phosphor)]"
          >
            VIEW ALL ➔
          </button>
        </div>

        {isLoadingLibrary && playlists.length === 0 ? (
          <div className="font-pixel text-[8px] text-[var(--color-text-dim)] p-4 text-center animate-blink">
            LOADING SPOTIFY PLAYLISTS...
          </div>
        ) : playlists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {playlists.slice(0, 6).map((pl) => (
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
                    {pl.tracks.total} tracks
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="p-4 flex flex-col items-center gap-2 text-center"
            style={{ backgroundColor: "var(--color-surface)", border: "1px dashed var(--color-border)" }}
          >
            <span className="font-pixel text-[8px] text-[var(--color-text-dim)]">
              NO PLAYLISTS DETECTED ON ACCOUNT
            </span>
            <button
              onClick={() => onNavigate("search")}
              className="btn-pixel btn-pixel-phosphor mt-1"
              style={{ padding: "6px 12px", fontSize: 8 }}
            >
              SEARCH SPOTIFY CATALOG ➔
            </button>
          </div>
        )}
      </div>

      {/* Liked Songs Quick Bar */}
      {likedTracks.length > 0 && (
        <div
          className="p-3 flex items-center justify-between cursor-pointer hover:border-[var(--color-phosphor)] transition-all"
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
                LIKED SONGS COLLECTION
              </span>
              <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)]">
                {likedTracks.length} tracks saved in your library
              </span>
            </div>
          </div>
          <span className="btn-pixel btn-pixel-phosphor" style={{ padding: "4px 10px", fontSize: 8 }}>
            ▶ PLAY ALL
          </span>
        </div>
      )}

      {/* Recently Played List */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-1 border-b" style={{ borderColor: "var(--color-border)" }}>
          <span className="font-pixel text-[8px] text-[var(--color-amber)] tracking-wider">
            ◉ RECENTLY PLAYED
          </span>
        </div>

        {recentlyPlayed.length > 0 ? (
          <div className="flex flex-col gap-1">
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
                    {track.name}
                  </span>
                  <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)] truncate">
                    {track.artists.map((a) => a.name).join(", ")}
                  </span>
                </div>
                <span className="font-pixel text-[8px] text-[var(--color-phosphor)] flex-shrink-0">
                  ▶
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="font-mono-retro text-[11px] text-[var(--color-text-dim)] p-2">
            No recent listening history yet. Play any track or playlist above!
          </div>
        )}
      </div>
    </div>
  );
}

function LibraryView({ soundFX }: { soundFX: boolean }) {
  const { playlists, likedTracks, isLoadingLibrary } = useMusicData();
  const { playContext, playTracks } = usePlayer();

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
      {/* Liked Songs Banner */}
      <div>
        <div
          className="font-pixel text-[8px] text-[var(--color-phosphor)] mb-2 pb-1"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          ♥ LIKED SONGS ({likedTracks.length})
        </div>
        {likedTracks.length > 0 ? (
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
        ) : (
          <div className="font-mono-retro text-xs text-[var(--color-text-dim)] p-2">
            No liked songs found on this Spotify account.
          </div>
        )}
      </div>

      {/* Playlists */}
      <div>
        <div
          className="font-pixel text-[8px] text-[var(--color-phosphor)] mb-2 pb-1"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          ♫ ALL PLAYLISTS ({playlists.length})
        </div>
        {playlists.length === 0 ? (
          <div className="font-mono-retro text-xs text-[var(--color-text-dim)] p-2">
            No playlists found. Create one in Spotify or search below!
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
                    {pl.name}
                  </span>
                  <span
                    className="font-mono-retro"
                    style={{ fontSize: 10, color: "var(--color-text-dim)" }}
                  >
                    {pl.tracks.total} tracks · {pl.owner?.display_name || "Spotify"}
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
                      onDoubleClick={() => playTracks([track.uri])}
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
                          {track.artists.map((a) => a.name).join(", ")}
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
                          {pl.tracks.total} tracks
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
            <div className="flex gap-2">
              {["Daft Punk", "Lofi Beats", "Synthwave", "Cyberpunk"].map((genre) => (
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
    <>
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
    </>
  );
}
