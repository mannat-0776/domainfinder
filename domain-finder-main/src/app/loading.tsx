export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-surface-50"
      aria-label="Loading"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-surface-200" />
          <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-surface-500">Loading…</p>
      </div>
    </div>
  );
}
