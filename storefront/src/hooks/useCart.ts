"use client";

import { useContext } from "react";

import { CartContext, type CartContextValue } from "@/contexts/CartContext";

/**
 * Access the shopping cart. Must be used within <CartProvider> (wired up in
 * AppProviders), otherwise it throws — surfacing the mistake immediately rather
 * than silently returning empty data.
 */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>.");
  }
  return ctx;
}
