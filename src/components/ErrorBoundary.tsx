"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[PixelFM Recovery] Caught unhandled error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleClearSession = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
    if (typeof document !== "undefined") {
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center min-h-screen p-6 bg-retro-grid"
          style={{ backgroundColor: "var(--color-void)" }}
        >
          <div
            className="card-pixel p-6 flex flex-col items-center gap-4 max-w-lg w-full text-center"
            style={{
              border: "2px solid var(--color-amber)",
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
            }}
          >
            <div
              className="font-pixel text-xs text-[var(--color-amber)]"
              style={{ textShadow: "0 0 8px rgba(245, 158, 11, 0.6)" }}
            >
              ⚠ STATION RECOVERY SYSTEM
            </div>

            <div
              className="font-mono-retro text-xs p-3 w-full text-left"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                border: "1px solid var(--color-border)",
                color: "#FCA5A5",
                wordBreak: "break-word",
              }}
            >
              {this.state.error?.message || "An unexpected error occurred during audio session."}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={this.handleReset}
                className="btn-pixel btn-pixel-phosphor"
                style={{ padding: "8px 16px", fontSize: 8 }}
              >
                [ ↺ RELOAD STATION ]
              </button>
              <button
                onClick={this.handleClearSession}
                className="btn-pixel"
                style={{ padding: "8px 16px", fontSize: 8 }}
              >
                [ RESET SESSION ]
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
