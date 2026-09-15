"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { playChime } from "@/lib/audioEngine";

// ============================================================
// TopBar — Station header with frequency readout, status, CRT toggle
// ============================================================

const FREQ_DIGITS = ["88", ".", "4", " ", "F", "M"];

interface TopBarProps {
  crtEnabled: boolean;
  onToggleCRT: () => void;
  soundFX: boolean;
}

function FrequencyDisplay() {
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => !t), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-1 font-mono-retro text-[var(--color-amber)]">
      <span className="text-[10px] text-[var(--color-text-dim)] font-pixel mr-2">FREQ</span>
      {FREQ_DIGITS.map((d, i) => (
        <span
          key={i}
          className="text-sm font-bold tracking-wider"
          style={{
            textShadow: "0 0 8px rgba(245,158,11,0.8)",
            opacity: d === "." && tick ? 0.3 : 1,
            fontFamily: '"JetBrains Mono", monospace',
            transition: "opacity 0.1s",
          }}
        >
          {d}
        </span>
      ))}
    </div>
  );
}

function ConnectionStatusDot() {
  const { isAuthenticated, isDemoMode } = useAuth();
  const { isReady } = usePlayer();

  if (isAuthenticated && isReady) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="led-dot"
          style={{
            width: 8,
            height: 8,
            backgroundColor: "#22C55E",
            boxShadow: "0 0 6px #22C55E",
            animation: "led-pulse 2s ease-in-out infinite",
          }}
        />
        <span className="font-pixel text-[7px] text-[var(--color-phosphor)]">
          CONNECTED
        </span>
      </div>
    );
  }

  if (isDemoMode) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="led-dot"
          style={{
            width: 8,
            height: 8,
            backgroundColor: "#F59E0B",
            boxShadow: "0 0 6px #F59E0B",
            animation: "led-pulse 1.5s ease-in-out infinite",
          }}
        />
        <span className="font-pixel text-[7px] text-[var(--color-amber)]">
          DEMO MODE
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className="led-dot"
        style={{ width: 8, height: 8, backgroundColor: "#334155" }}
      />
      <span className="font-pixel text-[7px] text-[var(--color-text-dim)]">
        OFFLINE
      </span>
    </div>
  );
}

export default function TopBar({ crtEnabled, onToggleCRT, soundFX }: TopBarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const handleToggleCRT = () => {
    if (soundFX) playChime("click");
    onToggleCRT();
  };

  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b-2"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-elevated)",
        borderBottom: "2px solid var(--color-elevated)",
        minHeight: 44,
      }}
    >
      {/* Left: Station ID */}
      <div className="flex items-center gap-4">
        <div className="font-pixel text-[10px] text-[var(--color-phosphor)] animate-phosphor-flicker">
          PIXELFM
        </div>
        <div className="hidden sm:block font-pixel text-[7px] text-[var(--color-text-dim)]">
          HI-FI // STEREO
        </div>
        <div
          className="hidden md:flex items-center gap-1 font-pixel text-[7px] px-2 py-1 border"
          style={{
            borderColor: "var(--color-amber)",
            color: "var(--color-amber)",
            animation: "amber-pulse 2s ease-in-out infinite",
          }}
        >
          ● LIVE
        </div>
      </div>

      {/* Center: Frequency + Clock */}
      <div className="flex items-center gap-6">
        <FrequencyDisplay />
        <div
          className="hidden lg:block font-mono-retro text-xs text-[var(--color-text-secondary)]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {time}
        </div>
      </div>

      {/* Right: Status + Controls */}
      <div className="flex items-center gap-3">
        <ConnectionStatusDot />

        {/* CRT Toggle */}
        <button
          onClick={handleToggleCRT}
          className="btn-pixel"
          style={{
            padding: "4px 8px",
            fontSize: 7,
            borderColor: crtEnabled ? "var(--color-phosphor)" : "var(--color-border)",
            color: crtEnabled ? "var(--color-phosphor)" : "var(--color-text-dim)",
          }}
          title="Toggle CRT scanlines"
        >
          {crtEnabled ? "CRT ●" : "CRT ○"}
        </button>

        {/* User avatar / logout */}
        {isAuthenticated && user && (
          <button
            onClick={() => {
              if (soundFX) playChime("click");
              logout();
            }}
            className="btn-pixel flex items-center gap-2"
            style={{ padding: "4px 8px", fontSize: 7 }}
            title="Logout"
          >
            {user.images?.[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.images[0].url}
                alt={user.display_name}
                style={{
                  width: 20,
                  height: 20,
                  imageRendering: "pixelated",
                  border: "1px solid var(--color-phosphor)",
                }}
              />
            ) : (
              <span>▓</span>
            )}
            <span className="hidden sm:inline">{user.display_name?.slice(0, 8)}</span>
          </button>
        )}
      </div>
    </div>
  );
}
