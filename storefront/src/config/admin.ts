import { LayoutDashboard, ListChecks, Settings, type LucideIcon } from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** When true, only matches the href exactly (for the index route). */
  exact?: boolean;
}

/** Sidebar navigation for the protected /admin area. */
export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Checklists", href: "/admin/checklists", icon: ListChecks },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
