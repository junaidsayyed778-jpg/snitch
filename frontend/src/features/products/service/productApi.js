import axios from "axios"

const productApiService = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
})

export async function createProduct(formData){
    const response = await productApiService.post("/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })

    return response.data
}

export async function getSellerProduct(){
    const response = await productApiService.get("/seller")

    return response.data
}

export async function getAllProducts(search = ""){
    const url = search ? `/?search=${encodeURIComponent(search)}` : "/"
    const response = await productApiService.get(url)
    return response.data
}

export async function getProductDetails(productId){
    const response = await productApiService.get(`/detail/${productId}`)
    return response.data
}

export async function addProductVariant(productId, newProductVariant) {
    const formData = new FormData()

    newProductVariant.images.forEach((file) => {
        formData.append("images", file)
    })

    formData.append("stock", newProductVariant.stock)
    formData.append("priceAmount", newProductVariant.priceAmount)
    formData.append("title", newProductVariant.title || "")
    formData.append("description", newProductVariant.description || "")
    formData.append("attributes", JSON.stringify(newProductVariant.attributes))

    const response = await productApiService.post(`/${productId}/variants`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })

    return response.data
}

export async function updateProductVariant(productId, variantId, formData) {
    const response = await productApiService.patch(`/${productId}/variants/${variantId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
}
