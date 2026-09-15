"use client";

import React, { useEffect, useRef } from "react";

// ============================================================
// SpectrumVisualizer — 16-bar animated EQ
// Uses CSS animations with staggered delays + randomized heights
// ============================================================

const BAR_COUNT = 16;

const BAR_HEIGHTS = [
  28, 40, 52, 36, 48, 60, 44, 32,
  56, 38, 50, 42, 34, 58, 46, 30,
];

const BAR_DELAYS = [
  0.0, 0.15, 0.07, 0.22, 0.11, 0.03, 0.19, 0.08,
  0.25, 0.13, 0.05, 0.18, 0.09, 0.21, 0.06, 0.14,
];

const BAR_DURATIONS = [
  0.45, 0.38, 0.52, 0.41, 0.48, 0.35, 0.55, 0.43,
  0.39, 0.50, 0.44, 0.47, 0.36, 0.53, 0.42, 0.49,
];

function getBarColor(index: number, total: number): string {
  const ratio = index / (total - 1);
  if (ratio < 0.5) {
    // Phosphor green → amber
    const r = Math.round(34 + (245 - 34) * ratio * 2);
    const g = Math.round(197 + (158 - 197) * ratio * 2);
    const b = Math.round(94 + (11 - 94) * ratio * 2);
    return `rgb(${r},${g},${b})`;
  } else {
    // Amber → pink
    const t = (ratio - 0.5) * 2;
    const r = Math.round(245 + (236 - 245) * t);
    const g = Math.round(158 + (72 - 158) * t);
    const b = Math.round(11 + (153 - 11) * t);
    return `rgb(${r},${g},${b})`;
  }
}

interface SpectrumVisualizerProps {
  isPlaying: boolean;
  height?: number;
}

export default function SpectrumVisualizer({
  isPlaying,
  height = 64,
}: SpectrumVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const barsRef = useRef<number[]>(BAR_HEIGHTS.map((h) => h * 0.1));
  const targetRef = useRef<number[]>([...BAR_HEIGHTS]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const barWidth = 6;
    const barGap = 3;
    const totalWidth = BAR_COUNT * (barWidth + barGap) - barGap;
    canvas.width = totalWidth;
    canvas.height = height;

    let frameCount = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frameCount++;

      // Update targets occasionally for organic movement
      if (frameCount % 8 === 0 && isPlaying) {
        for (let i = 0; i < BAR_COUNT; i++) {
          targetRef.current[i] =
            BAR_HEIGHTS[i] * (0.3 + Math.random() * 0.7);
        }
      }

      for (let i = 0; i < BAR_COUNT; i++) {
        const target = isPlaying ? targetRef.current[i] : 3;
        const current = barsRef.current[i];
        const speed = isPlaying ? 0.15 : 0.08;
        barsRef.current[i] = current + (target - current) * speed;

        const barHeight = Math.max(3, barsRef.current[i]);
        const x = i * (barWidth + barGap);
        const y = height - barHeight;

        const color = getBarColor(i, BAR_COUNT);

        // Draw pixelated bar (no anti-aliasing)
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Glow layer
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = color;
        ctx.fillRect(x - 1, y - 1, barWidth + 2, barHeight + 2);
        ctx.globalAlpha = 1.0;

        // Peak dot
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, Math.max(0, y - 2), barWidth, 2);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, height]);

  const totalWidth = BAR_COUNT * (6 + 3) - 3;

  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <canvas
        ref={canvasRef}
        width={totalWidth}
        height={height}
        style={{
          imageRendering: "pixelated",
          display: "block",
          maxHeight: height,
        }}
      />
      <div
        className="font-pixel text-[6px] tracking-widest uppercase select-none"
        style={{
          color: isPlaying ? "#38BDF8" : "#64748B",
          textShadow: isPlaying ? "0 0 6px rgba(56, 189, 248, 0.4)" : "none",
        }}
      >
        + SPECTRUM ANALYZER -
      </div>
    </div>
  );
}
