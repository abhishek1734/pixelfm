'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { NavPage, Playlist } from '@/types/music';
import { PixelIcon } from '@/components/common/PixelIcon';
import { PixelCat } from '@/components/mascot/PixelCat';
import { PixelFMLogo } from '@/components/common/PixelFMLogo';
import { useAuth } from '@/context/AuthContext';

// ============================================================
// Sidebar — PIXELFM Navigation Rail
// Faithfully matches media_1789322141854.jpg
// Includes:
// - PIXELFM phosphor green headphones branding
// - Navigation links (Home, Search, Your Library)
// - Custom styled playlists with colored icon badges
// - Interactive sleeping PixelCat mascot perched on the Player_01 card
// ============================================================

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  playlists: Playlist[];
  onCreatePlaylist?: () => void;
  isCollapsed?: boolean;
  className?: string;
}

function isSamePage(a: NavPage, b: NavPage): boolean {
  if (typeof a === 'string' && typeof b === 'string') return a === b;
  if (typeof a === 'object' && typeof b === 'object') {
    return a.type === b.type && a.id === b.id;
  }
  return false;
}

export function Sidebar({
  currentPage,
  onNavigate,
  playlists,
  onCreatePlaylist,
  isCollapsed = false,
  className,
}: SidebarProps) {
  const { spotifyUser } = useAuth();
  const [showAllPlaylists, setShowAllPlaylists] = useState(false);

  const displayName = spotifyUser?.displayName ?? 'Player_01';
  const sidebarWidth = isCollapsed ? 56 : 240;

  // Custom playlists matching screenshot colors
  const curatedSidebarPlaylists = [
    {
      id: 'liked',
      name: 'Liked Songs',
      isSpecial: true,
      iconBg: '#F472B6', // Pink
      renderIcon: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
    },
    {
      id: 'playlist_chill_vibes',
      name: 'Chill Vibes',
      iconBg: '#60A5FA', // Blue gamepad
      renderIcon: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF">
          <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      ),
    },
    {
      id: 'playlist_late_night',
      name: 'Late Night',
      iconBg: '#FB923C', // Orange sunset
      renderIcon: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF">
          <path d="M12 4c-4.41 0-8 3.59-8 8 0 1.82.61 3.5 1.64 4.85l1.45-1.45C6.41 14.39 6 13.25 6 12c0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.25-.41 2.39-1.09 3.4l1.45 1.45C20.39 15.5 21 13.82 21 12c0-4.41-3.59-8-8-8zm-8 14h16v2H4v-2zm8-10c-2.21 0-4 1.79-4 4 0 .92.31 1.76.83 2.44l1.45-1.45C10.1 12.67 10 12.35 10 12c0-1.1.9-2 2-2s2 .9 2 2c0 .35-.1.67-.28.99l1.45 1.45c.52-.68.83-1.52.83-2.44 0-2.21-1.79-4-4-4z" />
        </svg>
      ),
    },
    {
      id: 'playlist_focus',
      name: 'Focus',
      iconBg: '#34D399', // Emerald tree
      renderIcon: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFFFFF">
          <path d="M12 2C8.5 2 5.5 4.5 5 8c-2 1-3 3-3 5 0 3.3 2.7 6 6 6h3v3h2v-3h3c3.3 0 6-2.7 6-6 0-2-1-4-3-5-.5-3.5-3.5-6-7-6z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-[#0E1521] border-r border-[#1B2738] flex-shrink-0 select-none z-30',
        className
      )}
      style={{ width: sidebarWidth, minWidth: sidebarWidth }}
      aria-label="Sidebar navigation"
    >
      {/* ── 1. Top Logo Header ─────────────────────────────────── */}
      <div className={cn('p-4 border-b border-[#1B2738]', isCollapsed && 'p-2 flex justify-center')}>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="cursor-pointer text-left hover:opacity-90 transition-opacity focus:outline-none"
        >
          <PixelFMLogo size="md" showText={!isCollapsed} />
        </button>
      </div>

      {/* ── 2. Primary Navigation ──────────────────────────────── */}
      <nav className="p-3 flex flex-col gap-1 border-b border-[#1B2738]" aria-label="Main navigation">
        {[
          {
            page: 'home' as NavPage,
            label: 'Home',
            icon: (active: boolean) => (
              <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? '#22C55E' : 'currentColor'}>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            ),
          },
          {
            page: 'search' as NavPage,
            label: 'Search',
            icon: (active: boolean) => (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#22C55E' : 'currentColor'} strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            ),
          },
          {
            page: 'library' as NavPage,
            label: 'Your Library',
            icon: (active: boolean) => (
              <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? '#22C55E' : 'currentColor'}>
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 9H10V9h8v2zm-4 4H10v-2h4v2zm4-8H10V5h8v2z" />
              </svg>
            ),
          },
          {
            page: 'settings' as NavPage,
            label: 'Settings',
            icon: (active: boolean) => (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#22C55E' : 'currentColor'} strokeWidth="2.2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            ),
          },
        ].map(({ page, label, icon }) => {
          const isActive = isSamePage(currentPage, page);
          return (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(page)}
              title={isCollapsed ? label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer',
                isActive
                  ? 'bg-[#132B24] border border-[#22C55E]/30 text-[#22C55E] font-semibold'
                  : 'text-[#94A3B8] hover:bg-[#131C2A] hover:text-white border border-transparent'
              )}
            >
              <div className="flex-shrink-0">{icon(isActive)}</div>
              {!isCollapsed && <span className="text-[13px] font-sans tracking-wide">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* ── 3. Playlists Section ─────────────────────────────── */}
      {!isCollapsed && (
        <div className="flex flex-col flex-1 overflow-hidden px-3 pt-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase">
              PLAYLISTS
            </span>
          </div>

          {/* + Create Playlist button */}
          <button
            type="button"
            onClick={onCreatePlaylist}
            className="flex items-center gap-3 px-2 py-2 rounded-lg text-[13px] font-medium text-[#94A3B8] hover:text-white hover:bg-[#131C2A] transition-colors cursor-pointer w-full text-left mb-1"
          >
            <div className="w-7 h-7 rounded bg-[#1A2333] border border-[#2A374A] flex items-center justify-center flex-shrink-0 text-white font-bold text-base">
              +
            </div>
            <span>Create Playlist</span>
          </button>

          {/* Playlists List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-0.5 custom-scrollbar">
            {curatedSidebarPlaylists.map((item) => {
              const isActive =
                item.isSpecial
                  ? isSamePage(currentPage, 'liked')
                  : typeof currentPage === 'object' &&
                    currentPage.type === 'playlist' &&
                    currentPage.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.isSpecial) {
                      onNavigate('liked');
                    } else {
                      onNavigate({ type: 'playlist', id: item.id });
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-2 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer w-full text-left',
                    isActive
                      ? 'bg-[#131F2E] text-white font-semibold'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#131C2A]'
                  )}
                >
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    {item.renderIcon()}
                  </div>
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}

            {/* Other user playlists if any */}
            {showAllPlaylists &&
              playlists
                .filter(
                  (p) =>
                    !['playlist_chill_vibes', 'playlist_late_night', 'playlist_focus'].includes(p.id)
                )
                .map((playlist) => {
                  const isActive =
                    typeof currentPage === 'object' &&
                    currentPage.type === 'playlist' &&
                    currentPage.id === playlist.id;

                  return (
                    <button
                      key={playlist.id}
                      type="button"
                      onClick={() => onNavigate({ type: 'playlist', id: playlist.id })}
                      className={cn(
                        'flex items-center gap-3 px-2 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer w-full text-left',
                        isActive
                          ? 'bg-[#131F2E] text-white font-semibold'
                          : 'text-[#94A3B8] hover:text-white hover:bg-[#131C2A]'
                      )}
                    >
                      <div className="w-7 h-7 rounded bg-[#1A2333] border border-[#2A374A] flex items-center justify-center flex-shrink-0 text-[#64748B]">
                        <PixelIcon name="playlist" size={14} color="currentColor" />
                      </div>
                      <span className="truncate">{playlist.name}</span>
                    </button>
                  );
                })}

            {/* Show More toggle */}
            <button
              type="button"
              onClick={() => setShowAllPlaylists(!showAllPlaylists)}
              className="flex items-center gap-2 px-2 py-2 text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors cursor-pointer w-full text-left mt-1"
            >
              <span>...</span>
              <span>{showAllPlaylists ? 'Show Less' : 'Show More'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 4. Interactive Cat & User Profile Footer ─────────────────────── */}
      <div className="p-3 border-t border-[#1B2738] relative mt-auto">
        {/* Sleeping / Interactive Cat Mascot Perched atop the User Profile Card */}
        {!isCollapsed && (
          <div className="absolute -top-[34px] left-5 z-20 pointer-events-auto">
            <PixelCat size="sm" showZzz={true} />
          </div>
        )}

        <div
          onClick={() => onNavigate('settings')}
          className="flex items-center justify-between bg-[#131C2A] border border-[#1E2B3E] rounded-xl p-2.5 shadow-sm hover:border-[#22C55E]/40 hover:bg-[#162234] transition-all cursor-pointer group"
          title="Profile & Settings"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Retro Pixel Robot / Face Avatar */}
            <div className="w-8 h-8 rounded-lg bg-[#163828] border border-[#22C55E]/40 flex items-center justify-center flex-shrink-0 text-[#22C55E] group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" />
                <rect x="4" y="5" width="2" height="2" fill="#0A0F17" />
                <rect x="10" y="5" width="2" height="2" fill="#0A0F17" />
                <rect x="4" y="9" width="1" height="2" fill="#0A0F17" />
                <rect x="11" y="9" width="1" height="2" fill="#0A0F17" />
                <rect x="5" y="10" width="6" height="2" fill="#0A0F17" />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-white group-hover:text-[#22C55E] transition-colors truncate leading-tight font-sans">
                  {displayName}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="text-[#64748B] group-hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

