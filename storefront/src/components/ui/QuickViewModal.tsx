"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag, Star, X } from "lucide-react";
import { useCallback, useEffect } from "react";

import { PremiumButton } from "@/components/ui/PremiumButton";
import { useCart } from "@/hooks/useCart";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn, formatPrice } from "@/lib/utils";
import type { Checklist } from "@/types";

interface QuickViewModalProps {
  checklist: Checklist | null;
  isOpen: boolean;
  onClose: () => void;
}

/** A few mock "what's inside" bullets — replace with real data from Firestore. */
const SAMPLE_HIGHLIGHTS = [
  "Step-by-step, no-fluff action items",
  "Lifetime free updates",
  "Notion, PDF & Markdown formats",
  "30-day money-back guarantee",
];

/**
 * Glassmorphism Quick View modal.
 *
 * Accessibility: closes on Escape and on backdrop click, traps focus loosely
 * via an autofocused close button, and exposes dialog semantics. Framer Motion
 * drives the fade/scale enter+exit through AnimatePresence.
 */
export function QuickViewModal({ checklist, isOpen, onClose }: QuickViewModalProps) {
  const { addItem, openDrawer } = useCart();

  useLockBodyScroll(isOpen);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleAddToCart = useCallback(() => {
    if (!checklist) return;
    addItem(checklist);
    onClose();
    openDrawer();
  }, [checklist, addItem, onClose, openDrawer]);

  return (
    <AnimatePresence>
      {isOpen && checklist && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close quick view"
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${checklist.title} — quick view`}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="glass relative z-10 grid w-full max-w-3xl overflow-hidden rounded-4xl
              md:grid-cols-2"
          >
            {/* Close button */}
            <button
              type="button"
              autoFocus
              aria-label="Close"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full
                bg-black/10 text-foreground backdrop-blur-md transition-colors hover:bg-black/20
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                dark:bg-white/10 dark:hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Visual / icon placeholder */}
            <div
              className={cn(
                "relative flex min-h-[220px] items-center justify-center bg-gradient-to-br p-8",
                checklist.accent,
              )}
            >
              <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />
              <span className="relative grid h-24 w-24 place-items-center rounded-3xl bg-white/20
                text-white backdrop-blur-md">
                <Check className="h-12 w-12" strokeWidth={2.5} />
              </span>
              {checklist.isBestSeller && (
                <span className="absolute left-5 top-5 rounded-full bg-black/25 px-3 py-1 text-xs
                  font-medium text-white backdrop-blur-md">
                  Best Seller
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4 p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {checklist.category}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  {checklist.rating.toFixed(1)}
                  <span className="text-xs">({checklist.reviewCount})</span>
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-balance">
                {checklist.title}
              </h2>
              <p className="text-sm text-muted-foreground">{checklist.tagline}</p>

              <ul className="flex flex-col gap-2">
                {SAMPLE_HIGHLIGHTS.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {formatPrice(checklist.price, checklist.currency)}
                  </span>
                  {checklist.compareAtPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(checklist.compareAtPrice, checklist.currency)}
                    </span>
                  )}
                </div>
                <PremiumButton
                  onClick={handleAddToCart}
                  leftIcon={<ShoppingBag className="h-4 w-4" />}
                >
                  Add to Cart
                </PremiumButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
