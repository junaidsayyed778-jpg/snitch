import asyncHandler from "../utils/asyncHandler.js";
import {
  createOrder as createOrderService,
  getUserOrders as getUserOrdersService,
  getOrderById as getOrderByIdService,
} from "../services/orderService.js";

export const createOrder = asyncHandler(async (req, res) => {
  const order = await createOrderService(req.user._id);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await getUserOrdersService(req.user._id);

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    orders,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await getOrderByIdService({
    orderId: req.params.orderId,
    userId: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    order,
  });
});
