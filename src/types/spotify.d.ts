// PIXELIFY — Spotify Web Playback SDK & API type augmentations

// Augment the global Window to include the Spotify SDK
// @types/spotify-web-playback-sdk covers most of this,
// but we add our custom integration types here.

import "@spotify/web-playback-sdk";

export type {};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

// ============================================================
// Spotify Web API Response Shapes
// (used by src/lib/spotify/api.ts)
// ============================================================

export interface SpotifyApiTrack {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  preview_url: string | null;
  uri: string;
  external_urls: { spotify: string };
  artists: SpotifyApiArtist[];
  album: SpotifyApiAlbum;
  track_number: number;
  disc_number: number;
  is_playable?: boolean;
}

export interface SpotifyApiArtist {
  id: string;
  name: string;
  uri: string;
  external_urls: { spotify: string };
  images?: SpotifyApiImage[];
  genres?: string[];
  followers?: { total: number };
}

export interface SpotifyApiAlbum {
  id: string;
  name: string;
  uri: string;
  album_type: "album" | "single" | "compilation";
  external_urls: { spotify: string };
  artists: SpotifyApiArtist[];
  images: SpotifyApiImage[];
  release_date: string;
  total_tracks: number;
}

export interface SpotifyApiPlaylist {
  id: string;
  name: string;
  description: string | null;
  uri: string;
  external_urls: { spotify: string };
  images: SpotifyApiImage[];
  owner: { display_name: string; id: string };
  tracks: { total: number };
  public: boolean;
}

export interface SpotifyApiImage {
  url: string;
  width: number | null;
  height: number | null;
}

export interface SpotifyApiUser {
  id: string;
  display_name: string | null;
  email?: string;
  images: SpotifyApiImage[];
  product: "premium" | "free" | "open";
  country: string;
  followers: { total: number };
  external_urls: { spotify: string };
}

export interface SpotifyApiPagingObject<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface SpotifyApiSavedTrack {
  added_at: string;
  track: SpotifyApiTrack;
}

export interface SpotifyApiSavedAlbum {
  added_at: string;
  album: SpotifyApiAlbum;
}

export interface SpotifyApiFollowedArtist {
  artists: {
    items: SpotifyApiArtist[];
    next: string | null;
    cursors: { after: string };
    total: number;
  };
}

export interface SpotifyApiSearchResult {
  tracks?: SpotifyApiPagingObject<SpotifyApiTrack>;
  artists?: SpotifyApiPagingObject<SpotifyApiArtist>;
  albums?: SpotifyApiPagingObject<SpotifyApiAlbum>;
  playlists?: SpotifyApiPagingObject<SpotifyApiPlaylist>;
}

export interface SpotifyApiPlaylistTracks {
  items: Array<{
    added_at: string;
    track: SpotifyApiTrack | null;
  }>;
  total: number;
  next: string | null;
}

export interface SpotifyApiCurrentPlayback {
  is_playing: boolean;
  progress_ms: number;
  item: SpotifyApiTrack | null;
  shuffle_state: boolean;
  repeat_state: "off" | "context" | "track";
  device: {
    id: string;
    name: string;
    type: string;
    volume_percent: number;
    is_active: boolean;
  };
}

export interface SpotifyApiRecentlyPlayed {
  items: Array<{
    played_at: string;
    track: SpotifyApiTrack;
    context: { type: string; uri: string } | null;
  }>;
  next: string | null;
  cursors: { before: string; after: string };
}

export interface SpotifyApiRecommendations {
  tracks: SpotifyApiTrack[];
  seeds: Array<{ id: string; type: string }>;
}
