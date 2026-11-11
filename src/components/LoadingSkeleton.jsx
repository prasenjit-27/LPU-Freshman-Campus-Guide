// Reusable loading skeleton primitives — neo-brutalist style

export function SkeletonBox({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-black/8 ${className}`}
    />
  );
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div className="rounded-2xl border-4 border-black bg-white shadow-neo p-6 space-y-3 animate-pulse">
      <SkeletonBox className="h-4 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBox key={i} className={`h-3 ${i === rows - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

export function SkeletonBadge() {
  return <SkeletonBox className="h-6 w-20 rounded-full inline-block" />;
}

// Full-page generic loading screen used by most routes
export default function PageLoadingSkeleton({ label = "Loading..." }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
      {/* Animated LPU-style spinner */}
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-black border-t-lpu-yellow animate-spin" />
        <div className="absolute h-8 w-8 rounded-full bg-lpu-yellow border-2 border-black" />
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-black uppercase tracking-widest text-black">{label}</p>
        <p className="text-xs font-semibold text-black/50">Please wait a moment</p>
      </div>

      {/* Skeleton cards preview */}
      <div className="w-full max-w-2xl space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border-2 border-black/20 bg-white p-4 animate-pulse space-y-2">
            <SkeletonBox className="h-3 w-1/4" />
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

