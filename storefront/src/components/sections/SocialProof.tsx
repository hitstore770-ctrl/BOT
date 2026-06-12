"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { socialProofStats, testimonials } from "@/data/checklists";
import { formatCompact } from "@/lib/utils";

const stats = [
  { label: "Professionals trust us", value: `${formatCompact(socialProofStats.professionals)}+` },
  { label: "Checklists sold", value: `${formatCompact(socialProofStats.checklistsSold)}+` },
  { label: "Average rating", value: socialProofStats.averageRating.toFixed(1) },
  { label: "Countries", value: `${socialProofStats.countries}` },
];

/**
 * Minimalist trust banner: headline stats strip + a row of short review
 * snippets. Mock data lives in src/data/checklists.ts.
 */
export function SocialProof() {
  return (
    <section id="reviews" className="scroll-mt-20 py-20 md:py-28">
      <div className="container">
        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="glass grid grid-cols-2 gap-6 rounded-4xl px-8 py-10 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold tracking-tight sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Review snippets */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6"
            >
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-balance text-sm leading-relaxed text-foreground/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-auto">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
