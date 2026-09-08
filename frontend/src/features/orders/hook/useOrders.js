import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    setError,
    setLoading,
    setOrders,
} from "../state/orderSlice";

import {
    getUserOrders,
    cancelSellerOrder,
} from "../service/orderApi";

export default function useOrders() {
    const dispatch = useDispatch();

    const orders = useSelector(
        (state) => state.order.orders
    );

    const loading = useSelector(
        (state) => state.order.loading
    );

    const error = useSelector(
        (state) => state.order.errors
    );

    const fetchOrder = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const data = await getUserOrders();
            const nextOrders = Array.isArray(data?.orders)
                ? data.orders
                : Array.isArray(data)
                    ? data
                    : [];

            dispatch(setOrders(nextOrders));
            return nextOrders;
        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message ||
                    "Failed to fetch orders"
                )
            );
            return [];
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const cancelOrder = useCallback(
        async (sellerOrderId) => {
            try {
                await cancelSellerOrder(sellerOrderId);

                await fetchOrder();

                return {
                    success: true,
                };

            } catch (error) {
                dispatch(
                    setError(
                        error.response?.data?.message ||
                        "Failed to cancel order"
                    )
                );

                return {
                    success: false,
                    error,
                };
            }
        },
        [dispatch, fetchOrder]
    );

    return {
        orders,
        loading,
        error,
        fetchOrder,
        cancelOrder,
    };
}

