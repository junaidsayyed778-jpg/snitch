// ─────────────────────────────────────────────────────
//  OrderCard — collapsible card for one full order
//  Header: order meta + totals + expand toggle
//  Body:   SellerGroup(s) with per-item rows
// ─────────────────────────────────────────────────────
import { useState } from "react";
import StatusBadge from "./StatusBadge";
import SellerGroup from "./SellerGroup";

/**
 * Groups flat items array into per-seller buckets.
 * @param {object[]} items
 * @returns {{ sellerId: string, seller: object, items: object[] }[]}
 */
function groupBySeller(items = []) {
  const map = new Map();

  for (const item of items) {
    const sellerId = item.seller?._id ?? item.seller;

    if (!sellerId) continue;

    if (!map.has(sellerId)) {
      map.set(sellerId, {
        sellerId,
        seller: item.seller,
        items: [],
      });
    }

    map.get(sellerId).items.push(item);
  }

  return Array.from(map.values());
}

/**
 * Builds a quick lookup: sellerId → sellerOrder status.
 * @param {object[]} sellerOrders
 */
function buildSellerStatusMap(sellerOrders = []) {
  const result = {};

  for (const so of sellerOrders) {
    const sellerId = so.seller?._id ?? so.seller;

    if (!sellerId) continue;

    result[sellerId] = {
      status: so.status,
      _id: so._id,
    };
  }

  return result;
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * @param {object}  props
 * @param {object}  props.order      — full order object
 * @param {boolean} [props.defaultOpen] — expand by default?
 */
export default function OrderCard({
  order,
  defaultOpen = false,
  activeFilter = "all",
}) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const sellerGroups = groupBySeller(order.items);
  console.log("SELLER ORDERS:", order.sellerOrders);
  const sellerStatusMap = buildSellerStatusMap(order.sellerOrders);
  const itemCount = order.items?.length ?? 0;

  const displayTotal = order.items?.reduce(
    (total, item) => total + (item.lineTotal ?? 0),
    0,
  );

  return (
    <article
      className="overflow-hidden transition-all duration-300"
      style={{
        background: "#1c1b1b",
        border: "1px solid rgba(77,71,50,0.25)",
      }}
    >
      {/* ══════════ CARD HEADER ══════════ */}
      <button
        id={`order-card-${order._id}`}
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left"
        aria-expanded={expanded}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 md:px-8 py-5 md:py-6 group transition-colors hover:bg-white/[0.015]">
          {/* Left block ─ Order meta */}
          <div className="flex items-start gap-5">
            {/* Gold order number badge */}
            <div
              className="hidden sm:flex flex-col items-center justify-center w-12 h-12 flex-shrink-0"
              style={{
                background: "rgba(255,215,0,0.06)",
                border: "1px solid rgba(255,215,0,0.18)",
              }}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ color: "#ffd700" }}
              >
                receipt_long
              </span>
            </div>

            <div className="space-y-1.5">
              {/* Order ID */}
              <p
                className="text-[10px] tracking-[0.35em] uppercase font-black"
                style={{ color: "#999077", fontFamily: "Inter, sans-serif" }}
              >
                Order
              </p>
              <h3
                className="text-sm md:text-base font-black uppercase tracking-tight"
                style={{ color: "#e5e2e1", fontFamily: "Manrope, sans-serif" }}
              >
                #{order._id}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="text-[9px] tracking-[0.2em] uppercase font-bold"
                  style={{ color: "#999077" }}
                >
                  {formatDate(order.createdAt)}
                </span>
                <span style={{ color: "#4d4732", fontSize: 10 }}>·</span>
                <span
                  className="text-[9px] tracking-[0.18em] uppercase font-bold"
                  style={{ color: "#999077" }}
                >
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Right block ─ Amount + Statuses + Toggle */}
          <div className="flex items-center gap-5 md:gap-8 ml-0 md:ml-auto flex-wrap justify-between md:justify-end">
            {/* Statuses */}
            <div className="flex flex-col gap-1.5 items-start md:items-end">
              {activeFilter === "all" ? (
                order.sellerOrders?.map((sellerOrder) => (
                  <StatusBadge
                    key={sellerOrder._id}
                    status={sellerOrder.status}
                    size="md"
                  />
                ))
              ) : (
                <StatusBadge status={activeFilter} size="md" />
              )}

              <StatusBadge status={order.paymentStatus} size="sm" />
            </div>

            {/* Total */}
            <div className="flex flex-col items-start md:items-end gap-0.5">
              <p
                className="text-[8px] tracking-[0.3em] uppercase font-bold"
                style={{ color: "#999077" }}
              >
                Total
              </p>
              <span
                className="text-xl font-black"
                style={{ color: "#ffd700", fontFamily: "Manrope, sans-serif" }}
              >
                {order.currency} {displayTotal.toLocaleString("en-IN")}{" "}
              </span>
            </div>

            {/* Expand toggle */}
            <div
              className="flex items-center gap-1.5 ml-2 transition-all duration-200"
              style={{ color: expanded ? "#ffd700" : "#999077" }}
            >
              <span
                className="text-[9px] tracking-[0.25em] uppercase font-black hidden sm:block"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {expanded ? "Collapse" : "View Details"}
              </span>
              <span
                className="material-symbols-outlined text-[22px] transition-transform duration-300"
                style={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                expand_more
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* ══════════ EXPANDABLE BODY ══════════ */}
      <div
        style={{
          maxHeight: expanded ? "9999px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Golden separator */}
        <div style={{ height: "1px", background: "rgba(255,215,0,0.12)" }} />

        <div>
          {sellerGroups.map((group) => {
            const sellerInfo = sellerStatusMap[group.sellerId] || {};
            return (
              <SellerGroup
                key={group.sellerId}
                seller={group.seller}
                items={group.items}
                sellerStatus={sellerInfo.status}
                sellerOrderId={sellerInfo._id}
              />
            );
          })}
        </div>

        {/* Footer ─ summary row */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 md:px-8 py-5"
          style={{
            borderTop: "1px solid rgba(77,71,50,0.18)",
            background: "rgba(14,14,14,0.4)",
          }}
        >
          <div className="flex items-center gap-6">
            {/* Seller count */}
            <div className="flex items-center gap-2 opacity-60">
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ color: "#ffd700" }}
              >
                storefront
              </span>
              <span
                className="text-[9px] tracking-[0.2em] uppercase font-bold"
                style={{ color: "#d0c6ab" }}
              >
                {sellerGroups.length} Seller
                {sellerGroups.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Item count */}
            <div className="flex items-center gap-2 opacity-60">
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ color: "#ffd700" }}
              >
                inventory_2
              </span>
              <span
                className="text-[9px] tracking-[0.2em] uppercase font-bold"
                style={{ color: "#d0c6ab" }}
              >
                {itemCount} Item{itemCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Total readout */}
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] tracking-[0.3em] uppercase font-bold"
              style={{ color: "#999077" }}
            >
              Order Total:
            </span>
            <span
              className="text-base font-black"
              style={{ color: "#ffd700", fontFamily: "Manrope, sans-serif" }}
            >
              {order.currency} {displayTotal.toLocaleString("en-IN")}{" "}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
