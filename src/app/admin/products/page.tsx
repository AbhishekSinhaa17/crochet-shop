import { ProductService } from "@/services/product-service";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export default async function AdminProductsPage() {
  const productService = new ProductService(true);
  const { data: products } = await productService.getProducts({ limit: 1000 });

  // Stats
  const totalProducts = products?.length || 0;
  const activeProducts = products?.filter((p) => p.is_active).length || 0;
  const outOfStock = products?.filter((p) => p.stock <= 0).length || 0;
  const lowStock = products?.filter((p) => p.stock > 0 && p.stock <= 5).length || 0;

  return (
    <div className="min-h-screen relative">
      {/* ── Background blobs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-pink-200/20 dark:bg-pink-800/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-violet-200/20 dark:bg-violet-800/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-amber-200/10 dark:bg-amber-800/5 blur-3xl" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in-down" style={{ animationDelay: "0ms" }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Products</h1>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/30 dark:border-pink-700/50 dark:text-pink-400">
              <Sparkles className="w-3 h-3" />
              {totalProducts} total
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">Manage your product catalog and inventory</p>
        </div>

        <Link
          href="/admin/products/new"
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25 dark:shadow-violet-500/15 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Products", value: totalProducts, icon: Sparkles, color: "from-violet-500 to-purple-500", iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400" },
          { label: "Active", value: activeProducts, icon: Sparkles, color: "from-emerald-500 to-teal-500", iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" },
          { label: "Low Stock", value: lowStock, icon: Sparkles, color: "from-amber-500 to-orange-500", iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" },
          { label: "Out of Stock", value: outOfStock, icon: Sparkles, color: "from-red-500 to-rose-500", iconBg: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" },
        ].map((stat, i) => (
          <div key={stat.label} className="group relative overflow-hidden rounded-2xl p-4 shadow-sm border animate-fade-in-up bg-white border-gray-100/60 dark:bg-gray-900 dark:border-gray-800" style={{ animationDelay: `${80 + i * 80}ms` }}>
            <div className={`absolute inset-x-0 top-0 h-0.5 bg-linear-to-r ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full bg-linear-to-br ${stat.color} opacity-[0.05] dark:opacity-[0.08] group-hover:opacity-[0.1] dark:group-hover:opacity-[0.15] group-hover:scale-125 transition-all duration-700`} />
            <div className="relative flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdminProductsClient 
        products={products || []}
        totalProducts={totalProducts}
        activeProducts={activeProducts}
        lowStock={lowStock}
        outOfStock={outOfStock}
      />
    </div>
  );
}
