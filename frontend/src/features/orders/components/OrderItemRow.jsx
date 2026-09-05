// ─────────────────────────────────────────────────────
//  OrderItemRow — one product line within an order
//  Shows: image, title, variant, qty, price, status
// ─────────────────────────────────────────────────────
import StatusBadge from "./StatusBadge";

/**
 * @param {object} props
 * @param {object} props.item — a single item from order.items[]
 */
export default function OrderItemRow({ item }) {
  const formattedPrice = item.price?.amount?.toLocaleString("en-IN");
  const formattedTotal = item.lineTotal?.toLocaleString("en-IN");
  const currency = item.price?.currency ?? "INR";

  return (
    <div
      className="flex items-start gap-4 py-5 group"
      style={{ borderBottom: "1px solid rgba(77,71,50,0.12)" }}
    >
      {/* ── Product Image ── */}
      <div
        className="w-16 h-20 md:w-20 md:h-24 flex-shrink-0 overflow-hidden"
        style={{ background: "#1c1b1b" }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-all duration-700"
            style={{ filter: "brightness(0.85) contrast(1.05)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ color: "#4d4732" }}
            >
              checkroom
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex-1 min-w-0 py-0.5 space-y-2">
        {/* Title */}
        <h4
          className="text-xs md:text-sm font-black uppercase tracking-tight leading-snug truncate"
          style={{ color: "#e5e2e1", fontFamily: "Manrope, sans-serif" }}
        >
          {item.title}
        </h4>

        {/* Variant */}
        {item.variantTitle && (
          <p
            className="text-[9px] tracking-[0.15em] uppercase font-bold"
            style={{ color: "#999077" }}
          >
            {item.variantTitle}
          </p>
        )}

        {/* Qty × price */}
        <p
          className="text-[9px] tracking-wider uppercase font-semibold"
          style={{ color: "#d0c6ab", opacity: 0.7 }}
        >
          Qty {item.quantity} × {currency} {formattedPrice}
        </p>
      </div>

      {/* ── Right: total + status ── */}
      <div className="flex flex-col items-end gap-2.5 flex-shrink-0 pt-0.5">
        {/* Line total */}
        <span
          className="text-sm font-black"
          style={{ color: "#ffd700", fontFamily: "Manrope, sans-serif" }}
        >
          {currency} {formattedTotal}
        </span>

        {/* Per-item fulfillment status */}
        <StatusBadge status={item.status} size="sm" />
      </div>
    </div>
  );
}
