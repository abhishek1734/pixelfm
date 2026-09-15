"use client";

import React from "react";
import { playChime } from "@/lib/audioEngine";
import { usePlayer } from "@/contexts/PlayerContext";

// ============================================================
// Sidebar — Retro pixel navigation
// ============================================================

export type NavView = "home" | "library" | "search" | "discover" | "settings";

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
  { id: "search", label: "SEARCH", icon: "🔍" },
  { id: "discover", label: "DISCOVER", icon: "🎯" },
  { id: "settings", label: "CONFIG", icon: "⚙" },
];

export default function Sidebar({ currentView, onNavigate, soundFX }: SidebarProps) {
  const { isReady, externalDevice } = usePlayer();

  const handleNav = (view: NavView) => {
    if (soundFX) playChime("click");
    onNavigate(view);
  };

  return (
    <aside
      className="flex flex-col justify-between h-full py-4 select-none"
      style={{
        width: 78,
        backgroundColor: "#060B12",
        borderRight: "1px solid #142236",
        flexShrink: 0,
      }}
    >
      {/* Nav items */}
      <div className="flex flex-col gap-2.5 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="flex flex-col items-center justify-center gap-1.5 py-2.5 w-full transition-all relative rounded-[2px]"
              style={{
                border: isActive ? "1px solid #22C55E" : "1px solid transparent",
                backgroundColor: isActive ? "rgba(34, 197, 94, 0.08)" : "transparent",
                cursor: "pointer",
              }}
            >
              {/* Active left indicator notch */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    left: -8,
                    top: "15%",
                    height: "70%",
                    width: 3,
                    backgroundColor: "#22C55E",
                    boxShadow: "0 0 8px #22C55E",
                  }}
                />
              )}

              <span
                style={{
                  fontSize: 16,
                  color: isActive ? "#22C55E" : "#64748B",
                  textShadow: isActive ? "0 0 10px rgba(34, 197, 94, 0.7)" : "none",
                  transition: "all 0.15s ease",
                  lineHeight: 1,
                }}
              >
                {item.icon}
              </span>

              <span
                className="font-pixel"
                style={{
                  fontSize: 6,
                  color: isActive ? "#22C55E" : "#64748B",
                  letterSpacing: "0.08em",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom: DISC indicator */}
      <div className="flex flex-col items-center gap-1 pb-1">
        <div
          style={{
            width: 8,
            height: 8,
            backgroundColor: isReady || externalDevice ? "#22C55E" : "#334155",
            boxShadow: isReady || externalDevice ? "0 0 6px #22C55E" : "none",
          }}
        />
        <span
          className="font-pixel"
          style={{ fontSize: 7, color: "#64748B", letterSpacing: "0.05em" }}
        >
          DISC
        </span>
      </div>
    </aside>
  );
}
