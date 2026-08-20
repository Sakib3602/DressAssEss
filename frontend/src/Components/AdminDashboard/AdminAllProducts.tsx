import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Trash2,
  Pencil,
  X,
  Package,
  ImageOff,
  ChevronDown,
  Star,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
  XCircle,
  Gift,
} from "lucide-react";
import api from "../../URI/AXIOS";
import EditProductModal from "./EditProductModal";

interface VariantData {
  id: string;
  size: string;
  color: string;
  colorCode?: string | null;
  stock: number;
  sku?: string | null;
}
interface CategoryData {
  id: string;
  name: string;
}
export interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  brand?: string | null;
  categoryId: string;
  category: CategoryData;
  images: string[];
  price: string | number;
  discountPrice?: string | number | null;
  variants: VariantData[];
  totalStock: number;
  material?: string | null;
  careInstructions?: string | null;
  isBestseller: boolean;
  isActive: boolean;
  createdAt: string;
}

interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  count: number;
}
interface StatsData {
  total: number;
  active: number;
  inactive: number;
  bestseller: number;
  comboOffers: number;
  categoryBreakdown: CategoryBreakdown[];
}

const money = (n: string | number) =>
  `৳${Number(n).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`;

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-none bg-red-100 text-red-700 whitespace-nowrap">
        Stock Out
      </span>
    );
  if (stock <= 5)
    return (
      <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-none bg-orange-100 text-orange-700 whitespace-nowrap">
        Low Stock
      </span>
    );
  return (
    <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-none bg-green-100 text-green-700 whitespace-nowrap">
      In Stock
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-none p-4 flex items-center gap-3 min-w-[150px] flex-1">
      <div className={`w-10 h-10 shrink-0 flex items-center justify-center ${accent}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-xl font-bold text-gray-900 leading-tight">{value}</div>
        <div className="text-xs text-gray-500 truncate">{label}</div>
      </div>
    </div>
  );
}

export default function AdminAllProduct() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const [selected, setSelected] = useState<ProductData | null>(null);
  const [editing, setEditing] = useState<ProductData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // search debounce — পুরো ডাটাবেজ থেকে খোঁজে, শুধু বর্তমান পেজের ২০টা থেকে না
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    api
      .get("/admin/products/categories")
      .then(({ data }) => setCategories(data.data))
      .catch(() => {});
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/products/stats");
      setStats(data.data);
    } catch {
      // stats fail হলেও লিস্ট দেখাতে বাধা নেই
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/products", {
        params: {
          page,
          limit: LIMIT,
          search: debouncedSearch || undefined,
          categoryId: categoryId || undefined,
          stockStatus: stockStatus || undefined,
          sortBy,
          sortOrder,
        },
      });
      setProducts(data.data);
      setPages(data.pagination.pages || 1);
      setTotal(data.pagination.total);
      setSelected((prev) => {
        if (!prev) return prev;
        const fresh = data.data.find((p: ProductData) => p.id === prev.id);
        return fresh || prev;
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Product লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryId, stockStatus, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const refreshAll = () => {
    fetchProducts();
    fetchStats();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("এই প্রোডাক্টটা ডিলিট করতে চাও? এই কাজ Undo করা যাবে না।")) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/products/${id}`);
      if (selected?.id === id) setSelected(null);
      refreshAll();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleVariantStockSave = async (variantId: string, stock: number) => {
    try {
      await api.patch(`/admin/products/variants/${variantId}/stock`, { stock });
      fetchProducts();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Stock update failed");
    }
  };

  const handleVariantDelete = async (variantId: string) => {
    if (!window.confirm("এই variant টা ডিলিট করতে চাও?")) return;
    try {
      await api.delete(`/admin/products/variants/${variantId}`);
      fetchProducts();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Variant delete failed");
    }
  };

  const getPageNumbers = () => {
    const nums: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, start + 4);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* ------------- STATS SUMMARY ------------- */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-3">
          <StatCard
            icon={<Package size={20} className="text-[#7A3B46]" />}
            label="Total Products"
            value={stats?.total ?? 0}
            accent="bg-[#7A3B46]/10"
          />
          <StatCard
            icon={<CheckCircle2 size={20} className="text-green-600" />}
            label="Active"
            value={stats?.active ?? 0}
            accent="bg-green-50"
          />
          <StatCard
            icon={<XCircle size={20} className="text-gray-500" />}
            label="Inactive"
            value={stats?.inactive ?? 0}
            accent="bg-gray-100"
          />
          <StatCard
            icon={<Star size={20} className="text-amber-500" />}
            label="Bestsellers"
            value={stats?.bestseller ?? 0}
            accent="bg-amber-50"
          />
          <StatCard
            icon={<Gift size={20} className="text-purple-600" />}
            label="Combo / Bundle Offers"
            value={stats?.comboOffers ?? 0}
            accent="bg-purple-50"
          />
        </div>

        {/* category breakdown */}
        {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-none p-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers size={15} className="text-gray-400" />
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Products by Category
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.categoryBreakdown.map((c) => (
                <button
                  key={c.categoryId}
                  onClick={() => {
                    setCategoryId(categoryId === c.categoryId ? "" : c.categoryId);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-none transition-colors ${
                    categoryId === c.categoryId
                      ? "bg-[#2B2320] text-white border-[#2B2320]"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {c.categoryName}
                  <span
                    className={`px-1.5 py-0.5 rounded-none text-[10px] font-bold ${
                      categoryId === c.categoryId ? "bg-white/20" : "bg-white text-gray-500"
                    }`}
                  >
                    {c.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col xl:flex-row gap-4 md:gap-5">
        {/* ------------- LEFT: LIST ------------- */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#141821] tracking-tight">All Product</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                {total} products found{debouncedSearch ? ` · matching "${debouncedSearch}"` : ""}
              </p>
            </div>
          </div>

          {/* filters */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 md:gap-3 mb-4 md:mb-5">
            <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, brand, slug..."
                className="w-full bg-white border border-gray-200 rounded-none pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46] focus:border-[#7A3B46]"
              />
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2.5 sm:gap-3">
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-none pl-3 pr-8 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46]"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={stockStatus}
                  onChange={(e) => {
                    setStockStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-none pl-3 pr-8 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46]"
                >
                  <option value="">Any Stock</option>
                  <option value="in">In Stock</option>
                  <option value="low">Low Stock (≤5)</option>
                  <option value="out">Stock Out</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="relative">
              <select
                value={`${sortBy}:${sortOrder}`}
                onChange={(e) => {
                  const [f, o] = e.target.value.split(":");
                  setSortBy(f);
                  setSortOrder(o);
                  setPage(1);
                }}
                className="w-full sm:w-auto appearance-none bg-white border border-gray-200 rounded-none pl-3 pr-8 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#7A3B46]"
              >
                <option value="createdAt:desc">Newest First</option>
                <option value="createdAt:asc">Oldest First</option>
                <option value="price:asc">Price: Low to High</option>
                <option value="price:desc">Price: High to Low</option>
                <option value="name:asc">Name: A-Z</option>
                <option value="name:desc">Name: Z-A</option>
                <option value="totalStock:asc">Stock: Low to High</option>
                <option value="totalStock:desc">Stock: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {categoryId && (
              <button
                onClick={() => {
                  setCategoryId("");
                  setPage(1);
                }}
                className="text-xs font-semibold text-[#7A3B46] hover:underline px-2"
              >
                Clear category filter
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded-none">
              {error}
            </div>
          )}

          {/* table */}
          <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => handleSort("name")}
                className="col-span-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                Product
              </button>
              <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</div>
              <button
                onClick={() => handleSort("price")}
                className="col-span-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                Price
              </button>
              <button
                onClick={() => handleSort("totalStock")}
                className="col-span-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                Stock
              </button>
              <div className="col-span-1"></div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-gray-400">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
                <Package size={28} className="text-gray-300" />
                কোনো প্রোডাক্ট পাওয়া যায়নি
              </div>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`
                    cursor-pointer transition-colors border-b border-gray-100 last:border-b-0
                    flex items-center gap-3 px-4 py-3.5
                    md:grid md:grid-cols-12 md:gap-3 md:px-5 md:py-4
                    ${selected?.id === p.id ? "bg-[#7A3B46]/5" : "hover:bg-gray-50"}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 md:col-span-5 md:flex-none">
                    <div className="w-11 h-11 md:w-12 md:h-12 shrink-0 bg-gray-100 rounded-none overflow-hidden flex items-center justify-center">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageOff size={18} className="text-gray-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1.5">
                        {p.name}
                        {p.isBestseller && <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />}
                      </div>
                      <div className="text-xs text-gray-400 truncate">{p.category?.name}</div>
                      <div className="flex items-center gap-2 mt-1 md:hidden">
                        <span className="text-xs font-semibold text-gray-800">{money(p.price)}</span>
                        <StockBadge stock={p.totalStock} />
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block md:col-span-2 text-sm text-gray-600">{p.category?.name}</div>
                  <div className="hidden md:block md:col-span-2 text-sm font-medium text-gray-900">
                    {money(p.price)}
                    {p.discountPrice ? (
                      <span className="block text-xs text-gray-400 line-through">{money(p.discountPrice)}</span>
                    ) : null}
                  </div>
                  <div className="hidden md:flex md:col-span-2 items-center">
                    <StockBadge stock={p.totalStock} />
                  </div>

                  <div className="flex items-center gap-1 shrink-0 md:col-span-1 md:justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing(p);
                      }}
                      className="p-2 text-gray-400 hover:text-[#7A3B46] transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id);
                      }}
                      disabled={deletingId === p.id}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 border border-gray-200 rounded-none disabled:opacity-30 bg-white hover:bg-gray-50"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {getPageNumbers()[0] > 1 && (
                <>
                  <button
                    onClick={() => setPage(1)}
                    className="hidden sm:inline-block px-3.5 py-2 text-xs font-semibold border border-gray-200 rounded-none bg-white hover:bg-gray-50"
                  >
                    1
                  </button>
                  <span className="hidden sm:inline text-gray-400 text-xs px-1">…</span>
                </>
              )}

              {getPageNumbers().map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`hidden sm:inline-block px-3.5 py-2 text-xs font-semibold border rounded-none ${
                    n === page
                      ? "bg-[#2B2320] text-white border-[#2B2320]"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {n}
                </button>
              ))}

              <span className="sm:hidden text-xs font-semibold text-gray-600 px-3 py-2">
                Page {page} of {pages}
              </span>

              {getPageNumbers()[getPageNumbers().length - 1] < pages && (
                <>
                  <span className="hidden sm:inline text-gray-400 text-xs px-1">…</span>
                  <button
                    onClick={() => setPage(pages)}
                    className="hidden sm:inline-block px-3.5 py-2 text-xs font-semibold border border-gray-200 rounded-none bg-white hover:bg-gray-50"
                  >
                    {pages}
                  </button>
                </>
              )}

              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 border border-gray-200 rounded-none disabled:opacity-30 bg-white hover:bg-gray-50"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ------------- RIGHT: DETAIL PANEL ------------- */}
        {selected && (
          <div
            className="
              fixed inset-0 z-50 bg-black/50 flex items-end xl:items-start justify-center xl:justify-end
              xl:static xl:bg-transparent xl:block xl:z-auto
            "
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelected(null);
            }}
          >
            <div
              className="
                w-full max-h-[88vh] overflow-y-auto bg-white border-t border-gray-200 rounded-t-2xl
                xl:max-h-none xl:w-[380px] xl:shrink-0 xl:border xl:rounded-none xl:sticky xl:top-4 xl:overflow-visible
                p-5 md:p-6
              "
            >
              <div className="flex items-center justify-between mb-4">
                <div className="min-w-0 pr-3">
                  <h2 className="text-base font-bold text-gray-900 truncate">{selected.name}</h2>
                  <span
                    className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-none ${
                      selected.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {selected.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 shrink-0">
                  <X size={20} />
                </button>
              </div>

              <div className="flex gap-2 mb-5 overflow-x-auto">
                {selected.images?.length ? (
                  selected.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${selected.name}-${i}`}
                      className="w-16 h-16 object-cover border border-gray-200 rounded-none shrink-0"
                    />
                  ))
                ) : (
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                    <ImageOff size={18} className="text-gray-300" />
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600 mb-5 leading-relaxed">
                {selected.shortDescription || selected.description}
              </div>

              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500">Category</span>
                <span className="font-medium text-gray-900">{selected.category?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500">Brand</span>
                <span className="font-medium text-gray-900">{selected.brand || "—"}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-5">
                <span className="text-gray-500">Price</span>
                <span className="font-medium text-gray-900">
                  {money(selected.price)}
                  {selected.discountPrice ? (
                    <span className="text-xs text-gray-400 line-through ml-2">{money(selected.discountPrice)}</span>
                  ) : null}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                  Variants ({selected.variants.length})
                </h3>
                <div className="flex flex-col gap-3">
                  {selected.variants.map((v) => (
                    <div key={v.id} className="flex items-center justify-between gap-2 border border-gray-100 px-3 py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {v.colorCode && (
                          <span
                            className="w-4 h-4 rounded-full border border-gray-200 shrink-0"
                            style={{ backgroundColor: v.colorCode }}
                          />
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-gray-800 truncate">
                            {v.size} · {v.color}
                          </div>
                          {v.sku && <div className="text-[10px] text-gray-400 truncate">SKU: {v.sku}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min={0}
                          defaultValue={v.stock}
                          className="w-16 border border-gray-200 rounded-none px-2 py-1 text-xs"
                          onBlur={(e) => {
                            const val = Number(e.target.value);
                            if (val !== v.stock) handleVariantStockSave(v.id, val);
                          }}
                        />
                        <button
                          onClick={() => handleVariantDelete(v.id)}
                          className="text-gray-300 hover:text-red-600"
                          aria-label="Delete variant"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pb-1">
                <button
                  onClick={() => setEditing(selected)}
                  className="flex-1 bg-[#2B2320] text-white text-xs font-bold uppercase tracking-wide px-4 py-3 rounded-none hover:bg-[#7A3B46] transition-colors"
                >
                  Edit Product
                </button>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="flex-1 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wide px-4 py-3 rounded-none border border-red-200 hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {editing && (
        <EditProductModal
          product={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refreshAll();
          }}
        />
      )}
    </div>
  );
}