import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const sellerOrderSlice = createSlice({
  name: "sellerOrders",
  initialState,
  reducers: {
    setSellerOrders(state, action) {
      state.orders = action.payload;
    },
    setSellerOrdersLoading(state, action) {
      state.loading = action.payload;
    },
    setSellerOrdersError(state, action) {
      state.error = action.payload;
    },
    updateOrderStatusLocally(state, action) {
      const { orderId, status } = action.payload;
      const index = state.orders.findIndex((o) => o._id === orderId);
      if (index !== -1) {
        state.orders[index].status = status;
      }
    },
  },
});

export const {
  setSellerOrders,
  setSellerOrdersLoading,
  setSellerOrdersError,
  updateOrderStatusLocally,
} = sellerOrderSlice.actions;

export default sellerOrderSlice.reducer;
