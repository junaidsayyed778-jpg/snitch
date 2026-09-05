import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useSellerOrders from "../hook/useSellerOrders";
import OrderCardSkeleton from "../components/OrderCardSkeleton";
import OrdersEmptyState from "../components/OrdersEmptyState";
import { Link, useNavigate } from "react-router";

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
  return orders.filter((o) => o.status === activeFilter);
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

function getStatusColor(status) {
  switch (status) {
    case "pending":     return { text: "#f9a826", bg: "rgba(249, 168, 38, 0.15)" };
    case "processing":  return { text: "#3498db", bg: "rgba(52, 152, 219, 0.15)" };
    case "shipped":     return { text: "#9b59b6", bg: "rgba(155, 89, 182, 0.15)" };
    case "delivered":   return { text: "#2ecc71", bg: "rgba(46, 204, 113, 0.15)" };
    case "cancelled":   return { text: "#e74c3c", bg: "rgba(231, 76, 60, 0.15)" };
    default:            return { text: "#999077", bg: "rgba(153, 144, 119, 0.15)" };
  }
}

// ─────────────────────────────────────────────────────────────
// Seller Order Card internal component
// ─────────────────────────────────────────────────────────────
function SellerOrderRow({ order, onUpdateStatus }) {
  const [expanded, setExpanded] = useState(false);
  const itemCount = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const statusColor = getStatusColor(order.status);
  
  let availableStatuses = [];
  if (order.status === "pending") availableStatuses = ["pending", "processing", "cancelled"];
  else if (order.status === "processing") availableStatuses = ["processing", "shipped", "cancelled"];
  else if (order.status === "shipped") availableStatuses = ["shipped", "delivered"];
  else availableStatuses = [order.status]; // terminal states

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus !== order.status) {
      onUpdateStatus(order._id, newStatus);
    }
  };

  return (
    <article
      className="overflow-hidden mb-4 transition-all duration-300 rounded-xl"
      style={{
        background: "#1c1b1b",
        border: "1px solid rgba(77,71,50,0.25)",
      }}
    >
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-6 py-6 group transition-colors hover:bg-white/[0.015]">
        
        {/* Left: General Order Meta */}
        <div className="flex items-start gap-4">
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
              storefront
            </span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            <p
              className="text-[10px] tracking-[0.35em] uppercase font-black"
              style={{ color: "#999077", fontFamily: "Inter, sans-serif" }}
            >
              Order ID
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

        {/* Right: Actions, Amount & Status */}
        <div className="flex flex-wrap items-center gap-6 xl:ml-auto">
          {/* Total Amount */}
          <div className="flex flex-col">
            <p
              className="text-[8px] tracking-[0.3em] uppercase font-bold"
              style={{ color: "#999077" }}
            >
              Order Value
            </p>
            <span
              className="text-xl font-black"
              style={{ color: "#ffd700", fontFamily: "Manrope, sans-serif" }}
            >
              {order.currency} {order.subtotal?.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col">
             <p
              className="text-[8px] tracking-[0.3em] uppercase font-bold mb-1"
              style={{ color: "#999077" }}
            >
              Fulfillment
            </p>
            <div className="relative inline-flex">
              <select
                value={order.status}
                onChange={handleStatusChange}
                disabled={availableStatuses.length <= 1}
                className="appearance-none font-bold uppercase text-[10px] tracking-[0.15em] outline-none cursor-pointer pl-4 pr-10 py-2.5 rounded-sm transition-all focus:ring-1"
                style={{
                  background: statusColor.bg,
                  color: statusColor.text,
                  border: `1px solid ${statusColor.text}`,
                  opacity: availableStatuses.length <= 1 ? 0.7 : 1,
                  boxShadow: "0 0 10px rgba(0,0,0,0.1) inset"
                }}
              >
                {availableStatuses.map((st) => (
                  <option key={st} value={st} className="bg-[#1c1b1b] text-[#e5e2e1]" style={{ fontWeight: 800 }}>
                    {st.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <span className="material-symbols-outlined text-[16px]" style={{ color: statusColor.text, opacity: availableStatuses.length <= 1 ? 0.5 : 1 }}>
                  expand_more
                </span>
              </div>
            </div>
          </div>
          
          <button
              onClick={() => setExpanded((v) => !v)}
              className="px-5 py-3 ml-2 flex items-center justify-center transition-all bg-[#2a2928] hover:bg-[#343332]"
              style={{ border: "1px solid rgba(77,71,50,0.4)", borderRadius: "8px" }}
          >
              <span
                  className="text-[10px] tracking-[0.2em] uppercase font-black"
                  style={{ color: "#ffd700", fontFamily: "Inter, sans-serif" }}
              >
                  {expanded ? "Hide Items" : "View Items"}
              </span>
          </button>
        </div>
      </div>

      {/* Expandable Order Details */}
      <div
        style={{
          maxHeight: expanded ? "2000px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.4s ease-in-out",
        }}
      >
        <div className="px-6 pb-6 pt-2">
           <div className="h-px w-full mb-6" style={{ background: "rgba(255,215,0,0.12)" }} />
           <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-5 items-start sm:items-center bg-[#131313] p-4 rounded-xl border border-[#2a2928]">
                  <div className="w-16 h-20 flex-shrink-0 bg-[#000] border border-[#333] overflow-hidden rounded">
                    {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 mix-blend-screen" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                           <span className="material-symbols-outlined opacity-30">image</span>
                        </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-black uppercase text-[#e5e2e1]">{item.title}</h4>
                    {item.variantTitle && (
                      <p className="text-[10px] tracking-[0.1em] text-[#999077] uppercase font-bold">
                        Variant: {item.variantTitle}
                      </p>
                    )}
                    <div className="flex gap-4 mt-2">
                        <span className="text-[10px] tracking-widest text-[#d0c6ab] opacity-70">
                            QTY: <strong className="text-[#ffd700]">{item.quantity}</strong>
                        </span>
                        <span className="text-[10px] tracking-widest text-[#d0c6ab] opacity-70">
                            PRICE: <strong className="text-[#ffd700]">{item.price?.currency} {item.price?.amount}</strong>
                        </span>
                        <span className="text-[10px] tracking-widest text-[#d0c6ab] opacity-70">
                            TOTAL: <strong className="text-[#ffd700]">{order.currency} {item.lineTotal}</strong>
                        </span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────
export default function SellerOrders() {
  const user = useSelector((state) => state.auth.user);
  const { orders, loading, error, fetchSellerOrders, updateOrderStatus } = useSellerOrders();
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (user && user.role === "seller") {
      fetchSellerOrders();
    }
  }, [user, fetchSellerOrders]);

  if (!user || user.role !== "seller") {
    // Should be handled by ProtectedRoute logically, but safe fallback
    return <div className="p-8 text-[#e5e2e1]">Unauthorized</div>;
  }

  const filtered = filterOrders(orders ?? [], activeFilter);
  const isEmpty = !loading && filtered.length === 0;

  return (
    <div className="px-8 sm:px-12 lg:px-16 py-12 xl:py-16">
      
      {/* Header aligned with Dashboard style */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#ffd700", marginBottom: "8px" }}>
            Order Management
          </p>
          <h1 style={{ fontFamily: "Manrope, sans-serif", fontSize: "3.5rem", fontWeight: 800, color: "#e5e2e1", letterSpacing: "-0.04em", lineHeight: 1 }}>
             Manage <span style={{ color: "#ffd700" }}>Orders.</span>
          </h1>
        </div>
      </header>

      {error && !loading && (
        <div
          className="mb-6 flex items-center gap-3 px-5 py-4"
          style={{
            background: "rgba(239,83,80,0.08)",
            border: "1px solid rgba(239,83,80,0.25)",
            borderRadius: "12px"
          }}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ color: "#ef5350" }}>
            error
          </span>
          <p className="text-[10px] tracking-[0.15em] uppercase font-bold" style={{ color: "#ef5350" }}>
            {error}
          </p>
          <button
            onClick={fetchSellerOrders}
            className="ml-auto text-[9px] tracking-[0.2em] uppercase font-black px-3 py-1.5 transition-all hover:brightness-110 rounded"
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

      {(!loading && (orders?.length ?? 0) > 0) && (
        <div
          className="flex items-center overflow-x-auto gap-3 pb-1 mb-10 -mx-1 px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {FILTER_TABS.map((tab) => {
            const count =
              tab.key === "all"
                ? orders.length
                : orders.filter((o) => o.status === tab.key).length;
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className="flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase font-black transition-all duration-200 flex-shrink-0 rounded-lg"
                style={{
                  border: isActive ? "1px solid #ffd700" : "1px solid #2e2c20",
                  background: isActive ? "rgba(255,215,0,0.05)" : "transparent",
                  color: isActive ? "#ffd700" : "#999077",
                }}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="text-[8px] font-black px-1.5 py-0.5 rounded"
                    style={{
                       background: isActive ? "rgba(255,215,0,0.15)" : "rgba(77,71,50,0.2)",
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

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
             <OrderCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isEmpty && <OrdersEmptyState />}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
           {filtered.map((order) => (
              <SellerOrderRow 
                key={order._id} 
                order={order} 
                onUpdateStatus={updateOrderStatus} 
              />
           ))}
        </div>
      )}
    </div>
  );
}
