import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/authSlice"
import productReducer from "../features/products/state/productSlice"
import cartReducer from "../features/products/state/cartSlice"
import serverCartReducer from "../features/products/state/serverCartSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        serverCart: serverCartReducer
    }
})