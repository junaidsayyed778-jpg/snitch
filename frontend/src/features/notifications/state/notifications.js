import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    hasUnreadOrders: false,
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,

    reducers: {
        markOrdersUnread: (state) => {
            state.hasUnreadOrders = true;
        },

        markOrdersRead: (state) => {
            state.hasUnreadOrders = false;
        },
    },
});

export const {
    markOrdersUnread,
    markOrdersRead,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

