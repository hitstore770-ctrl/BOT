/**
 * Shared domain types for the storefront.
 *
 * These mirror the shape we expect from Firestore once the backend is wired
 * up, so swapping mock data for live data later requires no component changes.
 */

export type ChecklistCategory =
  | "Productivity"
  | "Business"
  | "Finance"
  | "Health"
  | "Marketing"
  | "Lifestyle";

export interface Checklist {
  /** Firestore document id (stable, used for routing + cart keys). */
  id: string;
  /** URL-safe identifier, e.g. "ultimate-startup-launch". */
  slug: string;
  title: string;
  /** Short marketing line shown on the card. */
  tagline: string;
  category: ChecklistCategory;
  /** Price in the smallest currency unit's parent (e.g. 29 == $29.00). */
  price: number;
  /** Optional pre-discount price for showing a strike-through. */
  compareAtPrice?: number;
  currency: "USD" | "ILS";
  /** Number of actionable items — a quick value signal on the card. */
  itemCount: number;
  /** 0–5, averaged from reviews. */
  rating: number;
  reviewCount: number;
  /** Remote image URL (Firebase Storage / CDN). Optional for now. */
  imageUrl?: string;
  /** Accent gradient classes used when no image is present. */
  accent: string;
  isBestSeller?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface NavLink {
  label: string;
  href: string;
}
