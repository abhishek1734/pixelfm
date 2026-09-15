"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { getPlaylistDetails, SpotifyPlaylist, SpotifyTrack } from "@/lib/spotify";
import { playChime } from "@/lib/audioEngine";

interface PlaylistDetailViewProps {
  playlistId: string;
  initialPlaylist?: SpotifyPlaylist;
  onBack: () => void;
  soundFX: boolean;
}

export default function PlaylistDetailView({
  playlistId,
  initialPlaylist,
  onBack,
  soundFX,
}: PlaylistDetailViewProps) {
  const { accessToken } = useAuth();
  const { currentTrack, isPaused, playTrack, togglePlay } = usePlayer();

  const [playlist, setPlaylist] = useState<SpotifyPlaylist | null>(initialPlaylist || null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      if (accessToken) {
        try {
          const res = await getPlaylistDetails(accessToken, playlistId);
          if (isMounted) {
            if (res) {
              setPlaylist(res.playlist);
              setTracks(res.tracks);
            } else {
              setError("Could not load playlist details from Spotify.");
            }
          }
        } catch {
          if (isMounted) setError("Failed to fetch playlist tracks.");
        }
      } else {
        // Demo fallback tracks
        if (isMounted) {
          setPlaylist(
            initialPlaylist || {
              id: playlistId,
              name: "Demo Playlist",
              description: "PixelFM Retro Chiptune & Synthwave collection",
              images: [],
              tracks: { total: 8 },
              uri: `spotify:playlist:${playlistId}`,
              owner: { display_name: "PixelFM" },
              public: true,
            }
          );
          setTracks([
            {
              id: "demo-track-1",
              name: "Larusso",
              uri: "spotify:track:demo1",
              duration_ms: 147000,
              explicit: false,
              artists: [{ id: "art-1", name: "Titus Haskins", uri: "", external_urls: { spotify: "" } }],
              album: {
                id: "alb-1",
                name: "Summer Nostalgia",
                images: [{ url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80", width: 400, height: 400 }],
                artists: [],
                uri: "",
                release_date: "2023",
              },
              external_urls: { spotify: "" },
            },
            {
              id: "demo-track-2",
              name: "Midnight City Lights",
              uri: "spotify:track:demo2",
              duration_ms: 215000,
              explicit: false,
              artists: [{ id: "art-2", name: "Neon Dreamer", uri: "", external_urls: { spotify: "" } }],
              album: {
                id: "alb-2",
                name: "Synthwave Horizon",
                images: [{ url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80", width: 400, height: 400 }],
                artists: [],
                uri: "",
                release_date: "2022",
              },
              external_urls: { spotify: "" },
            },
            {
              id: "demo-track-3",
              name: "Rainy Afternoon in Tokyo",
              uri: "spotify:track:demo3",
              duration_ms: 182000,
              explicit: false,
              artists: [{ id: "art-3", name: "Lo-Fi Cafe", uri: "", external_urls: { spotify: "" } }],
              album: {
                id: "alb-3",
                name: "Chilled Beats Vol. 4",
                images: [{ url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80", width: 400, height: 400 }],
                artists: [],
                uri: "",
                release_date: "2024",
              },
              external_urls: { spotify: "" },
            },
          ]);
        }
      }

      if (isMounted) setIsLoading(false);
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [accessToken, playlistId, initialPlaylist]);

  const formatDuration = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlayAll = () => {
    if (soundFX) playChime("click");
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const handlePlayTrack = (track: SpotifyTrack) => {
    if (soundFX) playChime("click");
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, tracks);
    }
  };

  const coverUrl = playlist?.images?.[0]?.url;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-3 sm:px-6 py-4 pb-32">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => {
            if (soundFX) playChime("click");
            onBack();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-pixel text-[#22C55E] border border-[#22C55E]/40 hover:border-[#22C55E] hover:bg-[#22C55E]/10 transition-colors rounded-[2px]"
        >
          <span>←</span>
          <span>BACK TO LIBRARY</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 rounded-[2px] mb-6"
        style={{
          backgroundColor: "#070E1A",
          border: "1px solid #142236",
        }}
      >
        {/* Cover Art */}
        <div
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2px] flex-shrink-0 overflow-hidden relative"
          style={{ border: "2px solid #16263D", backgroundColor: "#060B12" }}
        >
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt={playlist?.name || "Playlist"}
              className="w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-[#22C55E]">
              ♫
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[7px] text-[#22C55E] tracking-wider uppercase px-1.5 py-0.5 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-[2px]">
              PLAYLIST
            </span>
            {playlist?.public && (
              <span className="font-mono text-[9px] text-[#64748B]">PUBLIC</span>
            )}
          </div>

          <h1 className="font-pixel text-base sm:text-xl text-[#F8FAFC] tracking-wide truncate">
            {playlist?.name || "Untitled Playlist"}
          </h1>

          {playlist?.description && (
            <p className="font-mono text-[10px] text-[#94A3B8] line-clamp-2">
              {playlist.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-[10px] font-mono text-[#64748B] mt-1">
            <span>By <strong className="text-[#E2E8F0]">{playlist?.owner?.display_name || "Spotify"}</strong></span>
            <span>•</span>
            <span className="text-[#22C55E]">{tracks.length || playlist?.tracks?.total || 0} songs</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2.5 mt-2">
            <button
              onClick={handlePlayAll}
              disabled={tracks.length === 0}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#22C55E] text-black font-pixel text-[8px] rounded-[2px] font-bold shadow-md hover:bg-[#16A34A] transition-all disabled:opacity-50"
            >
              <span>▶</span>
              <span>PLAY ALL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <div
        className="rounded-[2px] overflow-hidden"
        style={{
          backgroundColor: "#070E1A",
          border: "1px solid #142236",
        }}
      >
        {/* Table Header */}
        <div
          className="grid grid-cols-12 px-3 py-2 border-b border-[#142236] text-[8px] font-pixel text-[#64748B] tracking-wider"
          style={{ backgroundColor: "#060B12" }}
        >
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-7 sm:col-span-6">TITLE</div>
          <div className="hidden sm:block sm:col-span-3">ALBUM</div>
          <div className="col-span-4 sm:col-span-2 text-right pr-2">TIME</div>
        </div>

        {/* Loading / Error / Empty States */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <div className="font-pixel text-[9px] text-[#22C55E] animate-pulse">
              LOADING TRACKS FROM SPOTIFY...
            </div>
          </div>
        ) : error ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-center px-4">
            <div className="text-amber-400 font-pixel text-[9px]">{error}</div>
            <button
              onClick={onBack}
              className="mt-2 px-3 py-1 font-pixel text-[8px] text-[#22C55E] border border-[#22C55E]/40"
            >
              [ RETURN ]
            </button>
          </div>
        ) : tracks.length === 0 ? (
          <div className="py-12 text-center text-[#64748B] font-pixel text-[9px]">
            THIS PLAYLIST HAS NO TRACKS
          </div>
        ) : (
          <div className="divide-y divide-[#142236]/60">
            {tracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              const isPlayingThis = isCurrent && !isPaused;

              return (
                <div
                  key={track.id || idx}
                  onClick={() => handlePlayTrack(track)}
                  className={`grid grid-cols-12 items-center px-3 py-2 cursor-pointer transition-colors group ${
                    isCurrent
                      ? "bg-[#22C55E]/10 text-[#22C55E]"
                      : "hover:bg-[#0B1526] text-[#E2E8F0]"
                  }`}
                >
                  {/* Track Number / Play icon */}
                  <div className="col-span-1 text-center font-mono text-[10px] text-[#64748B]">
                    <span className="group-hover:hidden">
                      {isPlayingThis ? "▶" : idx + 1}
                    </span>
                    <span className="hidden group-hover:inline text-[#22C55E]">
                      {isPlayingThis ? "⏸" : "▶"}
                    </span>
                  </div>

                  {/* Title & Artist */}
                  <div className="col-span-7 sm:col-span-6 flex items-center gap-2.5 min-w-0 pr-2">
                    {track.album?.images?.[0]?.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={track.album.images[0].url}
                        alt=""
                        className="w-7 h-7 rounded-[2px] object-cover flex-shrink-0 hidden sm:block"
                        style={{ imageRendering: "pixelated" }}
                      />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`font-mono text-[11px] truncate ${
                          isCurrent ? "text-[#22C55E] font-bold" : "text-[#F8FAFC]"
                        }`}
                      >
                        {track.name}
                      </span>
                      <span className="font-mono text-[9px] text-[#94A3B8] truncate">
                        {track.artists?.map((a) => a.name).join(", ") || "Unknown Artist"}
                      </span>
                    </div>
                  </div>

                  {/* Album Name (hidden on small screens) */}
                  <div className="hidden sm:block sm:col-span-3 font-mono text-[10px] text-[#64748B] truncate pr-2">
                    {track.album?.name || "—"}
                  </div>

                  {/* Duration */}
                  <div className="col-span-4 sm:col-span-2 text-right pr-2 font-mono text-[10px] text-[#94A3B8]">
                    {formatDuration(track.duration_ms)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
