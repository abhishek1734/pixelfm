"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { getAlbumDetails, SpotifyAlbum, SpotifyTrack } from "@/lib/spotify";
import { playChime } from "@/lib/audioEngine";

interface AlbumDetailViewProps {
  albumId: string;
  initialAlbum?: SpotifyAlbum;
  onBack: () => void;
  soundFX: boolean;
}

export default function AlbumDetailView({
  albumId,
  initialAlbum,
  onBack,
  soundFX,
}: AlbumDetailViewProps) {
  const { accessToken } = useAuth();
  const { currentTrack, isPaused, playTrack, togglePlay } = usePlayer();

  const [album, setAlbum] = useState<SpotifyAlbum | null>(initialAlbum || null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAlbum() {
      setIsLoading(true);
      setError(null);

      if (accessToken) {
        try {
          const res = await getAlbumDetails(accessToken, albumId);
          if (isMounted) {
            if (res) {
              setAlbum(res.album);
              setTracks(res.tracks);
            } else {
              setError("Could not load album details from Spotify.");
            }
          }
        } catch {
          if (isMounted) setError("Failed to fetch album tracks.");
        }
      } else {
        if (isMounted) {
          setAlbum(
            initialAlbum || {
              id: albumId,
              name: "Demo Album",
              images: [],
              artists: [{ id: "art-1", name: "Pixel Artist", uri: "", external_urls: { spotify: "" } }],
              uri: `spotify:album:${albumId}`,
              release_date: "2024",
              total_tracks: 5,
            }
          );
        }
      }

      if (isMounted) setIsLoading(false);
    }

    loadAlbum();
    return () => {
      isMounted = false;
    };
  }, [accessToken, albumId, initialAlbum]);

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

  const coverUrl = album?.images?.[0]?.url;

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
          <span>BACK</span>
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
              alt={album?.name || "Album"}
              className="w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-[#22C55E]">
              ◉
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <span className="font-pixel text-[7px] text-[#22C55E] tracking-wider uppercase px-1.5 py-0.5 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-[2px] w-fit">
            ALBUM
          </span>

          <h1 className="font-pixel text-base sm:text-xl text-[#F8FAFC] tracking-wide truncate">
            {album?.name || "Untitled Album"}
          </h1>

          <div className="flex items-center gap-2 text-[11px] font-mono text-[#E2E8F0]">
            <span>{album?.artists?.map((a) => a.name).join(", ") || "Unknown Artist"}</span>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-mono text-[#64748B] mt-1">
            <span>{album?.release_date ? new Date(album.release_date).getFullYear() : "—"}</span>
            <span>•</span>
            <span className="text-[#22C55E]">{tracks.length || album?.total_tracks || 0} tracks</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2.5 mt-2">
            <button
              onClick={handlePlayAll}
              disabled={tracks.length === 0}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#22C55E] text-black font-pixel text-[8px] rounded-[2px] font-bold shadow-md hover:bg-[#16A34A] transition-all disabled:opacity-50"
            >
              <span>▶</span>
              <span>PLAY ALBUM</span>
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
        <div
          className="grid grid-cols-12 px-3 py-2 border-b border-[#142236] text-[8px] font-pixel text-[#64748B] tracking-wider"
          style={{ backgroundColor: "#060B12" }}
        >
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-8 sm:col-span-9">TITLE</div>
          <div className="col-span-3 sm:col-span-2 text-right pr-2">TIME</div>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <div className="font-pixel text-[9px] text-[#22C55E] animate-pulse">
              LOADING ALBUM TRACKS...
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
            NO TRACKS FOUND
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
                  <div className="col-span-1 text-center font-mono text-[10px] text-[#64748B]">
                    <span className="group-hover:hidden">
                      {isPlayingThis ? "▶" : idx + 1}
                    </span>
                    <span className="hidden group-hover:inline text-[#22C55E]">
                      {isPlayingThis ? "⏸" : "▶"}
                    </span>
                  </div>

                  <div className="col-span-8 sm:col-span-9 flex flex-col min-w-0 pr-2">
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

                  <div className="col-span-3 sm:col-span-2 text-right pr-2 font-mono text-[10px] text-[#94A3B8]">
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
