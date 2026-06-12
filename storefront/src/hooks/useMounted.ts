"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` only after the component has mounted on the client.
 *
 * Useful for theme-aware UI (e.g. the dark-mode toggle) to avoid hydration
 * mismatches: the server has no concept of the resolved theme, so we render a
 * stable placeholder until the client takes over.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
