import { Router } from "express";
import authenticateSeller from "../middleware/authMiddleware.js";
import multer from "multer";
import {
  validateAddProductVariant,
  validateCreateProduct,
  validateUpdateProductVariant,
} from "../validator/productValidator.js";

import {
  addProductVariant,
  createProduct,
  getAllProducts,
  getProductDetails,
  getSellerProducts,
  updateProductVariant,
} from "../controllers/productController.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
router.post(
  "/",
  authenticateSeller,
  upload.array("images", 7),
  validateCreateProduct,
  createProduct,
);
router.get("/seller", authenticateSeller, getSellerProducts);
router.get("/", getAllProducts);
router.get("/detail/:id", getProductDetails);
router.post(
  "/:productId/variants",
  authenticateSeller,

  upload.array("images", 7),

  (req, res, next) => {
    console.log("🔥 AFTER MULTER");
    console.log("REQUEST BODY:", req.body);
    console.log("FILES:", req.files?.length);

    next();
  },

  validateAddProductVariant,

  addProductVariant,
);
router.patch(
  "/:productId/variants/:variantId",
  authenticateSeller,
  upload.array("images", 7),
  validateUpdateProductVariant,
  updateProductVariant,
);

export default router;
