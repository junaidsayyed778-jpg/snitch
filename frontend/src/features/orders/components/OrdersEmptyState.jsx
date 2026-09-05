// ─────────────────────────────────────────────────────
//  OrdersEmptyState — shown when user has no orders yet
// ─────────────────────────────────────────────────────
import { Link } from "react-router";

export default function OrdersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Icon ring */}
      <div className="relative mb-10">
        {/* Outer ring */}
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            border: "1px solid rgba(77,71,50,0.30)",
            background: "rgba(28,27,27,0.8)",
          }}
        >
          {/* Inner ring */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              border: "1px solid rgba(255,215,0,0.15)",
              background: "rgba(14,14,14,0.6)",
            }}
          >
            <span
              className="material-symbols-outlined text-[40px]"
              style={{ color: "#ffd700", opacity: 0.5 }}
            >
              receipt_long
            </span>
          </div>
        </div>

        {/* Decorative tick marks around the ring */}
        {[0, 90, 180, 270].map((deg) => (
          <div
            key={deg}
            className="absolute w-1 h-2"
            style={{
              top: "50%",
              left: "50%",
              background: "rgba(255,215,0,0.25)",
              transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-68px)`,
            }}
          />
        ))}
      </div>

      {/* Copy */}
      <div className="space-y-3 mb-10 relative">
        <h2
          className="text-3xl md:text-4xl font-black uppercase tracking-tight"
          style={{ color: "#e5e2e1", fontFamily: "Manrope, sans-serif" }}
        >
          No Orders{" "}
          <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,215,0,0.6)" }}>
            Yet
          </span>
        </h2>

        <div className="w-12 h-px mx-auto" style={{ background: "#ffd700", opacity: 0.5 }} />

        <p
          className="text-xs md:text-sm leading-loose max-w-xs mx-auto"
          style={{ color: "#d0c6ab", opacity: 0.6, fontFamily: "Inter, sans-serif" }}
        >
          Your future purchases will appear here. Discover our latest editorial collection and make your first order.
        </p>
      </div>

      {/* CTA */}
      <Link
        to="/"
        id="empty-orders-shop-cta"
        className="group relative flex items-center gap-3 px-10 py-4 text-[10px] tracking-[0.35em] font-black uppercase transition-all duration-300 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "#ffd700",
          color: "#131313",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-[-2px]">
          shopping_bag
        </span>
        Start Shopping
        <span
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
      </Link>

      {/* Fine print */}
      <p
        className="mt-16 text-[7px] tracking-[0.5em] uppercase"
        style={{ color: "#4d4732" }}
      >
        © 2025 SNITCH — ALL RIGHTS RESERVED
      </p>
    </div>
  );
}
