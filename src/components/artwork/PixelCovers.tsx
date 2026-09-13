'use client';

import React from 'react';
import { PixelCoverTheme } from '@/types/music';

interface CoverProps {
  size?: number;
  className?: string;
}

// ============================================================
// 1. Midnight Drive — Sunset Synthwave Highway
// ============================================================
export function MidnightDriveCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      {/* Sky Gradient Blocks */}
      <rect width="200" height="40" fill="#0B0E18" />
      <rect y="40" width="200" height="25" fill="#1A1535" />
      <rect y="65" width="200" height="25" fill="#3D2B6B" />
      <rect y="90" width="200" height="20" fill="#6B3FA0" />
      <rect y="110" width="200" height="15" fill="#A44B88" />
      <rect y="125" width="200" height="15" fill="#E98A9A" />
      
      {/* Retrowave Sun */}
      <rect x="70" y="60" width="60" height="60" fill="#F0C58B" />
      {/* Sun horizontal scanline cuts */}
      <rect x="68" y="85" width="64" height="4" fill="#6B3FA0" />
      <rect x="66" y="95" width="68" height="6" fill="#6B3FA0" />
      <rect x="64" y="106" width="72" height="8" fill="#A44B88" />

      {/* Mountain Silhouettes */}
      <polygon points="0,130 40,105 85,130" fill="#20153B" />
      <polygon points="65,130 110,95 155,130" fill="#180E2E" />
      <polygon points="135,130 170,108 200,130" fill="#20153B" />

      {/* Grid Floor */}
      <rect y="130" width="200" height="70" fill="#0B0E18" />
      {/* Horizontal grid lines */}
      <rect y="138" width="200" height="2" fill="#E98A9A" opacity="0.3" />
      <rect y="148" width="200" height="2" fill="#E98A9A" opacity="0.45" />
      <rect y="162" width="200" height="3" fill="#E98A9A" opacity="0.7" />
      <rect y="180" width="200" height="4" fill="#E98A9A" />
      
      {/* Perspective Vertical Lines */}
      <line x1="100" y1="130" x2="0" y2="200" stroke="#7ED6C8" strokeWidth="2" />
      <line x1="100" y1="130" x2="40" y2="200" stroke="#7ED6C8" strokeWidth="2" />
      <line x1="100" y1="130" x2="80" y2="200" stroke="#7ED6C8" strokeWidth="2" />
      <line x1="100" y1="130" x2="100" y2="200" stroke="#F0EAF7" strokeWidth="3" />
      <line x1="100" y1="130" x2="120" y2="200" stroke="#7ED6C8" strokeWidth="2" />
      <line x1="100" y1="130" x2="160" y2="200" stroke="#7ED6C8" strokeWidth="2" />
      <line x1="100" y1="130" x2="200" y2="200" stroke="#7ED6C8" strokeWidth="2" />

      {/* Retro Car Silhouette */}
      <rect x="86" y="166" width="28" height="12" fill="#111624" />
      <rect x="90" y="158" width="20" height="9" fill="#171C2D" />
      <rect x="88" y="172" width="6" height="3" fill="#E98A9A" />
      <rect x="106" y="172" width="6" height="3" fill="#E98A9A" />
    </svg>
  );
}

// ============================================================
// 2. Cyberpunk City — Rainy Neon Metropolis
// ============================================================
export function CyberpunkCityCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#0A0E18" />

      {/* Distant Skyscrapers */}
      <rect x="15" y="30" width="30" height="170" fill="#121829" />
      <rect x="55" y="50" width="45" height="150" fill="#171F36" />
      <rect x="110" y="20" width="40" height="180" fill="#121829" />
      <rect x="160" y="60" width="35" height="140" fill="#1A243D" />

      {/* Antennas & Tower Spikes */}
      <rect x="29" y="10" width="2" height="20" fill="#E98A9A" />
      <rect x="129" y="5" width="3" height="15" fill="#7ED6C8" />
      <rect x="128" y="2" width="5" height="4" fill="#F0C58B" />

      {/* Glowing Windows */}
      <rect x="20" y="45" width="4" height="4" fill="#7ED6C8" />
      <rect x="28" y="60" width="4" height="4" fill="#7ED6C8" />
      <rect x="20" y="75" width="4" height="4" fill="#F0C58B" />
      <rect x="62" y="70" width="5" height="5" fill="#E98A9A" />
      <rect x="74" y="70" width="5" height="5" fill="#E98A9A" />
      <rect x="86" y="90" width="5" height="5" fill="#7ED6C8" />
      <rect x="62" y="110" width="5" height="5" fill="#F0C58B" />
      <rect x="118" y="40" width="6" height="4" fill="#7ED6C8" />
      <rect x="130" y="40" width="6" height="4" fill="#E98A9A" />
      <rect x="118" y="60" width="6" height="4" fill="#7ED6C8" />
      <rect x="130" y="80" width="6" height="4" fill="#F0C58B" />

      {/* Giant Neon Billboard */}
      <rect x="60" y="130" width="40" height="20" fill="#E98A9A" />
      <rect x="63" y="133" width="34" height="14" fill="#0B0E18" />
      <rect x="68" y="138" width="24" height="4" fill="#7ED6C8" />

      {/* Wet Street Reflections */}
      <rect y="175" width="200" height="25" fill="#0E1626" />
      <rect x="60" y="180" width="40" height="4" fill="#E98A9A" opacity="0.4" />
      <rect x="115" y="183" width="30" height="3" fill="#7ED6C8" opacity="0.5" />
      <rect x="20" y="187" width="20" height="3" fill="#F0C58B" opacity="0.3" />
      
      {/* Pixel Rain streaks */}
      <line x1="25" y1="20" x2="20" y2="40" stroke="#7ED6C8" strokeWidth="1" opacity="0.4" />
      <line x1="85" y1="40" x2="80" y2="65" stroke="#7ED6C8" strokeWidth="1" opacity="0.5" />
      <line x1="145" y1="15" x2="140" y2="35" stroke="#7ED6C8" strokeWidth="1" opacity="0.4" />
      <line x1="175" y1="70" x2="170" y2="95" stroke="#7ED6C8" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

// ============================================================
// 3. Cassette Dreams — Vintage Hi-Fi Tape
// ============================================================
export function CassetteDreamsCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#111624" />
      <rect x="10" y="10" width="180" height="180" fill="#171C2D" />

      {/* Cassette Body */}
      <rect x="20" y="35" width="160" height="130" fill="#20263B" />
      <rect x="24" y="39" width="152" height="122" fill="#2B324B" />

      {/* Paper Label */}
      <rect x="34" y="48" width="132" height="74" fill="#F0EAF7" />
      <rect x="38" y="52" width="124" height="14" fill="#E98A9A" />
      <rect x="42" y="56" width="30" height="6" fill="#F0EAF7" />
      <rect x="80" y="56" width="40" height="3" fill="#111624" />

      {/* Magnetic Tape Window */}
      <rect x="50" y="74" width="100" height="36" fill="#111624" />
      <rect x="54" y="78" width="92" height="28" fill="#171C2D" />

      {/* Tape Spools */}
      <rect x="64" y="84" width="16" height="16" fill="#F0EAF7" />
      <rect x="68" y="88" width="8" height="8" fill="#111624" />
      <rect x="120" y="84" width="16" height="16" fill="#F0EAF7" />
      <rect x="124" y="88" width="8" height="8" fill="#111624" />
      
      {/* Tape connector band */}
      <rect x="80" y="90" width="40" height="4" fill="#8B6914" />

      {/* Bottom Trapeze Notch */}
      <polygon points="45,165 60,135 140,135 155,165" fill="#20263B" />
      <rect x="80" y="145" width="40" height="12" fill="#111624" />
      <circle cx="70" cy="150" r="3" fill="#2B324B" />
      <circle cx="130" cy="150" r="3" fill="#2B324B" />
    </svg>
  );
}

// ============================================================
// 4. Pixel Forest — Misty Green RPG Woods
// ============================================================
export function PixelForestCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#08140E" />

      {/* Moon */}
      <rect x="130" y="25" width="36" height="36" fill="#F0C58B" />
      <rect x="126" y="29" width="4" height="28" fill="#F0C58B" />
      <rect x="166" y="29" width="4" height="28" fill="#F0C58B" />

      {/* Distant Fog Layers */}
      <rect y="80" width="200" height="30" fill="#0E2418" opacity="0.7" />
      <rect y="110" width="200" height="40" fill="#153624" opacity="0.6" />

      {/* Background Trees */}
      <polygon points="30,70 15,140 45,140" fill="#143622" />
      <polygon points="80,60 60,140 100,140" fill="#18422A" />
      <polygon points="125,75 105,145 145,145" fill="#143622" />
      <polygon points="175,65 155,140 195,140" fill="#18422A" />

      {/* Foreground Pines */}
      <polygon points="50,90 20,185 80,185" fill="#1C4F33" />
      <polygon points="110,85 75,190 145,190" fill="#246441" />
      <polygon points="165,100 135,185 195,185" fill="#1C4F33" />

      {/* Forest Floor */}
      <rect y="175" width="200" height="25" fill="#0F2B1C" />

      {/* Glowing Fireflies */}
      <rect x="40" y="130" width="3" height="3" fill="#7EC87E" />
      <rect x="95" y="115" width="3" height="3" fill="#F0C58B" />
      <rect x="135" y="140" width="4" height="4" fill="#7EC87E" />
      <rect x="75" y="160" width="3" height="3" fill="#7EC87E" />
      <rect x="160" y="150" width="3" height="3" fill="#F0C58B" />
    </svg>
  );
}

// ============================================================
// 5. Neon Arcade — 80s Cabinet Parlor
// ============================================================
export function NeonArcadeCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#080714" />

      {/* Arcade Wall Glow */}
      <rect x="30" y="10" width="140" height="180" fill="#14102C" />

      {/* Arcade Marquee Header */}
      <rect x="50" y="25" width="100" height="30" fill="#E98A9A" />
      <rect x="54" y="29" width="92" height="22" fill="#0B0E18" />
      <rect x="62" y="37" width="76" height="6" fill="#7ED6C8" />

      {/* Cabinet Bezel */}
      <rect x="50" y="58" width="100" height="64" fill="#1E1740" />
      <rect x="58" y="64" width="84" height="52" fill="#000000" />
      
      {/* Game Screen Content (Space Invader) */}
      <rect x="92" y="74" width="16" height="4" fill="#7ED6C8" />
      <rect x="88" y="78" width="24" height="8" fill="#7ED6C8" />
      <rect x="92" y="86" width="16" height="4" fill="#7ED6C8" />
      <rect x="88" y="82" width="4" height="4" fill="#000000" />
      <rect x="108" y="82" width="4" height="4" fill="#000000" />

      {/* Control Panel */}
      <polygon points="40,140 50,122 150,122 160,140" fill="#2E245E" />
      {/* Joystick */}
      <rect x="68" y="132" width="4" height="8" fill="#F0EAF7" />
      <circle cx="70" cy="130" r="5" fill="#E98A9A" />
      {/* Buttons */}
      <circle cx="115" cy="132" r="3" fill="#7ED6C8" />
      <circle cx="125" cy="130" r="3" fill="#E98A9A" />
      <circle cx="135" cy="132" r="3" fill="#F0C58B" />

      {/* Lower Cabinet */}
      <rect x="50" y="140" width="100" height="60" fill="#1E1740" />
      <rect x="75" y="155" width="20" height="30" fill="#0B0E18" />
      <rect x="83" y="165" width="4" height="8" fill="#F0C58B" />
      <rect x="105" y="155" width="20" height="30" fill="#0B0E18" />
      <rect x="113" y="165" width="4" height="8" fill="#F0C58B" />
    </svg>
  );
}

// ============================================================
// 6. Shibuya Rain — Tokyo Wet Street
// ============================================================
export function ShibuyaRainCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#090E1A" />

      {/* Distant building neon stripes */}
      <rect x="20" y="20" width="8" height="60" fill="#E98A9A" />
      <rect x="36" y="40" width="6" height="45" fill="#7ED6C8" />
      <rect x="155" y="15" width="10" height="80" fill="#F0C58B" />
      <rect x="175" y="35" width="8" height="55" fill="#B7A7E5" />

      {/* Crosswalk Zebra Stripes */}
      <rect y="130" width="200" height="70" fill="#111624" />
      <rect x="25" y="145" width="20" height="55" fill="#2B324B" />
      <rect x="65" y="145" width="20" height="55" fill="#2B324B" />
      <rect x="105" y="145" width="20" height="55" fill="#2B324B" />
      <rect x="145" y="145" width="20" height="55" fill="#2B324B" />

      {/* Wet Road Reflections */}
      <rect x="22" y="155" width="15" height="15" fill="#E98A9A" opacity="0.35" />
      <rect x="150" y="160" width="20" height="20" fill="#F0C58B" opacity="0.3" />

      {/* Umbrella Figure */}
      <path d="M 80,120 Q 100,95 120,120 Z" fill="#E98A9A" />
      <rect x="99" y="120" width="2" height="35" fill="#F0EAF7" />
      <rect x="94" y="130" width="12" height="25" fill="#1A2238" />
    </svg>
  );
}

// ============================================================
// 7. Space Station — Retro Satellite Orbit
// ============================================================
export function SpaceStationCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#04060C" />

      {/* Starfield */}
      <rect x="25" y="30" width="2" height="2" fill="#F0EAF7" />
      <rect x="75" y="18" width="3" height="3" fill="#B7A7E5" />
      <rect x="160" y="45" width="2" height="2" fill="#F0EAF7" />
      <rect x="180" y="85" width="3" height="3" fill="#7ED6C8" />
      <rect x="40" y="110" width="2" height="2" fill="#F0EAF7" />
      <rect x="90" y="160" width="2" height="2" fill="#B7A7E5" />
      <rect x="170" y="175" width="2" height="2" fill="#F0EAF7" />

      {/* Giant Blue Planet Crest at Corner */}
      <circle cx="210" cy="210" r="110" fill="#173059" />
      <circle cx="210" cy="210" r="95" fill="#204A8A" />
      <circle cx="210" cy="210" r="80" fill="#2E6ABF" />

      {/* Space Station Body */}
      <rect x="70" y="70" width="60" height="24" fill="#F0EAF7" />
      <rect x="88" y="62" width="24" height="40" fill="#C5CFE0" />
      <rect x="96" y="54" width="8" height="56" fill="#8B9BB4" />

      {/* Solar Panel Wings */}
      <rect x="20" y="66" width="46" height="32" fill="#1C3D6E" />
      <line x1="35" y1="66" x2="35" y2="98" stroke="#7ED6C8" strokeWidth="2" />
      <line x1="50" y1="66" x2="50" y2="98" stroke="#7ED6C8" strokeWidth="2" />
      
      <rect x="134" y="66" width="46" height="32" fill="#1C3D6E" />
      <line x1="149" y1="66" x2="149" y2="98" stroke="#7ED6C8" strokeWidth="2" />
      <line x1="164" y1="66" x2="164" y2="98" stroke="#7ED6C8" strokeWidth="2" />

      {/* Communication Dish Antenna */}
      <rect x="98" y="36" width="4" height="18" fill="#E98A9A" />
      <circle cx="100" cy="34" r="6" fill="#F0C58B" />
    </svg>
  );
}

// ============================================================
// 8. Fantasy Horizon — Twin Moons over 8-Bit Peaks
// ============================================================
export function FantasyHorizonCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#0C0E1E" />

      {/* Aurora Waves */}
      <rect y="40" width="200" height="15" fill="#7ED6C8" opacity="0.2" />
      <rect y="55" width="200" height="20" fill="#B7A7E5" opacity="0.25" />
      <rect y="75" width="200" height="15" fill="#E98A9A" opacity="0.2" />

      {/* Twin Moons */}
      <circle cx="60" cy="55" r="22" fill="#F0C58B" />
      <circle cx="135" cy="40" r="14" fill="#B7A7E5" />

      {/* Distant Mountain Range */}
      <polygon points="0,140 40,85 90,140" fill="#1A2140" />
      <polygon points="70,140 120,70 170,140" fill="#242F59" />
      <polygon points="150,140 180,95 200,140" fill="#1A2140" />

      {/* Near Mountain Peak with Snow */}
      <polygon points="30,170 100,90 170,170" fill="#323E75" />
      <polygon points="85,108 100,90 115,108" fill="#F0EAF7" />

      {/* Valley Base */}
      <rect y="165" width="200" height="35" fill="#111624" />
      <rect x="80" y="178" width="40" height="4" fill="#7ED6C8" opacity="0.5" />
    </svg>
  );
}

// ============================================================
// 9. Desert Highway
// ============================================================
export function DesertHighwayCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#1A0D08" />
      <rect y="40" width="200" height="30" fill="#3D1808" />
      <rect y="70" width="200" height="30" fill="#7A2D0A" />
      <rect y="100" width="200" height="30" fill="#B84A12" />
      <rect y="130" width="200" height="20" fill="#F07A2B" />

      {/* Saguaro Cactus */}
      <rect x="35" y="80" width="6" height="55" fill="#0C1F10" />
      <rect x="25" y="95" width="10" height="5" fill="#0C1F10" />
      <rect x="25" y="85" width="5" height="15" fill="#0C1F10" />
      <rect x="41" y="100" width="10" height="5" fill="#0C1F10" />
      <rect x="46" y="90" width="5" height="15" fill="#0C1F10" />

      {/* Road */}
      <polygon points="100,140 30,200 170,200" fill="#1E2024" />
      <line x1="100" y1="140" x2="100" y2="200" stroke="#F0C58B" strokeWidth="2" strokeDasharray="6 6" />
    </svg>
  );
}

// ============================================================
// 10. Retro Computer
// ============================================================
export function RetroComputerCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#0E121E" />

      {/* Monitor Case */}
      <rect x="30" y="30" width="140" height="115" fill="#C4B79B" />
      <rect x="42" y="42" width="116" height="91" fill="#1A1C16" />
      
      {/* Green Terminal Screen */}
      <rect x="48" y="48" width="104" height="79" fill="#061208" />
      <rect x="56" y="58" width="12" height="4" fill="#7EC87E" />
      <rect x="72" y="58" width="20" height="4" fill="#7EC87E" />
      <rect x="56" y="68" width="36" height="4" fill="#7EC87E" />
      <rect x="56" y="78" width="8" height="4" fill="#7EC87E" />
      {/* Blinking block cursor */}
      <rect x="68" y="78" width="6" height="6" fill="#7EC87E" />

      {/* Floppy Drive Slot */}
      <rect x="40" y="152" width="120" height="28" fill="#A89B7E" />
      <rect x="90" y="162" width="60" height="4" fill="#1A1C16" />
      <rect x="135" y="170" width="8" height="4" fill="#E98A9A" />
    </svg>
  );
}

// ============================================================
// 11. Pixel Sunset — Tropical Silhouette Sunset
// Matches media_1789322141861.jpg (Pixel Sunset / The Retros)
// ============================================================
export function PixelSunsetCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      {/* Sky Gradients */}
      <rect width="200" height="30" fill="#2E183B" />
      <rect y="30" width="200" height="25" fill="#582452" />
      <rect y="55" width="200" height="25" fill="#8C3558" />
      <rect y="80" width="200" height="25" fill="#C44E52" />
      <rect y="105" width="200" height="20" fill="#E8764B" />

      {/* Cloud Strata */}
      <rect x="20" y="42" width="45" height="5" fill="#6B2F5E" />
      <rect x="120" y="38" width="55" height="6" fill="#6B2F5E" />
      <rect x="80" y="65" width="65" height="5" fill="#A83E58" />

      {/* Giant Sunset Orb */}
      <circle cx="100" cy="98" r="32" fill="#F8B14B" />
      <circle cx="100" cy="98" r="24" fill="#FDE178" />

      {/* Ocean Horizon & Water */}
      <rect y="125" width="200" height="75" fill="#162A4A" />
      {/* Water reflection bands */}
      <rect x="75" y="126" width="50" height="3" fill="#F8B14B" />
      <rect x="70" y="132" width="60" height="3" fill="#E8764B" />
      <rect x="80" y="138" width="40" height="4" fill="#F8B14B" />
      <rect x="72" y="146" width="56" height="4" fill="#E8764B" />
      <rect x="85" y="154" width="30" height="5" fill="#F8B14B" />
      <rect x="68" y="164" width="64" height="5" fill="#2E5077" />
      <rect x="50" y="175" width="100" height="6" fill="#1B385D" />

      {/* Left Island Silhouette */}
      <polygon points="0,200 0,110 25,90 35,130 55,200" fill="#0C141C" />

      {/* Right Island Silhouette */}
      <polygon points="135,200 155,140 180,125 200,120 200,200" fill="#0C141C" />

      {/* Silhouette Palm Trees (Right Island) */}
      {/* Palm Trunk 1 */}
      <path d="M 168 145 Q 165 125 160 100" stroke="#0C141C" strokeWidth="4" fill="none" />
      {/* Palm Fronds 1 */}
      <polygon points="160,100 142,88 152,98" fill="#0C141C" />
      <polygon points="160,100 178,88 168,98" fill="#0C141C" />
      <polygon points="160,100 148,110 156,104" fill="#0C141C" />
      <polygon points="160,100 174,108 165,103" fill="#0C141C" />
      <polygon points="160,100 160,82 163,94" fill="#0C141C" />

      {/* Palm Trunk 2 */}
      <path d="M 182 145 Q 186 128 188 112" stroke="#0C141C" strokeWidth="3" fill="none" />
      {/* Palm Fronds 2 */}
      <polygon points="188,112 174,102 182,110" fill="#0C141C" />
      <polygon points="188,112 200,104 194,111" fill="#0C141C" />
      <polygon points="188,112 186,96 189,106" fill="#0C141C" />
    </svg>
  );
}

// ============================================================
// 12. Chill Vibes — Crescent Moon City Skyline
// Matches media_1789322141854.jpg
// ============================================================
export function ChillVibesCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#0E1626" />

      {/* Crescent Moon */}
      <circle cx="130" cy="55" r="16" fill="#F1F5F9" />
      <circle cx="137" cy="52" r="14" fill="#0E1626" />

      {/* Stars */}
      <rect x="35" y="30" width="2" height="2" fill="#94A3B8" />
      <rect x="75" y="45" width="3" height="3" fill="#CBD5E1" />
      <rect x="170" y="25" width="2" height="2" fill="#94A3B8" />
      <rect x="40" y="70" width="2" height="2" fill="#CBD5E1" />

      {/* Background Skyline */}
      <rect x="15" y="70" width="30" height="130" fill="#1C2740" />
      <rect x="55" y="90" width="25" height="110" fill="#243354" />
      <rect x="90" y="60" width="35" height="140" fill="#1A253E" />
      <rect x="135" y="80" width="25" height="120" fill="#243354" />
      <rect x="165" y="95" width="25" height="105" fill="#1C2740" />

      {/* Foreground Skyline (Darker) */}
      <rect x="0" y="115" width="35" height="85" fill="#0A101C" />
      <rect x="45" y="125" width="30" height="75" fill="#0D1422" />
      <rect x="85" y="105" width="40" height="95" fill="#0A101C" />
      <rect x="135" y="130" width="30" height="70" fill="#0D1422" />
      <rect x="175" y="120" width="25" height="80" fill="#0A101C" />

      {/* Glowing City Windows */}
      <rect x="8" y="130" width="3" height="3" fill="#60A5FA" />
      <rect x="18" y="145" width="3" height="3" fill="#FDE047" />
      <rect x="95" y="120" width="4" height="4" fill="#60A5FA" />
      <rect x="110" y="135" width="4" height="4" fill="#F472B6" />
      <rect x="95" y="150" width="4" height="4" fill="#60A5FA" />
      <rect x="145" y="145" width="3" height="3" fill="#FDE047" />
    </svg>
  );
}

// ============================================================
// 13. Coffee & Code — Steaming Coffee Cup on Wood Table
// Matches media_1789322141854.jpg
// ============================================================
export function CoffeeAndCodeCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      {/* Warm Ambient Wall */}
      <rect width="200" height="130" fill="#1C140E" />
      {/* Window warm light patch */}
      <rect x="130" y="20" width="50" height="70" fill="#2E2016" />
      <rect x="135" y="25" width="40" height="60" fill="#3D2B1E" />

      {/* Wood Desk */}
      <rect y="130" width="200" height="70" fill="#2A1B10" />
      <rect y="133" width="200" height="4" fill="#3D2919" />
      <rect y="145" width="200" height="2" fill="#1F130A" />

      {/* Saucer */}
      <ellipse cx="100" cy="160" rx="48" ry="12" fill="#D2B48C" />
      <ellipse cx="100" cy="160" rx="42" ry="9" fill="#E8D5B5" />
      <ellipse cx="100" cy="160" rx="34" ry="7" fill="#C4A478" />

      {/* Ceramic Coffee Mug */}
      <rect x="75" y="105" width="50" height="48" rx="0" fill="#E8D5B5" />
      <rect x="72" y="102" width="56" height="6" fill="#F5E8D3" />
      <ellipse cx="100" cy="105" rx="25" ry="6" fill="#3D1E0B" />
      <ellipse cx="100" cy="105" rx="20" ry="4" fill="#542B10" />

      {/* Mug Handle */}
      <path
        d="M 125 112 C 145 112, 145 138, 125 138"
        stroke="#E8D5B5"
        strokeWidth="6"
        fill="none"
      />

      {/* Rising Steam Pixels */}
      <rect x="92" y="90" width="3" height="6" fill="#E8D5B5" opacity="0.6" />
      <rect x="96" y="80" width="3" height="7" fill="#E8D5B5" opacity="0.4" />
      <rect x="104" y="92" width="3" height="5" fill="#E8D5B5" opacity="0.6" />
      <rect x="102" y="76" width="3" height="8" fill="#E8D5B5" opacity="0.3" />
    </svg>
  );
}

// ============================================================
// 14. Star Gazer — Cosmic Starfield Arc
// Matches media_1789322141854.jpg
// ============================================================
export function StarGazerCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#070A12" />

      {/* Glowing Celestial Stars */}
      <rect x="40" y="30" width="3" height="3" fill="#60A5FA" />
      <rect x="39" y="31" width="5" height="1" fill="#FFFFFF" />
      <rect x="41" y="29" width="1" height="5" fill="#FFFFFF" />

      <rect x="160" y="40" width="3" height="3" fill="#60A5FA" />
      <rect x="159" y="41" width="5" height="1" fill="#FFFFFF" />
      <rect x="161" y="39" width="1" height="5" fill="#FFFFFF" />

      <rect x="100" y="20" width="2" height="2" fill="#93C5FD" />
      <rect x="75" y="55" width="2" height="2" fill="#E2E8F0" />
      <rect x="135" y="65" width="2" height="2" fill="#E2E8F0" />
      <rect x="180" y="80" width="2" height="2" fill="#93C5FD" />
      <rect x="25" y="85" width="2" height="2" fill="#93C5FD" />

      {/* Blue Atmospheric Glow Arc */}
      <circle cx="100" cy="220" r="100" fill="#172554" />
      <circle cx="100" cy="220" r="85" fill="#1E3A8A" />
      <circle cx="100" cy="220" r="70" fill="#1D4ED8" />
      <circle cx="100" cy="220" r="55" fill="#2563EB" />
      <circle cx="100" cy="220" r="40" fill="#60A5FA" />
      <circle cx="100" cy="220" r="25" fill="#93C5FD" />
      <circle cx="100" cy="220" r="10" fill="#FFFFFF" />
    </svg>
  );
}

// ============================================================
// 15. Focus — Misty Evergreen Stream
// Matches media_1789322141854.jpg
// ============================================================
export function FocusCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#0A1811" />

      {/* Misty Mountains in Background */}
      <polygon points="0,110 50,55 105,110" fill="#143625" />
      <polygon points="80,110 135,45 190,110" fill="#1A442F" />
      <polygon points="150,110 175,70 200,110" fill="#143625" />

      {/* Mist Layers */}
      <rect y="85" width="200" height="20" fill="#34D399" opacity="0.15" />
      <rect y="105" width="200" height="25" fill="#6EE7B7" opacity="0.2" />

      {/* Evergreen Forest Pines */}
      <polygon points="25,95 5,160 45,160" fill="#112F20" />
      <polygon points="65,90 40,165 90,165" fill="#1E5239" />
      <polygon points="140,85 110,160 170,160" fill="#1E5239" />
      <polygon points="180,95 155,165 205,165" fill="#112F20" />

      {/* Central Winding River / Stream */}
      <polygon points="95,110 105,110 120,200 80,200" fill="#2DD4BF" opacity="0.7" />
      <polygon points="98,110 102,110 108,200 92,200" fill="#99F6E4" />

      {/* Riverbank Moss Rocks */}
      <rect y="160" width="85" height="40" fill="#0D2217" />
      <rect x="115" y="160" width="85" height="40" fill="#0D2217" />
    </svg>
  );
}

// ============================================================
// 16. Velvet Skies — Dreamwave Sunset Clouds
// Matches media_1789323172694.png
// ============================================================
export function VelvetSkiesCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      <rect width="200" height="200" fill="#2E1065" />
      {/* Sky bands */}
      <rect y="30" width="200" height="30" fill="#3B0764" />
      <rect y="60" width="200" height="30" fill="#4C1D95" />
      <rect y="90" width="200" height="40" fill="#581C87" />
      <rect y="130" width="200" height="70" fill="#3B0764" />

      {/* Crescent Moon */}
      <rect x="135" y="35" width="20" height="20" fill="#FEF08A" />
      <rect x="132" y="32" width="18" height="18" fill="#3B0764" />

      {/* Fluffy Lavender/Pink Pixel Clouds */}
      <rect x="20" y="90" width="70" height="30" rx="4" fill="#C084FC" />
      <rect x="35" y="75" width="45" height="25" rx="4" fill="#E879F9" />
      <rect x="50" y="65" width="30" height="20" rx="4" fill="#F472B6" />

      <rect x="85" y="115" width="95" height="40" rx="6" fill="#A855F7" />
      <rect x="105" y="100" width="60" height="30" rx="4" fill="#C084FC" />
      <rect x="120" y="88" width="40" height="25" rx="4" fill="#F472B6" />

      {/* Cloud shadow bases */}
      <rect x="25" y="115" width="60" height="8" fill="#581C87" opacity="0.6" />
      <rect x="90" y="150" width="85" height="10" fill="#3B0764" opacity="0.6" />
    </svg>
  );
}

// ============================================================
// 17. Butterflies — Indie Bloom Pixel Butterfly
// Matches media_1789323172694.png
// ============================================================
export function ButterfliesCover({ size = 200, className }: CoverProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" shapeRendering="crispEdges" className={className}>
      {/* Warm Golden / Peach Background */}
      <rect width="200" height="200" fill="#F59E0B" />
      <rect x="10" y="10" width="180" height="180" fill="#FBBF24" />
      <rect x="20" y="20" width="160" height="160" fill="#FDE68A" />

      {/* Pixel Butterfly (Centered) */}
      {/* Left Upper Wing */}
      <rect x="50" y="55" width="40" height="40" fill="#0284C7" />
      <rect x="40" y="65" width="50" height="35" fill="#38BDF8" />
      <rect x="55" y="70" width="25" height="20" fill="#BAE6FD" />
      <rect x="60" y="75" width="15" height="10" fill="#FFFFFF" />

      {/* Right Upper Wing */}
      <rect x="110" y="55" width="40" height="40" fill="#0284C7" />
      <rect x="110" y="65" width="50" height="35" fill="#38BDF8" />
      <rect x="120" y="70" width="25" height="20" fill="#BAE6FD" />
      <rect x="125" y="75" width="15" height="10" fill="#FFFFFF" />

      {/* Left Lower Wing */}
      <rect x="60" y="95" width="30" height="40" fill="#0369A1" />
      <rect x="50" y="105" width="35" height="25" fill="#0284C7" />
      <rect x="65" y="110" width="15" height="15" fill="#38BDF8" />

      {/* Right Lower Wing */}
      <rect x="110" y="95" width="30" height="40" fill="#0369A1" />
      <rect x="115" y="105" width="35" height="25" fill="#0284C7" />
      <rect x="120" y="110" width="15" height="15" fill="#38BDF8" />

      {/* Butterfly Body & Head */}
      <rect x="96" y="65" width="8" height="65" fill="#0F172A" />
      <rect x="94" y="55" width="12" height="12" fill="#0F172A" />
      {/* Antennae */}
      <rect x="90" y="45" width="4" height="12" fill="#0F172A" />
      <rect x="85" y="40" width="6" height="5" fill="#0F172A" />
      <rect x="106" y="45" width="4" height="12" fill="#0F172A" />
      <rect x="109" y="40" width="6" height="5" fill="#0F172A" />
    </svg>
  );
}

export const PIXEL_COVER_MAP: Record<PixelCoverTheme, React.ComponentType<CoverProps>> = {
  'pixel-sunset': PixelSunsetCover,
  'chill-vibes': ChillVibesCover,
  'coffee-code': CoffeeAndCodeCover,
  'star-gazer': StarGazerCover,
  'focus': FocusCover,
  'midnight-drive': MidnightDriveCover,
  'cyberpunk-city': CyberpunkCityCover,
  'cassette-dreams': CassetteDreamsCover,
  'pixel-forest': FocusCover,
  'neon-arcade': NeonArcadeCover,
  'shibuya-rain': ShibuyaRainCover,
  'space-station': StarGazerCover,
  'fantasy-horizon': PixelSunsetCover,
  'desert-highway': DesertHighwayCover,
  'retro-computer': RetroComputerCover,
  'velvet-skies': VelvetSkiesCover,
  'butterflies': ButterfliesCover,
};

