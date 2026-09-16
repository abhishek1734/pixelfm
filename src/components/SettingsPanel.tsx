"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { checkWidevineDRM, playChime } from "@/lib/audioEngine";

// ============================================================
// SettingsPanel — Pixel-perfect recreation of Config Tab (Image 1)
// ============================================================

interface SettingsPanelProps {
  crtEnabled: boolean;
  onToggleCRT: () => void;
  soundFX: boolean;
  onToggleSoundFX: () => void;
}

interface DiagResult {
  label: string;
  status: "ok" | "error" | "pending" | "idle";
  message: string;
}

function RetroToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={onChange}
      className={`relative w-8 h-4 rounded-full cursor-pointer transition-colors p-0.5 flex-shrink-0 ${
        checked ? "bg-[#22C55E]" : "bg-[#162235]"
      }`}
      style={{
        boxShadow: checked ? "0 0 8px rgba(34, 197, 94, 0.4)" : "none",
        border: "1px solid #1E293B",
      }}
    >
      <div
        className={`w-3 h-3 rounded-full bg-white transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </div>
  );
}

export default function SettingsPanel({
  crtEnabled,
  onToggleCRT,
  soundFX,
  onToggleSoundFX,
}: SettingsPanelProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { isReady, deviceId } = usePlayer();

  // Audio settings
  const [normalizeVolume, setNormalizeVolume] = useState(true);
  const [monoAudio, setMonoAudio] = useState(false);

  // Playback settings
  const [autoplay, setAutoplay] = useState(true);
  const [canvas, setCanvas] = useState(true);
  const [behindLyrics, setBehindLyrics] = useState(true);

  // Notification settings
  const [newReleases, setNewReleases] = useState(true);
  const [playlistUpdates, setPlaylistUpdates] = useState(true);
  const [recommendations, setRecommendations] = useState(false);

  // Privacy settings
  const [listeningActivity, setListeningActivity] = useState(true);
  const [recentlyPlayed, setRecentlyPlayed] = useState(true);

  // Diagnostics drawer
  const [showDoctor, setShowDoctor] = useState(false);
  const [drmResult, setDrmResult] = useState<DiagResult>({
    label: "Widevine DRM",
    status: "idle",
    message: "Click to check",
  });
  const [chimeResult, setChimeResult] = useState<DiagResult>({
    label: "Audio Chime",
    status: "idle",
    message: "Click to test",
  });

  const runChimeTest = () => {
    setChimeResult({ label: "Audio Chime", status: "pending", message: "Playing..." });
    try {
      playChime("success");
      setTimeout(() => {
        setChimeResult({
          label: "Audio Chime",
          status: "ok",
          message: "8-bit arpeggio fired ✓",
        });
      }, 800);
    } catch {
      setChimeResult({
        label: "Audio Chime",
        status: "error",
        message: "Audio blocked by browser",
      });
    }
  };

  const runDrmTest = async () => {
    setDrmResult({ label: "Widevine DRM", status: "pending", message: "Testing..." });
    const result = await checkWidevineDRM();
    setDrmResult({
      label: "Widevine DRM",
      status: result.supported ? "ok" : "error",
      message: result.message,
    });
  };

  const displayName = user?.display_name || "Abhishek";
  const userHandle = user?.id ? `@${user.id}` : "@abhishek";
  const userAvatar = user?.images?.[0]?.url;

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 pb-28 md:pb-8 overflow-y-auto h-full select-none">
      {/* Top Header & Cat Art Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#142236] pb-4">
        {/* Title */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[14px] text-[#22C55E]">//</span>
            <span
              className="font-pixel text-[14px] text-[#F8FAFC] tracking-wider"
              style={{ textShadow: "0 0 10px rgba(34, 197, 94, 0.3)" }}
            >
              SETTINGS
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#64748B] mt-0.5">
            Make PIXELFM yours.
          </span>
        </div>

        {/* Top-Right Cat + Speech Bubble + Quote + Plant */}
        <div className="flex items-end gap-3 self-end sm:self-auto">
          <div className="flex flex-col items-end text-right">
            <span className="font-mono text-[9px] text-[#64748B] italic tracking-tight">
              &ldquo;Same music.
            </span>
            <span className="font-mono text-[9px] text-[#64748B] italic tracking-tight">
              A calmer you.&rdquo;
            </span>
          </div>

          {/* Speech Bubble */}
          <div
            className="flex flex-col p-1.5 rounded-[2px] relative"
            style={{
              backgroundColor: "rgba(11, 20, 34, 0.9)",
              border: "1px solid #1E293B",
            }}
          >
            <div className="font-pixel text-[6px] text-[#94A3B8] leading-tight space-y-0.5 select-none text-left">
              <div>GOOD</div>
              <div>MUSIC</div>
              <div className="text-[#38BDF8]">BETTER DAYS.</div>
            </div>
            {/* Pointer to cat */}
            <div className="absolute -bottom-1 right-2 w-1.5 h-1.5 bg-[#1E293B] rotate-45" />
          </div>

          {/* Cat lying on ledge */}
          <div className="relative pb-0.5" style={{ imageRendering: "pixelated" }}>
            <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="text-black">
              {/* Silhouette of cat resting */}
              <ellipse cx="26" cy="15" rx="16" ry="7" fill="#0A0F17" stroke="#1E293B" strokeWidth="1" />
              <ellipse cx="14" cy="11" rx="8" ry="7" fill="#0A0F17" stroke="#1E293B" strokeWidth="1" />
              {/* Ears */}
              <polygon points="10,6 13,1 16,6" fill="#0A0F17" stroke="#1E293B" strokeWidth="1" />
              <polygon points="15,6 18,1 21,6" fill="#0A0F17" stroke="#1E293B" strokeWidth="1" />
              {/* Eyes */}
              <rect x="11" y="9" width="2" height="2" fill="#22C55E" />
              <rect x="16" y="9" width="2" height="2" fill="#22C55E" />
              {/* Ledge line */}
              <line x1="0" y1="22" x2="48" y2="22" stroke="#1E293B" strokeWidth="2" />
            </svg>
          </div>

          {/* Snake Plant in Pot */}
          <div className="flex flex-col items-center">
            {/* Leaves */}
            <div className="flex items-end gap-0.5 mb-0.5">
              <div className="w-1 h-5 bg-[#15803D] rounded-t-sm" />
              <div className="w-1.5 h-7 bg-[#22C55E] rounded-t-sm" />
              <div className="w-1 h-4 bg-[#16A34A] rounded-t-sm" />
            </div>
            {/* Pot */}
            <div className="w-4 h-3 bg-[#B45309] rounded-b-xs border border-[#78350F]" />
          </div>
        </div>
      </div>

      {/* 2-Column Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ================= LEFT COLUMN ================= */}
        <div className="flex flex-col gap-4">
          {/* 1. ACCOUNT */}
          <div
            className="p-3.5 rounded-[2px] flex flex-col gap-2.5"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #142236",
            }}
          >
            <div className="font-pixel text-[8px] text-[#22C55E] tracking-widest flex items-center gap-1.5">
              <span>👤</span>
              <span>ACCOUNT</span>
            </div>

            {/* Profile Row */}
            <div className="flex items-center justify-between p-2 rounded-[2px] bg-[#0A1220]/60 border border-[#142236] cursor-pointer hover:border-[#22C55E]/40 transition-colors">
              <div className="flex items-center gap-3">
                {/* Pixel Avatar */}
                <div className="w-9 h-9 rounded-[2px] overflow-hidden bg-[#1E293B] border border-[#334155] flex items-center justify-center flex-shrink-0">
                  {userAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={userAvatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "pixelated" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-600 to-red-600 flex items-center justify-center text-xs font-pixel text-white">
                      A
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                    {displayName}
                  </span>
                  <span className="font-mono text-[9px] text-[#64748B]">
                    {userHandle}
                  </span>
                </div>
              </div>

              <span className="text-[#64748B] text-xs font-bold">›</span>
            </div>

            {/* Spotify Connected Status Row */}
            <div className="flex items-center justify-between p-2 rounded-[2px] bg-[#0A1220]/60 border border-[#142236] cursor-pointer hover:border-[#22C55E]/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="text-[#22C55E] text-base leading-none">●</span>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-[#E2E8F0]">
                    Connected to Spotify
                  </span>
                  <span className="font-mono text-[9px] text-[#22C55E]">
                    Premium Student
                  </span>
                </div>
              </div>

              <span className="text-[#64748B] text-xs font-bold">›</span>
            </div>
          </div>

          {/* 2. APP PREFERENCES */}
          <div
            className="p-3.5 rounded-[2px] flex flex-col gap-2.5"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #142236",
            }}
          >
            <div className="font-pixel text-[8px] text-[#22C55E] tracking-widest flex items-center gap-1.5">
              <span>📱</span>
              <span>APP PREFERENCES</span>
            </div>

            {/* Theme */}
            <div
              onClick={() => {
                if (soundFX) playChime("click");
                onToggleCRT();
              }}
              className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] text-xs">🖥</span>
                <span className="font-mono text-xs text-[#CBD5E1]">Theme</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-[#64748B]">
                  {crtEnabled ? "Dark (CRT)" : "Dark (Clean)"}
                </span>
                <span className="text-[#64748B] text-xs">›</span>
              </div>
            </div>

            {/* Accent Color */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] text-xs">🎨</span>
                <span className="font-mono text-xs text-[#CBD5E1]">Accent Color</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-[#22C55E]">Neon Green</span>
                <span className="text-[#64748B] text-xs">›</span>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] text-xs">🌐</span>
                <span className="font-mono text-xs text-[#CBD5E1]">Language</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-[#64748B]">English</span>
                <span className="text-[#64748B] text-xs">›</span>
              </div>
            </div>

            {/* Start Page */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] text-xs">⌂</span>
                <span className="font-mono text-xs text-[#CBD5E1]">Start Page</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-[#64748B]">Home</span>
                <span className="text-[#64748B] text-xs">›</span>
              </div>
            </div>
          </div>

          {/* 3. AUDIO */}
          <div
            className="p-3.5 rounded-[2px] flex flex-col gap-2.5"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #142236",
            }}
          >
            <div className="font-pixel text-[8px] text-[#22C55E] tracking-widest flex items-center gap-1.5">
              <span>🔊</span>
              <span>AUDIO</span>
            </div>

            {/* Streaming Quality */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] text-xs">𝄢</span>
                <span className="font-mono text-xs text-[#CBD5E1]">Streaming Quality</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-[#64748B]">High (320 kbps)</span>
                <span className="text-[#64748B] text-xs">›</span>
              </div>
            </div>

            {/* Crossfade */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] text-xs">🔀</span>
                <span className="font-mono text-xs text-[#CBD5E1]">Crossfade</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs text-[#64748B]">5 seconds</span>
                <span className="text-[#64748B] text-xs">›</span>
              </div>
            </div>

            {/* Normalize Volume */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded-[2px]">
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] text-xs">🎚</span>
                <span className="font-mono text-xs text-[#CBD5E1]">Normalize Volume</span>
              </div>
              <RetroToggle
                checked={normalizeVolume}
                onChange={() => {
                  if (soundFX) playChime("click");
                  setNormalizeVolume((v) => !v);
                }}
              />
            </div>

            {/* Mono Audio */}
            <div className="flex items-center justify-between py-1.5 px-2 rounded-[2px]">
              <div className="flex items-center gap-2">
                <span className="text-[#64748B] text-xs">🔈</span>
                <span className="font-mono text-xs text-[#CBD5E1]">Mono Audio</span>
              </div>
              <RetroToggle
                checked={monoAudio}
                onChange={() => {
                  if (soundFX) playChime("click");
                  setMonoAudio((v) => !v);
                }}
              />
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="flex flex-col gap-4">
          {/* 4. PLAYBACK */}
          <div
            className="p-3.5 rounded-[2px] flex flex-col gap-2.5"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #142236",
            }}
          >
            <div className="font-pixel text-[8px] text-[#22C55E] tracking-widest flex items-center gap-1.5">
              <span>▶</span>
              <span>PLAYBACK</span>
            </div>

            {/* Autoplay */}
            <div className="flex items-center justify-between py-1 px-2 rounded-[2px]">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#CBD5E1]">Autoplay</span>
                <span className="font-mono text-[9px] text-[#64748B]">
                  Keep the music going
                </span>
              </div>
              <RetroToggle
                checked={autoplay}
                onChange={() => {
                  if (soundFX) playChime("click");
                  setAutoplay((v) => !v);
                }}
              />
            </div>

            {/* Canvas */}
            <div className="flex items-center justify-between py-1 px-2 rounded-[2px]">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#CBD5E1]">Canvas</span>
                <span className="font-mono text-[9px] text-[#64748B]">
                  Show short visual clips
                </span>
              </div>
              <RetroToggle
                checked={canvas}
                onChange={() => {
                  if (soundFX) playChime("click");
                  setCanvas((v) => !v);
                }}
              />
            </div>

            {/* Behind the Lyrics */}
            <div className="flex items-center justify-between py-1 px-2 rounded-[2px]">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#CBD5E1]">Behind the Lyrics</span>
                <span className="font-mono text-[9px] text-[#64748B]">
                  Show content while playing
                </span>
              </div>
              <RetroToggle
                checked={behindLyrics}
                onChange={() => {
                  if (soundFX) playChime("click");
                  setBehindLyrics((v) => !v);
                }}
              />
            </div>
          </div>

          {/* 5. NOTIFICATIONS */}
          <div
            className="p-3.5 rounded-[2px] flex flex-col gap-2.5"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #142236",
            }}
          >
            <div className="font-pixel text-[8px] text-[#22C55E] tracking-widest flex items-center gap-1.5">
              <span>🔔</span>
              <span>NOTIFICATIONS</span>
            </div>

            {/* New Releases */}
            <div className="flex items-center justify-between py-1 px-2 rounded-[2px]">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#CBD5E1]">New Releases</span>
                <span className="font-mono text-[9px] text-[#64748B]">
                  Get notified about new music
                </span>
              </div>
              <RetroToggle
                checked={newReleases}
                onChange={() => {
                  if (soundFX) playChime("click");
                  setNewReleases((v) => !v);
                }}
              />
            </div>

            {/* Playlist Updates */}
            <div className="flex items-center justify-between py-1 px-2 rounded-[2px]">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#CBD5E1]">Playlist Updates</span>
                <span className="font-mono text-[9px] text-[#64748B]">
                  When playlists you follow change
                </span>
              </div>
              <RetroToggle
                checked={playlistUpdates}
                onChange={() => {
                  if (soundFX) playChime("click");
                  setPlaylistUpdates((v) => !v);
                }}
              />
            </div>

            {/* Recommendations */}
            <div className="flex items-center justify-between py-1 px-2 rounded-[2px]">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#CBD5E1]">Recommendations</span>
                <span className="font-mono text-[9px] text-[#64748B]">
                  Music picks just for you
                </span>
              </div>
              <RetroToggle
                checked={recommendations}
                onChange={() => {
                  if (soundFX) playChime("click");
                  setRecommendations((v) => !v);
                }}
              />
            </div>
          </div>

          {/* 6. PRIVACY */}
          <div
            className="p-3.5 rounded-[2px] flex flex-col gap-2.5"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #142236",
            }}
          >
            <div className="font-pixel text-[8px] text-[#22C55E] tracking-widest flex items-center gap-1.5">
              <span>🛡</span>
              <span>PRIVACY</span>
            </div>

            {/* Listening Activity */}
            <div className="flex items-center justify-between py-1 px-2 rounded-[2px]">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#CBD5E1]">Listening Activity</span>
                <span className="font-mono text-[9px] text-[#64748B]">
                  Show what I&apos;m listening to
                </span>
              </div>
              <RetroToggle
                checked={listeningActivity}
                onChange={() => {
                  if (soundFX) playChime("click");
                  setListeningActivity((v) => !v);
                }}
              />
            </div>

            {/* Recently Played */}
            <div className="flex items-center justify-between py-1 px-2 rounded-[2px]">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-[#CBD5E1]">Recently Played</span>
                <span className="font-mono text-[9px] text-[#64748B]">
                  Store my listening history
                </span>
              </div>
              <RetroToggle
                checked={recentlyPlayed}
                onChange={() => {
                  if (soundFX) playChime("click");
                  setRecentlyPlayed((v) => !v);
                }}
              />
            </div>
          </div>

          {/* 7. ABOUT & DOCTOR */}
          <div
            className="p-3.5 rounded-[2px] flex flex-col gap-2.5"
            style={{
              backgroundColor: "#070D17",
              border: "1px solid #142236",
            }}
          >
            <div className="font-pixel text-[8px] text-[#22C55E] tracking-widest flex items-center gap-1.5">
              <span>ℹ</span>
              <span>ABOUT</span>
            </div>

            <div
              onClick={() => {
                if (soundFX) playChime("click");
                setShowDoctor(!showDoctor);
              }}
              className="flex items-center justify-between py-1.5 px-2 rounded-[2px] hover:bg-[#0A1220] cursor-pointer transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold text-[#E2E8F0]">PIXELFM</span>
                <span className="font-mono text-[9px] text-[#64748B]">v1.0.0</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#64748B]">
                  A little closer to the music. ♡
                </span>
                <span className="text-[#64748B] text-xs">›</span>
              </div>
            </div>

            {/* Diagnostics Doctor Accordion */}
            {showDoctor && (
              <div className="flex flex-col gap-2 p-2.5 mt-2 bg-[#050911] border border-[#162235] rounded-[2px]">
                <span className="font-pixel text-[8px] text-[#F59E0B]">
                  ⚕ SYSTEM DIAGNOSTICS
                </span>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">Widevine DRM:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#64748B]">{drmResult.message}</span>
                    <button
                      onClick={runDrmTest}
                      className="font-pixel text-[7px] px-2 py-0.5 border border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/10"
                    >
                      CHECK
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">Sound Chime:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#64748B]">{chimeResult.message}</span>
                    <button
                      onClick={runChimeTest}
                      className="font-pixel text-[7px] px-2 py-0.5 border border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E]/10"
                    >
                      TEST
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#94A3B8]">Web Playback SDK:</span>
                  <span className="text-[10px] text-[#22C55E]">
                    {isReady ? `Active (${deviceId?.slice(0, 8)}…)` : "Offline"}
                  </span>
                </div>

                {isAuthenticated && (
                  <button
                    onClick={logout}
                    className="font-pixel text-[8px] text-red-400 border border-red-900 bg-red-950/20 py-1 px-2 mt-2 hover:bg-red-900/30 transition-colors text-center"
                  >
                    DISCONNECT SPOTIFY ACCOUNT
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
