import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/* ── Reusable underline-animated input ── */
function Field({ id, label, type = "text", placeholder, value, onChange }) {
    return (
        <div className="relative editorial-input">
            <label
                htmlFor={id}
                className="block text-[9px] md:text-[10px] tracking-[0.2em] uppercase mb-1"
                style={{ fontFamily: "Inter, sans-serif", color: "#999077" }}
            >
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-transparent border-0 border-b-2 py-2 px-0 focus:outline-none text-sm md:text-base transition-all"
                style={{
                    fontFamily: "Inter, sans-serif",
                    color: "#e5e2e1",
                    borderColor: "#4d4732",
                    caretColor: "#ffd700",
                }}
            />
            {/* Gold underline expanding from center */}
            <div
                className="input-line absolute bottom-0 h-[2px]"
                style={{ background: "#ffd700" }}
            />
        </div>
    );
}

export default function Register() {

    const { handleRegister } = useAuth()
    const navigate = useNavigate()
    const { error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        contactNumber: "",
        password: "",
        isSeller: false,
    });

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit =async (e) => {
        e.preventDefault();
        await handleRegister({
            email: form.email,
            contact: form.contactNumber,
            password: form.password,
            fullname: form.fullName,
            isSeller: form.isSeller
        })
        navigate("/")
    };

    return (
        <div
            className="h-screen flex flex-col lg:flex-row lg:overflow-hidden"
            style={{ background: "#131313", color: "#e5e2e1" }}
        >
            {/* ═══════════════════════════════════════════
          LEFT PANEL — Branding & Image (desktop only)
      ═══════════════════════════════════════════ */}
            <aside
                className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden flex-col justify-between p-12 xl:p-16 bg-cover bg-center h-full"
                style={{
                    backgroundImage: "url('/fashion_hero_bg.png')",
                    backgroundColor: "#0e0e0e"
                }}
            >
                {/* Dark overlay to ensure text remains readable */}
                <div className="absolute inset-0 bg-[#0e0e0e] opacity-70" />

                {/* Ambient glow blobs */}
                <div
                    className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none"
                    style={{ background: "#ffd700", opacity: 0.15, filter: "blur(100px)" }}
                />
                <div
                    className="absolute bottom-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
                    style={{ background: "#ffd700", opacity: 0.1, filter: "blur(120px)" }}
                />

                {/* Content wrapper with relative positioning so it sits above the absolute overlay */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* Logo */}
                    <div>
                        <span
                            className="text-2xl font-black tracking-[-0.05em] uppercase"
                            style={{ fontFamily: "Manrope, sans-serif", color: "#ffd700" }}
                        >
                            SNITCH
                        </span>
                    </div>

                    {/* Hero copy */}
                    <div className="space-y-6 max-w-lg mt-auto mb-12">
                        <h1
                            className="text-5xl xl:text-6xl font-extrabold leading-[1] tracking-tight drop-shadow-lg"
                            style={{ fontFamily: "Manrope, sans-serif", color: "#ffd700" }}
                        >
                            OWN<br />THE<br />NIGHT.
                        </h1>
                        <p
                            className="text-lg leading-relaxed font-medium drop-shadow-md"
                            style={{ fontFamily: "Inter, sans-serif", color: "#e5e2e1" }}
                        >
                            Discover high-end midnight fashion.<br />
                            The premium clothing collection for those who don't compromise.
                        </p>

                        {/* Decorative stat strip */}
                        <div className="flex gap-10 pt-4">
                            {[
                                { num: "5K+", label: "Styles" },
                                { num: "Global", label: "Shipping" },
                                { num: "4.9★", label: "Rated" },
                            ].map(({ num, label }) => (
                                <div key={label}>
                                    <p
                                        className="text-2xl font-extrabold"
                                        style={{ fontFamily: "Manrope, sans-serif", color: "#ffd700" }}
                                    >
                                        {num}
                                    </p>
                                    <p
                                        className="text-[10px] tracking-widest uppercase mt-0.5 font-semibold"
                                        style={{ fontFamily: "Inter, sans-serif", color: "#e5e2e1" }}
                                    >
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom tagline */}
                    <p
                        className="text-[10px] tracking-[0.25em] uppercase"
                        style={{ fontFamily: "Inter, sans-serif", color: "#d0c6ab" }}
                    >
                        © 2025 SNITCH — ALL RIGHTS RESERVED
                    </p>
                </div>
            </aside>

            {/* ═══════════════════════════════════════════
          RIGHT PANEL — Form
      ═══════════════════════════════════════════ */}
            <section
                className="flex-1 flex flex-col justify-between h-full overflow-y-auto [&::-webkit-scrollbar]:hidden"
                style={{ background: "#131313", scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {/* Mobile top bar */}
                <header className="lg:hidden flex items-center justify-center h-16 border-b flex-shrink-0"
                    style={{ borderColor: "#1c1b1b" }}
                >
                    <span
                        className="text-xl font-black tracking-[-0.05em] uppercase"
                        style={{ fontFamily: "Manrope, sans-serif", color: "#ffd700" }}
                    >
                        SNITCH
                    </span>
                </header>

                {/* Form wrapper */}
                <div className="flex-1 flex items-center justify-center px-6 py-4 sm:px-10 md:px-16 lg:px-20 xl:px-28">
                    <div className="w-full max-w-md lg:max-w-lg my-auto">

                        {/* Heading */}
                        <div className="mb-6">
                            <h2
                                className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-2"
                                style={{ fontFamily: "Manrope, sans-serif", color: "#ffd700" }}
                            >
                                Create your account
                            </h2>
                            <p
                                className="text-sm"
                                style={{ fontFamily: "Inter, sans-serif", color: "#d0c6ab" }}
                            >
                                Already have one?{" "}
                                <a
                                    href="/login"
                                    className="underline underline-offset-4 transition-colors hover:opacity-80"
                                    style={{ color: "#ffd700" }}
                                >
                                    Sign in
                                </a>
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div 
                                className="mb-6 p-4 rounded-lg border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
                                style={{ 
                                    background: "rgba(255, 71, 71, 0.05)", 
                                    borderColor: "rgba(255, 71, 71, 0.2)",
                                    color: "#ff4747"
                                }}
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium tracking-wide" style={{ fontFamily: "Inter, sans-serif" }}>
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Field
                                id="fullName"
                                label="Full Name"
                                placeholder="John Doe"
                                value={form.fullName}
                                onChange={handle}
                            />
                            <Field
                                id="email"
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handle}
                            />
                            <Field
                                id="contactNumber"
                                label="Contact Number"
                                type="tel"
                                placeholder="9876543210"
                                value={form.contactNumber}
                                onChange={handle}
                            />
                            <Field
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handle}
                            />

                            {/* isSeller checkbox */}
                            <div
                                className="flex items-start gap-3 rounded-xl p-3 transition-colors"
                                style={{ background: "#1c1b1b" }}
                            >
                                <div className="relative flex items-center justify-center w-6 h-6 mt-0.5 flex-shrink-0">
                                    <input
                                        id="isSeller"
                                        name="isSeller"
                                        type="checkbox"
                                        checked={form.isSeller}
                                        onChange={handle}
                                        className="peer appearance-none w-6 h-6 border-2 rounded-sm transition-all cursor-pointer"
                                        style={{
                                            borderColor: "#4d4732",
                                            background: "transparent",
                                        }}
                                    />
                                    {/* Overlay checked state */}
                                    <div
                                        className="absolute inset-0 rounded-sm pointer-events-none transition-opacity"
                                        style={{
                                            background: "#ffd700",
                                            opacity: form.isSeller ? 1 : 0,
                                        }}
                                    />
                                    {/* Checkmark */}
                                    {form.isSeller && (
                                        <svg
                                            className="absolute w-3.5 h-3.5 pointer-events-none"
                                            viewBox="0 0 12 10"
                                            fill="none"
                                            stroke="#221b00"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="1 5 4.5 8.5 11 1" />
                                        </svg>
                                    )}
                                </div>
                                <label htmlFor="isSeller" className="cursor-pointer">
                                    <span
                                        className="block font-bold text-sm"
                                        style={{ fontFamily: "Manrope, sans-serif", color: "#e5e2e1" }}
                                    >
                                        Register as Seller
                                    </span>
                                    <span
                                        className="block text-xs mt-0.5"
                                        style={{ fontFamily: "Inter, sans-serif", color: "#999077" }}
                                    >
                                        List products and manage your store.
                                    </span>
                                </label>
                            </div>

                            {/* Submit */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full h-10 md:h-12 font-extrabold uppercase tracking-[0.2em] rounded-lg transition-all active:scale-[0.98] hover:brightness-110 cursor-pointer"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        background: "linear-gradient(135deg, #ffe16d 0%, #ffd700 100%)",
                                        color: "#221b00",
                                    }}
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>

                          {/* Divider */}
                        <div className="flex items-center gap-4 pt-6">
                            <div className="flex-1 h-px" style={{ background: "#4d4732" }} />
                            <span
                                className="text-[10px] tracking-[0.2em] uppercase"
                                style={{ fontFamily: "Inter, sans-serif", color: "#999077" }}
                            >
                                or
                            </span>
                            <div className="flex-1 h-px" style={{ background: "#4d4732" }} />
                        </div>

                        {/* Continue with Google */}
                        <a
                            href="http://localhost:5000/api/auth/google"
                            className="w-full h-12 md:h-14 flex items-center justify-center gap-3 font-bold uppercase tracking-[0.15em] rounded-lg border-2 transition-all hover:brightness-125 cursor-pointer mt-4"
                            style={{
                                fontFamily: "Inter, sans-serif",
                                borderColor: "#4d4732",
                                color: "#e5e2e1",
                                background: "transparent",
                            }}
                        >
                            Continue with Google
                        </a>
                    </div>
                </div>

                {/* Mobile footer */}
                <footer className="lg:hidden flex justify-center gap-6 pb-4 pt-0 flex-shrink-0">
                    {["Privacy", "Terms", "Legal"].map((l) => (
                        <a
                            key={l}
                            href="#"
                            className="text-[10px] tracking-widest uppercase hover:opacity-70 transition-opacity"
                            style={{ fontFamily: "Inter, sans-serif", color: "#4d4732" }}
                        >
                            {l}
                        </a>
                    ))}
                </footer>
            </section>
        </div>
    );
}
