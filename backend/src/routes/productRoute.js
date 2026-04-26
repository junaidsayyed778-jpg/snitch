import {Router} from "express"
import authenticateSeller from "../middleware/authMiddleware.js"
import multer from "multer"
import { addProductVariant, createProduct, getAllProducts, getProductDetails, getSellerProducts, updateProductVariant } from "../controllers/productController.js"


const router = Router()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})
router.post("/", authenticateSeller, upload.array("images", 7), createProduct)
router.get("/seller", authenticateSeller, getSellerProducts)
router.get("/", getAllProducts)
router.get("/detail/:id", getProductDetails)
router.post("/:productId/variants", authenticateSeller, upload.array("images", 7), addProductVariant)
router.patch("/:productId/variants/:variantId", authenticateSeller, upload.array("images", 7), updateProductVariant)

export default router