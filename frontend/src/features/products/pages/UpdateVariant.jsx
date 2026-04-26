import { useParams, useNavigate, Link } from "react-router"
import { useProduct } from "../hook/useProduct"
import { useEffect, useState } from "react"

const UpdateVariant = () => {
    const { productId, variantId } = useParams()
    const navigate = useNavigate()
    const { handleProductsById, handleUpdateProductVariant } = useProduct()
    
    const [product, setProduct] = useState(null)
    const [variant, setVariant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        stock: 0,
        priceAmount: "",
        attributes: []
    })
    const [newImages, setNewImages] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])

    async function fetchData() {
        try {
            setLoading(true)
            const p = await handleProductsById(productId)
            setProduct(p)
            const v = p.variants.find(varnt => varnt._id === variantId)
            if (v) {
                setVariant(v)
                setFormData({
                    title: v.title || "",
                    description: v.description || "",
                    stock: v.stock || 0,
                    priceAmount: v.price?.amount || "",
                    attributes: Object.entries(v.attributes || {}).map(([key, value]) => ({ key, value }))
                })
            }
        } catch (err) {
            console.error("Fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [productId, variantId])

    const handleAttributeChange = (index, field, value) => {
        const updated = [...formData.attributes]
        updated[index][field] = value
        setFormData({ ...formData, attributes: updated })
    }

    const addAttribute = () => {
        setFormData({ ...formData, attributes: [...formData.attributes, { key: "", value: "" }] })
    }

    const removeAttribute = (index) => {
        const updated = [...formData.attributes]
        updated.splice(index, 1)
        setFormData({ ...formData, attributes: updated })
    }

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files)
        if (selectedFiles.length > 7) {
            alert("Maximum 7 images allowed")
            return
        }
        setNewImages(selectedFiles)
        const previews = selectedFiles.map(file => URL.createObjectURL(file))
        setImagePreviews(previews)
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            setIsSaving(true)
            
            const submitData = new FormData()
            submitData.append("title", formData.title)
            submitData.append("description", formData.description)
            submitData.append("stock", formData.stock)
            submitData.append("priceAmount", formData.priceAmount)
            
            const attributeMap = {}
            formData.attributes.forEach(attr => {
                if (attr.key.trim() && attr.value.trim()) {
                    attributeMap[attr.key.trim()] = attr.value.trim()
                }
            })
            submitData.append("attributes", JSON.stringify(attributeMap))

            newImages.forEach(file => {
                submitData.append("images", file)
            })

            await handleUpdateProductVariant(productId, variantId, submitData)
            navigate(`/seller/product/${productId}`)
        } catch (err) {
            console.error("Update failed:", err)
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen pt-24 flex items-center justify-center bg-[#131313]">
            <div className="w-8 h-8 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (!variant) return <div className="pt-32 text-center text-white">Variant Not Found</div>

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#131313]">
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-12 border-b border-[#4d4732]/30 pb-8 flex justify-between items-end">
                    <div className="space-y-1">
                        <Link to={`/seller/product/${productId}`} className="text-[10px] tracking-[0.2em] uppercase text-[#999077] hover:text-[#ffd700] flex items-center gap-2 mb-2 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                            Product Vault
                        </Link>
                        <h1 className="text-3xl font-black uppercase text-[#e5e2e1]" style={{ fontFamily: "Manrope, sans-serif" }}>
                            Refine <span className="text-[#ffd700]">Variant</span>
                        </h1>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Variant Designation</label>
                                <input 
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-[#0c0c0c] border border-[#4d4732] px-4 py-3 text-[12px] font-bold text-[#e5e2e1] outline-none focus:border-[#ffd700] transition-colors uppercase tracking-widest"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Variant Context</label>
                                <textarea 
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-[#0c0c0c] border border-[#4d4732] px-4 py-3 text-[12px] font-bold text-[#e5e2e1] outline-none focus:border-[#ffd700] transition-colors uppercase tracking-widest resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Quantifiable Stock</label>
                                    <input 
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full bg-[#0c0c0c] border border-[#4d4732] px-4 py-3 text-[12px] font-bold text-[#e5e2e1] outline-none focus:border-[#ffd700] transition-colors font-mono"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Asset Valuation</label>
                                    <input 
                                        type="number"
                                        value={formData.priceAmount}
                                        onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                                        className="w-full bg-[#0c0c0c] border border-[#4d4732] px-4 py-3 text-[12px] font-bold text-[#e5e2e1] outline-none focus:border-[#ffd700] transition-colors font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Specific Identifiers</label>
                                    <button type="button" onClick={addAttribute} className="text-[9px] uppercase tracking-widest text-[#ffd700] font-bold">+ New Row</button>
                                </div>
                                <div className="space-y-2">
                                    {formData.attributes.map((attr, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input 
                                                value={attr.key} 
                                                onChange={(e) => handleAttributeChange(i, 'key', e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-[10px] text-[#e5e2e1] outline-none uppercase tracking-widest" 
                                            />
                                            <input 
                                                value={attr.value} 
                                                onChange={(e) => handleAttributeChange(i, 'value', e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-[10px] text-[#e5e2e1] outline-none uppercase tracking-widest" 
                                            />
                                            <button type="button" onClick={() => removeAttribute(i)} className="text-white/20 hover:text-red-500">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <div className="space-y-2">
                                <label className="text-[8px] tracking-[0.3em] uppercase font-black text-[#ffd700]">Visual Assets</label>
                                <p className="text-[10px] text-[#999077] uppercase tracking-widest italic">New selection overrides current gallery</p>
                            </div>
                            <input type="file" multiple id="new-images" className="hidden" onChange={handleFileChange} />
                            <label htmlFor="new-images" className="px-4 py-2 border border-[#ffd700]/30 text-[#ffd700] text-[9px] uppercase tracking-[0.2em] font-black cursor-pointer hover:bg-[#ffd700]/10 transition-all">
                                Update Gallery
                            </label>
                        </div>
                        
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                            {(imagePreviews.length > 0 ? imagePreviews : variant.images.map(img => img.url)).map((url, idx) => (
                                <div key={idx} className="aspect-square bg-[#0c0c0c] border border-[#4d4732]/40 overflow-hidden relative group">
                                    <img src={url} className="w-full h-full object-cover grayscale-[0.3]" />
                                    {imagePreviews.length > 0 && <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-[8px] text-white font-black uppercase tracking-widest">Selected</p>
                                    </div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 flex gap-4">
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 h-14 bg-[#ffd700] text-[#131313] text-[11px] font-black uppercase tracking-[0.4em] hover:brightness-110 disabled:opacity-50 transition-all"
                        >
                            {isSaving ? "Synchronizing Vault..." : "Commit Changes"}
                        </button>
                        <button 
                            type="button"
                            onClick={() => navigate(`/seller/product/${productId}`)}
                            className="px-10 h-14 border border-[#4d4732] text-[#e5e2e1] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white/5 transition-all"
                        >
                            Abort
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateVariant
