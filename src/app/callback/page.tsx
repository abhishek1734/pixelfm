"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// ============================================================
// OAuth Callback Handler
// ============================================================

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleCallback, isAuthenticated } = useAuth();
  const handledRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/player");
      return;
    }
    if (handledRef.current) return;
    handledRef.current = true;

    const code = searchParams.get("code");
    const state = searchParams.get("state") ?? "";
    const error = searchParams.get("error");

    if (error) {
      console.error("[Callback] Spotify returned error param:", error);
      router.replace("/?error=" + encodeURIComponent(error));
      return;
    }

    if (!code) {
      router.replace("/?error=missing_auth_code");
      return;
    }

    handleCallback(code, state)
      .then(() => {
        router.replace("/player");
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[Callback] Token exchange error:", message);
        router.replace("/?error=" + encodeURIComponent(message));
      });
  }, [searchParams, handleCallback, router, isAuthenticated]);

  return (
    <div
      className="flex flex-col items-center justify-center h-screen gap-6"
      style={{ backgroundColor: "var(--color-void)" }}
    >
      {/* Spinner */}
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid var(--color-elevated)",
          borderTop: "3px solid var(--color-phosphor)",
          borderRadius: "50%",
          animation: "spin-vinyl 0.8s linear infinite",
        }}
      />

      <div className="flex flex-col items-center gap-2">
        <div
          className="font-pixel"
          style={{ fontSize: 9, color: "var(--color-phosphor)" }}
        >
          AUTHENTICATING...
        </div>
        <div
          className="font-mono-retro"
          style={{ fontSize: 11, color: "var(--color-text-secondary)" }}
        >
          Exchanging tokens with Spotify
        </div>
      </div>

      <div
        className="font-pixel animate-phosphor-flicker"
        style={{
          fontSize: 20,
          color: "var(--color-phosphor)",
          textShadow: "0 0 12px rgba(34,197,94,0.6)",
        }}
      >
        PIXELFM
      </div>
    </div>
  );
}

export default function CallbackPage() {
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
      <CallbackInner />
    </Suspense>
  );
}
