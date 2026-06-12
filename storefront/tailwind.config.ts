import type { Config } from "tailwindcss";

/**
 * Tailwind design system for the Checklist Vault storefront.
 *
 * - `darkMode: "class"` is driven by `next-themes` (see ThemeProvider).
 * - Colors are exposed as CSS variables (defined in globals.css) so the same
 *   token (`bg-background`, `text-foreground`, …) resolves correctly in both
 *   light and dark mode without duplicating class lists.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/contexts/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Semantic tokens — values live in globals.css as HSL channels.
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        // Wired up via next/font in layout.tsx (Inter + Assistant for Hebrew).
        sans: ["var(--font-inter)", "var(--font-assistant)", "system-ui", "sans-serif"],
        heading: ["var(--font-inter)", "var(--font-assistant)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(15, 23, 42, 0.12)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        glow: "0 0 0 1px hsl(var(--accent) / 0.4), 0 8px 30px -6px hsl(var(--accent) / 0.45)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 1px 1px, hsl(var(--border) / 0.5) 1px, transparent 0)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
