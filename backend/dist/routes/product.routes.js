"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_js_1 = require("../controllers/product.controller.js");
const upload_middleware_js_1 = require("../middleware/upload.middleware.js");
const auth_middleware_js_1 = __importDefault(require("../middleware/auth.middleware.js"));
const Adminonly_middleware_js_1 = __importDefault(require("../middleware/Adminonly.middleware.js"));
const router = (0, express_1.Router)();
// এই router এর সব route এ login + admin role বাধ্যতামূলক
router.use(auth_middleware_js_1.default, Adminonly_middleware_js_1.default);
router.get("/categories", product_controller_js_1.getCategories);
router.get("/", product_controller_js_1.getAdminProducts);
router.post("/", upload_middleware_js_1.uploadProductImages, product_controller_js_1.createProduct); // multipart/form-data, field name "images"
router.put("/:id", upload_middleware_js_1.uploadProductImages, product_controller_js_1.updateProduct);
router.delete("/:id", product_controller_js_1.deleteProduct);
router.patch("/variants/:variantId/stock", product_controller_js_1.updateVariantStock);
exports.default = router;
