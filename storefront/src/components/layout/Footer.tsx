import { Vault } from "lucide-react";

import { footerLinks, siteConfig } from "@/config/site";

/**
 * Clean, multi-column footer. Server component (no interactivity needed).
 */
export function Footer() {
  return (
    <footer id="support" className="border-t border-border bg-muted/30">
      <div className="container py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand blurb */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-2">
            <a href="#" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Vault className="h-4.5 w-4.5" />
              </span>
              {siteConfig.name}
            </a>
            <p className="max-w-xs text-sm text-muted-foreground">{siteConfig.description}</p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold">{group.title}</h4>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border
          pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Crafted with care for people who ship.</p>
        </div>
      </div>
    </footer>
  );
}
