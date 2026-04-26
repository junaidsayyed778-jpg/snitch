import { useSelector } from "react-redux"
import { useProduct } from "../hook/useProduct"
import { useEffect, useRef, useMemo } from "react"
import ProductCard from "../components/ProductCard"
import { useLocation, useNavigate, Link } from "react-router"
import React from "react"

export default function Home() {
    const products = useSelector((state) => state.product.products)
    const { handleGetAllProducts } = useProduct()
    const location = useLocation()
    const navigate = useNavigate()
    const productsRef = useRef(null)
    const [activeCategory, setActiveCategory] = React.useState("All")
    const query = new URLSearchParams(location.search).get("search")

    useEffect(() => {
        handleGetAllProducts(query)
    }, [query])

    function scrollToProducts() {
        productsRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const filteredProducts = useMemo(() => {
        if (!products) return []
        if (activeCategory === "All") return products
        return products.filter(p => {
            const title = (p.title || "").toLowerCase()
            const desc = (p.description || "").toLowerCase()
            const active = activeCategory.toLowerCase()
            
            if (active === "basics") {
                return title.includes("basic") || title.includes("tee") || title.includes("t-shirt") || 
                       desc.includes("basic") || desc.includes("tee")
            }
            if (active === "premium") {
                return title.includes("premium") || title.includes("luxury") || title.includes("noir") ||
                       desc.includes("premium") || desc.includes("luxury")
            }
            if (active === "shirts") {
                // If it's a "Basic T-Shirt", it might fall into basics, 
                // but let's prioritize "shirt" for this category
                return (title.includes("shirt") && !title.includes("t-shirt")) || 
                       title.includes("formal") || title.includes("linen") ||
                       desc.includes("shirt")
            }
            
            return title.includes(active) || desc.includes(active)
        })
    }, [products, activeCategory])

    return (
        <div className="flex flex-col" style={{ backgroundColor: "#131313", color: "#e5e2e1" }}>

            {/* ══════════════════════════════════════
                HERO — Split: Image LEFT | Text RIGHT
            ══════════════════════════════════════ */}
            <section className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-hidden">

                {/* LEFT — Editorial Model Image */}
                <div className="relative w-full lg:w-[55%] min-h-[60vh] lg:min-h-screen overflow-hidden flex-shrink-0">
                    {/* Unsplash editorial fashion model image */}
                    <img
                        src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1400&q=85&auto=format&fit=crop"
                        alt="Editorial fashion model"
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        style={{ filter: "brightness(0.75) contrast(1.1)" }}
                    />

                    {/* Gradient overlay — right edge fade into dark bg */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "linear-gradient(to right, transparent 40%, #131313 100%), linear-gradient(to top, #131313 0%, transparent 30%)"
                        }}
                    />

                    {/* Gold grain texture overlay */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"
                        }} />

                    {/* EXPLORE COLLECTION button — overlapping the image at bottom-center */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
                        <button
                            onClick={scrollToProducts}
                            className="group relative flex items-center gap-3 px-8 py-4 text-[10px] tracking-[0.35em] font-black uppercase cursor-pointer transition-all duration-500 hover:scale-105"
                            style={{
                                background: "rgba(19,19,19,0.55)",
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                border: "1px solid rgba(255,215,0,0.35)",
                                color: "#ffd700",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
                            }}
                        >
                            <span>Explore Collection</span>
                            <svg
                                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>

                    {/* Season badge */}
                    <div className="absolute top-8 left-8 z-10">
                        <p className="text-[9px] tracking-[0.5em] uppercase font-bold px-3 py-1.5"
                            style={{
                                color: "#ffd700",
                                background: "rgba(19,19,19,0.5)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,215,0,0.2)"
                            }}>
                            Summer / Autumn 2025
                        </p>
                    </div>
                </div>

                {/* RIGHT — Text Content */}
                <div className="relative z-10 w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-14 lg:px-16 xl:px-20 py-20 lg:py-0"
                    style={{ backgroundColor: "#131313" }}>

                    {/* Large watermark text */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.025] whitespace-nowrap"
                        style={{ fontSize: "14vw", fontFamily: "Manrope, sans-serif", fontWeight: 900, color: "#ffd700" }}>
                        SNITCH
                    </div>

                    {/* Ambient gold glow */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full pointer-events-none opacity-[0.08]"
                        style={{ background: "radial-gradient(circle, #ffd700 0%, transparent 70%)", filter: "blur(80px)" }} />

                    <div className="relative space-y-10 max-w-xl">
                        {/* Eyebrow */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-px" style={{ backgroundColor: "#ffd700" }} />
                            <p className="text-[9px] md:text-[11px] tracking-[0.5em] uppercase font-bold"
                                style={{ color: "#999077" }}>
                                The Nocturnal Collection
                            </p>
                        </div>

                        {/* Headline */}
                        <div className="space-y-2">
                            <h1
                                className="text-6xl md:text-7xl xl:text-8xl font-black leading-[0.88] tracking-tighter uppercase"
                                style={{ fontFamily: "Manrope, sans-serif", color: "#e5e2e1" }}>
                                THE
                                <br />
                                <span style={{ color: "transparent", WebkitTextStroke: "1px #ffd700" }}>
                                    NIGHT
                                </span>
                                <br />
                                IS YOURS.
                            </h1>
                        </div>

                        {/* Body */}
                        <p className="text-sm md:text-base leading-relaxed max-w-sm"
                            style={{ color: "#d0c6ab", fontFamily: "Inter, sans-serif", opacity: 0.8 }}>
                            Precision-crafted garments for those who redefine the
                            standards of modern fashion. Worn after dark.
                        </p>

                       

                        {/* Scroll indicator */}
                        <div className="hidden lg:flex items-center gap-4 pt-8 opacity-40">
                            <div className="flex flex-col gap-1">
                                <div className="w-0.5 h-6 mx-auto animate-bounce" style={{ backgroundColor: "#ffd700" }} />
                            </div>
                            <span className="text-[8px] tracking-[0.4em] uppercase font-bold">Scroll to Discover</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                PRODUCT COLLECTION
            ══════════════════════════════════════ */}
            <section ref={productsRef} className="px-6 md:px-12 py-20 md:py-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-1">
                    <div className="space-y-3">
                        <h2
                            className="text-3xl md:text-5xl font-black tracking-tight uppercase"
                            style={{ fontFamily: "Manrope, sans-serif" }}>
                            New <span className="opacity-40">Arrivals</span>
                        </h2>
                        <div className="w-20 h-1" style={{ background: "#ffd700" }} />
                    </div>

                    <div className="flex gap-4">
                        {["All", "Shirts", "Basics", "Premium"].map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[10px] tracking-[0.2em] uppercase font-bold px-4 py-2 border transition-all hover:border-[#ffd700] ${cat === activeCategory ? "border-[#ffd700] text-[#ffd700]" : "border-transparent text-[#999077]"}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full h-64 flex flex-col items-center justify-center border border-dashed border-[#4d4732] rounded-sm opacity-50">
                            <span className="material-symbols-outlined text-4xl mb-4" style={{ color: "#ffd700" }}>
                                shopping_bag
                            </span>
                            <p className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: "#e5e2e1" }}>
                                Our collection is coming soon.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-24 flex justify-center">
                    <button className="group flex flex-col items-center gap-4 hover:text-[#ffd700] transition-colors">
                        <span className="text-[10px] tracking-[0.4em] uppercase font-black">View All Items</span>
                        <div className="w-px h-16 bg-[#4d4732] group-hover:bg-[#ffd700] transition-colors" />
                    </button>
                </div>
            </section>

            {/* ══════════════════════════════════════
                EDITORIAL STRIP
            ══════════════════════════════════════ */}
            <section className="py-16 overflow-hidden" style={{ backgroundColor: "#0e0e0e" }}>
                <div className="flex items-center gap-16 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
                    {Array(6).fill(["PRECISION", "•", "CRAFT", "•", "EDITORIAL", "•", "NOIR"]).flat().map((w, i) => (
                        <span key={i} className="text-[10px] tracking-[0.5em] uppercase font-black"
                            style={{ color: w === "•" ? "#ffd700" : "#4d4732" }}>
                            {w}
                        </span>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════
                FOOTER
            ══════════════════════════════════════ */}
            <footer className="px-6 md:px-12 py-16 border-t border-[#4d4732]/30" style={{ backgroundColor: "#0e0e0e" }}>
                <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between gap-12">
                    <div className="space-y-6">
                        <span className="text-2xl font-black tracking-[-0.05em] uppercase" style={{ color: "#ffd700" }}>
                            SNITCH
                        </span>
                        <p className="max-w-xs text-xs leading-loose opacity-50" style={{ color: "#d0c6ab" }}>
                            Redefining midnight fashion. Premium quality,
                            editorial design, and uncompromised style.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-16 gap-y-10">
                        {["Shop", "Client Service", "Company"].map((title) => (
                            <div key={title} className="space-y-4">
                                <h4 className="text-[10px] tracking-[0.2em] uppercase font-black">{title}</h4>
                                <div className="flex flex-col gap-3">
                                    {[1, 2, 3].map((i) => (
                                        <a key={i} href="#" className="text-[10px] tracking-wide opacity-40 hover:opacity-100 transition-opacity">
                                            Link Option {i}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-[#4d4732]/20 flex flex-col md:flex-row justify-between gap-4">
                    <p className="text-[8px] tracking-[0.4em] uppercase opacity-30">
                        © 2025 SNITCH — ALL RIGHTS RESERVED
                    </p>
                    <div className="flex gap-8">
                        {["Privacy", "Terms", "Cookies"].map((l) => (
                            <a key={l} href="#" className="text-[8px] tracking-[0.4em] uppercase opacity-30 hover:opacity-100 transition-opacity">
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}