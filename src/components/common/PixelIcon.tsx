"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ============================================================
// PIXELIFY Pixel Icon System
// All icons are hand-crafted 16x16 / 24x24 SVG pixel art
// No anti-aliasing, crisp edges, 1-2px stroke weight
// Max 2 colors per icon
// ============================================================

type IconSize = 10 | 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32 | 48 | number;

interface PixelIconProps {
  name: IconName;
  size?: IconSize;
  color?: string;
  className?: string;
  title?: string;
}

export type IconName =
  | "home"
  | "search"
  | "library"
  | "liked"
  | "history"
  | "madeForYou"
  | "playlist"
  | "play"
  | "pause"
  | "prev"
  | "next"
  | "shuffle"
  | "repeat"
  | "repeatOne"
  | "queue"
  | "volume"
  | "volumeLow"
  | "volumeMute"
  | "heart"
  | "heartFilled"
  | "more"
  | "close"
  | "add"
  | "settings"
  | "fullscreen"
  | "collapse"
  | "device"
  | "equalizer"
  | "disc"
  | "cassette"
  | "musicNote"
  | "user"
  | "chevronUp"
  | "chevronDown"
  | "chevronLeft"
  | "chevronRight"
  | "external"
  | "check"
  | "drag"
  | "trash"
  | "spotify"
  | "pixel-logo"
  | "grid"
  | "list"
  | "sortAsc"
  | "sortDesc"
  | "clock"
  | "album"
  | "artist"
  | "podcast"
  | "shuffle-active"
  | "remove";

export function PixelIcon({ name, size = 16, color = "currentColor", className, title }: PixelIconProps) {
  const px = size;

  const icons: Record<IconName, React.ReactNode> = {
    home: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        {/* Pixel house: roof */}
        <rect x="7" y="1" width="2" height="2" fill={color} />
        <rect x="5" y="3" width="2" height="2" fill={color} />
        <rect x="9" y="3" width="2" height="2" fill={color} />
        <rect x="3" y="5" width="2" height="2" fill={color} />
        <rect x="11" y="5" width="2" height="2" fill={color} />
        {/* walls */}
        <rect x="3" y="7" width="10" height="7" fill={color} />
        {/* door */}
        <rect x="6" y="10" width="4" height="4" fill="var(--color-bg-primary, #0B0E18)" />
      </svg>
    ),
    search: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="2" width="2" height="2" fill={color} />
        <rect x="4" y="1" width="4" height="2" fill={color} />
        <rect x="8" y="2" width="2" height="2" fill={color} />
        <rect x="1" y="4" width="2" height="4" fill={color} />
        <rect x="9" y="4" width="2" height="4" fill={color} />
        <rect x="2" y="8" width="2" height="2" fill={color} />
        <rect x="4" y="9" width="4" height="2" fill={color} />
        <rect x="8" y="8" width="2" height="2" fill={color} />
        {/* handle */}
        <rect x="9" y="10" width="2" height="2" fill={color} />
        <rect x="11" y="12" width="2" height="2" fill={color} />
        <rect x="13" y="14" width="2" height="2" fill={color} />
      </svg>
    ),
    library: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="2" width="2" height="12" fill={color} />
        <rect x="5" y="2" width="2" height="12" fill={color} />
        <rect x="8" y="2" width="2" height="12" fill={color} />
        <rect x="11" y="2" width="2" height="12" fill={color} />
        <rect x="2" y="13" width="11" height="2" fill={color} />
      </svg>
    ),
    liked: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="4" width="2" height="2" fill={color} />
        <rect x="4" y="2" width="2" height="2" fill={color} />
        <rect x="6" y="2" width="2" height="2" fill={color} />
        <rect x="8" y="4" width="2" height="2" fill={color} />
        <rect x="10" y="2" width="2" height="2" fill={color} />
        <rect x="12" y="2" width="2" height="2" fill={color} />
        <rect x="12" y="4" width="2" height="2" fill={color} />
        <rect x="2" y="6" width="2" height="4" fill={color} />
        <rect x="12" y="6" width="2" height="4" fill={color} />
        <rect x="4" y="10" width="2" height="2" fill={color} />
        <rect x="10" y="10" width="2" height="2" fill={color} />
        <rect x="6" y="12" width="2" height="2" fill={color} />
        <rect x="8" y="12" width="2" height="2" fill={color} />
        <rect x="7" y="6" width="2" height="5" fill={color} />
        <rect x="5" y="8" width="2" height="2" fill={color} />
        <rect x="9" y="8" width="2" height="2" fill={color} />
      </svg>
    ),
    history: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="6" y="1" width="4" height="2" fill={color} />
        <rect x="3" y="2" width="2" height="2" fill={color} />
        <rect x="11" y="2" width="2" height="2" fill={color} />
        <rect x="2" y="4" width="2" height="4" fill={color} />
        <rect x="12" y="4" width="2" height="4" fill={color} />
        <rect x="2" y="8" width="2" height="4" fill={color} />
        <rect x="12" y="8" width="2" height="4" fill={color} />
        <rect x="3" y="12" width="2" height="2" fill={color} />
        <rect x="11" y="12" width="2" height="2" fill={color} />
        <rect x="6" y="13" width="4" height="2" fill={color} />
        {/* clock hands */}
        <rect x="7" y="4" width="2" height="4" fill={color} />
        <rect x="7" y="7" width="3" height="2" fill={color} />
        {/* back arrow */}
        <rect x="1" y="4" width="2" height="2" fill={color} />
        <rect x="2" y="2" width="2" height="2" fill={color} />
        <rect x="1" y="6" width="3" height="1" fill={color} />
      </svg>
    ),
    madeForYou: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="1" width="6" height="6" fill={color} />
        <rect x="9" y="1" width="6" height="6" fill={color} />
        <rect x="1" y="9" width="6" height="6" fill={color} />
        <rect x="9" y="9" width="6" height="6" fill={color} />
        {/* inner cutouts for grid look */}
        <rect x="2" y="2" width="4" height="4" fill="var(--color-bg-secondary, #111624)" />
        <rect x="10" y="2" width="4" height="4" fill="var(--color-bg-secondary, #111624)" />
        <rect x="2" y="10" width="4" height="4" fill="var(--color-bg-secondary, #111624)" />
        <rect x="10" y="10" width="4" height="4" fill="var(--color-bg-secondary, #111624)" />
      </svg>
    ),
    playlist: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="3" width="14" height="2" fill={color} />
        <rect x="1" y="7" width="10" height="2" fill={color} />
        <rect x="1" y="11" width="10" height="2" fill={color} />
        <rect x="12" y="7" width="4" height="6" fill={color} />
        <rect x="11" y="13" width="2" height="2" fill={color} />
      </svg>
    ),
    play: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="3" y="2" width="2" height="2" fill={color} />
        <rect x="3" y="4" width="2" height="2" fill={color} />
        <rect x="5" y="4" width="2" height="2" fill={color} />
        <rect x="3" y="6" width="2" height="2" fill={color} />
        <rect x="5" y="6" width="2" height="2" fill={color} />
        <rect x="7" y="6" width="2" height="2" fill={color} />
        <rect x="3" y="8" width="2" height="2" fill={color} />
        <rect x="5" y="8" width="2" height="2" fill={color} />
        <rect x="7" y="8" width="2" height="2" fill={color} />
        <rect x="9" y="8" width="2" height="2" fill={color} />
        <rect x="3" y="10" width="2" height="2" fill={color} />
        <rect x="5" y="10" width="2" height="2" fill={color} />
        <rect x="7" y="10" width="2" height="2" fill={color} />
        <rect x="3" y="12" width="2" height="2" fill={color} />
        <rect x="5" y="12" width="2" height="2" fill={color} />
        <rect x="3" y="14" width="2" height="2" fill={color} />
      </svg>
    ),
    pause: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="3" y="2" width="3" height="12" fill={color} />
        <rect x="10" y="2" width="3" height="12" fill={color} />
      </svg>
    ),
    prev: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="2" width="2" height="12" fill={color} />
        <rect x="13" y="2" width="1" height="2" fill={color} />
        <rect x="12" y="4" width="1" height="2" fill={color} />
        <rect x="11" y="6" width="1" height="2" fill={color} />
        <rect x="10" y="8" width="1" height="2" fill={color} />
        <rect x="9" y="6" width="1" height="2" fill={color} />
        <rect x="8" y="4" width="1" height="2" fill={color} />
        <rect x="7" y="2" width="1" height="2" fill={color} />
        <rect x="13" y="4" width="1" height="6" fill={color} />
        <rect x="12" y="6" width="1" height="2" fill={color} />
        <rect x="11" y="8" width="1" height="2" fill={color} />
        <rect x="7" y="4" width="6" height="2" fill={color} />
        <rect x="7" y="6" width="5" height="2" fill={color} />
        <rect x="7" y="8" width="4" height="2" fill={color} />
        <rect x="7" y="10" width="5" height="2" fill={color} />
        <rect x="7" y="12" width="6" height="2" fill={color} />
      </svg>
    ),
    next: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="12" y="2" width="2" height="12" fill={color} />
        <rect x="4" y="2" width="6" height="2" fill={color} />
        <rect x="4" y="4" width="5" height="2" fill={color} />
        <rect x="4" y="6" width="4" height="2" fill={color} />
        <rect x="4" y="8" width="3" height="2" fill={color} />
        <rect x="4" y="10" width="4" height="2" fill={color} />
        <rect x="4" y="12" width="5" height="2" fill={color} />
        <rect x="9" y="2" width="1" height="2" fill={color} />
        <rect x="10" y="4" width="1" height="2" fill={color} />
        <rect x="11" y="6" width="1" height="2" fill={color} />
        <rect x="11" y="8" width="1" height="2" fill={color} />
        <rect x="10" y="10" width="1" height="2" fill={color} />
        <rect x="9" y="12" width="1" height="2" fill={color} />
      </svg>
    ),
    shuffle: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="3" width="2" height="2" fill={color} />
        <rect x="3" y="5" width="2" height="2" fill={color} />
        <rect x="5" y="7" width="4" height="2" fill={color} />
        <rect x="9" y="5" width="2" height="2" fill={color} />
        <rect x="11" y="3" width="2" height="2" fill={color} />
        <rect x="13" y="1" width="2" height="4" fill={color} />
        <rect x="11" y="1" width="2" height="2" fill={color} />
        <rect x="1" y="11" width="2" height="2" fill={color} />
        <rect x="3" y="9" width="2" height="2" fill={color} />
        <rect x="9" y="9" width="2" height="2" fill={color} />
        <rect x="11" y="11" width="2" height="2" fill={color} />
        <rect x="13" y="9" width="2" height="4" fill={color} />
        <rect x="11" y="13" width="2" height="2" fill={color} />
      </svg>
    ),
    "shuffle-active": (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="3" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="3" y="5" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="5" y="7" width="4" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="9" y="5" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="11" y="3" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="13" y="1" width="2" height="4" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="11" y="1" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="1" y="11" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="3" y="9" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="9" y="9" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="11" y="11" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="13" y="9" width="2" height="4" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="11" y="13" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="6" y="14" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
      </svg>
    ),
    repeat: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="3" y="2" width="8" height="2" fill={color} />
        <rect x="11" y="2" width="2" height="2" fill={color} />
        <rect x="13" y="4" width="2" height="6" fill={color} />
        <rect x="11" y="10" width="2" height="2" fill={color} />
        <rect x="3" y="12" width="8" height="2" fill={color} />
        <rect x="1" y="10" width="2" height="2" fill={color} />
        <rect x="1" y="4" width="2" height="6" fill={color} />
        <rect x="3" y="2" width="2" height="2" fill={color} />
        {/* right arrow at top */}
        <rect x="9" y="1" width="2" height="2" fill={color} />
        <rect x="11" y="1" width="2" height="2" fill={color} />
        <rect x="11" y="3" width="2" height="2" fill={color} />
        {/* left arrow at bottom */}
        <rect x="3" y="12" width="2" height="2" fill={color} />
        <rect x="1" y="12" width="2" height="2" fill={color} />
        <rect x="1" y="10" width="2" height="2" fill={color} />
      </svg>
    ),
    repeatOne: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="3" y="2" width="8" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="13" y="4" width="2" height="6" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="1" y="4" width="2" height="6" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="3" y="12" width="8" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="7" y="4" width="2" height="8" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="5" y="6" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
      </svg>
    ),
    queue: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="2" width="14" height="2" fill={color} />
        <rect x="1" y="6" width="14" height="2" fill={color} />
        <rect x="1" y="10" width="10" height="2" fill={color} />
        <rect x="12" y="9" width="3" height="4" fill={color} />
        <rect x="11" y="13" width="2" height="2" fill={color} />
      </svg>
    ),
    volume: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="5" width="4" height="6" fill={color} />
        <rect x="5" y="4" width="2" height="8" fill={color} />
        <rect x="7" y="3" width="2" height="10" fill={color} />
        <rect x="9" y="5" width="2" height="6" fill={color} />
        {/* waves */}
        <rect x="11" y="4" width="1" height="2" fill={color} />
        <rect x="12" y="3" width="1" height="10" fill={color} />
        <rect x="13" y="4" width="1" height="8" fill={color} />
        <rect x="11" y="10" width="1" height="2" fill={color} />
      </svg>
    ),
    volumeLow: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="5" width="4" height="6" fill={color} />
        <rect x="5" y="4" width="2" height="8" fill={color} />
        <rect x="7" y="3" width="2" height="10" fill={color} />
        <rect x="10" y="5" width="1" height="6" fill={color} />
        <rect x="11" y="4" width="1" height="8" fill={color} />
      </svg>
    ),
    volumeMute: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="5" width="4" height="6" fill={color} />
        <rect x="5" y="4" width="2" height="8" fill={color} />
        <rect x="7" y="3" width="2" height="10" fill={color} />
        {/* X mark */}
        <rect x="10" y="5" width="2" height="2" fill={color} />
        <rect x="12" y="7" width="2" height="2" fill={color} />
        <rect x="10" y="9" width="2" height="2" fill={color} />
        <rect x="12" y="5" width="2" height="2" fill={color} />
        <rect x="10" y="7" width="2" height="2" fill={color} />
        <rect x="12" y="9" width="2" height="2" fill={color} />
      </svg>
    ),
    heart: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="3" width="2" height="2" fill={color} />
        <rect x="4" y="2" width="2" height="2" fill={color} />
        <rect x="6" y="1" width="2" height="2" fill={color} />
        <rect x="8" y="1" width="2" height="2" fill={color} />
        <rect x="10" y="2" width="2" height="2" fill={color} />
        <rect x="12" y="3" width="2" height="2" fill={color} />
        <rect x="2" y="5" width="2" height="4" fill={color} />
        <rect x="12" y="5" width="2" height="4" fill={color} />
        <rect x="4" y="9" width="2" height="2" fill={color} />
        <rect x="10" y="9" width="2" height="2" fill={color} />
        <rect x="6" y="11" width="2" height="2" fill={color} />
        <rect x="8" y="11" width="2" height="2" fill={color} />
        <rect x="6" y="13" width="2" height="2" fill={color} />
        <rect x="8" y="13" width="2" height="2" fill={color} />
        <rect x="7" y="14" width="2" height="2" fill={color} />
      </svg>
    ),
    heartFilled: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="3" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="4" y="2" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="6" y="1" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="8" y="1" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="10" y="2" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="12" y="3" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="2" y="5" width="12" height="4" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="4" y="9" width="8" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="6" y="11" width="4" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="6" y="13" width="4" height="2" fill="var(--color-accent-primary, #E98A9A)" />
        <rect x="7" y="14" width="2" height="2" fill="var(--color-accent-primary, #E98A9A)" />
      </svg>
    ),
    more: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="3" y="7" width="2" height="2" fill={color} />
        <rect x="7" y="7" width="2" height="2" fill={color} />
        <rect x="11" y="7" width="2" height="2" fill={color} />
      </svg>
    ),
    close: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="2" width="2" height="2" fill={color} />
        <rect x="4" y="4" width="2" height="2" fill={color} />
        <rect x="6" y="6" width="2" height="2" fill={color} />
        <rect x="8" y="8" width="2" height="2" fill={color} />
        <rect x="10" y="10" width="2" height="2" fill={color} />
        <rect x="12" y="12" width="2" height="2" fill={color} />
        <rect x="12" y="2" width="2" height="2" fill={color} />
        <rect x="10" y="4" width="2" height="2" fill={color} />
        <rect x="4" y="10" width="2" height="2" fill={color} />
        <rect x="2" y="12" width="2" height="2" fill={color} />
      </svg>
    ),
    add: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="7" y="2" width="2" height="12" fill={color} />
        <rect x="2" y="7" width="12" height="2" fill={color} />
      </svg>
    ),
    settings: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="6" y="1" width="4" height="2" fill={color} />
        <rect x="5" y="3" width="6" height="2" fill={color} />
        <rect x="4" y="5" width="8" height="2" fill={color} />
        <rect x="2" y="7" width="12" height="2" fill={color} />
        <rect x="4" y="9" width="8" height="2" fill={color} />
        <rect x="5" y="11" width="6" height="2" fill={color} />
        <rect x="6" y="13" width="4" height="2" fill={color} />
        {/* center cutout */}
        <rect x="6" y="5" width="4" height="6" fill="var(--color-bg-secondary, #111624)" />
        <rect x="7" y="6" width="2" height="4" fill={color} />
      </svg>
    ),
    fullscreen: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="1" width="4" height="2" fill={color} />
        <rect x="1" y="1" width="2" height="4" fill={color} />
        <rect x="11" y="1" width="4" height="2" fill={color} />
        <rect x="13" y="1" width="2" height="4" fill={color} />
        <rect x="1" y="13" width="4" height="2" fill={color} />
        <rect x="1" y="11" width="2" height="4" fill={color} />
        <rect x="11" y="13" width="4" height="2" fill={color} />
        <rect x="13" y="11" width="2" height="4" fill={color} />
      </svg>
    ),
    collapse: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="5" width="4" height="2" fill={color} />
        <rect x="3" y="3" width="2" height="2" fill={color} />
        <rect x="3" y="7" width="2" height="2" fill={color} />
        <rect x="11" y="5" width="4" height="2" fill={color} />
        <rect x="11" y="3" width="2" height="2" fill={color} />
        <rect x="11" y="7" width="2" height="2" fill={color} />
        <rect x="1" y="11" width="4" height="2" fill={color} />
        <rect x="3" y="9" width="2" height="2" fill={color} />
        <rect x="3" y="13" width="2" height="2" fill={color} />
        <rect x="11" y="11" width="4" height="2" fill={color} />
        <rect x="11" y="9" width="2" height="2" fill={color} />
        <rect x="11" y="13" width="2" height="2" fill={color} />
      </svg>
    ),
    device: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="3" y="1" width="10" height="10" fill={color} />
        <rect x="4" y="2" width="8" height="8" fill="var(--color-bg-secondary, #111624)" />
        <rect x="6" y="11" width="4" height="2" fill={color} />
        <rect x="4" y="13" width="8" height="2" fill={color} />
        <rect x="5" y="4" width="6" height="4" fill={color} />
      </svg>
    ),
    equalizer: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="8" width="2" height="6" fill={color} />
        <rect x="5" y="4" width="2" height="10" fill={color} />
        <rect x="8" y="6" width="2" height="8" fill={color} />
        <rect x="11" y="2" width="2" height="12" fill={color} />
        <rect x="14" y="5" width="2" height="9" fill={color} />
      </svg>
    ),
    disc: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="5" y="1" width="6" height="2" fill={color} />
        <rect x="3" y="3" width="2" height="2" fill={color} />
        <rect x="11" y="3" width="2" height="2" fill={color} />
        <rect x="1" y="5" width="2" height="6" fill={color} />
        <rect x="13" y="5" width="2" height="6" fill={color} />
        <rect x="3" y="11" width="2" height="2" fill={color} />
        <rect x="11" y="11" width="2" height="2" fill={color} />
        <rect x="5" y="13" width="6" height="2" fill={color} />
        {/* inner ring */}
        <rect x="6" y="6" width="4" height="4" fill={color} />
        <rect x="7" y="7" width="2" height="2" fill="var(--color-bg-primary, #0B0E18)" />
      </svg>
    ),
    cassette: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="3" width="14" height="10" fill={color} />
        <rect x="2" y="4" width="12" height="8" fill="var(--color-bg-secondary, #111624)" />
        <rect x="3" y="8" width="10" height="3" fill={color} />
        {/* reels */}
        <rect x="3" y="5" width="4" height="4" fill={color} />
        <rect x="4" y="6" width="2" height="2" fill="var(--color-bg-secondary, #111624)" />
        <rect x="9" y="5" width="4" height="4" fill={color} />
        <rect x="10" y="6" width="2" height="2" fill="var(--color-bg-secondary, #111624)" />
      </svg>
    ),
    musicNote: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="5" y="2" width="8" height="2" fill={color} />
        <rect x="11" y="4" width="2" height="6" fill={color} />
        <rect x="5" y="4" width="2" height="6" fill={color} />
        <rect x="3" y="10" width="4" height="4" fill={color} />
        <rect x="9" y="10" width="4" height="4" fill={color} />
        <rect x="2" y="12" width="2" height="2" fill={color} />
        <rect x="13" y="12" width="2" height="2" fill={color} />
      </svg>
    ),
    user: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="5" y="1" width="6" height="2" fill={color} />
        <rect x="3" y="3" width="2" height="2" fill={color} />
        <rect x="11" y="3" width="2" height="2" fill={color} />
        <rect x="3" y="5" width="10" height="4" fill={color} />
        <rect x="3" y="9" width="2" height="2" fill={color} />
        <rect x="11" y="9" width="2" height="2" fill={color} />
        <rect x="5" y="11" width="6" height="2" fill={color} />
        <rect x="1" y="13" width="14" height="2" fill={color} />
        <rect x="1" y="11" width="2" height="2" fill={color} />
        <rect x="13" y="11" width="2" height="2" fill={color} />
      </svg>
    ),
    chevronUp: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="7" y="4" width="2" height="2" fill={color} />
        <rect x="5" y="6" width="2" height="2" fill={color} />
        <rect x="9" y="6" width="2" height="2" fill={color} />
        <rect x="3" y="8" width="2" height="2" fill={color} />
        <rect x="11" y="8" width="2" height="2" fill={color} />
      </svg>
    ),
    chevronDown: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="3" y="6" width="2" height="2" fill={color} />
        <rect x="11" y="6" width="2" height="2" fill={color} />
        <rect x="5" y="8" width="2" height="2" fill={color} />
        <rect x="9" y="8" width="2" height="2" fill={color} />
        <rect x="7" y="10" width="2" height="2" fill={color} />
      </svg>
    ),
    chevronLeft: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="10" y="3" width="2" height="2" fill={color} />
        <rect x="8" y="5" width="2" height="2" fill={color} />
        <rect x="6" y="7" width="2" height="2" fill={color} />
        <rect x="8" y="9" width="2" height="2" fill={color} />
        <rect x="10" y="11" width="2" height="2" fill={color} />
      </svg>
    ),
    chevronRight: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="4" y="3" width="2" height="2" fill={color} />
        <rect x="6" y="5" width="2" height="2" fill={color} />
        <rect x="8" y="7" width="2" height="2" fill={color} />
        <rect x="6" y="9" width="2" height="2" fill={color} />
        <rect x="4" y="11" width="2" height="2" fill={color} />
      </svg>
    ),
    external: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="8" y="1" width="6" height="2" fill={color} />
        <rect x="12" y="3" width="2" height="4" fill={color} />
        <rect x="6" y="5" width="2" height="2" fill={color} />
        <rect x="8" y="3" width="2" height="2" fill={color} />
        <rect x="4" y="7" width="2" height="2" fill={color} />
        <rect x="2" y="9" width="2" height="2" fill={color} />
        <rect x="1" y="7" width="2" height="8" fill={color} />
        <rect x="13" y="7" width="2" height="8" fill={color} />
        <rect x="3" y="13" width="10" height="2" fill={color} />
      </svg>
    ),
    check: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="7" width="2" height="2" fill={color} />
        <rect x="3" y="9" width="2" height="2" fill={color} />
        <rect x="5" y="11" width="2" height="2" fill={color} />
        <rect x="7" y="9" width="2" height="2" fill={color} />
        <rect x="9" y="7" width="2" height="2" fill={color} />
        <rect x="11" y="5" width="2" height="2" fill={color} />
        <rect x="13" y="3" width="2" height="2" fill={color} />
      </svg>
    ),
    drag: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="4" y="4" width="2" height="2" fill={color} />
        <rect x="10" y="4" width="2" height="2" fill={color} />
        <rect x="4" y="7" width="2" height="2" fill={color} />
        <rect x="10" y="7" width="2" height="2" fill={color} />
        <rect x="4" y="10" width="2" height="2" fill={color} />
        <rect x="10" y="10" width="2" height="2" fill={color} />
      </svg>
    ),
    trash: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="4" width="12" height="2" fill={color} />
        <rect x="5" y="2" width="6" height="2" fill={color} />
        <rect x="3" y="6" width="2" height="8" fill={color} />
        <rect x="11" y="6" width="2" height="8" fill={color} />
        <rect x="5" y="6" width="2" height="8" fill={color} />
        <rect x="9" y="6" width="2" height="8" fill={color} />
        <rect x="3" y="14" width="10" height="1" fill={color} />
      </svg>
    ),
    spotify: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="5" y="1" width="6" height="2" fill={color} />
        <rect x="3" y="3" width="2" height="2" fill={color} />
        <rect x="11" y="3" width="2" height="2" fill={color} />
        <rect x="1" y="5" width="2" height="6" fill={color} />
        <rect x="13" y="5" width="2" height="6" fill={color} />
        <rect x="3" y="11" width="2" height="2" fill={color} />
        <rect x="11" y="11" width="2" height="2" fill={color} />
        <rect x="5" y="13" width="6" height="2" fill={color} />
        {/* Spotify note bars */}
        <rect x="4" y="6" width="8" height="1" fill={color} />
        <rect x="4" y="8" width="7" height="1" fill={color} />
        <rect x="4" y="10" width="6" height="1" fill={color} />
      </svg>
    ),
    "pixel-logo": (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        {/* P letter pixel */}
        <rect x="2" y="2" width="2" height="12" fill={color} />
        <rect x="4" y="2" width="4" height="2" fill={color} />
        <rect x="8" y="3" width="2" height="2" fill={color} />
        <rect x="4" y="7" width="4" height="2" fill={color} />
        <rect x="8" y="5" width="2" height="2" fill={color} />
        {/* X pixel */}
        <rect x="11" y="2" width="2" height="4" fill={color} />
        <rect x="14" y="2" width="2" height="4" fill={color} />
        <rect x="12" y="6" width="2" height="2" fill={color} />
        <rect x="11" y="8" width="2" height="4" fill={color} />
        <rect x="14" y="8" width="2" height="4" fill={color} />
      </svg>
    ),
    grid: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="1" width="6" height="6" fill={color} />
        <rect x="9" y="1" width="6" height="6" fill={color} />
        <rect x="1" y="9" width="6" height="6" fill={color} />
        <rect x="9" y="9" width="6" height="6" fill={color} />
      </svg>
    ),
    list: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="3" width="2" height="2" fill={color} />
        <rect x="5" y="3" width="10" height="2" fill={color} />
        <rect x="1" y="7" width="2" height="2" fill={color} />
        <rect x="5" y="7" width="10" height="2" fill={color} />
        <rect x="1" y="11" width="2" height="2" fill={color} />
        <rect x="5" y="11" width="10" height="2" fill={color} />
      </svg>
    ),
    sortAsc: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="3" width="14" height="2" fill={color} />
        <rect x="1" y="7" width="10" height="2" fill={color} />
        <rect x="1" y="11" width="6" height="2" fill={color} />
      </svg>
    ),
    sortDesc: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="3" width="6" height="2" fill={color} />
        <rect x="1" y="7" width="10" height="2" fill={color} />
        <rect x="1" y="11" width="14" height="2" fill={color} />
      </svg>
    ),
    clock: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="5" y="1" width="6" height="2" fill={color} />
        <rect x="3" y="3" width="2" height="2" fill={color} />
        <rect x="11" y="3" width="2" height="2" fill={color} />
        <rect x="1" y="5" width="2" height="6" fill={color} />
        <rect x="13" y="5" width="2" height="6" fill={color} />
        <rect x="3" y="11" width="2" height="2" fill={color} />
        <rect x="11" y="11" width="2" height="2" fill={color} />
        <rect x="5" y="13" width="6" height="2" fill={color} />
        <rect x="7" y="4" width="2" height="4" fill={color} />
        <rect x="7" y="7" width="4" height="2" fill={color} />
      </svg>
    ),
    album: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="1" y="1" width="14" height="14" fill={color} />
        <rect x="2" y="2" width="12" height="12" fill="var(--color-bg-secondary, #111624)" />
        <rect x="5" y="5" width="6" height="6" fill={color} />
        <rect x="6" y="6" width="4" height="4" fill="var(--color-bg-secondary, #111624)" />
        <rect x="7" y="7" width="2" height="2" fill={color} />
      </svg>
    ),
    artist: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="5" y="1" width="6" height="6" fill={color} />
        <rect x="3" y="3" width="2" height="4" fill={color} />
        <rect x="11" y="3" width="2" height="4" fill={color} />
        <rect x="3" y="7" width="10" height="2" fill={color} />
        <rect x="1" y="10" width="14" height="5" fill={color} />
        <rect x="4" y="9" width="2" height="2" fill={color} />
        <rect x="10" y="9" width="2" height="2" fill={color} />
      </svg>
    ),
    podcast: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="6" y="1" width="4" height="6" fill={color} />
        <rect x="4" y="3" width="2" height="4" fill={color} />
        <rect x="10" y="3" width="2" height="4" fill={color} />
        <rect x="2" y="7" width="2" height="4" fill={color} />
        <rect x="12" y="7" width="2" height="4" fill={color} />
        <rect x="4" y="11" width="2" height="2" fill={color} />
        <rect x="10" y="11" width="2" height="2" fill={color} />
        <rect x="6" y="13" width="4" height="2" fill={color} />
        <rect x="7" y="8" width="2" height="5" fill={color} />
      </svg>
    ),
    remove: (
      <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
        {title && <title>{title}</title>}
        <rect x="2" y="7" width="12" height="2" fill={color} />
      </svg>
    ),
  };

  return (
    <span
      className={cn("inline-flex items-center justify-center shrink-0", className)}
      style={{ width: px, height: px }}
      aria-hidden={!title}
    >
      {icons[name] ?? (
        <svg width={px} height={px} viewBox="0 0 16 16" fill="none" shapeRendering="crispEdges">
          <rect x="2" y="2" width="12" height="12" fill={color} opacity={0.3} />
        </svg>
      )}
    </span>
  );
}
