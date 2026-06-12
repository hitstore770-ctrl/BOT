import { DollarSign, Eye, ListChecks, MoreHorizontal, Plus, Users } from "lucide-react";

import { StatCard } from "@/components/admin/StatCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { allChecklists } from "@/data/checklists";
import { formatCompact, formatPrice } from "@/lib/utils";

/*
 * MOCK metrics — replace with aggregated Firestore/analytics data later.
 */
const stats = [
  {
    label: "Total Checklists",
    value: String(allChecklists.length),
    icon: ListChecks,
    trend: "+2",
  },
  {
    label: "Total Views",
    value: formatCompact(48_250),
    icon: Eye,
    trend: "+12.4%",
  },
  {
    label: "Revenue (30d)",
    value: formatPrice(18_940),
    icon: DollarSign,
    trend: "+8.1%",
  },
  {
    label: "Customers",
    value: formatCompact(3_120),
    icon: Users,
    trend: "+4.6%",
  },
] as const;

/** Deterministic mock "sales" figure so the table looks alive without a DB. */
const mockSales = (reviewCount: number) => Math.round(reviewCount * 1.8);

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      {/* Page header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your store and catalog performance.
          </p>
        </div>
        <PremiumButton size="md" leftIcon={<Plus className="h-4 w-4" />} disabled>
          New Checklist
        </PremiumButton>
      </header>

      {/* Stats overview */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </section>

      {/* Checklists table (placeholder — CRUD wired up later) */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold">Checklists</h2>
            <p className="text-sm text-muted-foreground">
              {allChecklists.length} items · CRUD coming soon
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Checklist</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Sales</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allChecklists.map((checklist) => (
                <tr
                  key={checklist.id}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
                >
                  {/* Title + thumb */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br ${checklist.accent}`}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{checklist.title}</p>
                        <p className="truncate text-xs text-muted-foreground">/{checklist.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{checklist.category}</td>
                  <td className="px-5 py-3 font-medium tabular-nums">
                    {formatPrice(checklist.price, checklist.currency)}
                  </td>
                  <td className="px-5 py-3 tabular-nums text-muted-foreground">
                    {mockSales(checklist.reviewCount)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        checklist.isBestSeller
                          ? "rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                          : "rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                      }
                    >
                      {checklist.isBestSeller ? "Best Seller" : "Published"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Actions for ${checklist.title}`}
                      disabled
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground
                        transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
