"use client";

import React, { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePlayer } from "@/context/PlayerContext";
import { useSettings } from "@/context/SettingsContext";
import { NavPage, Playlist, Track } from "@/types/music";
import { cn } from "@/lib/utils";

// Layout
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

// Player
import { PlayerBar } from "@/components/player/PlayerBar";
import { QueuePanel } from "@/components/player/QueuePanel";
import { ExpandedPlayer } from "@/components/player/ExpandedPlayer";

// Views
import { LandingView } from "@/components/views/LandingView";
import { HomeView } from "@/components/views/HomeView";
import { SearchView } from "@/components/views/SearchView";
import { LibraryView } from "@/components/views/LibraryView";
import { PlaylistDetailView } from "@/components/views/PlaylistDetailView";
import { SettingsView } from "@/components/views/SettingsView";
import { NowPlayingView } from "@/components/views/NowPlayingView";

// Common
import { CRTOverlay } from "@/components/common/CRTOverlay";
import { LoadingScreen } from "@/components/common/LoadingScreen";

// Data
import { MOCK_PLAYLISTS } from "@/lib/mockData";

export function AppShell() {
  const { mode } = useAuth();
  const { play, playPlaylist } = usePlayer();
  const { settings } = useSettings();

  const [isLoadingDone, setIsLoadingDone] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavPage>("home");
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [isSidebarCollapsed] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const handleNavigate = useCallback((page: NavPage) => {
    setCurrentPage(page);
    if (typeof page === "object" && page.type === "playlist") {
      const pl = MOCK_PLAYLISTS.find((p) => p.id === page.id);
      if (pl) setSelectedPlaylist(pl);
    }
  }, []);

  const handlePlayTrack = useCallback(
    (track: Track, context?: Track[]) => {
      play(track, context);
    },
    [play]
  );

  const handlePlayPlaylist = useCallback(
    (playlist: Playlist) => {
      playPlaylist(playlist);
    },
    [playPlaylist]
  );

  // Initial loading splash screen
  if (!isLoadingDone) {
    return <LoadingScreen onComplete={() => setIsLoadingDone(true)} minDurationMs={2200} />;
  }

  // Show landing page if not authenticated
  if (mode === "landing") {
    return (
      <div className="h-dvh overflow-hidden bg-bg-primary">
        {settings.crtEffect && <CRTOverlay enabled />}
        <LandingView />
      </div>
    );
  }

  const renderMainContent = () => {
    if (typeof currentPage === "object") {
      if (currentPage.type === "playlist" && selectedPlaylist) {
        return (
          <PlaylistDetailView
            playlist={selectedPlaylist}
            onPlayTrack={handlePlayTrack}
            onBack={() => setCurrentPage("library")}
          />
        );
      }
    }

    switch (currentPage) {
      case "home":
        return (
          <HomeView
            onNavigate={handleNavigate}
            onPlayPlaylist={handlePlayPlaylist}
            onPlayTrack={handlePlayTrack}
          />
        );
      case "search":
        return <SearchView onPlayTrack={handlePlayTrack} />;
      case "library":
        return (
          <LibraryView
            onPlayPlaylist={handlePlayPlaylist}
            onPlayTrack={handlePlayTrack}
            onNavigate={handleNavigate}
          />
        );
      case "liked":
        return (
          <LibraryView
            onPlayPlaylist={handlePlayPlaylist}
            onPlayTrack={handlePlayTrack}
            onNavigate={handleNavigate}
            initialTab="liked"
          />
        );
      case "settings":
        return <SettingsView onNavigate={handleNavigate} />;
      case "now-playing":
        return (
          <NowPlayingView
            onBack={() => setCurrentPage("home")}
            onPlayTrack={handlePlayTrack}
          />
        );
      default:
        return (
          <HomeView
            onNavigate={handleNavigate}
            onPlayPlaylist={handlePlayPlaylist}
            onPlayTrack={handlePlayTrack}
          />
        );
    }
  };

  const getPageTitle = () => {
    if (typeof currentPage === "object") {
      if (currentPage.type === "playlist" && selectedPlaylist) {
        return selectedPlaylist.name;
      }
    }
    const titles: Partial<Record<string, string>> = {
      home: "Home",
      search: "Search",
      library: "Your Library",
      liked: "Liked Songs",
      "recently-played": "Recently Played",
      "made-for-you": "Made For You",
      settings: "Settings",
      profile: "Profile",
    };
    return titles[currentPage as string] ?? "PIXELIFY";
  };

  return (
    <div className="h-dvh overflow-hidden bg-bg-primary flex flex-col">
      {/* CRT Effect Overlay */}
      {settings.crtEffect && <CRTOverlay enabled />}

      {/* Main grid: sidebar + content */}
      <div
        className={cn(
          "flex flex-1 overflow-hidden",
          "transition-none" // no smooth sidebar transitions
        )}
        style={{ paddingBottom: "80px" }} // space for player bar
      >
        {/* Sidebar — desktop only */}
        <div className="hidden md:block">
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            playlists={MOCK_PLAYLISTS}
            isCollapsed={isSidebarCollapsed}
            onCreatePlaylist={() => {}}
          />
        </div>

        {/* Main content column */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top bar */}
          <Topbar
            title={getPageTitle()}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            showSearch={currentPage === "search"}
            onSearch={() => {}}
          />

          {/* Scrollable content + optional queue panel */}
          <div className="flex flex-1 overflow-hidden">
            {/* Page content */}
            <main className="flex-1 overflow-hidden bg-bg-primary">
              {renderMainContent()}
            </main>

            {/* Queue panel — desktop */}
            {isQueueOpen && (
              <div className="hidden md:block">
                <QueuePanel
                  isOpen={isQueueOpen}
                  onClose={() => setIsQueueOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom player */}
      <PlayerBar
        onExpand={() => setCurrentPage(currentPage === "now-playing" ? "home" : "now-playing")}
        onQueueToggle={() => setIsQueueOpen((v) => !v)}
        isQueueOpen={isQueueOpen}
      />

      {/* Mobile bottom navigation */}
      <div className="md:hidden">
        <MobileNav currentPage={currentPage} onNavigate={handleNavigate} />
      </div>

      {/* Expanded player modal */}
      <ExpandedPlayer
        isOpen={isPlayerExpanded}
        onClose={() => setIsPlayerExpanded(false)}
      />
    </div>
  );
}
