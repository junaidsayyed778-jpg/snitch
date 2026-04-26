import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    subtotal: 0,
    itemCount: 0,
    currency: "INR",
    loading: false,
    error: null,
};

const serverCartSlice = createSlice({
    name: "serverCart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            const { items = [], subtotal = 0, itemCount = 0, currency = "INR" } = action.payload;
            state.items = items;
            state.subtotal = subtotal;
            state.itemCount = itemCount;
            state.currency = currency;
        },
        setCartLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCartError: (state, action) => {
            state.error = action.payload;
        },
        clearServerCart: (state) => {
            state.items = [];
            state.subtotal = 0;
            state.itemCount = 0;
        }
    }
});

export const { setCart, setCartLoading, setCartError, clearServerCart } = serverCartSlice.actions;
export default serverCartSlice.reducer;
