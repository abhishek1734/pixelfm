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
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  uri: string;
  release_date: string;
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
    return await spotifyFetch<SpotifyPlaybackState>(
      "/me/player?additional_types=track",
      token
    );
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
  return data?.devices ?? [];
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

// ---- User API ----

export async function getCurrentUserProfile(
  token: string
): Promise<SpotifyUserProfile> {
  return spotifyFetch<SpotifyUserProfile>("/me", token);
}

export async function getUserPlaylists(
  token: string,
  limit = 50
): Promise<SpotifyPlaylist[]> {
  const data = await spotifyFetch<{ items: SpotifyPlaylist[] }>(
    `/me/playlists?limit=${limit}`,
    token
  );
  return data?.items ?? [];
}

export async function getLikedTracks(
  token: string,
  limit = 50,
  offset = 0
): Promise<SavedTrack[]> {
  const data = await spotifyFetch<{ items: SavedTrack[] }>(
    `/me/tracks?limit=${limit}&offset=${offset}`,
    token
  );
  return data?.items ?? [];
}

export async function getRecentlyPlayed(
  token: string,
  limit = 20
): Promise<SpotifyTrack[]> {
  const data = await spotifyFetch<{ items: { track: SpotifyTrack }[] }>(
    `/me/player/recently-played?limit=${limit}`,
    token
  );
  return data?.items?.map((i) => i.track) ?? [];
}

export async function searchSpotify(
  token: string,
  query: string,
  types: string[] = ["track", "artist", "playlist"],
  limit = 20
): Promise<{
  tracks?: { items: SpotifyTrack[] };
  artists?: { items: SpotifyArtist[] };
  playlists?: { items: SpotifyPlaylist[] };
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
  const data = await spotifyFetch<{
    items: { track: SpotifyTrack }[];
  }>(`/playlists/${playlistId}/tracks?limit=${limit}`, token);
  return data?.items?.map((i) => i.track).filter(Boolean) ?? [];
}
