"use client";

import React, { useState, useRef, useCallback } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useMusicData } from "@/contexts/MusicDataContext";
import SpectrumVisualizer from "./SpectrumVisualizer";
import { playChime } from "@/lib/audioEngine";

// ============================================================
// NowPlayingDeck — Cyberpunk rack-mount player deck
// ============================================================

function formatTime(ms: number): string {
  if (!ms || ms <= 0) return "0:00";
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function NowPlayingDeck({
  soundFX,
  onClose,
}: {
  soundFX: boolean;
  onClose?: () => void;
}) {
  const {
    currentTrack,
    isPaused,
    position,
    duration,
    volume,
    shuffle,
    repeatMode,
    togglePlay,
    seek,
    next,
    previous,
    setPlayerVolume,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();

  const { likedTracks } = useMusicData();
  const [isLikedLocal, setIsLikedLocal] = useState<boolean | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Check if current track is liked
  const isLiked =
    isLikedLocal !== null
      ? isLikedLocal
      : currentTrack
      ? likedTracks.some((t) => t.id === currentTrack.id)
      : false;

  const handleToggleLike = () => {
    if (soundFX) playChime("click");
    setIsLikedLocal(!isLiked);
  };

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(ratio * duration);
    },
    [seek, duration]
  );

  const handleAction = useCallback(
    async (action: () => Promise<void>) => {
      if (soundFX) playChime("click");
      await action();
    },
    [soundFX]
  );

  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;
  const albumArt = currentTrack?.album?.images?.[0]?.url;
  const trackName = currentTrack?.name || "Larusso";
  const artistName = currentTrack?.artists?.length
    ? currentTrack.artists.map((a) => a?.name || "").filter(Boolean).join(", ")
    : "Titus Haskins";

  return (
    <div
      className="rack-panel w-full flex flex-col gap-3.5 p-4 select-none relative"
      style={{
        borderRadius: "2px",
        minHeight: 380,
      }}
    >
      {/* 4 Corner Screws */}
      <div className="rack-screw screw-tl" />
      <div className="rack-screw screw-tr" />
      <div className="rack-screw screw-bl" />
      <div className="rack-screw screw-br" />

      {/* Optional Minimize Header for Mobile Full Screen */}
      {onClose && (
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#142236] z-10 relative">
          <button
            onClick={() => {
              if (soundFX) playChime("click");
              onClose();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-pixel text-[#22C55E] border border-[#22C55E]/40 hover:border-[#22C55E] hover:bg-[#22C55E]/10 rounded-[2px]"
          >
            <span>←</span>
            <span>MINIMIZE</span>
          </button>
          <span className="font-pixel text-[8px] text-[#22C55E] tracking-widest">
            NOW PLAYING
          </span>
        </div>
      )}

      {/* Album Art + Vinyl Record */}
      <div className="relative flex items-center justify-center my-1 overflow-hidden" style={{ height: 140 }}>
        {/* Album Cover Sleeve */}
        <div
          className="relative z-10 overflow-hidden rounded-[2px]"
          style={{
            width: "clamp(108px, 32vw, 126px)",
            height: "clamp(108px, 32vw, 126px)",
            backgroundColor: "#0A0F17",
            border: "1px solid #1E293B",
            boxShadow: "4px 4px 12px rgba(0,0,0,0.8)",
            transform: "translateX(-24px)",
          }}
        >
          {albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={albumArt}
              alt={currentTrack?.album?.name || "Album Art"}
              className="w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0F172A] text-2xl text-[#64748B]">
              ♫
            </div>
          )}
        </div>

        {/* Peeking Vinyl Record */}
        <div
          className="absolute z-0 flex items-center justify-center"
          style={{
            width: "clamp(104px, 30vw, 122px)",
            height: "clamp(104px, 30vw, 122px)",
            borderRadius: "50%",
            backgroundColor: "#05070A",
            border: "2px solid #181F2A",
            boxShadow: "0 0 16px rgba(0,0,0,0.9)",
            transform: "translateX(32px)",
            animation: !isPaused ? "spin-vinyl 4s linear infinite" : "spin-vinyl 4s linear infinite paused",
          }}
        >
          {/* Concentric Vinyl Grooves */}
          {[18, 28, 38, 48].map((r) => (
            <div
              key={r}
              style={{
                position: "absolute",
                width: `${r * 2}%`,
                height: `${r * 2}%`,
                borderRadius: "50%",
                border: "1px solid #151A22",
              }}
            />
          ))}

          {/* Cyan Vinyl Center Label */}
          <div
            style={{
              width: "32%",
              height: "32%",
              borderRadius: "50%",
              backgroundColor: "#0284C7",
              border: "2px solid #38BDF8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 8px rgba(56, 189, 248, 0.4)",
            }}
          >
            {/* Center Spindle Hole */}
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#05070A",
                border: "1px solid #000",
              }}
            />
          </div>
        </div>
      </div>

      {/* Track Title + Artist + Heart Icon */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col min-w-0 pr-2">
          <span
            className="font-mono text-[13px] text-[#F8FAFC] font-bold truncate leading-tight tracking-wide"
            title={trackName}
          >
            {trackName}
          </span>
          <span
            className="font-mono text-[10px] text-[#94A3B8] truncate mt-0.5 tracking-tight"
            title={artistName}
          >
            {artistName}
          </span>
        </div>

        {/* Green Heart Icon */}
        <button
          onClick={handleToggleLike}
          className="text-base transition-transform hover:scale-110 active:scale-95 flex-shrink-0"
          title={isLiked ? "Unlike track" : "Like track"}
          style={{
            color: isLiked ? "#22C55E" : "#475569",
            textShadow: isLiked ? "0 0 8px rgba(34, 197, 94, 0.7)" : "none",
          }}
        >
          💚
        </button>
      </div>

      {/* Spectrum Visualizer */}
      <div className="w-full flex justify-center py-1">
        <SpectrumVisualizer isPlaying={!isPaused} height={44} />
      </div>

      {/* Scrubber / Progress Bar */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex justify-between font-mono text-[9px] text-[#94A3B8] tracking-widest">
          <span>{formatTime(position)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div
          ref={progressRef}
          className="relative w-full h-[4px] bg-[#162235] cursor-pointer rounded-full overflow-visible"
          onClick={handleProgressClick}
        >
          {/* Progress Fill */}
          <div
            className="h-full bg-[#22C55E] rounded-full transition-all duration-100"
            style={{
              width: `${progressPercent}%`,
              boxShadow: "0 0 6px rgba(34, 197, 94, 0.6)",
            }}
          />
          {/* Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-3.5 bg-white border border-[#0F172A] rounded-xs shadow-md"
            style={{
              left: `calc(${progressPercent}% - 4px)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Playback Controls Row */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 pt-1">
        {/* Shuffle */}
        <button
          className="px-2 py-1.5 text-xs transition-colors rounded-[2px]"
          onClick={() => handleAction(toggleShuffle)}
          style={{
            border: "1px solid",
            borderColor: shuffle ? "#22C55E" : "#1E293B",
            backgroundColor: shuffle ? "rgba(34, 197, 94, 0.1)" : "#0A0F17",
            color: shuffle ? "#22C55E" : "#64748B",
          }}
          title="Shuffle"
        >
          🔀
        </button>

        {/* Previous */}
        <button
          className="px-2.5 py-1.5 text-xs text-[#94A3B8] hover:text-[#22C55E] transition-colors rounded-[2px]"
          onClick={() => handleAction(previous)}
          style={{
            border: "1px solid #1E293B",
            backgroundColor: "#0A0F17",
          }}
          title="Previous Track"
        >
          ⏮
        </button>

        {/* Chunky Main Play/Pause Button */}
        <button
          onClick={() => handleAction(togglePlay)}
          className="btn-play-chunky"
          style={{
            width: 44,
            height: 44,
            minWidth: 44,
            fontSize: 16,
          }}
          title={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? "▶" : "⏸"}
        </button>

        {/* Next */}
        <button
          className="px-2.5 py-1.5 text-xs text-[#94A3B8] hover:text-[#22C55E] transition-colors rounded-[2px]"
          onClick={() => handleAction(next)}
          style={{
            border: "1px solid #1E293B",
            backgroundColor: "#0A0F17",
          }}
          title="Next Track"
        >
          ⏭
        </button>

        {/* Repeat */}
        <button
          className="px-2 py-1.5 text-xs transition-colors rounded-[2px]"
          onClick={() => handleAction(cycleRepeat)}
          style={{
            border: "1px solid",
            borderColor: repeatMode > 0 ? "#22C55E" : "#1E293B",
            backgroundColor: repeatMode > 0 ? "rgba(34, 197, 94, 0.1)" : "#0A0F17",
            color: repeatMode > 0 ? "#22C55E" : "#64748B",
          }}
          title="Repeat Mode"
        >
          🔁
        </button>
      </div>

      {/* Volume Slider Row */}
      <div className="flex items-center gap-2 sm:gap-2.5 px-1 pt-1">
        <span className="font-mono text-[9px] text-[#64748B] tracking-wider">VOL</span>
        <span className="text-xs text-[#64748B]">🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setPlayerVolume(parseFloat(e.target.value))}
          className="flex-1 accent-[#22C55E] h-1.5 bg-[#162235] cursor-pointer rounded-full"
        />
        <span className="font-mono text-[10px] text-[#94A3B8] w-7 text-right">
          {Math.round(volume * 100)}
        </span>
      </div>
    </div>
  );
}
