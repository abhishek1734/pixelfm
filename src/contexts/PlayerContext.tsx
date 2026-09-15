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
import { useAuth } from "./AuthContext";
import {
  SpotifyTrack,
  SpotifyPlaybackState,
  getPlaybackState,
  transferPlayback,
  skipToNext,
  skipToPrevious,
  seekToPosition,
  setRepeatMode,
  setShuffleMode,
  setVolume,
  pausePlayback,
  startPlayback,
} from "@/lib/spotify";
import { playTrackSwitch } from "@/lib/audioEngine";

// ============================================================
// Spotify Web Playback SDK Player Context
// SDK docs: https://developer.spotify.com/documentation/web-playback-sdk
// ============================================================

declare global {
  interface Window {
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, cb: (data: unknown) => void) => boolean;
  removeListener: (event: string, cb?: (data: unknown) => void) => boolean;
  getCurrentState: () => Promise<WebPlaybackState | null>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  activateElement: () => Promise<void>;
}

interface WebPlaybackState {
  paused: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat_mode: 0 | 1 | 2;
  track_window: {
    current_track: {
      id: string;
      name: string;
      uri: string;
      duration_ms: number;
      artists: { name: string; uri: string }[];
      album: {
        name: string;
        uri: string;
        images: { url: string; width: number; height: number }[];
      };
      is_playable: boolean;
      explicit: boolean;
    };
    previous_tracks: unknown[];
    next_tracks: unknown[];
  };
}

interface PlayerContextValue {
  isReady: boolean;
  deviceId: string | null;
  isPaused: boolean;
  position: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeatMode: 0 | 1 | 2;
  currentTrack: SpotifyTrack | null;
  externalDevice: SpotifyPlaybackState | null;
  soundFXEnabled: boolean;
  setSoundFXEnabled: (v: boolean) => void;

  togglePlay: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  setPlayerVolume: (vol: number) => Promise<void>;
  toggleShuffle: () => Promise<void>;
  cycleRepeat: () => Promise<void>;
  transferToTab: () => Promise<void>;
  playContext: (contextUri: string, offset?: number) => Promise<void>;
  playTracks: (uris: string[], offset?: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { accessToken, isAuthenticated } = useAuth();

  const playerRef = useRef<SpotifyPlayer | null>(null);
  const tokenRef = useRef<string | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatModeState] = useState<0 | 1 | 2>(0);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [externalDevice, setExternalDevice] = useState<SpotifyPlaybackState | null>(null);
  const [soundFXEnabled, setSoundFXEnabled] = useState(true);

  // Keep token ref up-to-date for the SDK callback
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  // Load Spotify Web Playback SDK script
  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return;
    if (document.getElementById("spotify-sdk-script")) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      if (!window.Spotify || !tokenRef.current) return;

      const player = new window.Spotify.Player({
        name: "PixelFM HiFi 🎮",
        getOAuthToken: (cb) => {
          if (tokenRef.current) cb(tokenRef.current);
        },
        volume: 0.7,
      });

      playerRef.current = player;

      player.addListener("ready", (data: unknown) => {
        const { device_id } = data as { device_id: string };
        setDeviceId(device_id);
        setIsReady(true);
      });

      player.addListener("not_ready", () => {
        setIsReady(false);
      });

      player.addListener("player_state_changed", (state: unknown) => {
        if (!state) return;
        const s = state as WebPlaybackState;
        setIsPaused(s.paused);
        setPosition(s.position);
        setDuration(s.duration);
        setShuffle(s.shuffle);
        setRepeatModeState(s.repeat_mode);

        const t = s.track_window?.current_track;
        if (t) {
          setCurrentTrack({
            id: t.id,
            name: t.name,
            uri: t.uri,
            duration_ms: t.duration_ms,
            explicit: t.explicit,
            artists: t.artists.map((a) => ({
              id: "",
              name: a.name,
              uri: a.uri,
              external_urls: { spotify: "" },
            })),
            album: {
              id: "",
              name: t.album.name,
              uri: t.album.uri,
              images: t.album.images,
              artists: [],
              release_date: "",
            },
            is_playable: t.is_playable,
            external_urls: { spotify: "" },
          });
        }
      });

      player.addListener("initialization_error", (e: unknown) => {
        console.error("[PixelFM SDK] init error:", (e as { message: string }).message);
      });
      player.addListener("authentication_error", (e: unknown) => {
        console.error("[PixelFM SDK] auth error:", (e as { message: string }).message);
      });
      player.addListener("account_error", (e: unknown) => {
        console.error("[PixelFM SDK] account error:", (e as { message: string }).message);
      });

      player.connect();
    };

    const script = document.createElement("script");
    script.id = "spotify-sdk-script";
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      playerRef.current?.disconnect();
    };
  }, [isAuthenticated]);

  // Position ticker
  useEffect(() => {
    if (isPaused || !isReady) return;
    const id = setInterval(() => {
      setPosition((p) => (p + 500 < duration ? p + 500 : p));
    }, 500);
    return () => clearInterval(id);
  }, [isPaused, isReady, duration]);

  // Poll for external Spotify Connect state (when not our device)
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    const poll = async () => {
      const state = await getPlaybackState(accessToken);
      if (state && state.device.id !== deviceId) {
        setExternalDevice(state);
      } else {
        setExternalDevice(null);
      }
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, [isAuthenticated, accessToken, deviceId]);

  const togglePlay = useCallback(async () => {
    if (playerRef.current) {
      await playerRef.current.activateElement(); // required for mobile autoplay
      await playerRef.current.togglePlay();
    } else if (accessToken && deviceId) {
      if (isPaused) await startPlayback(accessToken, deviceId);
      else await pausePlayback(accessToken, deviceId);
    }
  }, [accessToken, deviceId, isPaused]);

  const seek = useCallback(
    async (positionMs: number) => {
      if (playerRef.current) await playerRef.current.seek(positionMs);
      else if (accessToken) await seekToPosition(accessToken, positionMs);
      setPosition(positionMs);
    },
    [accessToken]
  );

  const next = useCallback(async () => {
    if (playerRef.current) await playerRef.current.nextTrack();
    else if (accessToken) await skipToNext(accessToken);
    if (soundFXEnabled) playTrackSwitch();
  }, [accessToken, soundFXEnabled]);

  const previous = useCallback(async () => {
    if (playerRef.current) await playerRef.current.previousTrack();
    else if (accessToken) await skipToPrevious(accessToken);
    if (soundFXEnabled) playTrackSwitch();
  }, [accessToken, soundFXEnabled]);

  const setPlayerVolume = useCallback(
    async (vol: number) => {
      setVolumeState(vol);
      if (playerRef.current) await playerRef.current.setVolume(vol);
      else if (accessToken) await setVolume(accessToken, vol * 100);
    },
    [accessToken]
  );

  const toggleShuffle = useCallback(async () => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);
    if (accessToken) await setShuffleMode(accessToken, newShuffle);
  }, [accessToken, shuffle]);

  const cycleRepeat = useCallback(async () => {
    const modes: ("off" | "context" | "track")[] = ["off", "context", "track"];
    const modeMap: Record<0 | 1 | 2, 0 | 1 | 2> = { 0: 1, 1: 2, 2: 0 };
    const next = modeMap[repeatMode];
    setRepeatModeState(next);
    if (accessToken) await setRepeatMode(accessToken, modes[next]);
  }, [accessToken, repeatMode]);

  const transferToTab = useCallback(async () => {
    if (!accessToken || !deviceId) return;
    await transferPlayback(accessToken, deviceId, true);
    setExternalDevice(null);
    setIsReady(true);
  }, [accessToken, deviceId]);

  const playContext = useCallback(
    async (contextUri: string, offset = 0) => {
      if (!accessToken || !deviceId) return;
      await startPlayback(accessToken, deviceId, contextUri, undefined, offset);
    },
    [accessToken, deviceId]
  );

  const playTracks = useCallback(
    async (uris: string[], offset = 0) => {
      if (!accessToken || !deviceId) return;
      await startPlayback(accessToken, deviceId, undefined, uris, offset);
    },
    [accessToken, deviceId]
  );

  return (
    <PlayerContext.Provider
      value={{
        isReady,
        deviceId,
        isPaused,
        position,
        duration,
        volume,
        shuffle,
        repeatMode,
        currentTrack,
        externalDevice,
        soundFXEnabled,
        setSoundFXEnabled,
        togglePlay,
        seek,
        next,
        previous,
        setPlayerVolume,
        toggleShuffle,
        cycleRepeat,
        transferToTab,
        playContext,
        playTracks,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
