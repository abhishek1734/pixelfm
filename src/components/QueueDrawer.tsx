"use client";

import React, { useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useMusicData } from "@/contexts/MusicDataContext";
import { playChime } from "@/lib/audioEngine";

// ============================================================
// QueueDrawer — Collapsible retro tracklist panel
// ============================================================

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

interface QueueDrawerProps {
  soundFX: boolean;
}

export default function QueueDrawer({ soundFX }: QueueDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"queue" | "recent" | "liked">("queue");
  const { currentTrack, playTracks } = usePlayer();
  const { recentlyPlayed, likedTracks } = useMusicData();

  const toggle = () => {
    if (soundFX) playChime("click");
    setIsOpen((v) => !v);
  };

  const tracks =
    activeTab === "recent"
      ? recentlyPlayed
      : activeTab === "liked"
      ? likedTracks
      : recentlyPlayed; // Fallback to recent for queue (real queue requires separate API call)

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        borderTop: "2px solid var(--color-elevated)",
        transition: "height 0.2s ease",
      }}
    >
      {/* Drawer toggle tab */}
      <div
        className="flex items-center justify-between px-4 cursor-pointer"
        style={{
          height: 32,
          borderBottom: isOpen ? "1px solid var(--color-border)" : "none",
        }}
        onClick={toggle}
      >
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[8px] text-[var(--color-text-dim)]">
            {isOpen ? "▼" : "▲"} QUEUE
          </span>
          {currentTrack && (
            <span className="font-mono-retro text-[10px] text-[var(--color-text-secondary)]">
              {currentTrack.name.slice(0, 30)}
              {currentTrack.name.length > 30 ? "…" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {["queue", "recent", "liked"].map((tab) => (
            <button
              key={tab}
              onClick={(e) => {
                e.stopPropagation();
                if (soundFX) playChime("click");
                setActiveTab(tab as "queue" | "recent" | "liked");
                if (!isOpen) setIsOpen(true);
              }}
              className="font-pixel"
              style={{
                fontSize: 6,
                padding: "2px 6px",
                backgroundColor:
                  activeTab === tab ? "var(--color-elevated)" : "transparent",
                border: "1px solid",
                borderColor:
                  activeTab === tab
                    ? "var(--color-phosphor)"
                    : "var(--color-border)",
                color:
                  activeTab === tab
                    ? "var(--color-phosphor)"
                    : "var(--color-text-dim)",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Track list */}
      {isOpen && (
        <div style={{ height: 200, overflowY: "auto" }}>
          {/* Table header */}
          <div
            className="flex items-center px-4 py-1 gap-2 sticky top-0"
            style={{
              backgroundColor: "var(--color-void)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span className="font-pixel text-[6px] text-[var(--color-text-dim)] w-6">#</span>
            <span className="font-pixel text-[6px] text-[var(--color-text-dim)] flex-1">TITLE</span>
            <span className="font-pixel text-[6px] text-[var(--color-text-dim)] w-20 text-right hidden sm:block">ARTIST</span>
            <span className="font-pixel text-[6px] text-[var(--color-text-dim)] w-10 text-right">TIME</span>
            <span className="font-pixel text-[6px] text-[var(--color-text-dim)] w-4 text-right">Q</span>
          </div>

          {tracks.length === 0 ? (
            <div className="flex items-center justify-center h-20">
              <span className="font-pixel text-[8px] text-[var(--color-text-dim)]">
                NO TRACKS
              </span>
            </div>
          ) : (
            tracks.map((track, idx) => {
              const isCurrentTrack = track.id === currentTrack?.id;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  className="flex items-center px-4 py-1.5 gap-2 cursor-pointer transition-all"
                  style={{
                    backgroundColor: isCurrentTrack
                      ? "rgba(34,197,94,0.08)"
                      : "transparent",
                    borderLeft: isCurrentTrack
                      ? "2px solid var(--color-phosphor)"
                      : "2px solid transparent",
                  }}
                  onDoubleClick={() => playTracks([track.uri])}
                  title="Double-click to play"
                >
                  {/* Track number */}
                  <span
                    className="font-mono-retro w-6 text-right flex-shrink-0"
                    style={{
                      fontSize: 10,
                      color: isCurrentTrack
                        ? "var(--color-phosphor)"
                        : "var(--color-text-dim)",
                    }}
                  >
                    {isCurrentTrack ? "▶" : idx + 1}
                  </span>

                  {/* Title + badges */}
                  <div className="flex-1 min-w-0 flex items-center gap-1">
                    <span
                      className="font-mono-retro truncate"
                      style={{
                        fontSize: 11,
                        color: isCurrentTrack
                          ? "var(--color-text-primary)"
                          : "var(--color-text-secondary)",
                      }}
                    >
                      {track.name}
                    </span>
                    {track.explicit && (
                      <span
                        className="font-pixel flex-shrink-0"
                        style={{
                          fontSize: 5,
                          padding: "1px 3px",
                          border: "1px solid var(--color-text-dim)",
                          color: "var(--color-text-dim)",
                        }}
                      >
                        E
                      </span>
                    )}
                  </div>

                  {/* Artist */}
                  <span
                    className="font-mono-retro w-20 text-right truncate hidden sm:block flex-shrink-0"
                    style={{ fontSize: 10, color: "var(--color-text-dim)" }}
                  >
                    {track.artists?.[0]?.name}
                  </span>

                  {/* Duration */}
                  <span
                    className="font-mono-retro w-10 text-right flex-shrink-0"
                    style={{ fontSize: 10, color: "var(--color-text-dim)" }}
                  >
                    {formatDuration(track.duration_ms)}
                  </span>

                  {/* Quality badge */}
                  <span
                    className="font-pixel w-4 text-right flex-shrink-0"
                    style={{
                      fontSize: 5,
                      color: "var(--color-phosphor)",
                    }}
                    title="320kbps"
                  >
                    HI
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
