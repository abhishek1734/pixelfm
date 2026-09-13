// PIXELIFY — Unified Type Definitions

// ============================================================
// Core Music Entities
// ============================================================

export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  genres?: string[];
  followers?: number;
  externalUrl?: string;
}

export interface Album {
  id: string;
  name: string;
  imageUrl?: string;
  artistName: string;
  artistId?: string;
  releaseDate?: string;
  totalTracks?: number;
  type: "album" | "single" | "compilation";
  externalUrl?: string;
}

export interface Track {
  id: string;
  name: string;
  artistName: string;
  artistId?: string;
  albumName: string;
  albumId?: string;
  albumImageUrl?: string;
  durationMs: number;
  previewUrl?: string;
  uri?: string; // spotify:track:xxx
  isLiked?: boolean;
  isExplicit?: boolean;
  externalUrl?: string;
  trackNumber?: number;
  discNumber?: number;
  isPlayable?: boolean;
  // Mock: which pixel cover to use
  pixelCover?: PixelCoverTheme;
  // Time-synced lyrics
  lyrics?: { timeMs: number; text: string }[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  ownerName?: string;
  trackCount?: number;
  tracks?: Track[];
  isPublic?: boolean;
  uri?: string; // spotify:playlist:xxx
  externalUrl?: string;
}

export interface Episode {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  showName?: string;
  durationMs: number;
  releaseDate?: string;
  uri?: string;
}

export type LibraryItem = Playlist | Album | Artist;
export type LibraryItemType = "playlist" | "album" | "artist" | "liked";

// ============================================================
// Player State
// ============================================================

export type RepeatMode = "off" | "context" | "track";

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  progressMs: number;
  volume: number; // 0–1
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  deviceId?: string;
  isConnected: boolean;
}

export interface PlayerControls {
  play: (track?: Track, context?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (ms: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playPlaylist: (playlist: Playlist) => void;
  toggleLike: (trackId: string) => void;
}

// ============================================================
// Auth State
// ============================================================

export type AppMode = "landing" | "mock" | "spotify";

export interface AuthState {
  mode: AppMode;
  accessToken: string | null;
  expiresAt: number | null;
  spotifyUser: SpotifyUser | null;
  clientId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface SpotifyUser {
  id: string;
  displayName: string;
  email?: string;
  imageUrl?: string;
  product?: "premium" | "free" | "open";
  country?: string;
  followers?: number;
}

// ============================================================
// Settings
// ============================================================

export interface AppSettings {
  crtEffect: boolean;
  pixelAnimations: boolean;
  accentColor: AccentColor;
  reduceMotion: boolean;
  highContrast: boolean;
  compactPlayer: boolean;
  autoplay: boolean;
  showQueueAutomatically: boolean;
  savedVolume: number;
  spotifyClientId: string;
  theme?: 'dark' | 'crt' | 'cyberpunk' | 'oled';
  volumeNormalization?: boolean;
  crossfade?: boolean;
  audioQuality?: 'auto' | 'high' | 'normal' | 'low';
  desktopNotifications?: boolean;
  playlistUpdates?: boolean;
}

export type AccentColor =
  | "green"
  | "purple"
  | "blue"
  | "pink"
  | "orange"
  | "coral"
  | "cyan"
  | "amber"
  | "lavender";

export const ACCENT_COLOR_VALUES: Record<AccentColor, string> = {
  green: "#22C55E",
  purple: "#8B5CF6",
  blue: "#3B82F6",
  pink: "#EC4899",
  orange: "#F97316",
  coral: "#E98A9A",
  cyan: "#7ED6C8",
  amber: "#F0C58B",
  lavender: "#B7A7E5",
};

// ============================================================
// Search
// ============================================================

export interface SearchResults {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

// ============================================================
// Pixel Cover Themes (for mock art)
// ============================================================

export type PixelCoverTheme =
  | "pixel-sunset"
  | "chill-vibes"
  | "coffee-code"
  | "star-gazer"
  | "focus"
  | "midnight-drive"
  | "cyberpunk-city"
  | "cassette-dreams"
  | "pixel-forest"
  | "neon-arcade"
  | "shibuya-rain"
  | "space-station"
  | "fantasy-horizon"
  | "desert-highway"
  | "retro-computer"
  | "velvet-skies"
  | "butterflies";

// ============================================================
// Navigation
// ============================================================

export type NavPage =
  | "home"
  | "search"
  | "library"
  | "liked"
  | "recently-played"
  | "made-for-you"
  | "settings"
  | "profile"
  | "now-playing"
  | { type: "playlist"; id: string }
  | { type: "album"; id: string }
  | { type: "artist"; id: string };

// ============================================================
// Misc
// ============================================================

export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error" | "warning";
  durationMs?: number;
}
