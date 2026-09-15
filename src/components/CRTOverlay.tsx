"use client";

import React, { useEffect, useRef } from "react";

// ============================================================
// CRTOverlay — Fixed-position CRT scanline + vignette layer
// ============================================================

interface CRTOverlayProps {
  enabled: boolean;
}

export default function CRTOverlay({ enabled }: CRTOverlayProps) {
  if (!enabled) return null;

  return (
    <>
      {/* Scanlines */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 999,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0.10) 1px, transparent 1px, transparent 3px)",
          animation: "scanline-flicker 6s ease-in-out infinite",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 998,
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* Phosphor bloom — subtle green tint at edges */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 997,
          background:
            "radial-gradient(ellipse at center, transparent 70%, rgba(34,197,94,0.03) 100%)",
        }}
      />
    </>
  );
}
