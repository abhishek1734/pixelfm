"use client";

import React from "react";
import { NavPage } from "@/types/music";
import { PixelIcon } from "@/components/common/PixelIcon";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

const NAV_ITEMS = [
  { page: "home" as NavPage, icon: "home" as const, label: "Home" },
  { page: "search" as NavPage, icon: "search" as const, label: "Search" },
  { page: "library" as NavPage, icon: "library" as const, label: "Library" },
  { page: "liked" as NavPage, icon: "liked" as const, label: "Liked" },
  { page: "settings" as NavPage, icon: "settings" as const, label: "Settings" },
] as const;

export function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  const isActive = (page: NavPage) => {
    if (typeof currentPage === "object" || typeof page === "object") return false;
    return currentPage === page;
  };

  return (
    <nav
      className={cn(
        "fixed bottom-[80px] left-0 right-0 z-40",
        "bg-bg-secondary border-t border-border-subtle",
        "flex items-center",
        "md:hidden"
      )}
      aria-label="Mobile navigation"
      style={{ height: "56px" }}
    >
      {NAV_ITEMS.map(({ page, icon, label }) => {
        const active = isActive(page);
        return (
          <button
            key={label}
            onClick={() => onNavigate(page)}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 h-full",
              "cursor-pointer select-none",
              "transition-colors duration-75",
              active
                ? "text-accent-primary"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            <PixelIcon
              name={icon}
              size={16}
              color={active ? "var(--color-accent-primary)" : "currentColor"}
            />
            <span
              className={cn(
                "text-[8px] font-pixel-ui uppercase tracking-wider",
                active ? "text-accent-primary" : "text-text-muted"
              )}
            >
              {label}
            </span>
            {active && (
              <span
                className="absolute bottom-0 w-8 h-[2px] bg-accent-primary"
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
