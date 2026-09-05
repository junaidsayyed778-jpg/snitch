import asyncHandler from "../utils/asyncHandler.js";

import {
  getSellerOrders as getSellerOrdersService,
  getSellerOrderById as getSellerOrderByIdService,
  updateSellerOrderStatus as updateSellerOrderStatusService,
  cancelSellerOrder as cancelSellerOrderService
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

export const cancelSellerOrder = asyncHandler(async(req, res) => {
  const order = await cancelSellerOrderService({
    sellerOrderId: req.params.sellerOrderId,
    buyerId: req.user._id
  })

  req.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order
  })
})
