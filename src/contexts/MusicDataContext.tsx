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
  SpotifyAlbum,
  getUserPlaylists,
  getLikedTracks,
  getUserAlbums,
  getRecentlyPlayed,
  getTopTracks,
  getTopArtists,
  getFeaturedPlaylists,
  getNewReleases,
  searchSpotify,
} from "@/lib/spotify";

// ============================================================
// Music Data Context — Full Personalized Spotify Dashboard
// ============================================================

interface SearchResults {
  tracks: SpotifyTrack[];
  artists: SpotifyArtist[];
  playlists: SpotifyPlaylist[];
  albums: SpotifyAlbum[];
}

export type DetailViewTarget =
  | { type: "playlist"; id: string; data?: SpotifyPlaylist }
  | { type: "album"; id: string; data?: SpotifyAlbum }
  | { type: "artist"; id: string; data?: SpotifyArtist }
  | null;

interface MusicDataContextValue {
  playlists: SpotifyPlaylist[];
  likedTracks: SpotifyTrack[];
  albums: SpotifyAlbum[];
  recentlyPlayed: SpotifyTrack[];
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  featuredPlaylists: SpotifyPlaylist[];
  newReleases: SpotifyAlbum[];
  isLoadingLibrary: boolean;
  libraryError: string | null;
  searchResults: SearchResults | null;
  isSearching: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  runSearch: (q: string) => Promise<void>;
  clearSearch: () => void;
  refreshLibrary: () => Promise<void>;
  startRadio: (seedName: string) => Promise<SpotifyPlaylist | null>;
  activeDetail: DetailViewTarget;
  openPlaylist: (id: string, data?: SpotifyPlaylist) => void;
  openAlbum: (id: string, data?: SpotifyAlbum) => void;
  openArtist: (id: string, data?: SpotifyArtist) => void;
  closeDetail: () => void;
}

const MusicDataContext = createContext<MusicDataContextValue | null>(null);

export function MusicDataProvider({ children }: { children: ReactNode }) {
  const { accessToken, isAuthenticated } = useAuth();
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [likedTracks, setLikedTracks] = useState<SpotifyTrack[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<SpotifyTrack[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [newReleases, setNewReleases] = useState<SpotifyAlbum[]>([]);

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
      const [
        plRes,
        likedRes,
        albumsRes,
        recentRes,
        topTracksRes,
        topArtistsRes,
        featuredRes,
        newReleasesRes,
      ] = await Promise.allSettled([
        getUserPlaylists(accessToken),
        getLikedTracks(accessToken).then((items) => items.map((i) => i.track)),
        getUserAlbums(accessToken),
        getRecentlyPlayed(accessToken),
        getTopTracks(accessToken, 20, "short_term"),
        getTopArtists(accessToken, 12),
        getFeaturedPlaylists(accessToken, 12),
        getNewReleases(accessToken, 12),
      ]);

      if (plRes.status === "fulfilled") setPlaylists(plRes.value || []);
      if (likedRes.status === "fulfilled") setLikedTracks(likedRes.value || []);
      if (albumsRes.status === "fulfilled") setAlbums(albumsRes.value || []);
      if (recentRes.status === "fulfilled") setRecentlyPlayed(recentRes.value || []);
      if (topTracksRes.status === "fulfilled") setTopTracks(topTracksRes.value || []);
      if (topArtistsRes.status === "fulfilled") setTopArtists(topArtistsRes.value || []);
      if (featuredRes.status === "fulfilled") setFeaturedPlaylists(featuredRes.value || []);
      if (newReleasesRes.status === "fulfilled") setNewReleases(newReleasesRes.value || []);
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
          albums: results.albums?.items ?? [],
        });
      } catch (err) {
        console.error("[MusicData] Search error:", err);
      } finally {
        setIsSearching(false);
      }
    },
    [accessToken]
  );

  const startRadio = useCallback(
    async (seedName: string): Promise<SpotifyPlaylist | null> => {
      if (!accessToken || !seedName.trim()) return null;
      try {
        const query = `${seedName} Radio`;
        const res = await searchSpotify(accessToken, query, ["playlist"], 5);
        const radioPl = res.playlists?.items?.[0] || null;
        return radioPl;
      } catch (err) {
        console.error("[MusicData] Radio generation error:", err);
        return null;
      }
    },
    [accessToken]
  );

  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchQuery("");
  }, []);

  const [activeDetail, setActiveDetail] = useState<DetailViewTarget>(null);

  const openPlaylist = useCallback((id: string, data?: SpotifyPlaylist) => {
    setActiveDetail({ type: "playlist", id, data });
  }, []);

  const openAlbum = useCallback((id: string, data?: SpotifyAlbum) => {
    setActiveDetail({ type: "album", id, data });
  }, []);

  const openArtist = useCallback((id: string, data?: SpotifyArtist) => {
    setActiveDetail({ type: "artist", id, data });
  }, []);

  const closeDetail = useCallback(() => {
    setActiveDetail(null);
  }, []);

  return (
    <MusicDataContext.Provider
      value={{
        playlists,
        likedTracks,
        albums,
        recentlyPlayed,
        topTracks,
        topArtists,
        featuredPlaylists,
        newReleases,
        isLoadingLibrary,
        libraryError,
        searchResults,
        isSearching,
        searchQuery,
        setSearchQuery,
        runSearch,
        clearSearch,
        refreshLibrary,
        startRadio,
        activeDetail,
        openPlaylist,
        openAlbum,
        openArtist,
        closeDetail,
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
