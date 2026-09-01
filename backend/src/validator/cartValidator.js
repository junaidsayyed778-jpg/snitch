import { body, param, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
}

// POST /api/cart
export const validateAddToCart = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("variantId")
    .optional({ values: "falsy" })
    .isMongoId()
    .withMessage("Invalid variant ID"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  validateRequest,
];

// PATCH /api/cart/:productId/:variantId
export const validateUpdateCartQuantity = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID"),

  param("variantId")
    .custom((value) => {
      if (value === "null" || value === "undefined") {
        return true;
      }

      return /^[0-9a-fA-F]{24}$/.test(value);
    })
    .withMessage("Invalid variant ID"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  validateRequest,
];

// DELETE /api/cart/:productId/:variantId
export const validateRemoveFromCart = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID"),

  param("variantId")
    .custom((value) => {
      if (value === "null" || value === "undefined") {
        return true;
      }

      return /^[0-9a-fA-F]{24}$/.test(value);
    })
    .withMessage("Invalid variant ID"),

  validateRequest,
];