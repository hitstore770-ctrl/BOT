import type { ChecklistCategory } from "@/types";

/** The canonical, selectable checklist categories (drives admin form + filters). */
export const CHECKLIST_CATEGORIES: readonly ChecklistCategory[] = [
  "Productivity",
  "Business",
  "Finance",
  "Health",
  "Marketing",
  "Lifestyle",
];

/** Accent gradients assigned to new checklists when none is provided. */
export const ACCENT_GRADIENTS: readonly string[] = [
  "from-indigo-500 via-purple-500 to-fuchsia-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-orange-500 via-rose-500 to-pink-500",
  "from-sky-500 via-blue-500 to-indigo-500",
  "from-violet-500 via-indigo-500 to-blue-500",
  "from-amber-500 via-orange-500 to-rose-500",
];
