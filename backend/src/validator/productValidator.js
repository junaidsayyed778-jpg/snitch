import { body, param, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  console.log("🔥 VALIDATOR REACHED");
  console.log("BODY:", req.body);

  const errors = validationResult(req);

  console.log("ERRORS:", errors.array());

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
}

// CREATE PRODUCT
export const validateCreateProduct = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Product title must be between 3 and 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage(
      "Product description must be between 10 and 5000 characters",
    ),

  body("priceAmount")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0.01 })
    .withMessage("Product price must be greater than 0"),

  body("priceCurrency")
    .optional()
    .isIn(["USD", "EUR", "JPY", "INR"])
    .withMessage("Invalid price currency"),

  validateRequest,
];

// ADD PRODUCT VARIANT
export const validateAddProductVariant = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Variant title must be between 2 and 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Variant description cannot exceed 5000 characters"),

  body("priceAmount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Variant price must be greater than 0"),

  body("price")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Variant price must be greater than 0"),

  body("priceCurrency")
    .optional()
    .isIn(["USD", "EUR", "JPY", "INR"])
    .withMessage("Invalid price currency"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("attributes")
    .optional()
    .custom((value) => {
      if (typeof value === "object") {
        return true;
      }

      try {
        const parsed = JSON.parse(value);

        if (
          typeof parsed !== "object" ||
          parsed === null ||
          Array.isArray(parsed)
        ) {
          throw new Error();
        }

        return true;
      } catch {
        throw new Error("Attributes must be a valid JSON object");
      }
    }),

  validateRequest,
];

// UPDATE PRODUCT VARIANT
export const validateUpdateProductVariant = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID"),

  param("variantId")
    .isMongoId()
    .withMessage("Invalid variant ID"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage("Variant title must be between 2 and 150 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Variant description cannot exceed 5000 characters"),

  body("priceAmount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Variant price must be greater than 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("attributes")
    .optional()
    .custom((value) => {
      if (typeof value === "object") {
        return true;
      }

      try {
        const parsed = JSON.parse(value);

        if (
          typeof parsed !== "object" ||
          parsed === null ||
          Array.isArray(parsed)
        ) {
          throw new Error();
        }

        return true;
      } catch {
        throw new Error("Attributes must be a valid JSON object");
      }
    }),

  validateRequest,
];