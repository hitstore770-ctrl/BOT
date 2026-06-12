"use client";

import {
  AlertCircle,
  Check,
  DollarSign,
  Eye,
  ListChecks,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ChecklistFormModal } from "@/components/admin/ChecklistFormModal";
import { StatCard } from "@/components/admin/StatCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import {
  addChecklist,
  createChecklistInput,
  deleteChecklist,
  getChecklists,
  updateChecklist,
  type ChecklistFormValues,
} from "@/lib/firestore/checklists";
import { formatCompact, formatPrice } from "@/lib/utils";
import type { Checklist } from "@/types";

export default function AdminDashboardPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal + delete UI state.
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Checklist | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Initial load.
  useEffect(() => {
    let active = true;
    getChecklists()
      .then((data) => {
        if (active) setChecklists(data);
      })
      .catch(() => {
        if (active) setError("Failed to load checklists.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: "Total Checklists", value: String(checklists.length), icon: ListChecks },
      { label: "Total Views", value: formatCompact(48_250), icon: Eye, trend: "+12.4%" },
      { label: "Revenue (30d)", value: formatPrice(18_940), icon: DollarSign, trend: "+8.1%" },
      { label: "Customers", value: formatCompact(3_120), icon: Users, trend: "+4.6%" },
    ],
    [checklists.length],
  );

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (checklist: Checklist) => {
    setEditing(checklist);
    setModalOpen(true);
  };

  // Persist add/edit, then update local state so the table reflects it instantly.
  const handleSave = async (values: ChecklistFormValues, id: string | null) => {
    if (id) {
      await updateChecklist(id, values);
      setChecklists((prev) =>
        prev.map((checklist) => (checklist.id === id ? { ...checklist, ...values } : checklist)),
      );
    } else {
      const created = await addChecklist(createChecklistInput(values));
      setChecklists((prev) => [created, ...prev]);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteChecklist(id);
      setChecklists((prev) => prev.filter((checklist) => checklist.id !== id));
    } catch {
      setError("Failed to delete checklist.");
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of your store and catalog performance.
          </p>
        </div>
        <PremiumButton size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>
          New Checklist
        </PremiumButton>
      </header>

      {/* Stats */}
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

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Checklists table */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold">Checklists</h2>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading…" : `${checklists.length} items`}
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
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="skeleton h-9 w-9 rounded-lg" />
                        <div className="skeleton h-4 w-40 rounded-md" />
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="skeleton h-4 w-20 rounded-md" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="skeleton h-4 w-12 rounded-md" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="skeleton h-5 w-20 rounded-full" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="ml-auto skeleton h-7 w-16 rounded-md" />
                    </td>
                  </tr>
                ))
              ) : checklists.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    No checklists yet. Click{" "}
                    <span className="font-medium text-foreground">New Checklist</span> to add one.
                  </td>
                </tr>
              ) : (
                checklists.map((checklist) => (
                  <tr
                    key={checklist.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br ${checklist.accent}`}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{checklist.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            /{checklist.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{checklist.category}</td>
                    <td className="px-5 py-3 font-medium tabular-nums">
                      {formatPrice(checklist.price, checklist.currency)}
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
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {confirmingId === checklist.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDelete(checklist.id)}
                              disabled={deletingId === checklist.id}
                              className="flex items-center gap-1 rounded-lg bg-red-500/10 px-2 py-1 text-xs
                                font-medium text-red-500 transition-colors hover:bg-red-500/20"
                            >
                              {deletingId === checklist.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                              Delete
                            </button>
                            <button
                              type="button"
                              aria-label="Cancel delete"
                              onClick={() => setConfirmingId(null)}
                              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground
                                transition-colors hover:bg-muted"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              aria-label={`Edit ${checklist.title}`}
                              onClick={() => openEdit(checklist)}
                              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground
                                transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${checklist.title}`}
                              onClick={() => setConfirmingId(checklist.id)}
                              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground
                                transition-colors hover:bg-red-500/10 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add / Edit modal */}
      <ChecklistFormModal
        isOpen={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}
