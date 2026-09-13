'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn, debounce } from '@/lib/utils';
import { NavPage } from '@/types/music';
import { PixelIcon } from '@/components/common/PixelIcon';
import { PixelBadge } from '@/components/common/CRTOverlay';
import { useAuth } from '@/context/AuthContext';

// ============================================================
// Topbar — 56px top navigation bar
// Contains: back/forward arrows, page title, search input,
// mode badge, and user profile dropdown.
// ============================================================

interface TopbarProps {
  title?: string;
  onSearch?: (query: string) => void;
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  searchQuery?: string;
  showSearch?: boolean;
}

// ── Mode badge helper ─────────────────────────────────────────────────────────
function ModeBadge({ mode }: { mode: 'landing' | 'mock' | 'spotify' }) {
  if (mode === 'mock') {
    return <PixelBadge variant="warm">DEMO</PixelBadge>;
  }
  if (mode === 'spotify') {
    return <PixelBadge variant="accent">SPOTIFY</PixelBadge>;
  }
  return <PixelBadge variant="muted">OFFLINE</PixelBadge>;
}

// ── Profile Dropdown ─────────────────────────────────────────────────────────
interface ProfileDropdownProps {
  displayName: string;
  mode: 'landing' | 'mock' | 'spotify';
  onNavigateSettings: () => void;
  onLogout: () => void;
  onClose: () => void;
}

function ProfileDropdown({
  displayName,
  mode,
  onNavigateSettings,
  onLogout,
  onClose,
}: ProfileDropdownProps) {
  // Close on outside click
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const logoutLabel = mode === 'spotify' ? 'DISCONNECT' : 'EXIT DEMO';

  return (
    <div
      ref={ref}
      className={cn(
        'absolute top-full right-0 mt-1 z-50',
        'w-[200px]',
        'bg-bg-secondary border border-border-subtle',
        'flex flex-col'
      )}
      role="menu"
      aria-label="User menu"
    >
      {/* User info header */}
      <div className="px-3 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="bg-bg-elevated border border-border-subtle flex items-center justify-center flex-shrink-0"
            style={{ width: 28, height: 28 }}
          >
            <PixelIcon name="user" size={14} color="var(--color-text-muted, #676D8A)" />
          </div>
          <span className="text-[10px] font-pixel-ui text-text-primary uppercase truncate leading-none">
            {displayName}
          </span>
        </div>
        <ModeBadge mode={mode} />
      </div>

      {/* Menu items */}
      <div className="flex flex-col py-1">
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            onNavigateSettings();
            onClose();
          }}
          className={cn(
            'flex items-center gap-2 px-3 py-2',
            'text-[11px] font-pixel-ui uppercase tracking-wider text-text-secondary',
            'hover:bg-bg-elevated hover:text-text-primary',
            'cursor-pointer border-none bg-transparent w-full text-left',
            'transition-none'
          )}
        >
          <PixelIcon name="settings" size={12} color="currentColor" />
          SETTINGS
        </button>

        <div className="border-t border-border-subtle my-1" />

        <button
          type="button"
          role="menuitem"
          onClick={() => {
            onLogout();
            onClose();
          }}
          className={cn(
            'flex items-center gap-2 px-3 py-2',
            'text-[11px] font-pixel-ui uppercase tracking-wider text-accent-primary',
            'hover:bg-accent-primary/10',
            'cursor-pointer border-none bg-transparent w-full text-left',
            'transition-none'
          )}
        >
          <PixelIcon name="close" size={12} color="currentColor" />
          {logoutLabel}
        </button>
      </div>
    </div>
  );
}

// ── Topbar ───────────────────────────────────────────────────────────────────
export function Topbar({
  onSearch,
  currentPage,
  onNavigate,
  searchQuery = '',
}: TopbarProps) {
  const { mode, spotifyUser, logout } = useAuth();

  const displayName = spotifyUser?.displayName ?? 'PLAYER_01';

  const [profileOpen, setProfileOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [prevQuery, setPrevQuery] = useState(searchQuery);

  if (searchQuery !== prevQuery) {
    setPrevQuery(searchQuery);
    setLocalQuery(searchQuery);
  }

  const debouncedSearch = useMemo(
    () =>
      debounce((q: string) => {
        onSearch?.(q);
      }, 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setLocalQuery(q);
    debouncedSearch(q);
  };

  const handleSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(localQuery);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className={cn(
        'flex items-center gap-4 px-6 h-16 bg-[#0A0F17]/80 backdrop-blur-md border-b border-[#1B2738] flex-shrink-0 z-40'
      )}
    >
      {/* Back navigation button + optional "PLAYING FROM" context */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (currentPage !== 'home') onNavigate('home');
          }}
          className="w-8 h-8 rounded-lg bg-[#131C2A] border border-[#1E2B3E] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#22C55E]/50 transition-colors cursor-pointer flex-shrink-0"
          title="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {currentPage === 'now-playing' && (
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-pixel-ui font-semibold text-[#64748B] uppercase tracking-wider leading-tight">
              PLAYING FROM
            </span>
            <span className="text-xs font-semibold text-white truncate leading-tight">
              Chill Vibes
            </span>
          </div>
        )}
      </div>

      {/* Slogans on Search and Settings screens matching screenshots */}
      {currentPage === 'search' && (
        <div className="ml-auto text-xs text-[#64748B] font-mono tracking-wide hidden sm:block">
          Good music, brighter days.
        </div>
      )}

      {currentPage === 'settings' && (
        <div className="ml-auto text-xs text-[#64748B] font-mono tracking-wide hidden sm:block">
          Music hits different here.
        </div>
      )}

      {/* On other pages (Home, Now Playing, Library), show search pill + mode/profile */}
      {currentPage !== 'search' && currentPage !== 'settings' && (
        <>
          <div className="flex-1 max-w-md relative min-w-0">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="text"
              value={localQuery}
              onChange={handleSearchChange}
              onKeyUp={handleSearchKeyUp}
              onFocus={() => {
                onNavigate('search');
              }}
              placeholder="Search for songs, artists, or playlists..."
              className="w-full pl-10 pr-4 py-2 bg-[#131C2A] border border-[#1E2B3E] rounded-full text-[13px] text-white placeholder:text-[#64748B] outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/40 transition-all font-sans"
              aria-label="Search for songs, artists, or playlists"
            />
            {localQuery && (
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('');
                  onSearch?.('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
            <div className="px-2.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              {mode === 'spotify' ? 'SPOTIFY' : 'PIXEL AUDIO'}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={profileOpen}
                className="w-8 h-8 rounded-full bg-[#131C2A] border border-[#1E2B3E] flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#22C55E]/40 transition-colors cursor-pointer"
              >
                <PixelIcon
                  name="user"
                  size={14}
                  color={profileOpen ? '#22C55E' : 'currentColor'}
                />
              </button>

              {profileOpen && (
                <ProfileDropdown
                  displayName={displayName}
                  mode={mode}
                  onNavigateSettings={() => onNavigate('settings')}
                  onLogout={handleLogout}
                  onClose={() => setProfileOpen(false)}
                />
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
