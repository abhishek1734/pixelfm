// PIXELIFY — Mock Data Library
// Provides rich, realistic data for demo/preview mode (no Spotify connection required)

import type {
  Track,
  Album,
  Artist,
  Playlist,
  PixelCoverTheme,
} from "@/types/music";

// ============================================================
// Artists
// ============================================================

export const MOCK_ARTISTS: Artist[] = [
  {
    id: "artist_01",
    name: "Lofi Pixels",
    genres: ["lofi hip-hop", "chillhop", "study beats"],
    followers: 284_931,
    imageUrl: undefined,
  },
  {
    id: "artist_02",
    name: "Neon Coast",
    genres: ["synthwave", "retrowave", "darksynth"],
    followers: 512_847,
    imageUrl: undefined,
  },
  {
    id: "artist_03",
    name: "Byte Beats",
    genres: ["chiptune", "8-bit", "game ost"],
    followers: 193_204,
    imageUrl: undefined,
  },
  {
    id: "artist_04",
    name: "Cassette Dreams",
    genres: ["lo-fi", "indie pop", "bedroom pop"],
    followers: 341_788,
    imageUrl: undefined,
  },
  {
    id: "artist_05",
    name: "Synth Wanderer",
    genres: ["ambient synth", "space synth", "new age"],
    followers: 159_302,
    imageUrl: undefined,
  },
  {
    id: "artist_06",
    name: "Pixel Noir",
    genres: ["darksynth", "cyberpunk", "industrial synth"],
    followers: 407_615,
    imageUrl: undefined,
  },
  {
    id: "artist_07",
    name: "Chiptune Cafe",
    genres: ["chiptune", "lofi chiptune", "cozy game"],
    followers: 226_540,
    imageUrl: undefined,
  },
  {
    id: "artist_08",
    name: "Grid Runner",
    genres: ["synthwave", "electro", "outrun"],
    followers: 678_123,
    imageUrl: undefined,
  },
];

// ============================================================
// Albums
// ============================================================

export const MOCK_ALBUMS: Album[] = [
  {
    id: "album_01",
    name: "Midnight Drive",
    artistName: "Lofi Pixels",
    artistId: "artist_01",
    releaseDate: "2024-03-15",
    totalTracks: 12,
    type: "album",
    imageUrl: undefined,
  },
  {
    id: "album_02",
    name: "Neon Horizons",
    artistName: "Neon Coast",
    artistId: "artist_02",
    releaseDate: "2024-07-22",
    totalTracks: 10,
    type: "album",
    imageUrl: undefined,
  },
  {
    id: "album_03",
    name: "8-Bit Chronicles",
    artistName: "Byte Beats",
    artistId: "artist_03",
    releaseDate: "2023-11-01",
    totalTracks: 14,
    type: "album",
    imageUrl: undefined,
  },
  {
    id: "album_04",
    name: "Side B",
    artistName: "Cassette Dreams",
    artistId: "artist_04",
    releaseDate: "2024-01-08",
    totalTracks: 9,
    type: "album",
    imageUrl: undefined,
  },
  {
    id: "album_05",
    name: "Void Transmissions",
    artistName: "Synth Wanderer",
    artistId: "artist_05",
    releaseDate: "2024-05-30",
    totalTracks: 8,
    type: "album",
    imageUrl: undefined,
  },
  {
    id: "album_06",
    name: "District Zero",
    artistName: "Pixel Noir",
    artistId: "artist_06",
    releaseDate: "2024-09-10",
    totalTracks: 11,
    type: "album",
    imageUrl: undefined,
  },
  {
    id: "album_07",
    name: "Morning Brew",
    artistName: "Chiptune Cafe",
    artistId: "artist_07",
    releaseDate: "2024-02-14",
    totalTracks: 10,
    type: "album",
    imageUrl: undefined,
  },
  {
    id: "album_08",
    name: "Outrun Protocol",
    artistName: "Grid Runner",
    artistId: "artist_08",
    releaseDate: "2024-06-01",
    totalTracks: 13,
    type: "album",
    imageUrl: undefined,
  },
];

// ============================================================
// Tracks (20 tracks)
// ============================================================

export const MOCK_TRACKS: Track[] = [
  // --- The Retros — Horizon (Featured in Screenshot) ---
  {
    id: "track_00",
    name: "Pixel Sunset",
    artistName: "The Retros",
    artistId: "artist_retros",
    albumName: "Horizon • 2023",
    albumId: "album_retros",
    albumImageUrl: "",
    durationMs: 236_000, // 3:56
    pixelCover: "pixel-sunset" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 1,
    lyrics: [
      { timeMs: 0, text: "The sky is painted in pixels" },
      { timeMs: 14000, text: "Another day fades away" },
      { timeMs: 28000, text: "City lights begin to flicker" },
      { timeMs: 42000, text: "And we're still here, the same" },
      { timeMs: 56000, text: "Lost in a horizon" },
      { timeMs: 70000, text: "Where the colors never change" },
      { timeMs: 84000, text: "Just you and me" },
      { timeMs: 98000, text: "In this retro frame" },
      { timeMs: 118000, text: "The sky is painted in pixels" },
      { timeMs: 135000, text: "Another day fades away" },
      { timeMs: 150000, text: "City lights begin to flicker" },
      { timeMs: 168000, text: "And we're still here, the same" },
      { timeMs: 185000, text: "Just you and me" },
      { timeMs: 205000, text: "In this retro frame" },
    ],
  },
  // --- Midnight Drive — Synthwave ---
  {
    id: "track_01",
    name: "Midnight Drive",
    artistName: "Synthwave",
    artistId: "artist_01",
    albumName: "Midnight Drive",
    albumId: "album_01",
    albumImageUrl: "",
    durationMs: 252_000, // 4:12
    pixelCover: "midnight-drive" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 2,
    lyrics: [
      { timeMs: 0, text: "City quiet, engines low" },
      { timeMs: 15000, text: "Watching distant streetlights glow" },
      { timeMs: 30000, text: "Miles of asphalt, tape in deck" },
      { timeMs: 45000, text: "Memories we can't forget" },
    ],
  },
  // --- Forest Rain — Lo-Fi Beats ---
  {
    id: "track_fr",
    name: "Forest Rain",
    artistName: "Lo-Fi Beats",
    artistId: "artist_ambient",
    albumName: "Ambient Horizons",
    albumId: "album_ambient",
    albumImageUrl: "",
    durationMs: 208_000, // 3:28
    pixelCover: "pixel-forest" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 3,
  },
  // --- Neon City — Night Tempo ---
  {
    id: "track_nc",
    name: "Neon City",
    artistName: "Night Tempo",
    artistId: "artist_sc",
    albumName: "Cyber Grid",
    albumId: "album_sc",
    albumImageUrl: "",
    durationMs: 191_000, // 3:11
    pixelCover: "cyberpunk-city" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 4,
  },
  // --- Coffee & Code — Lofi Lane ---
  {
    id: "track_cc",
    name: "Coffee & Code",
    artistName: "Lofi Lane",
    artistId: "artist_cb",
    albumName: "Study Sessions",
    albumId: "album_cb",
    albumImageUrl: "",
    durationMs: 177_000, // 2:57
    pixelCover: "coffee-code" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 5,
  },
  // --- Star Gazer — Cosmic Keys ---
  {
    id: "track_sg",
    name: "Star Gazer",
    artistName: "Cosmic Keys",
    artistId: "artist_cw",
    albumName: "Deep Orbit",
    albumId: "album_cw",
    albumImageUrl: "",
    durationMs: 243_000, // 4:03
    pixelCover: "star-gazer" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 6,
  },
  // --- Velvet Skies — Dreamwave (Featured in Search) ---
  {
    id: "track_vs",
    name: "Velvet Skies",
    artistName: "Dreamwave",
    artistId: "artist_dw",
    albumName: "Pastel Horizons",
    albumId: "album_dw",
    albumImageUrl: "",
    durationMs: 261_000, // 4:21
    pixelCover: "velvet-skies" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 7,
  },
  // --- Tokyo Lights — Night Tempo (Featured in Search) ---
  {
    id: "track_tl",
    name: "Tokyo Lights",
    artistName: "Night Tempo",
    artistId: "artist_sc",
    albumName: "Neon Rainfall",
    albumId: "album_sc",
    albumImageUrl: "",
    durationMs: 217_000, // 3:37
    pixelCover: "shibuya-rain" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 8,
  },
  // --- Butterflies — Indie Bloom (Featured in Search) ---
  {
    id: "track_bf",
    name: "Butterflies",
    artistName: "Indie Bloom",
    artistId: "artist_ib",
    albumName: "Summer Meadow",
    albumId: "album_ib",
    albumImageUrl: "",
    durationMs: 194_000, // 3:14
    pixelCover: "butterflies" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 9,
  },
  // --- Static Love — The Analogues (Featured in Search) ---
  {
    id: "track_sl",
    name: "Static Love",
    artistName: "The Analogues",
    artistId: "artist_ta",
    albumName: "Magnetic Tape",
    albumId: "album_ta",
    albumImageUrl: "",
    durationMs: 248_000, // 4:08
    pixelCover: "cassette-dreams" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 10,
  },
  {
    id: "track_02",
    name: "Late Night Loop",
    artistName: "Lofi Pixels",
    artistId: "artist_01",
    albumName: "Midnight Drive",
    albumId: "album_01",
    albumImageUrl: "",
    durationMs: 215_000,
    pixelCover: "midnight-drive" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 7,
  },
  {
    id: "track_03",
    name: "Rainy Crossroads",
    artistName: "Lofi Pixels",
    artistId: "artist_01",
    albumName: "Midnight Drive",
    albumId: "album_01",
    albumImageUrl: "",
    durationMs: 234_000,
    pixelCover: "shibuya-rain" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 8,
  },
  {
    id: "track_04",
    name: "Synthwave Sunrise",
    artistName: "Neon Coast",
    artistId: "artist_02",
    albumName: "Neon Horizons",
    albumId: "album_02",
    albumImageUrl: "",
    durationMs: 287_000,
    pixelCover: "cyberpunk-city" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 1,
  },
  {
    id: "track_05",
    name: "City Lights",
    artistName: "Neon Coast",
    artistId: "artist_02",
    albumName: "Neon Horizons",
    albumId: "album_02",
    albumImageUrl: "",
    durationMs: 304_000,
    pixelCover: "cyberpunk-city" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 2,
  },
  {
    id: "track_06",
    name: "Desert Highway",
    artistName: "Neon Coast",
    artistId: "artist_02",
    albumName: "Neon Horizons",
    albumId: "album_02",
    albumImageUrl: "",
    durationMs: 320_000,
    pixelCover: "desert-highway" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 3,
  },
  // --- Byte Beats — 8-Bit Chronicles ---
  {
    id: "track_07",
    name: "Neon Arcade (Theme)",
    artistName: "Byte Beats",
    artistId: "artist_03",
    albumName: "8-Bit Chronicles",
    albumId: "album_03",
    albumImageUrl: "",
    durationMs: 162_000,
    pixelCover: "neon-arcade" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 1,
  },
  {
    id: "track_08",
    name: "Boss Rush",
    artistName: "Byte Beats",
    artistId: "artist_03",
    albumName: "8-Bit Chronicles",
    albumId: "album_03",
    albumImageUrl: "",
    durationMs: 178_000,
    pixelCover: "neon-arcade" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 2,
  },
  {
    id: "track_09",
    name: "Pixel Hero March",
    artistName: "Byte Beats",
    artistId: "artist_03",
    albumName: "8-Bit Chronicles",
    albumId: "album_03",
    albumImageUrl: "",
    durationMs: 195_000,
    pixelCover: "fantasy-horizon" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 3,
  },
  // --- Chiptune Cafe — Morning Brew ---
  {
    id: "track_10",
    name: "Coffee & Code",
    artistName: "Chiptune Cafe",
    artistId: "artist_07",
    albumName: "Morning Brew",
    albumId: "album_07",
    albumImageUrl: "",
    durationMs: 242_000,
    pixelCover: "retro-computer" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 1,
  },
  // --- Cassette Dreams — Side B ---
  {
    id: "track_11",
    name: "Cassette Side B",
    artistName: "Cassette Dreams",
    artistId: "artist_04",
    albumName: "Side B",
    albumId: "album_04",
    albumImageUrl: "",
    durationMs: 258_000,
    pixelCover: "cassette-dreams" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 1,
  },
  {
    id: "track_12",
    name: "Analog Warmth",
    artistName: "Cassette Dreams",
    artistId: "artist_04",
    albumName: "Side B",
    albumId: "album_04",
    albumImageUrl: "",
    durationMs: 224_000,
    pixelCover: "cassette-dreams" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 2,
  },
  // --- Synth Wanderer — Void Transmissions ---
  {
    id: "track_13",
    name: "Digital Garden",
    artistName: "Synth Wanderer",
    artistId: "artist_05",
    albumName: "Void Transmissions",
    albumId: "album_05",
    albumImageUrl: "",
    durationMs: 330_000,
    pixelCover: "pixel-forest" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 1,
  },
  {
    id: "track_14",
    name: "Space Station Delta",
    artistName: "Synth Wanderer",
    artistId: "artist_05",
    albumName: "Void Transmissions",
    albumId: "album_05",
    albumImageUrl: "",
    durationMs: 312_000,
    pixelCover: "space-station" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 2,
  },
  // --- Pixel Noir — District Zero ---
  {
    id: "track_15",
    name: "District Zero",
    artistName: "Pixel Noir",
    artistId: "artist_06",
    albumName: "District Zero",
    albumId: "album_06",
    albumImageUrl: "",
    durationMs: 271_000,
    pixelCover: "cyberpunk-city" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 1,
  },
  {
    id: "track_16",
    name: "Rain on Neon",
    artistName: "Pixel Noir",
    artistId: "artist_06",
    albumName: "District Zero",
    albumId: "album_06",
    albumImageUrl: "",
    durationMs: 293_000,
    pixelCover: "shibuya-rain" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 2,
  },
  // --- Grid Runner — Outrun Protocol ---
  {
    id: "track_17",
    name: "Outrun Protocol",
    artistName: "Grid Runner",
    artistId: "artist_08",
    albumName: "Outrun Protocol",
    albumId: "album_08",
    albumImageUrl: "",
    durationMs: 268_000,
    pixelCover: "desert-highway" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 1,
  },
  {
    id: "track_18",
    name: "Chrome Freeway",
    artistName: "Grid Runner",
    artistId: "artist_08",
    albumName: "Outrun Protocol",
    albumId: "album_08",
    albumImageUrl: "",
    durationMs: 249_000,
    pixelCover: "desert-highway" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 2,
  },
  {
    id: "track_19",
    name: "Fantasy Horizon",
    artistName: "Synth Wanderer",
    artistId: "artist_05",
    albumName: "Void Transmissions",
    albumId: "album_05",
    albumImageUrl: "",
    durationMs: 278_000,
    pixelCover: "fantasy-horizon" as PixelCoverTheme,
    isLiked: false,
    isPlayable: true,
    trackNumber: 3,
  },
  {
    id: "track_20",
    name: "Pixel Sunrise",
    artistName: "Chiptune Cafe",
    artistId: "artist_07",
    albumName: "Morning Brew",
    albumId: "album_07",
    albumImageUrl: "",
    durationMs: 207_000,
    pixelCover: "pixel-forest" as PixelCoverTheme,
    isLiked: true,
    isPlayable: true,
    trackNumber: 2,
  },
];

// ============================================================
// Playlists
// ============================================================

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: "playlist_chill_vibes",
    name: "Chill Vibes",
    description: "Lo-fi beats and relaxing melodies",
    ownerName: "PIXELFM",
    trackCount: 6,
    isPublic: true,
    uri: "pixelify:playlist:chill_vibes",
    tracks: [
      MOCK_TRACKS[0], // Pixel Sunset
      MOCK_TRACKS[1], // Midnight Drive
      MOCK_TRACKS[4], // Coffee & Code
      MOCK_TRACKS[2], // Forest Rain
      MOCK_TRACKS[5], // Star Gazer
      MOCK_TRACKS[3], // Neon City
    ],
  },
  {
    id: "playlist_late_night",
    name: "Late Night",
    description: "Ambient sounds for late hours",
    ownerName: "PIXELFM",
    trackCount: 6,
    isPublic: true,
    uri: "pixelify:playlist:late_night",
    tracks: [
      MOCK_TRACKS[1],
      MOCK_TRACKS[0],
      MOCK_TRACKS[5],
      MOCK_TRACKS[6],
      MOCK_TRACKS[7],
      MOCK_TRACKS[8],
    ],
  },
  {
    id: "playlist_focus",
    name: "Focus",
    description: "Instrumental tracks to help you concentrate",
    ownerName: "PIXELFM",
    trackCount: 6,
    isPublic: true,
    uri: "pixelify:playlist:focus",
    tracks: [
      MOCK_TRACKS[4],
      MOCK_TRACKS[2],
      MOCK_TRACKS[5],
      MOCK_TRACKS[0],
      MOCK_TRACKS[1],
      MOCK_TRACKS[3],
    ],
  },
  {
    id: "playlist_discover_weekly",
    name: "Discover Weekly",
    description: "Fresh music picked just for you",
    ownerName: "PIXELFM",
    trackCount: 6,
    isPublic: false,
    uri: "pixelify:playlist:discover_weekly",
    tracks: [
      MOCK_TRACKS[0],
      MOCK_TRACKS[3],
      MOCK_TRACKS[4],
      MOCK_TRACKS[5],
      MOCK_TRACKS[2],
      MOCK_TRACKS[1],
    ],
  },
  {
    id: "playlist_release_radar",
    name: "Release Radar",
    description: "Catch all the latest music from artists you follow",
    ownerName: "PIXELFM",
    trackCount: 6,
    isPublic: false,
    uri: "pixelify:playlist:release_radar",
    tracks: [
      MOCK_TRACKS[3],
      MOCK_TRACKS[0],
      MOCK_TRACKS[2],
      MOCK_TRACKS[1],
      MOCK_TRACKS[5],
      MOCK_TRACKS[4],
    ],
  },
  {
    id: "playlist_01",
    name: "Midnight Sessions",
    description: "Late-night lofi beats to keep you company when the city goes quiet.",
    ownerName: "Lofi Pixels",
    trackCount: 6,
    isPublic: true,
    uri: "pixelify:playlist:playlist_01",
    tracks: [
      MOCK_TRACKS[0],
      MOCK_TRACKS[1],
      MOCK_TRACKS[2],
      MOCK_TRACKS[10],
      MOCK_TRACKS[11],
      MOCK_TRACKS[15],
    ],
  },
  {
    id: "playlist_02",
    name: "Synthwave Drive",
    description: "Neon roads stretch to infinity. Plug in and drive.",
    ownerName: "Neon Coast",
    trackCount: 7,
    isPublic: true,
    uri: "pixelify:playlist:playlist_02",
    tracks: [
      MOCK_TRACKS[3],
      MOCK_TRACKS[4],
      MOCK_TRACKS[5],
      MOCK_TRACKS[16],
      MOCK_TRACKS[17],
      MOCK_TRACKS[14],
      MOCK_TRACKS[13],
    ],
  },
];

// ============================================================
// Mock User
// ============================================================

export const MOCK_USER = {
  id: "player_01",
  displayName: "Player_01",
  product: "premium" as const,
};

// ============================================================
// Recently Played (10 tracks)
// ============================================================

export const MOCK_RECENTLY_PLAYED: Track[] = [
  MOCK_TRACKS[1], // Midnight Drive
  MOCK_TRACKS[0], // Pixel Sunset
  MOCK_TRACKS[2], // Forest Rain
  MOCK_TRACKS[3], // Neon City
  MOCK_TRACKS[4], // Coffee & Code
  MOCK_TRACKS[5], // Star Gazer
];

// ============================================================
// Liked Tracks (12 tracks)
// ============================================================

export const MOCK_LIKED_TRACKS: Track[] = [
  MOCK_TRACKS[0],
  MOCK_TRACKS[2],
  MOCK_TRACKS[3],
  MOCK_TRACKS[6],
  MOCK_TRACKS[8],
  MOCK_TRACKS[9],
  MOCK_TRACKS[11],
  MOCK_TRACKS[13],
  MOCK_TRACKS[14],
  MOCK_TRACKS[16],
  MOCK_TRACKS[19],
  MOCK_TRACKS[4],
];

// ============================================================
// Featured Playlist
// ============================================================

export const MOCK_FEATURED_PLAYLIST: Playlist = MOCK_PLAYLISTS[0];

// ============================================================
// Made For You (4 playlists)
// ============================================================

export const MOCK_MADE_FOR_YOU: Playlist[] = [
  MOCK_PLAYLISTS[5],
  {
    id: "mfy_01",
    name: "Daily Mix 1",
    description: "Lofi Pixels, Cassette Dreams and more",
    ownerName: "PIXELIFY",
    trackCount: 6,
    isPublic: false,
    uri: "pixelify:playlist:mfy_01",
    tracks: [
      MOCK_TRACKS[0],
      MOCK_TRACKS[1],
      MOCK_TRACKS[10],
      MOCK_TRACKS[11],
      MOCK_TRACKS[2],
      MOCK_TRACKS[9],
    ],
  },
  {
    id: "mfy_02",
    name: "Release Radar",
    description: "Catch all the latest from artists you follow",
    ownerName: "PIXELIFY",
    trackCount: 5,
    isPublic: false,
    uri: "pixelify:playlist:mfy_02",
    tracks: [
      MOCK_TRACKS[16],
      MOCK_TRACKS[17],
      MOCK_TRACKS[14],
      MOCK_TRACKS[15],
      MOCK_TRACKS[19],
    ],
  },
  {
    id: "mfy_03",
    name: "Pixel Radio",
    description: "Non-stop pixel jams curated for your taste",
    ownerName: "PIXELIFY",
    trackCount: 8,
    isPublic: false,
    uri: "pixelify:playlist:mfy_03",
    tracks: [
      MOCK_TRACKS[3],
      MOCK_TRACKS[6],
      MOCK_TRACKS[13],
      MOCK_TRACKS[18],
      MOCK_TRACKS[7],
      MOCK_TRACKS[4],
      MOCK_TRACKS[8],
      MOCK_TRACKS[5],
    ],
  },
];

// ============================================================
// Search Results (demo)
// ============================================================

export const MOCK_SEARCH_RESULTS = {
  tracks: [
    MOCK_TRACKS[0],
    MOCK_TRACKS[3],
    MOCK_TRACKS[6],
    MOCK_TRACKS[9],
    MOCK_TRACKS[14],
    MOCK_TRACKS[16],
    MOCK_TRACKS[13],
    MOCK_TRACKS[2],
  ],
  artists: [
    MOCK_ARTISTS[0],
    MOCK_ARTISTS[1],
    MOCK_ARTISTS[2],
    MOCK_ARTISTS[5],
    MOCK_ARTISTS[7],
  ],
  albums: [
    MOCK_ALBUMS[0],
    MOCK_ALBUMS[1],
    MOCK_ALBUMS[2],
    MOCK_ALBUMS[5],
    MOCK_ALBUMS[7],
  ],
  playlists: [
    MOCK_PLAYLISTS[0],
    MOCK_PLAYLISTS[1],
    MOCK_PLAYLISTS[3],
    MOCK_PLAYLISTS[4],
  ],
};
