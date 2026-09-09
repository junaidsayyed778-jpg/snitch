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
  rollbackOrderStatus,
} from "../state/sellerOrderSlice";
import { useCallback } from "react";

export const useSellerOrders = () => {
  const dispatch = useDispatch();

  // ==========================================
  // REDUX STATE
  // ==========================================

  const orders = useSelector((state) => state.sellerOrders.orders);

  const loading = useSelector((state) => state.sellerOrders.loading);

  const error = useSelector((state) => state.sellerOrders.error);

  // ==========================================
  // FETCH SELLER ORDERS
  // ==========================================

  const fetchSellerOrders = useCallback(async () => {
    try {
      dispatch(setSellerOrdersLoading(true));
      dispatch(setSellerOrdersError(null));

      const data = await getSellerOrders();

      console.log(
        "📦 [HOOK] fetchSellerOrders received:",
        data?.orders?.length,
        "orders",
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
          error.response?.data?.message || "Failed to fetch seller orders",
        ),
      );
    } finally {
      dispatch(setSellerOrdersLoading(false));
    }
  });

  // ==========================================
  // UPDATE SELLER ORDER STATUS
  // ==========================================

  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    // ------------------------------------------
    // 1. Find current order
    // ------------------------------------------

    const currentOrder = orders.find((order) => order._id === orderId);

    if (!currentOrder) {
      throw new Error("Seller order not found");
    }

    // ------------------------------------------
    // 2. Save previous status for rollback
    // ------------------------------------------

    const previousStatus = currentOrder.status;

    // ------------------------------------------
    // 3. Optimistic update
    // ------------------------------------------
    // Update Redux BEFORE waiting for the API.
    // This makes the UI respond immediately.

    dispatch(
      updateOrderStatusLocally({
        orderId,
        status: newStatus,
      }),
    );

    // ------------------------------------------
    // 4. Send API request
    // ------------------------------------------

    try {
      const data = await updateStatusApi(orderId, newStatus);

      // ----------------------------------------
      // 5. Success
      // ----------------------------------------
      // Nothing else is required.
      //
      // Redux already contains the new status.
      // DO NOT refetch all seller orders.

      return data;
    } catch (error) {
      // ----------------------------------------
      // 6. API failed → rollback
      // ----------------------------------------

      dispatch(
        rollbackOrderStatus({
          orderId,
          status: previousStatus,
        }),
      );

      const errorMessage =
        error.response?.data?.message || "Failed to update order status";

      console.error("⚠️ [HOOK] updateOrderStatus error:", errorMessage);

      throw new Error(errorMessage);
    }
  });

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
