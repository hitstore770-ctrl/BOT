import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

import { firebaseConfig, isFirebaseConfigured } from "./config";

/**
 * Firebase singleton initializer.
 *
 * Next.js can evaluate modules multiple times (HMR, server/client), so we guard
 * with `getApps()` to avoid the "Firebase App named '[DEFAULT]' already exists"
 * error. Initialization is lazy and only runs once config is actually present.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * FUTURE INTEGRATION (uncomment once `.env.local` is populated):
 *
 *   import { getAuth } from "firebase/auth";
 *   import { getFirestore } from "firebase/firestore";
 *   import { getStorage } from "firebase/storage";
 *
 *   export const auth = getAuth(getFirebaseApp());
 *   export const db = getFirestore(getFirebaseApp());
 *   export const storage = getStorage(getFirebaseApp());
 *
 * For now we only expose the app accessor so nothing crashes pre-config.
 * ──────────────────────────────────────────────────────────────────────────
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
