import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';

/* ─── SUBSIDIARY COMPONENTS ─── */

/** Metric card for the top strip */
function StatCard({ label, value, subtext, icon }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
      style={{
        background: "#1c1b1b",
        border: "1px solid #2e2c20"
      }}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#6b6347",
            marginBottom: "8px"
          }}>
            {label}
          </p>
          <h3 style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "24px",
            fontWeight: 800,
            color: "#e5e2e1",
            letterSpacing: "-0.02em"
          }}>
            {value}
          </h3>
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            color: "#4d4732",
            marginTop: "4px"
          }}>
            {subtext}
          </p>
        </div>
        <div style={{ color: "#ffd700", opacity: 0.8 }}>
          {icon}
        </div>
      </div>
      {/* Subtle accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-1/4 bg-yellow-600/20" />
    </div>
  );
}

/** Individual Product Card */
function ProductCard({ product }) {
  const navigate = useNavigate();
  const imageUrl = product.images?.[0]?.url || "https://placehold.co/600x800/131313/ffd700?text=No+Image";

  return (
    <div
      onClick={() => navigate(`/seller/product/${product._id}`)}
      className="group relative cursor-pointer"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Aspect Ratio Box for Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#0e0e0e]">
        <img
          src={imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Tonal Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Quick info badge */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            className="w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", color: "#e5e2e1", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Manage Listing
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h4
            className="line-clamp-1 flex-1"
            style={{ fontSize: "13px", fontWeight: 500, color: "#e5e2e1", letterSpacing: "-0.01em" }}
          >
            {product.title}
          </h4>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#ffd700", fontFamily: "Manrope, sans-serif" }}>
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: product.currency || 'INR',
              maximumFractionDigits: 0
            }).format(product.price.amount)}
          </span>
        </div>
        <p style={{ fontSize: "10px", color: "#4d4732", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          In Stock • {product.images.length} Photos
        </p>
      </div>
    </div>
  );
}

/* ─── MAIN DASHBOARD ─── */

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleGetSellerProduct } = useProduct();
  const sellerProducts = useSelector(state => state.product.sellerProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        await handleGetSellerProduct();
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalValue = sellerProducts?.reduce((acc, p) => acc + (p.price.amount || 0), 0) || 0;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#131313", color: "#e5e2e1" }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        className="hidden lg:flex flex-col justify-between w-72 xl:w-80 flex-shrink-0 px-10 py-14 sticky top-0 h-screen"
        style={{ background: "#0c0c0c", borderRight: "1px solid #1a1a1a" }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-14 group w-fit cursor-default">
            <span className="text-2xl font-black tracking-[-0.05em] uppercase hover:text-yellow-400 transition-colors" style={{ fontFamily: "Manrope, sans-serif", color: "#ffd700" }}>
              SNITCH
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest" style={{ background: "#1c1b00", color: "#ffd700", letterSpacing: "0.15em" }}>
              Seller
            </span>
          </div>

          <nav className="space-y-1">
            {[
              { label: "Inventory", active: true, icon: <LayoutGrid size={18} /> },
              { label: "Orders", active: false, icon: <Package size={18} /> },
              { label: "Analytics", active: false, icon: <TrendingUp size={18} /> },
              { label: "Settings", active: false, icon: <Settings size={18} /> },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group"
                style={{
                  background: item.active ? "rgba(255, 215, 0, 0.05)" : "transparent",
                  color: item.active ? "#ffd700" : "#4d4732"
                }}
              >
                <span className="text-[12px] font-semibold tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</span>
                {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="relative z-10">
          <button
            onClick={() => { /* Logout logic */ }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-[#4d4732] hover:text-[#e5e2e1]"
          >
            <span className="text-[11px] uppercase tracking-widest font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto px-8 sm:px-12 lg:px-16 py-12 xl:py-16">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", tracking: "0.2em", textTransform: "uppercase", color: "#ffd700", marginBottom: "8px" }}>
              Dashboard Overview
            </p>
            <h1 style={{ fontFamily: "Manrope, sans-serif", fontSize: "3.5rem", fontWeight: 800, color: "#e5e2e1", letterSpacing: "-0.04em", lineHeight: 1 }}>
              Your <span style={{ color: "#ffd700" }}>Stock.</span>
            </h1>
          </div>

          <button
            onClick={() => navigate("/seller/create-product")}
            className="h-14 px-8 font-extrabold uppercase tracking-[0.15em] rounded-xl transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #ffe16d 0%, #ffd700 60%, #e9c400 100%)",
              color: "#1a1300",
              boxShadow: "0 12px 40px rgba(255, 215, 0, 0.15)",
              fontSize: "12px"
            }}
          >
            <span>Add New Product</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatCard
            label="Total Products"
            value={sellerProducts?.length || 0}
            subtext="Live in storefront"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>}
          />
          <StatCard
            label="Inventory Value"
            value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalValue)}
            subtext="Estimated total retail"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
          />
          <StatCard
            label="Storefront Status"
            value="Active"
            subtext="All systems operational"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"></path></svg>}
          />
        </div>

        {/* Section Label */}
        <div className="flex items-center gap-6 mb-10">
          <h2 style={{ fontFamily: "Manrope, sans-serif", fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: "#6b6347" }}>Recent Listings</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#2e2c20] to-transparent" />
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-white/5 rounded-xl" />
                <div className="h-4 w-2/3 bg-white/5 rounded" />
                <div className="h-4 w-1/3 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : sellerProducts && sellerProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {sellerProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-3xl p-16 text-center"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
              border: "1px dashed #2e2c20"
            }}
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4d4732" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            </div>
            <h3 style={{ fontFamily: "Manrope, sans-serif", fontSize: "20px", fontWeight: 700, color: "#e5e2e1" }}>No products found</h3>
            <p className="mt-2 mb-8" style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6b6347" }}>Start selling by adding your first product to the store.</p>
            <button
              onClick={() => navigate("/seller/create-product")}
              className="px-8 py-3.5 rounded-xl font-bold text-[12px] uppercase tracking-widest transition-all hover:bg-[#ffd700] hover:text-[#1a1300]"
              style={{ border: "1px solid #4d4732", color: "#ffd700" }}
            >
              Get Started
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

/* --- Mock Helper Icons (since lucide isn't installed) --- */
const LayoutGrid = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const Package = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>;
const Settings = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const TrendingUp = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>;

export default Dashboard;
