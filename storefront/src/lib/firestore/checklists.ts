import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";

import { allChecklists } from "@/data/checklists";
import { getFirebaseDb } from "@/lib/firebase";
import { ACCENT_GRADIENTS } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type { Checklist, ChecklistCategory } from "@/types";

const COLLECTION = "checklists";

/** Data required to create a checklist (everything except the generated id). */
export type ChecklistInput = Omit<Checklist, "id">;

/** The editable subset exposed by the admin form. */
export interface ChecklistFormValues {
  title: string;
  tagline: string;
  category: ChecklistCategory;
  price: number;
  isBestSeller: boolean;
}

/*
 * ───────────────────────────────────────────────────────────────────────────
 * Graceful-degradation fallback.
 *
 * When Firebase isn't configured (no .env.local), these utilities operate on an
 * in-memory store seeded from the mock catalog. This keeps the whole app — Vault,
 * homepage, and admin CRUD — fully functional in a dev/demo session. The moment
 * real Firebase keys are added, every function transparently switches to live
 * Firestore with no call-site changes.
 * ───────────────────────────────────────────────────────────────────────────
 */
let memoryStore: Checklist[] | null = null;

function getMemoryStore(): Checklist[] {
  if (!memoryStore) memoryStore = allChecklists.map((checklist) => ({ ...checklist }));
  return memoryStore;
}

/** Coerce a raw Firestore document into a fully-typed Checklist. */
function toChecklist(id: string, data: DocumentData): Checklist {
  return {
    id,
    slug: typeof data.slug === "string" ? data.slug : slugify(String(data.title ?? id)),
    title: typeof data.title === "string" ? data.title : "Untitled",
    tagline: typeof data.tagline === "string" ? data.tagline : "",
    category: (data.category ?? "Productivity") as ChecklistCategory,
    price: typeof data.price === "number" ? data.price : 0,
    compareAtPrice: typeof data.compareAtPrice === "number" ? data.compareAtPrice : undefined,
    currency: data.currency === "ILS" ? "ILS" : "USD",
    itemCount: typeof data.itemCount === "number" ? data.itemCount : 0,
    rating: typeof data.rating === "number" ? data.rating : 0,
    reviewCount: typeof data.reviewCount === "number" ? data.reviewCount : 0,
    accent: typeof data.accent === "string" ? data.accent : ACCENT_GRADIENTS[0]!,
    isBestSeller: Boolean(data.isBestSeller),
  };
}

/** Firestore rejects `undefined`; drop those keys before writing. */
function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

/** Log the underlying cause and return a clean, throwable error for the UI. */
function normalizeError(message: string, cause: unknown): Error {
  console.error(`[firestore] ${message}`, cause);
  return new Error(message);
}

/**
 * Build a full ChecklistInput from the admin form values, filling non-editable
 * fields from an existing checklist (edit) or sensible defaults (create).
 */
export function createChecklistInput(
  values: ChecklistFormValues,
  base?: Checklist,
): ChecklistInput {
  const fallbackAccent =
    ACCENT_GRADIENTS[Math.floor(Math.random() * ACCENT_GRADIENTS.length)] ?? ACCENT_GRADIENTS[0]!;

  return {
    slug: base?.slug ?? slugify(values.title),
    title: values.title.trim(),
    tagline: values.tagline.trim(),
    category: values.category,
    price: values.price,
    compareAtPrice: base?.compareAtPrice,
    currency: base?.currency ?? "USD",
    itemCount: base?.itemCount ?? 0,
    rating: base?.rating ?? 0,
    reviewCount: base?.reviewCount ?? 0,
    accent: base?.accent ?? fallbackAccent,
    isBestSeller: values.isBestSeller,
  };
}

/** Fetch the full catalog (Vault + admin table). */
export async function getChecklists(): Promise<Checklist[]> {
  const db = getFirebaseDb();
  if (!db) return [...getMemoryStore()];

  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((d) => toChecklist(d.id, d.data()));
  } catch (cause) {
    console.error("[firestore] getChecklists failed; serving seed data.", cause);
    return [...getMemoryStore()];
  }
}

/** Fetch only best-sellers (homepage "Featured Vault"). */
export async function getFeaturedChecklists(): Promise<Checklist[]> {
  const db = getFirebaseDb();
  if (!db) return getMemoryStore().filter((checklist) => checklist.isBestSeller);

  try {
    const snapshot = await getDocs(
      query(collection(db, COLLECTION), where("isBestSeller", "==", true)),
    );
    return snapshot.docs.map((d) => toChecklist(d.id, d.data()));
  } catch (cause) {
    console.error("[firestore] getFeaturedChecklists failed; serving seed data.", cause);
    return getMemoryStore().filter((checklist) => checklist.isBestSeller);
  }
}

/** Create a checklist; resolves with the created record (including its id). */
export async function addChecklist(input: ChecklistInput): Promise<Checklist> {
  const db = getFirebaseDb();
  if (!db) {
    const created: Checklist = { ...input, id: `mem_${Date.now()}` };
    getMemoryStore().unshift(created);
    return created;
  }

  try {
    const ref = await addDoc(collection(db, COLLECTION), stripUndefined({ ...input }));
    return { ...input, id: ref.id };
  } catch (cause) {
    throw normalizeError("Couldn't save the checklist. Please try again.", cause);
  }
}

/** Update an existing checklist by id. */
export async function updateChecklist(
  id: string,
  data: Partial<ChecklistInput>,
): Promise<void> {
  const db = getFirebaseDb();
  if (!db) {
    const store = getMemoryStore();
    const index = store.findIndex((checklist) => checklist.id === id);
    if (index !== -1) store[index] = { ...store[index]!, ...data };
    return;
  }

  try {
    await updateDoc(doc(db, COLLECTION, id), stripUndefined({ ...data }));
  } catch (cause) {
    throw normalizeError("Couldn't update the checklist. Please try again.", cause);
  }
}

/** Delete a checklist by id. */
export async function deleteChecklist(id: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) {
    memoryStore = getMemoryStore().filter((checklist) => checklist.id !== id);
    return;
  }

  try {
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (cause) {
    throw normalizeError("Couldn't delete the checklist. Please try again.", cause);
  }
}
