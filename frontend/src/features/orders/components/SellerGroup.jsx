// ─────────────────────────────────────────────────────
//  SellerGroup — groups items by seller within one order
//  Renders the seller header + their item rows
// ─────────────────────────────────────────────────────
import { useState } from "react";
import OrderItemRow from "./OrderItemRow";
import StatusBadge from "./StatusBadge";
import useOrders from "../hook/useOrders";

/**
 * @param {object}   props
 * @param {object}   props.seller  — { _id, fullname }
 * @param {object[]} props.items   — items belonging to this seller
 * @param {string}   props.sellerStatus — fulfillment status for this seller
 * @param {string}   props.sellerOrderId - exact order ID for this seller group
 */
export default function SellerGroup({ seller, items, sellerStatus, sellerOrderId }) {
  console.log("SELLER GROUP:", {
  sellerStatus,
  sellerOrderId,
  seller,
});
  const { cancelOrder } = useOrders();
  const [isCancelling, setIsCancelling] = useState(false);
  const canCancel = sellerStatus === "pending" || sellerStatus === "processing";

  const handleCancel = async () => {
    if (!sellerOrderId || isCancelling) return;
    const confirmCancel = window.confirm("Are you sure you want to cancel this order? It cannot be undone.");
    if (!confirmCancel) return;

    setIsCancelling(true);
    await cancelOrder(sellerOrderId);
    setIsCancelling(false);
  };

  return (
    <div className="mb-1">
      {/* ── Seller Header ── */}
      <div
        className="flex items-center justify-between px-4 md:px-6 py-4"
        style={{
          background: "rgba(255,215,0,0.03)",
          borderTop: "1px solid rgba(77,71,50,0.20)",
          borderBottom: "1px solid rgba(77,71,50,0.12)",
        }}
      >
        <div className="flex items-center gap-2.5">
          {/* Store icon */}
          <span
            className="material-symbols-outlined text-[14px] opacity-60"
            style={{ color: "#ffd700" }}
          >
            storefront
          </span>
          <div>
            <p
              className="text-[9px] tracking-[0.3em] uppercase font-black"
              style={{ color: "#999077", fontFamily: "Inter, sans-serif" }}
            >
              Sold by
            </p>
            <p
              className="text-[11px] tracking-[0.12em] uppercase font-black"
              style={{ color: "#e5e2e1", fontFamily: "Manrope, sans-serif" }}
            >
              {seller?.fullname ?? "Unknown Seller"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Seller-level fulfillment badge */}
           {sellerStatus && <StatusBadge status={sellerStatus} size="sm" />}
           
           {/* Cancel Action */}
           {canCancel && (
             <button
               onClick={handleCancel}
               disabled={isCancelling}
               className="px-3 py-1.5 rounded transition-all flex items-center justify-center gap-1.5"
               style={{
                 background: "rgba(231, 76, 60, 0.08)",
                 border: "1px solid rgba(231, 76, 60, 0.25)",
                 color: "#e74c3c",
                 opacity: isCancelling ? 0.5 : 1,
               }}
             >
               <span className="material-symbols-outlined text-[12px] font-bold">close</span>
               <span className="text-[9px] tracking-[0.15em] uppercase font-black">
                 {isCancelling ? "Cancelling..." : "Cancel"}
               </span>
             </button>
           )}
        </div>
      </div>

      {/* ── Items ── */}
      <div className="px-4 md:px-6">
        {items.map((item) => (
          <OrderItemRow key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
