import type { NavLink } from "@/types";

/**
 * Single source of truth for site-wide constants (name, nav, social).
 * Keeping this here means the header, footer and SEO metadata never drift.
 */
export const siteConfig = {
  name: "Checklist Vault",
  shortName: "Vault",
  description:
    "Premium, expert-crafted digital checklists that turn ambition into action. Launch faster, decide smarter, ship with confidence.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  keywords: [
    "digital checklists",
    "productivity templates",
    "business checklists",
    "premium templates",
    "SOPs",
  ],
  ogImage: "/og-image.png",
} as const;

export const navLinks: NavLink[] = [
  { label: "The Vault", href: "#vault" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Reviews", href: "#reviews" },
  { label: "Support", href: "#support" },
];

export const footerLinks: { title: string; links: NavLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "The Vault", href: "#vault" },
      { label: "Best Sellers", href: "#vault" },
      { label: "Pricing", href: "#pricing" },
      { label: "What's New", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Affiliates", href: "#" },
      { label: "Contact", href: "#support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Refunds", href: "#" },
      { label: "License", href: "#" },
    ],
  },
];
