"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { PremiumButton } from "@/components/ui/PremiumButton";

// Shared easing + container/stagger config for the entrance choreography.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * High-impact hero with a subtle dotted-grid backdrop, a floating glass badge
 * and a staggered Framer Motion entrance.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-grid [background-size:28px_28px]" />
      <div className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[500px] w-[500px]
        -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container flex flex-col items-center gap-6 py-24 text-center md:py-36"
      >
        {/* Eyebrow badge */}
        <motion.span
          variants={item}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
        >
          <Sparkles className="h-4 w-4 text-accent" />
          Expert-crafted. Instantly downloadable.
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="max-w-4xl text-balance text-4xl font-bold leading-[1.1] tracking-tight
            text-gradient sm:text-6xl md:text-7xl"
        >
          Turn ambition into action.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={item}
          className="max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl"
        >
          Premium digital checklists built by operators who&apos;ve done the work — so you can
          launch faster, decide smarter, and never miss a step again.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/vault">
            <PremiumButton size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Explore The Vault
            </PremiumButton>
          </Link>
          <a href="#how-it-works">
            <PremiumButton size="lg" variant="ghost">
              See how it works
            </PremiumButton>
          </a>
        </motion.div>

        {/* Trust microcopy */}
        <motion.p variants={item} className="text-sm text-muted-foreground">
          Loved by 12,400+ founders, makers & teams worldwide.
        </motion.p>
      </motion.div>
    </section>
  );
}
