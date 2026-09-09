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

  addSellerOrder(state, action) {
    state.orders.unshift(action.payload);
  },

  updateOrderStatusLocally(state, action) {
    const { orderId, status } = action.payload;

    const order = state.orders.find(
      (o) => o._id === orderId
    );

    if (order) {
      order.status = status;
    }
  },

  rollbackOrderStatus(state, action) {
    const { orderId, status } = action.payload;

    const order = state.orders.find(
      (o) => o._id === orderId
    );

    if (order) {
      order.status = status;
    }
  },
},
});

export const {
  setSellerOrders,
  setSellerOrdersLoading,
  setSellerOrdersError,
  addSellerOrder,
  updateOrderStatusLocally,
  rollbackOrderStatus,
} = sellerOrderSlice.actions;

export default sellerOrderSlice.reducer;

