"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { PremiumButton } from "@/components/ui/PremiumButton";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { CHECKLIST_CATEGORIES } from "@/lib/constants";
import type { ChecklistFormValues } from "@/lib/firestore/checklists";
import { cn } from "@/lib/utils";
import type { Checklist } from "@/types";

interface ChecklistFormModalProps {
  isOpen: boolean;
  /** Editing target, or null for "create" mode. */
  initial: Checklist | null;
  onClose: () => void;
  /** Persist handler — throws on failure so the modal can surface the error. */
  onSubmit: (values: ChecklistFormValues, id: string | null) => Promise<void>;
}

const EMPTY_FORM: ChecklistFormValues = {
  title: "",
  tagline: "",
  category: "Productivity",
  price: 0,
  isBestSeller: false,
};

/**
 * Premium glassmorphism Add/Edit checklist modal.
 *
 * Framer Motion drives the fade/scale enter+exit. The Save button shows an
 * inline spinner while the async persist runs, and errors are surfaced inline.
 */
export function ChecklistFormModal({ isOpen, initial, onClose, onSubmit }: ChecklistFormModalProps) {
  const [form, setForm] = useState<ChecklistFormValues>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = initial !== null;

  useLockBodyScroll(isOpen);

  // Sync form values whenever the modal opens or the target changes.
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setForm(
      initial
        ? {
            title: initial.title,
            tagline: initial.tagline,
            category: initial.category,
            price: initial.price,
            isBestSeller: Boolean(initial.isBestSeller),
          }
        : EMPTY_FORM,
    );
  }, [isOpen, initial]);

  // Close on Escape (unless mid-save).
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, submitting, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Please enter a title.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const normalized: ChecklistFormValues = {
        ...form,
        price: Number.isFinite(form.price) ? Math.max(0, form.price) : 0,
      };
      await onSubmit(normalized, initial?.id ?? null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldWrap =
    "flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-3 focus-within:ring-2 focus-within:ring-ring";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => !submitting && onClose()}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={isEdit ? "Edit checklist" : "New checklist"}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="glass relative z-10 w-full max-w-lg rounded-4xl p-7 sm:p-8"
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {isEdit ? "Edit checklist" : "New checklist"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isEdit ? "Update the details below." : "Add a new checklist to your catalog."}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => !submitting && onClose()}
                className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground
                  transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {/* Title */}
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Title</span>
                <div className={fieldWrap}>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. The Ultimate Startup Launch"
                    className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </label>

              {/* Description / tagline */}
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Description</span>
                <textarea
                  rows={3}
                  value={form.tagline}
                  onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                  placeholder="A short, punchy line describing the checklist."
                  className="resize-none rounded-2xl border border-border bg-background/50 px-3 py-2.5 text-sm
                    outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Category</span>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value as ChecklistFormValues["category"],
                      }))
                    }
                    className="h-11 rounded-2xl border border-border bg-background/50 px-3 text-sm outline-none
                      focus:ring-2 focus:ring-ring"
                  >
                    {CHECKLIST_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Price */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Price (USD)</span>
                  <div className={fieldWrap}>
                    <span className="text-sm text-muted-foreground">$</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={Number.isNaN(form.price) ? "" : form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.valueAsNumber }))
                      }
                      placeholder="0"
                      className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </label>
              </div>

              {/* isBestSeller toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-border bg-background/50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Best Seller</p>
                  <p className="text-xs text-muted-foreground">Feature this on the homepage.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isBestSeller}
                  onClick={() => setForm((f) => ({ ...f, isBestSeller: !f.isBestSeller }))}
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    form.isBestSeller ? "bg-accent" : "bg-muted-foreground/30",
                  )}
                >
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow",
                      form.isBestSeller ? "left-[22px]" : "left-0.5",
                    )}
                  />
                </button>
              </div>

              {/* Error */}
              {error && (
                <p className="flex items-center gap-2 text-sm text-red-500" role="alert">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="mt-2 flex items-center justify-end gap-3">
                <PremiumButton
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </PremiumButton>
                <PremiumButton
                  type="submit"
                  disabled={submitting}
                  leftIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                >
                  {submitting ? "Saving…" : isEdit ? "Save changes" : "Create checklist"}
                </PremiumButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
