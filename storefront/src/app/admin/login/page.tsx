"use client";

import { motion, useAnimationControls } from "framer-motion";
import { AlertCircle, Loader2, Lock, Mail, Vault } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { PremiumButton } from "@/components/ui/PremiumButton";
import { mapAuthError } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import { siteConfig } from "@/config/site";

/**
 * Admin login — glassmorphism Email/Password form.
 *
 * Premium error handling: on failure the card plays a quick horizontal "shake"
 * (Framer Motion) and reveals an inline error message. Successful sign-in
 * redirects to the dashboard.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading, isConfigured, signIn } = useAuth();
  const controls = useAnimationControls();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, skip the form.
  useEffect(() => {
    if (!loading && user) router.replace("/admin");
  }, [loading, user, router]);

  const shake = () =>
    controls.start({
      x: [0, -10, 10, -8, 8, -4, 4, 0],
      transition: { duration: 0.5 },
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(mapAuthError(err));
      void shake();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Ambient brand backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-grid [background-size:28px_28px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[420px] w-[420px]
        -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <motion.div animate={controls} className="glass rounded-4xl p-8 sm:p-10">
          {/* Brand */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Vault className="h-5 w-5" />
            </span>
            <span>{siteConfig.name}</span>
          </Link>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to manage your checklists.
            </p>
          </div>

          {/* Config warning (when Firebase keys are absent) */}
          {!isConfigured && (
            <div className="mb-6 flex items-start gap-2 rounded-2xl border border-amber-500/30
              bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Firebase isn&apos;t configured yet. Add your keys to{" "}
                <code className="font-mono text-xs">.env.local</code> to enable sign-in.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Email */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Email</span>
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-3
                focus-within:ring-2 focus-within:ring-ring">
                <Mail className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </label>

            {/* Password */}
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">Password</span>
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-3
                focus-within:ring-2 focus-within:ring-ring">
                <Lock className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </label>

            {/* Inline error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-2 text-sm text-red-500"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.p>
            )}

            <PremiumButton
              type="submit"
              size="lg"
              disabled={submitting}
              className="mt-2 w-full"
              leftIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
            >
              {submitting ? "Signing in…" : "Sign In"}
            </PremiumButton>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Protected area · Authorized personnel only
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
