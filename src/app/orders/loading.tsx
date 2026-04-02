import { Package, ShoppingBag } from "lucide-react";

export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-amber-50/30">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-linear-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-linear-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-4 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-5 w-64 bg-gray-100 rounded mt-3 animate-pulse" />
            </div>
            <div className="h-12 w-44 bg-linear-to-r from-amber-200 to-orange-200 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-white rounded-2xl p-5 border border-gray-100"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse mb-3" />
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-8 w-16 bg-gray-200 rounded mt-2 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="flex-1 h-12 bg-gray-100 rounded-xl animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-12 w-32 bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-12 w-28 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Order Cards Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Status Bar */}
              <div className="h-1 bg-linear-to-r from-gray-200 to-gray-300 animate-pulse" />
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  {/* Order Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 animate-pulse" />
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                      <div className="h-8 w-24 bg-gray-200 rounded mt-1 animate-pulse" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse" />
                  </div>
                </div>

                {/* Product Images */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex -space-x-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-xl border-2 border-white bg-gray-100 animate-pulse"
                        style={{ animationDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-gray-600">Loading orders...</span>
        </div>
      </div>
    </div>
  );
}