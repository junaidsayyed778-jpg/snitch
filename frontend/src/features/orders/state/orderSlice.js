import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    orders: [],
    loading: false,
    errors: null,
}


const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setOrders(state, action){
            state.orders = action.payload
        },
        updateSellerOrderStatus(state, action) {
            const { sellerOrderId, status } = action.payload;

            for(const order of state.orders) {
                const sellerOrder = order.sellerOrders?.find(
                    (sellerOrder) => sellerOrder._id === sellerOrderId
                );

                if(sellerOrder) {
                    sellerOrder.status = status;
                    break;
                }
            }
        },

        setLoading(state, action) {
            state.loading = action.payload;
        },

        setError(state, action) {
            state.errors = action.payload;
        },        
    }
})



export const {
    setOrders,
    updateSellerOrderStatus,
    setLoading,
    setError
} = orderSlice.actions

export default orderSlice.reducer