import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = Router();

// All cart routes require a logged-in user (any role)
router.get("/", authenticateUser, getCart);
router.post("/", authenticateUser, addToCart);
router.patch("/:productId/:variantId", authenticateUser, updateCartQuantity);
router.delete("/:productId/:variantId", authenticateUser, removeFromCart);
router.delete("/", authenticateUser, clearCart);

export default router;
