'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PixelIcon } from '@/components/common/PixelIcon';
import { PixelButton } from '@/components/common/PixelButton';
import { PixelVisualizer } from '@/components/common/PixelVisualizer';
import { PixelModal } from '@/components/common/PixelModal';
import { PixelBadge } from '@/components/common/CRTOverlay';

// ============================================================
// LandingView — 16-Bit Retro Music Player Welcome Experience
// Features official Spotify OAuth PKCE entry + instant Mock Mode
// ============================================================

export function LandingView() {
  const { loginWithSpotify, enterMockMode, isLoading, error } = useAuth();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [clientIdInput, setClientIdInput] = useState('');
  const [connectError, setConnectError] = useState<string | null>(null);

  const handleSpotifyConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectError(null);
    const id = clientIdInput.trim();
    if (!id) {
      setConnectError('Please enter your Spotify Client ID');
      return;
    }
    try {
      await loginWithSpotify(id);
    } catch (err: unknown) {
      setConnectError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-between p-6 bg-bg-primary select-none overflow-y-auto">
      {/* ─── Floating Background Pixel Elements ──────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <span className="absolute top-[15%] left-[10%] text-accent-secondary opacity-30 animate-float-note">
          <PixelIcon name="musicNote" size={24} />
        </span>
        <span className="absolute top-[25%] right-[12%] text-accent-primary opacity-25 animate-float-note" style={{ animationDelay: '1.2s' }}>
          <PixelIcon name="disc" size={32} />
        </span>
        <span className="absolute bottom-[20%] left-[15%] text-accent-warm opacity-20 animate-float-note" style={{ animationDelay: '2s' }}>
          <PixelIcon name="cassette" size={28} />
        </span>
        <span className="absolute bottom-[30%] right-[18%] text-accent-secondary opacity-30 animate-float-note" style={{ animationDelay: '0.7s' }}>
          <PixelIcon name="musicNote" size={20} />
        </span>
      </div>

      {/* ─── Top Bar: Brand & System Status ──────────────── */}
      <div className="w-full max-w-5xl flex items-center justify-between border-b border-border-subtle pb-4 z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-bg-elevated border border-border-strong">
            <PixelIcon name="pixel-logo" size={20} color="var(--color-accent-primary)" />
          </div>
          <span className="font-pixel text-[13px] tracking-wider text-[#22C55E]">
            PIXEL<span className="text-white">FM</span> <span className="text-[9px] text-[#22C55E] font-mono">v2.0</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <PixelBadge variant="accent">16-BIT RETRO AUDIO</PixelBadge>
          <PixelBadge variant="muted">OFFICIAL SPOTIFY SDK</PixelBadge>
        </div>
      </div>

      {/* ─── Center Hero Display ─────────────────────────── */}
      <div className="flex flex-col items-center text-center max-w-2xl py-12 z-10">
        {/* Hardware Status LED */}
        <div className="flex items-center gap-2 mb-6 px-3 py-1 bg-[#131C2A] border border-[#1E2B3E] rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pixel-blink" />
          <span className="font-mono text-[10px] text-[#22C55E] uppercase tracking-widest">
            SYSTEM READY // OAUTH 2.0 PKCE ARCHITECTURE
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="font-pixel text-[28px] md:text-[40px] leading-tight text-white mb-4 tracking-tight">
          YOUR MUSIC.<br />
          <span className="text-[#22C55E]">YOUR PIXELS.</span>
        </h1>

        {/* Subtitle */}
        <p className="font-pixel-ui text-px-md text-[#94A3B8] max-w-lg mb-8 leading-relaxed">
          Your music. A more pixelated world. A bespoke 16-bit retro audio deck for your Spotify library, powered by Spotify Web Playback SDK.
        </p>

        {/* Center Animated Pixel Equalizer Hero */}
        <div className="p-4 bg-bg-surface border-2 border-border-strong mb-10 shadow-[6px_6px_0px_#0B0E18] w-full max-w-md">
          <div className="flex items-center justify-between text-[9px] font-mono text-text-muted mb-3 border-b border-border-subtle pb-1">
            <span>CH_L / CH_R</span>
            <span className="text-accent-secondary animate-pixel-pulse">ACTIVE SIGNAL</span>
            <span>44.1 kHz</span>
          </div>
          <div className="h-16 flex items-end justify-center">
            <PixelVisualizer isPlaying={true} barCount={28} height={56} />
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <PixelButton
            variant="primary"
            size="lg"
            onClick={() => setIsConnectModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 shadow-[4px_4px_0px_#0B0E18]"
          >
            <span className="flex items-center gap-2">
              <PixelIcon name="spotify" size={16} />
              CONNECT WITH SPOTIFY
            </span>
          </PixelButton>

          <PixelButton
            variant="secondary"
            size="lg"
            onClick={enterMockMode}
            className="w-full sm:w-auto px-6 py-3.5"
          >
            TRY DEMO / PREVIEW MODE
          </PixelButton>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-accent-primary/10 border border-accent-primary text-accent-primary font-pixel-ui text-[11px]">
            {error}
          </div>
        )}
      </div>

      {/* ─── Bottom Legal & Technical Compliance ─────────── */}
      <div className="w-full max-w-5xl border-t border-border-subtle pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left z-10">
        <div className="text-[11px] font-pixel-ui text-text-muted">
          Sign in securely with Spotify. We never ask for passwords or API secrets.
        </div>
        <div className="text-[10px] font-mono text-text-muted">
          COMPLIANT WITH SPOTIFY DEVELOPER TERMS
        </div>
      </div>

      {/* ─── Spotify OAuth Connect Modal ─────────────────── */}
      <PixelModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        title="CONNECT SPOTIFY ACCOUNT"
        size="md"
      >
        <form onSubmit={handleSpotifyConnect} className="flex flex-col gap-4">
          <div className="p-3 bg-bg-surface border border-border-subtle text-text-secondary text-[11px] leading-relaxed font-pixel-ui">
            PIXELIFY authenticates directly through Spotify&apos;s official OAuth 2.0 PKCE flow. Your password is never entered here.
          </div>

          <div>
            <label
              htmlFor="spotify-client-id"
              className="block font-pixel text-[9px] uppercase tracking-wider text-text-primary mb-2"
            >
              SPOTIFY CLIENT ID:
            </label>
            <input
              id="spotify-client-id"
              type="text"
              value={clientIdInput}
              onChange={(e) => setClientIdInput(e.target.value)}
              placeholder="e.g. 4a2b9c8d7e6f5a4b3c2d1e0f"
              className="w-full h-10 px-3 bg-bg-surface border border-border-strong text-text-primary font-mono text-[12px] focus:border-accent-primary focus:outline-none"
              autoFocus
            />
            <p className="text-[10px] font-pixel-ui text-text-muted mt-1.5">
              Available for free in your{' '}
              <a
                href="https://developer.spotify.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-secondary hover:underline"
              >
                Spotify Developer Dashboard
              </a>
              . Set redirect URI to: <code className="text-accent-warm">http://localhost:3000/callback</code>
            </p>
          </div>

          {connectError && (
            <div className="p-2 bg-accent-primary/10 border border-accent-primary text-accent-primary text-[11px]">
              {connectError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
            <PixelButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsConnectModalOpen(false)}
            >
              CANCEL
            </PixelButton>
            <PixelButton
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
            >
              AUTHORIZE VIA SPOTIFY
            </PixelButton>
          </div>
        </form>
      </PixelModal>
    </div>
  );
}
