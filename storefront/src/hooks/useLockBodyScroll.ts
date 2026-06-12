"use client";

import { useEffect } from "react";

/**
 * Locks `<body>` scroll while an overlay (modal/drawer) is open, restoring the
 * previous value on close. Prevents the background from scrolling behind glass
 * surfaces — a small but important premium detail.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
