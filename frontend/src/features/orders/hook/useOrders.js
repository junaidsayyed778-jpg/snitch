import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, setOrders } from "../state/orderSlice";
import { getUserOrders, cancelSellerOrder } from "../service/orderApi";

export default function useOrders() {
  const dispatch = useDispatch();
  
  const orders = useSelector((state) => state.order.orders);
  const loading = useSelector((state) => state.order.loading)
  const error = useSelector((state) => state.order.error);

  async function fetchOrder() {
    try{
        dispatch(setLoading(true))
        dispatch(setError(null))

        const data = await getUserOrders()

        dispatch(setOrders(data.orders))
    }catch(error){
        dispatch(
            setError(
                error.response?.data?.message ||
                "Failed to fetch orders"
            )
        )
    }finally{
        dispatch(setLoading(false))
    }
  }

  async function cancelOrder(sellerOrderId) {
    try {
        await cancelSellerOrder(sellerOrderId);
        // Refresh orders after successful cancellation
        await fetchOrder();
        return { success: true };
    } catch (error) {
        dispatch(
            setError(
                error.response?.data?.message ||
                "Failed to cancel order"
            )
        )
        return { success: false, error };
    }
  }

  return {
    orders,
    loading,
    error,
    fetchOrder,
    cancelOrder
  }
}
