import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

import { firebaseConfig, isFirebaseConfigured } from "./config";

export { isFirebaseConfigured };

/**
 * Firebase singletons (App + Auth).
 *
 * Next.js can evaluate modules multiple times (HMR, server/client), so we guard
 * with `getApps()` to avoid the "Firebase App named '[DEFAULT]' already exists"
 * error. Initialization is lazy and only runs once config is actually present,
 * so the app never crashes before `.env.local` is populated.
 *
 * TODO(storage): add a `getFirebaseStorage()` accessor here following the same
 * lazy, null-safe pattern when product imagery uploads land.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[firebase] Skipping init — config missing. Copy .env.local.example to .env.local.",
      );
    }
    return null;
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let authInstance: Auth | null = null;

/** Lazily resolve the Firebase Auth instance, or null when unconfigured. */
export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!authInstance) authInstance = getAuth(app);
  return authInstance;
}

let dbInstance: Firestore | null = null;

/** Lazily resolve the Cloud Firestore instance, or null when unconfigured. */
export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!dbInstance) dbInstance = getFirestore(app);
  return dbInstance;
}
