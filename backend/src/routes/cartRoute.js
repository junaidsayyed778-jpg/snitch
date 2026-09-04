import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { validateAddToCart, validateRemoveFromCart, validateUpdateCartQuantity } from "../validator/cartValidator.js";

const router = Router();

// All cart routes require a logged-in user (any role)
router.get("/", authenticateUser, getCart);
router.post("/", authenticateUser, validateAddToCart, addToCart);
router.patch("/:productId/:variantId", authenticateUser, validateUpdateCartQuantity, updateCartQuantity);
router.delete("/:productId/:variantId", authenticateUser, validateRemoveFromCart, removeFromCart);
router.delete("/", authenticateUser, clearCart);

export default router;
