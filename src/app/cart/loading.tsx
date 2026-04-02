import { ShoppingBag, Package } from "lucide-react";

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-linear-to-r from-amber-200/30 to-orange-200/30 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-linear-to-r from-emerald-200/30 to-teal-200/30 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-linear-to-br from-amber-200 to-orange-200 dark:from-amber-900 dark:to-orange-900 rounded-2xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Free Shipping Progress */}
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-6"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex gap-4 sm:gap-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-4">
                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="p-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                ))}
                <div className="h-14 bg-linear-to-r from-amber-200 to-orange-200 dark:from-amber-900 dark:to-orange-900 rounded-2xl animate-pulse mt-4" />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded mx-auto mb-2 animate-pulse" />
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-100 dark:border-gray-800">
          <ShoppingBag className="w-5 h-5 text-amber-500 animate-pulse" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Loading cart...</span>
        </div>
      </div>
    </div>
  );
}