"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Product, Category } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  ChevronRight,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  ArrowUpDown,
  X,
  Filter,
  Package,
  Tag,
  Flame,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Props {
  products: Product[];
  categories: Category[];
  categoryCounts: Record<string, number>;
  currentCategory: string | null;
  currentCategoryData: Category | null;
  currentSort: string;
  searchQuery: string | null;
}

const sortOptions = [
  { value: "newest", label: "Newest First", icon: Clock },
  { value: "popular", label: "Most Popular", icon: TrendingUp },
  { value: "rating", label: "Top Rated", icon: Star },
  { value: "price-asc", label: "Price: Low to High", icon: ArrowUpDown },
  { value: "price-desc", label: "Price: High to Low", icon: ArrowUpDown },
];

export default function ProductsPageClient({
  products,
  categories,
  categoryCounts,
  currentCategory,
  currentCategoryData,
  currentSort,
  searchQuery,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Load viewMode from localStorage
    const savedView = localStorage.getItem("products-view-mode");
    if (savedView === "grid" || savedView === "list") {
      setViewMode(savedView);
    }

    const fetchAdminStatus = async () => {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.profile?.role?.toLowerCase()?.trim() === "admin") {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Error fetching admin status:", e);
      }
    };
    fetchAdminStatus();
  }, []);

  const handleViewChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("products-view-mode", mode);
  };

  // Filter products client-side for additional filters
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    if (showOnlyInStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }
    
    if (showOnlyOnSale) {
      filtered = filtered.filter(p => p.compare_price && p.compare_price > p.price);
    }
    
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    return filtered;
  }, [products, showOnlyInStock, showOnlyOnSale, priceRange]);

  const buildUrl = (params: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    
    return `/products?${current.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(buildUrl({ search: searchInput.trim() }));
    } else {
      router.push(buildUrl({ search: null }));
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    router.push(buildUrl({ search: null }));
  };

  const activeFiltersCount = [
    currentCategory,
    searchQuery,
    showOnlyInStock,
    showOnlyOnSale,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/20">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-linear-to-r from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-linear-to-r from-rose-200/30 to-pink-200/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-linear-to-r from-amber-100/30 to-yellow-200/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative">
        {/* Hero Section */}
        <div 
          className={`relative overflow-hidden transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="absolute inset-0 bg-linear-to-r from-amber-600 via-orange-500 to-rose-500" />
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
          
          {/* Animated Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full animate-float" />
            <div className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-full animate-float animation-delay-1000" />
            <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-white/10 rounded-lg rotate-45 animate-float animation-delay-2000" />
            <div className="absolute bottom-20 right-1/3 w-24 h-24 border-2 border-white/20 rounded-2xl animate-spin-slow" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
              <Link 
                href="/" 
                className="text-white/70 hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <div className="w-1 h-1 bg-white/50 rounded-full group-hover:scale-150 transition-transform" />
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-white/30" />
              <Link 
                href="/products" 
                className="text-white/70 hover:text-white transition-colors"
              >
                Products
              </Link>
              {currentCategoryData && (
                <>
                  <ChevronRight className="w-4 h-4 text-white/30" />
                  <span className="text-white font-medium">
                    {currentCategoryData.name}
                  </span>
                </>
              )}
            </nav>

            {/* Title & Description */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                  {currentCategoryData ? currentCategoryData.name : "Our Collection"}
                </h1>
                <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
                  {currentCategoryData?.description || "Browse our exclusive collection of handmade crochet products, crafted with love and attention to every stitch."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & Filter Bar */}
          <div 
            className={`mb-8 transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative group max-w-full md:w-80">
                  <div className="absolute inset-0 bg-amber-200/20 dark:bg-amber-500/10 blur-xl rounded-full group-hover:bg-amber-300/30 dark:group-hover:bg-amber-500/20 transition-all duration-500" />
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-amber-500 z-10" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-900 border border-amber-100/50 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all duration-300 shadow-lg shadow-amber-100/20 dark:shadow-black/20 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </form>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-1.5 p-1.5 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-xl border border-white/50 dark:border-gray-800">
                  <button
                    onClick={() => handleViewChange("grid")}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      viewMode === "grid"
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                        : "text-gray-400 hover:text-amber-600 dark:hover:text-amber-500"
                    )}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleViewChange("list")}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      viewMode === "list"
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                        : "text-gray-400 hover:text-amber-600 dark:hover:text-amber-500"
                    )}
                  >
                    <LayoutList className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(currentCategory || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                
                {currentCategory && (
                  <Link
                    href={buildUrl({ category: null })}
                    scroll={false}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors group"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    {currentCategoryData?.name || currentCategory}
                    <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                  </Link>
                )}
                
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors group"
                  >
                    <Search className="w-3.5 h-3.5" />
                    "{searchQuery}"
                    <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                  </button>
                )}
                
                <Link
                  href="/products"
                  scroll={false}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 underline transition-colors"
                >
                  Clear all
                </Link>
              </div>
            )}
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside 
              className={`hidden lg:block w-72 shrink-0 transition-all duration-700 delay-200 ${
                isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="sticky top-24 space-y-6">
                {/* Categories Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div className="p-5 bg-linear-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-700">
                    <h3 className="font-display font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Categories
                    </h3>
                  </div>
                  
                  <nav className="p-3">
                    <Link
                      href="/products"
                      scroll={false}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                        !currentCategory
                          ? "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        !currentCategory ? "bg-white/20" : "bg-amber-100 dark:bg-gray-800 group-hover:bg-amber-200 dark:group-hover:bg-gray-700"
                      )}>
                        <Grid3X3 className={cn(
                          "w-5 h-5",
                          !currentCategory ? "text-white" : "text-amber-600 dark:text-amber-400"
                        )} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <span className="block font-semibold truncate group-hover:translate-x-1 transition-transform">
                          All Products
                        </span>
                        <span className={cn(
                          "block text-xs",
                          !currentCategory ? "text-white/70" : "text-gray-400 dark:text-gray-500"
                        )}>
                          {categoryCounts.all} items
                        </span>
                      </div>
                      {!currentCategory && (
                        <Sparkles className="w-4 h-4 text-white/70" />
                      )}
                    </Link>

                    {categories.map((cat, idx) => {
                      const isActive = currentCategory === cat.slug;
                      
                      return (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          scroll={false}
                          className={cn(
                            "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                            isActive
                              ? "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden transition-colors",
                            isActive ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800 group-hover:bg-amber-100 dark:group-hover:bg-gray-700"
                          )}>
                            {cat.image_url ? (
                              <Image
                                src={cat.image_url}
                                alt={cat.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className={cn(
                                "w-5 h-5",
                                isActive ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-amber-600 dark:group-hover:text-amber-400"
                              )} />
                            )}
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <span className="block font-semibold truncate group-hover:translate-x-1 transition-transform">{cat.name}</span>
                            <span className={cn(
                              "block text-xs",
                              isActive ? "text-white/70" : "text-gray-400 dark:text-gray-500"
                            )}>
                              {categoryCounts[cat.id] || 0} items
                            </span>
                          </div>
                          {isActive && (
                            <Sparkles className="w-4 h-4 text-white/70" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Sort/Filter Stats */}
                <div className="hidden lg:block p-6 bg-linear-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-700 rounded-3xl text-white shadow-lg shadow-amber-500/20 dark:shadow-amber-900/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Star className="w-16 h-16 fill-current" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-1">Premium Quality</h3>
                    <p className="text-amber-50 dark:text-amber-100 text-xs leading-relaxed">
                      Every piece is carefully inspect for quality and durability.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Count */}
              <div 
                className={`flex items-center justify-between mb-6 transition-all duration-700 delay-300 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Showing <span className="text-gray-900 dark:text-white font-bold">{products.length}</span> items
                </p>
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-800 shadow-xl shadow-amber-100/20 dark:shadow-black/20 animate-fade-in">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-full flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-amber-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      href="/products"
                      scroll={false}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
                    >
                      <Grid3X3 className="w-5 h-5" />
                      View All Products
                    </Link>
                    <button
                      onClick={clearSearch}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className={cn(
                    "transition-all duration-700 delay-300",
                    isLoaded ? "opacity-100" : "opacity-0",
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
                      : "space-y-4"
                  )}
                >
                  {filteredProducts.map((product, idx) => (
                    <div
                      key={`${product.id}-${idx}`}
                      className={cn(
                        "transform transition-all duration-500",
                        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      )}
                      style={{ 
                        transitionDelay: `${Math.min(idx * 50, 500)}ms` 
                      }}
                    >
                      {viewMode === "grid" ? (
                        <ProductCard product={product} isAdmin={isAdmin} />
                      ) : (
                        <ProductListCard product={product} isAdmin={isAdmin} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        <MobileFilterModal
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          categories={categories}
          currentCategory={currentCategory}
          currentSort={currentSort}
          sortOptions={sortOptions}
          showOnlyInStock={showOnlyInStock}
          setShowOnlyInStock={setShowOnlyInStock}
          showOnlyOnSale={showOnlyOnSale}
          setShowOnlyOnSale={setShowOnlyOnSale}
          productCounts={{
            total: products.length,
            inStock: products.filter(p => p.stock > 0).length,
            onSale: products.filter(p => p.compare_price && p.compare_price > p.price).length,
          }}
          buildUrl={buildUrl}
        />
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(30px, 30px) scale(1.05);
          }
        }
        
        .animate-blob {
          animation: blob 15s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

// Product List Card Component
function ProductListCard({ product, isAdmin = false }: { product: Product; isAdmin?: boolean }) {
  const addItem = useCartStore((s) => s.addItem);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const hasDiscount = product.compare_price && product.compare_price > product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdmin) return;
    if (product.stock <= 0) {
      toast.error("Out of stock!");
      return;
    }

    try {
      addItem(product, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdmin) return;
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };
  
  return (
    <Link
      href={`/products/${product.slug || product.id}`}
      className="group flex gap-6 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-100/50 dark:hover:shadow-black/40 transition-all duration-500"
    >
      {/* Image */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden shrink-0">
        <Image
          src={product.images?.[0] || "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            SALE
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-2">
        <div>
          {product.category && (
            <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
              {product.category.name}
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mt-1">
            {product.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">
            {product.description}
          </p>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.round(product.avg_rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200 dark:text-gray-700"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              ({product.review_count})
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.compare_price}
              </span>
            )}
          </div>
          
          {!isAdmin && (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleWishlist}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isWishlisted
                    ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-400"
                )}
              >
                <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
              </button>
              <button 
                onClick={handleAddToCart}
                className="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20 transition-all active:scale-95"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Mobile Filter Modal
function MobileFilterModal({
  isOpen,
  onClose,
  categories,
  currentCategory,
  currentSort,
  sortOptions,
  showOnlyInStock,
  setShowOnlyInStock,
  showOnlyOnSale,
  setShowOnlyOnSale,
  productCounts,
  buildUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentCategory: string | null;
  currentSort: string;
  sortOptions: { value: string; label: string; icon: any }[];
  showOnlyInStock: boolean;
  setShowOnlyInStock: (value: boolean) => void;
  showOnlyOnSale: boolean;
  setShowOnlyOnSale: (value: boolean) => void;
  productCounts: { total: number; inStock: number; onSale: number };
  buildUrl: (params: Record<string, string | null>) => string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-display font-bold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-amber-500" />
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-140px)]">
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              <Link
                href="/products"
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl transition-colors",
                  !currentCategory
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-50 hover:bg-gray-100"
                )}
              >
                <span>All Products</span>
                <span className="text-sm text-gray-400">{productCounts.total}</span>
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl transition-colors",
                    currentCategory === cat.slug
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-50 hover:bg-gray-100"
                  )}
                >
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <Link
                  key={option.value}
                  href={buildUrl({ sort: option.value })}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-colors",
                    currentSort === option.value
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-50 hover:bg-gray-100"
                  )}
                >
                  <option.icon className="w-5 h-5" />
                  <span>{option.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Filters</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <span>In Stock Only</span>
                </div>
                <input
                  type="checkbox"
                  checked={showOnlyInStock}
                  onChange={(e) => setShowOnlyInStock(e.target.checked)}
                  className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-gray-400" />
                  <span>On Sale</span>
                </div>
                <input
                  type="checkbox"
                  checked={showOnlyOnSale}
                  onChange={(e) => setShowOnlyOnSale(e.target.checked)}
                  className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}