"use client";

import React from "react";
import { useMusicData } from "@/contexts/MusicDataContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { playChime } from "@/lib/audioEngine";

interface DiscoverViewProps {
  soundFX: boolean;
}

export default function DiscoverView({ soundFX }: DiscoverViewProps) {
  const { featuredPlaylists, newReleases, topArtists, openPlaylist, openAlbum, openArtist } = useMusicData();
  const { playContext } = usePlayer();

  return (
    <div className="flex flex-col gap-6 p-3 sm:p-5 pb-32 overflow-y-auto h-full select-none">
      {/* Header */}
      <div className="flex flex-col pt-1">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[13px] text-[#22C55E]">//</span>
          <span
            className="font-pixel text-[13px] text-[#F8FAFC] tracking-wider"
            style={{ textShadow: "0 0 10px rgba(34, 197, 94, 0.4)" }}
          >
            DISCOVER & FEATURED
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#64748B] mt-1">
          Hand-picked curation, fresh releases, and trending radar.
        </span>
      </div>

      {/* SECTION 1: FEATURED PLAYLISTS */}
      {featuredPlaylists.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[9px] text-[#22C55E] tracking-wider flex items-center gap-1.5">
              <span>★</span>
              <span>FEATURED STATIONS</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {featuredPlaylists.slice(0, 6).map((pl) => (
              <div
                key={pl.id}
                onClick={() => {
                  if (soundFX) playChime("click");
                  openPlaylist(pl.id, pl);
                }}
                className="group flex flex-col p-2.5 rounded-[2px] cursor-pointer transition-all hover:border-[#22C55E]"
                style={{
                  backgroundColor: "#070D17",
                  border: "1px solid #142236",
                }}
              >
                <div className="relative w-full aspect-square rounded-[2px] overflow-hidden bg-[#0A0F17] border border-[#162235] mb-2 flex items-center justify-center">
                  {pl.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pl.images[0].url}
                      alt={pl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <span className="text-2xl text-[#22C55E]">♫</span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="font-pixel text-[8px] text-[#22C55E]">▶ EXPLORE</span>
                  </div>
                </div>

                <span className="font-pixel text-[8px] text-[#F8FAFC] truncate">
                  {pl.name}
                </span>
                <span className="font-mono text-[8px] text-[#64748B] truncate mt-0.5">
                  {pl.tracks?.total ?? 0} tracks
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: NEW RELEASES */}
      {newReleases.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[9px] text-[#F59E0B] tracking-wider flex items-center gap-1.5">
              <span>◉</span>
              <span>NEW RELEASES</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {newReleases.slice(0, 6).map((album) => (
              <div
                key={album.id}
                onClick={() => {
                  if (soundFX) playChime("click");
                  openAlbum(album.id, album);
                }}
                className="group flex flex-col p-2.5 rounded-[2px] cursor-pointer transition-all hover:border-[#F59E0B]"
                style={{
                  backgroundColor: "#070D17",
                  border: "1px solid #142236",
                }}
              >
                <div className="relative w-full aspect-square rounded-[2px] overflow-hidden bg-[#0A0F17] border border-[#162235] mb-2 flex items-center justify-center">
                  {album.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={album.images[0].url}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <span className="text-2xl text-[#F59E0B]">◉</span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="font-pixel text-[8px] text-[#F59E0B]">▶ VIEW</span>
                  </div>
                </div>

                <span className="font-pixel text-[8px] text-[#F8FAFC] truncate">
                  {album.name}
                </span>
                <span className="font-mono text-[8px] text-[#64748B] truncate mt-0.5">
                  {album.artists?.[0]?.name || "Artist"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: TOP ARTISTS RADAR */}
      {topArtists.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[9px] text-[#38BDF8] tracking-wider flex items-center gap-1.5">
              <span>👤</span>
              <span>TOP ARTISTS RADAR</span>
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {topArtists.slice(0, 6).map((artist) => (
              <div
                key={artist.id}
                onClick={() => {
                  if (soundFX) playChime("click");
                  openArtist(artist.id, artist);
                }}
                className="flex flex-col items-center text-center p-2 rounded-[2px] cursor-pointer group hover:bg-[#0E1726] transition-colors"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border border-[#162235] group-hover:border-[#38BDF8] transition-all mb-1.5">
                  {artist.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#162032] flex items-center justify-center text-xl">
                      👤
                    </div>
                  )}
                </div>
                <span className="font-pixel text-[7px] text-[#F8FAFC] truncate w-full">
                  {artist.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
