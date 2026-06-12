import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { VaultExplorer } from "@/components/sections/VaultExplorer";

export const metadata: Metadata = {
  title: "The Vault",
  description:
    "Browse every premium digital checklist. Smart fuzzy search, voice search, and category filters to find your next playbook.",
};

/**
 * /vault — the full catalog page. Server Component shell; the interactive
 * browsing experience lives in <VaultExplorer> ("use client").
 */
export default function VaultPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <VaultExplorer />
      </main>
      <Footer />
    </div>
  );
}
