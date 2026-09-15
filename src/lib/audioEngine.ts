// ============================================================
// Web Audio API Engine — 8-bit chiptune synth + demo stream
// ============================================================

let audioCtx: AudioContext | null = null;
let demoAudio: HTMLAudioElement | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

// ---- 8-bit synth ----

function playNote(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  volume: number = 0.15,
  type: OscillatorType = "square"
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

/**
 * Play a short 8-bit UI click/interaction chime.
 */
export function playChime(type: "click" | "success" | "error" = "click"): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;

    if (type === "click") {
      playNote(ctx, 880, now, 0.06, 0.08, "square");
      playNote(ctx, 1174, now + 0.06, 0.06, 0.06, "square");
    } else if (type === "success") {
      const arpeggio = [523, 659, 784, 1047];
      arpeggio.forEach((freq, i) => {
        playNote(ctx, freq, now + i * 0.08, 0.1, 0.1, "square");
      });
    } else if (type === "error") {
      playNote(ctx, 330, now, 0.1, 0.12, "square");
      playNote(ctx, 220, now + 0.1, 0.15, 0.1, "square");
    }
  } catch {
    // Silently fail if audio is blocked
  }
}

/**
 * Play the arcade boot-up sound sequence.
 */
export function playBootSequence(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;

    // Rising arpeggio sweep
    const bootNotes = [262, 330, 392, 523, 659, 784, 1047, 1319];
    bootNotes.forEach((freq, i) => {
      playNote(ctx, freq, now + i * 0.05, 0.08, 0.08, "square");
    });
    // Final chord hit
    playNote(ctx, 523, now + 0.5, 0.3, 0.12, "square");
    playNote(ctx, 659, now + 0.5, 0.3, 0.08, "square");
    playNote(ctx, 784, now + 0.5, 0.3, 0.06, "square");
  } catch {
    // Silently fail
  }
}

/**
 * Play a soft "track switch" blip.
 */
export function playTrackSwitch(): void {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    playNote(ctx, 698, now, 0.04, 0.07, "square");
    playNote(ctx, 932, now + 0.04, 0.04, 0.05, "square");
  } catch {}
}

// ---- Demo stream ----

/**
 * Initialize and return the HTML5 Audio element for the demo/lofi stream.
 */
export function initDemoStream(url: string): HTMLAudioElement {
  if (demoAudio) {
    demoAudio.pause();
    demoAudio.src = "";
  }
  demoAudio = new Audio();
  demoAudio.crossOrigin = "anonymous";
  demoAudio.src = url;
  demoAudio.preload = "none";
  return demoAudio;
}

export function getDemoAudio(): HTMLAudioElement | null {
  return demoAudio;
}

export function playDemoStream(): Promise<void> {
  if (!demoAudio) return Promise.resolve();
  return demoAudio.play();
}

export function pauseDemoStream(): void {
  demoAudio?.pause();
}

export function setDemoVolume(volume: number): void {
  if (demoAudio) demoAudio.volume = Math.max(0, Math.min(1, volume));
}

/**
 * Check if the browser supports Widevine / EME (required for Spotify SDK).
 */
export async function checkWidevineDRM(): Promise<{
  supported: boolean;
  message: string;
}> {
  if (typeof window === "undefined") {
    return { supported: false, message: "Server-side rendering" };
  }
  if (!("requestMediaKeySystemAccess" in navigator)) {
    return {
      supported: false,
      message: "navigator.requestMediaKeySystemAccess not available",
    };
  }
  try {
    await (navigator as Navigator & { requestMediaKeySystemAccess: (keySystem: string, supportedConfigurations: MediaKeySystemConfiguration[]) => Promise<MediaKeySystemAccess> }).requestMediaKeySystemAccess(
      "com.widevine.alpha",
      [
        {
          initDataTypes: ["cenc"],
          audioCapabilities: [{ contentType: 'audio/mp4;codecs="mp4a.40.2"' }],
        },
      ]
    );
    return { supported: true, message: "Widevine DRM available ✓" };
  } catch {
    return {
      supported: false,
      message: "Widevine DRM not available — use Chrome or Edge",
    };
  }
}
