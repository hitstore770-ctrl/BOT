/**
 * Loading placeholder that mirrors the ChecklistCard layout, with a shimmer
 * sweep (see `.skeleton` in globals.css). Pure presentational — no client JS.
 */
export function ChecklistCardSkeleton() {
  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
    >
      {/* Artwork */}
      <div className="skeleton h-40 w-full" />

      {/* Body */}
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <div className="skeleton h-3 w-20 rounded-full" />
          <div className="skeleton h-3 w-14 rounded-full" />
        </div>
        <div className="skeleton h-5 w-3/4 rounded-md" />
        <div className="skeleton h-4 w-full rounded-md" />
        <div className="mt-2 flex items-center justify-between pt-3">
          <div className="skeleton h-6 w-16 rounded-md" />
          <div className="skeleton h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
