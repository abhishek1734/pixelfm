// PIXELIFY — Typed Spotify Web API Client

import type {
  Track,
  Album,
  Artist,
  Playlist,
  SearchResults,
  SpotifyUser,
} from "@/types/music";

import type {
  SpotifyApiTrack,
  SpotifyApiArtist,
  SpotifyApiAlbum,
  SpotifyApiPlaylist,
  SpotifyApiUser,
  SpotifyApiPagingObject,
  SpotifyApiSavedTrack,
  SpotifyApiSearchResult,
  SpotifyApiPlaylistTracks,
  SpotifyApiRecentlyPlayed,
  SpotifyApiRecommendations,
} from "@/types/spotify.d";

// ============================================================
// Type Mappers — Spotify API → internal types
// ============================================================

function mapTrack(raw: SpotifyApiTrack): Track {
  return {
    id: raw.id,
    name: raw.name,
    artistName: raw.artists.map((a) => a.name).join(", "),
    artistId: raw.artists[0]?.id,
    albumName: raw.album.name,
    albumId: raw.album.id,
    albumImageUrl: raw.album.images[0]?.url,
    durationMs: raw.duration_ms,
    previewUrl: raw.preview_url ?? undefined,
    uri: raw.uri,
    isExplicit: raw.explicit,
    externalUrl: raw.external_urls.spotify,
    trackNumber: raw.track_number,
    discNumber: raw.disc_number,
    isPlayable: raw.is_playable ?? true,
  };
}

function mapArtist(raw: SpotifyApiArtist): Artist {
  return {
    id: raw.id,
    name: raw.name,
    imageUrl: raw.images?.[0]?.url,
    genres: raw.genres,
    followers: raw.followers?.total,
    externalUrl: raw.external_urls.spotify,
  };
}

function mapAlbum(raw: SpotifyApiAlbum): Album {
  return {
    id: raw.id,
    name: raw.name,
    imageUrl: raw.images[0]?.url,
    artistName: raw.artists.map((a) => a.name).join(", "),
    artistId: raw.artists[0]?.id,
    releaseDate: raw.release_date,
    totalTracks: raw.total_tracks,
    type: raw.album_type,
    externalUrl: raw.external_urls.spotify,
  };
}

function mapPlaylist(raw: SpotifyApiPlaylist): Playlist {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? undefined,
    imageUrl: raw.images?.[0]?.url,
    ownerName: raw.owner.display_name,
    trackCount: raw.tracks.total,
    isPublic: raw.public,
    uri: raw.uri,
    externalUrl: raw.external_urls.spotify,
  };
}

function mapUser(raw: SpotifyApiUser): SpotifyUser {
  return {
    id: raw.id,
    displayName: raw.display_name ?? raw.id,
    email: raw.email,
    imageUrl: raw.images?.[0]?.url,
    product: raw.product,
    country: raw.country,
    followers: raw.followers?.total,
  };
}

// ============================================================
// Error Classes
// ============================================================

export class SpotifyApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(`[Spotify API ${status}] ${message}`);
    this.name = "SpotifyApiError";
  }
}

export class SpotifyUnauthorizedError extends SpotifyApiError {
  constructor() {
    super(401, "Unauthorized — access token expired or invalid.");
    this.name = "SpotifyUnauthorizedError";
  }
}

export class SpotifyRateLimitError extends SpotifyApiError {
  constructor(public readonly retryAfter: number) {
    super(429, `Rate limited. Retry after ${retryAfter}s.`);
    this.name = "SpotifyRateLimitError";
  }
}

// ============================================================
// SpotifyAPI Class
// ============================================================

const BASE_URL = "https://api.spotify.com/v1";

export class SpotifyAPI {
  private readonly accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  // ----------------------------------------------------------
  // Private fetch wrapper
  // ----------------------------------------------------------

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    // No-content responses (204, 202)
    if (response.status === 204 || response.status === 202) {
      return undefined as unknown as T;
    }

    if (response.status === 401) {
      throw new SpotifyUnauthorizedError();
    }

    if (response.status === 403) {
      const body = await response.json().catch(() => ({}));
      throw new SpotifyApiError(403, (body as { error?: { message?: string } }).error?.message ?? "Forbidden");
    }

    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After") ?? "5", 10);
      throw new SpotifyRateLimitError(retryAfter);
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new SpotifyApiError(
        response.status,
        (body as { error?: { message?: string } }).error?.message ?? response.statusText
      );
    }

    return response.json() as Promise<T>;
  }

  // ----------------------------------------------------------
  // User
  // ----------------------------------------------------------

  /** Get the currently authenticated user's profile. */
  async getMe(): Promise<SpotifyUser> {
    const raw = await this.fetch<SpotifyApiUser>("/me");
    return mapUser(raw);
  }

  // ----------------------------------------------------------
  // Playlists
  // ----------------------------------------------------------

  /** Get the current user's playlists (up to `limit`, max 50). */
  async getUserPlaylists(limit = 50): Promise<Playlist[]> {
    const raw = await this.fetch<SpotifyApiPagingObject<SpotifyApiPlaylist>>(
      `/me/playlists?limit=${Math.min(limit, 50)}`
    );
    return raw.items.map(mapPlaylist);
  }

  /** Get a single playlist by ID. */
  async getPlaylist(id: string): Promise<Playlist> {
    const raw = await this.fetch<SpotifyApiPlaylist>(`/playlists/${id}`);
    return mapPlaylist(raw);
  }

  /** Get paginated tracks from a playlist. */
  async getPlaylistTracks(
    id: string,
    offset = 0
  ): Promise<{ tracks: Track[]; total: number; next: boolean }> {
    const raw = await this.fetch<SpotifyApiPlaylistTracks>(
      `/playlists/${id}/tracks?offset=${offset}&limit=50&fields=items(added_at,track(id,name,duration_ms,explicit,preview_url,uri,external_urls,artists,album,track_number,disc_number,is_playable)),total,next`
    );

    const tracks = raw.items
      .filter((item) => item.track !== null)
      .map((item) => mapTrack(item.track!));

    return {
      tracks,
      total: raw.total,
      next: raw.next !== null,
    };
  }

  // ----------------------------------------------------------
  // Library
  // ----------------------------------------------------------

  /** Get the user's saved (liked) tracks. */
  async getLikedTracks(
    offset = 0
  ): Promise<{ tracks: Track[]; total: number }> {
    const raw = await this.fetch<SpotifyApiPagingObject<SpotifyApiSavedTrack>>(
      `/me/tracks?offset=${offset}&limit=50`
    );
    return {
      tracks: raw.items.map((item) => mapTrack(item.track)),
      total: raw.total,
    };
  }

  /** Check if track IDs are in the user's liked library. */
  async checkLikedTracks(ids: string[]): Promise<Record<string, boolean>> {
    // API accepts max 50 IDs per request
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 50) {
      chunks.push(ids.slice(i, i + 50));
    }

    const results: Record<string, boolean> = {};

    for (const chunk of chunks) {
      const raw = await this.fetch<boolean[]>(
        `/me/tracks/contains?ids=${chunk.join(",")}`
      );
      chunk.forEach((id, idx) => {
        results[id] = raw[idx];
      });
    }

    return results;
  }

  /** Save (like) tracks by ID. */
  async likeTracks(ids: string[]): Promise<void> {
    await this.fetch("/me/tracks", {
      method: "PUT",
      body: JSON.stringify({ ids }),
    });
  }

  /** Remove (unlike) tracks by ID. */
  async unlikeTracks(ids: string[]): Promise<void> {
    await this.fetch("/me/tracks", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  }

  // ----------------------------------------------------------
  // History & Discovery
  // ----------------------------------------------------------

  /** Get the user's recently played tracks. */
  async getRecentlyPlayed(limit = 20): Promise<Track[]> {
    const raw = await this.fetch<SpotifyApiRecentlyPlayed>(
      `/me/player/recently-played?limit=${Math.min(limit, 50)}`
    );
    return raw.items.map((item) => mapTrack(item.track));
  }

  /** Get featured playlists from Spotify's editorial team. */
  async getFeaturedPlaylists(): Promise<Playlist[]> {
    const raw = await this.fetch<{
      playlists: SpotifyApiPagingObject<SpotifyApiPlaylist>;
      message?: string;
    }>("/browse/featured-playlists?limit=20");
    return raw.playlists.items.map(mapPlaylist);
  }

  /**
   * Get track recommendations seeded by track IDs (max 5 seed IDs used).
   */
  async getRecommendations(seedTrackIds: string[]): Promise<Track[]> {
    const seeds = seedTrackIds.slice(0, 5).join(",");
    const raw = await this.fetch<SpotifyApiRecommendations>(
      `/recommendations?seed_tracks=${seeds}&limit=20`
    );
    return raw.tracks.map(mapTrack);
  }

  // ----------------------------------------------------------
  // Search
  // ----------------------------------------------------------

  /** Search across tracks, artists, albums, and playlists. */
  async searchAll(query: string): Promise<SearchResults> {
    const encoded = encodeURIComponent(query);
    const raw = await this.fetch<SpotifyApiSearchResult>(
      `/search?q=${encoded}&type=track,artist,album,playlist&limit=20`
    );

    return {
      tracks: (raw.tracks?.items ?? []).map(mapTrack),
      artists: (raw.artists?.items ?? []).map(mapArtist),
      albums: (raw.albums?.items ?? []).map(mapAlbum),
      playlists: (raw.playlists?.items ?? []).map(mapPlaylist),
    };
  }

  // ----------------------------------------------------------
  // Top Items
  // ----------------------------------------------------------

  /** Get the user's top tracks (medium-term, 20 items). */
  async getUserTopTracks(): Promise<Track[]> {
    const raw = await this.fetch<SpotifyApiPagingObject<SpotifyApiTrack>>(
      "/me/top/tracks?time_range=medium_term&limit=20"
    );
    return raw.items.map(mapTrack);
  }

  /** Get the user's top artists (medium-term, 20 items). */
  async getUserTopArtists(): Promise<Artist[]> {
    const raw = await this.fetch<SpotifyApiPagingObject<SpotifyApiArtist>>(
      "/me/top/artists?time_range=medium_term&limit=20"
    );
    return raw.items.map(mapArtist);
  }

  // ----------------------------------------------------------
  // Playback Control
  // ----------------------------------------------------------

  /** Transfer playback to a specific device. */
  async transferPlayback(deviceId: string): Promise<void> {
    await this.fetch("/me/player", {
      method: "PUT",
      body: JSON.stringify({ device_ids: [deviceId], play: true }),
    });
  }

  /**
   * Start or resume playback on a device.
   * Pass `uris` for specific tracks, or `contextUri` for an album/playlist.
   */
  async play(
    deviceId: string,
    uris?: string[],
    contextUri?: string,
    positionMs?: number
  ): Promise<void> {
    const body: Record<string, unknown> = {};
    if (uris && uris.length > 0) body.uris = uris;
    if (contextUri) body.context_uri = contextUri;
    if (positionMs !== undefined) body.position_ms = positionMs;

    await this.fetch(`/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  /** Pause playback on a device. */
  async pause(deviceId: string): Promise<void> {
    await this.fetch(`/me/player/pause?device_id=${deviceId}`, {
      method: "PUT",
    });
  }

  /** Skip to the next track. */
  async skipToNext(deviceId: string): Promise<void> {
    await this.fetch(`/me/player/next?device_id=${deviceId}`, {
      method: "POST",
    });
  }

  /** Skip to the previous track. */
  async skipToPrevious(deviceId: string): Promise<void> {
    await this.fetch(`/me/player/previous?device_id=${deviceId}`, {
      method: "POST",
    });
  }

  /** Seek to an absolute position in the current track. */
  async seekToPosition(deviceId: string, positionMs: number): Promise<void> {
    await this.fetch(
      `/me/player/seek?device_id=${deviceId}&position_ms=${positionMs}`,
      { method: "PUT" }
    );
  }

  /** Set the volume for the device (0–100). */
  async setVolume(deviceId: string, volumePercent: number): Promise<void> {
    const clamped = Math.round(Math.min(100, Math.max(0, volumePercent)));
    await this.fetch(
      `/me/player/volume?device_id=${deviceId}&volume_percent=${clamped}`,
      { method: "PUT" }
    );
  }

  /** Toggle shuffle for the device. */
  async setShuffle(deviceId: string, state: boolean): Promise<void> {
    await this.fetch(
      `/me/player/shuffle?device_id=${deviceId}&state=${state}`,
      { method: "PUT" }
    );
  }

  /** Set repeat mode for the device. */
  async setRepeat(
    deviceId: string,
    state: "off" | "context" | "track"
  ): Promise<void> {
    await this.fetch(
      `/me/player/repeat?device_id=${deviceId}&state=${state}`,
      { method: "PUT" }
    );
  }
}

export default SpotifyAPI;

