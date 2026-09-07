import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelSellerOrder,
  createPaymentOrder,
  verifyPayment
} from "../controllers/orderController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/payment", authenticateUser, createPaymentOrder)
router.post("/verify-payment", authenticateUser, verifyPayment)
router.post("/", authenticateUser, createOrder);
router.get("/", authenticateUser, getUserOrders);
router.get("/:orderId", authenticateUser, getOrderById);
router.patch("/seller/:sellerOrderId/cancel", authenticateUser, cancelSellerOrder);
export default router;