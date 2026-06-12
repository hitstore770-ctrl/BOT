import type { Checklist, Testimonial } from "@/types";

/**
 * MOCK DATA — temporary catalog used while the storefront is being built.
 *
 * TODO(firebase): Replace these constants with Firestore queries.
 *   e.g. `getDocs(query(collection(db, "checklists"), where("isBestSeller", "==", true)))`
 *   The return shape already matches the `Checklist` type, so call sites in the
 *   UI will not need to change.
 */
export const featuredChecklists: Checklist[] = [
  {
    id: "ck_001",
    slug: "ultimate-startup-launch",
    title: "The Ultimate Startup Launch",
    tagline: "Go from idea to live product in 30 days.",
    category: "Business",
    price: 39,
    compareAtPrice: 59,
    currency: "USD",
    itemCount: 142,
    rating: 4.9,
    reviewCount: 318,
    accent: "from-indigo-500 via-purple-500 to-fuchsia-500",
    isBestSeller: true,
  },
  {
    id: "ck_002",
    slug: "personal-finance-reset",
    title: "Personal Finance Reset",
    tagline: "Build a bulletproof money system in a weekend.",
    category: "Finance",
    price: 29,
    currency: "USD",
    itemCount: 86,
    rating: 4.8,
    reviewCount: 204,
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    isBestSeller: true,
  },
  {
    id: "ck_003",
    slug: "high-converting-launch-funnel",
    title: "High-Converting Launch Funnel",
    tagline: "The exact sequence top marketers use to sell out.",
    category: "Marketing",
    price: 45,
    compareAtPrice: 65,
    currency: "USD",
    itemCount: 98,
    rating: 5.0,
    reviewCount: 127,
    accent: "from-orange-500 via-rose-500 to-pink-500",
    isBestSeller: true,
  },
  {
    id: "ck_004",
    slug: "deep-work-operating-system",
    title: "Deep Work Operating System",
    tagline: "Reclaim 15+ focused hours every single week.",
    category: "Productivity",
    price: 25,
    currency: "USD",
    itemCount: 64,
    rating: 4.9,
    reviewCount: 411,
    accent: "from-sky-500 via-blue-500 to-indigo-500",
    isBestSeller: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t_001",
    name: "Maya Cohen",
    role: "Founder, Brightseed",
    quote:
      "These checklists are absurdly thorough. We launched two weeks early and didn't miss a thing.",
    rating: 5,
  },
  {
    id: "t_002",
    name: "Daniel Ortiz",
    role: "Indie Maker",
    quote:
      "It feels like having a senior operator looking over your shoulder. Worth 10x the price.",
    rating: 5,
  },
  {
    id: "t_003",
    name: "Sophie Bergmann",
    role: "Head of Growth, Lumen",
    quote:
      "The funnel checklist alone paid for itself on the first campaign. Genuinely premium.",
    rating: 5,
  },
];

/** Aggregate social-proof numbers (mock). */
export const socialProofStats = {
  professionals: 12_400,
  checklistsSold: 38_900,
  averageRating: 4.9,
  countries: 47,
} as const;
