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
            <div
                className="input-line absolute bottom-0 h-[2px]"
                style={{ background: "#ffd700" }}
            />
        </div>
    );
}

export default function Login() {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();
    const { error } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handle = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
       e.preventDefault()
       try{
        const user = await handleLogin({
            email: form.email,
            password: form.password
        })
        if(user.role == "buyer"){
            navigate("/")
        }
        else if(user.role == "seller"){
            navigate("/seller/dashboard")
        }
       }
       catch(err){
        console.log(err)    
       }
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
                    backgroundColor: "#0e0e0e",
                }}
            >
                {/* Dark overlay */}
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

                {/* Content wrapper */}
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
                            WELCOME<br />BACK.
                        </h1>
                        <p
                            className="text-lg leading-relaxed font-medium drop-shadow-md"
                            style={{ fontFamily: "Inter, sans-serif", color: "#e5e2e1" }}
                        >
                            Your wardrobe awaits.<br />
                            Pick up where you left off.
                        </p>
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
                RIGHT PANEL — Login Form
            ═══════════════════════════════════════════ */}
            <section
                className="flex-1 flex flex-col justify-between h-full overflow-y-auto [&::-webkit-scrollbar]:hidden"
                style={{ background: "#131313", scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {/* Mobile top bar */}
                <header
                    className="lg:hidden flex items-center justify-center h-16 border-b flex-shrink-0"
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
                        <div className="mb-8">
                            <h2
                                className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-2"
                                style={{ fontFamily: "Manrope, sans-serif", color: "#ffd700" }}
                            >
                                Sign in to your account
                            </h2>
                            <p
                                className="text-sm"
                                style={{ fontFamily: "Inter, sans-serif", color: "#d0c6ab" }}
                            >
                                Don&apos;t have one?{" "}
                                <a
                                    href="/register"
                                    className="underline underline-offset-4 transition-colors hover:opacity-80"
                                    style={{ color: "#ffd700" }}
                                >
                                    Create account
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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Field
                                id="email"
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
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

                            {/* Submit */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full h-12 md:h-14 font-extrabold uppercase tracking-[0.2em] rounded-lg transition-all active:scale-[0.98] hover:brightness-110 cursor-pointer"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        background: "linear-gradient(135deg, #ffe16d 0%, #ffd700 100%)",
                                        color: "#221b00",
                                    }}
                                >
                                    Sign In
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
