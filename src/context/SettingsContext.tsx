"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ACCENT_COLOR_VALUES,
  AppSettings,
} from "@/types/music";

// ============================================================
// Defaults
// ============================================================

const DEFAULT_SETTINGS: AppSettings = {
  crtEffect: false,
  pixelAnimations: true,
  accentColor: "green",
  reduceMotion: false,
  highContrast: false,
  compactPlayer: false,
  autoplay: true,
  showQueueAutomatically: false,
  savedVolume: 0.8,
  spotifyClientId: "",
  theme: "dark",
  volumeNormalization: true,
  crossfade: false,
  audioQuality: "auto",
  desktopNotifications: true,
  playlistUpdates: true,
};

const STORAGE_KEY = "pixelify-settings";

// ============================================================
// Context Shape
// ============================================================

interface SettingsContextValue {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;
}

// ============================================================
// Context
// ============================================================

export const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSetting: () => {},
});

// ============================================================
// Hook
// ============================================================

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}

// ============================================================
// Helpers
// ============================================================

function loadFromStorage(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveToStorage(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage may be unavailable
  }
}

function applyCrtEffect(enabled: boolean): void {
  if (typeof document === "undefined") return;
  if (enabled) {
    document.body.classList.add("crt-effect");
  } else {
    document.body.classList.remove("crt-effect");
  }
}

function applyAccentColor(accentColor: AppSettings["accentColor"]): void {
  if (typeof document === "undefined") return;
  const hex = ACCENT_COLOR_VALUES[accentColor] ?? ACCENT_COLOR_VALUES.coral;
  document.documentElement.style.setProperty("--color-accent-primary", hex);
}

// ============================================================
// Provider
// ============================================================

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => loadFromStorage());

  // Apply CRT class whenever it changes
  useEffect(() => {
    applyCrtEffect(settings.crtEffect);
  }, [settings.crtEffect]);

  // Apply accent CSS variable whenever it changes
  useEffect(() => {
    applyAccentColor(settings.accentColor);
  }, [settings.accentColor]);

  const updateSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        saveToStorage(next);
        return next;
      });
    },
    []
  );

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}
