'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PixelIcon } from '@/components/common/PixelIcon';
import { PixelButton } from '@/components/common/PixelButton';
import { PixelVisualizer } from '@/components/common/PixelVisualizer';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleCallback } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [status, setStatus] = useState('AUTHENTICATING SPOTIFY SIGNAL...');

  useEffect(() => {
    const code = searchParams.get('code');
    const err = searchParams.get('error');

    const processAuth = async () => {
      if (err) {
        setErrorMsg(`Authorization cancelled or denied by user: ${err}`);
        return;
      }

      if (!code) {
        setErrorMsg('No authorization code returned from Spotify.');
        return;
      }
      try {
        setStatus('EXCHANGING PKCE SECURITY TOKENS...');
        await handleCallback(code);
        setStatus('CONNECTED! LOADING HI-FI SYSTEM...');
        setTimeout(() => {
          router.replace('/');
        }, 1000);
      } catch (e: unknown) {
        setErrorMsg(
          e instanceof Error
            ? e.message
            : 'Failed to complete Spotify authorization exchange.'
        );
      }
    };

    processAuth();
  }, [searchParams, handleCallback, router]);

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col items-center justify-center p-6 select-none">
      <div className="w-full max-w-md p-8 bg-bg-surface border-2 border-border-strong text-center shadow-[6px_6px_0px_#0B0E18]">
        {errorMsg ? (
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-accent-primary/10 border border-accent-primary text-accent-primary">
              <PixelIcon name="close" size={32} color="var(--color-accent-primary)" />
            </div>
            <h1 className="font-pixel text-[13px] text-accent-primary uppercase">
              AUTHENTICATION ERROR
            </h1>
            <p className="font-pixel-ui text-px-sm text-text-secondary leading-relaxed">
              {errorMsg}
            </p>
            <PixelButton
              variant="secondary"
              size="md"
              onClick={() => router.replace('/')}
              className="mt-2"
            >
              RETURN TO LOGIN
            </PixelButton>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <div className="p-3 bg-bg-elevated border border-border-strong">
              <PixelIcon name="spotify" size={32} color="var(--color-accent-primary)" />
            </div>

            <div>
              <h1 className="font-pixel text-[13px] text-text-primary mb-1">
                SPOTIFY OAUTH EXCHANGE
              </h1>
              <div className="font-mono text-[11px] text-accent-secondary animate-pixel-pulse">
                {status}
              </div>
            </div>

            <div className="h-12 flex items-end justify-center py-2">
              <PixelVisualizer isPlaying={true} barCount={16} height={36} />
            </div>

            <div className="text-[10px] font-pixel-ui text-text-muted">
              SECURE SHA-256 PKCE PROTOCOL IN PROGRESS...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-bg-primary flex items-center justify-center font-pixel text-accent-primary text-[11px]">
          INITIALIZING...
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
