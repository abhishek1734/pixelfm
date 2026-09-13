// PIXELIFY — Spotify OAuth 2.0 PKCE Implementation

// ============================================================
// Constants
// ============================================================

/** All Spotify scopes needed for full PIXELIFY functionality. */
export const SPOTIFY_SCOPES: string[] = [
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
  "playlist-modify-public",
  "playlist-modify-private",
  "user-top-read",
  "user-follow-read",
];

const SPOTIFY_AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const CODE_VERIFIER_STORAGE_KEY = "pixelify_pkce_verifier";

// ============================================================
// PKCE Helpers
// ============================================================

/**
 * Encodes a Uint8Array as a URL-safe base64 string (no padding).
 * Required by the PKCE spec for both verifier and challenge.
 */
function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Generates a cryptographically random PKCE code verifier.
 * Length: 96 random bytes → ~128 char base64url string (well within 43–128 char spec).
 */
export function generateCodeVerifier(): string {
  const buffer = new Uint8Array(96);
  crypto.getRandomValues(buffer);
  return base64UrlEncode(buffer.buffer);
}

/**
 * Derives the PKCE code challenge from a verifier using SHA-256.
 * Returns base64url-encoded SHA-256 hash of the verifier string.
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(digest);
}

// ============================================================
// Auth URL Generation
// ============================================================

/**
 * Builds the full Spotify authorization URL with PKCE parameters.
 * Persists the code verifier in sessionStorage for later token exchange.
 *
 * @returns The URL to redirect the user to, and the verifier (for manual use).
 */
export async function getSpotifyAuthUrl(
  clientId: string,
  redirectUri: string,
  scopes: string[]
): Promise<{ url: string; verifier: string }> {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  // Persist so the callback page can retrieve it without passing via URL state
  sessionStorage.setItem(CODE_VERIFIER_STORAGE_KEY, verifier);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: scopes.join(" "),
  });

  return {
    url: `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`,
    verifier,
  };
}

/** Retrieves the stored PKCE verifier from sessionStorage. Returns null if not found. */
export function getStoredVerifier(): string | null {
  return sessionStorage.getItem(CODE_VERIFIER_STORAGE_KEY);
}

/** Clears the stored PKCE verifier from sessionStorage after use. */
export function clearStoredVerifier(): void {
  sessionStorage.removeItem(CODE_VERIFIER_STORAGE_KEY);
}

// ============================================================
// Token Types
// ============================================================

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

// ============================================================
// Token Exchange
// ============================================================

/**
 * Exchanges an authorization code for access/refresh tokens.
 * Must be called from the OAuth redirect callback page with the `code`
 * query param and the verifier generated during auth URL creation.
 */
export async function exchangeCodeForToken(
  code: string,
  verifier: string,
  clientId: string,
  redirectUri: string
): Promise<SpotifyTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: verifier,
  });

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Token exchange failed [${response.status}]: ${errorBody}`
    );
  }

  return response.json() as Promise<SpotifyTokenResponse>;
}

// ============================================================
// Token Refresh
// ============================================================

/**
 * Uses a refresh token to obtain a new access token.
 * Spotify PKCE flows issue a rotating refresh token — always store the new one.
 */
export async function refreshAccessToken(
  refreshToken: string,
  clientId: string
): Promise<{ access_token: string; expires_in: number; refresh_token?: string }> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const response = await fetch(SPOTIFY_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Token refresh failed [${response.status}]: ${errorBody}`
    );
  }

  const data = (await response.json()) as SpotifyTokenResponse;
  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
    ...(data.refresh_token ? { refresh_token: data.refresh_token } : {}),
  };
}
