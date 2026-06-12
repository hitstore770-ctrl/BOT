"use client";

import { motion } from "framer-motion";
import { Mic, Search, X } from "lucide-react";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";

interface SearchFilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  resultCount: number;
}

/**
 * Sticky glassmorphism search + filter bar.
 *
 * - Fuzzy search is handled by the parent (this just owns the input).
 * - Voice search uses the Web Speech API via useSpeechRecognition and hides the
 *   mic entirely when the browser doesn't support it.
 * - The active category chip is highlighted with a shared-layout pill that
 *   slides between chips (Framer Motion `layoutId`).
 */
export function SearchFilterBar({
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
  resultCount,
}: SearchFilterBarProps) {
  const { isSupported, isListening, start, stop } = useSpeechRecognition({
    onResult: onQueryChange,
  });

  return (
    <div className="sticky top-16 z-40 -mx-4 px-4 py-4 sm:-mx-6 sm:px-6">
      <div className="glass rounded-3xl p-3 sm:p-4">
        {/* Search input */}
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search the vault…"
            aria-label="Search checklists"
            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground
              [&::-webkit-search-cancel-button]:hidden"
          />

          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onQueryChange("")}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground
                transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Voice search — only rendered when supported. */}
          {isSupported && (
            <button
              type="button"
              aria-label={isListening ? "Stop voice search" : "Search by voice"}
              aria-pressed={isListening}
              onClick={() => (isListening ? stop() : start())}
              className={cn(
                "relative grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
                isListening
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {isListening && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-accent/40"
                  animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <Mic className="relative h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {/* Category chips + result count */}
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
            {categories.map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryChange(category)}
                  className={cn(
                    "relative shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-category-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>

          <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
            {resultCount} result{resultCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
