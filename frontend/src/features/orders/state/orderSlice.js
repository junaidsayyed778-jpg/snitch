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

        setLoading(state, action) {
            state.loading = action.payload;
        },

        setError(state, action) {
            state.errors = action.payload;
        }
    }
})

export const {
    setOrders,
    setLoading,
    setError
} = orderSlice.actions

export default orderSlice.reducer