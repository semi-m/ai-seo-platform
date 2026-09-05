export function PageSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="sr-only">{label}</p>
      <div className="mb-6 h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="mb-3 h-4 w-full max-w-md animate-pulse rounded-md bg-muted" />
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
