// ============================================================
// Spotify Web API Typed Wrapper
// ============================================================

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// ---- Types ----

export interface SpotifyImage {
  url: string;
  width: number | null;
  height: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  external_urls: { spotify: string };
  images?: SpotifyImage[];
  genres?: string[];
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  uri: string;
  release_date: string;
  total_tracks?: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  explicit: boolean;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  is_playable?: boolean;
  external_urls: { spotify: string };
}

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: "Computer" | "Smartphone" | "Speaker" | "TV" | "AVR" | "STB" | "AudioDongle" | "GameConsole" | "CastAudio" | "CastVideo" | "Automobile" | "Smartwatch" | "Chromebook" | "UnknownSoundbar" | "NAS" | "HomeSpeaker" | "RaspberryPi" | "Tablet" | "Unknown";
  volume_percent: number | null;
  supports_volume: boolean;
}

export interface SpotifyPlaybackState {
  device: SpotifyDevice;
  shuffle_state: boolean;
  repeat_state: "off" | "context" | "track";
  timestamp: number;
  progress_ms: number | null;
  is_playing: boolean;
  item: SpotifyTrack | null;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  context: {
    type: string;
    uri: string;
    href: string;
  } | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  tracks: { total: number };
  uri: string;
  owner: { display_name: string };
  public: boolean;
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
  product: "premium" | "free" | "open";
  country: string;
  followers: { total: number };
  external_urls: { spotify: string };
}

export interface SavedTrack {
  added_at: string;
  track: SpotifyTrack;
}

export interface SavedAlbum {
  added_at: string;
  album: SpotifyAlbum;
}

export interface SpotifyQueue {
  currently_playing: SpotifyTrack | null;
  queue: SpotifyTrack[];
}

// ---- API client ----

class SpotifyAPIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "SpotifyAPIError";
  }
}

async function spotifyFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${SPOTIFY_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new SpotifyAPIError(
      body?.error?.message ?? `HTTP ${response.status}`,
      response.status
    );
  }

  return response.json() as Promise<T>;
}

// ---- Player API ----

export async function getPlaybackState(
  token: string
): Promise<SpotifyPlaybackState | null> {
  try {
    const state = await spotifyFetch<SpotifyPlaybackState>(
      "/me/player?additional_types=track",
      token
    );
    if (!state || !state.device) return null;
    return state;
  } catch {
    return null;
  }
}

export async function transferPlayback(
  token: string,
  deviceId: string,
  play: boolean = false
): Promise<void> {
  await spotifyFetch<void>("/me/player", token, {
    method: "PUT",
    body: JSON.stringify({ device_ids: [deviceId], play }),
  });
}

export async function getAvailableDevices(
  token: string
): Promise<SpotifyDevice[]> {
  const data = await spotifyFetch<{ devices: SpotifyDevice[] }>(
    "/me/player/devices",
    token
  );
  return (data?.devices ?? []).filter(Boolean);
}

export async function startPlayback(
  token: string,
  deviceId?: string,
  contextUri?: string,
  uris?: string[],
  offset?: number
): Promise<void> {
  const params = deviceId ? `?device_id=${deviceId}` : "";
  const body: Record<string, unknown> = {};
  if (contextUri) body.context_uri = contextUri;
  if (uris) body.uris = uris;
  if (offset !== undefined) body.offset = { position: offset };
  await spotifyFetch<void>(`/me/player/play${params}`, token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function pausePlayback(
  token: string,
  deviceId?: string
): Promise<void> {
  const params = deviceId ? `?device_id=${deviceId}` : "";
  await spotifyFetch<void>(`/me/player/pause${params}`, token, {
    method: "PUT",
  });
}

export async function skipToNext(token: string): Promise<void> {
  await spotifyFetch<void>("/me/player/next", token, { method: "POST" });
}

export async function skipToPrevious(token: string): Promise<void> {
  await spotifyFetch<void>("/me/player/previous", token, { method: "POST" });
}

export async function seekToPosition(
  token: string,
  positionMs: number
): Promise<void> {
  await spotifyFetch<void>(
    `/me/player/seek?position_ms=${Math.floor(positionMs)}`,
    token,
    { method: "PUT" }
  );
}

export async function setRepeatMode(
  token: string,
  state: "off" | "context" | "track"
): Promise<void> {
  await spotifyFetch<void>(`/me/player/repeat?state=${state}`, token, {
    method: "PUT",
  });
}

export async function setShuffleMode(
  token: string,
  state: boolean
): Promise<void> {
  await spotifyFetch<void>(`/me/player/shuffle?state=${state}`, token, {
    method: "PUT",
  });
}

export async function setVolume(
  token: string,
  volumePercent: number
): Promise<void> {
  await spotifyFetch<void>(
    `/me/player/volume?volume_percent=${Math.floor(volumePercent)}`,
    token,
    { method: "PUT" }
  );
}

export async function getQueue(token: string): Promise<SpotifyQueue | null> {
  try {
    return await spotifyFetch<SpotifyQueue>("/me/player/queue", token);
  } catch {
    return null;
  }
}

// ---- User Profile & Library ----

export async function getCurrentUserProfile(
  token: string
): Promise<SpotifyUserProfile> {
  return spotifyFetch<SpotifyUserProfile>("/me", token);
}

export async function getUserPlaylists(
  token: string,
  limit = 50
): Promise<SpotifyPlaylist[]> {
  try {
    const data = await spotifyFetch<{ items: SpotifyPlaylist[] }>(
      `/me/playlists?limit=${limit}`,
      token
    );
    return (data?.items ?? [])
      .filter(Boolean)
      .map((p) => ({
        ...p,
        name: p.name || "Untitled Playlist",
        images: p.images || [],
        tracks: p.tracks || { total: 0 },
        owner: p.owner || { display_name: "Spotify" },
      }));
  } catch {
    return [];
  }
}

export async function getLikedTracks(
  token: string,
  limit = 50,
  offset = 0
): Promise<SavedTrack[]> {
  try {
    const data = await spotifyFetch<{ items: SavedTrack[] }>(
      `/me/tracks?limit=${limit}&offset=${offset}`,
      token
    );
    return (data?.items ?? []).filter((i) => i && i.track);
  } catch {
    return [];
  }
}

export async function getUserAlbums(
  token: string,
  limit = 50
): Promise<SpotifyAlbum[]> {
  try {
    const data = await spotifyFetch<{ items: SavedAlbum[] }>(
      `/me/albums?limit=${limit}`,
      token
    );
    return (data?.items ?? [])
      .filter((i) => i && i.album)
      .map((i) => ({
        ...i.album,
        name: i.album.name || "Untitled Album",
        images: i.album.images || [],
        artists: i.album.artists || [],
      }));
  } catch {
    return [];
  }
}

export async function getRecentlyPlayed(
  token: string,
  limit = 30
): Promise<SpotifyTrack[]> {
  try {
    const data = await spotifyFetch<{ items: { track: SpotifyTrack }[] }>(
      `/me/player/recently-played?limit=${limit}`,
      token
    );
    return (data?.items ?? [])
      .filter((i) => i && i.track)
      .map((i) => i.track);
  } catch {
    return [];
  }
}

// ---- Personalized Top Content ----

export async function getTopTracks(
  token: string,
  limit = 20,
  timeRange = "short_term"
): Promise<SpotifyTrack[]> {
  try {
    const data = await spotifyFetch<{ items: SpotifyTrack[] }>(
      `/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
      token
    );
    return (data?.items ?? []).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getTopArtists(
  token: string,
  limit = 12
): Promise<SpotifyArtist[]> {
  try {
    const data = await spotifyFetch<{ items: SpotifyArtist[] }>(
      `/me/top/artists?limit=${limit}`,
      token
    );
    return (data?.items ?? []).filter(Boolean);
  } catch {
    return [];
  }
}

// ---- Browse & Featured ----

export async function getFeaturedPlaylists(
  token: string,
  limit = 20
): Promise<SpotifyPlaylist[]> {
  try {
    const data = await spotifyFetch<{
      playlists?: { items: SpotifyPlaylist[] };
    }>(`/browse/featured-playlists?limit=${limit}`, token);
    return (data?.playlists?.items ?? [])
      .filter(Boolean)
      .map((p) => ({
        ...p,
        name: p.name || "Featured Playlist",
        images: p.images || [],
        tracks: p.tracks || { total: 0 },
        owner: p.owner || { display_name: "Spotify" },
      }));
  } catch {
    return [];
  }
}

export async function getNewReleases(
  token: string,
  limit = 20
): Promise<SpotifyAlbum[]> {
  try {
    const data = await spotifyFetch<{
      albums?: { items: SpotifyAlbum[] };
    }>(`/browse/new-releases?limit=${limit}`, token);
    return (data?.albums?.items ?? []).filter(Boolean);
  } catch {
    return [];
  }
}

export async function searchSpotify(
  token: string,
  query: string,
  types: string[] = ["track", "artist", "playlist", "album"],
  limit = 20
): Promise<{
  tracks?: { items: SpotifyTrack[] };
  artists?: { items: SpotifyArtist[] };
  playlists?: { items: SpotifyPlaylist[] };
  albums?: { items: SpotifyAlbum[] };
}> {
  const params = new URLSearchParams({
    q: query,
    type: types.join(","),
    limit: String(limit),
  });
  return spotifyFetch(`/search?${params}`, token);
}

export async function getPlaylistTracks(
  token: string,
  playlistId: string,
  limit = 50
): Promise<SpotifyTrack[]> {
  try {
    const data = await spotifyFetch<{
      items: { track: SpotifyTrack }[];
    }>(`/playlists/${playlistId}/tracks?limit=${limit}`, token);
    return (data?.items ?? []).filter((i) => i && i.track).map((i) => i.track);
  } catch {
    return [];
  }
}

export async function getPlaylistDetails(
  token: string,
  playlistId: string
): Promise<{
  playlist: SpotifyPlaylist;
  tracks: SpotifyTrack[];
} | null> {
  try {
    const data = await spotifyFetch<SpotifyPlaylist & { tracks: { items: { track: SpotifyTrack }[]; total: number } }>(
      `/playlists/${playlistId}`,
      token
    );
    const tracks = (data?.tracks?.items ?? []).filter((i) => i && i.track).map((i) => i.track);
    return {
      playlist: {
        id: data.id,
        name: data.name || "Untitled Playlist",
        description: data.description || "",
        images: data.images || [],
        tracks: { total: data.tracks?.total ?? tracks.length },
        uri: data.uri,
        owner: data.owner || { display_name: "Spotify" },
        public: !!data.public,
      },
      tracks,
    };
  } catch {
    return null;
  }
}

export async function getAlbumDetails(
  token: string,
  albumId: string
): Promise<{
  album: SpotifyAlbum;
  tracks: SpotifyTrack[];
} | null> {
  try {
    const data = await spotifyFetch<SpotifyAlbum & { tracks: { items: SpotifyTrack[]; total: number } }>(
      `/albums/${albumId}`,
      token
    );
    const album: SpotifyAlbum = {
      id: data.id,
      name: data.name,
      images: data.images || [],
      artists: data.artists || [],
      uri: data.uri,
      release_date: data.release_date || "",
      total_tracks: data.total_tracks || data.tracks?.total || 0,
    };
    const tracks = (data.tracks?.items ?? []).map((t) => ({
      ...t,
      album,
    }));
    return { album, tracks };
  } catch {
    return null;
  }
}

export async function getArtistDetails(
  token: string,
  artistId: string
): Promise<{
  artist: SpotifyArtist;
  topTracks: SpotifyTrack[];
  albums: SpotifyAlbum[];
} | null> {
  try {
    const [artistRes, tracksRes, albumsRes] = await Promise.allSettled([
      spotifyFetch<SpotifyArtist>(`/artists/${artistId}`, token),
      spotifyFetch<{ tracks: SpotifyTrack[] }>(`/artists/${artistId}/top-tracks?market=from_token`, token),
      spotifyFetch<{ items: SpotifyAlbum[] }>(`/artists/${artistId}/albums?include_groups=album,single&limit=10`, token),
    ]);

    const artist = artistRes.status === "fulfilled" ? artistRes.value : null;
    if (!artist) return null;

    const topTracks = tracksRes.status === "fulfilled" ? (tracksRes.value?.tracks ?? []) : [];
    const albums = albumsRes.status === "fulfilled" ? (albumsRes.value?.items ?? []) : [];

    return { artist, topTracks, albums };
  } catch {
    return null;
  }
}

export async function checkSavedTracks(
  token: string,
  trackIds: string[]
): Promise<boolean[]> {
  try {
    if (!trackIds.length) return [];
    return await spotifyFetch<boolean[]>(`/me/tracks/contains?ids=${trackIds.join(",")}`, token);
  } catch {
    return trackIds.map(() => false);
  }
}

export async function saveTrack(token: string, trackId: string): Promise<void> {
  await spotifyFetch<void>(`/me/tracks?ids=${trackId}`, token, { method: "PUT" });
}

export async function removeSavedTrack(token: string, trackId: string): Promise<void> {
  await spotifyFetch<void>(`/me/tracks?ids=${trackId}`, token, { method: "DELETE" });
}

