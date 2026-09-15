import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { MusicDataProvider } from "@/contexts/MusicDataContext";

export const metadata: Metadata = {
  title: "PixelFM — 8-Bit Hi-Fi Web Station",
  description:
    "A retro-cyberpunk Spotify streaming station with pixel art aesthetics, CRT scanlines, and a dancing cat mascot.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='28' font-size='28'>🎮</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <PlayerProvider>
            <MusicDataProvider>
              {children}
            </MusicDataProvider>
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
