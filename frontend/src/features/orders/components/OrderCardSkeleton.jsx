// ─────────────────────────────────────────────────────
//  OrderCardSkeleton — loading placeholder for OrderCard
//  Matches the visual rhythm of the real card.
// ─────────────────────────────────────────────────────

function Bone({ className = "", style = {} }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{ background: "rgba(77,71,50,0.18)", ...style }}
    />
  );
}

export default function OrderCardSkeleton() {
  return (
    <div
      style={{
        background: "#1c1b1b",
        border: "1px solid rgba(77,71,50,0.20)",
      }}
    >
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 md:px-8 py-5 md:py-6">
        {/* Left */}
        <div className="flex items-start gap-5">
          {/* Icon box */}
          <Bone className="hidden sm:block w-12 h-12 flex-shrink-0" />
          <div className="space-y-2.5">
            <Bone className="h-2 w-12 rounded-full" />
            <Bone className="h-4 w-36 rounded-full" />
            <Bone className="h-2 w-24 rounded-full" />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 md:ml-auto">
          <div className="flex flex-col gap-2 items-end">
            <Bone className="h-5 w-24 rounded-full" />
            <Bone className="h-4 w-14 rounded-full" />
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Bone className="h-2 w-8 rounded-full" />
            <Bone className="h-7 w-20 rounded-full" />
          </div>
          <Bone className="h-6 w-6 rounded-full" />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(77,71,50,0.15)" }} />

      {/* Body skeleton — 2 fake item rows */}
      <div className="px-5 md:px-8 py-4 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-start gap-4 py-3" style={{ borderBottom: "1px solid rgba(77,71,50,0.08)" }}>
            <Bone className="w-16 h-20 md:w-20 md:h-24 flex-shrink-0" />
            <div className="flex-1 space-y-2.5 py-1">
              <Bone className="h-3 w-3/4 rounded-full" />
              <Bone className="h-2 w-1/2 rounded-full" />
              <Bone className="h-2 w-1/3 rounded-full" />
            </div>
            <div className="flex flex-col items-end gap-2 pt-0.5">
              <Bone className="h-4 w-16 rounded-full" />
              <Bone className="h-5 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
