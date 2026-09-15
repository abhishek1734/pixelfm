"use client";

import React from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { playChime } from "@/lib/audioEngine";

interface MiniPlayerProps {
  onOpenDeck: () => void;
  soundFX: boolean;
}

export default function MiniPlayer({ onOpenDeck, soundFX }: MiniPlayerProps) {
  const { currentTrack, isPaused, togglePlay, next } = usePlayer();

  if (!currentTrack) return null;

  const albumArt = currentTrack.album?.images?.[0]?.url;

  return (
    <div
      onClick={() => {
        if (soundFX) playChime("click");
        onOpenDeck();
      }}
      className="flex md:hidden items-center justify-between fixed bottom-[54px] left-2 right-2 z-40 px-3 py-2 rounded-[2px] cursor-pointer select-none transition-all"
      style={{
        backgroundColor: "#070E1A",
        border: "1px solid #22C55E",
        boxShadow: "0 0 14px rgba(34, 197, 94, 0.3), 0 4px 16px rgba(0,0,0,0.9)",
      }}
    >
      {/* Track Info */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
        <div className="w-9 h-9 rounded-[2px] overflow-hidden bg-[#060B12] border border-[#16263D] flex-shrink-0 flex items-center justify-center">
          {albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={albumArt}
              alt=""
              className="w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <span className="text-sm text-[#22C55E]">♫</span>
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-pixel text-[9px] text-[#F8FAFC] truncate tracking-wide">
            {currentTrack.name}
          </span>
          <span className="font-mono text-[9px] text-[#94A3B8] truncate">
            {currentTrack.artists?.[0]?.name || "Unknown"}
          </span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Play/Pause Button */}
        <button
          onClick={() => {
            if (soundFX) playChime("click");
            togglePlay();
          }}
          className="w-8 h-8 rounded-[2px] bg-[#22C55E] flex items-center justify-center text-black font-bold text-xs hover:bg-[#16A34A] transition-colors shadow-sm"
          title={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? "▶" : "⏸"}
        </button>

        {/* Next Button */}
        <button
          onClick={() => {
            if (soundFX) playChime("click");
            next();
          }}
          className="w-7 h-7 rounded-[2px] bg-[#0E1726] border border-[#16253B] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] text-[10px] transition-colors"
          title="Next Track"
        >
          ⏭
        </button>
      </div>
    </div>
  );
}
