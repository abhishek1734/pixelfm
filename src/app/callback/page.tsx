"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, getRedirectUri } from "@/contexts/AuthContext";

// ============================================================
// OAuth Callback Handler with Diagnostic Error Display
// ============================================================

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleCallback, isAuthenticated } = useAuth();
  const handledRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    code: boolean;
    state: boolean;
    hasVerifier: boolean;
    redirectUri: string;
  } | null>(null);

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

    const currentRedirect = typeof window !== "undefined"
      ? (localStorage.getItem("pkce_redirect_uri") || getRedirectUri())
      : "";
    const verifier = typeof window !== "undefined"
      ? localStorage.getItem("pkce_code_verifier")
      : null;

    setDebugInfo({
      code: !!code,
      state: !!state,
      hasVerifier: !!verifier,
      redirectUri: currentRedirect,
    });

    if (error) {
      console.error("[Callback] Spotify returned error:", error);
      setErrorMessage(`Spotify OAuth error: ${error}`);
      return;
    }

    if (!code) {
      console.error("[Callback] No code found in callback query params");
      setErrorMessage("No authorization code was returned by Spotify.");
      return;
    }

    handleCallback(code, state)
      .then(() => {
        router.replace("/player");
      })
      .catch((err) => {
        console.error("[Callback] Token exchange failed:", err);
        setErrorMessage(err.message || "Failed to exchange authorization code for access token.");
      });
  }, [searchParams, handleCallback, router, isAuthenticated]);

  if (errorMessage) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 bg-retro-grid"
        style={{ backgroundColor: "var(--color-void)" }}
      >
        <div
          className="card-pixel p-6 flex flex-col items-center gap-4 max-w-lg w-full text-center"
          style={{
            border: "2px solid #EF4444",
            boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)",
          }}
        >
          <div
            className="font-pixel text-xs"
            style={{ color: "#EF4444", textShadow: "0 0 8px rgba(239, 68, 68, 0.6)" }}
          >
            ✖ AUTHENTICATION ERROR
          </div>

          <div
            className="font-mono-retro text-xs p-3 w-full text-left"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              border: "1px solid var(--color-border)",
              color: "#FCA5A5",
              wordBreak: "break-word",
            }}
          >
            {errorMessage}
          </div>

          {debugInfo && (
            <div
              className="font-mono-retro text-[10px] w-full text-left p-2"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-dim)",
              }}
            >
              <div>• Has Auth Code: {debugInfo.code ? "Yes ✓" : "No ✗"}</div>
              <div>• PKCE Verifier in Storage: {debugInfo.hasVerifier ? "Yes ✓" : "Missing ✗"}</div>
              <div>• Redirect URI: {debugInfo.redirectUri}</div>
            </div>
          )}

          <div className="font-pixel text-[8px] text-[var(--color-text-dim)] leading-relaxed">
            Ensure that <span style={{ color: "var(--color-phosphor)" }}>{debugInfo?.redirectUri}</span> is added to your Spotify Developer Dashboard under &quot;Redirect URIs&quot;.
          </div>

          <button
            onClick={() => router.push("/")}
            className="btn-pixel btn-pixel-phosphor mt-2"
            style={{ padding: "8px 16px", fontSize: 8 }}
          >
            [ ↺ RETURN TO BOOT SCREEN ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-screen gap-6"
      style={{ backgroundColor: "var(--color-void)" }}
    >
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
          style={{ backgroundColor: "var(--color-void)", color: "var(--color-phosphor)" }}
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
