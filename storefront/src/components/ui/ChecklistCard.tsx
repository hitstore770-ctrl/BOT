"use client";

import { motion } from "framer-motion";
import { Check, Eye, Star } from "lucide-react";
import { useState } from "react";

import { PremiumButton } from "@/components/ui/PremiumButton";
import { QuickViewModal } from "@/components/ui/QuickViewModal";
import { useCart } from "@/hooks/useCart";
import { cn, formatPrice } from "@/lib/utils";
import type { Checklist } from "@/types";

interface ChecklistCardProps {
  checklist: Checklist;
  /** Index within a grid — used to stagger the entrance animation. */
  index?: number;
}

/**
 * Premium product card for a single checklist.
 *
 * Hover behaviour: the whole card lifts and the accent header reveals a soft
 * glow, while the "Quick View" affordance fades in. `group` is used so child
 * elements can react to the card's hover state without extra JS.
 *
 * "Quick View" opens the glassmorphism modal; "Add to Cart" pushes into the
 * cart context and opens the drawer for instant feedback.
 */
export function ChecklistCard({ checklist, index = 0 }: ChecklistCardProps) {
  const { title, tagline, category, price, compareAtPrice, currency, itemCount, rating, accent } =
    checklist;
  const { addItem, openDrawer } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleAddToCart = () => {
    addItem(checklist);
    openDrawer();
  };

  return (
    <>
      <QuickViewModal
        checklist={checklist}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border
        bg-card text-card-foreground shadow-sm transition-shadow duration-300
        hover:shadow-glass dark:hover:shadow-glass-dark"
    >
      {/* Accent header / placeholder artwork (swap for <Image> when imageUrl exists). */}
      <div className={cn("relative h-40 overflow-hidden bg-gradient-to-br", accent)}>
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />

        {checklist.isBestSeller && (
          <span className="absolute left-4 top-4 rounded-full bg-black/25 px-3 py-1 text-xs
            font-medium text-white backdrop-blur-md">
            Best Seller
          </span>
        )}

        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/25
          px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          <Star className="h-3 w-3 fill-current" />
          {rating.toFixed(1)}
        </span>

        {/* Quick View — revealed on hover. */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0
          transition-opacity duration-300 group-hover:opacity-100">
          <PremiumButton
            size="sm"
            variant="secondary"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={() => setQuickViewOpen(true)}
          >
            Quick View
          </PremiumButton>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-accent">
            {category}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5" />
            {itemCount} items
          </span>
        </div>

        <h3 className="text-lg font-semibold leading-snug text-balance">{title}</h3>
        <p className="text-sm text-muted-foreground">{tagline}</p>

        {/* Price + CTA pinned to the bottom. */}
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold">{formatPrice(price, currency)}</span>
            {compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(compareAtPrice, currency)}
              </span>
            )}
          </div>
          <PremiumButton size="sm" variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </PremiumButton>
        </div>
      </div>
    </motion.article>
    </>
  );
}
