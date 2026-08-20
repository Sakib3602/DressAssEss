import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash2, Plus, X, ImagePlus, CheckCircle } from "lucide-react";
import api from "../../URI/AXIOS";

interface VariantForm {
  size: string;
  color: string;
  colorCode?: string;
  stock: number;
  sku?: string;
}

interface ProductFormValues {
  name: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  material?: string;
  careInstructions?: string;
  isBestseller: boolean;
  variants: VariantForm[];
}

const MAX_IMAGES = 4;
const MIN_IMAGES = 2;

export default function AdminAddProduct() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    api
      .get("/admin/products/categories")
      .then(({ data }) => setCategories(data.data))
      .catch(() => setServerError("Failed to load categories."));
  }, []);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: {
      isBestseller: false,
      variants: [{ size: "", color: "", colorCode: "", stock: 0, sku: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const combined = [...images, ...selected].slice(0, MAX_IMAGES);

    if (combined.length > MAX_IMAGES) {
      setImageError(`You can upload a maximum of ${MAX_IMAGES} images.`);
    } else {
      setImageError("");
    }

    setImages(combined);
    setPreviews(combined.map((file) => URL.createObjectURL(file)));
    e.target.value = ""; 
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setPreviews(updated.map((file) => URL.createObjectURL(file)));
  };

  const onSubmit = async (data: ProductFormValues) => {
    setServerError("");
    setSuccessMessage("");

    if (images.length < MIN_IMAGES) {
      setImageError(`A minimum of ${MIN_IMAGES} images is required.`);
      return;
    }
    setImageError("");

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      if (data.shortDescription) formData.append("shortDescription", data.shortDescription);
      formData.append("categoryId", data.categoryId);
      if (data.brand) formData.append("brand", data.brand);
      formData.append("price", String(data.price));
      if (data.discountPrice) formData.append("discountPrice", String(data.discountPrice));
      if (data.material) formData.append("material", data.material);
      if (data.careInstructions) formData.append("careInstructions", data.careInstructions);
      formData.append("isBestseller", String(data.isBestseller));
      formData.append("variants", JSON.stringify(data.variants));

      images.forEach((file) => formData.append("images", file));

      await api.post("/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Clear the form and images on success instead of redirecting
      reset();
      setImages([]);
      setPreviews([]);
      setSuccessMessage("Product has been added successfully!");
      
      // Auto-hide success message after 4 seconds
      setTimeout(() => setSuccessMessage(""), 4000);
      
    } catch (error: any) {
      setServerError(error?.response?.data?.message || "Failed to create product. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 uppercase tracking-wide">Add New Product</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to add a new product to your catalog.</p>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-none flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <p className="text-sm font-medium">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
        
        {/* ---------------- BASIC INFO ---------------- */}
        <div className="bg-white border border-gray-200 rounded-none p-6 md:p-10 shadow-sm flex flex-col gap-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3 mb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Product Name *</label>
              <input
                className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46] transition-colors bg-gray-50 hover:bg-white"
                placeholder="e.g., Comfort Fit Padded Bra"
                {...register("name", { required: "Product name is required" })}
              />
              {errors.name && <p className="text-xs text-red-600 mt-1.5">{errors.name.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Detailed Description *</label>
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46] transition-colors bg-gray-50 hover:bg-white resize-y"
                placeholder="Enter a comprehensive description of the product..."
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <p className="text-xs text-red-600 mt-1.5">{errors.description.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Short Summary</label>
              <input
                className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46] transition-colors bg-gray-50 hover:bg-white"
                placeholder="A brief tagline for product cards"
                {...register("shortDescription")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Category *</label>
              <select
                className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46] transition-colors bg-gray-50 hover:bg-white"
                {...register("categoryId", { required: "Please select a category" })}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-red-600 mt-1.5">{errors.categoryId.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Brand</label>
              <input
                className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46] transition-colors bg-gray-50 hover:bg-white"
                placeholder="e.g., Victoria's Secret"
                {...register("brand")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Price (৳) *</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46] transition-colors bg-gray-50 hover:bg-white"
                placeholder="0.00"
                {...register("price", { required: "Price is required", min: { value: 1, message: "Enter a valid price" } })}
              />
              {errors.price && <p className="text-xs text-red-600 mt-1.5">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Discount Price (৳)</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46] transition-colors bg-gray-50 hover:bg-white"
                placeholder="0.00 (Optional)"
                {...register("discountPrice")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Material</label>
              <input
                className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46] transition-colors bg-gray-50 hover:bg-white"
                placeholder="e.g., 95% Cotton, 5% Spandex"
                {...register("material")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Care Instructions</label>
              <input
                className="w-full border border-gray-300 rounded-none px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46] transition-colors bg-gray-50 hover:bg-white"
                placeholder="e.g., Hand wash cold"
                {...register("careInstructions")}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="isBestseller"
              className="w-4 h-4 rounded-none border-gray-300 text-[#7A3B46] focus:ring-[#7A3B46]"
              {...register("isBestseller")}
            />
            <label htmlFor="isBestseller" className="text-sm text-gray-700 font-medium cursor-pointer">
              Mark as Bestseller
            </label>
          </div>
        </div>

        {/* ---------------- IMAGES ---------------- */}
        <div className="bg-white border border-gray-200 rounded-none p-6 md:p-10 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-3 mb-6">
            Product Images
          </h2>
          
          <p className="text-xs text-gray-500 mb-6">
            Upload between <span className="font-semibold">{MIN_IMAGES}</span> and <span className="font-semibold">{MAX_IMAGES}</span> high-quality images. The first image will be the cover.
          </p>

          <div className="flex flex-wrap gap-5">
            {previews.map((src, i) => (
              <div key={i} className="relative w-36 h-36 border border-gray-200 rounded-none group overflow-hidden bg-gray-50">
                <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-white text-red-600 border border-gray-200 rounded-none p-1.5 shadow-sm hover:bg-red-50 transition-colors"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {images.length < MAX_IMAGES && (
              <label className="w-36 h-36 border-2 border-dashed border-gray-300 rounded-none flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-[#7A3B46] hover:text-[#7A3B46] hover:bg-gray-50 transition-all">
                <ImagePlus size={28} className="mb-3" />
                <span className="text-xs font-medium uppercase tracking-wide">Upload</span>
                <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
              </label>
            )}
          </div>
          {imageError && <p className="text-sm font-medium text-red-600 mt-4">{imageError}</p>}
        </div>

        {/* ---------------- VARIANTS ---------------- */}
        <div className="bg-white border border-gray-200 rounded-none p-6 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 mb-6 gap-4">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Inventory & Variants
            </h2>
            <button
              type="button"
              onClick={() => append({ size: "", color: "", colorCode: "", stock: 0, sku: "" })}
              className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide bg-gray-100 text-gray-800 px-5 py-2.5 border border-gray-200 rounded-none hover:bg-gray-200 transition-colors"
            >
              <Plus size={16} /> Add Variant
            </button>
          </div>

          <div className="hidden md:grid grid-cols-12 gap-4 mb-3 px-2">
            <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase">Size</div>
            <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase">Color Name</div>
            <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase">Hex Code</div>
            <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase">Stock Qty</div>
            <div className="col-span-1"></div>
          </div>

          <div className="flex flex-col gap-6 md:gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 items-center bg-gray-50 md:bg-transparent p-5 md:p-0 border border-gray-200 md:border-none rounded-none relative">
                
                <div className="md:col-span-3 w-full">
                  <label className="md:hidden block text-xs font-semibold text-gray-500 uppercase mb-1">Size</label>
                  <input
                    placeholder="e.g., 34B, M, L"
                    className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46]"
                    {...register(`variants.${index}.size` as const, { required: true })}
                  />
                </div>

                <div className="md:col-span-3 w-full">
                  <label className="md:hidden block text-xs font-semibold text-gray-500 uppercase mb-1">Color Name</label>
                  <input
                    placeholder="e.g., Midnight Black"
                    className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46]"
                    {...register(`variants.${index}.color` as const, { required: true })}
                  />
                </div>

                <div className="md:col-span-2 w-full flex items-center gap-3">
                  <label className="md:hidden block text-xs font-semibold text-gray-500 uppercase mb-1">Color Code</label>
                  <div className="relative w-full h-[42px]">
                    <input
                      type="color"
                      className="absolute inset-0 w-full h-full border border-gray-300 rounded-none cursor-pointer p-0.5 bg-white"
                      {...register(`variants.${index}.colorCode` as const)}
                    />
                  </div>
                </div>

                <div className="md:col-span-3 w-full">
                  <label className="md:hidden block text-xs font-semibold text-gray-500 uppercase mb-1">Stock</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46]"
                    {...register(`variants.${index}.stock` as const, { required: true, min: 0 })}
                  />
                </div>

                <div className="md:col-span-1 flex justify-end md:justify-center absolute top-2 right-2 md:static">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="text-gray-400 hover:text-red-600 disabled:opacity-30 transition-colors p-2 bg-white md:bg-transparent border border-gray-200 md:border-none rounded-none"
                    aria-label="Remove variant"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {errors.variants && (
            <p className="text-sm font-medium text-red-600 mt-5 bg-red-50 p-3 border border-red-100 rounded-none">
              ⚠️ Size, Color, and Stock fields are required for every variant.
            </p>
          )}
        </div>

        {/* ---------------- SUBMIT ---------------- */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-none text-sm font-medium">
            {serverError}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2B2320] text-white text-sm font-bold uppercase tracking-wider px-12 py-4 rounded-none border border-[#2B2320] hover:bg-[#7A3B46] hover:border-[#7A3B46] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm w-full md:w-auto"
          >
            {isSubmitting ? "Publishing Product..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}