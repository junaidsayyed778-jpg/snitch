import { useDispatch } from "react-redux";
import { getSellerOrders, updateSellerOrderStatus as updateStatusApi } from "../service/sellerOrderApi";
import {
  setSellerOrders,
  setSellerOrdersLoading,
  setSellerOrdersError,
  updateOrderStatusLocally,
} from "../state/sellerOrderSlice";

export const useSellerOrders = () => {
  const dispatch = useDispatch();

  async function handleGetSellerOrders() {
    try {
      dispatch(setSellerOrdersLoading(true));
      dispatch(setSellerOrdersError(null));

      const data = await getSellerOrders();
      console.log("📦 [HOOK] handleGetSellerOrders received:", data?.orders?.length, "orders");

      if (Array.isArray(data?.orders)) {
          dispatch(setSellerOrders(data.orders));
      } else if (Array.isArray(data)) {
          dispatch(setSellerOrders(data));
      }
      return data.orders || data;
    } catch (error) {
      dispatch(
        setSellerOrdersError(
          error.response?.data?.message || "Failed to fetch seller orders"
        )
      );
    } finally {
      dispatch(setSellerOrdersLoading(false));
    }
  }

  async function handleUpdateSellerOrderStatus(orderId, newStatus) {
    try {
      const data = await updateStatusApi(orderId, newStatus);
      
      // Update local state if successful
      dispatch(updateOrderStatusLocally({ orderId, status: newStatus }));
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update order status";
      console.error("⚠️ [HOOK] handleUpdateSellerOrderStatus error:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  return {
    handleGetSellerOrders,
    handleUpdateSellerOrderStatus,
  };
}

export default useSellerOrders;
