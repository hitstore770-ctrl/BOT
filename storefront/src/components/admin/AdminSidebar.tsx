"use client";

import { LogOut, Vault } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { adminNavItems } from "@/config/admin";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

/** Decide whether a nav item is the active route. */
function useIsActive() {
  const pathname = usePathname();
  return (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Admin navigation. Renders a fixed sidebar on desktop and a sticky top bar on
 * mobile, sharing the same nav config so the two never drift.
 */
export function AdminSidebar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const isActive = useIsActive();

  const handleLogout = async () => {
    await signOut();
    router.replace("/admin/login");
  };

  const navList = (orientation: "vertical" | "horizontal") => (
    <nav
      className={cn(
        "flex gap-1",
        orientation === "vertical" ? "flex-col" : "flex-row overflow-x-auto",
      )}
    >
      {adminNavItems.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4.5 w-4.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border
        bg-card/40 p-4 md:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-2 px-2 py-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground">
            <Vault className="h-4.5 w-4.5" />
          </span>
          <span className="text-base">{siteConfig.name}</span>
        </Link>

        {navList("vertical")}

        {/* Footer: user + logout */}
        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          <div className="flex items-center justify-between px-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.email ?? "Admin"}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground
              transition-colors hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="glass sticky top-0 z-40 flex flex-col gap-3 border-x-0 border-t-0 p-3 md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Vault className="h-4.5 w-4.5" />
            </span>
            <span className="text-base">Admin</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground
                transition-colors hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
        {navList("horizontal")}
      </header>
    </>
  );
}
