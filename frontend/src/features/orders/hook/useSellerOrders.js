import { useDispatch, useSelector } from "react-redux";

import {
  getSellerOrders,
  updateSellerOrderStatus as updateStatusApi,
} from "../service/sellerOrderApi";

import {
  setSellerOrders,
  setSellerOrdersLoading,
  setSellerOrdersError,
  updateOrderStatusLocally,
} from "../state/sellerOrderSlice";


export const useSellerOrders = () => {
  const dispatch = useDispatch();


  // ==========================================
  // REDUX STATE
  // ==========================================

  const orders = useSelector(
    (state) => state.sellerOrders.orders
  );

  const loading = useSelector(
    (state) => state.sellerOrders.loading
  );

  const error = useSelector(
    (state) => state.sellerOrders.error
  );


  // ==========================================
  // FETCH SELLER ORDERS
  // ==========================================

  async function fetchSellerOrders() {
    try {
      dispatch(setSellerOrdersLoading(true));
      dispatch(setSellerOrdersError(null));

      const data = await getSellerOrders();

      console.log(
        "📦 [HOOK] fetchSellerOrders received:",
        data?.orders?.length,
        "orders"
      );

      if (Array.isArray(data?.orders)) {
        dispatch(setSellerOrders(data.orders));
      } else if (Array.isArray(data)) {
        dispatch(setSellerOrders(data));
      }

      return data?.orders || data;

    } catch (error) {

      dispatch(
        setSellerOrdersError(
          error.response?.data?.message ||
          "Failed to fetch seller orders"
        )
      );

    } finally {

      dispatch(setSellerOrdersLoading(false));

    }
  }


  // ==========================================
  // UPDATE SELLER ORDER STATUS
  // ==========================================

  async function updateOrderStatus(orderId, newStatus) {
    try {

      const data = await updateStatusApi(
        orderId,
        newStatus
      );

      dispatch(
        updateOrderStatusLocally({
          orderId,
          status: newStatus,
        })
      );

      return data;

    } catch (error) {

      const errorMessage =
        error.response?.data?.message ||
        "Failed to update order status";

      console.error(
        "⚠️ [HOOK] updateOrderStatus error:",
        errorMessage
      );

      throw new Error(errorMessage);
    }
  }


  // ==========================================
  // RETURN
  // ==========================================

  return {
    orders,
    loading,
    error,
    fetchSellerOrders,
    updateOrderStatus,
  };
};


export default useSellerOrders;

