import axios from "axios";

const sellerOrderApiService = axios.create({
  baseURL: "/api/seller/orders",
  withCredentials: true,
});

export async function getSellerOrders() {
  const response = await sellerOrderApiService.get("/");
  return response.data;
}

export async function getSellerOrderById(id) {
  const response = await sellerOrderApiService.get(`/${id}`);
  return response.data;
}

export async function updateSellerOrderStatus(id, status) {
  const response = await sellerOrderApiService.patch(`/${id}/status`, { status });
  return response.data;
}
