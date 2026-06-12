"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ChecklistCard } from "@/components/ui/ChecklistCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { featuredChecklists } from "@/data/checklists";

/**
 * "Featured Vault" — the best-selling checklists grid.
 *
 * Data is mock for now (see src/data/checklists.ts). Cards handle their own
 * staggered entrance animation via their `index` prop.
 */
export function FeaturedVault() {
  return (
    <section id="vault" className="scroll-mt-20 py-20 md:py-28">
      <div className="container">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">
            The Vault
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Best-selling checklists
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            Hand-picked, battle-tested playbooks our community reaches for again and again.
          </p>
        </motion.div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredChecklists.map((checklist, index) => (
            <ChecklistCard key={checklist.id} checklist={checklist} index={index} />
          ))}
        </div>

        {/* Link to the full catalog */}
        <div className="mt-12 flex justify-center">
          <Link href="/vault">
            <PremiumButton variant="secondary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Browse the full vault
            </PremiumButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
