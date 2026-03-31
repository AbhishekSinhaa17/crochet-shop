"use client";

import { Heart, Sparkles } from "lucide-react";

export default function WishlistLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-rose-950/20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-rose-200/40 to-pink-200/40 dark:from-rose-900/20 dark:to-pink-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-pink-200/40 to-fuchsia-200/40 dark:from-pink-900/20 dark:to-fuchsia-900/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start gap-5">
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-rose-200 to-pink-200 dark:from-rose-900 dark:to-pink-900 rounded-2xl animate-pulse" />
            
            <div className="space-y-3">
              <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="h-5 w-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse mb-3" />
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded mt-2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-10 w-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            <div className="h-10 w-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent animate-shimmer" />
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="h-3 w-16 bg-rose-100 dark:bg-rose-900/50 rounded-full animate-pulse" />
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-100 dark:border-gray-800">
          <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Loading wishlist...</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}