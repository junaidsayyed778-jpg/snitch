import { useSelector } from "react-redux"
import { Link } from "react-router"

export default function Profile() {
    const { user } = useSelector((state) => state.auth)

    if (!user) return null

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-[#131313]">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row items-center gap-10 border-b border-[#4d4732]/30 pb-16 mb-16 px-4">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#1c1b1b] border-2 border-[#4d4732]/40 flex items-center justify-center overflow-hidden transition-all duration-700 group-hover:border-[#ffd700]">
                            {user.profilePic ? (
                                <img src={user.profilePic} alt={user.fullname} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl md:text-5xl font-black text-[#ffd700] opacity-40">
                                    {user.fullname?.charAt(0)}
                                </span>
                            )}
                        </div>
                        <button className="absolute bottom-2 right-2 w-10 h-10 bg-[#ffd700] rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                             <span className="material-symbols-outlined text-[#131313] text-[20px]">edit</span>
                        </button>
                    </div>

                    <div className="text-center md:text-left space-y-4">
                        <div className="space-y-1">
                            <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#ffd700]">Gilded Member</span>
                            <h1 className="text-4xl font-black uppercase tracking-tight text-[#e5e2e1]" style={{ fontFamily: "Manrope, sans-serif" }}>
                                {user.fullname}
                            </h1>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span className="px-3 py-1 bg-[#1c1b1b] border border-[#4d4732] text-[8px] tracking-[0.2em] uppercase font-bold text-[#999077]">
                                {user.role}
                            </span>
                            <span className="text-xs text-[#999077] opacity-60 italic">— Since 2025</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
                    {/* Account Details */}
                    <div className="space-y-8">
                        <h2 className="text-xs tracking-[0.3em] uppercase font-black text-[#ffd700] border-l-2 border-[#ffd700] pl-4">Account Information</h2>
                        <div className="space-y-6 bg-[#0e0e0e]/50 p-6 rounded-sm border border-[#4d4732]/10">
                            <div className="space-y-1">
                                <label className="text-[8px] tracking-[0.2em] uppercase font-black opacity-30">Full Name</label>
                                <p className="text-sm font-bold text-[#e5e2e1]">{user.fullname}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] tracking-[0.2em] uppercase font-black opacity-30">Email Address</label>
                                <p className="text-sm font-bold text-[#e5e2e1]">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] tracking-[0.2em] uppercase font-black opacity-30">Contact Number</label>
                                <p className="text-sm font-bold text-[#e5e2e1]">{user.contact}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="space-y-8">
                        <h2 className="text-xs tracking-[0.3em] uppercase font-black text-[#ffd700] border-l-2 border-[#ffd700] pl-4">Member Insights</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1c1b1b] p-6 rounded-sm border border-[#4d4732]/20 hover:border-[#ffd700]/40 transition-all cursor-pointer group">
                                <span className="material-symbols-outlined text-[24px] text-[#ffd700] mb-2 group-hover:scale-110 transition-transform">receipt_long</span>
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#e5e2e1]">Orders</h3>
                                <p className="text-[8px] text-[#999077] uppercase mt-1">View history</p>
                            </div>
                            <div className="bg-[#1c1b1b] p-6 rounded-sm border border-[#4d4732]/20 hover:border-[#ffd700]/40 transition-all cursor-pointer group">
                                <span className="material-symbols-outlined text-[24px] text-[#ffd700] mb-2 group-hover:scale-110 transition-transform">favorite</span>
                                <h3 className="text-xs font-black uppercase tracking-widest text-[#e5e2e1]">Wishlist</h3>
                                <p className="text-[8px] text-[#999077] uppercase mt-1">Gilded picks</p>
                            </div>
                        </div>
                        
                        {user.role === "seller" && (
                            <Link to="/seller/dashboard" className="block w-full py-4 border border-[#ffd700]/30 text-[#ffd700] text-[10px] tracking-[0.3em] font-black uppercase text-center hover:bg-[#ffd700] hover:text-[#131313] transition-all">
                                Go to Seller Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
