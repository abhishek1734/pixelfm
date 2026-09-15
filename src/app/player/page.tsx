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
// Main Player View
// ============================================================

type NavView = "home" | "library" | "search" | "settings";

function LibraryView({ soundFX }: { soundFX: boolean }) {
  const { playlists, likedTracks, isLoadingLibrary } = useMusicData();
  const { playContext, playTracks } = usePlayer();

  if (isLoadingLibrary) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="font-pixel text-[9px] text-[var(--color-text-dim)] animate-blink">
          LOADING LIBRARY...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-full">
      {/* Liked Songs */}
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
            if (likedTracks.length > 0) playTracks(likedTracks.map((t) => t.uri));
          }}
        >
          ▶ PLAY ALL LIKED SONGS
        </button>
      </div>

      {/* Playlists */}
      <div>
        <div
          className="font-pixel text-[8px] text-[var(--color-phosphor)] mb-2 pb-1"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          ♫ PLAYLISTS ({playlists.length})
        </div>
        <div className="flex flex-col gap-1">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              className="flex items-center gap-3 p-2 cursor-pointer transition-all"
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
                    width: 40,
                    height: 40,
                    imageRendering: "pixelated",
                    border: "1px solid var(--color-border)",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
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
              <div className="flex flex-col min-w-0">
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
                  {pl.tracks.total} tracks · {pl.owner.display_name}
                </span>
              </div>
              <span
                className="ml-auto font-pixel"
                style={{ fontSize: 10, color: "var(--color-text-dim)", flexShrink: 0 }}
              >
                ▶
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchView({ soundFX }: { soundFX: boolean }) {
  const { searchQuery, setSearchQuery, runSearch, searchResults, isSearching, clearSearch } =
    useMusicData();
  const { playTracks } = usePlayer();
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
          placeholder="SEARCH SPOTIFY..."
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
          {isSearching ? "..." : "GO"}
        </button>
        {searchResults && (
          <button
            type="button"
            className="btn-pixel"
            onClick={() => { clearSearch(); setInputValue(""); }}
            style={{ padding: "8px 12px", fontSize: 8 }}
          >
            ✗
          </button>
        )}
      </form>

      <div className="overflow-y-auto flex-1">
        {searchResults && (
          <>
            {searchResults.tracks.length > 0 && (
              <div className="mb-4">
                <div
                  className="font-pixel text-[8px] text-[var(--color-amber)] mb-2 pb-1"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  TRACKS
                </div>
                {searchResults.tracks.slice(0, 10).map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-2 cursor-pointer"
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                    }}
                    onDoubleClick={() => playTracks([track.uri])}
                    onClick={() => { if (soundFX) playChime("click"); }}
                  >
                    {track.album.images?.[0]?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={track.album.images[0].url}
                        alt=""
                        style={{ width: 36, height: 36, imageRendering: "pixelated", flexShrink: 0 }}
                      />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span style={{ fontSize: 12, color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }} className="truncate">
                        {track.name}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>
                        {track.artists.map((a) => a.name).join(", ")}
                      </span>
                    </div>
                    <button
                      className="ml-auto btn-pixel"
                      style={{ padding: "4px 8px", fontSize: 9, flexShrink: 0 }}
                      onClick={(e) => { e.stopPropagation(); playTracks([track.uri]); }}
                    >
                      ▶
                    </button>
                  </div>
                ))}
              </div>
            )}

            {searchResults.playlists.length > 0 && (
              <div>
                <div
                  className="font-pixel text-[8px] text-[var(--color-amber)] mb-2 pb-1"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  PLAYLISTS
                </div>
                {searchResults.playlists.slice(0, 6).map((pl) => (
                  <div
                    key={pl.id}
                    className="flex items-center gap-3 p-2 cursor-pointer"
                    style={{ borderBottom: "1px solid var(--color-border)" }}
                  >
                    {pl.images?.[0]?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pl.images[0].url} alt="" style={{ width: 36, height: 36, imageRendering: "pixelated", flexShrink: 0 }} />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span style={{ fontSize: 12, color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }} className="truncate">
                        {pl.name}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--color-text-dim)", fontFamily: "var(--font-mono)" }}>
                        {pl.tracks.total} tracks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!searchResults && !isSearching && (
          <div className="flex items-center justify-center h-32">
            <span className="font-pixel text-[8px] text-[var(--color-text-dim)]">
              SEARCH THE SPOTIFY CATALOG
            </span>
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
        return (
          <div className="flex flex-col items-center justify-center h-full gap-6 p-4">
            {/* Device Transfer Banner */}
            <DeviceManager soundFX={soundFX} />

            {/* Recently played heading */}
            <div
              className="font-pixel text-[8px] text-[var(--color-text-dim)] w-full"
              style={{ maxWidth: 400 }}
            >
              ◉ NOW PLAYING
            </div>
          </div>
        );
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
          onToggleCRT={() => { if (soundFX) playChime("click"); setCrtEnabled((v) => !v); }}
          soundFX={soundFX}
        />

        {/* Main area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            soundFX={soundFX}
          />

          {/* Center content area */}
          <div
            className="flex-1 overflow-hidden flex flex-col"
            style={{ position: "relative" }}
          >
            {/* Main scrollable area */}
            <div className="flex-1 overflow-hidden flex">
              {/* Left: Content panel */}
              <div className="flex-1 overflow-hidden">
                {renderMainContent()}
              </div>

              {/* Right: Now Playing + Cat */}
              <div
                className="flex flex-col items-center justify-start gap-4 p-4 overflow-y-auto"
                style={{
                  width: 420,
                  minWidth: 320,
                  borderLeft: "2px solid var(--color-elevated)",
                  backgroundColor: "var(--color-surface)",
                  flexShrink: 0,
                }}
              >
                {/* Pixel Cat */}
                <div
                  className="w-full flex items-center justify-center py-3"
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <PixelCat />
                </div>

                {/* Device Manager banner (compact) */}
                <div className="w-full">
                  <DeviceManager soundFX={soundFX} />
                </div>

                {/* Now Playing Deck */}
                <NowPlayingDeck soundFX={soundFX} />
              </div>
            </div>

            {/* Queue Drawer */}
            <QueueDrawer soundFX={soundFX} />
          </div>
        </div>
      </div>
    </>
  );
}
