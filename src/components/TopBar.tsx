"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { playChime } from "@/lib/audioEngine";

// ============================================================
// TopBar — Station header with frequency readout, clock, CRT toggle
// ============================================================

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
    <div className="flex items-center gap-2 font-mono-retro">
      <span className="text-[9px] text-[#64748B] font-mono tracking-wider">FREQ</span>
      <div className="flex items-center text-[12px] font-bold tracking-widest text-[#F59E0B]">
        <span>88</span>
        <span style={{ opacity: tick ? 0.3 : 1, margin: "0 2px" }}>.</span>
        <span>4</span>
        <span className="ml-1 text-[11px] font-semibold text-[#F59E0B]">FM</span>
      </div>
    </div>
  );
}

function ConnectionStatusDot() {
  const { isAuthenticated, isDemoMode } = useAuth();
  const { isReady, externalDevice } = usePlayer();

  if (isAuthenticated && (isReady || externalDevice)) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-[#22C55E] leading-none">■</span>
        <span className="font-pixel text-[8px] text-[#22C55E] tracking-wider">
          CONNECTED
        </span>
      </div>
    );
  }

  if (isDemoMode) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-[#F59E0B] leading-none">■</span>
        <span className="font-pixel text-[8px] text-[#F59E0B] tracking-wider">
          DEMO MODE
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] text-[#475569] leading-none">■</span>
      <span className="font-pixel text-[8px] text-[#475569] tracking-wider">
        OFFLINE
      </span>
    </div>
  );
}

export default function TopBar({ crtEnabled, onToggleCRT, soundFX }: TopBarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [time, setTime] = useState("03:06:29");

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
    <header
      className="flex items-center justify-between px-4 py-2 select-none"
      style={{
        backgroundColor: "#060B12",
        borderBottom: "1px solid #142236",
        minHeight: 46,
      }}
    >
      {/* Left: Station ID */}
      <div className="flex items-center gap-4">
        <span
          className="font-pixel text-[12px] text-[#22C55E] tracking-wider"
          style={{ textShadow: "0 0 10px rgba(34, 197, 94, 0.6)" }}
        >
          PIXELFM
        </span>

        <span className="hidden sm:inline-block font-mono text-[9px] text-[#64748B] tracking-widest uppercase">
          HI-FI // STEREO
        </span>

        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-sm"
          style={{
            border: "1px solid #F59E0B",
            backgroundColor: "rgba(245, 158, 11, 0.05)",
          }}
        >
          <span className="text-[8px] text-[#F59E0B] leading-none animate-pulse">•</span>
          <span className="font-pixel text-[7px] text-[#F59E0B] tracking-wider">
            LIVE
          </span>
        </div>
      </div>

      {/* Center: Frequency + Clock */}
      <div className="flex items-center gap-8">
        <FrequencyDisplay />
        <div
          className="font-mono text-[11px] text-[#38BDF8] tracking-widest font-semibold"
          style={{
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 0 8px rgba(56, 189, 248, 0.4)",
          }}
        >
          {time}
        </div>
      </div>

      {/* Right: Status + CRT + Profile */}
      <div className="flex items-center gap-3.5">
        <ConnectionStatusDot />

        {/* CRT Toggle Button */}
        <button
          onClick={handleToggleCRT}
          className="px-2.5 py-1 text-[9px] font-pixel transition-all rounded-[2px]"
          style={{
            border: "1px solid #22C55E",
            backgroundColor: crtEnabled ? "rgba(34, 197, 94, 0.12)" : "#070E18",
            color: "#22C55E",
            boxShadow: crtEnabled ? "0 0 8px rgba(34, 197, 94, 0.25)" : "none",
          }}
          title="Toggle CRT scanlines"
        >
          CRT ▾
        </button>

        {/* User Profile Badge */}
        {isAuthenticated && user ? (
          <button
            onClick={() => {
              if (soundFX) playChime("click");
              logout();
            }}
            className="flex items-center gap-2 px-2 py-1 transition-all rounded-[2px]"
            style={{
              backgroundColor: "#0B1422",
              border: "1px solid #16253B",
            }}
            title="Click to logout"
          >
            {user.images?.[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.images[0].url}
                alt={user.display_name}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "2px",
                  border: "1px solid #EF4444",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: "#EF4444",
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#fff",
                }}
              >
                ▲
              </div>
            )}
            <span className="font-mono text-[10px] text-[#E2E8F0] font-medium max-w-[90px] truncate">
              {user.display_name || "Abhishek"}
            </span>
          </button>
        ) : (
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-[2px]"
            style={{ backgroundColor: "#0B1422", border: "1px solid #16253B" }}
          >
            <div className="w-4 h-4 rounded-[2px] bg-red-500/80" />
            <span className="font-mono text-[10px] text-[#94A3B8]">Abhishek</span>
          </div>
        )}
      </div>
    </header>
  );
}
