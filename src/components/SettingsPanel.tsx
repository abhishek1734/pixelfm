"use client";

import React, { useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { checkWidevineDRM, playChime } from "@/lib/audioEngine";

// ============================================================
// SettingsPanel — Audio & Spotify Doctor + Preferences
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

export default function SettingsPanel({
  crtEnabled,
  onToggleCRT,
  soundFX,
  onToggleSoundFX,
}: SettingsPanelProps) {
  const { isReady, deviceId, externalDevice } = usePlayer();
  const [drmResult, setDrmResult] = useState<DiagResult>({
    label: "Widevine DRM",
    status: "idle",
    message: "Click to test",
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

  const StatusIcon = ({ status }: { status: DiagResult["status"] }) => {
    if (status === "ok") return <span style={{ color: "var(--color-phosphor)" }}>✓</span>;
    if (status === "error") return <span style={{ color: "#EF4444" }}>✗</span>;
    if (status === "pending") return <span style={{ color: "var(--color-amber)", animation: "blink 0.5s step-end infinite" }}>…</span>;
    return <span style={{ color: "var(--color-text-dim)" }}>○</span>;
  };

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto h-full">
      {/* Section: Audio Doctor */}
      <div>
        <div className="font-pixel text-[9px] text-[var(--color-amber)] mb-3 pb-1" style={{ borderBottom: "1px solid var(--color-border)" }}>
          ⚕ AUDIO &amp; SPOTIFY DOCTOR
        </div>

        <div className="flex flex-col gap-3">
          {/* Chime Test */}
          <div className="flex items-center justify-between gap-4 p-2" style={{ backgroundColor: "var(--color-void)", border: "1px solid var(--color-border)" }}>
            <div className="flex flex-col gap-0.5">
              <span className="font-pixel text-[8px] text-[var(--color-text-primary)]">
                {chimeResult.label}
              </span>
              <span className="font-mono-retro text-[10px] text-[var(--color-text-secondary)]">
                {chimeResult.message}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon status={chimeResult.status} />
              <button
                className="btn-pixel"
                onClick={runChimeTest}
                style={{ padding: "4px 8px", fontSize: 7 }}
              >
                TEST
              </button>
            </div>
          </div>

          {/* DRM Test */}
          <div className="flex items-center justify-between gap-4 p-2" style={{ backgroundColor: "var(--color-void)", border: "1px solid var(--color-border)" }}>
            <div className="flex flex-col gap-0.5">
              <span className="font-pixel text-[8px] text-[var(--color-text-primary)]">
                {drmResult.label}
              </span>
              <span className="font-mono-retro text-[10px] text-[var(--color-text-secondary)]">
                {drmResult.message}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon status={drmResult.status} />
              <button
                className="btn-pixel"
                onClick={runDrmTest}
                style={{ padding: "4px 8px", fontSize: 7 }}
              >
                CHECK
              </button>
            </div>
          </div>

          {/* SDK Status */}
          <div
            className="flex items-center justify-between gap-4 p-2"
            style={{ backgroundColor: "var(--color-void)", border: "1px solid var(--color-border)" }}
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-pixel text-[8px] text-[var(--color-text-primary)]">
                Web Playback SDK
              </span>
              <span className="font-mono-retro text-[10px] text-[var(--color-text-secondary)]">
                {isReady ? `Active — Device ${deviceId?.slice(0, 12)}…` : "Not initialized"}
              </span>
            </div>
            <StatusIcon status={isReady ? "ok" : "error"} />
          </div>

          {/* Connect Monitor */}
          <div
            className="p-2 flex flex-col gap-1"
            style={{ backgroundColor: "var(--color-void)", border: "1px solid var(--color-border)" }}
          >
            <span className="font-pixel text-[8px] text-[var(--color-text-primary)]">
              Live Connect Monitor
            </span>
            {externalDevice ? (
              <div className="flex flex-col gap-0.5">
                <span className="font-mono-retro text-[10px] text-[var(--color-amber)]">
                  ● {externalDevice.device.name} ({externalDevice.device.type})
                </span>
                <span className="font-mono-retro text-[10px] text-[var(--color-text-secondary)]">
                  Vol: {externalDevice.device.volume_percent}% | {externalDevice.is_playing ? "PLAYING" : "PAUSED"}
                </span>
                {externalDevice.item && (
                  <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)] truncate">
                    {externalDevice.item.name} — {externalDevice.item.artists?.[0]?.name}
                  </span>
                )}
              </div>
            ) : (
              <span className="font-mono-retro text-[10px] text-[var(--color-text-dim)]">
                No external device detected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section: Display */}
      <div>
        <div className="font-pixel text-[9px] text-[var(--color-phosphor)] mb-3 pb-1" style={{ borderBottom: "1px solid var(--color-border)" }}>
          ◉ DISPLAY
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-2" style={{ backgroundColor: "var(--color-void)", border: "1px solid var(--color-border)" }}>
            <div className="flex flex-col gap-0.5">
              <span className="font-pixel text-[8px] text-[var(--color-text-primary)]">CRT Scanlines</span>
              <span className="font-mono-retro text-[10px] text-[var(--color-text-secondary)]">
                {crtEnabled ? "Enabled — CRT phosphor effect active" : "Disabled"}
              </span>
            </div>
            <button
              className="btn-pixel"
              onClick={onToggleCRT}
              style={{
                padding: "4px 10px",
                fontSize: 7,
                borderColor: crtEnabled ? "var(--color-phosphor)" : "var(--color-border)",
                color: crtEnabled ? "var(--color-phosphor)" : "var(--color-text-dim)",
              }}
            >
              {crtEnabled ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* Section: Audio */}
      <div>
        <div className="font-pixel text-[9px] text-[var(--color-phosphor)] mb-3 pb-1" style={{ borderBottom: "1px solid var(--color-border)" }}>
          ♪ AUDIO
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-2" style={{ backgroundColor: "var(--color-void)", border: "1px solid var(--color-border)" }}>
            <div className="flex flex-col gap-0.5">
              <span className="font-pixel text-[8px] text-[var(--color-text-primary)]">8-bit Sound FX</span>
              <span className="font-mono-retro text-[10px] text-[var(--color-text-secondary)]">
                {soundFX ? "UI chimes enabled" : "Silent mode"}
              </span>
            </div>
            <button
              className="btn-pixel"
              onClick={onToggleSoundFX}
              style={{
                padding: "4px 10px",
                fontSize: 7,
                borderColor: soundFX ? "var(--color-phosphor)" : "var(--color-border)",
                color: soundFX ? "var(--color-phosphor)" : "var(--color-text-dim)",
              }}
            >
              {soundFX ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
        <div className="font-pixel text-[6px] text-[var(--color-text-dim)] text-center leading-relaxed">
          PIXELFM v1.0 — 8-BIT HI-FI<br />
          POWERED BY SPOTIFY WEB API + SDK<br />
          FOR PERSONAL USE ONLY
        </div>
      </div>
    </div>
  );
}
