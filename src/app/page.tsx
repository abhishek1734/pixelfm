"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { playBootSequence, initDemoStream, playDemoStream } from "@/lib/audioEngine";

// ============================================================
// Landing Page — Arcade boot-up screen
// ============================================================

const BOOT_LINES = [
  { text: "PIXELFM BIOS v1.0.0 ...........", delay: 0 },
  { text: "CHECKING RAM ................. OK", delay: 200 },
  { text: "LOADING AUDIO ENGINE ......... OK", delay: 400 },
  { text: "INITIALIZING CRT ............. OK", delay: 600 },
  { text: "SPOTIFYCONNECT MODULE ........ OK", delay: 800 },
  { text: "PIXEL CAT MODULE ............. OK", delay: 1000 },
  { text: "SYSTEM READY ................ ●●●", delay: 1200 },
];

export default function LandingPage() {
  const router = useRouter();
  const { login, setDemoMode, isAuthenticated } = useAuth();
  const [bootPhase, setBootPhase] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/player");
    }
  }, [isAuthenticated, router]);

  // Boot sequence animation
  useEffect(() => {
    if (bootPhase < BOOT_LINES.length) {
      const t = setTimeout(
        () => setBootPhase((p) => p + 1),
        bootPhase === 0 ? 300 : 200
      );
      return () => clearTimeout(t);
    } else {
      setTimeout(() => setBootDone(true), 300);
    }
  }, [bootPhase]);

  // Blinking cursor
  useEffect(() => {
    const id = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  const handleDemo = async () => {
    playBootSequence();
    setDemoMode(true);
    const demoUrl = process.env.NEXT_PUBLIC_DEMO_STREAM_URL ?? "";
    if (demoUrl) {
      initDemoStream(demoUrl);
      try {
        await playDemoStream();
      } catch {
        // Autoplay blocked — OK
      }
    }
    router.push("/player");
  };

  const handleConnect = async () => {
    playBootSequence();
    await login();
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-retro-grid"
      style={{ backgroundColor: "var(--color-void)" }}
    >
      {/* CRT vignette */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="relative flex flex-col gap-8"
        style={{ zIndex: 1, width: "min(600px, 90vw)" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="font-pixel animate-phosphor-flicker"
            style={{
              fontSize: 28,
              color: "var(--color-phosphor)",
              textShadow:
                "0 0 20px rgba(34,197,94,0.8), 0 0 40px rgba(34,197,94,0.4)",
              letterSpacing: "0.1em",
            }}
          >
            PIXELFM
          </div>
          <div
            className="font-pixel"
            style={{
              fontSize: 8,
              color: "var(--color-text-dim)",
              letterSpacing: "0.2em",
            }}
          >
            8-BIT HI-FI CYBER-RETRO STATION
          </div>
        </div>

        {/* Boot terminal */}
        <div
          className="p-4 font-mono-retro"
          style={{
            backgroundColor: "var(--color-void)",
            border: "2px solid var(--color-elevated)",
            boxShadow: "4px 4px 0 #000, 0 0 20px rgba(34,197,94,0.1)",
            minHeight: 200,
          }}
        >
          {BOOT_LINES.slice(0, bootPhase).map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: 11,
                color:
                  i === BOOT_LINES.length - 1
                    ? "var(--color-phosphor)"
                    : "var(--color-text-secondary)",
                marginBottom: 4,
                animation: "boot-text 0.1s ease-in",
              }}
            >
              {line.text}
            </div>
          ))}
          {bootPhase <= BOOT_LINES.length && (
            <span
              style={{
                fontSize: 11,
                color: "var(--color-phosphor)",
                opacity: showCursor ? 1 : 0,
              }}
            >
              █
            </span>
          )}
        </div>

        {/* CTAs */}
        {bootDone && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[boot-text_0.3s_ease-in]">
            <button
              className="btn-pixel"
              onClick={handleDemo}
              style={{
                padding: "12px 24px",
                fontSize: 9,
                flex: 1,
                justifyContent: "center",
              }}
            >
              [ TRY DEMO ]
            </button>
            <button
              className="btn-pixel btn-pixel-phosphor"
              onClick={handleConnect}
              style={{
                padding: "12px 24px",
                fontSize: 9,
                flex: 1,
                justifyContent: "center",
              }}
            >
              [ ▶ CONNECT SPOTIFY ]
            </button>
          </div>
        )}

        {/* Footer note */}
        {bootDone && (
          <div
            className="font-pixel text-center"
            style={{ fontSize: 6, color: "var(--color-text-dim)" }}
          >
            SPOTIFY PREMIUM REQUIRED FOR STREAMING · DEMO WORKS WITHOUT LOGIN
          </div>
        )}
      </div>
    </div>
  );
}
