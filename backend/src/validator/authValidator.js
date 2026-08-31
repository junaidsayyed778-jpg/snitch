import { body, validationResult } from "express-validator";
import AppError from "../errors/AppError.js";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      }));

      return next(new AppError("Validation failed", 400, formattedErrors));
    }
  }
  next();
}

export const validateRegisterUser = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("contact")
    .trim()
    .notEmpty()
    .withMessage("Contact is required")
    .matches(/^\d{10,12}$/)
    .withMessage("Contact must be a 10-12 digit number"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),

  body("isSeller").isBoolean().withMessage("isSeller must be a boolean value"),

  validateRequest,
];

export const validateLoginUser = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  validateRequest,
];
