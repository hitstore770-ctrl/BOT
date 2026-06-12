"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";

/**
 * Protected layout for all /admin routes.
 *
 * The login route (`/admin/login`) is intentionally exempt from the guard and
 * the chrome — otherwise the redirect-when-unauthenticated rule would loop. All
 * hooks run unconditionally (Rules of Hooks); the early returns are render-only.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isLoginRoute = pathname === "/admin/login";

  // Redirect unauthenticated users to the login page.
  useEffect(() => {
    if (isLoginRoute) return;
    if (!loading && !user) router.replace("/admin/login");
  }, [isLoginRoute, loading, user, router]);

  // The login page renders standalone, without the guard or sidebar.
  if (isLoginRoute) return <>{children}</>;

  // Resolving auth state (or mid-redirect): show a minimal branded loader.
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20 md:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
