import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FeaturedVault } from "@/components/sections/FeaturedVault";
import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";

/**
 * Storefront landing page.
 *
 * This is a Server Component — it just composes the sections. Interactivity
 * (animations, theme, menus) lives inside the individual "use client" sections,
 * keeping the page itself static and fast to render.
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedVault />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
}
