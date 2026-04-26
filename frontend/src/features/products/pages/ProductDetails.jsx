import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../hook/useProduct';
import { useSelector } from 'react-redux';
import { useCart } from '../hook/useCart';
import { getAllProducts } from '../service/productApi';
import ProductCard from '../components/ProductCard';

// Safely convert Mongoose Map OR plain object attributes → plain JS object
function normalizeAttrs(attrs) {
    if (!attrs) return {};
    if (attrs instanceof Map) return Object.fromEntries(attrs);
    if (typeof attrs === 'object' && !Array.isArray(attrs)) return { ...attrs };
    return {};
}

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [adding, setAdding] = useState(false);
    const [addedFeedback, setAddedFeedback] = useState(false);
    const [stockError, setStockError] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isStickyVisible, setIsStickyVisible] = useState(false);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const navigate = useNavigate();
    const { handleProductsById } = useProduct();
    const { handleAddToCart, items: cartItems } = useCart();
    const user = useSelector(state => state.auth.user);

    async function fetchProductDetails() {
        try {
            const data = await handleProductsById(productId);
            setProduct(data?.product || data);
        } catch (error) {
            console.error('Failed to fetch product details', error);
        }
    }

    useEffect(() => { fetchProductDetails(); }, [productId]);

    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedAttributes(normalizeAttrs(product.variants[0].attributes));
        }
    }, [product]);

    // Fetch Related Products
    useEffect(() => {
        async function fetchRelated() {
            try {
                const data = await getAllProducts();
                const all = data?.products || data;
                if (Array.isArray(all)) {
                    // Filter out current product
                    const filtered = all.filter(p => p._id !== productId).slice(0, 6);
                    setRelatedProducts(filtered);
                }
            } catch (err) {
                console.error("Failed to fetch related products", err);
            }
        }
        fetchRelated();
    }, [productId]);

    // Sticky CTA Visibility Logic
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 800) {
                setIsStickyVisible(true);
            } else {
                setIsStickyVisible(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Get all unique attribute keys and their values
    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};
        const attrs = {};
        product.variants.forEach(variant => {
            if (variant.attributes) {
                const attrObj = normalizeAttrs(variant.attributes);
                Object.entries(attrObj).forEach(([key, value]) => {
                    if (!attrs[key]) attrs[key] = new Set();
                    attrs[key].add(value);
                });
            }
        });
        // Sort sizes
        const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL'];
        Object.keys(attrs).forEach(key => {
            const arr = Array.from(attrs[key]);
            attrs[key] = key.toLowerCase().includes('size')
                ? arr.sort((a, b) => {
                    const ia = sizeOrder.indexOf(String(a).toUpperCase());
                    const ib = sizeOrder.indexOf(String(b).toUpperCase());
                    if (ia !== -1 && ib !== -1) return ia - ib;
                    return String(a).localeCompare(String(b));
                })
                : arr;
        });
        return attrs;
    }, [product]);

    // Active variant matching current selection
    const activeVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return null;
        return product.variants.find(v => {
            if (!v.attributes) return false;
            const vAttrs = normalizeAttrs(v.attributes);
            const keys = Object.keys(vAttrs);
            return keys.length === Object.keys(selectedAttributes).length &&
                keys.every(k => vAttrs[k] === selectedAttributes[k]);
        }) || null;
    }, [product, selectedAttributes]);

    // Find a variant by one specific attribute value (used for color swatch lookup)
    const getVariantByAttrValue = (attrName, value) => {
        if (!product?.variants) return null;
        return product.variants.find(v => {
            if (!v.attributes) return false;
            return normalizeAttrs(v.attributes)[attrName] === value;
        });
    };

    const handleAttributeChange = (attrName, value) => {
        const newAttrs = { ...selectedAttributes, [attrName]: value };
        const exactMatch = product.variants.find(v => {
            if (!v.attributes) return false;
            const vAttrs = normalizeAttrs(v.attributes);
            const keys = new Set([...Object.keys(newAttrs), ...Object.keys(vAttrs)]);
            return Array.from(keys).every(k => newAttrs[k] === vAttrs[k]);
        });
        if (exactMatch) {
            setSelectedAttributes(normalizeAttrs(exactMatch.attributes));
        } else {
            const fallback = product.variants.find(v => {
                if (!v.attributes) return false;
                return normalizeAttrs(v.attributes)[attrName] === value;
            });
            if (fallback) {
                setSelectedAttributes(normalizeAttrs(fallback.attributes));
            } else {
                setSelectedAttributes(newAttrs);
            }
        }
        setStockError('');
    };

    // How many of active variant are already in cart
    const cartQtyForVariant = useMemo(() => {
        if (!activeVariant) return 0;
        const inCart = cartItems?.find(
            i => i.productId === productId && i.variantId === activeVariant._id
        );
        return inCart?.quantity || 0;
    }, [cartItems, activeVariant, productId]);

    useEffect(() => { setSelectedImage(0); }, [activeVariant]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#131313' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: '#ffd700' }}
                    className="text-[10px] uppercase tracking-[0.2em] font-black animate-pulse">
                    Retrieving piece...
                </p>
            </div>
        );
    }

    const displayImages = (activeVariant?.images?.length > 0)
        ? activeVariant.images
        : (product.images?.length > 0 ? product.images : []);

    const displayPrice = activeVariant?.price?.amount
        ? activeVariant.price
        : product.price;

    // Determine if this is a color attribute
    const isColorAttr = (key) => key.toLowerCase().includes('color') || key.toLowerCase() === 'colour';

    async function handleAddToBag() {
        if (!user) { navigate('/login'); return; }
        
        const hasVariants = product.variants?.length > 0;
        
        if (hasVariants && !activeVariant) { 
            setStockError('Please select a variant first.'); 
            return; 
        }

        const stock = hasVariants ? activeVariant.stock : 999; // Assume unlimited if no variant stock tracking
        const currentQty = hasVariants ? cartQtyForVariant : (cartItems?.find(i => i.productId === productId && !i.variantId)?.quantity || 0);

        if (hasVariants && activeVariant.stock <= 0) { 
            setStockError('This variant is out of stock.'); 
            return; 
        }
        
        if (hasVariants && currentQty >= stock) {
            setStockError(`Only ${stock} available. You already have ${currentQty} in bag.`);
            return;
        }

        try {
            setAdding(true);
            setStockError('');
            await handleAddToCart(productId, activeVariant?._id || null, 1);
            setAddedFeedback(true);
            setTimeout(() => setAddedFeedback(false), 2000);
        } catch (err) {
            const msg = err?.response?.data?.message || 'Could not add to bag.';
            setStockError(msg);
        } finally {
            setAdding(false);
        }
    }

    const isAtStockLimit = product.variants?.length > 0
        ? (activeVariant ? (cartQtyForVariant >= activeVariant.stock || activeVariant.stock <= 0) : false)
        : false;

    return (
        <div className="min-h-screen transition-colors duration-500 overflow-x-hidden"
            style={{ backgroundColor: '#131313', color: '#e5e2e1', fontFamily: 'Inter, sans-serif' }}>

            {/* Gold glow blobs */}
            <div className="fixed top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.07]"
                style={{ background: '#ffd700', filter: 'blur(120px)' }} />
            <div className="fixed bottom-[-50px] left-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.05]"
                style={{ background: '#ffd700', filter: 'blur(100px)' }} />

            <div className="relative z-10">
                {/* Nav */}
                <nav className="flex justify-between items-center px-8 lg:px-16 py-8">
                    <Link to="/"
                        className="text-xl font-black tracking-[-0.05em] uppercase hover:opacity-80 transition-opacity"
                        style={{ fontFamily: 'Manrope, sans-serif', color: '#ffd700' }}>
                        SNITCH.
                    </Link>
                    <button onClick={() => navigate(-1)}
                        className="text-[10px] uppercase tracking-[0.25em] font-semibold transition-all hover:text-[#ffd700] flex items-center gap-2"
                        style={{ color: '#999077' }}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                        Return to Archive
                    </button>
                </nav>

                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-8 lg:pt-16 pb-24">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                        {/* LEFT: Image Gallery */}
                        <div className="w-full lg:w-[65%] flex flex-col-reverse md:flex-row gap-4 lg:gap-6">
                            {displayImages.length > 1 && (
                                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-20 lg:w-24 flex-shrink-0 md:max-h-[calc(100vh-250px)]">
                                    {displayImages.map((img, idx) => (
                                        <button key={idx} onClick={() => setSelectedImage(idx)}
                                            className={`flex-shrink-0 w-20 md:w-full aspect-[4/5] overflow-hidden transition-all duration-300 border ${selectedImage === idx ? 'opacity-100 border-[#ffd700]' : 'opacity-40 hover:opacity-100 border-[#4d4732]'}`}
                                            style={{ backgroundColor: '#1c1b1b' }}>
                                            <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="relative w-full aspect-[4/5] overflow-hidden group border border-[#4d4732]" style={{ backgroundColor: '#1c1b1b' }}>
                                <button 
                                    onClick={() => setShowLightbox(true)}
                                    className="w-full h-full cursor-zoom-in"
                                >
                                    <img
                                        src={displayImages[selectedImage]?.url || displayImages[0]?.url}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                </button>
                                {displayImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImage(p => p === 0 ? displayImages.length - 1 : p - 1)}
                                            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-[#4d4732] backdrop-blur-md"
                                            style={{ backgroundColor: 'rgba(19,19,19,0.7)', color: '#ffd700' }}>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
                                        </button>
                                        <button
                                            onClick={() => setSelectedImage(p => p === displayImages.length - 1 ? 0 : p + 1)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border border-[#4d4732] backdrop-blur-md"
                                            style={{ backgroundColor: 'rgba(19,19,19,0.7)', color: '#ffd700' }}>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Product Info */}
                        <div className="w-full lg:w-[35%] lg:sticky lg:top-24 flex flex-col pt-4">
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase leading-[0.9] mb-6 tracking-tighter"
                                style={{ fontFamily: 'Manrope, sans-serif', color: '#ffd700' }}>
                                {product.title}
                            </h1>

                            <div className="mb-8 flex items-baseline gap-2">
                                <span className="text-xl md:text-2xl font-black tracking-tight" style={{ color: '#e5e2e1' }}>
                                    {displayPrice?.currency || product.currency} {displayPrice?.amount?.toLocaleString()}
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.3em] font-black" style={{ color: '#999077' }}>
                                    Incl. Taxes
                                </span>
                            </div>

                            <div className="h-px w-full mb-8" style={{ backgroundColor: '#4d4732' }} />

                            {/* ── VARIANT SELECTORS ── */}
                            {Object.entries(availableAttributes).map(([attrName, values]) => {
                                const isColor = isColorAttr(attrName);
                                return (
                                    <div key={attrName} className="mb-8">
                                        <h3 className="text-[9px] uppercase tracking-[0.4em] font-black mb-4 flex justify-between items-center" style={{ color: '#999077' }}>
                                            <span>
                                                {attrName}
                                                {isColor && activeVariant && (
                                                    <span className="ml-3 normal-case tracking-normal opacity-60 text-[#e5e2e1]">
                                                        — {selectedAttributes[attrName]}
                                                    </span>
                                                )}
                                            </span>
                                            {attrName.toLowerCase().includes('size') && (
                                                <button 
                                                    onClick={() => setShowSizeGuide(true)}
                                                    className="text-[8px] underline tracking-[0.1em] hover:text-[#ffd700] transition-colors"
                                                >
                                                    Size Guide
                                                </button>
                                            )}
                                        </h3>

                                        <div className="flex flex-wrap gap-3">
                                            {values.map(val => {
                                                const isSelected = selectedAttributes[attrName] === val;
                                                const matchedVariant = getVariantByAttrValue(attrName, val);
                                                const variantImg = matchedVariant?.images?.[0]?.url;
                                                const isOutOfStock = matchedVariant && matchedVariant.stock <= 0;

                                                if (isColor && variantImg) {
                                                    // Render as IMAGE SWATCH
                                                    return (
                                                        <button
                                                            key={val}
                                                            onClick={() => handleAttributeChange(attrName, val)}
                                                            title={val}
                                                            className="relative group/swatch flex-shrink-0"
                                                            style={{ outline: 'none' }}>
                                                            <div className={`w-16 h-20 overflow-hidden transition-all duration-300 ${isSelected
                                                                ? 'ring-2 ring-[#ffd700] ring-offset-2 ring-offset-[#131313] scale-105'
                                                                : 'ring-1 ring-[#4d4732] hover:ring-[#ffd700] opacity-60 hover:opacity-100'
                                                                } ${isOutOfStock ? 'opacity-30' : ''}`}>
                                                                <img src={variantImg} alt={val}
                                                                    className="w-full h-full object-cover" />
                                                                {isOutOfStock && (
                                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                                        <div className="w-full h-px bg-red-500/70 rotate-45" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Tooltip on hover */}
                                                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-wider whitespace-nowrap opacity-0 group-hover/swatch:opacity-100 transition-opacity pointer-events-none"
                                                                style={{ color: '#999077' }}>
                                                                {val}
                                                            </span>
                                                        </button>
                                                    );
                                                }

                                                // Render as TEXT CHIP (for size, material, etc.)
                                                return (
                                                    <button
                                                        key={val}
                                                        onClick={() => handleAttributeChange(attrName, val)}
                                                        disabled={isOutOfStock}
                                                        className={`relative px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] font-black transition-all duration-300 border
                                                            ${isSelected ? 'border-[#ffd700] bg-[#ffd700] text-[#221b00]' : 'border-[#4d4732] text-[#e5e2e1] hover:border-[#ffd700] bg-[#1c1b1b]'}
                                                            ${isOutOfStock ? 'opacity-30 cursor-not-allowed line-through' : ''}`}>
                                                        {val}
                                                        {isOutOfStock && (
                                                            <div className="absolute inset-0 flex items-end justify-end pb-1 pr-1 pointer-events-none">
                                                                <span className="text-red-500 text-[6px]">OOS</span>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Stock indicator */}
                            {activeVariant && activeVariant.stock !== undefined && (
                                <div className="mb-8 flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${activeVariant.stock > 0 ? 'bg-[#ffd700]' : 'bg-red-500'}`} />
                                    <span className={`text-[9px] uppercase tracking-[0.3em] font-black ${activeVariant.stock > 0 ? 'text-[#e5e2e1]' : 'text-red-500'}`}>
                                        {activeVariant.stock > 0 ? `${activeVariant.stock} Pieces Available` : 'Out of Stock'}
                                    </span>
                                </div>
                            )}

                            {/* Stock error */}
                            {stockError && (
                                <div className="mb-4 px-4 py-3 border border-red-500/30 bg-red-500/10">
                                    <p className="text-[10px] text-red-400 tracking-wider">{stockError}</p>
                                </div>
                            )}

                            <div className="mb-12">
                                <h3 className="text-[9px] uppercase tracking-[0.4em] font-black mb-4" style={{ color: '#999077' }}>
                                    Description
                                </h3>
                                <p className="text-sm leading-relaxed font-medium" style={{ color: '#d0c6ab' }}>
                                    {product.description}
                                </p>
                            </div>

                            {/* Add to Bag & Wishlist */}
                            <div className="flex gap-4 mt-auto">
                                <button
                                    onClick={handleAddToBag}
                                    disabled={adding || isAtStockLimit}
                                    className="flex-1 py-5 text-[11px] uppercase tracking-[0.4em] font-black transition-all duration-500 active:scale-[0.98] border border-transparent shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{
                                        background: isAtStockLimit
                                            ? '#1c1b1b'
                                            : addedFeedback
                                                ? '#1c1b1b'
                                                : 'linear-gradient(135deg, #ffe16d 0%, #ffd700 100%)',
                                        color: (addedFeedback || isAtStockLimit) ? '#ffd700' : '#221b00',
                                        fontFamily: "'Manrope', sans-serif",
                                    }}>
                                    {adding ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Adding...
                                        </span>
                                    ) : addedFeedback ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Secured in Bag
                                        </span>
                                    ) : isAtStockLimit ? (
                                        activeVariant?.stock <= 0 ? 'Out of Stock' : `Max Stock Reached (${activeVariant.stock})`
                                    ) : 'Add to Shopping Bag'}
                                </button>
                                
                                <button 
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className="w-16 flex items-center justify-center border border-[#4d4732] hover:border-[#ffd700] transition-colors"
                                    style={{ backgroundColor: '#1c1b1b' }}
                                >
                                    <svg 
                                        className={`w-5 h-5 transition-colors duration-300 ${isWishlisted ? 'fill-[#ffd700] stroke-[#ffd700]' : 'fill-none stroke-[#999077]'}`} 
                                        viewBox="0 0 24 24" 
                                        strokeWidth="2"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Details table */}
                            <div className="mt-14 space-y-4 text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: '#999077' }}>
                                {[['Shipping', 'Complimentary'], ['Returns', '14-Day Window'], ['Support', '24/7 Concierge']].map(([k, v]) => (
                                    <div key={k} className="flex justify-between border-b border-[#1c1b1b] pb-3">
                                        <span>{k}</span>
                                        <span style={{ color: '#e5e2e1' }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-24 border-t border-[#4d4732]/30 mt-12">
                        <div className="flex justify-between items-end mb-12">
                            <div className="space-y-3">
                                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                    You May <span className="opacity-40">Also Like</span>
                                </h2>
                                <div className="w-16 h-1" style={{ background: '#ffd700' }} />
                            </div>
                            <Link to="/" className="text-[10px] uppercase tracking-[0.3em] font-black text-[#999077] hover:text-[#ffd700] transition-colors">
                                View Collection
                            </Link>
                        </div>
                        
                        <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x">
                            {relatedProducts.map(rp => (
                                <div key={rp._id} className="min-w-[280px] md:min-w-[320px] snap-start">
                                    <ProductCard product={rp} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Reviews Section */}
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-24 border-t border-[#4d4732]/30 mt-12">
                    <div className="flex flex-col md:flex-row gap-16">
                        {/* Rating Summary */}
                        <div className="md:w-1/3 space-y-6">
                            <h2 className="text-2xl font-black uppercase tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                Guest <span className="opacity-40">Reviews</span>
                            </h2>
                            <div className="flex items-center gap-4">
                                <span className="text-6xl font-black text-[#ffd700]">4.8</span>
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {[1,2,3,4,5].map(i => (
                                            <svg key={i} className="w-4 h-4 fill-[#ffd700]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                        ))}
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-[#999077]">Based on 124 Reviews</p>
                                </div>
                            </div>
                            <div className="space-y-3 pt-4">
                                {[5,4,3,2,1].map(star => (
                                    <div key={star} className="flex items-center gap-4">
                                        <span className="text-[8px] w-2">{star}</span>
                                        <div className="flex-1 h-1 bg-[#1c1b1b] overflow-hidden">
                                            <div 
                                                className="h-full bg-[#ffd700]/60" 
                                                style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '2%' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* User Reviews List */}
                        <div className="md:w-2/3 space-y-12">
                            {[
                                { name: "Alexander K.", date: "Feb 12, 2025", text: "The weight and drape of this fabric is exceptional. Worth every penny of the premium price tag.", rating: 5 },
                                { name: "Marcus V.", date: "Jan 28, 2025", text: "Clean lines and perfect fit. The nocturnal collection really hits different.", rating: 5 }
                            ].map((rev, idx) => (
                                <div key={idx} className="space-y-4 pb-8 border-b border-[#1c1b1b]">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-1">
                                            {[...Array(rev.rating)].map((_, i) => (
                                                <svg key={i} className="w-3 h-3 fill-[#ffd700]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                            ))}
                                        </div>
                                        <span className="text-[8px] text-[#999077] uppercase tracking-widest">{rev.date}</span>
                                    </div>
                                    <p className="text-xs leading-relaxed text-[#d0c6ab]">{rev.text}</p>
                                    <p className="text-[10px] font-black uppercase tracking-tight text-[#e5e2e1]">{rev.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {showLightbox && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
                    <div 
                        className="absolute inset-0 bg-black/95 backdrop-blur-sm" 
                        onClick={() => setShowLightbox(false)}
                    />
                    <div className="relative max-w-4xl w-full h-full flex items-center justify-center pointer-events-none">
                        <img 
                            src={displayImages[selectedImage]?.url || displayImages[0]?.url} 
                            className="max-w-full max-h-full object-contain pointer-events-auto"
                        />
                        <button 
                            onClick={() => setShowLightbox(false)}
                            className="absolute top-0 right-0 p-4 text-[#ffd700] pointer-events-auto hover:scale-110 transition-transform"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Size Guide Modal */}
            {showSizeGuide && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in zoom-in-95 duration-300">
                    <div 
                        className="absolute inset-0 bg-[#131313]/90 backdrop-blur-md" 
                        onClick={() => setShowSizeGuide(false)}
                    />
                    <div className="relative w-full max-w-lg bg-[#1c1b1b] border border-[#4d4732] p-8 md:p-12 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black uppercase tracking-tighter" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                Size <span className="text-[#ffd700]">Chart</span>
                            </h2>
                            <button onClick={() => setShowSizeGuide(false)} className="text-[#999077] hover:text-[#ffd700]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto text-[10px] tracking-wide">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-[#4d4732]">
                                        <th className="py-4 text-left uppercase text-[#999077]">Size</th>
                                        <th className="py-4 text-left uppercase text-[#999077]">Chest (in)</th>
                                        <th className="py-4 text-left uppercase text-[#999077]">Waist (in)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[["S", "36-38", "30-32"], ["M", "39-41", "33-35"], ["L", "42-44", "36-38"], ["XL", "45-47", "39-41"]].map(([s, c, w]) => (
                                        <tr key={s} className="border-b border-[#4d4732]/30">
                                            <td className="py-4 font-black">{s}</td>
                                            <td className="py-4 opacity-70">{c}</td>
                                            <td className="py-4 opacity-70">{w}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <p className="text-[8px] text-[#999077] uppercase tracking-widest leading-loose">
                            * Measurements are for garment dimensions. For the best fit, we recommend measuring a piece you already own and compare.
                        </p>
                    </div>
                </div>
            )}

            {/* Sticky Mobile CTA */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#131313]/90 backdrop-blur-xl border-t border-[#4d4732]/30 lg:hidden transition-transform duration-500 ${isStickyVisible ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <img src={displayImages[0]?.url} className="w-12 h-16 object-cover" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black uppercase truncate text-[#ffd700]">{product.title}</span>
                            <span className="text-xs font-bold">{displayPrice?.currency} {displayPrice?.amount}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleAddToBag}
                        disabled={adding || isAtStockLimit}
                        className="px-6 py-3 bg-[#ffd700] text-[#131313] text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                    >
                        {adding ? '...' : (addedFeedback ? 'Added' : 'Add')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;