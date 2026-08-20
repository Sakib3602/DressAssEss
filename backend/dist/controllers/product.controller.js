"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVariantStock = exports.deleteProduct = exports.updateProduct = exports.getAdminProducts = exports.createProduct = exports.getCategories = void 0;
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
const slugify_1 = require("../utils/slugify");
const cloudinaryUpload_js_1 = require("../utils/cloudinaryUpload.js");
const sumStock = (variants) => variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
const getCategories = async (req, res) => {
    try {
        const categories = await prisma_js_1.default.category.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
            select: { id: true, name: true },
        });
        res.json({ data: categories });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getCategories = getCategories;
// @desc   নতুন প্রোডাক্ট add করা (admin panel) — min 2, max 4 image, size/color variant সহ
// @route  POST /api/admin/products
const createProduct = async (req, res) => {
    try {
        const { name, description, shortDescription, categoryId, brand, price, discountPrice, material, careInstructions, isBestseller, variants, } = req.body;
        const files = req.files;
        if (!files || files.length < 2 || files.length > 4) {
            return res.status(400).json({ message: "কমপক্ষে ২টা, সর্বোচ্চ ৪টা image দিতে হবে" });
        }
        let parsedVariants;
        try {
            parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants;
        }
        catch {
            return res.status(400).json({ message: "variants ঠিকমতো পাঠানো হয়নি" });
        }
        if (!parsedVariants || parsedVariants.length === 0) {
            return res.status(400).json({ message: "কমপক্ষে ১টা size/color variant দিতে হবে" });
        }
        if (!name || !description || !categoryId || !price) {
            return res.status(400).json({ message: "name, description, categoryId, price আবশ্যক" });
        }
        const imageUrls = await (0, cloudinaryUpload_js_1.uploadMultipleToCloudinary)(files, "products");
        const product = await prisma_js_1.default.product.create({
            data: {
                name,
                slug: (0, slugify_1.slugify)(name),
                description,
                shortDescription: shortDescription || null,
                categoryId: String(categoryId),
                brand: brand || null,
                images: imageUrls,
                price: Number(price),
                discountPrice: discountPrice ? Number(discountPrice) : null,
                material: material || null,
                careInstructions: careInstructions || null,
                isBestseller: isBestseller === "true" || isBestseller === true,
                totalStock: sumStock(parsedVariants),
                createdById: req.user.id,
                variants: {
                    create: parsedVariants.map((v) => ({
                        size: v.size,
                        color: v.color,
                        colorCode: v.colorCode || null,
                        stock: Number(v.stock) || 0,
                        sku: v.sku || null,
                    })),
                },
            },
            include: { variants: true, category: true },
        });
        res.status(201).json({ message: "Product created", data: product });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.createProduct = createProduct;
// @desc   সব প্রোডাক্ট (admin panel এর লিস্ট ভিউ)
// @route  GET /api/admin/products
const getAdminProducts = async (req, res) => {
    try {
        const { categoryId, search, page = "1", limit = "20" } = req.query;
        const where = {};
        if (categoryId)
            where.categoryId = String(categoryId);
        if (search) {
            where.name = { contains: String(search), mode: "insensitive" };
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            prisma_js_1.default.product.findMany({
                where,
                include: { category: true, variants: true },
                skip,
                take: Number(limit),
                orderBy: { createdAt: "desc" },
            }),
            prisma_js_1.default.product.count({ where }),
        ]);
        res.json({
            data: products,
            pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getAdminProducts = getAdminProducts;
// @desc   প্রোডাক্ট update
// @route  PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, shortDescription, categoryId, brand, price, discountPrice, material, careInstructions, isBestseller, isActive, existingImages, } = req.body;
        const files = req.files;
        let images = existingImages ? JSON.parse(existingImages) : [];
        if (files && files.length > 0) {
            const newUrls = await (0, cloudinaryUpload_js_1.uploadMultipleToCloudinary)(files, "products");
            images = [...images, ...newUrls];
        }
        if (images.length > 4) {
            return res.status(400).json({ message: "সর্বোচ্চ ৪টা image রাখা যাবে" });
        }
        if (images.length < 2) {
            return res.status(400).json({ message: "কমপক্ষে ২টা image থাকতে হবে" });
        }
        const product = await prisma_js_1.default.product.update({
            where: { id: String(id) },
            data: {
                ...(name && { name, slug: (0, slugify_1.slugify)(name) }),
                ...(description !== undefined && { description }),
                ...(shortDescription !== undefined && { shortDescription }),
                ...(categoryId && { categoryId: String(categoryId) }),
                ...(brand !== undefined && { brand }),
                images,
                ...(price !== undefined && { price: Number(price) }),
                ...(discountPrice !== undefined && {
                    discountPrice: discountPrice ? Number(discountPrice) : null,
                }),
                ...(material !== undefined && { material }),
                ...(careInstructions !== undefined && { careInstructions }),
                ...(isBestseller !== undefined && {
                    isBestseller: isBestseller === "true" || isBestseller === true,
                }),
                ...(isActive !== undefined && { isActive: isActive === "true" || isActive === true }),
            },
            include: { variants: true, category: true },
        });
        res.json({ message: "Product updated", data: product });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.updateProduct = updateProduct;
// @desc   প্রোডাক্ট delete
// @route  DELETE /api/admin/products/:id
const deleteProduct = async (req, res) => {
    try {
        await prisma_js_1.default.product.delete({ where: { id: String(req.params.id) } });
        res.json({ message: "Product deleted" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.deleteProduct = deleteProduct;
// @desc   inventory — নির্দিষ্ট size/color এর stock update
// @route  PATCH /api/admin/products/variants/:variantId/stock
const updateVariantStock = async (req, res) => {
    try {
        const { stock } = req.body;
        if (stock === undefined || Number(stock) < 0) {
            return res.status(400).json({ message: "সঠিক stock সংখ্যা দাও" });
        }
        const variant = await prisma_js_1.default.productVariant.update({
            where: { id: String(req.params.variantId) },
            data: { stock: Number(stock) },
        });
        const allVariants = await prisma_js_1.default.productVariant.findMany({
            where: { productId: variant.productId },
        });
        await prisma_js_1.default.product.update({
            where: { id: variant.productId },
            data: { totalStock: allVariants.reduce((sum, v) => sum + v.stock, 0) },
        });
        res.json({
            message: Number(stock) === 0 ? "এই size/color এখন Stock Out" : "Stock update হয়েছে",
            data: variant,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.updateVariantStock = updateVariantStock;
