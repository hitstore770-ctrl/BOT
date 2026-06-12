"use client";

import type { ReactNode } from "react";

import { CartDrawer } from "@/components/ui/CartDrawer";
import { CartProvider } from "@/contexts/CartContext";

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
 *
 * CartDrawer is mounted once here (a global overlay) so it can be opened from
 * anywhere via the cart context without duplicating it per page.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </ThemeProvider>
  );
}
