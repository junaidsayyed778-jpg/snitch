import { useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useCart } from "../hook/useCart"
import { useSelector } from "react-redux"
import { useRazorpay } from "react-razorpay";

export default function Cart() {
    const { items, subtotal, currency, loading, handleGetCart, handleUpdateQty, handleRemoveFromCart, handleClearCart } = useCart()
    const user = useSelector(s => s.auth.user)
    const navigate = useNavigate()
      const { error, isLoading, Razorpay } = useRazorpay();


    useEffect(() => {
        if (user) handleGetCart()
    }, [user])


    const handlePayment = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: 50000, // Amount in paise
      currency: "INR",
      name: "Test Company",
      description: "Test Transaction",
      order_id: "order_9A33XWu170gUtm", // Generate order_id on server
      handler: (response) => {
        console.log(response);
        alert("Payment Successful!");
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    }
}

    if (!user) {
        return (
            <div className="min-h-screen pt-24 md:pt-32 flex flex-col items-center justify-center bg-[#131313] text-[#e5e2e1]">
                <span className="material-symbols-outlined text-6xl mb-6 text-[#ffd700] opacity-50">lock</span>
                <h1 className="text-2xl font-black uppercase tracking-widest mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
                    Sign In Required
                </h1>
                <p className="text-[10px] tracking-[0.2em] uppercase opacity-50 mb-8">Please log in to view your cart</p>
                <Link to="/login"
                    className="px-10 py-4 bg-[#ffd700] text-[#131313] text-[10px] tracking-[0.3em] font-black uppercase hover:brightness-110 transition-all">
                    Sign In
                </Link>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-[#131313]">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#ffd700] animate-pulse">
                    Loading your bag...
                </p>
            </div>
        )
    }

    if (!items || items.length === 0) {
        return (
            <div className="min-h-screen pt-24 md:pt-32 flex flex-col items-center justify-center bg-[#131313] text-[#e5e2e1]">
                <span className="material-symbols-outlined text-6xl mb-6 text-[#ffd700] opacity-50">shopping_bag</span>
                <h1 className="text-2xl font-black uppercase tracking-widest mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
                    Your Bag is Empty
                </h1>
                <p className="text-[10px] tracking-[0.2em] uppercase opacity-50 mb-8">Discover our latest editorial collection</p>
                <Link to="/"
                    className="px-10 py-4 bg-[#ffd700] text-[#131313] text-[10px] tracking-[0.3em] font-black uppercase hover:brightness-110 transition-all">
                    Shop New Arrivals
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-[#131313]">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* Left: Item List */}
                    <div className="lg:w-2/3 space-y-10">
                        <div className="flex items-center justify-between border-b border-[#4d4732]/30 pb-6">
                            <h1 className="text-3xl font-black uppercase tracking-tight text-[#e5e2e1]"
                                style={{ fontFamily: "Manrope, sans-serif" }}>
                                Your <span className="text-[#ffd700]">Bag</span>
                            </h1>
                            <span className="text-[10px] tracking-[0.2em] uppercase text-[#999077] font-bold">
                                {items.length} Item{items.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <div className="space-y-8">
                            {items.map((item, idx) => (
                                <div key={`${item.productId}-${item.variantId}-${idx}`}
                                    className="flex gap-6 pb-8 border-b border-[#4d4732]/10 group">

                                    {/* Image */}
                                    <div className="w-24 h-32 md:w-32 md:h-40 bg-[#1c1b1b] overflow-hidden rounded-sm flex-shrink-0 cursor-pointer"
                                        onClick={() => navigate(`/product/${item.productId}`)}>
                                        <img
                                            src={item.images?.[0]?.url}
                                            alt={item.title}
                                            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div>
                                                    <h3
                                                        className="text-sm md:text-base font-bold uppercase text-[#e5e2e1] mb-1 cursor-pointer hover:text-[#ffd700] transition-colors"
                                                        onClick={() => navigate(`/product/${item.productId}`)}>
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-[10px] text-[#999077] uppercase tracking-wider">
                                                        {item.price?.currency} {item.price?.amount?.toLocaleString()}
                                                    </p>
                                                </div>

                                                {/* Attributes */}
                                                {item.attributes && Object.keys(item.attributes).length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries(item.attributes).map(([key, val]) => (
                                                            <div key={key}
                                                                className="px-2 py-0.5 bg-white/5 border border-white/10 text-[7px] tracking-widest uppercase text-[#999077]">
                                                                {key} <span>{val}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Stock warning */}
                                                {item.stock && item.quantity >= item.stock && (
                                                    <p className="text-[8px] text-amber-500 tracking-wider uppercase">
                                                        Max stock reached
                                                    </p>
                                                )}
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={() => handleRemoveFromCart(item.productId, item.variantId)}
                                                className="text-[#999077] hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">close</span>
                                            </button>
                                        </div>

                                        {/* Qty + Line Total */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-[#4d4732]/30 rounded-full h-8 px-2">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity > 1) {
                                                            handleUpdateQty(item.productId, item.variantId, item.quantity - 1)
                                                        } else {
                                                            handleRemoveFromCart(item.productId, item.variantId)
                                                        }
                                                    }}
                                                    className="w-6 h-6 flex items-center justify-center text-[#e5e2e1] hover:text-[#ffd700]">
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-[10px] font-bold text-[#ffd700]">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        if (!item.stock || item.quantity < item.stock) {
                                                            handleUpdateQty(item.productId, item.variantId, item.quantity + 1)
                                                        }
                                                    }}
                                                    disabled={item.stock && item.quantity >= item.stock}
                                                    className="w-6 h-6 flex items-center justify-center text-[#e5e2e1] hover:text-[#ffd700] disabled:opacity-30 disabled:cursor-not-allowed">
                                                    +
                                                </button>
                                            </div>
                                            <span className="text-sm font-black text-[#ffd700]">
                                                {item.price?.currency} {item.lineTotal?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleClearCart}
                            className="text-[8px] tracking-[0.4em] uppercase text-[#999077] hover:text-[#ffd700] transition-colors">
                            Clear Shopping Bag
                        </button>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-[#1c1b1b] p-8 space-y-8 border border-[#4d4732]/20 sticky top-28">
                            <h2 className="text-xs tracking-[0.3em] uppercase font-black text-[#ffd700] border-b border-[#ffd700]/20 pb-4">
                                Order Summary
                            </h2>

                            {/* Item breakdown */}
                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-[9px] tracking-wider uppercase font-bold text-[#999077]">
                                        <span className="truncate max-w-[60%]">{item.title}</span>
                                        <span>{item.price?.currency} {item.lineTotal?.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] tracking-wider uppercase font-bold text-[#999077]">
                                    <span>Subtotal</span>
                                    <span>{currency} {subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] tracking-wider uppercase font-bold text-[#999077]">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="h-px bg-[#4d4732]/30 my-6" />
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] tracking-[0.4em] uppercase font-black">Total</span>
                                    <span className="text-2xl font-black text-[#ffd700]">
                                        {currency} {subtotal?.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button onClick={handlePayment} className="w-full py-5 bg-[#ffd700] text-[#131313] text-[10px] tracking-[0.3em] font-black uppercase hover:brightness-110 active:scale-[0.98] transition-all">
                                Checkout
                            </button>

                            <div className="pt-4 flex items-center gap-3 justify-center opacity-30 grayscale">
                                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                                <span className="text-[8px] tracking-[0.3em] uppercase font-bold">Secure Editorial Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}