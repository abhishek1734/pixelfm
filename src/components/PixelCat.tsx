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

      {/* Retro Pixel Vines hanging on top-left and top-right */}
      <div
        className="absolute top-2 left-3 flex flex-col pointer-events-none opacity-85"
        style={{ imageRendering: "pixelated" }}
      >
        <div className="w-1.5 h-3 bg-[#15803D] rounded-b-full ml-1" />
        <div className="w-2.5 h-4 bg-[#16A34A] rounded-b-full -mt-1 ml-2" />
        <div className="w-2 h-5 bg-[#22C55E] rounded-b-full -mt-2" />
        <div className="w-1.5 h-3 bg-[#15803D] rounded-b-full -mt-1 ml-1" />
      </div>

      <div
        className="absolute top-2 right-3 flex flex-col pointer-events-none opacity-85 items-end"
        style={{ imageRendering: "pixelated" }}
      >
        <div className="w-1.5 h-4 bg-[#15803D] rounded-b-full mr-2" />
        <div className="w-2.5 h-5 bg-[#16A34A] rounded-b-full -mt-1 mr-0" />
        <div className="w-2 h-6 bg-[#22C55E] rounded-b-full -mt-2 mr-1" />
        <div className="w-1.5 h-3 bg-[#15803D] rounded-b-full -mt-1 mr-2" />
      </div>

      {/* Top Status Header */}
      <div className="font-pixel text-[8px] text-[#64748B] tracking-widest uppercase mb-3">
        &gt; NOW PLAYING &lt;
      </div>

      {/* Main mascot stage: Speech Bubble + Cat */}
      <div className="flex items-center justify-center gap-3 w-full px-2">
        {/* Thought Bubble */}
        <div
          className="relative flex flex-col p-2 rounded-[2px]"
          style={{
            backgroundColor: "rgba(11, 20, 34, 0.9)",
            border: "1px solid #1E293B",
            boxShadow: "0 0 8px rgba(0,0,0,0.6)",
          }}
        >
          {/* Floating musical note */}
          <span
            className="absolute -top-3.5 -left-1 text-[11px] text-[#38BDF8]"
            style={{ textShadow: "0 0 6px rgba(56, 189, 248, 0.6)" }}
          >
            ♪
          </span>

          <div className="font-pixel text-[6px] text-[#94A3B8] leading-tight space-y-0.5 select-none text-left">
            <div>MUSIC</div>
            <div>MAKES A</div>
            <div className="text-[#38BDF8]">BETTER DAY.</div>
          </div>

          {/* Thought bubble pointer dots to cat */}
          <div className="absolute -right-1.5 bottom-2 w-1.5 h-1.5 bg-[#1E293B] rounded-full" />
          <div className="absolute -right-3 bottom-1 w-1 h-1 bg-[#1E293B] rounded-full" />
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
              <ZZZParticle delay={0} offset={{ x: -12, y: -8 }} />
              <ZZZParticle delay={0.8} offset={{ x: -20, y: -16 }} />
              <ZZZParticle delay={1.6} offset={{ x: -28, y: -24 }} />
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

          {/* Floating musical note on right */}
          <span
            className="absolute -top-3.5 -right-2 text-[10px] text-[#22C55E]"
            style={{ textShadow: "0 0 6px rgba(34, 197, 94, 0.6)" }}
          >
            ♫
          </span>
        </div>
      </div>
    </div>
  );
}
