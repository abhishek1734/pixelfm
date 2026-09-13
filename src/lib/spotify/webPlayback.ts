// PIXELIFY — Spotify Web Playback SDK Integration

// ============================================================
// SDK Loader
// ============================================================

const SDK_SCRIPT_URL = "https://sdk.scdn.co/spotify-player.js";
const SDK_READY_EVENT = "onSpotifyWebPlaybackSDKReady";

let sdkLoadPromise: Promise<void> | null = null;

/**
 * Dynamically appends the Spotify Web Playback SDK script tag to the document.
 * Safe to call multiple times — will only load once.
 * Resolves when the SDK fires the global `onSpotifyWebPlaybackSDKReady` callback.
 */
export function loadSpotifySDK(): Promise<void> {
  // Return cached promise if load is already in progress or completed
  if (sdkLoadPromise) return sdkLoadPromise;

  // If SDK is already loaded (e.g. HMR or re-mount), resolve immediately
  if (typeof window !== "undefined" && window.Spotify) {
    sdkLoadPromise = Promise.resolve();
    return sdkLoadPromise;
  }

  sdkLoadPromise = new Promise<void>((resolve, reject) => {
    // The SDK calls window.onSpotifyWebPlaybackSDKReady when it's ready
    window[SDK_READY_EVENT] = () => resolve();

    const existingScript = document.querySelector(
      `script[src="${SDK_SCRIPT_URL}"]`
    );

    if (existingScript) {
      // Script tag already injected — wait for the global callback
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_SCRIPT_URL;
    script.async = true;

    script.onerror = () => {
      sdkLoadPromise = null; // Allow retry on failure
      reject(new Error("Failed to load Spotify Web Playback SDK script."));
    };

    document.body.appendChild(script);
  });

  return sdkLoadPromise;
}

// ============================================================
// SpotifyWebPlayback Options
// ============================================================

export interface SpotifyWebPlaybackOptions {
  accessToken: string;
  onReady: (deviceId: string) => void;
  onPlayerStateChanged: (state: Spotify.PlaybackState | null) => void;
  onError: (error: Spotify.Error) => void;
  playerName?: string;
  initialVolume?: number;
}

// ============================================================
// SpotifyWebPlayback Class
// ============================================================

export class SpotifyWebPlayback {
  private player: Spotify.Player | null = null;
  private deviceId: string | null = null;
  private readonly options: SpotifyWebPlaybackOptions;

  constructor(options: SpotifyWebPlaybackOptions) {
    this.options = options;
  }

  // ----------------------------------------------------------
  // Initialize
  // ----------------------------------------------------------

  /**
   * Loads the Spotify Web Playback SDK, creates the player instance,
   * and registers all event listeners.
   * Must be called once before `connect()`.
   */
  async initialize(): Promise<void> {
    await loadSpotifySDK();

    this.player = new window.Spotify.Player({
      name: this.options.playerName ?? "PIXELIFY",
      volume: this.options.initialVolume ?? 0.8,
      getOAuthToken: (cb: (token: string) => void) => {
        cb(this.options.accessToken);
      },
    });

    this._registerListeners();
  }

  // ----------------------------------------------------------
  // Event Listeners
  // ----------------------------------------------------------

  private _registerListeners(): void {
    if (!this.player) return;

    // Playback state changes
    this.player.addListener(
      "player_state_changed",
      (state: Spotify.PlaybackState | null) => {
        this.options.onPlayerStateChanged(state);
      }
    );

    // Device ready
    this.player.addListener("ready", ({ device_id }: { device_id: string }) => {
      this.deviceId = device_id;
      this.options.onReady(device_id);
    });

    // Device not ready (e.g. connection lost)
    this.player.addListener(
      "not_ready",
      ({ device_id }: { device_id: string }) => {
        console.warn("[PIXELIFY] Playback device went offline:", device_id);
        if (this.deviceId === device_id) {
          this.deviceId = null;
        }
      }
    );

    // Errors
    const errorTypes: Spotify.ErrorTypes[] = [
      "initialization_error",
      "authentication_error",
      "account_error",
      "playback_error",
    ];

    for (const type of errorTypes) {
      this.player.addListener(type, (error: Spotify.Error) => {
        console.error(`[PIXELIFY] Spotify ${type}:`, error);
        this.options.onError(error);
      });
    }
  }

  // ----------------------------------------------------------
  // Connection
  // ----------------------------------------------------------

  /**
   * Connects the player to Spotify's infrastructure.
   * Resolves when the connection is established or rejects on failure.
   */
  async connect(): Promise<void> {
    if (!this.player) {
      throw new Error(
        "Player not initialized. Call initialize() before connect()."
      );
    }

    const success = await this.player.connect();
    if (!success) {
      throw new Error(
        "Failed to connect to Spotify Web Playback SDK. " +
          "Ensure the user has a Spotify Premium account."
      );
    }
  }

  /**
   * Disconnects the player and removes all event listeners.
   * Safe to call even if not connected.
   */
  disconnect(): void {
    if (!this.player) return;
    this.player.disconnect();
    this.deviceId = null;
  }

  // ----------------------------------------------------------
  // Accessors
  // ----------------------------------------------------------

  /** Returns the active device ID, or null if not connected. */
  getDeviceId(): string | null {
    return this.deviceId;
  }

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  /**
   * Returns the current playback state snapshot from the SDK.
   * Returns null if not playing or player is disconnected.
   */
  async getCurrentState(): Promise<Spotify.PlaybackState | null> {
    if (!this.player) return null;
    return this.player.getCurrentState();
  }

  // ----------------------------------------------------------
  // Playback Controls
  // ----------------------------------------------------------

  /** Resume playback. */
  async resume(): Promise<void> {
    if (!this.player) throw new Error("Player not initialized.");
    await this.player.resume();
  }

  /** Pause playback. */
  async pause(): Promise<void> {
    if (!this.player) throw new Error("Player not initialized.");
    await this.player.pause();
  }

  /**
   * Seek to a position in the current track.
   * @param positionMs — Absolute position in milliseconds.
   */
  async seek(positionMs: number): Promise<void> {
    if (!this.player) throw new Error("Player not initialized.");
    await this.player.seek(positionMs);
  }

  /**
   * Set the player volume.
   * @param fraction — Volume as a fraction between 0.0 and 1.0.
   */
  async setVolume(fraction: number): Promise<void> {
    if (!this.player) throw new Error("Player not initialized.");
    const clamped = Math.min(1, Math.max(0, fraction));
    await this.player.setVolume(clamped);
  }
}

export default SpotifyWebPlayback;

