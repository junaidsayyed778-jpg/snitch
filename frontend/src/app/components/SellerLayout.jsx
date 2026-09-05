import React from 'react';
import { Navigate, useNavigate, useLocation, Outlet } from 'react-router';

/* --- Mock Helper Icons --- */
const LayoutGrid = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const Package = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>;
const Settings = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const TrendingUp = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>;

export default function SellerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { label: "Inventory", path: "/seller/dashboard", icon: <LayoutGrid size={18} /> },
    { label: "Orders", path: "/seller/orders", icon: <Package size={18} /> },
    { label: "Analytics", path: "/seller/analytics", icon: <TrendingUp size={18} /> },
    { label: "Settings", path: "/seller/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#131313", color: "#e5e2e1" }}
    >
      {/* ── SIDEBAR (DESKTOP) ── */}
      <aside
        className="hidden lg:flex flex-col justify-between w-72 xl:w-80 flex-shrink-0 px-10 py-14 sticky top-0 h-screen"
        style={{ background: "#0c0c0c", borderRight: "1px solid #1a1a1a", minHeight: "100vh" }}
      >
        <div className="relative z-10">
          <div 
             className="flex items-center gap-2 mb-14 group w-fit cursor-pointer"
             onClick={() => navigate("/")}
          >
            <span className="text-2xl font-black tracking-[-0.05em] uppercase hover:text-yellow-400 transition-colors" style={{ fontFamily: "Manrope, sans-serif", color: "#ffd700" }}>
              SNITCH
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest" style={{ background: "#1c1b00", color: "#ffd700", letterSpacing: "0.15em" }}>
              Seller
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group"
                  style={{
                    background: active ? "rgba(255, 215, 0, 0.05)" : "transparent",
                    color: active ? "#ffd700" : "#4d4732"
                  }}
                >
                  <span className="text-[12px] font-semibold tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]" />}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ── MAIN CONTENT (Outlet) ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* MOBILE NAVIGATION TABS (Visible only on lg and below) */}
        <div 
          className="flex items-center overflow-x-auto lg:hidden pt-20 px-6 gap-2 border-b"
          style={{ background: "#131313", borderColor: "rgba(77,71,50,0.2)", scrollbarWidth: "none" }}
        >
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors"
                  style={{
                    color: active ? "#ffd700" : "#999077",
                    borderBottom: active ? "2px solid #ffd700" : "2px solid transparent"
                  }}
                >
                  {/* {item.icon} */}
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{item.label}</span>
                </button>
              );
            })}
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
