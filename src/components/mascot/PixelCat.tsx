'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================
// PixelCat — Interactive 16-Bit Pixel Cat Mascot
// States:
// - 'sleeping': Default state. Curled up, soft rhythmic breathing,
//               floating green pixel 'z z z' bubbles.
// - 'waking': Mouse hover initiates stretch, open glowing green eyes,
//             cute yawn (>O<).
// - 'sitting': Transitions to sitting upright, alert perked ears,
//              tail gently swishing, watching the user.
// - 'purring': Triggered by clicking/petting the cat. Content smile (^w^),
//              floating green pixel hearts.
// ============================================================

export type CatState = 'sleeping' | 'waking' | 'sitting' | 'purring';

interface PixelCatProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showZzz?: boolean;
}

const sizeDimensions = {
  sm: { width: 56, height: 36, scale: 1 },
  md: { width: 84, height: 54, scale: 1.5 },
  lg: { width: 140, height: 90, scale: 2.5 },
};

export function PixelCat({ size = 'md', className, showZzz = true }: PixelCatProps) {
  const [state, setState] = useState<CatState>('sleeping');
  const [showHearts, setShowHearts] = useState(false);
  const wakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sleepTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dim = sizeDimensions[size];

  // Mouse enter: Wake up -> Yawn -> Sit
  const handleMouseEnter = () => {
    if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
    if (state === 'sleeping') {
      setState('waking');
      wakeTimeoutRef.current = setTimeout(() => {
        setState('sitting');
      }, 550);
    }
  };

  // Mouse leave: Wait a moment -> Return to sleep
  const handleMouseLeave = () => {
    if (wakeTimeoutRef.current) clearTimeout(wakeTimeoutRef.current);
    sleepTimeoutRef.current = setTimeout(() => {
      setState('sleeping');
    }, 800);
  };

  // Click: Pet reaction -> Purr with hearts
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setState('purring');
    setShowHearts(true);
    setTimeout(() => {
      setShowHearts(false);
      setState('sitting');
    }, 1200);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={cn(
        'relative inline-block cursor-pointer select-none transition-transform duration-150 active:scale-95',
        className
      )}
      style={{ width: dim.width, height: dim.height }}
      title="Pet me! (Click to pet)"
    >
      {/* ─── Floating 'z z z' particles when sleeping ─── */}
      {showZzz && state === 'sleeping' && (
        <div className="absolute -top-3 right-1 pointer-events-none flex flex-col items-end">
          <span
            className="font-pixel text-[8px] text-accent-primary animate-float-z select-none font-bold"
            style={{ animationDelay: '0s' }}
          >
            z
          </span>
          <span
            className="font-pixel text-[10px] text-accent-primary animate-float-z select-none font-bold -mr-1 -mt-1"
            style={{ animationDelay: '0.6s' }}
          >
            z
          </span>
          <span
            className="font-pixel text-[12px] text-accent-primary animate-float-z select-none font-bold -mr-2 -mt-1"
            style={{ animationDelay: '1.2s' }}
          >
            Z
          </span>
        </div>
      )}

      {/* ─── Floating Hearts when purring / petted ─────── */}
      {showHearts && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none flex gap-1 animate-float-heart">
          <span className="text-[12px] text-accent-primary font-bold">♥</span>
          <span className="text-[10px] text-accent-secondary font-bold -mt-2">♥</span>
        </div>
      )}

      {/* ─── SVG Pixel Art Engine ──────────────────────── */}
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 56 36"
        fill="none"
        shapeRendering="crispEdges"
        className={cn(
          'w-full h-full transition-all duration-200',
          state === 'sleeping' && 'animate-cat-breathe'
        )}
      >
        {/* ========================================================
            STATE 1: SLEEPING (Curled up, eyes closed, tail tucked)
            ======================================================== */}
        {state === 'sleeping' && (
          <g id="cat-sleeping">
            {/* Outer Silhouette / Dark Body */}
            <rect x="8" y="16" width="38" height="16" fill="#0C141C" />
            <rect x="12" y="12" width="32" height="6" fill="#0C141C" />
            <rect x="6" y="20" width="42" height="10" fill="#0C141C" />

            {/* Glowing Green Phosphor Outline */}
            <rect x="12" y="11" width="30" height="1" fill="#22C55E" opacity="0.8" />
            <rect x="8" y="15" width="4" height="1" fill="#22C55E" opacity="0.8" />
            <rect x="42" y="15" width="4" height="1" fill="#22C55E" opacity="0.8" />
            <rect x="5" y="20" width="1" height="10" fill="#22C55E" opacity="0.7" />
            <rect x="48" y="20" width="1" height="10" fill="#22C55E" opacity="0.7" />
            <rect x="6" y="30" width="42" height="1" fill="#22C55E" opacity="0.5" />

            {/* Fur Highlights */}
            <rect x="16" y="14" width="22" height="3" fill="#152433" />
            <rect x="12" y="17" width="28" height="8" fill="#111D2A" />

            {/* Head (Curled on the right) */}
            <rect x="30" y="13" width="16" height="14" fill="#0E1822" />
            
            {/* Sleeping Ears */}
            <polygon points="32,13 35,9 38,13" fill="#0E1822" />
            <polygon points="41,13 44,9 47,13" fill="#0E1822" />
            <polygon points="34,13 35,10 36,13" fill="#1C3042" />
            <polygon points="43,13 44,10 45,13" fill="#1C3042" />

            {/* Sleeping Eyes (Closed curved slits -_-, happy glow) */}
            <rect x="34" y="18" width="4" height="1" fill="#22C55E" />
            <rect x="33" y="19" width="1" height="1" fill="#22C55E" />
            <rect x="38" y="19" width="1" height="1" fill="#22C55E" />

            <rect x="41" y="18" width="4" height="1" fill="#22C55E" />
            <rect x="40" y="19" width="1" height="1" fill="#22C55E" />
            <rect x="45" y="19" width="1" height="1" fill="#22C55E" />

            {/* Cute Little Pink/Green Nose & Mouth */}
            <rect x="39" y="21" width="1" height="1" fill="#F472B6" />
            <rect x="38" y="22" width="1" height="1" fill="#22C55E" opacity="0.8" />
            <rect x="40" y="22" width="1" height="1" fill="#22C55E" opacity="0.8" />

            {/* Paws tucked in */}
            <rect x="26" y="24" width="6" height="4" fill="#152433" />
            <rect x="25" y="26" width="1" height="2" fill="#22C55E" opacity="0.5" />
            <rect x="31" y="26" width="1" height="2" fill="#22C55E" opacity="0.5" />

            {/* Curled Tail (left side) */}
            <rect x="6" y="23" width="5" height="4" fill="#0E1822" />
            <rect x="5" y="21" width="4" height="3" fill="#111D2A" />
            <rect x="6" y="20" width="3" height="2" fill="#22C55E" opacity="0.7" />
          </g>
        )}

        {/* ========================================================
            STATE 2: WAKING / YAWNING (Arched back, open mouth)
            ======================================================== */}
        {state === 'waking' && (
          <g id="cat-waking">
            {/* Arched Back Body */}
            <rect x="10" y="11" width="32" height="18" fill="#0C141C" />
            <rect x="14" y="8" width="22" height="5" fill="#0C141C" />
            
            {/* Green Outline */}
            <rect x="14" y="7" width="22" height="1" fill="#22C55E" opacity="0.9" />
            <rect x="9" y="12" width="1" height="16" fill="#22C55E" opacity="0.8" />
            <rect x="42" y="12" width="1" height="16" fill="#22C55E" opacity="0.8" />
            <rect x="10" y="29" width="34" height="1" fill="#22C55E" opacity="0.6" />

            {/* Stretched Forepaws */}
            <rect x="34" y="23" width="8" height="6" fill="#111D2A" />
            <rect x="42" y="26" width="4" height="3" fill="#152433" />

            {/* Head Tilted Back in Yawn */}
            <rect x="30" y="7" width="16" height="16" fill="#0E1822" />
            
            {/* Perked Ears */}
            <polygon points="31,7 34,2 37,7" fill="#0E1822" />
            <polygon points="41,7 44,2 47,7" fill="#0E1822" />
            <polygon points="33,7 34,3 35,7" fill="#F472B6" />
            <polygon points="43,7 44,3 45,7" fill="#F472B6" />

            {/* Open Eyes blinking sleepily */}
            <rect x="33" y="11" width="3" height="3" fill="#22C55E" />
            <rect x="42" y="11" width="3" height="3" fill="#22C55E" />
            <rect x="34" y="12" width="1" height="2" fill="#090D14" />
            <rect x="43" y="12" width="1" height="2" fill="#090D14" />

            {/* Yawning Mouth (>O<) */}
            <rect x="37" y="16" width="4" height="4" fill="#090D14" />
            <rect x="38" y="17" width="2" height="3" fill="#F472B6" />
            <rect x="37" y="15" width="4" height="1" fill="#F472B6" />

            {/* Tail Arching Upwards */}
            <rect x="6" y="16" width="4" height="8" fill="#0E1822" />
            <rect x="4" y="11" width="4" height="6" fill="#0E1822" />
            <rect x="4" y="10" width="3" height="2" fill="#22C55E" />
          </g>
        )}

        {/* ========================================================
            STATE 3: SITTING (Alert, watching cursor, tail wagging)
            ======================================================== */}
        {(state === 'sitting' || state === 'purring') && (
          <g id="cat-sitting">
            {/* Sitting Torso */}
            <rect x="14" y="12" width="24" height="18" fill="#0C141C" />
            <rect x="18" y="9" width="16" height="5" fill="#0C141C" />
            <rect x="12" y="22" width="28" height="8" fill="#0E1822" />

            {/* Glowing Green Outline */}
            <rect x="17" y="8" width="18" height="1" fill="#22C55E" opacity="0.9" />
            <rect x="13" y="12" width="1" height="18" fill="#22C55E" opacity="0.8" />
            <rect x="39" y="12" width="1" height="18" fill="#22C55E" opacity="0.8" />
            <rect x="12" y="30" width="28" height="1" fill="#22C55E" opacity="0.6" />

            {/* Front Paws Sitting Neat */}
            <rect x="20" y="24" width="4" height="6" fill="#152433" />
            <rect x="28" y="24" width="4" height="6" fill="#152433" />
            <rect x="20" y="29" width="4" height="1" fill="#22C55E" opacity="0.7" />
            <rect x="28" y="29" width="4" height="1" fill="#22C55E" opacity="0.7" />

            {/* Upright Head */}
            <rect x="17" y="4" width="18" height="14" fill="#0E1822" />

            {/* Tall Pointy Ears */}
            <polygon points="17,5 20,0 24,5" fill="#0E1822" />
            <polygon points="28,5 32,0 35,5" fill="#0E1822" />
            <polygon points="19,5 20,1 22,5" fill="#F472B6" />
            <polygon points="30,5 32,1 33,5" fill="#F472B6" />

            {/* Eyes */}
            {state === 'purring' ? (
              /* Happy squinting purr eyes (^w^) */
              <>
                <rect x="20" y="8" width="4" height="1" fill="#22C55E" />
                <rect x="28" y="8" width="4" height="1" fill="#22C55E" />
                <rect x="19" y="9" width="1" height="1" fill="#22C55E" />
                <rect x="24" y="9" width="1" height="1" fill="#22C55E" />
                <rect x="27" y="9" width="1" height="1" fill="#22C55E" />
                <rect x="32" y="9" width="1" height="1" fill="#22C55E" />
              </>
            ) : (
              /* Wide Glowing Green Eyes looking forward */
              <>
                <rect x="20" y="8" width="4" height="4" fill="#22C55E" />
                <rect x="28" y="8" width="4" height="4" fill="#22C55E" />
                {/* Pupils */}
                <rect x="22" y="8" width="1" height="4" fill="#090D14" />
                <rect x="30" y="8" width="1" height="4" fill="#090D14" />
                {/* Eye Sparkle */}
                <rect x="21" y="8" width="1" height="1" fill="#FFFFFF" />
                <rect x="29" y="8" width="1" height="1" fill="#FFFFFF" />
              </>
            )}

            {/* Nose & Mouth */}
            <rect x="25.5" y="12" width="1" height="1" fill="#F472B6" />
            <rect x="24.5" y="13" width="1" height="1" fill="#22C55E" opacity="0.8" />
            <rect x="26.5" y="13" width="1" height="1" fill="#22C55E" opacity="0.8" />

            {/* Whiskers */}
            <line x1="13" y1="12" x2="19" y2="12" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
            <line x1="14" y1="14" x2="19" y2="13" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
            <line x1="33" y1="12" x2="39" y2="12" stroke="#22C55E" strokeWidth="1" opacity="0.6" />
            <line x1="33" y1="13" x2="38" y2="14" stroke="#22C55E" strokeWidth="1" opacity="0.6" />

            {/* Animated Swishing Tail (Right side) */}
            <g className="origin-bottom-left animate-cat-tail">
              <path
                d="M 37 26 Q 44 24 46 17 Q 48 12 45 10"
                stroke="#0E1822"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M 37 26 Q 44 24 46 17 Q 48 12 45 10"
                stroke="#22C55E"
                strokeWidth="1"
                fill="none"
                opacity="0.8"
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
