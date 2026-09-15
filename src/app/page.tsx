"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, getEffectiveRedirectUri } from "@/contexts/AuthContext";
import {
  playBootSequence,
  initDemoStream,
  playDemoStream,
  playChime,
} from "@/lib/audioEngine";

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

function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setDemoMode, isAuthenticated } = useAuth();
  const [bootPhase, setBootPhase] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const errorParam = searchParams.get("error");
  const [activeError, setActiveError] = useState<string | null>(null);

  useEffect(() => {
    if (errorParam) {
      setActiveError(decodeURIComponent(errorParam));
    }
  }, [errorParam]);

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

  const expectedRedirect = getEffectiveRedirectUri();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-retro-grid py-8"
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
        className="relative flex flex-col gap-6"
        style={{ zIndex: 1, width: "min(600px, 92vw)" }}
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
            className="font-pixel text-center"
            style={{
              fontSize: 8,
              color: "var(--color-text-dim)",
              letterSpacing: "0.2em",
            }}
          >
            8-BIT HI-FI CYBER-RETRO STATION
          </div>
        </div>

        {/* Error Banner if authentication returned error */}
        {activeError && (
          <div
            className="p-4 flex flex-col gap-2 animate-bounce-subtle"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "2px solid #EF4444",
              boxShadow: "4px 4px 0 #000, 0 0 16px rgba(239, 68, 68, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-pixel"
                style={{ fontSize: 9, color: "#EF4444" }}
              >
                ⚠ AUTH ERROR DETECTED
              </span>
              <button
                onClick={() => {
                  playChime("click");
                  setActiveError(null);
                  router.replace("/");
                }}
                className="font-pixel"
                style={{
                  fontSize: 8,
                  color: "#EF4444",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                }}
              >
                [DISMISS]
              </button>
            </div>
            <div
              className="font-mono-retro text-xs text-red-300 leading-relaxed"
              style={{ wordBreak: "break-word" }}
            >
              Reason: <strong>{activeError}</strong>
            </div>
            <div
              className="font-mono-retro text-[11px] text-gray-300 mt-1 pt-2 border-t border-red-900/50"
              style={{ lineHeight: 1.5 }}
            >
              Verify your Spotify Developer Dashboard contains this exact Redirect URI:
              <br />
              <code className="text-yellow-400 bg-black/60 px-1 py-0.5 mt-1 inline-block select-all">
                {expectedRedirect}
              </code>
            </div>
          </div>
        )}

        {/* Boot terminal */}
        <div
          className="p-4 font-mono-retro"
          style={{
            backgroundColor: "var(--color-void)",
            border: "2px solid var(--color-elevated)",
            boxShadow: "4px 4px 0 #000, 0 0 20px rgba(34,197,94,0.1)",
            minHeight: 180,
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

export default function LandingPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center h-screen"
          style={{
            backgroundColor: "var(--color-void)",
            color: "var(--color-phosphor)",
          }}
        >
          <span className="font-pixel" style={{ fontSize: 9 }}>
            LOADING...
          </span>
        </div>
      }
    >
      <LandingContent />
    </Suspense>
  );
}
