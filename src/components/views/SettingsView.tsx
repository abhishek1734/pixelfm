'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { AccentColor, NavPage } from '@/types/music';
import { cn } from '@/lib/utils';

// ============================================================
// SettingsView — PIXELFM Configuration Room
// Faithfully matches media_1789323172474.png
// Sections:
// - Left Column:
//   1. Account (Player_01, Edit Profile, Log Out)
//   2. Appearance (Theme dropdown, Accent Color 5 circles)
//   3. Playback (Volume Normalization toggle, Crossfade toggle)
// - Right Column:
//   4. Audio Quality (Automatic, High, Normal, Low radio group)
//   5. Notifications (Desktop Notifications, Playlist Updates toggles)
//   6. About (Version 1.0.0, Open Source, Privacy Policy, Terms)
// ============================================================

interface SettingsViewProps {
  onNavigate?: (page: NavPage) => void;
}

export function SettingsView({ onNavigate }: SettingsViewProps) {
  const { settings, updateSetting } = useSettings();
  const { mode, spotifyUser, logout } = useAuth();

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(spotifyUser?.displayName ?? 'Player_01');
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'opensource' | null>(null);

  const displayName = spotifyUser?.displayName ?? profileName;
  const userEmail = spotifyUser?.email ?? 'player01@example.com';

  const accentColors: { key: AccentColor; hex: string; name: string }[] = [
    { key: 'green', hex: '#22C55E', name: 'Phosphor Green' },
    { key: 'purple', hex: '#8B5CF6', name: 'Neon Purple' },
    { key: 'blue', hex: '#3B82F6', name: 'Sky Blue' },
    { key: 'pink', hex: '#EC4899', name: 'Hot Pink' },
    { key: 'orange', hex: '#F97316', name: 'Retro Orange' },
  ];

  const audioQualities = [
    { key: 'auto' as const, label: 'Automatic', sub: 'Adjusts quality based on your connection' },
    { key: 'high' as const, label: 'High', sub: 'Best sound quality' },
    { key: 'normal' as const, label: 'Normal', sub: 'Balances quality and data usage' },
    { key: 'low' as const, label: 'Low', sub: 'Saves data' },
  ];

  const handleNotificationToggle = async (val: boolean) => {
    updateSetting('desktopNotifications', val);
    if (val && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-6 md:px-8 md:py-8 select-none flex flex-col gap-6 max-w-7xl">
      {/* ─── Header ───────────────────────────────────────── */}
      <div>
        <h1 className="font-pixel text-2xl sm:text-3xl text-white font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-[#94A3B8] font-sans mt-1">
          Customize your PixelFM experience.
        </p>
      </div>

      {/* ─── Two-Column Settings Grid ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* ─── LEFT COLUMN: Account, Appearance, Playback ──── */}
        <div className="flex flex-col gap-6">

          {/* 1. Account Card */}
          <div className="bg-[#0D1520] border border-[#1B2738] rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="text-xs font-semibold text-[#64748B] tracking-wider uppercase font-sans">
              Account
            </div>

            {/* Profile Row */}
            <div
              onClick={() => setEditProfileOpen(true)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#131C2A] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#163828] border border-[#22C55E]/40 flex items-center justify-center shrink-0 text-[#22C55E]">
                  <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" />
                    <rect x="4" y="5" width="2" height="2" fill="#0A0F17" />
                    <rect x="10" y="5" width="2" height="2" fill="#0A0F17" />
                    <rect x="4" y="9" width="1" height="2" fill="#0A0F17" />
                    <rect x="11" y="9" width="1" height="2" fill="#0A0F17" />
                    <rect x="5" y="10" width="6" height="2" fill="#0A0F17" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white group-hover:text-[#22C55E] transition-colors truncate font-sans">
                    {displayName}
                  </span>
                  <span className="text-xs text-[#64748B] truncate font-sans">
                    {userEmail}
                  </span>
                </div>
              </div>

              <div className="text-[#64748B] group-hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Edit Profile Row */}
            <div
              onClick={() => setEditProfileOpen(true)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#131C2A] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#94A3B8] group-hover:text-[#22C55E] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-white group-hover:text-[#22C55E] transition-colors font-sans">
                  Edit Profile
                </span>
              </div>
              <div className="text-[#64748B] group-hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Log Out Row */}
            <div
              onClick={() => logout()}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#131C2A] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#94A3B8] group-hover:text-red-400 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-white group-hover:text-red-400 transition-colors font-sans">
                  Log Out
                </span>
              </div>
              <div className="text-[#64748B] group-hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* 2. Appearance Card */}
          <div className="bg-[#0D1520] border border-[#1B2738] rounded-2xl p-5 flex flex-col gap-5 shadow-sm">
            <div className="text-xs font-semibold text-[#64748B] tracking-wider uppercase font-sans">
              Appearance
            </div>

            {/* Theme Dropdown */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[#94A3B8]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-white font-sans">
                  Theme
                </span>
              </div>

              {/* Theme Selector */}
              <div className="relative">
                <select
                  value={settings.theme ?? 'dark'}
                  onChange={(e) => {
                    const t = e.target.value as any;
                    updateSetting('theme', t);
                    if (t === 'crt') updateSetting('crtEffect', true);
                    else updateSetting('crtEffect', false);
                  }}
                  className="appearance-none bg-[#131C2A] border border-[#1E2B3E] rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-white outline-none focus:border-[#22C55E]/60 cursor-pointer font-sans"
                >
                  <option value="dark">Dark (Default)</option>
                  <option value="crt">Retro CRT</option>
                  <option value="cyberpunk">Cyberpunk Dark</option>
                  <option value="oled">OLED Black</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Accent Color Picker Circles */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[#94A3B8]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="13.5" cy="6.5" r="2.5" />
                    <circle cx="17.5" cy="10.5" r="2.5" />
                    <circle cx="8.5" cy="7.5" r="2.5" />
                    <circle cx="6.5" cy="12.5" r="2.5" />
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-white font-sans">
                  Accent Color
                </span>
              </div>

              {/* 5 Colored Circles matching screenshot */}
              <div className="flex items-center gap-2.5">
                {accentColors.map((color) => {
                  const isSelected = (settings.accentColor ?? 'green') === color.key;
                  return (
                    <button
                      key={color.key}
                      type="button"
                      onClick={() => updateSetting('accentColor', color.key)}
                      title={color.name}
                      className={cn(
                        'w-6 h-6 rounded-full transition-transform cursor-pointer relative flex items-center justify-center',
                        isSelected ? 'scale-110' : 'hover:scale-105'
                      )}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <span
                          className="absolute -inset-1 rounded-full border-2 transition-all"
                          style={{ borderColor: color.hex }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Playback Card */}
          <div className="bg-[#0D1520] border border-[#1B2738] rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="text-xs font-semibold text-[#64748B] tracking-wider uppercase font-sans">
              Playback
            </div>

            {/* Volume Normalization Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <span className="text-[#94A3B8] mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white font-sans">
                    Volume Normalization
                  </span>
                  <span className="text-xs text-[#64748B] font-sans">
                    Keep volume consistent across tracks
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => updateSetting('volumeNormalization', !(settings.volumeNormalization ?? true))}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5',
                  (settings.volumeNormalization ?? true) ? 'bg-[#22C55E]' : 'bg-[#1E2B3E]'
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-full bg-white transition-transform',
                    (settings.volumeNormalization ?? true) ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            {/* Crossfade Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <span className="text-[#94A3B8] mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 3 21 3 21 8" />
                    <line x1="4" y1="20" x2="21" y2="3" />
                    <polyline points="21 16 21 21 16 21" />
                    <line x1="15" y1="15" x2="21" y2="21" />
                    <line x1="4" y1="4" x2="9" y2="9" />
                  </svg>
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white font-sans">
                    Crossfade
                  </span>
                  <span className="text-xs text-[#64748B] font-sans">
                    Smoothly transition between songs
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => updateSetting('crossfade', !(settings.crossfade ?? false))}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5',
                  (settings.crossfade ?? false) ? 'bg-[#22C55E]' : 'bg-[#1E2B3E]'
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-full bg-white transition-transform',
                    (settings.crossfade ?? false) ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>

        </div>

        {/* ─── RIGHT COLUMN: Audio Quality, Notifications, About ── */}
        <div className="flex flex-col gap-6">

          {/* 4. Audio Quality Card */}
          <div className="bg-[#0D1520] border border-[#1B2738] rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] tracking-wider uppercase font-sans">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="10" width="3" height="10" />
                <rect x="10" y="4" width="3" height="16" />
                <rect x="16" y="8" width="3" height="12" />
              </svg>
              Audio Quality
            </div>

            {/* Radio Group */}
            <div className="flex flex-col gap-3">
              {audioQualities.map((item) => {
                const isSelected = (settings.audioQuality ?? 'auto') === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => updateSetting('audioQuality', item.key)}
                    className="flex items-start gap-3 cursor-pointer group select-none"
                  >
                    <div className="mt-0.5">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border flex items-center justify-center transition-colors',
                          isSelected
                            ? 'border-[#22C55E] bg-[#22C55E]/10'
                            : 'border-[#334155] group-hover:border-[#64748B]'
                        )}
                      >
                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span
                        className={cn(
                          'text-sm font-medium transition-colors font-sans',
                          isSelected ? 'text-white' : 'text-[#CBD5E1] group-hover:text-white'
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="text-xs text-[#64748B] font-sans leading-relaxed">
                        {item.sub}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Notifications Card */}
          <div className="bg-[#0D1520] border border-[#1B2738] rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] tracking-wider uppercase font-sans">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              Notifications
            </div>

            {/* Desktop Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <span className="text-[#94A3B8] mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="22" y1="12" x2="18" y2="12" />
                    <line x1="6" y1="12" x2="2" y2="12" />
                    <line x1="12" y1="6" x2="12" y2="2" />
                    <line x1="12" y1="22" x2="12" y2="18" />
                  </svg>
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white font-sans">
                    Show Desktop Notifications
                  </span>
                  <span className="text-xs text-[#64748B] font-sans">
                    Get notified about what&apos;s playing
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleNotificationToggle(!(settings.desktopNotifications ?? true))}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5',
                  (settings.desktopNotifications ?? true) ? 'bg-[#22C55E]' : 'bg-[#1E2B3E]'
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-full bg-white transition-transform',
                    (settings.desktopNotifications ?? true) ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            {/* Playlist Updates Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <span className="text-[#94A3B8] mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white font-sans">
                    Playlist Updates
                  </span>
                  <span className="text-xs text-[#64748B] font-sans">
                    Get notified about playlist activity
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => updateSetting('playlistUpdates', !(settings.playlistUpdates ?? true))}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative cursor-pointer flex items-center px-0.5',
                  (settings.playlistUpdates ?? true) ? 'bg-[#22C55E]' : 'bg-[#1E2B3E]'
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-full bg-white transition-transform',
                    (settings.playlistUpdates ?? true) ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>

          {/* 6. About Card */}
          <div className="bg-[#0D1520] border border-[#1B2738] rounded-2xl p-5 flex flex-col gap-3.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] tracking-wider uppercase font-sans">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              About
            </div>

            {/* Version */}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm font-medium text-[#CBD5E1] font-sans">Version</span>
              <span className="text-xs font-mono text-[#64748B]">1.0.0</span>
            </div>

            {/* Open Source */}
            <div
              onClick={() => setActiveModal('opensource')}
              className="flex items-center justify-between py-1 hover:text-white text-[#CBD5E1] cursor-pointer group"
            >
              <span className="text-sm font-medium font-sans group-hover:text-[#22C55E] transition-colors">Open Source</span>
              <span className="text-[#64748B] group-hover:text-[#22C55E] transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </span>
            </div>

            {/* Privacy Policy */}
            <div
              onClick={() => setActiveModal('privacy')}
              className="flex items-center justify-between py-1 hover:text-white text-[#CBD5E1] cursor-pointer group"
            >
              <span className="text-sm font-medium font-sans group-hover:text-[#22C55E] transition-colors">Privacy Policy</span>
              <span className="text-[#64748B] group-hover:text-[#22C55E] transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </span>
            </div>

            {/* Terms of Service */}
            <div
              onClick={() => setActiveModal('terms')}
              className="flex items-center justify-between py-1 hover:text-white text-[#CBD5E1] cursor-pointer group"
            >
              <span className="text-sm font-medium font-sans group-hover:text-[#22C55E] transition-colors">Terms of Service</span>
              <span className="text-[#64748B] group-hover:text-[#22C55E] transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* ─── Interactive Edit Profile Modal ───────────────── */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1520] border border-[#1E2B3E] rounded-2xl p-6 w-full max-w-md flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-pixel text-sm text-white">Edit Profile</h3>
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="text-[#64748B] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="w-14 h-14 rounded-xl bg-[#163828] border border-[#22C55E]/40 flex items-center justify-center text-[#22C55E] shrink-0">
                <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" />
                  <rect x="4" y="5" width="2" height="2" fill="#0A0F17" />
                  <rect x="10" y="5" width="2" height="2" fill="#0A0F17" />
                  <rect x="4" y="9" width="1" height="2" fill="#0A0F17" />
                  <rect x="11" y="9" width="1" height="2" fill="#0A0F17" />
                  <rect x="5" y="10" width="6" height="2" fill="#0A0F17" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#94A3B8]">Pixel Avatar</span>
                <span className="text-xs text-[#22C55E] font-medium">Player 01 Edition</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#94A3B8]">Display Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#131C2A] border border-[#1E2B3E] rounded-xl text-white text-sm outline-none focus:border-[#22C55E]"
              />
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#94A3B8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#22C55E] text-black hover:bg-[#1EA750]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Interactive Info Modal (Privacy, Terms, OpenSource) ─── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1520] border border-[#1E2B3E] rounded-2xl p-6 w-full max-w-lg flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-pixel text-sm text-white">
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Service'}
                {activeModal === 'opensource' && 'Open Source License'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-[#64748B] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#94A3B8] font-sans leading-relaxed space-y-2 max-h-60 overflow-y-auto pr-2">
              {activeModal === 'privacy' && (
                <>
                  <p>PixelFM connects securely to your Spotify account using Spotify&apos;s official OAuth 2.0 PKCE protocol.</p>
                  <p>Your password is never accessed, received, or stored by PixelFM. All audio streaming is routed directly through Spotify&apos;s Web Playback SDK.</p>
                  <p>Your playback preferences, custom theme selections, and volume settings are saved exclusively in your local browser storage.</p>
                </>
              )}
              {activeModal === 'terms' && (
                <>
                  <p>PixelFM is a custom music player interface designed exclusively for authenticated Spotify users.</p>
                  <p>Music playback requires an active Spotify Premium membership as governed by Spotify AB&apos;s Developer Policy.</p>
                  <p>PixelFM does not host, upload, or redistribute any copyrighted audio files.</p>
                </>
              )}
              {activeModal === 'opensource' && (
                <>
                  <p>PixelFM is built with Next.js 16, React 19, Tailwind CSS, and Web Audio API.</p>
                  <p>All original 16-bit SVG pixel art assets and retro equalizer shaders are released under the MIT License.</p>
                  <p>Developed with passion for retro soundscapes and 16-bit pixel art.</p>
                </>
              )}
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#131C2A] border border-[#1E2B3E] text-white hover:border-[#22C55E]/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
