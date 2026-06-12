import type { Checklist, Testimonial } from "@/types";

/**
 * MOCK DATA — temporary catalog used while the storefront is being built.
 *
 * TODO(firebase): Replace these constants with Firestore queries.
 *   e.g. `getDocs(query(collection(db, "checklists"), where("isBestSeller", "==", true)))`
 *   The return shape already matches the `Checklist` type, so call sites in the
 *   UI will not need to change.
 */
/**
 * The full catalog ("The Vault"). Best-sellers are flagged with `isBestSeller`
 * and surfaced on the home page via `featuredChecklists` below.
 */
export const allChecklists: Checklist[] = [
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
  {
    id: "ck_005",
    slug: "content-calendar-mastery",
    title: "Content Calendar Mastery",
    tagline: "Plan 90 days of content in a single afternoon.",
    category: "Marketing",
    price: 22,
    currency: "USD",
    itemCount: 72,
    rating: 4.7,
    reviewCount: 156,
    accent: "from-rose-500 via-pink-500 to-purple-500",
  },
  {
    id: "ck_006",
    slug: "saas-onboarding-blueprint",
    title: "SaaS Onboarding Blueprint",
    tagline: "Turn free trials into paying customers, step by step.",
    category: "Business",
    price: 35,
    compareAtPrice: 49,
    currency: "USD",
    itemCount: 110,
    rating: 4.8,
    reviewCount: 89,
    accent: "from-violet-500 via-indigo-500 to-blue-500",
  },
  {
    id: "ck_007",
    slug: "morning-routine-reset",
    title: "Morning Routine Reset",
    tagline: "Design mornings that set up unstoppable days.",
    category: "Health",
    price: 18,
    currency: "USD",
    itemCount: 41,
    rating: 4.6,
    reviewCount: 233,
    accent: "from-amber-500 via-orange-500 to-rose-500",
  },
  {
    id: "ck_008",
    slug: "freelancer-client-onboarding",
    title: "Freelancer Client Onboarding",
    tagline: "Impress every client from the very first email.",
    category: "Business",
    price: 27,
    currency: "USD",
    itemCount: 58,
    rating: 4.9,
    reviewCount: 174,
    accent: "from-teal-500 via-emerald-500 to-green-500",
  },
  {
    id: "ck_009",
    slug: "first-time-investor-starter",
    title: "First-Time Investor Starter",
    tagline: "Start investing with confidence — minus the jargon.",
    category: "Finance",
    price: 31,
    compareAtPrice: 42,
    currency: "USD",
    itemCount: 79,
    rating: 4.7,
    reviewCount: 142,
    accent: "from-green-500 via-teal-500 to-cyan-500",
  },
  {
    id: "ck_010",
    slug: "home-office-setup",
    title: "The Perfect Home Office",
    tagline: "Build a focused, ergonomic workspace that you love.",
    category: "Lifestyle",
    price: 15,
    currency: "USD",
    itemCount: 37,
    rating: 4.5,
    reviewCount: 98,
    accent: "from-slate-500 via-gray-500 to-zinc-500",
  },
  {
    id: "ck_011",
    slug: "weekly-review-system",
    title: "The Weekly Review System",
    tagline: "Close every week clear-headed and ahead of plan.",
    category: "Productivity",
    price: 19,
    currency: "USD",
    itemCount: 45,
    rating: 4.8,
    reviewCount: 267,
    accent: "from-blue-500 via-sky-500 to-cyan-500",
  },
  {
    id: "ck_012",
    slug: "product-launch-pr-kit",
    title: "Product Launch PR Kit",
    tagline: "Get press, podcasts, and buzz for your next launch.",
    category: "Marketing",
    price: 38,
    currency: "USD",
    itemCount: 64,
    rating: 4.9,
    reviewCount: 71,
    accent: "from-fuchsia-500 via-purple-500 to-indigo-500",
  },
];

/** Best-selling subset, surfaced in the home page "Featured Vault" grid. */
export const featuredChecklists: Checklist[] = allChecklists.filter(
  (checklist) => checklist.isBestSeller,
);

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
