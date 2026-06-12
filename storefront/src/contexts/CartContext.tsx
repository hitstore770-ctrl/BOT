"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { CartItem, Checklist } from "@/types";

/** localStorage key — versioned so the schema can evolve safely later. */
const STORAGE_KEY = "checklist-vault-cart-v1";

export interface CartContextValue {
  items: CartItem[];
  /** Total number of units across all line items. */
  count: number;
  /** Sum of price × quantity. */
  subtotal: number;
  /** Display currency for the cart total (derived from items). */
  currency: CartItem["currency"];
  addItem: (checklist: Checklist, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  /** Drawer UI state lives here so any component can open/close it. */
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

/** Safely parse the persisted cart, tolerating corrupt/legacy data. */
function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

/**
 * Cart provider with localStorage auto-save.
 *
 * Hydration strategy: we start empty (matching the server render), then load
 * from localStorage in an effect after mount. A `hydrated` ref prevents the
 * first persistence write from clobbering storage before the load completes.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const hydrated = useRef(false);

  // Load persisted cart once, on mount.
  useEffect(() => {
    setItems(readStoredCart());
    hydrated.current = true;
  }, []);

  // Auto-save: persist on every change, but only after the initial load.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full / unavailable (private mode) — fail silently.
    }
  }, [items]);

  const addItem = useCallback((checklist: Checklist, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === checklist.id);
      if (existing) {
        return prev.map((item) =>
          item.id === checklist.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...checklist, quantity }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.id !== id)
        : prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const { count, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.count += item.quantity;
        acc.subtotal += item.price * item.quantity;
        return acc;
      },
      { count: 0, subtotal: 0 },
    );
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      currency: items[0]?.currency ?? "USD",
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [
      items,
      count,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
