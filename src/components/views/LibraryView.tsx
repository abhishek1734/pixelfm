'use client';

import React, { useState } from 'react';
import { PixelAlbumArt } from '@/components/artwork/PixelAlbumArt';
import { PixelIcon } from '@/components/common/PixelIcon';
import { PixelIconButton, PixelButton } from '@/components/common/PixelButton';
import {
  MOCK_PLAYLISTS,
  MOCK_ALBUMS,
  MOCK_ARTISTS,
  MOCK_LIKED_TRACKS,
} from '@/lib/mockData';
import { formatTime, cn } from '@/lib/utils';
import { NavPage, Playlist, Track } from '@/types/music';

// ============================================================
// LibraryView — Your 16-Bit Music Archive
// Tabs for Playlists, Albums, Artists, and Liked Songs with
// Grid/List view mode toggle and sorting
// ============================================================

interface LibraryViewProps {
  onPlayPlaylist: (playlist: Playlist) => void;
  onPlayTrack: (track: Track, context?: Track[]) => void;
  onNavigate: (page: NavPage) => void;
  initialTab?: 'playlists' | 'albums' | 'artists' | 'liked';
}

type TabType = 'playlists' | 'albums' | 'artists' | 'liked';

export function LibraryView({
  onPlayPlaylist,
  onPlayTrack,
  onNavigate,
  initialTab = 'playlists',
}: LibraryViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterQuery, setFilterQuery] = useState('');

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 flex flex-col gap-6 select-none">
      {/* ─── Header & Tab Switcher ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="text-[10px] font-pixel-ui text-text-muted uppercase tracking-wider mb-1">
            DIGITAL AUDIO VAULT
          </div>
          <h1 className="font-pixel text-[18px] text-text-primary">
            YOUR LIBRARY
          </h1>
        </div>

        {/* View Mode & Library Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="FILTER LIBRARY..."
              className="h-8 px-3 pr-8 bg-bg-surface border border-border-strong text-text-primary font-mono text-[11px] placeholder:text-text-muted/60 focus:border-accent-primary focus:outline-none"
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => setFilterQuery('')}
                className="absolute right-2 top-2 text-text-muted hover:text-text-primary"
              >
                <PixelIcon name="close" size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center border border-border-subtle bg-bg-surface p-0.5">
            <PixelIconButton
              label="Grid view"
              size="xs"
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <PixelIcon name="grid" size={12} />
            </PixelIconButton>
            <PixelIconButton
              label="List view"
              size="xs"
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <PixelIcon name="list" size={12} />
            </PixelIconButton>
          </div>
        </div>
      </div>

      {/* ─── Tab Bar ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-border-subtle overflow-x-auto pb-1">
        {(['playlists', 'albums', 'artists', 'liked'] as TabType[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 font-pixel text-[10px] uppercase tracking-wider cursor-pointer transition-colors shrink-0',
              activeTab === tab
                ? 'bg-bg-elevated text-accent-primary border-b-2 border-accent-primary'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            {tab === 'liked' ? 'LIKED SONGS' : tab}
          </button>
        ))}
      </div>

      {/* ─── Content Panels ───────────────────────────────── */}

      {/* 1. PLAYLISTS TAB */}
      {activeTab === 'playlists' && (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {MOCK_PLAYLISTS.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => onNavigate({ type: 'playlist', id: pl.id })}
                  className="p-3 bg-bg-surface border border-border-subtle hover:border-accent-primary hover:bg-bg-elevated cursor-pointer transition-all flex flex-col group"
                >
                  <div className="relative mb-3 flex justify-center">
                    <PixelAlbumArt track={pl.tracks?.[0]} size={130} showFrame={false} />
                    <div className="absolute inset-0 bg-bg-primary/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayPlaylist(pl);
                        }}
                        className="p-2.5 bg-accent-primary text-bg-primary hover:scale-110 transition-transform"
                      >
                        <PixelIcon name="play" size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="font-pixel text-[10px] text-text-primary group-hover:text-accent-primary truncate">
                    {pl.name}
                  </div>
                  <div className="text-[10px] font-pixel-ui text-text-muted mt-1 truncate">
                    {pl.tracks?.length || 6} Tracks • {pl.ownerName || 'Spotify'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-border-subtle bg-bg-surface">
              {MOCK_PLAYLISTS.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => onNavigate({ type: 'playlist', id: pl.id })}
                  className="flex items-center justify-between p-3 border-b border-border-subtle/40 hover:bg-bg-elevated cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <PixelAlbumArt track={pl.tracks?.[0]} size={40} showFrame={false} />
                    <div>
                      <div className="font-pixel text-[10px] text-text-primary group-hover:text-accent-primary">
                        {pl.name}
                      </div>
                      <div className="text-[11px] font-pixel-ui text-text-muted">
                        {pl.description || `${pl.tracks?.length || 6} tracks`}
                      </div>
                    </div>
                  </div>
                  <PixelButton
                    variant="ghost"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayPlaylist(pl);
                    }}
                  >
                    PLAY
                  </PixelButton>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. ALBUMS TAB */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {MOCK_ALBUMS.map((album) => (
            <div
              key={album.id}
              className="p-3 bg-bg-surface border border-border-subtle hover:border-border-strong hover:bg-bg-elevated cursor-pointer flex flex-col group"
            >
              <div className="mb-3 flex justify-center">
                <PixelAlbumArt size={130} showFrame={false} />
              </div>
              <div className="font-pixel text-[10px] text-text-primary group-hover:text-accent-secondary truncate">
                {album.name}
              </div>
              <div className="text-[10px] font-pixel-ui text-text-muted mt-1 truncate">
                {album.artistName} • {album.totalTracks || 10} Tracks
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. ARTISTS TAB */}
      {activeTab === 'artists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOCK_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              className="p-4 bg-bg-surface border-2 border-border-subtle hover:border-accent-primary hover:bg-bg-elevated cursor-pointer flex items-center gap-4 transition-all"
            >
              <div className="w-14 h-14 bg-bg-elevated border-2 border-border-strong flex items-center justify-center shrink-0">
                <PixelIcon name="user" size={24} color="var(--color-accent-primary)" />
              </div>
              <div className="truncate">
                <div className="font-pixel text-[11px] text-text-primary truncate">
                  {artist.name}
                </div>
                <div className="text-[10px] font-pixel-ui text-text-muted truncate mt-1">
                  {artist.genres?.join(', ') || '16-bit Electronic'}
                </div>
                <div className="text-[9px] font-mono text-accent-warm mt-1">
                  {artist.followers?.toLocaleString() || '12,450'} LISTENERS
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. LIKED SONGS TAB */}
      {activeTab === 'liked' && (
        <div className="flex flex-col gap-6">
          {/* Liked Songs Banner */}
          <div className="p-6 bg-gradient-to-r from-[#2B1B38] to-bg-surface border-2 border-accent-primary flex items-center gap-6 shadow-[4px_4px_0px_#0B0E18]">
            <div className="p-5 bg-accent-primary text-bg-primary shrink-0 border border-border-strong">
              <PixelIcon name="heartFilled" size={32} color="#0B0E18" />
            </div>
            <div>
              <div className="text-[10px] font-pixel-ui text-accent-primary uppercase tracking-wider mb-1">
                PLAYLIST
              </div>
              <h2 className="font-pixel text-[22px] text-text-primary mb-2">
                LIKED SONGS
              </h2>
              <div className="text-[11px] font-mono text-text-muted mb-4">
                {MOCK_LIKED_TRACKS.length} TRACKS IN ARCHIVE
              </div>
              <PixelButton
                variant="primary"
                size="sm"
                onClick={() => onPlayTrack(MOCK_LIKED_TRACKS[0], MOCK_LIKED_TRACKS)}
              >
                PLAY ALL
              </PixelButton>
            </div>
          </div>

          {/* Tracks Table */}
          <div className="border border-border-subtle bg-bg-surface">
            {MOCK_LIKED_TRACKS.map((track, i) => (
              <div
                key={track.id}
                onClick={() => onPlayTrack(track, MOCK_LIKED_TRACKS)}
                className="flex items-center gap-3 p-3 border-b border-border-subtle/40 hover:bg-bg-elevated cursor-pointer group"
              >
                <span className="w-6 text-center text-[10px] font-mono text-text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <PixelAlbumArt track={track} size={36} showFrame={false} className="shrink-0" />
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-pixel text-[10px] text-text-primary group-hover:text-accent-primary truncate">
                    {track.name}
                  </div>
                  <div className="text-[11px] font-pixel-ui text-text-muted truncate mt-0.5">
                    {track.artistName} • {track.albumName}
                  </div>
                </div>
                <span className="font-mono text-[11px] text-text-muted">
                  {formatTime(track.durationMs)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
