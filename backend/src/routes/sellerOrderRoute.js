import express from "express";

import { getSellerOrderById, getSellerOrders, updateSellerOrderStatus } from "../controllers/sellerOrderController.js"
import authenticateSeller from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateSeller, getSellerOrders);
router.get("/:sellerOrderId", authenticateSeller, getSellerOrderById)
router.patch("/:sellerOrderId/status", authenticateSeller, updateSellerOrderStatus)
export default router;