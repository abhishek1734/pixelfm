"use client";

import React, { useState, useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { playChime } from "@/lib/audioEngine";

// ============================================================
// PixelCat — Animated pixel art mascot
// Pure CSS/div pixel art. No external assets required.
// ============================================================

type CatState = "playing" | "paused" | "sleeping" | "surprised";

const CAT_COLORS = {
  body: "#8B7355",
  bodyLight: "#A08060",
  outline: "#2D1F0E",
  eyes: "#22C55E",
  eyesClosed: "#8B7355",
  nose: "#EC4899",
  inner_ear: "#EC4899",
  whisker: "#E2E8F0",
};

interface PixelProps {
  color: string;
  size?: number;
}

function Pixel({ color, size = 6 }: PixelProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        imageRendering: "pixelated",
        flexShrink: 0,
      }}
    />
  );
}

interface RowProps {
  pixels: string[];
  size?: number;
}

function PixelRow({ pixels, size = 6 }: RowProps) {
  return (
    <div style={{ display: "flex" }}>
      {pixels.map((color, i) => (
        <Pixel key={i} color={color} size={size} />
      ))}
    </div>
  );
}

const T = "transparent";
const B = CAT_COLORS.body;
const L = CAT_COLORS.bodyLight;
const O = CAT_COLORS.outline;
const G = CAT_COLORS.eyes;
const N = CAT_COLORS.nose;
const I = CAT_COLORS.inner_ear;

// Cat pixel grid (12x14)
const CAT_PIXELS_AWAKE = [
  [T, T, O, O, T, T, T, T, O, O, T, T],
  [T, O, B, B, O, T, T, O, B, B, O, T],
  [O, B, I, B, B, O, O, B, B, I, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, G, B, B, B, B, B, B, G, B, O],
  [O, B, G, B, B, N, B, B, B, G, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [T, O, B, B, B, L, L, B, B, B, O, T],
  [T, T, O, B, B, B, B, B, B, O, T, T],
  [T, T, T, O, B, B, B, B, O, T, T, T],
  [T, T, O, B, O, T, T, O, B, O, T, T],
  [T, T, O, O, T, T, T, T, O, O, T, T],
  [T, T, T, T, T, T, T, T, T, T, T, T],
];

const CAT_PIXELS_SLEEPING = [
  [T, T, O, O, T, T, T, T, O, O, T, T],
  [T, O, B, B, O, T, T, O, B, B, O, T],
  [O, B, I, B, B, O, O, B, B, I, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, O, O, B, B, B, B, O, O, B, O],
  [O, B, B, B, B, N, B, B, B, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [T, O, B, B, B, B, B, B, B, B, O, T],
  [T, T, O, B, B, B, B, B, B, O, T, T],
  [T, T, T, O, B, B, B, B, O, T, T, T],
  [T, T, O, B, O, T, T, O, B, O, T, T],
  [T, T, O, O, T, T, T, T, O, O, T, T],
  [T, T, T, T, T, T, T, T, T, T, T, T],
];

const CAT_PIXELS_SURPRISED = [
  [T, T, O, O, T, T, T, T, O, O, T, T],
  [T, O, B, B, O, T, T, O, B, B, O, T],
  [O, B, I, B, B, O, O, B, B, I, B, O],
  [O, B, B, B, B, B, B, B, B, B, B, O],
  [O, B, G, G, B, B, B, B, G, G, B, O],
  [O, B, G, G, B, N, B, B, G, G, B, O],
  [O, B, B, B, O, B, B, O, B, B, B, O],
  [O, B, B, B, B, O, O, B, B, B, B, O],
  [T, O, B, B, B, L, L, B, B, B, O, T],
  [T, T, O, B, B, B, B, B, B, O, T, T],
  [T, T, T, O, B, B, B, B, O, T, T, T],
  [T, T, O, B, O, T, T, O, B, O, T, T],
  [T, T, O, O, T, T, T, T, O, O, T, T],
  [T, T, T, T, T, T, T, T, T, T, T, T],
];

function ZZZParticle({ delay, offset }: { delay: number; offset: { x: number; y: number } }) {
  return (
    <div
      className="font-pixel select-none"
      style={{
        position: "absolute",
        top: offset.y,
        right: offset.x,
        fontSize: 9,
        color: "#22C55E",
        textShadow: "0 0 6px rgba(34, 197, 94, 0.6)",
        animation: `cat-sleep-zzz 2.5s ease-out ${delay}s infinite`,
        opacity: 0,
      }}
    >
      z
    </div>
  );
}

function HeartParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        fontSize: 10,
        color: "#22C55E",
        animation: `heart-burst 0.8s ease-out ${delay}s forwards`,
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      ♥
    </div>
  );
}

export default function PixelCat() {
  const { isPaused, currentTrack } = usePlayer();
  const [catState, setCatState] = useState<CatState>("sleeping");
  const [hearts, setHearts] = useState<{ x: number; y: number; id: number }[]>([]);
  const [sleepTimer, setSleepTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!currentTrack) {
      setCatState("sleeping");
      return;
    }
    if (isPaused) {
      // Delay sleep by 2s after pause
      const t = setTimeout(() => setCatState("sleeping"), 2000);
      setSleepTimer(t);
      return () => clearTimeout(t);
    } else {
      if (sleepTimer) clearTimeout(sleepTimer);
      setCatState("playing");
    }
  }, [isPaused, currentTrack]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = () => {
    playChime("click");
    setCatState("surprised");
    const newHearts = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * 60 - 10,
      y: Math.random() * 30 - 20,
      id: Date.now() + i,
    }));
    setHearts(newHearts);
    setTimeout(() => {
      setHearts([]);
      setCatState(isPaused ? "sleeping" : "playing");
    }, 1000);
  };

  const pixels =
    catState === "sleeping"
      ? CAT_PIXELS_SLEEPING
      : catState === "surprised"
      ? CAT_PIXELS_SURPRISED
      : CAT_PIXELS_AWAKE;

  const animClass =
    catState === "playing"
      ? "animate-cat-bob"
      : catState === "sleeping"
      ? "animate-cat-breathe"
      : "";

  return (
    <div
      className="rack-panel w-full flex flex-col items-center justify-center p-3 select-none relative"
      style={{
        borderRadius: "2px",
        minHeight: 120,
      }}
    >
      {/* 4 Corner Screws */}
      <div className="rack-screw screw-tl" />
      <div className="rack-screw screw-tr" />
      <div className="rack-screw screw-bl" />
      <div className="rack-screw screw-br" />

      {/* Top Status Header */}
      <div className="font-pixel text-[8px] text-[#64748B] tracking-widest uppercase mb-2">
        {catState === "playing"
          ? "> GROOVING <"
          : catState === "sleeping"
          ? "> SLEEPING <"
          : "> SURPRISED <"}
      </div>

      {/* Cat Container with Particles */}
      <div
        className={`relative cursor-pointer ${animClass}`}
        onClick={handleClick}
        title="Pet the cat!"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Sleeping Zzz particles drifting up to the right */}
        {catState === "sleeping" && (
          <>
            <ZZZParticle delay={0} offset={{ x: -16, y: -8 }} />
            <ZZZParticle delay={0.8} offset={{ x: -26, y: -16 }} />
            <ZZZParticle delay={1.6} offset={{ x: -36, y: -24 }} />
          </>
        )}

        {/* Heart burst particles */}
        {hearts.map((h) => (
          <HeartParticle key={h.id} x={h.x} y={h.y} delay={0} />
        ))}

        {/* Pixel art cat */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {pixels.map((row, rowIdx) => (
            <PixelRow key={rowIdx} pixels={row} size={6} />
          ))}
        </div>
      </div>
    </div>
  );
}
