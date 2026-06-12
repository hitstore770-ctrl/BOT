"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { ChecklistCard } from "@/components/ui/ChecklistCard";
import { ChecklistCardSkeleton } from "@/components/ui/ChecklistCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { getChecklists } from "@/lib/firestore/checklists";
import { fuzzyFilter } from "@/lib/fuzzy";
import type { Checklist } from "@/types";

const SKELETON_COUNT = 8;

/** Build the searchable text for a checklist (title + tagline + category). */
const searchableText = (checklist: Checklist) =>
  `${checklist.title} ${checklist.tagline} ${checklist.category}`;

/**
 * The Vault — full catalog browser with skeleton loading, fuzzy + voice search,
 * category filters, and Framer Motion layout shuffling.
 *
 * Data is fetched from Firestore (with a graceful seed fallback); skeleton
 * cards show while the real fetch is in flight.
 */
export function VaultExplorer() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch the live catalog on mount.
  useEffect(() => {
    let active = true;
    getChecklists()
      .then((data) => {
        if (active) setChecklists(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // "All" + every distinct category present in the fetched catalog.
  const categories = useMemo<string[]>(
    () => ["All", ...Array.from(new Set(checklists.map((checklist) => checklist.category)))],
    [checklists],
  );

  const results = useMemo(() => {
    const byCategory =
      activeCategory === "All"
        ? checklists
        : checklists.filter((checklist) => checklist.category === activeCategory);
    return fuzzyFilter(byCategory, query, searchableText);
  }, [checklists, query, activeCategory]);

  const clearFilters = () => {
    setQuery("");
    setActiveCategory("All");
  };

  return (
    <section className="container py-12 md:py-16">
      {/* Heading */}
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-accent">
          The Vault
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
          Every checklist, one place
        </h1>
        <p className="mt-4 text-balance text-muted-foreground">
          Search, filter, and find the exact playbook for whatever you&apos;re building next.
        </p>
      </div>

      {/* Sticky search + filters */}
      <SearchFilterBar
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        resultCount={results.length}
      />

      {/* Grid / states */}
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <ChecklistCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState query={query} onClear={clearFilters} />
      ) : (
        <motion.div
          layout
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {results.map((checklist, index) => (
              <motion.div
                key={checklist.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChecklistCard checklist={checklist} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
