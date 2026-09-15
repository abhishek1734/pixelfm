"use client";

import React from "react";
import { playChime } from "@/lib/audioEngine";
import { usePlayer } from "@/contexts/PlayerContext";

// ============================================================
// Sidebar — Retro pixel navigation
// ============================================================

type NavView = "home" | "library" | "search" | "settings";

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  soundFX: boolean;
}

interface NavItem {
  id: NavView;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "HOME", icon: "⌂" },
  { id: "library", label: "LIBRARY", icon: "♫" },
  { id: "search", label: "SEARCH", icon: "◎" },
  { id: "settings", label: "CONFIG", icon: "⚙" },
];

export default function Sidebar({ currentView, onNavigate, soundFX }: SidebarProps) {
  const { isReady } = usePlayer();

  const handleNav = (view: NavView) => {
    if (soundFX) playChime("click");
    onNavigate(view);
  };

  return (
    <div
      className="flex flex-col h-full py-4"
      style={{
        width: 80,
        backgroundColor: "var(--color-surface)",
        borderRight: "2px solid var(--color-elevated)",
        flexShrink: 0,
      }}
    >
      {/* Nav items */}
      <div className="flex flex-col gap-1 px-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="flex flex-col items-center gap-1 py-3 w-full transition-all"
              style={{
                borderLeft: isActive
                  ? "3px solid var(--color-phosphor)"
                  : "3px solid transparent",
                backgroundColor: isActive
                  ? "rgba(34,197,94,0.08)"
                  : "transparent",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  color: isActive
                    ? "var(--color-phosphor)"
                    : "var(--color-text-dim)",
                  textShadow: isActive
                    ? "0 0 8px rgba(34,197,94,0.6)"
                    : "none",
                  transition: "color 0.15s, text-shadow 0.15s",
                }}
              >
                {item.icon}
              </span>
              <span
                className="font-pixel"
                style={{
                  fontSize: 5,
                  color: isActive
                    ? "var(--color-phosphor)"
                    : "var(--color-text-dim)",
                  letterSpacing: "0.05em",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom: SDK status indicator */}
      <div className="px-2 pb-2 flex flex-col items-center gap-1">
        <div
          style={{
            width: 8,
            height: 8,
            backgroundColor: isReady ? "#22C55E" : "#334155",
            boxShadow: isReady ? "0 0 4px #22C55E" : "none",
            animation: isReady ? "led-pulse 2s ease-in-out infinite" : "none",
          }}
        />
        <span className="font-pixel" style={{ fontSize: 5, color: "var(--color-text-dim)" }}>
          SDK
        </span>
      </div>
    </div>
  );
}
