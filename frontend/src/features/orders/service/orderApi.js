import axios from "axios";

const orderApiService = axios.create({
  baseURL: "/api/orders",
  withCredentials: true,
});

export async function getUserOrders() {
  const response = await orderApiService.get("/");

  return response.data;
}

export async function cancelSellerOrder(sellerOrderId) {
  const response = await orderApiService.patch(`/seller/${sellerOrderId}/cancel`);
  return response.data;
}

export async function createPaymentOrder(){
  const response = await orderApiService.post("/payment")

  return response.data
}

export async function verifyPayment(paymentData) {
  const response = await orderApiService.post(
    "/verify-payment",
    paymentData
  );

  return response.data
}
