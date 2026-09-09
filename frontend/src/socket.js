import { io } from "socket.io-client";

import { store } from "./app/app.store";
import { addSellerOrder } from "./features/orders/state/sellerOrderSlice";
import { markOrdersUnread } from "./features/notifications/state/notifications";

const socket = io("http://localhost:5001", {
  withCredentials: true,
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Frontend socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

/*
 * SELLER
 *
 * Buyer placed an order containing
 * this seller's product.
 */
socket.on("order:new", (data) => {
  console.log("🛒 NEW ORDER FOR SELLER:", data);

  store.dispatch(markOrdersUnread());

  if (data?.sellerOrder) {
    store.dispatch(addSellerOrder(data.sellerOrder));
  }
});

/*
 * BUYER
 *
 * Seller changed the status of
 * one of the buyer's orders.
 */
socket.on("order:status-updated", (data) => {
  console.log("📦 ORDER STATUS UPDATED:", data);

  store.dispatch(markOrdersUnread());
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
