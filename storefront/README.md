# Checklist Vault — Storefront

Premium e-commerce storefront for selling **digital checklists**. This is the
structural foundation: the core layout and the marketing landing page. The Admin
Dashboard, WhatsApp payment bot, and Live App will be layered on top of this
foundation later.

## Tech stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework      | **Next.js 15** (App Router, React 19, TypeScript) |
| Styling        | **Tailwind CSS 3** (CSS-variable design tokens)   |
| Animation      | **Framer Motion**                                 |
| Theming        | **next-themes** (class-based dark mode)           |
| Icons          | **lucide-react**                                  |
| Backend (stub) | **Firebase** Web SDK (Firestore/Auth — later)     |

## Folder structure

```
storefront/
├── public/                     # Static assets (noise texture, og-image, favicon)
└── src/
    ├── app/                    # App Router entrypoints
    │   ├── layout.tsx          # Root layout: fonts, metadata/SEO, providers
    │   ├── page.tsx            # Landing page (composes the sections)
    │   ├── globals.css         # Tailwind layers + design tokens + utilities
    │   └── api/
    │       └── checkout/route.ts   # Placeholder checkout endpoint
    ├── components/
    │   ├── ui/                 # Reusable primitives
    │   │   ├── PremiumButton.tsx
    │   │   ├── ChecklistCard.tsx
    │   │   └── ThemeToggle.tsx
    │   ├── layout/             # Header, Footer
    │   ├── sections/           # Hero, FeaturedVault, SocialProof
    │   └── providers/          # ThemeProvider + AppProviders (composition root)
    ├── config/                 # Site-wide constants (name, nav, footer links)
    ├── contexts/               # Future React contexts (auth, cart)
    ├── data/                   # Mock catalog (swap for Firestore later)
    ├── hooks/                  # Reusable hooks (useMounted, …)
    ├── lib/
    │   ├── firebase/           # Firebase init placeholder (config + singleton)
    │   └── utils.ts            # cn(), formatPrice(), formatCompact()
    └── types/                  # Shared domain types (Checklist, Testimonial, …)
```

### Why this shape

- **Feature-ready, not over-built.** `contexts/`, `hooks/`, `lib/`, and
  `app/api/` already exist so auth, cart, and payments slot in without a
  reshuffle.
- **Server-first.** `page.tsx` and `Footer` are Server Components; only the
  interactive pieces opt into `"use client"`, keeping the bundle lean.
- **Single sources of truth.** Site copy lives in `config/`, the catalog in
  `data/`, design tokens in `globals.css` — no duplication across components.

## Getting started

```bash
cd storefront
npm install
cp .env.local.example .env.local   # fill in Firebase values when ready
npm run dev                        # http://localhost:3000
```

> Firebase init is **lazy and guarded** — the app runs fine before you add any
> credentials. See `src/lib/firebase/index.ts` for where Auth/Firestore/Storage
> get wired up.

## Where the future plugs in

| Next feature        | Hook-in point                                                  |
| ------------------- | -------------------------------------------------------------- |
| Auth (sign in)      | `lib/firebase/index.ts` → `AuthProvider` in `AppProviders.tsx` |
| Live catalog        | Replace mock arrays in `data/checklists.ts` with Firestore     |
| Cart                | `CartProvider` in `AppProviders.tsx`; badge in `Header.tsx`    |
| Quick View modal    | Wire the button in `ChecklistCard.tsx` to a glass modal        |
| WhatsApp payments   | `app/api/checkout/route.ts`                                    |
