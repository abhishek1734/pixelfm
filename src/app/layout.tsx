import type { Metadata } from "next";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import { PlayerProvider } from "@/context/PlayerContext";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "PIXELIFY — 16-Bit Retro Digital Music Player",
  description:
    "A custom 16-bit retro pixel-art listening experience for your Spotify library. Powered by official Spotify OAuth and Web Playback technology.",
  keywords: [
    "Spotify",
    "pixel art",
    "retro music player",
    "16-bit",
    "chiptune",
    "web playback",
    "pixelify",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen:wght@400;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-bg-primary text-text-primary overflow-hidden select-none">
        <SettingsProvider>
          <AuthProvider>
            <PlayerProvider>{children}</PlayerProvider>
          </AuthProvider>
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  );
}
