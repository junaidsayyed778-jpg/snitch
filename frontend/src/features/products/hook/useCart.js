import { useDispatch, useSelector } from "react-redux"
import { fetchCart, addItemToCart, updateItemQuantity, removeItemFromCart, clearCartApi } from "../service/cartApi"
import { setCart, setCartLoading, setCartError, clearServerCart } from "../state/serverCartSlice"

export const useCart = () => {
    const dispatch = useDispatch()
    const { items, subtotal, itemCount, currency, loading } = useSelector(s => s.serverCart)
    const user = useSelector(s => s.auth.user)

    async function handleGetCart() {
        if (!user) return
        try {
            dispatch(setCartLoading(true))
            const data = await fetchCart()
            if (data.success) dispatch(setCart(data.cart))
        } catch (err) {
            dispatch(setCartError(err.message))
        } finally {
            dispatch(setCartLoading(false))
        }
    }

    async function handleAddToCart(productId, variantId, quantity = 1) {
        if (!user) return { success: false, redirectLogin: true }
        try {
            dispatch(setCartLoading(true))
            const data = await addItemToCart(productId, variantId, quantity)
            if (data.success) dispatch(setCart(data.cart))
            return data
        } catch (err) {
            dispatch(setCartError(err.message))
            throw err
        } finally {
            dispatch(setCartLoading(false))
        }
    }

    async function handleUpdateQty(productId, variantId, quantity) {
        try {
            const data = await updateItemQuantity(productId, variantId, quantity)
            if (data.success) dispatch(setCart(data.cart))
        } catch (err) {
            dispatch(setCartError(err.message))
        }
    }

    async function handleRemoveFromCart(productId, variantId) {
        try {
            const data = await removeItemFromCart(productId, variantId)
            if (data.success) dispatch(setCart(data.cart))
        } catch (err) {
            dispatch(setCartError(err.message))
        }
    }

    async function handleClearCart() {
        try {
            const data = await clearCartApi()
            if (data.success) dispatch(clearServerCart())
        } catch (err) {
            dispatch(setCartError(err.message))
        }
    }

    return {
        items,
        subtotal,
        itemCount,
        currency,
        loading,
        handleGetCart,
        handleAddToCart,
        handleUpdateQty,
        handleRemoveFromCart,
        handleClearCart,
    }
}
