"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  SpotifyPlaylist,
  SpotifyTrack,
  SpotifyArtist,
  getUserPlaylists,
  getLikedTracks,
  getRecentlyPlayed,
  searchSpotify,
} from "@/lib/spotify";

// ============================================================
// Music Data Context — Library, Search, Recently Played
// ============================================================

interface SearchResults {
  tracks: SpotifyTrack[];
  artists: SpotifyArtist[];
  playlists: SpotifyPlaylist[];
}

interface MusicDataContextValue {
  playlists: SpotifyPlaylist[];
  likedTracks: SpotifyTrack[];
  recentlyPlayed: SpotifyTrack[];
  isLoadingLibrary: boolean;
  libraryError: string | null;
  searchResults: SearchResults | null;
  isSearching: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  runSearch: (q: string) => Promise<void>;
  clearSearch: () => void;
  refreshLibrary: () => Promise<void>;
}

const MusicDataContext = createContext<MusicDataContextValue | null>(null);

export function MusicDataProvider({ children }: { children: ReactNode }) {
  const { accessToken, isAuthenticated } = useAuth();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [likedTracks, setLikedTracks] = useState<SpotifyTrack[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<SpotifyTrack[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshLibrary = useCallback(async () => {
    if (!accessToken) return;
    setIsLoadingLibrary(true);
    setLibraryError(null);
    try {
      const [plRes, likedRes, recentRes] = await Promise.allSettled([
        getUserPlaylists(accessToken),
        getLikedTracks(accessToken).then((items) => items.map((i) => i.track)),
        getRecentlyPlayed(accessToken),
      ]);

      if (plRes.status === "fulfilled") {
        setPlaylists(plRes.value || []);
      } else {
        console.warn("[MusicData] Playlists failed:", plRes.reason);
      }

      if (likedRes.status === "fulfilled") {
        setLikedTracks(likedRes.value || []);
      } else {
        console.warn("[MusicData] Liked tracks failed:", likedRes.reason);
      }

      if (recentRes.status === "fulfilled") {
        setRecentlyPlayed(recentRes.value || []);
      } else {
        console.warn("[MusicData] Recently played failed:", recentRes.reason);
      }
    } catch (err: unknown) {
      console.error("[MusicData] Library fetch error:", err);
      setLibraryError(err instanceof Error ? err.message : "Failed to load library");
    } finally {
      setIsLoadingLibrary(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      refreshLibrary();
    }
  }, [isAuthenticated, accessToken, refreshLibrary]);

  const runSearch = useCallback(
    async (q: string) => {
      if (!accessToken || !q.trim()) return;
      setIsSearching(true);
      try {
        const results = await searchSpotify(accessToken, q);
        setSearchResults({
          tracks: results.tracks?.items ?? [],
          artists: results.artists?.items ?? [],
          playlists: results.playlists?.items ?? [],
        });
      } catch (err) {
        console.error("[MusicData] Search error:", err);
      } finally {
        setIsSearching(false);
      }
    },
    [accessToken]
  );

  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchQuery("");
  }, []);

  return (
    <MusicDataContext.Provider
      value={{
        playlists,
        likedTracks,
        recentlyPlayed,
        isLoadingLibrary,
        libraryError,
        searchResults,
        isSearching,
        searchQuery,
        setSearchQuery,
        runSearch,
        clearSearch,
        refreshLibrary,
      }}
    >
      {children}
    </MusicDataContext.Provider>
  );
}

export function useMusicData(): MusicDataContextValue {
  const ctx = useContext(MusicDataContext);
  if (!ctx) throw new Error("useMusicData must be used within MusicDataProvider");
  return ctx;
}
