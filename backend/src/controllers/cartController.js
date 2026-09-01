import asyncHandler from "../utils/asyncHandler.js";

import {
  getCart as getCartService,
  addToCart as addToCartService,
  updateCartQuantity as updateCartQuantityService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
} from "../services/cartService.js";


// GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartService(req.user._id);

  res.status(200).json({
    success: true,
    cart,
  });
});


// POST /api/cart
export const addToCart = asyncHandler(async (req, res) => {
  const {
    productId,
    variantId,
    quantity,
  } = req.body;

  const cart = await addToCartService({
    userId: req.user._id,
    productId,
    variantId,
    quantity,
  });

  res.status(200).json({
    success: true,
    message: "Added to cart",
    cart,
  });
});


// PATCH /api/cart/:productId/:variantId
export const updateCartQuantity = asyncHandler(async (req, res) => {
  const {
    productId,
    variantId,
  } = req.params;

  const {
    quantity,
  } = req.body;

  const cart = await updateCartQuantityService({
    userId: req.user._id,
    productId,
    variantId,
    quantity,
  });

  res.status(200).json({
    success: true,
    message: "Quantity updated",
    cart,
  });
});


// DELETE /api/cart/:productId/:variantId
export const removeFromCart = asyncHandler(async (req, res) => {
  const {
    productId,
    variantId,
  } = req.params;

  const cart = await removeFromCartService({
    userId: req.user._id,
    productId,
    variantId,
  });

  res.status(200).json({
    success: true,
    message: "Item removed",
    cart,
  });
});


// DELETE /api/cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await clearCartService(req.user._id);

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    cart,
  });
});