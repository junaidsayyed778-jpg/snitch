import { io } from "socket.io-client";
import { store } from "./app/app.store"
import { updateSellerOrderStatus } from "./features/orders/state/orderSlice";

const socket = io("http://localhost:5001", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Frontend socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("order:status-updated", (data) => {
  console.log("📦 Order status updated:", data);

  store.dispatch(updateSellerOrderStatus)
});

export default socket;