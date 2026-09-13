"use client";
// PIXELIFY — Mock Audio Engine
// Web Audio API synthesizer for demo/preview playback.
// Generates a pleasant lofi-style oscillator chord so users can hear
// *something* without a real Spotify connection.

// ============================================================
// Types
// ============================================================

type PlaybackState = "idle" | "playing" | "paused";

// ============================================================
// MockAudioEngine Class
// ============================================================

export class MockAudioEngine {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private amOscillator: OscillatorNode | null = null;
  private amGain: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private isPlaying: boolean = false;
  private currentTime: number = 0; // elapsed ms at last pause/seek
  private startWallTime: number | null = null; // Date.now() when last resumed
  private trackDurationMs: number = 0;
  private onEndedCallback: (() => void) | null = null;
  private endTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private state: PlaybackState = "idle";

  // ----------------------------------------------------------
  // initialize
  // ----------------------------------------------------------

  /** Create AudioContext and core nodes. Safe to call multiple times. */
  initialize(): void {
    if (this.ctx && this.ctx.state !== "closed") return;

    this.ctx = new AudioContext();

    // Master gain — controls volume
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.5, this.ctx.currentTime);

    // Analyser for visualizer data
    this.analyserNode = this.ctx.createAnalyser();
    this.analyserNode.fftSize = 256;
    this.analyserNode.smoothingTimeConstant = 0.8;

    // Routing: gainNode -> analyserNode -> destination
    this.gainNode.connect(this.analyserNode);
    this.analyserNode.connect(this.ctx.destination);
  }

  // ----------------------------------------------------------
  // play
  // ----------------------------------------------------------

  /**
   * Start synthesized lofi playback for a track.
   * Uses a C-major triad (C4 + E4 + G4) at very low gain with
   * a 0.5 Hz AM modulation for warmth and gentle movement.
   *
   * @param trackDurationMs  Full duration of the "track" in milliseconds.
   * @param onEnded          Callback fired when playback reaches the end.
   */
  play(trackDurationMs: number, onEnded: () => void): void {
    if (!this.ctx || this.ctx.state === "closed") {
      this.initialize();
    }
    if (!this.ctx || !this.gainNode) return;

    // Resume suspended context (browser autoplay policy)
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    // Tear down any previous oscillators
    this._stopOscillators();

    this.trackDurationMs = trackDurationMs;
    this.onEndedCallback = onEnded;
    this.isPlaying = true;
    this.state = "playing";
    this.startWallTime = Date.now();

    // ---- AM (amplitude modulation) carrier setup ----
    // A slow sine at 0.5 Hz modulates the chord gain for subtle vibrato warmth.
    this.amOscillator = this.ctx.createOscillator();
    this.amOscillator.type = "sine";
    this.amOscillator.frequency.setValueAtTime(0.5, this.ctx.currentTime);

    this.amGain = this.ctx.createGain();
    // Depth: 0 to 0.02 (very gentle)
    this.amGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

    this.amOscillator.connect(this.amGain);

    // ---- Chord: C4(261.63) + E4(329.63) + G4(392.00) ----
    const frequencies: number[] = [261.63, 329.63, 392.0];
    const oscTypes: OscillatorType[] = ["sine", "triangle", "sine"];

    frequencies.forEach((freq, i) => {
      if (!this.ctx || !this.gainNode || !this.amGain) return;

      // Per-oscillator gain node
      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      // AM modulation feeds into oscGain so it modulates each tone
      this.amGain!.connect(oscGain.gain);

      const osc = this.ctx.createOscillator();
      osc.type = oscTypes[i];
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Slight detune for lofi warmth
      osc.detune.setValueAtTime(i * -4, this.ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      osc.start();

      this.oscillators.push(osc);
    });

    // Start AM oscillator
    this.amOscillator.start();

    // Schedule onEnded after remaining duration
    this._scheduleEnd();
  }

  // ----------------------------------------------------------
  // pause
  // ----------------------------------------------------------

  /** Suspend audio playback, recording elapsed time. */
  pause(): void {
    if (!this.ctx || !this.isPlaying) return;

    // Record how much time has elapsed before suspending
    if (this.startWallTime !== null) {
      this.currentTime += Date.now() - this.startWallTime;
      this.startWallTime = null;
    }

    this.ctx.suspend().catch(() => {});
    this.isPlaying = false;
    this.state = "paused";

    // Cancel the pending end-of-track timeout
    this._clearEndTimeout();
  }

  // ----------------------------------------------------------
  // resume
  // ----------------------------------------------------------

  /** Resume audio from the paused position. */
  resume(): void {
    if (!this.ctx || this.isPlaying || this.state === "idle") return;

    this.ctx.resume().catch(() => {});
    this.isPlaying = true;
    this.state = "playing";
    this.startWallTime = Date.now();

    // Re-schedule the end timeout for the remaining duration
    this._scheduleEnd();
  }

  // ----------------------------------------------------------
  // stop
  // ----------------------------------------------------------

  /** Fully stop playback and reset all state. */
  stop(): void {
    this._stopOscillators();
    this._clearEndTimeout();

    if (this.ctx && this.ctx.state !== "closed") {
      // Bring context back to running state so it can be reused
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    }

    this.isPlaying = false;
    this.state = "idle";
    this.currentTime = 0;
    this.startWallTime = null;
    this.trackDurationMs = 0;
    this.onEndedCallback = null;
  }

  // ----------------------------------------------------------
  // seek
  // ----------------------------------------------------------

  /**
   * Jump to a specific position in the track.
   * @param ms  Target position in milliseconds.
   */
  seek(ms: number): void {
    const wasPlaying = this.isPlaying;

    // Update elapsed reference
    this.currentTime = Math.max(0, Math.min(ms, this.trackDurationMs));
    this.startWallTime = wasPlaying ? Date.now() : null;

    // Re-schedule end timeout from new position
    this._clearEndTimeout();
    if (wasPlaying) {
      this._scheduleEnd();
    }
  }

  // ----------------------------------------------------------
  // setVolume
  // ----------------------------------------------------------

  /**
   * Set the master volume.
   * @param fraction  Value from 0 (silent) to 1 (full).
   */
  setVolume(fraction: number): void {
    if (!this.gainNode || !this.ctx) return;
    const clamped = Math.max(0, Math.min(1, fraction));
    this.gainNode.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.01);
  }

  // ----------------------------------------------------------
  // getProgressMs
  // ----------------------------------------------------------

  /** Returns the current playback position in milliseconds. */
  getProgressMs(): number {
    if (this.isPlaying && this.startWallTime !== null) {
      return this.currentTime + (Date.now() - this.startWallTime);
    }
    return this.currentTime;
  }

  // ----------------------------------------------------------
  // getAnalyserData
  // ----------------------------------------------------------

  /**
   * Returns a frequency-domain snapshot for the visualizer.
   * Returns null if the engine has not been initialized yet.
   */
  getAnalyserData(): Uint8Array | null {
    if (!this.analyserNode) return null;
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(data);
    return data;
  }

  // ----------------------------------------------------------
  // getDurationMs
  // ----------------------------------------------------------

  /** Returns the total duration of the current track in milliseconds. */
  getDurationMs(): number {
    return this.trackDurationMs;
  }

  // ----------------------------------------------------------
  // isCurrentlyPlaying
  // ----------------------------------------------------------

  /** Returns true if audio is actively playing (not paused or idle). */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // ----------------------------------------------------------
  // destroy
  // ----------------------------------------------------------

  /** Tear down everything. Call when the component unmounts. */
  destroy(): void {
    this.stop();
    if (this.ctx && this.ctx.state !== "closed") {
      this.ctx.close().catch(() => {});
    }
    this.ctx = null;
    this.gainNode = null;
    this.analyserNode = null;
  }

  // ----------------------------------------------------------
  // Private helpers
  // ----------------------------------------------------------

  /** Stop and disconnect all active oscillators. */
  private _stopOscillators(): void {
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Already stopped — ignore
      }
    });
    this.oscillators = [];

    if (this.amOscillator) {
      try {
        this.amOscillator.stop();
        this.amOscillator.disconnect();
      } catch {
        // Already stopped — ignore
      }
      this.amOscillator = null;
    }

    if (this.amGain) {
      try {
        this.amGain.disconnect();
      } catch {
        // Already disconnected — ignore
      }
      this.amGain = null;
    }
  }

  /** Schedule the onEnded callback after the remaining track duration. */
  private _scheduleEnd(): void {
    this._clearEndTimeout();
    const remaining = this.trackDurationMs - this.currentTime;
    if (remaining <= 0) {
      this._triggerEnded();
      return;
    }
    this.endTimeoutId = setTimeout(() => {
      this._triggerEnded();
    }, remaining);
  }

  /** Clear any pending end-of-track timeout. */
  private _clearEndTimeout(): void {
    if (this.endTimeoutId !== null) {
      clearTimeout(this.endTimeoutId);
      this.endTimeoutId = null;
    }
  }

  /** Fire the onEnded callback and reset state. */
  private _triggerEnded(): void {
    const cb = this.onEndedCallback;
    this.stop();
    if (cb) cb();
  }
}

// ============================================================
// Singleton export
// ============================================================

export const mockAudioEngine = new MockAudioEngine();
export default mockAudioEngine;
