import { useDispatch } from "react-redux"
import { getSellerProduct, createProduct, getAllProducts, getProductDetails, addProductVariant, updateProductVariant } from "../service/productApi"

import { setSellerProducts, setProducts, updateProductInList } from "../state/productSlice"

export const useProduct = () => {

    const dispatch = useDispatch()

    async function handleCreateProduct(formData) {
        const data = await createProduct(formData)

        return data.product
    }

    async function handleGetSellerProduct() {
    const data = await getSellerProduct()
    console.log("📦 [HOOK] handleGetSellerProduct received:", data?.products?.length, "products")
    
    if (Array.isArray(data?.products)) {
        dispatch(setSellerProducts(data.products))
    } else if (Array.isArray(data)) {
        dispatch(setSellerProducts(data))
    }
    return data.products || data
}

async function handleGetAllProducts(search) {
    const data = await getAllProducts(search)
    console.log("📦 [HOOK] handleGetAllProducts received:", data?.products?.length, "products")
    
    // ✅ Dispatch with array, not object
    if (Array.isArray(data?.products)) {
        dispatch(setProducts(data.products))
    } else if (Array.isArray(data)) {
        dispatch(setProducts(data))
    } else {
        console.warn("⚠️ [HOOK] Unexpected data format from getAllProducts:", data)
    }
    return data.products || data
}

    async function handleProductsById(productId) {
        const data = await getProductDetails(productId)
        return data.product
    }

    async function handleAddProductVariant(productId, newProductVariant) {
        const data = await addProductVariant(productId, newProductVariant)

        if (data?.product) {
            dispatch(updateProductInList(data.product))
        }

        return data
    }

    async function handleUpdateProductVariant(productId, variantId, formData) {
        const data = await updateProductVariant(productId, variantId, formData)

        // Assuming API returns the FULL updated product in data.product
        if (data?.product) {
            dispatch(updateProductInList(data.product))
        } else {
            console.warn("API did not return full product object after updating variant")
        }

        return data.product
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleProductsById,
        handleAddProductVariant,
        handleUpdateProductVariant
    }
}
