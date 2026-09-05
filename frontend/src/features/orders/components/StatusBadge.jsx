// ─────────────────────────────────────────────────────
//  StatusBadge — reusable order/item status pill
//  Follows the Snitch "Aurelian Noir" design system.
// ─────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: "schedule",
    bg: "rgba(255,193,7,0.10)",
    border: "rgba(255,193,7,0.30)",
    color: "#ffc107",
    dotColor: "#ffc107",
  },
  processing: {
    label: "Processing",
    icon: "autorenew",
    bg: "rgba(0,188,212,0.08)",
    border: "rgba(0,188,212,0.25)",
    color: "#00bcd4",
    dotColor: "#00bcd4",
  },
  shipped: {
    label: "Shipped",
    icon: "local_shipping",
    bg: "rgba(100,181,246,0.08)",
    border: "rgba(100,181,246,0.25)",
    color: "#64b5f6",
    dotColor: "#64b5f6",
  },
  delivered: {
    label: "Delivered",
    icon: "check_circle",
    bg: "rgba(102,187,106,0.10)",
    border: "rgba(102,187,106,0.30)",
    color: "#66bb6a",
    dotColor: "#66bb6a",
  },
  cancelled: {
    label: "Cancelled",
    icon: "cancel",
    bg: "rgba(239,83,80,0.08)",
    border: "rgba(239,83,80,0.25)",
    color: "#ef5350",
    dotColor: "#ef5350",
  },
  partially_shipped: {
    label: "Partial Ship",
    icon: "inventory_2",
    bg: "rgba(171,71,188,0.08)",
    border: "rgba(171,71,188,0.25)",
    color: "#ab47bc",
    dotColor: "#ab47bc",
  },
  paid: {
    label: "Paid",
    icon: "payments",
    bg: "rgba(102,187,106,0.10)",
    border: "rgba(102,187,106,0.30)",
    color: "#66bb6a",
    dotColor: "#66bb6a",
  },
  refunded: {
    label: "Refunded",
    icon: "currency_exchange",
    bg: "rgba(239,83,80,0.08)",
    border: "rgba(239,83,80,0.25)",
    color: "#ef5350",
    dotColor: "#ef5350",
  },
  unpaid: {
    label: "Unpaid",
    icon: "money_off",
    bg: "rgba(255,193,7,0.08)",
    border: "rgba(255,193,7,0.25)",
    color: "#ffc107",
    dotColor: "#ffc107",
  },
};

const FALLBACK = {
  label: "Unknown",
  icon: "help_outline",
  bg: "rgba(153,144,119,0.10)",
  border: "rgba(153,144,119,0.25)",
  color: "#999077",
  dotColor: "#999077",
};

/**
 * @param {object} props
 * @param {string}  props.status   — e.g. "pending", "shipped", "delivered"
 * @param {"sm"|"md"} [props.size] — badge size variant
 */
export default function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS_CONFIG[status] ?? FALLBACK;
  const isAnimated = status === "processing" || status === "shipped";

  const textSize = size === "md" ? "text-[9px]" : "text-[8px]";
  const px = size === "md" ? "px-3 py-1.5" : "px-2.5 py-1";
  const iconSize = size === "md" ? "text-[14px]" : "text-[12px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${px} ${textSize} tracking-[0.18em] uppercase font-black`}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Animated dot for active statuses */}
      <span className="relative flex h-[6px] w-[6px] flex-shrink-0">
        {isAnimated && (
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ backgroundColor: cfg.dotColor }}
          />
        )}
        <span
          className="relative inline-flex rounded-full h-[6px] w-[6px]"
          style={{ backgroundColor: cfg.dotColor }}
        />
      </span>

      {cfg.label}
    </span>
  );
}
