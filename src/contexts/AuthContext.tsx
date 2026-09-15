"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
} from "@/lib/pkce";
import { getCurrentUserProfile, SpotifyUserProfile } from "@/lib/spotify";

// ============================================================
// Spotify PKCE OAuth Authentication Context
// Implements: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
// ============================================================

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;

const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp ms
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SpotifyUserProfile | null;
  accessToken: string | null;
  login: () => Promise<void>;
  logout: () => void;
  handleCallback: (code: string, state: string) => Promise<void>;
  isDemoMode: boolean;
  setDemoMode: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadTokens(): AuthTokens | null {
  try {
    const raw = localStorage.getItem("pixelfm_tokens");
    if (!raw) return null;
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
}

function saveTokens(tokens: AuthTokens): void {
  localStorage.setItem("pixelfm_tokens", JSON.stringify(tokens));
}

function clearTokens(): void {
  localStorage.removeItem("pixelfm_tokens");
  localStorage.removeItem("pkce_code_verifier");
  localStorage.removeItem("pkce_state");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [user, setUser] = useState<SpotifyUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setDemoMode] = useState(false);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackCalledRef = useRef(false);

  // Restore tokens on mount
  useEffect(() => {
    const stored = loadTokens();
    if (stored && stored.expiresAt > Date.now() + 30_000) {
      setTokens(stored);
    } else {
      clearTokens();
    }
    setIsLoading(false);
  }, []);

  // Fetch user profile when token is available
  useEffect(() => {
    if (!tokens?.accessToken) {
      setUser(null);
      return;
    }
    getCurrentUserProfile(tokens.accessToken)
      .then(setUser)
      .catch(() => setUser(null));
  }, [tokens?.accessToken]);

  // Auto-refresh token 60s before expiry
  const scheduleRefresh = useCallback((currentTokens: AuthTokens) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const msUntilRefresh = currentTokens.expiresAt - Date.now() - 60_000;
    if (msUntilRefresh <= 0) {
      refreshAccessToken(currentTokens.refreshToken);
      return;
    }
    refreshTimerRef.current = setTimeout(() => {
      refreshAccessToken(currentTokens.refreshToken);
    }, msUntilRefresh);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tokens) scheduleRefresh(tokens);
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [tokens, scheduleRefresh]);

  async function refreshAccessToken(refreshToken: string): Promise<void> {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      });
      if (!response.ok) throw new Error("Refresh failed");
      const data = await response.json();
      const newTokens: AuthTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token ?? refreshToken,
        expiresAt: Date.now() + data.expires_in * 1000,
      };
      setTokens(newTokens);
      saveTokens(newTokens);
    } catch {
      clearTokens();
      setTokens(null);
    }
  }

  const login = useCallback(async () => {
    const verifier = generateCodeVerifier(64);
    const challenge = await generateCodeChallenge(verifier);
    const state = generateState(16);

    localStorage.setItem("pkce_code_verifier", verifier);
    localStorage.setItem("pkce_state", state);

    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.search = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: SCOPES,
      code_challenge_method: "S256",
      code_challenge: challenge,
      redirect_uri: REDIRECT_URI,
      state,
    }).toString();

    window.location.href = authUrl.toString();
  }, []);

  const handleCallback = useCallback(
    async (code: string, state: string) => {
      // Guard against React StrictMode double-invocation
      if (callbackCalledRef.current) return;
      callbackCalledRef.current = true;

      const storedState = localStorage.getItem("pkce_state");
      if (storedState && storedState !== state) {
        throw new Error("State mismatch — possible CSRF attack");
      }

      const verifier = localStorage.getItem("pkce_code_verifier");
      if (!verifier) throw new Error("Code verifier missing from storage");

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: verifier,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error_description ?? "Token exchange failed");
      }

      const data = await response.json();
      const newTokens: AuthTokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
      };

      setTokens(newTokens);
      saveTokens(newTokens);
      localStorage.removeItem("pkce_code_verifier");
      localStorage.removeItem("pkce_state");
    },
    []
  );

  const logout = useCallback(() => {
    clearTokens();
    setTokens(null);
    setUser(null);
    setDemoMode(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!tokens,
        isLoading,
        user,
        accessToken: tokens?.accessToken ?? null,
        login,
        logout,
        handleCallback,
        isDemoMode,
        setDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
