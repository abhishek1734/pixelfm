"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PlayerControls, PlayerState, Playlist, RepeatMode, Track } from "@/types/music";
import { mockAudioEngine } from "@/lib/audio/mockAudioEngine";
import { MOCK_TRACKS } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import { SpotifyWebPlayback } from "@/lib/spotify/webPlayback";
import SpotifyAPI from "@/lib/spotify/api";

// ============================================================
// Context Shape
// ============================================================

interface PlayerContextValue extends PlayerControls {
  state: PlayerState;
  spotifyDeviceId: string | null;
  isPremiumRequired: boolean;
}

const INITIAL_STATE: PlayerState = {
  isPlaying: false,
  currentTrack: MOCK_TRACKS[0] || null,
  queue: MOCK_TRACKS,
  queueIndex: 0,
  progressMs: 0,
  volume: 0.8,
  isMuted: false,
  shuffle: false,
  repeat: "off",
  isConnected: false,
};

export const PlayerContext = createContext<PlayerContextValue>({
  state: INITIAL_STATE,
  spotifyDeviceId: null,
  isPremiumRequired: false,
  play: () => {},
  pause: () => {},
  resume: () => {},
  next: () => {},
  prev: () => {},
  seek: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  toggleShuffle: () => {},
  toggleRepeat: () => {},
  addToQueue: () => {},
  removeFromQueue: () => {},
  clearQueue: () => {},
  playPlaylist: () => {},
  toggleLike: () => {},
});

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return ctx;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { mode, accessToken } = useAuth();
  const [state, setState] = useState<PlayerState>(INITIAL_STATE);
  const [spotifyDeviceId, setSpotifyDeviceId] = useState<string | null>(null);
  const [isPremiumRequired, setIsPremiumRequired] = useState(false);

  const sdkRef = useRef<SpotifyWebPlayback | null>(null);
  const apiRef = useRef<SpotifyAPI | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoNextRef = useRef<() => void>(() => {});

  // Keep stateRef for event listeners
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // ----------------------------------------------------------
  // Initialize Spotify SDK when in Spotify mode
  // ----------------------------------------------------------
  useEffect(() => {
    if (mode === "spotify" && accessToken) {
      apiRef.current = new SpotifyAPI(accessToken);

      const sdk = new SpotifyWebPlayback({
        accessToken,
        playerName: "PIXELIFY Player (Web SDK)",
        initialVolume: stateRef.current.volume,
        onReady: (deviceId) => {
          setSpotifyDeviceId(deviceId);
          setState((prev) => ({ ...prev, isConnected: true, deviceId }));
        },
        onPlayerStateChanged: (playbackState) => {
          if (!playbackState) return;

          const item = playbackState.track_window.current_track;
          const isPaused = playbackState.paused;

          setState((prev) => ({
            ...prev,
            isPlaying: !isPaused,
            progressMs: playbackState.position,
            shuffle: playbackState.shuffle,
            repeat: playbackState.repeat_mode === 2 ? "track" : playbackState.repeat_mode === 1 ? "context" : "off",
            currentTrack: item
              ? {
                  id: item.id || "spotify-track",
                  name: item.name,
                  artistName: item.artists.map((a: { name: string }) => a.name).join(", "),
                  albumName: item.album.name,
                  albumImageUrl: item.album.images?.[0]?.url,
                  durationMs: item.duration_ms,
                  uri: item.uri,
                  isPlayable: true,
                }
              : prev.currentTrack,
          }));
        },
        onError: (err) => {
          console.warn("[Spotify SDK]", err.message);
          if (err.message?.toLowerCase().includes("premium")) {
            setIsPremiumRequired(true);
          }
        },
      });

      sdkRef.current = sdk;
      sdk
        .initialize()
        .then(() => sdk.connect())
        .catch((e) => console.error("Failed to connect Spotify SDK:", e));

      return () => {
        sdk.disconnect();
        sdkRef.current = null;
        setSpotifyDeviceId(null);
      };
    } else {
      sdkRef.current = null;
      apiRef.current = null;
    }
  }, [mode, accessToken]);

  // ----------------------------------------------------------
  // Mock Progress Timer
  // ----------------------------------------------------------
  useEffect(() => {
    if (mode === "mock" && state.isPlaying) {
      progressTimerRef.current = setInterval(() => {
        setState((prev) => {
          const duration = prev.currentTrack?.durationMs || 180000;
          const nextMs = prev.progressMs + 250;
          if (nextMs >= duration) {
            // Track ended in mock mode
            return prev;
          }
          return { ...prev, progressMs: nextMs };
        });
      }, 250);

      return () => {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
      };
    }
  }, [mode, state.isPlaying]);

  // ----------------------------------------------------------
  // Playback Controls
  // ----------------------------------------------------------

  const play = useCallback(
    async (track?: Track, context?: Track[]) => {
      const activeTrack = track || stateRef.current.currentTrack || MOCK_TRACKS[0];
      const queueList = context || (track ? [track] : stateRef.current.queue);
      const queueIdx = queueList.findIndex((t) => t.id === activeTrack.id);

      setState((prev) => ({
        ...prev,
        isPlaying: true,
        currentTrack: activeTrack,
        queue: queueList,
        queueIndex: queueIdx >= 0 ? queueIdx : 0,
        progressMs: 0,
      }));

      if (mode === "spotify" && spotifyDeviceId && apiRef.current && activeTrack.uri) {
        try {
          await apiRef.current.play(spotifyDeviceId, [activeTrack.uri]);
        } catch (err) {
          console.error("Spotify API play error:", err);
        }
      } else {
        // Mock Mode Playback
        mockAudioEngine.initialize();
        mockAudioEngine.play(activeTrack.durationMs, () => {
          // Auto-advance track on ended
          autoNextRef.current();
        });
      }
    },
    [mode, spotifyDeviceId]
  );

  const pause = useCallback(async () => {
    setState((prev) => ({ ...prev, isPlaying: false }));
    if (mode === "spotify" && spotifyDeviceId && apiRef.current) {
      try {
        await apiRef.current.pause(spotifyDeviceId);
      } catch (e) {
        console.error("Spotify pause error:", e);
      }
    } else {
      mockAudioEngine.pause();
    }
  }, [mode, spotifyDeviceId]);

  const resume = useCallback(async () => {
    setState((prev) => ({ ...prev, isPlaying: true }));
    if (mode === "spotify" && sdkRef.current) {
      await sdkRef.current.resume();
    } else {
      mockAudioEngine.resume();
    }
  }, [mode]);

  const seek = useCallback(
    async (ms: number) => {
      setState((prev) => ({ ...prev, progressMs: ms }));
      if (mode === "spotify" && spotifyDeviceId && apiRef.current) {
        await apiRef.current.seekToPosition(spotifyDeviceId, ms);
      } else {
        mockAudioEngine.seek(ms);
      }
    },
    [mode, spotifyDeviceId]
  );

  const next = useCallback(async () => {
    const { queue, queueIndex, shuffle, repeat } = stateRef.current;
    if (queue.length === 0) return;

    if (repeat === "track") {
      seek(0);
      resume();
      return;
    }

    let nextIdx = queueIndex + 1;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeat === "context") {
        nextIdx = 0;
      } else {
        pause();
        return;
      }
    }

    const nextTrack = queue[nextIdx];
    if (nextTrack) {
      play(nextTrack, queue);
    }
  }, [play, pause, resume, seek]);

  const prev = useCallback(async () => {
    const { queue, queueIndex, progressMs } = stateRef.current;
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart track
    if (progressMs > 3000) {
      seek(0);
      return;
    }

    const prevIdx = Math.max(0, queueIndex - 1);
    const prevTrack = queue[prevIdx];
    if (prevTrack) {
      play(prevTrack, queue);
    }
  }, [play, seek]);

  const handleAutoNext = useCallback(() => {
    const { queue, queueIndex, repeat, shuffle } = stateRef.current;
    if (repeat === "track") {
      seek(0);
      mockAudioEngine.play(stateRef.current.currentTrack?.durationMs || 180000, () => autoNextRef.current());
      return;
    }
    let nextIdx = queueIndex + 1;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeat === "context") {
        nextIdx = 0;
      } else {
        setState((p) => ({ ...p, isPlaying: false, progressMs: 0 }));
        return;
      }
    }
    const nextTrack = queue[nextIdx];
    if (nextTrack) {
      play(nextTrack, queue);
    }
  }, [play, seek]);

  useEffect(() => {
    autoNextRef.current = handleAutoNext;
  }, [handleAutoNext]);

  const setVolume = useCallback(
    async (vol: number) => {
      const clamped = Math.min(1, Math.max(0, vol));
      setState((prev) => ({ ...prev, volume: clamped, isMuted: clamped === 0 }));
      if (mode === "spotify" && spotifyDeviceId && apiRef.current) {
        await apiRef.current.setVolume(spotifyDeviceId, Math.round(clamped * 100));
      } else {
        mockAudioEngine.setVolume(clamped);
      }
    },
    [mode, spotifyDeviceId]
  );

  const toggleMute = useCallback(() => {
    setState((prev) => {
      const newMuted = !prev.isMuted;
      const targetVol = newMuted ? 0 : prev.volume || 0.8;
      if (mode === "mock") {
        mockAudioEngine.setVolume(targetVol);
      }
      return { ...prev, isMuted: newMuted };
    });
  }, [mode]);

  const toggleShuffle = useCallback(async () => {
    const newShuffle = !stateRef.current.shuffle;
    setState((prev) => ({ ...prev, shuffle: newShuffle }));
    if (mode === "spotify" && spotifyDeviceId && apiRef.current) {
      await apiRef.current.setShuffle(spotifyDeviceId, newShuffle);
    }
  }, [mode, spotifyDeviceId]);

  const toggleRepeat = useCallback(async () => {
    const modes: RepeatMode[] = ["off", "context", "track"];
    const currentMode = stateRef.current.repeat;
    const nextMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];
    setState((prev) => ({ ...prev, repeat: nextMode }));
    if (mode === "spotify" && spotifyDeviceId && apiRef.current) {
      await apiRef.current.setRepeat(spotifyDeviceId, nextMode);
    }
  }, [mode, spotifyDeviceId]);

  const addToQueue = useCallback((track: Track) => {
    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setState((prev) => {
      const newQueue = prev.queue.filter((_, i) => i !== index);
      let newIdx = prev.queueIndex;
      if (index < prev.queueIndex) {
        newIdx = Math.max(0, prev.queueIndex - 1);
      }
      return { ...prev, queue: newQueue, queueIndex: newIdx };
    });
  }, []);

  const clearQueue = useCallback(() => {
    setState((prev) => ({
      ...prev,
      queue: prev.currentTrack ? [prev.currentTrack] : [],
      queueIndex: 0,
    }));
  }, []);

  const playPlaylist = useCallback(
    (playlist: Playlist) => {
      const tracks = playlist.tracks || [];
      if (tracks.length > 0) {
        play(tracks[0], tracks);
      }
    },
    [play]
  );

  const toggleLike = useCallback(
    async (trackId: string) => {
      setState((prev) => {
        const updateTrack = (t: Track) =>
          t.id === trackId ? { ...t, isLiked: !t.isLiked } : t;

        return {
          ...prev,
          currentTrack: prev.currentTrack ? updateTrack(prev.currentTrack) : null,
          queue: prev.queue.map(updateTrack),
        };
      });

      if (mode === "spotify" && apiRef.current) {
        const isLiked = stateRef.current.currentTrack?.isLiked;
        if (isLiked) {
          await apiRef.current.unlikeTracks([trackId]).catch(() => {});
        } else {
          await apiRef.current.likeTracks([trackId]).catch(() => {});
        }
      }
    },
    [mode]
  );

  return (
    <PlayerContext.Provider
      value={{
        state,
        spotifyDeviceId,
        isPremiumRequired,
        play,
        pause,
        resume,
        next,
        prev,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playPlaylist,
        toggleLike,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
