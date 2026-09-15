// ============================================================
// PKCE Cryptographic Helpers
// Per official Spotify PKCE docs:
// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
// ============================================================

/**
 * Generate a cryptographically random code verifier string.
 * Must be 43–128 chars of URL-safe characters.
 */
export function generateCodeVerifier(length: number = 64): string {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce(
    (acc, x) => acc + possible[x % possible.length],
    ""
  );
}

/**
 * SHA-256 hash of the verifier string using SubtleCrypto.
 */
async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

/**
 * Base64url-encode an ArrayBuffer (no padding, + → -, / → _).
 */
function base64encode(input: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Generate a PKCE code challenge from the verifier.
 * code_challenge_method = "S256"
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const hashed = await sha256(verifier);
  return base64encode(hashed);
}

/**
 * Generate a cryptographically random state value for CSRF protection.
 */
export function generateState(length: number = 16): string {
  return generateCodeVerifier(length);
}
