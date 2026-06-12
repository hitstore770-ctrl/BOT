"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "./ThemeProvider";

/**
 * Central composition point for all client-side context providers.
 *
 * As the app grows, nest future providers here (in order):
 *   <ThemeProvider>
 *     <AuthProvider>      // Firebase Auth session
 *       <CartProvider>    // shopping cart state
 *         {children}
 *       </CartProvider>
 *     </AuthProvider>
 *   </ThemeProvider>
 *
 * Keeping this in one file stops `layout.tsx` from turning into a provider
 * pyramid and keeps the server component boundary clean.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
