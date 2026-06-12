import type { Metadata, Viewport } from "next";
import { Inter, Assistant } from "next/font/google";

import { AppProviders } from "@/components/providers/AppProviders";
import { siteConfig } from "@/config/site";

import "./globals.css";

/**
 * Fonts loaded via next/font (self-hosted, zero layout shift).
 * - Inter:     primary Latin UI font.
 * - Assistant: clean Hebrew companion for RTL content (future i18n).
 * Both are exposed as CSS variables consumed by tailwind.config.ts.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Premium Digital Checklists`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — Premium Digital Checklists`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Premium Digital Checklists`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: { icon: "/favicon.ico" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning is required by next-themes (it sets the class
    // on <html> before React hydrates).
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${assistant.variable} font-sans`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
