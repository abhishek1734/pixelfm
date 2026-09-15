"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { usePlayer } from "@/contexts/PlayerContext";
import SpectrumVisualizer from "./SpectrumVisualizer";
import { playChime } from "@/lib/audioEngine";

// ============================================================
// NowPlayingDeck — Hero player card
// ============================================================

function formatTime(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function RepeatIcon({ mode }: { mode: 0 | 1 | 2 }) {
  if (mode === 0) return <span>↺</span>;
  if (mode === 1) return <span style={{ color: "var(--color-phosphor)" }}>↺</span>;
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ color: "var(--color-phosphor)" }}>↺</span>
      <span style={{ position: "absolute", top: -4, right: -4, fontSize: 6, color: "var(--color-phosphor)" }}>1</span>
    </span>
  );
}

interface MarqueeTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

function MarqueeText({ text, className, style }: MarqueeTextProps) {
  const shouldScroll = text.length > 18;
  return (
    <div style={{ overflow: "hidden", width: "100%", ...style }}>
      {shouldScroll ? (
        <div className="flex">
          <span className="marquee-text">{text}&nbsp;&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
      ) : (
        <span className={className}>{text}</span>
      )}
    </div>
  );
}

export default function NowPlayingDeck({ soundFX }: { soundFX: boolean }) {
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

  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
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

  return (
    <div
      className="card-pixel flex flex-col gap-4 p-4"
      style={{ width: "100%", maxWidth: 400 }}
    >
      {/* Album Art + Vinyl */}
      <div className="relative flex items-center justify-center" style={{ height: 180 }}>
        {/* Spinning vinyl record */}
        <div
          style={{
            position: "absolute",
            right: -20,
            width: 160,
            height: 160,
            borderRadius: "50%",
            backgroundColor: "#0a0a0a",
            border: "2px solid #1a1a1a",
            animation: !isPaused ? "spin-vinyl 3s linear infinite" : "spin-vinyl 3s linear infinite paused",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Vinyl grooves */}
          {[30, 45, 60, 70].map((r) => (
            <div
              key={r}
              style={{
                position: "absolute",
                width: r * 2,
                height: r * 2,
                borderRadius: "50%",
                border: "1px solid #222",
              }}
            />
          ))}
          {/* Center label */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "var(--color-elevated)",
              border: "2px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#000",
                border: "1px solid var(--color-grid)",
              }}
            />
          </div>
        </div>

        {/* Album art */}
        <div
          className="pixel-shadow"
          style={{
            width: 140,
            height: 140,
            border: "4px solid var(--color-elevated)",
            outline: "2px solid #000",
            position: "relative",
            flexShrink: 0,
            zIndex: 2,
          }}
        >
          {albumArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={albumArt}
              alt={currentTrack?.album?.name ?? "Album Art"}
              className="w-full h-full object-cover"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "var(--color-void)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              ♪
            </div>
          )}
        </div>
      </div>

      {/* Track info */}
      <div className="flex flex-col gap-1">
        <MarqueeText
          text={currentTrack?.name ?? "NO TRACK LOADED"}
          className="font-pixel text-[10px] text-[var(--color-text-primary)]"
          style={{ fontFamily: "var(--font-pixel)", fontSize: 10, color: "var(--color-text-primary)" }}
        />
        <MarqueeText
          text={
            currentTrack?.artists?.length
              ? currentTrack.artists.map((a) => a?.name || "").filter(Boolean).join(", ")
              : "— — —"
          }
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-secondary)" }}
        />
        {currentTrack?.explicit && (
          <span
            className="font-pixel text-[6px] px-1 py-0.5 inline-block"
            style={{
              border: "1px solid var(--color-text-dim)",
              color: "var(--color-text-dim)",
              width: "fit-content",
            }}
          >
            E
          </span>
        )}
      </div>

      {/* Spectrum Visualizer */}
      <SpectrumVisualizer isPlaying={!isPaused} height={48} />

      {/* Progress bar */}
      <div className="flex flex-col gap-1">
        <div
          ref={progressRef}
          className="progress-pixel cursor-pointer"
          onClick={handleProgressClick}
          style={{ height: 8, backgroundColor: "var(--color-elevated)", border: "1px solid var(--color-border)" }}
        >
          <div
            className="progress-pixel-fill"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Playhead */}
          <div
            style={{
              position: "absolute",
              top: -2,
              left: `calc(${progressPercent}% - 3px)`,
              width: 6,
              height: 12,
              backgroundColor: "#fff",
              border: "1px solid #000",
            }}
          />
        </div>
        <div className="flex justify-between font-mono-retro text-[10px] text-[var(--color-text-secondary)]">
          <span>{formatTime(position)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Shuffle */}
        <button
          className="btn-pixel"
          onClick={() => handleAction(toggleShuffle)}
          style={{
            padding: "6px 8px",
            fontSize: 12,
            borderColor: shuffle ? "var(--color-phosphor)" : "var(--color-border)",
            color: shuffle ? "var(--color-phosphor)" : "var(--color-text-dim)",
          }}
          title="Shuffle"
        >
          ⇄
        </button>

        {/* Previous */}
        <button
          className="btn-pixel"
          onClick={() => handleAction(previous)}
          style={{ padding: "8px 12px", fontSize: 14 }}
          title="Previous"
        >
          ◂◂
        </button>

        {/* Play/Pause — octagonal main button */}
        <button
          onClick={() => handleAction(togglePlay)}
          style={{
            width: 56,
            height: 56,
            clipPath:
              "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
            backgroundColor: isPaused ? "var(--color-surface)" : "var(--color-phosphor)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: isPaused ? "var(--color-phosphor)" : "var(--color-void)",
            boxShadow: `0 0 ${isPaused ? "8px" : "20px"} rgba(34,197,94,${isPaused ? "0.3" : "0.6"})`,
            transition: "all 0.1s",
          }}
          title={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? "▶" : "⏸"}
        </button>

        {/* Next */}
        <button
          className="btn-pixel"
          onClick={() => handleAction(next)}
          style={{ padding: "8px 12px", fontSize: 14 }}
          title="Next"
        >
          ▸▸
        </button>

        {/* Repeat */}
        <button
          className="btn-pixel"
          onClick={() => handleAction(cycleRepeat)}
          style={{
            padding: "6px 8px",
            fontSize: 12,
            borderColor:
              repeatMode > 0 ? "var(--color-phosphor)" : "var(--color-border)",
          }}
          title="Repeat"
        >
          <RepeatIcon mode={repeatMode} />
        </button>
      </div>

      {/* Volume slider */}
      <div className="flex items-center gap-3">
        <span className="font-pixel text-[8px] text-[var(--color-text-dim)]">VOL</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setPlayerVolume(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span className="font-mono-retro text-[10px] text-[var(--color-text-secondary)] w-8 text-right">
          {Math.round(volume * 100)}
        </span>
      </div>
    </div>
  );
}
