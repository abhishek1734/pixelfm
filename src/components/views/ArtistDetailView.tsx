"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { getArtistDetails, SpotifyArtist, SpotifyAlbum, SpotifyTrack } from "@/lib/spotify";
import { playChime } from "@/lib/audioEngine";

interface ArtistDetailViewProps {
  artistId: string;
  initialArtist?: SpotifyArtist;
  onBack: () => void;
  soundFX: boolean;
  onSelectAlbum?: (album: SpotifyAlbum) => void;
}

export default function ArtistDetailView({
  artistId,
  initialArtist,
  onBack,
  soundFX,
  onSelectAlbum,
}: ArtistDetailViewProps) {
  const { accessToken } = useAuth();
  const { currentTrack, isPaused, playTrack, togglePlay } = usePlayer();

  const [artist, setArtist] = useState<SpotifyArtist | null>(initialArtist || null);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadArtist() {
      setIsLoading(true);
      setError(null);

      if (accessToken) {
        try {
          const res = await getArtistDetails(accessToken, artistId);
          if (isMounted) {
            if (res) {
              setArtist(res.artist);
              setTopTracks(res.topTracks);
              setAlbums(res.albums);
            } else {
              setError("Could not load artist details from Spotify.");
            }
          }
        } catch {
          if (isMounted) setError("Failed to fetch artist details.");
        }
      } else {
        if (isMounted) {
          setArtist(
            initialArtist || {
              id: artistId,
              name: "Titus Haskins",
              uri: `spotify:artist:${artistId}`,
              images: [],
              genres: ["synthwave", "retropop", "chiptune"],
              external_urls: { spotify: "" },
            }
          );
        }
      }

      if (isMounted) setIsLoading(false);
    }

    loadArtist();
    return () => {
      isMounted = false;
    };
  }, [accessToken, artistId, initialArtist]);

  const formatDuration = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlayTrack = (track: SpotifyTrack) => {
    if (soundFX) playChime("click");
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, topTracks);
    }
  };

  const artistImage = artist?.images?.[0]?.url;

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
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-[2px] mb-6"
        style={{
          backgroundColor: "#070E1A",
          border: "1px solid #142236",
        }}
      >
        {/* Artist Image */}
        <div
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden flex-shrink-0 relative"
          style={{ border: "2px solid #22C55E", backgroundColor: "#060B12" }}
        >
          {artistImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={artistImage}
              alt={artist?.name || "Artist"}
              className="w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-[#22C55E]">
              👤
            </div>
          )}
        </div>

        {/* Artist Details */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <span className="font-pixel text-[7px] text-[#22C55E] tracking-wider uppercase px-1.5 py-0.5 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-[2px] w-fit">
            ARTIST
          </span>

          <h1 className="font-pixel text-base sm:text-2xl text-[#F8FAFC] tracking-wide truncate">
            {artist?.name || "Artist"}
          </h1>

          {artist?.genres && artist.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {artist.genres.slice(0, 4).map((g) => (
                <span
                  key={g}
                  className="font-mono text-[9px] text-[#38BDF8] px-1.5 py-0.5 bg-[#38BDF8]/10 border border-[#38BDF8]/30 rounded-[2px] uppercase"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popular Tracks Section */}
      <div className="mb-6">
        <h2 className="font-pixel text-[10px] text-[#22C55E] tracking-wider mb-2 flex items-center gap-1.5">
          <span>// POPULAR TRACKS</span>
        </h2>

        <div
          className="rounded-[2px] overflow-hidden"
          style={{
            backgroundColor: "#070E1A",
            border: "1px solid #142236",
          }}
        >
          {isLoading ? (
            <div className="py-8 text-center font-pixel text-[9px] text-[#22C55E] animate-pulse">
              LOADING TOP TRACKS...
            </div>
          ) : topTracks.length === 0 ? (
            <div className="py-8 text-center font-pixel text-[9px] text-[#64748B]">
              NO TRACKS AVAILABLE
            </div>
          ) : (
            <div className="divide-y divide-[#142236]/60">
              {topTracks.slice(0, 5).map((track, idx) => {
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
                      <span className="group-hover:hidden">{isPlayingThis ? "▶" : idx + 1}</span>
                      <span className="hidden group-hover:inline text-[#22C55E]">
                        {isPlayingThis ? "⏸" : "▶"}
                      </span>
                    </div>

                    <div className="col-span-8 sm:col-span-9 flex items-center gap-2.5 min-w-0 pr-2">
                      {track.album?.images?.[0]?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={track.album.images[0].url}
                          alt=""
                          className="w-7 h-7 rounded-[2px] object-cover flex-shrink-0"
                          style={{ imageRendering: "pixelated" }}
                        />
                      )}
                      <span
                        className={`font-mono text-[11px] truncate ${
                          isCurrent ? "text-[#22C55E] font-bold" : "text-[#F8FAFC]"
                        }`}
                      >
                        {track.name}
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

      {/* Albums / Discography Section */}
      {albums.length > 0 && (
        <div>
          <h2 className="font-pixel text-[10px] text-[#22C55E] tracking-wider mb-2 flex items-center gap-1.5">
            <span>// DISCOGRAPHY</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {albums.map((alb) => (
              <div
                key={alb.id}
                onClick={() => {
                  if (soundFX) playChime("click");
                  if (onSelectAlbum) onSelectAlbum(alb);
                }}
                className="p-2.5 rounded-[2px] transition-all cursor-pointer group"
                style={{
                  backgroundColor: "#070E1A",
                  border: "1px solid #142236",
                }}
              >
                <div className="w-full aspect-square rounded-[2px] overflow-hidden mb-2 bg-[#060B12] relative">
                  {alb.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={alb.images[0].url}
                      alt={alb.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl text-[#22C55E]">
                      ◉
                    </div>
                  )}
                </div>
                <div className="font-pixel text-[8px] text-[#F8FAFC] truncate mb-0.5">
                  {alb.name}
                </div>
                <div className="font-mono text-[8px] text-[#64748B]">
                  {alb.release_date ? new Date(alb.release_date).getFullYear() : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
