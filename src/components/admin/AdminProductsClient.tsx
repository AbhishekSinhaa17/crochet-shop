"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
    Eye, 
    ImageIcon, 
    ShoppingBag, 
    Layers, 
    Package, 
    CheckCircle2, 
    AlertTriangle, 
    XCircle,
    Plus
} from "lucide-react";
import { formatPrice, getProductImage } from "@/lib/utils";
import AdminProductActions from "./AdminProductActions";
import ProductPreviewModal from "./ProductPreviewModal";

interface AdminProductsClientProps {
  products: any[];
  totalProducts: number;
  activeProducts: number;
  lowStock: number;
  outOfStock: number;
}

export default function AdminProductsClient({ 
    products, 
    totalProducts, 
    activeProducts, 
    lowStock, 
    outOfStock 
}: AdminProductsClientProps) {
  const [previewProductId, setPreviewProductId] = useState<string | null>(null);

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
    <>
      <div className="animate-fade-in-up rounded-2xl shadow-sm border overflow-hidden bg-white border-gray-100/60 dark:bg-gray-900 dark:border-gray-800" style={{ animationDelay: "400ms" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20 dark:shadow-pink-500/10">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-gray-900 dark:text-white">Product Catalog</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">{totalProducts} product{totalProducts !== 1 ? "s" : ""} in your store</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border bg-emerald-50/80 border-emerald-200/50 dark:bg-emerald-900/20 dark:border-emerald-700/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">{activeProducts} Active</span>
          </div>
        </div>

        <div className="overflow-x-auto premium-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/60 dark:bg-gray-800/40">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h, i) => (
                  <th key={h} className={`py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ${i === 5 ? "text-right" : "text-left"}`}>
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
                    <tr key={`admin-prod-${product.id}`} className="group border-b border-gray-50 dark:border-gray-800/60 animate-table-row" style={{ animationDelay: `${500 + idx * 60}ms` }}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setPreviewProductId(product.id)}
                            className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border-2 border-transparent group-hover:border-violet-200 dark:group-hover:border-violet-700/50 transition-all duration-300 shadow-sm group-hover:shadow-md cursor-pointer"
                          >
                            {getProductImage(product.images) ? (
                              <Image 
                                src={getProductImage(product.images)} 
                                alt={product.name} 
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                <ImageIcon className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/10 transition-colors duration-300 flex items-center justify-center">
                              <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                            </div>
                          </button>
                          <div className="min-w-0">
                            <p 
                                onClick={() => setPreviewProductId(product.id)}
                                className="font-semibold text-sm line-clamp-1 text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300 cursor-pointer"
                            >
                                {product.name}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-0.5 font-mono">ID: {product.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-left">
                        {product.category?.name ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                            <ShoppingBag className="w-3 h-3" />
                            {product.category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
                        </div>
                        {product.compare_price && product.compare_price > product.price && (
                          <span className="text-[11px] text-gray-400 dark:text-gray-600 line-through">{formatPrice(product.compare_price)}</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${stock.bg} ${stock.text}`}>
                            <StockIcon className="w-3 h-3" />
                            {product.stock}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-left">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${product.is_active ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-400" : "bg-gray-100 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${product.is_active ? "bg-emerald-500" : "bg-gray-400 dark:bg-gray-600"}`} />
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <AdminProductActions 
                            product={{ id: product.id, slug: product.slug, images: product.images }} 
                            onPreview={() => setPreviewProductId(product.id)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800">
                        <Package className="h-7 w-7 text-gray-300 dark:text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400 dark:text-gray-500">No products yet</p>
                        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Start building your catalog by adding your first product</p>
                      </div>
                      <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:-translate-y-0.5">
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

        {(products || []).length > 0 && (
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 bg-gray-50/40 dark:border-gray-800 dark:bg-gray-800/30">
            <p className="text-xs text-gray-400 dark:text-gray-500">Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{products?.length}</span> product{(products?.length || 0) !== 1 ? "s" : ""}</p>
            <div className="flex items-center gap-4">
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
                  <span key={d} className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${d === 0 ? "bg-pink-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Centrally rendered Modal - Outside the table */}
      <ProductPreviewModal 
        productId={previewProductId || undefined}
        isOpen={!!previewProductId}
        onClose={() => setPreviewProductId(null)}
      />
    </>
  );
}
