"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

// ============================================================
// PixelButton — Tactile retro pixel button component
// Square corners, stepped pixel shadow, press animation
// ============================================================

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-primary text-bg-primary border border-accent-primary hover:bg-accent-primary/80 active:translate-y-px shadow-[2px_2px_0px_rgba(11,14,24,0.8)]",
  secondary:
    "bg-bg-elevated text-text-primary border border-border-subtle hover:bg-bg-elevated/80 hover:border-border-strong active:translate-y-px shadow-[2px_2px_0px_rgba(11,14,24,0.8)]",
  ghost:
    "bg-transparent text-text-secondary border border-transparent hover:bg-bg-elevated hover:text-text-primary active:translate-y-px",
  danger:
    "bg-bg-elevated text-accent-primary border border-accent-primary hover:bg-accent-primary/10 active:translate-y-px",
  accent:
    "bg-transparent text-accent-secondary border border-accent-secondary hover:bg-accent-secondary/10 active:translate-y-px",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-[10px] gap-1",
  sm: "px-3 py-1.5 text-[11px] gap-1.5",
  md: "px-4 py-2 text-[12px] gap-2",
  lg: "px-6 py-3 text-[13px] gap-2",
};

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      active = false,
      loading = false,
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center",
          "font-pixel-ui uppercase tracking-wider",
          "rounded-none", // no border radius — pixel sharp
          "transition-none", // no smooth transitions — instant like real retro UI
          "focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-1",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
          "cursor-pointer select-none",
          variantStyles[variant],
          sizeStyles[size],
          active && "!border-accent-primary !text-accent-primary",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-1.5">
            <LoadingDots />
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

PixelButton.displayName = "PixelButton";

// ============================================================
// PixelIconButton — Icon-only circular/square icon button
// ============================================================

interface PixelIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // required for accessibility
  active?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "ghost" | "secondary" | "primary";
  children: React.ReactNode;
}

const iconButtonSizes: Record<string, string> = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-9 h-9",
  lg: "w-11 h-11",
};

const iconButtonVariants: Record<string, string> = {
  ghost: "bg-transparent hover:bg-bg-elevated text-text-secondary hover:text-text-primary",
  secondary: "bg-bg-elevated border border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary",
  primary: "bg-accent-primary/10 border border-accent-primary text-accent-primary hover:bg-accent-primary/20",
};

export function PixelIconButton({
  label,
  active = false,
  size = "md",
  variant = "ghost",
  children,
  className,
  disabled,
  ...props
}: PixelIconButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-none",
        "cursor-pointer select-none",
        "active:translate-y-px",
        "focus-visible:outline-2 focus-visible:outline-accent-primary",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "transition-colors duration-75",
        iconButtonSizes[size],
        iconButtonVariants[variant],
        active && "!text-accent-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================================
// Loading Dots — Pixel animated loading indicator
// ============================================================

function LoadingDots() {
  return (
    <span className="flex items-center gap-1" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 bg-current"
          style={{ animation: `pixelBlink 1s steps(1) ${i * 0.3}s infinite` }}
        />
      ))}
    </span>
  );
}
