import { type LucideIcon } from "lucide-react";

interface AdminPlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Shared "coming soon" shell for admin sections whose functionality (Firestore
 * CRUD, settings) is not built yet. Keeps the area branded and intentional.
 */
export function AdminPlaceholder({ icon: Icon, title, description }: AdminPlaceholderProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      </header>

      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border
        border-dashed border-border bg-card/40 px-8 py-20 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent">
          <Icon className="h-7 w-7" />
        </span>
        <h2 className="text-lg font-semibold">Coming soon</h2>
        <p className="max-w-sm text-balance text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
