// PIXELIFY — Utility Library

// ============================================================
// Time / Duration Formatting
// ============================================================

/**
 * Converts milliseconds to mm:ss format.
 * e.g. 125000 → "2:05"
 */
export function formatTime(ms: number): string {
  if (!isFinite(ms) || ms < 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Alias for formatTime — converts milliseconds to mm:ss.
 */
export function formatDuration(ms: number): string {
  return formatTime(ms);
}

/**
 * Short display format — same as formatTime but used for compact UI areas.
 * Returns "-:--" for invalid input.
 */
export function formatTimeShort(ms: number): string {
  if (!isFinite(ms) || ms < 0) return "-:--";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// ============================================================
// Class Name Utility
// ============================================================

/**
 * Combines class name strings, filtering out falsy values.
 * Lightweight alternative to clsx/classnames.
 */
export function cn(...classes: (string | undefined | null | false | string[])[]): string {
  return classes.flat(Infinity).filter(Boolean).join(" ");
}

// ============================================================
// String Utilities
// ============================================================

/**
 * Truncates a string to the given max length, appending "…" if truncated.
 */
export function truncate(str: string, maxLen: number): string {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + "…";
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================
// ID Generation
// ============================================================

/**
 * Generates a random alphanumeric ID string.
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ============================================================
// Function Utilities
// ============================================================

/**
 * Returns a debounced version of the provided function.
 * The debounced function delays invoking `fn` until after `delay` ms
 * have elapsed since the last call.
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Args) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
}

// ============================================================
// Time of Day
// ============================================================

/**
 * Returns the current time of day as a semantic label.
 * morning   → 05:00–11:59
 * afternoon → 12:00–16:59
 * evening   → 17:00–20:59
 * night     → 21:00–04:59
 */
export function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

// ============================================================
// Color Utilities
// ============================================================

/**
 * Parses a 3 or 6-digit hex color string into RGB components.
 * Returns null for invalid input.
 */
export function hexToRgb(
  hex: string
): { r: number; g: number; b: number } | null {
  // Normalize: strip leading # and expand shorthand
  const cleaned = hex.replace(/^#/, "");
  let full: string;

  if (cleaned.length === 3) {
    full = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  } else if (cleaned.length === 6) {
    full = cleaned;
  } else {
    return null;
  }

  const value = parseInt(full, 16);
  if (isNaN(value)) return null;

  return {
    r: (value >> 16) & 0xff,
    g: (value >> 8) & 0xff,
    b: value & 0xff,
  };
}

// ============================================================
// Math Utilities
// ============================================================

/**
 * Clamps `value` between `min` and `max` (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
