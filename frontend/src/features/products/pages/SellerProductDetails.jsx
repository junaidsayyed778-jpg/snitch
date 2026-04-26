import { useParams, Link } from "react-router"
import { useProduct } from "../hook/useProduct"
import { useEffect, useState } from "react"

const SellerProductDetails = () => {
    const { productId } = useParams()
    const { handleProductsById, handleAddProductVariant } = useProduct()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    
    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Form State for New Variant
    const [newVariant, setNewVariant] = useState({
        title: "",
        description: "",
        stock: 0,
        priceAmount: "",
        attributes: [{ key: "", value: "" }], // Dynamic attributes
        images: []
    })
    const [imagePreviews, setImagePreviews] = useState([])


    async function fetchedProductDetails() {
        try {
            setLoading(true)
            const data = await handleProductsById(productId)
            setProduct(data)
        } catch (err) {
            console.log("failed to fetch details", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (productId) {
            fetchedProductDetails()
        }
    }, [productId])

    const handleAddAttribute = () => {
        setNewVariant(prev => ({
            ...prev,
            attributes: [...prev.attributes, { key: "", value: "" }]
        }))
    }

    const handleRemoveAttribute = (index) => {
        if (newVariant.attributes.length <= 1) return; // Keep at least one row
        const updated = [...newVariant.attributes]
        updated.splice(index, 1)
        setNewVariant(prev => ({ ...prev, attributes: updated }))
    }

    const handleAttributeChange = (index, field, value) => {
        const updated = [...newVariant.attributes]
        updated[index][field] = value
        setNewVariant(prev => ({ ...prev, attributes: updated }))
    }

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files)
        if (selectedFiles.length + newVariant.images.length > 7) {
            alert("Maximum 7 images allowed per variant")
            return
        }
        
        const newFiles = [...newVariant.images, ...selectedFiles]
        setNewVariant(prev => ({ ...prev, images: newFiles }))

        // Create previews
        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
        setImagePreviews(prev => [...prev, ...newPreviews])
    }

    const removeImage = (index) => {
        const updatedImages = [...newVariant.images]
        updatedImages.splice(index, 1)
        
        const updatedPreviews = [...imagePreviews]
        URL.revokeObjectURL(updatedPreviews[index])
        updatedPreviews.splice(index, 1)

        setNewVariant(prev => ({ ...prev, images: updatedImages }))
        setImagePreviews(updatedPreviews)
    }


    const validateForm = () => {
        // At least one attribute row must be fully filled
        const hasValidAttribute = newVariant.attributes.some(attr => attr.key.trim() && attr.value.trim())
        return hasValidAttribute && newVariant.images.length <= 7
    }

    const handleAddNewVariant = async () => {
        try {
            setIsSaving(true)
            
            // Transform attributes from array [{key, value}] to object {key: value}
            const attributeMap = {}
            newVariant.attributes.forEach(attr => {
                if (attr.key.trim() && attr.value.trim()) {
                    attributeMap[attr.key.trim()] = attr.value.trim()
                }
            })

            const payload = {
                ...newVariant,
                attributes: attributeMap
            }

            await handleAddProductVariant(productId, payload)
            
            // Reset state and close modal
            setNewVariant({
                title: "",
                description: "",
                stock: 0,
                priceAmount: "",
                attributes: [{ key: "", value: "" }],
                images: []
            })
            setImagePreviews([])
            setIsModalOpen(false)
            
            // Refresh UI with latest data from vault
            await fetchedProductDetails()

        } catch (err) {
            console.error("Failed to add variant", err)
        } finally {
            setIsSaving(false)
        }
    }

    const handleSubmitVariant = async (e) => {
        e.preventDefault()
        if (!validateForm()) return
        await handleAddNewVariant()
    }


    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-[#131313]">
                <div className="w-8 h-8 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-24 bg-[#131313] flex flex-col items-center justify-center text-[#e5e2e1]">
                <h2 className="text-xl font-black uppercase tracking-widest">Product Not Found</h2>
                <Link to="/seller/dashboard" className="mt-4 text-[10px] tracking-[0.3em] uppercase text-[#ffd700] underline">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-[#131313]">
            <div className="max-w-screen-xl mx-auto px-6 md:px-12">
                
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-12 border-b border-[#4d4732]/30 pb-8">
                    <div className="space-y-1">
                        <Link to="/seller/dashboard" className="text-[10px] tracking-[0.2em] uppercase text-[#999077] hover:text-[#ffd700] flex items-center gap-2 mb-2 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-black uppercase text-[#e5e2e1]" style={{ fontFamily: "Manrope, sans-serif" }}>
                            Manage <span className="text-[#ffd700]">Listing</span>
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 border border-[#ffd700] text-[#ffd700] text-[10px] tracking-[0.3em] font-black uppercase hover:bg-[#ffd700]/10 transition-all flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            Add Variant
                        </button>
                        <button 
                            onClick={() => fetchedProductDetails()}
                            className="px-6 py-3 bg-[#ffd700] text-[10px] tracking-[0.3em] font-black uppercase text-[#131313] hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                        >
                            <span className="material-symbols-outlined text-[16px]">save</span>
                            Save Listing
                        </button>
                    </div>

                </div>

                <div className="flex flex-col lg:flex-row gap-16 mb-20">
                    {/* Left: Image Preview */}
                    <div className="lg:w-1/2">
                        <div className="aspect-[4/5] bg-[#0c0c0c] rounded-sm overflow-hidden border border-[#4d4732]/20">
                            <img 
                                src={product.images?.[0]?.url || "/placeholder_product.png"} 
                                alt={product.title}
                                className="w-full h-full object-cover grayscale-[0.2]"
                            />
                        </div>
                    </div>

                    {/* Right: Data View */}
                    <div className="lg:w-1/2 space-y-10">
                        <div className="space-y-4">
                            <label className="text-[8px] tracking-[0.4em] uppercase font-black text-[#ffd700] opacity-60">Product Title</label>
                            <h2 className="text-2xl font-black text-[#e5e2e1] leading-tight uppercase tracking-tight">{product.title}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[8px] tracking-[0.4em] uppercase font-black text-[#ffd700] opacity-60">Base Price</label>
                                <p className="text-2xl font-bold text-[#e5e2e1]">{product.currency} {product.price?.amount}</p>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[8px] tracking-[0.4em] uppercase font-black text-[#ffd700] opacity-60">Listing Status</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    <p className="text-[10px] tracking-widest font-black text-[#e5e2e1] uppercase">Active Storefront</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[8px] tracking-[0.4em] uppercase font-black text-[#ffd700] opacity-60">Description</label>
                            <p className="text-sm leading-relaxed text-[#999077] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                                {product.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Variants Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffd700]">Registered Variants</h3>
                        <div className="flex-1 h-[1px] bg-white/5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {product.variants?.map((v, idx) => (
                            <Link 
                                to={`/seller/product/${productId}/variant/${v._id}`}
                                key={idx} 
                                className="bg-[#0c0c0c] border border-[#4d4732]/20 p-6 space-y-4 relative group hover:border-[#ffd700]/30 transition-all flex flex-col"
                            >
                                {v.images?.length > 0 && (
                                    <div className="aspect-square bg-[#131313] mb-2 overflow-hidden">
                                        <img 
                                            src={v.images[0].url} 
                                            alt={v.title} 
                                            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all"
                                        />
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <h4 className="text-[11px] font-black uppercase text-[#e5e2e1] tracking-widest">{v.title || "Untitled Variant"}</h4>
                                    <p className="text-[8px] text-[#999077] uppercase tracking-[0.2em] line-clamp-1">{v.description || "No description"}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {Object.entries(v.attributes).map(([key, val]) => (
                                        <div key={key} className="px-2 py-1 bg-white/5 border border-white/10 text-[7px] uppercase tracking-widest text-[#999077]">
                                            {key}: <span className="text-[#e5e2e1]">{val}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[8px] uppercase tracking-widest scale-90 origin-left text-[#6b6347]">Inventory</p>
                                        <p className="text-sm font-black text-[#e5e2e1]">{v.stock} UNITS</p>
                                    </div>
                                    <p className="text-lg font-black text-[#ffd700] font-mono">
                                        {v.price.currency} {v.price.amount}
                                    </p>
                                </div>
                            </Link>
                        ))}


                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="border border-dashed border-[#4d4732] p-8 flex flex-col items-center justify-center gap-4 text-[#4d4732] hover:text-[#ffd700] hover:border-[#ffd700] transition-all group"
                        >
                            <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">add</span>
                            <span className="text-[9px] uppercase tracking-[0.4em] font-black">Expand Collection</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal: Add Variant */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-[#0c0c0c] border border-[#4d4732] w-full max-w-2xl max-h-[90vh] overflow-y-auto pt-10 pb-12 px-8 md:px-12">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-[#4d4732] hover:text-[#ffd700]"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="mb-10 text-center">
                            <p className="text-[10px] tracking-[0.3em] uppercase text-[#ffd700] mb-2 font-black">Vault Entry</p>
                            <h2 className="text-3xl font-black text-[#e5e2e1] uppercase tracking-tighter">Initialize <span className="text-white">Variant</span></h2>
                        </div>

                        <form onSubmit={handleSubmitVariant} className="space-y-8">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Variant Title</label>
                                    <input 
                                        required
                                        placeholder="E.G. MIDNIGHT EDITION"
                                        value={newVariant.title}
                                        onChange={(e) => setNewVariant({ ...newVariant, title: e.target.value })}
                                        className="w-full bg-[#131313] border border-[#4d4732] px-4 py-3 text-[11px] font-bold text-[#e5e2e1] outline-none focus:border-[#ffd700] transition-colors uppercase tracking-widest"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Brief Insight</label>
                                    <input 
                                        placeholder="ONE SENTENCE ESSENCE"
                                        value={newVariant.description}
                                        onChange={(e) => setNewVariant({ ...newVariant, description: e.target.value })}
                                        className="w-full bg-[#131313] border border-[#4d4732] px-4 py-3 text-[11px] font-bold text-[#e5e2e1] outline-none focus:border-[#ffd700] transition-colors uppercase tracking-widest"
                                    />
                                </div>
                            </div>

                            
                            {/* Attributes Section */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Core Attributes (Min 1)</label>
                                    <button 
                                        type="button"
                                        onClick={handleAddAttribute}
                                        className="text-[9px] uppercase tracking-widest font-bold text-[#ffd700] flex items-center gap-1 hover:brightness-125"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">add_circle</span>
                                        Add Attribute
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {newVariant.attributes.map((attr, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <input 
                                                required
                                                placeholder="Key (e.g. Size, Color, Voltage)"
                                                value={attr.key}
                                                onChange={(e) => handleAttributeChange(idx, 'key', e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-[11px] text-[#e5e2e1] outline-none focus:border-[#ffd700]/40 transition-all font-bold placeholder:text-white/20 uppercase tracking-widest"
                                            />
                                            <input 
                                                required
                                                placeholder="Value (e.g. XL, Crimson, 220V)"
                                                value={attr.value}
                                                onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-[11px] text-[#e5e2e1] outline-none focus:border-[#ffd700]/40 transition-all font-bold placeholder:text-white/20 uppercase tracking-widest"
                                            />
                                            {newVariant.attributes.length > 1 && (
                                                <button 
                                                    type="button"
                                                    onClick={() => handleRemoveAttribute(idx)}
                                                    className="text-white/20 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Initial Stock</label>
                                    <input 
                                        type="number"
                                        value={newVariant.stock}
                                        onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                                        className="w-full bg-[#131313] border border-[#4d4732] px-4 py-3 text-[12px] font-bold text-[#e5e2e1] outline-none focus:border-[#ffd700] transition-colors"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Variant Price (Optional)</label>
                                    <input 
                                        placeholder={`Default ${product.price.amount}`}
                                        type="number"
                                        value={newVariant.priceAmount}
                                        onChange={(e) => setNewVariant({ ...newVariant, priceAmount: e.target.value })}
                                        className="w-full bg-[#131313] border border-[#4d4732] px-4 py-3 text-[12px] font-bold text-[#e5e2e1] outline-none focus:border-[#ffd700] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Media Assets ({newVariant.images.length}/7)</label>
                                    {newVariant.images.length > 0 && (
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setNewVariant({...newVariant, images: []})
                                                setImagePreviews([])
                                            }}
                                            className="text-[8px] uppercase tracking-widest text-red-500 font-bold hover:underline"
                                        >
                                            Reset Gallery
                                        </button>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-4">
                                    {imagePreviews.map((url, idx) => (
                                        <div key={idx} className="relative aspect-square bg-white/5 border border-white/10 group">
                                            <img src={url} className="w-full h-full object-cover grayscale-[0.5]" alt="Preview" />
                                            <button 
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <span className="material-symbols-outlined text-[12px]">close</span>
                                            </button>
                                        </div>
                                    ))}
                                    {newVariant.images.length < 7 && (
                                        <label 
                                            htmlFor="variant-images"
                                            className="aspect-square flex flex-col items-center justify-center border border-dashed border-[#4d4732] bg-white/5 cursor-pointer hover:border-[#ffd700]/40 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[#ffd700]/60 text-[18px]">add</span>
                                        </label>
                                    )}
                                </div>

                                <input 
                                    multiple
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="variant-images"
                                    accept="image/*"
                                />
                            </div>


                            <button 
                                disabled={!validateForm() || isSaving}
                                type="submit"
                                className="w-full h-16 bg-[#ffd700] text-[#131313] text-[12px] font-black uppercase tracking-[0.4em] flex items-center justify-center hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
                            >
                                {isSaving ? 'Synchronizing Vault...' : 'Initialize Variant'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SellerProductDetails