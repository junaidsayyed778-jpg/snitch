import axios from "axios"

const cartApiService = axios.create({
    baseURL: "/api/cart",
    withCredentials: true,
})

export async function fetchCart() {
    const res = await cartApiService.get("/")
    return res.data
}

export async function addItemToCart(productId, variantId, quantity = 1) {
    const res = await cartApiService.post("/", { productId, variantId, quantity })
    return res.data
}

export async function updateItemQuantity(productId, variantId, quantity) {
    const res = await cartApiService.patch(`/${productId}/${variantId}`, { quantity })
    return res.data
}

export async function removeItemFromCart(productId, variantId) {
    const res = await cartApiService.delete(`/${productId}/${variantId}`)
    return res.data
}

export async function clearCartApi() {
    const res = await cartApiService.delete("/")
    return res.data
}
