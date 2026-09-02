import { param, validationResult } from "express-validator";


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


// Validate order ID
export const validateOrderId = [
  param("orderId")
    .isMongoId()
    .withMessage("Invalid order ID"),

  validateRequest,
];