"use client";

import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "@/contexts/AuthContext";

/**
 * Access the authenticated user + auth actions. Must be used within
 * <AuthProvider> (wired up in AppProviders), otherwise it throws.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return ctx;
}
