import asyncHandler from "../utils/asyncHandler.js";

import {
  getSellerOrders as getSellerOrdersService,
  getSellerOrderById as getSellerOrderByIdService,
  updateSellerOrderStatus as updateSellerOrderStatusService,
} from "../services/sellerOrderService.js";

export const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await getSellerOrdersService(req.user._id);

  res.status(200).json({
    success: true,
    message: "Seller orders fetched successfully",
    orders,
  });
});

export const getSellerOrderById = asyncHandler(async (req, res) => {
  const order = await getSellerOrderByIdService({
    sellerOrderId: req.params.sellerOrderId,
    sellerId: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Seller order fetched successfully",
    order,
  });
});

export const updateSellerOrderStatus = asyncHandler(async (req, res) => {
  const order = await updateSellerOrderStatusService({
    sellerOrderId: req.params.sellerOrderId,
    sellerId: req.user._id,
    newStatus: req.body.status,
  });

  res.status(200).json({
    success: true,
    message: "Seller order updated successfully",
   
    order,
  });
});
