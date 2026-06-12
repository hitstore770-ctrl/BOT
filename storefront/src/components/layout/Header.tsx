"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, Vault, X } from "lucide-react";
import { useState } from "react";

import { PremiumButton } from "@/components/ui/PremiumButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navLinks, siteConfig } from "@/config/site";
import { useCart } from "@/hooks/useCart";

/**
 * Sticky, glassmorphic site header. Collapses into an animated sheet on mobile.
 *
 * The cart badge count and drawer trigger are driven by the cart context. The
 * "User Portal" link will be wired to Auth once Firebase is connected.
 */
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count: cartCount, openDrawer } = useCart();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="glass border-x-0 border-t-0">
        <nav className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Vault className="h-4.5 w-4.5" />
            </span>
            <span className="text-base">{siteConfig.name}</span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground
                    transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <ThemeToggle />

            {/* Cart / User Portal */}
            <button
              type="button"
              aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
              onClick={openDrawer}
              className="relative grid h-10 w-10 place-items-center rounded-full text-foreground/80
                transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-ring"
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center
                      rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <div className="ml-1 hidden sm:block">
              <PremiumButton size="sm">Sign In</PremiumButton>
            </div>

            {/* Mobile menu trigger */}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-foreground/80
                transition-colors hover:bg-muted md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="glass overflow-hidden border-x-0 border-t-0 md:hidden"
          >
            <ul className="container flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground
                      transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="px-2 pt-2">
                <PremiumButton size="md" className="w-full">
                  Sign In
                </PremiumButton>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
