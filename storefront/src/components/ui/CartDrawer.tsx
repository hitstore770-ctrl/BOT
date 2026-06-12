"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";

import { PremiumButton } from "@/components/ui/PremiumButton";
import { useCart } from "@/hooks/useCart";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { cn, formatPrice } from "@/lib/utils";

/**
 * Sleek right-edge cart drawer. Globally mounted (see AppProviders) and driven
 * entirely by CartContext's drawer state, so any component can open it.
 *
 * Accessibility: closes on Escape and backdrop click; dialog semantics applied.
 */
export function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    currency,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  useLockBodyScroll(isDrawerOpen);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const handleCheckout = () => {
    // TODO(payments): hand off to the WhatsApp payment bot / checkout API.
    console.log("Checkout init", { items, subtotal, currency });
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeDrawer}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="glass absolute right-0 top-0 flex h-full w-full max-w-md flex-col
              rounded-l-4xl border-y-0 border-r-0"
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {count}
                </span>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={closeDrawer}
                className="grid h-9 w-9 place-items-center rounded-full text-foreground/80
                  transition-colors hover:bg-muted focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-muted">
                  <ShoppingBag className="h-7 w-7 text-muted-foreground" />
                </span>
                <p className="font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Explore the vault and add a checklist to get started.
                </p>
                <PremiumButton variant="secondary" size="sm" onClick={closeDrawer} className="mt-2">
                  Continue browsing
                </PremiumButton>
              </div>
            ) : (
              <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-3 rounded-2xl border border-border bg-card/60 p-3"
                    >
                      {/* Thumb */}
                      <div
                        className={cn(
                          "h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br",
                          item.accent,
                        )}
                      />

                      {/* Info */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold">{item.title}</p>
                          <button
                            type="button"
                            aria-label={`Remove ${item.title}`}
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.category}</p>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          {/* Quantity stepper */}
                          <div className="flex items-center gap-1 rounded-full border border-border">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="grid h-7 w-7 place-items-center rounded-full text-foreground/80
                                transition-colors hover:bg-muted"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-5 text-center text-sm font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="grid h-7 w-7 place-items-center rounded-full text-foreground/80
                                transition-colors hover:bg-muted"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatPrice(item.price * item.quantity, item.currency)}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-2 text-xs text-muted-foreground underline-offset-4 transition-colors
                    hover:text-foreground hover:underline"
                >
                  Clear cart
                </button>
              </ul>
            )}

            {/* Footer / totals */}
            {items.length > 0 && (
              <footer className="border-t border-border px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-bold">{formatPrice(subtotal, currency)}</span>
                </div>
                <PremiumButton size="lg" className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </PremiumButton>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Taxes calculated at checkout · Instant digital delivery
                </p>
              </footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
