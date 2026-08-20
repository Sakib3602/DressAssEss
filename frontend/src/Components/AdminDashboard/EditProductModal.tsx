import { useState } from "react";
import { X, ImagePlus, Plus, Trash2 } from "lucide-react";
import api from "../../URI/AXIOS";
import type { ProductData } from "./AdminAllProducts";


interface CategoryData {
  id: string;
  name: string;
}

interface Props {
  product: ProductData;
  categories: CategoryData[];
  onClose: () => void;
  onSaved: () => void;
}

const MIN_IMAGES = 2;
const MAX_IMAGES = 4;

export default function EditProductModal({ product, categories, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription || "",
    categoryId: product.categoryId,
    brand: product.brand || "",
    price: String(product.price),
    discountPrice: product.discountPrice ? String(product.discountPrice) : "",
    material: product.material || "",
    careInstructions: product.careInstructions || "",
    isBestseller: product.isBestseller,
    isActive: product.isActive,
  });

  const [existingImages, setExistingImages] = useState<string[]>(product.images);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ---- new variant row (add) ----
  const [newVariant, setNewVariant] = useState({ size: "", color: "", colorCode: "#000000", stock: 0, sku: "" });
  const [variants, setVariants] = useState(product.variants);
  const [addingVariant, setAddingVariant] = useState(false);

  const totalImages = existingImages.length + newFiles.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const combined = [...newFiles, ...selected].slice(0, MAX_IMAGES - existingImages.length);
    setNewFiles(combined);
    setNewPreviews(combined.map((f) => URL.createObjectURL(f)));
    e.target.value = "";
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((imgs) => imgs.filter((i) => i !== url));
  };
  const removeNewImage = (idx: number) => {
    const updated = newFiles.filter((_, i) => i !== idx);
    setNewFiles(updated);
    setNewPreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const handleSave = async () => {
    setError("");
    if (totalImages < MIN_IMAGES) {
      setError(`কমপক্ষে ${MIN_IMAGES}টা image রাখতে হবে`);
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("shortDescription", form.shortDescription);
      fd.append("categoryId", form.categoryId);
      fd.append("brand", form.brand);
      fd.append("price", form.price);
      fd.append("discountPrice", form.discountPrice);
      fd.append("material", form.material);
      fd.append("careInstructions", form.careInstructions);
      fd.append("isBestseller", String(form.isBestseller));
      fd.append("isActive", String(form.isActive));
      fd.append("existingImages", JSON.stringify(existingImages));
      newFiles.forEach((f) => fd.append("images", f));

      await api.put(`/admin/products/${product.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSaved();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAddVariant = async () => {
    if (!newVariant.size || !newVariant.color) {
      setError("নতুন variant এর জন্য size ও color দাও");
      return;
    }
    setAddingVariant(true);
    setError("");
    try {
      const { data } = await api.post(`/admin/products/${product.id}/variants`, newVariant);
      setVariants((v) => [...v, data.data]);
      setNewVariant({ size: "", color: "", colorCode: "#000000", stock: 0, sku: "" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Variant add failed");
    } finally {
      setAddingVariant(false);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!window.confirm("এই variant টা ডিলিট করতে চাও?")) return;
    try {
      await api.delete(`/admin/products/variants/${variantId}`);
      setVariants((v) => v.filter((x) => x.id !== variantId));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Variant delete failed");
    }
  };

  const handleVariantFieldSave = async (variantId: string, field: "size" | "color" | "stock" | "sku", value: string | number) => {
    try {
      await api.put(`/admin/products/variants/${variantId}`, { [field]: value });
      setVariants((vs) => vs.map((v) => (v.id === variantId ? { ...v, [field]: value } : v)));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Variant update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-none w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Edit Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded-none">
              {error}
            </div>
          )}

          {/* basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Brand</label>
              <input
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Price (৳)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Discount Price (৳)</label>
              <input
                type="number"
                value={form.discountPrice}
                onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
                className="w-full border border-gray-300 rounded-none px-3 py-2.5 text-sm"
              />
            </div>

            <div className="flex items-center gap-6 md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isBestseller}
                  onChange={(e) => setForm((f) => ({ ...f, isBestseller: e.target.checked }))}
                />
                Bestseller
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                />
                Active (visible on site)
              </label>
            </div>
          </div>

          {/* images */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-3">
              Images ({totalImages}/{MAX_IMAGES})
            </label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img) => (
                <div key={img} className="relative w-20 h-20 border border-gray-200">
                  <img src={img} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeExistingImage(img)}
                    className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1 text-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 border border-gray-200">
                  <img src={src} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeNewImage(i)}
                    className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1 text-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {totalImages < MAX_IMAGES && (
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer text-gray-400 hover:text-[#7A3B46] hover:border-[#7A3B46]">
                  <ImagePlus size={20} />
                  <input type="file" accept="image/*" multiple hidden onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          {/* variants */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-3">Variants</label>
            <div className="flex flex-col gap-2 mb-3">
              {variants.map((v) => (
                <div key={v.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    defaultValue={v.size}
                    onBlur={(e) => e.target.value !== v.size && handleVariantFieldSave(v.id, "size", e.target.value)}
                    className="col-span-3 border border-gray-300 px-2 py-2 text-xs"
                    placeholder="Size"
                  />
                  <input
                    defaultValue={v.color}
                    onBlur={(e) => e.target.value !== v.color && handleVariantFieldSave(v.id, "color", e.target.value)}
                    className="col-span-3 border border-gray-300 px-2 py-2 text-xs"
                    placeholder="Color"
                  />
                  <input
                    type="number"
                    defaultValue={v.stock}
                    onBlur={(e) => Number(e.target.value) !== v.stock && handleVariantFieldSave(v.id, "stock", Number(e.target.value))}
                    className="col-span-3 border border-gray-300 px-2 py-2 text-xs"
                    placeholder="Stock"
                  />
                  <div className="col-span-3 flex justify-end">
                    <button onClick={() => handleDeleteVariant(v.id)} className="text-gray-300 hover:text-red-600 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3">
              <input
                value={newVariant.size}
                onChange={(e) => setNewVariant((v) => ({ ...v, size: e.target.value }))}
                placeholder="Size"
                className="col-span-3 border border-gray-300 px-2 py-2 text-xs"
              />
              <input
                value={newVariant.color}
                onChange={(e) => setNewVariant((v) => ({ ...v, color: e.target.value }))}
                placeholder="Color"
                className="col-span-3 border border-gray-300 px-2 py-2 text-xs"
              />
              <input
                type="number"
                value={newVariant.stock}
                onChange={(e) => setNewVariant((v) => ({ ...v, stock: Number(e.target.value) }))}
                placeholder="Stock"
                className="col-span-3 border border-gray-300 px-2 py-2 text-xs"
              />
              <button
                onClick={handleAddVariant}
                disabled={addingVariant}
                className="col-span-3 flex items-center justify-center gap-1 bg-[#2B2320] text-white text-xs font-semibold py-2 disabled:opacity-50"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#2B2320] text-white text-sm font-bold uppercase tracking-wide px-8 py-2.5 hover:bg-[#7A3B46] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}