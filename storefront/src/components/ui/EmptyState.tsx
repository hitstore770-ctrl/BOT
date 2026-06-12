"use client";

import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

import { PremiumButton } from "@/components/ui/PremiumButton";

interface EmptyStateProps {
  /** The active query, shown in the message when present. */
  query?: string;
  onClear: () => void;
}

/**
 * Glassmorphism "no results" state with a one-tap "Clear Filters" action.
 */
export function EmptyState({ query, onClear }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass mx-auto mt-12 flex max-w-md flex-col items-center gap-4 rounded-4xl
        px-8 py-14 text-center"
    >
      <span className="grid h-16 w-16 place-items-center rounded-full bg-muted">
        <SearchX className="h-7 w-7 text-muted-foreground" />
      </span>
      <h3 className="text-xl font-semibold">No results found</h3>
      <p className="text-balance text-sm text-muted-foreground">
        We couldn&apos;t find any checklists
        {query ? (
          <>
            {" "}
            for <span className="font-medium text-foreground">“{query}”</span>
          </>
        ) : null}
        . Try a different search or clear your filters.
      </p>
      <PremiumButton variant="secondary" onClick={onClear} className="mt-2">
        Clear Filters
      </PremiumButton>
    </motion.div>
  );
}
