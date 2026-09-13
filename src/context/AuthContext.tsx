"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppMode, AuthState, SpotifyUser } from "@/types/music";
import {
  exchangeCodeForToken,
  getSpotifyAuthUrl,
  getStoredVerifier,
  refreshAccessToken,
  SPOTIFY_SCOPES,
} from "@/lib/spotify/pkce";
import SpotifyAPI from "@/lib/spotify/api";

// ============================================================
// Constants
// ============================================================

const AUTH_STORAGE_KEY = "pixelify-auth";

const MOCK_USER: SpotifyUser = {
  id: "pixelify-mock-user",
  displayName: "PIXEL PLAYER",
  email: "demo@pixelify.app",
  imageUrl: undefined,
  product: "premium",
  country: "US",
  followers: 0,
};

// ============================================================
// Persisted Auth Shape
// ============================================================

interface PersistedAuth {
  mode: AppMode;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  spotifyUser: SpotifyUser;
  clientId: string;
}

// ============================================================
// Context Shape
// ============================================================

interface AuthContextValue extends AuthState {
  loginWithSpotify: (clientId: string) => Promise<void>;
  handleCallback: (code: string) => Promise<void>;
  logout: () => void;
  enterMockMode: () => void;
  refreshIfNeeded: () => Promise<string | null>;
  setClientId: (id: string) => void;
}

// ============================================================
// Context
// ============================================================

const defaultAuthState: AuthState = {
  mode: "landing",
  accessToken: null,
  expiresAt: null,
  spotifyUser: null,
  clientId: null,
  isLoading: false,
  error: null,
};

export const AuthContext = createContext<AuthContextValue>({
  ...defaultAuthState,
  loginWithSpotify: async () => {},
  handleCallback: async () => {},
  logout: () => {},
  enterMockMode: () => {},
  refreshIfNeeded: async () => null,
  setClientId: () => {},
});

// ============================================================
// Hook
// ============================================================

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

// ============================================================
// Helpers
// ============================================================

function loadPersistedAuth(): PersistedAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedAuth;
  } catch {
    return null;
  }
}

function persistAuth(data: PersistedAuth): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function clearPersistedAuth(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function isTokenExpired(expiresAt: number, bufferMs = 60_000): boolean {
  return Date.now() >= expiresAt - bufferMs;
}

// ============================================================
// Provider
// ============================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultAuthState);
  // Store refresh token separately (not part of AuthState)
  const refreshTokenRef = useRef<string | null>(null);

  // ── Boot: restore from localStorage ──────────────────────────
  useEffect(() => {
    const saved = loadPersistedAuth();
    if (!saved) return;

    if (saved.mode === "spotify" && !isTokenExpired(saved.expiresAt)) {
      refreshTokenRef.current = saved.refreshToken ?? null;
      setState({
        mode: "spotify",
        accessToken: saved.accessToken,
        expiresAt: saved.expiresAt,
        spotifyUser: saved.spotifyUser,
        clientId: saved.clientId,
        isLoading: false,
        error: null,
      });
    } else if (saved.mode === "spotify" && saved.refreshToken && saved.clientId) {
      // Token expired but refresh token available — silently refresh
      setState((prev) => ({ ...prev, isLoading: true }));
      refreshAccessToken(saved.clientId, saved.refreshToken)
        .then((tokens) => {
          const expiresAt = Date.now() + tokens.expires_in * 1000;
          refreshTokenRef.current = tokens.refresh_token ?? saved.refreshToken;
          const nextAuth: PersistedAuth = {
            mode: "spotify",
            accessToken: tokens.access_token,
            refreshToken: refreshTokenRef.current!,
            expiresAt,
            spotifyUser: saved.spotifyUser,
            clientId: saved.clientId,
          };
          persistAuth(nextAuth);
          setState({
            mode: "spotify",
            accessToken: tokens.access_token,
            expiresAt,
            spotifyUser: saved.spotifyUser,
            clientId: saved.clientId,
            isLoading: false,
            error: null,
          });
        })
        .catch(() => {
          clearPersistedAuth();
          setState({ ...defaultAuthState });
        });
    }
    // Otherwise stay on landing
  }, []);

  // ── loginWithSpotify ─────────────────────────────────────────
  const loginWithSpotify = useCallback(async (clientId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const redirectUri =
        typeof window !== "undefined"
          ? window.location.origin + "/callback"
          : "";
      const { url } = await getSpotifyAuthUrl(clientId, redirectUri, SPOTIFY_SCOPES);
      // Save clientId for the callback
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pixelify-client-id", clientId);
      }
      window.location.href = url;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to start login",
      }));
    }
  }, []);

  // ── handleCallback ───────────────────────────────────────────
  const handleCallback = useCallback(async (code: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const redirectUri =
        typeof window !== "undefined"
          ? window.location.origin + "/callback"
          : "";
      const clientId =
        (typeof window !== "undefined"
          ? sessionStorage.getItem("pixelify-client-id")
          : null) ?? "";
      const verifier = getStoredVerifier() ?? "";

      const tokens = await exchangeCodeForToken(code, verifier, clientId, redirectUri);
      const expiresAt = Date.now() + tokens.expires_in * 1000;
      refreshTokenRef.current = tokens.refresh_token ?? null;

      // Fetch user profile
      const api = new SpotifyAPI(tokens.access_token);
      const user = await api.getMe();

      const persisted: PersistedAuth = {
        mode: "spotify",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? "",
        expiresAt,
        spotifyUser: user,
        clientId,
      };
      persistAuth(persisted);

      setState({
        mode: "spotify",
        accessToken: tokens.access_token,
        expiresAt,
        spotifyUser: user,
        clientId,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Auth callback failed",
      }));
    }
  }, []);

  // ── logout ───────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearPersistedAuth();
    refreshTokenRef.current = null;
    setState({ ...defaultAuthState });
  }, []);

  // ── enterMockMode ────────────────────────────────────────────
  const enterMockMode = useCallback(() => {
    setState({
      mode: "mock",
      accessToken: null,
      expiresAt: null,
      spotifyUser: MOCK_USER,
      clientId: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // ── refreshIfNeeded ──────────────────────────────────────────
  const refreshIfNeeded = useCallback(async (): Promise<string | null> => {
    if (state.mode !== "spotify") return null;
    if (!state.accessToken) return null;

    // Token is still valid
    if (state.expiresAt && !isTokenExpired(state.expiresAt)) {
      return state.accessToken;
    }

    // Need to refresh
    const rt = refreshTokenRef.current;
    const cid = state.clientId;
    if (!rt || !cid) return null;

    try {
      const tokens = await refreshAccessToken(cid, rt);
      const expiresAt = Date.now() + tokens.expires_in * 1000;
      refreshTokenRef.current = tokens.refresh_token ?? rt;

      // Update persisted auth
      const saved = loadPersistedAuth();
      if (saved) {
        persistAuth({
          ...saved,
          accessToken: tokens.access_token,
          refreshToken: refreshTokenRef.current!,
          expiresAt,
        });
      }

      setState((prev) => ({
        ...prev,
        accessToken: tokens.access_token,
        expiresAt,
      }));

      return tokens.access_token;
    } catch {
      logout();
      return null;
    }
  }, [state.mode, state.accessToken, state.expiresAt, state.clientId, logout]);

  // ── setClientId ──────────────────────────────────────────────
  const setClientId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, clientId: id }));
  }, []);

  // ── Context value ────────────────────────────────────────────
  const value: AuthContextValue = {
    ...state,
    loginWithSpotify,
    handleCallback,
    logout,
    enterMockMode,
    refreshIfNeeded,
    setClientId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
