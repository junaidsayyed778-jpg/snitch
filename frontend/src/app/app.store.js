import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/authSlice"
import productReducer from "../features/products/state/productSlice"
import cartReducer from "../features/products/state/cartSlice"
import serverCartReducer from "../features/products/state/serverCartSlice"
import orderReducer from "../features/orders/state/orderSlice"
import sellerOrderReducer from "../features/orders/state/sellerOrderSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        serverCart: serverCartReducer,
        order: orderReducer,
        sellerOrders: sellerOrderReducer
    }
})