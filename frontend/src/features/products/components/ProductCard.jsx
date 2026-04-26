import { Link } from "react-router";

export default function ProductCard({ product }) {
    // Determine the variant to display (defaulting to the first variant if available)
    const displayVariant = product.variants && product.variants.length > 0 
        ? product.variants[0] 
        : product;

    // Use variant's image if available, otherwise base product image
    const displayImage = displayVariant.images?.[0]?.url || product.images?.[0]?.url || "/placeholder_product.png";
    const displayPrice = displayVariant.price?.amount || product.price?.amount || 0;
    const displayCurrency = displayVariant.price?.currency || product.currency || "INR";

    const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) ?? 0;
    const isOutOfStock = totalStock === 0 && product.variants?.length > 0;

    return (
        <div className="group relative flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-700">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#1c1b1b] rounded-sm">
                <img
                    src={displayImage}
                    alt={product.title}
                    className={`h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-40' : ''}`}
                />
                
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <span className="w-full text-center py-2 bg-black/80 border-y border-[#ffd700]/30 text-[#ffd700] text-[9px] tracking-[0.4em] uppercase font-black">
                            Out of Stock
                        </span>
                    </div>
                )}

                {/* Overlay on hover */}
                {!isOutOfStock && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <button 
                            className="bg-white text-black px-6 py-2.5 text-[10px] tracking-[0.2em] font-black uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Quick View
                        </button>
                    </div>
                )}


                {/* Seller Tag (subtle) */}
                <div className="absolute top-4 left-4">
                    <span 
                        className="text-[8px] tracking-[0.2em] uppercase font-bold px-2 py-1 backdrop-blur-md"
                        style={{ 
                            background: "rgba(19, 19, 19, 0.4)", 
                            color: "#999077",
                            border: "1px solid rgba(77, 71, 50, 0.2)"
                        }}
                    >
                        Autumn '25
                    </span>
                </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-1 px-1">
                <div className="flex justify-between items-start gap-4">
                    <h3 
                        className="text-xs md:text-sm font-bold tracking-wide uppercase truncate"
                        style={{ fontFamily: "Manrope, sans-serif", color: "#e5e2e1" }}
                    >
                        {product.title}
                    </h3>
                    <span 
                        className="text-xs md:text-sm font-extrabold"
                        style={{ color: "#ffd700" }}
                    >
                        {displayCurrency} {displayPrice}
                    </span>
                </div>
                <p 
                    className="text-[10px] tracking-wide line-clamp-1 opacity-50"
                    style={{ fontFamily: "Inter, sans-serif", color: "#d0c6ab" }}
                >
                    {product.description}
                </p>
            </div>


            {/* Hidden link for card hit area */}
            <Link to={`/product/${product._id}`} className="absolute inset-0 z-10" />
        </div>
    );
}
