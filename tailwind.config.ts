import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // PIXELIFY Design System — Core Palette
        "bg-primary": "#0B0E18",
        "bg-secondary": "#111624",
        "bg-surface": "#171C2D",
        "bg-elevated": "#20263B",
        "border-subtle": "#2B324B",
        "border-strong": "#4B5275",
        "text-primary": "#F0EAF7",
        "text-secondary": "#A8A8C0",
        "text-muted": "#676D8A",
        "accent-primary": "#E98A9A",
        "accent-secondary": "#B7A7E5",
        "accent-warm": "#F0C58B",
        // Extra utility
        "accent-cyan": "#7ED6C8",
        "accent-green": "#7EC87E",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        "pixel-ui": ['"Silkscreen"', '"VT323"', "monospace"],
        "pixel-vt": ['"VT323"', "monospace"],
        mono: ['"Space Mono"', '"JetBrains Mono"', "monospace"],
      },
      fontSize: {
        "px-xs": ["10px", { lineHeight: "1.4" }],
        "px-sm": ["12px", { lineHeight: "1.4" }],
        "px-md": ["14px", { lineHeight: "1.4" }],
        "px-lg": ["18px", { lineHeight: "1.2" }],
        "px-xl": ["24px", { lineHeight: "1.1" }],
        "px-2xl": ["32px", { lineHeight: "1.1" }],
      },
      spacing: {
        "px-1": "4px",
        "px-2": "8px",
        "px-3": "12px",
        "px-4": "16px",
        "px-5": "20px",
        "px-6": "24px",
        "px-8": "32px",
        "px-12": "48px",
      },
      borderRadius: {
        none: "0px",
        px: "2px",
      },
      borderWidth: {
        px: "1px",
        "px-2": "2px",
      },
      animation: {
        "pixel-pulse": "pixelPulse 1s steps(2) infinite",
        "pixel-blink": "pixelBlink 1s steps(1) infinite",
        "eq-bar-1": "eqBar1 0.8s steps(4) infinite alternate",
        "eq-bar-2": "eqBar2 0.6s steps(4) infinite alternate",
        "eq-bar-3": "eqBar3 1.0s steps(4) infinite alternate",
        "eq-bar-4": "eqBar4 0.7s steps(4) infinite alternate",
        "scroll-x": "scrollX 20s linear infinite",
        "crt-flicker": "crtFlicker 0.15s infinite",
        "pixel-spin": "pixelSpin 1s steps(8) infinite",
        "float-note": "floatNote 3s steps(6) infinite",
        "scan-line": "scanLine 8s linear infinite",
      },
      keyframes: {
        pixelPulse: {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.4" },
          "100%": { opacity: "1" },
        },
        pixelBlink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        eqBar1: {
          "0%": { height: "4px" },
          "100%": { height: "20px" },
        },
        eqBar2: {
          "0%": { height: "8px" },
          "100%": { height: "28px" },
        },
        eqBar3: {
          "0%": { height: "12px" },
          "100%": { height: "16px" },
        },
        eqBar4: {
          "0%": { height: "6px" },
          "100%": { height: "24px" },
        },
        scrollX: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        crtFlicker: {
          "0%": { opacity: "0.97" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.98" },
        },
        pixelSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        floatNote: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
          "100%": { transform: "translateY(0px)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      boxShadow: {
        pixel: "4px 4px 0px #0B0E18",
        "pixel-accent": "4px 4px 0px #E98A9A",
        "pixel-inset": "inset 2px 2px 0px #2B324B, inset -1px -1px 0px #0B0E18",
        "pixel-glow": "0 0 8px 2px rgba(233, 138, 154, 0.3)",
        "pixel-glow-lavender": "0 0 8px 2px rgba(183, 167, 229, 0.3)",
      },
      backgroundImage: {
        "scanlines":
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
        "pixel-grid":
          "linear-gradient(rgba(43,50,75,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(43,50,75,0.3) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
