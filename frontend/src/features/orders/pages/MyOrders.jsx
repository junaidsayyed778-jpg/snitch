import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import useOrders from "../hook/useOrders";
import OrderCard from "../components/OrderCard";
import OrderCardSkeleton from "../components/OrderCardSkeleton";
import OrdersEmptyState from "../components/OrdersEmptyState";

// ── Status filter tabs ─────────────────────────────────
const FILTER_TABS = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function filterOrders(orders, activeFilter) {
  if (activeFilter === "all") return orders;

  return orders
    .map((order) => {
      const matchingSellerOrders = order.sellerOrders?.filter(
        (sellerOrder) => sellerOrder.status === activeFilter,
      );

      if (!matchingSellerOrders?.length) {
        return null;
      }

      const matchingSellerIds = new Set(
        matchingSellerOrders.map(
          (sellerOrder) => sellerOrder.seller?._id ?? sellerOrder.seller,
        ),
      );

      const matchingItems = order.items.filter((item) => {
        const sellerId = item.seller?._id ?? item.seller;
        return matchingSellerIds.has(sellerId);
      });

      return {
        ...order,
        items: matchingItems,
        sellerOrders: matchingSellerOrders,
      };
    })
    .filter(Boolean);
}

// ══════════════════════════════════════════════════════
//  MyOrders page
// ══════════════════════════════════════════════════════
export default function MyOrders() {
  const user = useSelector((state) => state.auth.user);
  const { orders, loading, error, fetchOrder } = useOrders();
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch orders once the authenticated user is known
  useEffect(() => {
    if (user) fetchOrder();
  }, [user]);

  // ── Not logged in ──────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#131313] text-[#e5e2e1]">
        <span className="material-symbols-outlined text-6xl mb-6 text-[#ffd700] opacity-50">
          lock
        </span>
        <h1
          className="text-2xl font-black uppercase tracking-widest mb-2"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Sign In Required
        </h1>
        <p className="text-[10px] tracking-[0.2em] uppercase opacity-50 mb-8">
          Please log in to view your orders
        </p>
        <Link
          to="/login"
          className="px-10 py-4 bg-[#ffd700] text-[#131313] text-[10px] tracking-[0.3em] font-black uppercase hover:brightness-110 transition-all"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const filtered = filterOrders(orders ?? [], activeFilter);
  const isEmpty = !loading && filtered.length === 0;

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: "#131313", color: "#e5e2e1" }}
    >
      {/* ═══════════════════════════════════════════════
          PAGE HEADER
      ═══════════════════════════════════════════════ */}
      <header
        className="relative overflow-hidden px-6 md:px-12 pt-10 pb-14"
        style={{
          background: "linear-gradient(180deg, #0e0e0e 0%, #131313 100%)",
        }}
      >
        {/* Ambient gold glow */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top right, rgba(255,215,0,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Watermark */}
        <div
          className="absolute top-1/2 right-4 -translate-y-1/2 select-none pointer-events-none opacity-[0.02] hidden lg:block"
          style={{
            fontSize: "9vw",
            fontFamily: "Manrope, sans-serif",
            fontWeight: 900,
            color: "#ffd700",
            lineHeight: 1,
          }}
        >
          ORDERS
        </div>

        <div className="max-w-screen-xl mx-auto relative">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px" style={{ background: "#ffd700" }} />
            <p
              className="text-[9px] tracking-[0.5em] uppercase font-black"
              style={{ color: "#999077", fontFamily: "Inter, sans-serif" }}
            >
              Account
            </p>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tight mb-5"
            style={{ fontFamily: "Manrope, sans-serif", color: "#e5e2e1" }}
          >
            My{" "}
            <span
              style={{ color: "transparent", WebkitTextStroke: "1px #ffd700" }}
            >
              Orders
            </span>
          </h1>

          {/* Supporting text */}
          <p
            className="text-xs md:text-sm leading-relaxed max-w-sm"
            style={{
              color: "#d0c6ab",
              opacity: 0.6,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Track and manage your recent purchases. All orders are updated in
            real time.
          </p>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════════ */}
      <main className="max-w-screen-xl mx-auto px-6 md:px-12">
        {/* ── API Error Banner ── */}
        {error && !loading && (
          <div
            className="mb-6 flex items-center gap-3 px-5 py-4"
            style={{
              background: "rgba(239,83,80,0.08)",
              border: "1px solid rgba(239,83,80,0.25)",
            }}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ color: "#ef5350" }}
            >
              error
            </span>
            <p
              className="text-[10px] tracking-[0.15em] uppercase font-bold"
              style={{ color: "#ef5350" }}
            >
              {error}
            </p>
            <button
              onClick={fetchOrder}
              className="ml-auto text-[9px] tracking-[0.2em] uppercase font-black px-3 py-1.5 transition-all hover:brightness-110"
              style={{
                background: "rgba(239,83,80,0.15)",
                border: "1px solid rgba(239,83,80,0.3)",
                color: "#ef5350",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Filter Tabs (only when there are orders) ── */}
        {!loading && (orders?.length ?? 0) > 0 && (
          <div
            className="flex items-center overflow-x-auto gap-1 pb-1 mb-8 -mx-1 px-1"
            style={{ scrollbarWidth: "none" }}
          >
            {FILTER_TABS.map((tab) => {
              const count =
                tab.key === "all"
                  ? orders.length
                  : orders.filter((order) =>
                      order.sellerOrders?.some(
                        (sellerOrder) => sellerOrder.status === tab.key,
                      ),
                    ).length;
              const isActive = activeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`orders-filter-${tab.key}`}
                  onClick={() => setActiveFilter(tab.key)}
                  className="flex items-center gap-2 whitespace-nowrap px-4 py-2 text-[9px] tracking-[0.2em] uppercase font-black transition-all duration-200 flex-shrink-0"
                  style={{
                    borderBottom: isActive
                      ? "2px solid #ffd700"
                      : "2px solid transparent",
                    color: isActive ? "#ffd700" : "#999077",
                    background: "transparent",
                  }}
                >
                  {tab.label}
                  {count > 0 && (
                    <span
                      className="text-[7px] font-black px-1.5 py-0.5"
                      style={{
                        background: isActive
                          ? "rgba(255,215,0,0.15)"
                          : "rgba(77,71,50,0.4)",
                        color: isActive ? "#ffd700" : "#999077",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Loading Skeletons ── */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {isEmpty && <OrdersEmptyState />}

        {/* ── Orders List ── */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center pb-2">
              <p
                className="text-[9px] tracking-[0.25em] uppercase font-bold"
                style={{ color: "#4d4732" }}
              >
                {filtered.length} order{filtered.length !== 1 ? "s" : ""} found
              </p>
              <div
                className="flex-1 mx-6 h-px"
                style={{ background: "rgba(77,71,50,0.2)" }}
              />
            </div>

            {filtered.map((order, idx) => (
              <OrderCard
                key={order._id}
                order={order}
                defaultOpen={idx === 0}
                activeFilter={activeFilter}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
