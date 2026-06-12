/**
 * Lightweight class-name joiner (no external dependency).
 * Filters falsy values so you can do: cn("base", isActive && "active").
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Format a price into a localized currency string. */
export function formatPrice(amount: number, currency: "USD" | "ILS" = "USD"): string {
  const locale = currency === "ILS" ? "he-IL" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Compact number formatting, e.g. 12400 -> "12.4K". */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Turn a title into a URL-safe slug, e.g. "My Checklist!" -> "my-checklist". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
