"use client";

import React from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { playChime } from "@/lib/audioEngine";

// ============================================================
// DeviceManager — Spotify Connect device switcher
// ============================================================

const DEVICE_ICONS: Record<string, string> = {
  Computer: "💻",
  Smartphone: "📱",
  Speaker: "🔊",
  TV: "📺",
  Tablet: "📟",
  Unknown: "◻",
};

interface DeviceManagerProps {
  soundFX: boolean;
}

export default function DeviceManager({ soundFX }: DeviceManagerProps) {
  const { externalDevice, transferToTab, isReady, deviceId } = usePlayer();

  if (!externalDevice) return null;

  const { device, item, is_playing } = externalDevice;
  const icon = DEVICE_ICONS[device.type] ?? "◻";

  const handleTransfer = async () => {
    if (soundFX) playChime("success");
    await transferToTab();
  };

  return (
    <div
      className="flex items-center justify-between gap-3 p-3"
      style={{
        backgroundColor: "rgba(245,158,11,0.08)",
        border: "2px solid var(--color-amber)",
        animation: "amber-pulse 2s ease-in-out infinite",
      }}
    >
      {/* Device info */}
      <div className="flex items-center gap-3 min-w-0">
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div className="flex flex-col min-w-0">
          <span
            className="font-pixel text-[8px] text-[var(--color-amber)]"
            style={{ letterSpacing: "0.05em" }}
          >
            {device.name.slice(0, 20)}
          </span>
          {item && (
            <span
              className="font-mono-retro text-[10px] text-[var(--color-text-secondary)] truncate"
            >
              {is_playing ? "▶ " : "⏸ "}
              {item.name} — {item.artists?.[0]?.name}
            </span>
          )}
          {device.volume_percent !== null && (
            <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)]">
              VOL {device.volume_percent}%
            </span>
          )}
        </div>
      </div>

      {/* Transfer button */}
      {isReady && deviceId && (
        <button
          className="btn-pixel btn-pixel-amber"
          onClick={handleTransfer}
          style={{
            padding: "6px 10px",
            fontSize: 7,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
          title="Transfer playback to this browser tab"
        >
          DESKTOP ➔ TAB
        </button>
      )}
    </div>
  );
}
