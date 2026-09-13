'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PixelIcon } from './PixelIcon';
import { PixelIconButton } from './PixelButton';
import { cn } from '@/lib/utils';

// ============================================================
// PixelModal — Retro 16-bit System Dialog Window
// Features sharp stepped borders, retro title bar, focus trapping
// ============================================================

interface PixelModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-[360px]',
  md: 'max-w-[480px]',
  lg: 'max-w-[640px]',
};

export function PixelModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}: PixelModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0E18]/80 backdrop-blur-none cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Window */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pixel-modal-title"
        className={cn(
          'relative w-full bg-bg-secondary border-2 border-border-strong',
          'shadow-[6px_6px_0px_rgba(0,0,0,0.8)]',
          'z-10 flex flex-col',
          sizeClasses[size],
          className
        )}
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-bg-elevated border-b-2 border-border-subtle select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent-primary inline-block" />
            <span
              id="pixel-modal-title"
              className="font-pixel text-[11px] uppercase tracking-wider text-text-primary"
            >
              {title}
            </span>
          </div>
          <PixelIconButton
            label="Close modal"
            size="sm"
            variant="ghost"
            onClick={onClose}
          >
            <PixelIcon name="close" size={14} color="var(--color-text-secondary)" />
          </PixelIconButton>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto max-h-[80vh] font-pixel-ui text-text-primary text-px-sm">
          {children}
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

// ============================================================
// PixelToast — Retro System Notification Toast
// ============================================================

export interface PixelToastProps {
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  onDismiss: () => void;
  durationMs?: number;
}

export function PixelToast({
  message,
  type = 'info',
  onDismiss,
  durationMs = 3000,
}: PixelToastProps) {
  useEffect(() => {
    if (durationMs <= 0) return;
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onDismiss]);

  const borderColors = {
    info: 'border-t-accent-secondary text-accent-secondary',
    success: 'border-t-accent-green text-accent-green',
    warning: 'border-t-accent-warm text-accent-warm',
    error: 'border-t-accent-primary text-accent-primary',
  };

  const icons = {
    info: 'equalizer' as const,
    success: 'check' as const,
    warning: 'more' as const,
    error: 'close' as const,
  };

  return (
    <div
      className={cn(
        'fixed bottom-24 right-6 z-[120] p-3 min-w-[240px] max-w-[360px]',
        'bg-bg-elevated border border-border-subtle border-t-2 shadow-[4px_4px_0px_#0B0E18]',
        'flex items-center gap-3 font-pixel-ui text-px-sm',
        borderColors[type]
      )}
    >
      <PixelIcon name={icons[type]} size={16} color="currentColor" />
      <span className="flex-1 text-text-primary text-[11px] leading-relaxed">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-text-muted hover:text-text-primary p-1 cursor-pointer"
        aria-label="Dismiss toast"
      >
        <PixelIcon name="close" size={12} color="currentColor" />
      </button>
    </div>
  );
}
