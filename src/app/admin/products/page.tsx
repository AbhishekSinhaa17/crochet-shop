import { createServerSupabaseClient } from "@/lib/supabase/server";
import AdminProductActions from "@/components/admin/AdminProductActions";
import Link from "next/link";
import { formatPrice, getProductImage } from "@/lib/utils";
import {
  Plus,
  Edit,
  Package,
  Sparkles,
  Eye,
  Archive,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Layers,
  IndianRupee,
  ArrowUpRight,
  ImageIcon,
} from "lucide-react";

export default async function AdminProductsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false });

  // Stats
  const totalProducts = products?.length || 0;
  const activeProducts = products?.filter((p) => p.is_active).length || 0;
  const outOfStock = products?.filter((p) => p.stock <= 0).length || 0;
  const lowStock =
    products?.filter((p) => p.stock > 0 && p.stock <= 5).length || 0;

  const getStockStyle = (stock: number) => {
    if (stock <= 0)
      return {
        text: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700/50",
        label: "Out of stock",
        icon: XCircle,
      };
    if (stock <= 5)
      return {
        text: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700/50",
        label: "Low stock",
        icon: AlertTriangle,
      };
    return {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-700/50",
      label: "In stock",
      icon: CheckCircle2,
    };
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ── Background blobs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full 
            bg-pink-200/20 dark:bg-pink-800/10 blur-3xl"
        />
        <div
          className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full 
            bg-violet-200/20 dark:bg-violet-800/10 blur-3xl"
        />
        <div
          className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full 
            bg-amber-200/10 dark:bg-amber-800/5 blur-3xl"
        />
      </div>

      {/* ══════════════════════════════════════════
          HEADER
         ══════════════════════════════════════════ */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
          gap-4 mb-6 animate-fade-in-down"
        style={{ animationDelay: "0ms" }}
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Products
            </h1>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 
                text-[11px] font-semibold border
                bg-pink-50 border-pink-200 text-pink-600
                dark:bg-pink-900/30 dark:border-pink-700/50 dark:text-pink-400"
            >
              <Sparkles className="w-3 h-3" />
              {totalProducts} total
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Manage your product catalog and inventory
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm 
            font-semibold text-white transition-all duration-300
            bg-linear-to-r from-violet-600 to-purple-600 
            hover:from-violet-700 hover:to-purple-700
            shadow-lg shadow-violet-500/25 dark:shadow-violet-500/15
            hover:shadow-xl hover:shadow-violet-500/30
            hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          Add Product
        </Link>
      </div>

      {/* ══════════════════════════════════════════
          MINI STAT CARDS
         ══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Products",
            value: totalProducts,
            icon: Package,
            color: "from-violet-500 to-purple-500",
            iconBg:
              "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
          },
          {
            label: "Active",
            value: activeProducts,
            icon: CheckCircle2,
            color: "from-emerald-500 to-teal-500",
            iconBg:
              "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
          },
          {
            label: "Low Stock",
            value: lowStock,
            icon: AlertTriangle,
            color: "from-amber-500 to-orange-500",
            iconBg:
              "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
          },
          {
            label: "Out of Stock",
            value: outOfStock,
            icon: XCircle,
            color: "from-red-500 to-rose-500",
            iconBg:
              "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="stat-card group relative overflow-hidden rounded-2xl p-4
              shadow-sm border animate-fade-in-up
              bg-white border-gray-100/60
              dark:bg-gray-900 dark:border-gray-800"
            style={{ animationDelay: `${80 + i * 80}ms` }}
          >
            <div
              className={`absolute inset-x-0 top-0 h-0.5 bg-linear-to-r ${stat.color} 
                opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
            />
            <div
              className={`absolute -right-3 -top-3 h-16 w-16 rounded-full 
                bg-linear-to-br ${stat.color} opacity-[0.05] dark:opacity-[0.08]
                group-hover:opacity-[0.1] dark:group-hover:opacity-[0.15]
                group-hover:scale-125 transition-all duration-700`}
            />
            <div className="relative flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg 
                  ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          PRODUCTS TABLE
         ══════════════════════════════════════════ */}
      <div
        className="animate-fade-in-up rounded-2xl shadow-sm border overflow-hidden
          bg-white border-gray-100/60
          dark:bg-gray-900 dark:border-gray-800"
        style={{ animationDelay: "400ms" }}
      >
        {/* Table header bar */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b
            border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl 
                bg-linear-to-br from-pink-500 to-rose-600 
                shadow-lg shadow-pink-500/20 dark:shadow-pink-500/10"
            >
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-gray-900 dark:text-white">
                Product Catalog
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {totalProducts} product{totalProducts !== 1 ? "s" : ""} in your
                store
              </p>
            </div>
          </div>

          {/* Active indicator */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border
              bg-emerald-50/80 border-emerald-200/50
              dark:bg-emerald-900/20 dark:border-emerald-700/30"
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping 
                  rounded-full bg-emerald-400 opacity-75"
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              {activeProducts} Active
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto premium-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/60 dark:bg-gray-800/40">
                {[
                  "Product",
                  "Category",
                  "Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`py-3 px-6 text-[11px] font-bold uppercase 
                      tracking-wider text-gray-400 dark:text-gray-500
                      ${i === 5 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {(products || []).length > 0 ? (
                (products || []).map((product, idx) => {
                  const stock = getStockStyle(product.stock);
                  const StockIcon = stock.icon;

                  return (
                    <tr
                      key={product.id}
                      className="order-row group border-b
                        border-gray-50 dark:border-gray-800/60 
                        animate-table-row"
                      style={{ animationDelay: `${500 + idx * 60}ms` }}
                    >
                      {/* Product name + image */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 
                              border-2 border-transparent group-hover:border-violet-200 
                              dark:group-hover:border-violet-700/50
                              transition-all duration-300 shadow-sm group-hover:shadow-md"
                          >
                            {getProductImage(product.images) ? (
                              <img
                                src={getProductImage(product.images)}
                                alt={product.name}
                                className="w-full h-full object-cover 
                                  group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center 
                                  bg-gray-100 dark:bg-gray-800"
                              >
                                <ImageIcon className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                              </div>
                            )}

                            {/* Hover overlay */}
                            <div
                              className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/10 
                                transition-colors duration-300 flex items-center justify-center"
                            >
                              <Eye
                                className="w-4 h-4 text-white opacity-0 
                                  group-hover:opacity-70 transition-opacity duration-300"
                              />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <p
                              className="font-semibold text-sm line-clamp-1 
                                text-gray-900 dark:text-white
                                group-hover:text-violet-600 dark:group-hover:text-violet-400
                                transition-colors duration-300"
                            >
                              {product.name}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-0.5 font-mono">
                              ID: {product.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        {(product as any).category?.name ? (
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-medium 
                              px-2.5 py-1 rounded-lg
                              bg-gray-100 text-gray-600
                              dark:bg-gray-800 dark:text-gray-400"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            {(product as any).category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300 dark:text-gray-600">
                            —
                          </span>
                        )}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        {product.compare_price &&
                          product.compare_price > product.price && (
                            <span className="text-[11px] text-gray-400 dark:text-gray-600 line-through">
                              {formatPrice(product.compare_price)}
                            </span>
                          )}
                      </td>

                      {/* Stock */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold 
                              px-2.5 py-1 rounded-full border ${stock.bg} ${stock.text}`}
                          >
                            <StockIcon className="w-3 h-3" />
                            {product.stock}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold 
                            px-2.5 py-1 rounded-full border ${
                              product.is_active
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-400"
                                : "bg-gray-100 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.is_active
                                ? "bg-emerald-500"
                                : "bg-gray-400 dark:bg-gray-600"
                            }`}
                          />
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <AdminProductActions
                          product={{
                            id: product.id,
                            slug: product.slug,
                            images: product.images,
                          }}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* ── Empty state ── */
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl
                          bg-gray-50 dark:bg-gray-800"
                      >
                        <Package className="h-7 w-7 text-gray-300 dark:text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                          No products yet
                        </p>
                        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                          Start building your catalog by adding your first
                          product
                        </p>
                      </div>
                      <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm 
                          font-semibold text-white transition-all duration-300
                          bg-linear-to-r from-violet-600 to-purple-600 
                          hover:from-violet-700 hover:to-purple-700
                          shadow-lg shadow-violet-500/25 
                          hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <Plus className="w-4 h-4" />
                        Add First Product
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {(products || []).length > 0 && (
          <div
            className="flex items-center justify-between px-6 py-3.5 border-t
              border-gray-100 bg-gray-50/40
              dark:border-gray-800 dark:bg-gray-800/30"
          >
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {products?.length}
              </span>{" "}
              product{(products?.length || 0) !== 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-4">
              {/* Stock summary */}
              <div className="hidden sm:flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {activeProducts} active
                </span>
                {lowStock > 0 && (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {lowStock} low
                  </span>
                )}
                {outOfStock > 0 && (
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    {outOfStock} out
                  </span>
                )}
              </div>

              <div className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                      d === 0 ? "bg-pink-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
