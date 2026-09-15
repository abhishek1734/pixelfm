# 🎮 PixelFM — 8-Bit Cyber-Retro Spotify Hi-Fi Web Station

> **A retro-cyberpunk Spotify streaming station fusing 1990s Japanese arcade aesthetics with modern Hi-Fi audio.**

PixelFM transforms daily music listening into a tactile, cozy, retro-futuristic desktop console — complete with CRT scanline shaders, a pixel art cat mascot that dances to the beat, a 16-bar spectrum visualizer, and seamless Spotify Connect device switching.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **PKCE OAuth** | 100% client-side auth — no server, no secrets |
| 🎵 **Web Playback SDK** | Your browser becomes a Spotify Connect speaker |
| 📺 **CRT Scanlines** | Toggleable phosphor glow + vignette overlay |
| 🐱 **Pixel Cat Mascot** | 12×14 pure-CSS cat: grooves, sleeps, gets surprised |
| 📊 **Spectrum EQ** | Canvas 16-bar visualizer (green→amber→pink gradient) |
| 🔁 **Full Transport** | Play/pause, seek, shuffle, 3-mode repeat, skip |
| 📱 **Spotify Connect** | Transfer playback from phone/desktop to browser tab |
| 📚 **Library** | Playlists + liked songs with album art |
| 🔍 **Search** | Full Spotify catalog search (tracks + playlists) |
| 🎵 **8-bit SFX** | Chiptune click/success/boot/track-switch sounds |
| ⚙️ **Spotify Doctor** | Widevine DRM check, SDK status, Connect monitor |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- A [Spotify account](https://spotify.com) — **Premium required** for Web Playback SDK
- A [Spotify Developer App](https://developer.spotify.com/dashboard)

### 1. Clone the repo

```bash
git clone https://github.com/abhishek1734/pixelfm.git
cd pixelfm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/callback
```

### 4. Add redirect URI in Spotify Dashboard

In your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):
- Open your app → **Settings** → **Edit**
- Add `http://localhost:3000/callback` to **Redirect URIs**
- Save

### 5. Run

```bash
npm run dev
```

Open **http://localhost:3000** in **Chrome** (required for Widevine DRM / Web Playback SDK).

---

## 🎨 Design System

Built with **Tailwind CSS v4** (CSS-first, no config file) and custom `@theme` tokens:

| Token | Value | Usage |
|---|---|---|
| `--color-void` | `#0A0F17` | Deepest background |
| `--color-surface` | `#0E1521` | Card surfaces |
| `--color-phosphor` | `#22C55E` | Primary accent (terminal green) |
| `--color-amber` | `#F59E0B` | Secondary accent (cassette gold) |
| `--font-pixel` | Press Start 2P | Headings, labels |
| `--font-mono` | JetBrains Mono | Track names, data |

---

## 🛠 Tech Stack

- **Next.js 15** — App Router, TypeScript, Turbopack
- **Tailwind CSS v4** — CSS-first, `@theme {}` tokens
- **Spotify Web Playback SDK** — In-browser audio engine
- **Spotify Web API** — PKCE OAuth, player controls, library, search
- **Web Audio API** — 8-bit chiptune sound effects
- **Canvas API** — Real-time spectrum visualizer

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Arcade boot-up landing screen
│   ├── callback/         # PKCE OAuth callback handler
│   └── player/           # Main station view
├── contexts/
│   ├── AuthContext.tsx   # Spotify PKCE auth + token refresh
│   ├── PlayerContext.tsx # Web Playback SDK + controls
│   └── MusicDataContext.tsx # Library, search
├── lib/
│   ├── pkce.ts           # SHA-256 PKCE crypto helpers
│   ├── spotify.ts        # Typed Web API wrapper
│   └── audioEngine.ts    # 8-bit chiptune + stream player
└── components/
    ├── CRTOverlay.tsx    # Scanlines + vignette
    ├── PixelCat.tsx      # Animated pixel art mascot
    ├── SpectrumVisualizer.tsx
    ├── NowPlayingDeck.tsx # Hero player controls
    ├── TopBar.tsx
    ├── Sidebar.tsx
    ├── DeviceManager.tsx
    ├── QueueDrawer.tsx
    └── SettingsPanel.tsx
```

---

## 📝 License

MIT — for personal use. Spotify branding subject to [Spotify Developer Policy](https://developer.spotify.com/policy).
