import { Router } from "express";
import {
  createProduct,
  getAdminProducts,
  getProductStats,
  getProductById,
  updateProduct,
  deleteProduct,
  updateVariantStock,
  addVariant,
  updateVariant,
  deleteVariant,
  getCategories,
} from "../controllers/product.controller.js";

import { uploadProductImages } from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/Adminonly.middleware.js";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/categories", getCategories);
router.get("/stats", getProductStats);

router.get("/", getAdminProducts);
router.post("/", uploadProductImages, createProduct);

router.post("/:id/variants", addVariant);
router.put("/variants/:variantId", updateVariant);
router.patch("/variants/:variantId/stock", updateVariantStock);
router.delete("/variants/:variantId", deleteVariant);

router.get("/:id", getProductById);
router.put("/:id", uploadProductImages, updateProduct);
router.delete("/:id", deleteProduct);

export default router;