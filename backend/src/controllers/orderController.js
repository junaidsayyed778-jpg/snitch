import asyncHandler from "../utils/asyncHandler.js";
import {
  createOrder as createOrderService,
  getUserOrders as getUserOrdersService,
  getOrderById as getOrderByIdService,
} from "../services/orderService.js";
import { cancelSellerOrder as cancelSellerOrderService } from "../services/sellerOrderService.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../services/paymentService.js";

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

export const cancelSellerOrder = asyncHandler(async (req, res) => {
  const order = await cancelSellerOrderService({
    sellerOrderId: req.params.sellerOrderId,
    buyerId: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order,
  });
});

export const createPaymentOrder = asyncHandler(async (req, res) => {
  const paymentOrder = await createRazorpayOrder(req.user._id);

  res.status(201).json({
    success: true,
    message: "Payment order created",
    paymentOrder,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    console.log("VERIFY PAYMENT BODY:", {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    const order = await verifyRazorpayPayment({
      userId: req.user._id,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and order created",
      order,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    throw error;
  }
});