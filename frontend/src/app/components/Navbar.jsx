import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../../features/auth/hook/useAuth";
import { useCart } from "../../features/products/hook/useCart";

export default function Navbar() {
    const { user } = useSelector((state) => state.auth);
    // Use serverCart for accurate backend-sync count
    const serverCartCount = useSelector((state) => state.serverCart.itemCount);
    // Fallback to local cart count (guests / before login)
    const localCartCount = useSelector((state) =>
        state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
    );
    const cartCount = user ? serverCartCount : localCartCount;

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { handleLogout } = useAuth();
    const { handleGetCart } = useCart();

    const isSellerDashboard = location.pathname === "/seller/dashboard";

    // Fetch cart from backend when user logs in
    useEffect(() => {
        if (user) handleGetCart();
    }, [user]);

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/?search=${searchQuery.trim()}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <>
            {/* ── MAIN NAVBAR ── */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 flex items-center justify-between px-4 md:px-12 backdrop-blur-md transition-all border-b"
                style={{ background: "rgba(19,19,19,0.85)", borderColor: "rgba(77,71,50,0.3)" }}
            >
                {/* Hamburger — mobile only */}
                <button
                    className="flex md:hidden flex-col gap-[5px] p-2 -ml-1 mr-2"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open menu"
                >
                    <span className="block w-5 h-0.5 bg-[#e5e2e1] transition-all" />
                    <span className="block w-5 h-0.5 bg-[#e5e2e1] transition-all" />
                    <span className="block w-3.5 h-0.5 bg-[#ffd700] transition-all" />
                </button>

                {/* Logo */}
                <Link
                    to="/"
                    className="text-xl md:text-2xl font-black tracking-tighter uppercase group"
                    style={{ fontFamily: "Manrope, sans-serif", color: "#ffd700" }}
                >
                    SNI<span className="group-hover:text-white transition-colors">TCH</span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-10">
                    {user?.role === "seller" && (
                        <Link
                            to="/seller/dashboard"
                            className="text-[10px] tracking-[0.25em] uppercase font-black transition-all"
                            style={{
                                fontFamily: "Inter, sans-serif",
                                color: isSellerDashboard ? "#ffd700" : "#e5e2e1",
                                opacity: isSellerDashboard ? 1 : 0.6,
                            }}
                        >
                            Seller Dashboard
                        </Link>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 md:gap-6">
                    {/* Search */}
                    <div className="relative flex items-center">
                        {isSearchOpen && (
                            <div className="absolute right-full mr-3 flex items-center animate-in fade-in slide-in-from-right-2 duration-200">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#ffd700]/30 focus:border-[#ffd700] text-[11px] tracking-[0.15em] uppercase font-semibold text-[#e5e2e1] placeholder:text-[#777] px-4 py-2 rounded-full w-36 md:w-56 outline-none transition-all"
                                />
                            </div>
                        )}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="material-symbols-outlined text-[20px] hover:text-[#ffd700] hover:scale-110 active:scale-95 transition-all p-2 rounded-full hover:bg-[#ffd700]/10 text-[#e5e2e1]"
                        >
                            {isSearchOpen ? "close" : "search"}
                        </button>
                        {isSearchOpen && (
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd700] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffd700]" />
                            </span>
                        )}
                    </div>

                    {/* User / Login */}
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/profile" className="flex items-center gap-2.5 group">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-[9px] font-black uppercase tracking-tight text-[#e5e2e1]">
                                        MT. {user.fullname?.split(" ")[0]}
                                    </span>
                                    <span className="text-[7px] tracking-[0.2em] uppercase text-[#ffd700] opacity-60">Gilded</span>
                                </div>
                                <div className="w-8 h-8 rounded-full border border-[#4d4732] flex items-center justify-center overflow-hidden group-hover:border-[#ffd700] transition-all bg-[#0e0e0e]">
                                    {user.profilePic ? (
                                        <img src={user.profilePic} alt={user.fullname} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[12px] font-black text-[#ffd700]" style={{ fontFamily: "Manrope, sans-serif" }}>
                                            {user.fullname?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="material-symbols-outlined text-[18px] text-[#999077] hover:text-[#ffd700] transition-colors p-1 hidden md:block"
                            >
                                logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="hidden md:block text-[10px] tracking-[0.2em] uppercase font-black hover:text-[#ffd700] transition-colors"
                            style={{ fontFamily: "Inter, sans-serif", color: "#e5e2e1" }}
                        >
                            Join
                        </Link>
                    )}

                    {/* Cart */}
                    <Link to="/cart" className="relative group p-2">
                        <span
                            className="material-symbols-outlined text-[20px] md:text-[24px] group-hover:text-[#ffd700] transition-colors"
                            style={{ color: "#e5e2e1" }}
                        >
                            shopping_bag
                        </span>
                        {cartCount > 0 && (
                            <div className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#ffd700] rounded-full flex items-center justify-center text-[8px] font-black text-[#131313] px-1 transition-all">
                                {cartCount > 99 ? "99+" : cartCount}
                            </div>
                        )}
                    </Link>
                </div>
            </nav>

            {/* ── MOBILE SIDEBAR OVERLAY ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── MOBILE SIDEBAR DRAWER ── */}
            <aside
                className={`fixed top-0 left-0 z-[70] h-full w-72 flex flex-col md:hidden transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                style={{ background: "#0e0e0e", borderRight: "1px solid rgba(77,71,50,0.3)" }}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#4d4732]/30">
                    <Link to="/" className="text-xl font-black tracking-tighter uppercase" style={{ color: "#ffd700", fontFamily: "Manrope, sans-serif" }}>
                        SNITCH
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="material-symbols-outlined text-[22px] text-[#999077] hover:text-[#ffd700] transition-colors"
                    >
                        close
                    </button>
                </div>

                {/* User Info */}
                {user && (
                    <div className="px-6 py-5 border-b border-[#4d4732]/20" style={{ background: "#1c1b1b" }}>
                        <Link to="/profile" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full border border-[#4d4732] flex items-center justify-center overflow-hidden group-hover:border-[#ffd700] transition-all bg-[#0e0e0e]">
                                {user.profilePic ? (
                                    <img src={user.profilePic} alt={user.fullname} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[14px] font-black text-[#ffd700]" style={{ fontFamily: "Manrope, sans-serif" }}>
                                        {user.fullname?.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase text-[#e5e2e1] tracking-wide">MT. {user.fullname?.split(" ")[0]}</p>
                                <p className="text-[8px] tracking-[0.2em] uppercase text-[#ffd700] opacity-70">Gilded Member</p>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Nav Links */}
                <nav className="flex flex-col px-6 py-6 gap-1 flex-1">
                    {[
                        { label: "Home", to: "/" },
                        { label: "Shop", to: "/" },
                        ...(user?.role === "seller" ? [{ label: "Seller Dashboard", to: "/seller/dashboard" }] : []),
                    ].map((link) => (
                        <Link
                            key={link.to + link.label}
                            to={link.to}
                            className="py-3 text-[11px] tracking-[0.25em] uppercase font-bold border-b border-[#4d4732]/20 text-[#e5e2e1] hover:text-[#ffd700] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}

                    <Link
                        to="/cart"
                        className="mt-2 py-3 flex items-center justify-between text-[11px] tracking-[0.25em] uppercase font-bold border-b border-[#4d4732]/20 text-[#e5e2e1] hover:text-[#ffd700] transition-colors"
                    >
                        <span>Your Bag</span>
                        {cartCount > 0 && (
                            <span className="bg-[#ffd700] text-[#131313] text-[9px] font-black px-2 py-0.5 rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </nav>

                {/* Sidebar Footer */}
                <div className="px-6 py-6 border-t border-[#4d4732]/30 space-y-4">
                    {user ? (
                        <button
                            onClick={() => { handleLogout(); setSidebarOpen(false); }}
                            className="flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase font-black text-[#999077] hover:text-[#ffd700] transition-colors w-full"
                        >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            Sign Out
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center justify-center w-full py-3 bg-[#ffd700] text-[#131313] text-[10px] tracking-[0.3em] font-black uppercase hover:brightness-110 transition-all"
                        >
                            Join Now
                        </Link>
                    )}
                    <p className="text-[7px] tracking-[0.3em] uppercase opacity-20 text-center">© 2025 SNITCH</p>
                </div>
            </aside>
        </>
    );
}
