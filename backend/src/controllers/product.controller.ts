import { Request, Response } from "express";
import prisma from "../config/prisma.js";
import { slugify } from "../utils/slugify";
import { uploadMultipleToCloudinary } from "../utils/cloudinaryUpload.js";

interface VariantInput {
  size: string;
  color: string;
  colorCode?: string;
  stock: number;
  sku?: string;
}

const sumStock = (variants: VariantInput[]) =>
  variants.reduce((sum, v) => sum + Number(v.stock || 0), 0);

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true },
    });
    res.json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @desc   একটা নির্দিষ্ট প্রোডাক্টের ডিটেইলস
// @route  GET /api/admin/products/:id
const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: String(req.params.id) },
      include: { variants: true, category: true },
    });
    if (!product) {
      return res.status(404).json({ message: "Product খুঁজে পাওয়া যায়নি" });
    }
    res.json({ data: product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @desc   নতুন প্রোডাক্ট add করা (admin panel) — min 2, max 4 image, size/color variant সহ
// @route  POST /api/admin/products
const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      shortDescription,
      categoryId,
      brand,
      price,
      discountPrice,
      material,
      careInstructions,
      isBestseller,
      variants,
    } = req.body;

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length < 2 || files.length > 4) {
      return res.status(400).json({ message: "কমপক্ষে ২টা, সর্বোচ্চ ৪টা image দিতে হবে" });
    }

    let parsedVariants: VariantInput[];
    try {
      parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants;
    } catch {
      return res.status(400).json({ message: "variants ঠিকমতো পাঠানো হয়নি" });
    }
    if (!parsedVariants || parsedVariants.length === 0) {
      return res.status(400).json({ message: "কমপক্ষে ১টা size/color variant দিতে হবে" });
    }

    if (!name || !description || !categoryId || !price) {
      return res.status(400).json({ message: "name, description, categoryId, price আবশ্যক" });
    }

    const imageUrls = await uploadMultipleToCloudinary(files, "products");

    const product = await prisma.product.create({
      data: {
        name,
        slug: slugify(name),
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
        createdById: req.user!.id,
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @desc   সব প্রোডাক্ট (admin panel এর লিস্ট ভিউ) — search/sort/filter সহ
// @route  GET /api/admin/products
const getAdminProducts = async (req: Request, res: Response) => {
  try {
    const {
      categoryId,
      search,
      page = "1",
      limit = "20",
      sortBy = "createdAt",
      sortOrder = "desc",
      stockStatus,
      minPrice,
      maxPrice,
    } = req.query;

    const where: any = {};
    if (categoryId) where.categoryId = String(categoryId);

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { brand: { contains: String(search), mode: "insensitive" } },
        { slug: { contains: String(search), mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (stockStatus === "out") where.totalStock = { equals: 0 };
    if (stockStatus === "low") where.totalStock = { gt: 0, lte: 5 };
    if (stockStatus === "in") where.totalStock = { gt: 5 };

    const allowedSort = ["createdAt", "price", "name", "totalStock"];
    const orderField = allowedSort.includes(String(sortBy)) ? String(sortBy) : "createdAt";
    const orderDir = sortOrder === "asc" ? "asc" : "desc";

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, variants: true },
        skip,
        take: Number(limit),
        orderBy: { [orderField]: orderDir },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      data: products,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @desc   প্রোডাক্ট update
// @route  PUT /api/admin/products/:id
const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      shortDescription,
      categoryId,
      brand,
      price,
      discountPrice,
      material,
      careInstructions,
      isBestseller,
      isActive,
      existingImages,
    } = req.body;

    const files = req.files as Express.Multer.File[] | undefined;
    let images: string[] = existingImages ? JSON.parse(existingImages) : [];

    if (files && files.length > 0) {
      const newUrls = await uploadMultipleToCloudinary(files, "products");
      images = [...images, ...newUrls];
    }

    if (images.length > 4) {
      return res.status(400).json({ message: "সর্বোচ্চ ৪টা image রাখা যাবে" });
    }
    if (images.length < 2) {
      return res.status(400).json({ message: "কমপক্ষে ২টা image থাকতে হবে" });
    }

    const product = await prisma.product.update({
      where: { id: String(id) },
      data: {
        ...(name && { name, slug: slugify(name) }),
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
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @desc   প্রোডাক্ট delete
// @route  DELETE /api/admin/products/:id
const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prisma.product.delete({ where: { id: String(req.params.id) } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @desc   inventory — নির্দিষ্ট size/color এর stock update
// @route  PATCH /api/admin/products/variants/:variantId/stock
const updateVariantStock = async (req: Request, res: Response) => {
  try {
    const { stock } = req.body;
    if (stock === undefined || Number(stock) < 0) {
      return res.status(400).json({ message: "সঠিক stock সংখ্যা দাও" });
    }

    const variant = await prisma.productVariant.update({
      where: { id: String(req.params.variantId) },
      data: { stock: Number(stock) },
    });

    const allVariants = await prisma.productVariant.findMany({
      where: { productId: variant.productId },
    });
    await prisma.product.update({
      where: { id: variant.productId },
      data: { totalStock: allVariants.reduce((sum, v) => sum + v.stock, 0) },
    });

    res.json({
      message: Number(stock) === 0 ? "এই size/color এখন Stock Out" : "Stock update হয়েছে",
      data: variant,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @desc   প্রোডাক্টে নতুন variant (size/color) যোগ করা
// @route  POST /api/admin/products/:id/variants
const addVariant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { size, color, colorCode, stock, sku } = req.body;

    if (!size || !color) {
      return res.status(400).json({ message: "size ও color আবশ্যক" });
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId: String(id),
        size,
        color,
        colorCode: colorCode || null,
        stock: Number(stock) || 0,
        sku: sku || null,
      },
    });

    const allVariants = await prisma.productVariant.findMany({ where: { productId: String(id) } });
    await prisma.product.update({
      where: { id: String(id) },
      data: { totalStock: allVariants.reduce((sum, v) => sum + v.stock, 0) },
    });

    res.status(201).json({ message: "Variant যোগ হয়েছে", data: variant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @desc   variant এর size/color/sku/stock update
// @route  PUT /api/admin/products/variants/:variantId
const updateVariant = async (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;
    const { size, color, colorCode, stock, sku } = req.body;

    const variant = await prisma.productVariant.update({
      where: { id: String(variantId) },
      data: {
        ...(size !== undefined && { size }),
        ...(color !== undefined && { color }),
        ...(colorCode !== undefined && { colorCode }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(sku !== undefined && { sku }),
      },
    });

    const allVariants = await prisma.productVariant.findMany({ where: { productId: variant.productId } });
    await prisma.product.update({
      where: { id: variant.productId },
      data: { totalStock: allVariants.reduce((sum, v) => sum + v.stock, 0) },
    });

    res.json({ message: "Variant update হয়েছে", data: variant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @desc   variant delete (কমপক্ষে ১টা variant রাখতে হবে)
// @route  DELETE /api/admin/products/variants/:variantId
const deleteVariant = async (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;
    const variant = await prisma.productVariant.findUnique({ where: { id: String(variantId) } });
    if (!variant) return res.status(404).json({ message: "Variant খুঁজে পাওয়া যায়নি" });

    const remaining = await prisma.productVariant.count({ where: { productId: variant.productId } });
    if (remaining <= 1) {
      return res.status(400).json({ message: "কমপক্ষে ১টা variant থাকতে হবে" });
    }

    await prisma.productVariant.delete({ where: { id: String(variantId) } });

    const allVariants = await prisma.productVariant.findMany({ where: { productId: variant.productId } });
    await prisma.product.update({
      where: { id: variant.productId },
      data: { totalStock: allVariants.reduce((sum, v) => sum + v.stock, 0) },
    });

    res.json({ message: "Variant delete হয়েছে" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
// @desc   Product stats — total, active/inactive, bestseller, combo offers, category breakdown
// @route  GET /api/admin/products/stats
const getProductStats = async (req: Request, res: Response) => {
  try {
    const [total, active, inactive, bestseller, comboOffers, categoryCounts, categories] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { isActive: true } }),
        prisma.product.count({ where: { isActive: false } }),
        prisma.product.count({ where: { isBestseller: true } }),
        prisma.comboOffer.count(),
        prisma.product.groupBy({
          by: ["categoryId"],
          _count: { _all: true },
        }),
        prisma.category.findMany({
          where: { isActive: true },
          select: { id: true, name: true },
          orderBy: { displayOrder: "asc" },
        }),
      ]);

    const categoryBreakdown = categories.map((cat) => {
      const found = categoryCounts.find((c) => c.categoryId === cat.id);
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        count: found?._count._all || 0,
      };
    });

    res.json({
      data: {
        total,
        active,
        inactive,
        bestseller,
        comboOffers,
        categoryBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export {
  getCategories,
  getProductStats,
  getProductById,
  createProduct,
  getAdminProducts,
  updateProduct,
  deleteProduct,
  updateVariantStock,
  addVariant,
  updateVariant,
  deleteVariant,
};