"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types";
import { formatPrice, getProductImage, getDiscountPercent } from "@/lib/utils";
import {
  Heart,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Trash2,
  ChevronRight,
  Grid3X3,
  LayoutList,
  Star,
  Share2,
  X,
  Check,
  Filter,
  ArrowUpDown,

  Package,
  Zap,
  Gift,
  TrendingUp,
  Clock,
  ChevronDown,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  product: Product;
}

interface Props {
  products: Product[];
  wishlistData: WishlistItem[];
}

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "name";
type ViewMode = "grid" | "list";

export default function WishlistPageClient({ products: initialProducts, wishlistData }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [wishlist, setWishlist] = useState(wishlistData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [addingToCartIds, setAddingToCartIds] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const setWishlistItems = useWishlistStore((s) => s.setItems);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    const wishlistA = wishlist.find(w => w.product_id === a.id);
    const wishlistB = wishlist.find(w => w.product_id === b.id);
    
    switch (sortBy) {
      case "newest":
        return new Date(wishlistB?.created_at || 0).getTime() - new Date(wishlistA?.created_at || 0).getTime();
      case "oldest":
        return new Date(wishlistA?.created_at || 0).getTime() - new Date(wishlistB?.created_at || 0).getTime();
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleRemoveFromWishlist = async (productId: string) => {
    console.log("HANDLER TRIGGERED", productId);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    try {
      setLoading(true);
      setRemovingIds(prev => new Set([...prev, productId]));
      
      // Use centralized store logic
      await toggleWishlist(product);
      
      // Update local state to reflect removal
      setProducts(prev => prev.filter(p => p.id !== productId));
      setWishlist(prev => prev.filter(w => w.product_id !== productId));
      
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setRemovingIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (product.stock <= 0) {
      toast.error("Item is out of stock");
      return;
    }

    setAddingToCartIds(new Set([...addingToCartIds, product.id]));
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
    
    setAddingToCartIds(new Set([...addingToCartIds].filter(id => id !== product.id)));
  };

  const handleAddAllToCart = async () => {
    const availableProducts = sortedProducts.filter(p => p.stock > 0);
    
    if (availableProducts.length === 0) {
      toast.error("No items available to add");
      return;
    }

    for (const product of availableProducts) {
      addItem(product, 1);
    }
    
    toast.success(`Added ${availableProducts.length} items to cart!`);
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) return;

    try {
      setLoading(true);
      const idsToRemove = Array.from(selectedItems);
      
      for (const productId of idsToRemove) {
        console.log("HANDLER TRIGGERED", productId);
        const product = products.find(p => p.id === productId);
        if (product) {
          await toggleWishlist(product);
        }
      }

      setProducts(products.filter(p => !selectedItems.has(p.id)));
      setWishlist(prev => prev.filter(w => !selectedItems.has(w.product_id)));
      setSelectedItems(new Set());
      setIsSelectMode(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove some items");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectItem = (productId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === sortedProducts.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(sortedProducts.map(p => p.id)));
    }
  };

  // Calculate stats
  const totalValue = sortedProducts.reduce((sum, p) => sum + p.price, 0);
  const totalSavings = sortedProducts.reduce((sum, p) => {
    if (p.compare_price && p.compare_price > p.price) {
      return sum + (p.compare_price - p.price);
    }
    return sum;
  }, 0);
  const onSaleCount = sortedProducts.filter(p => p.compare_price && p.compare_price > p.price).length;
  const inStockCount = sortedProducts.filter(p => p.stock > 0).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-rose-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-rose-950/20 transition-colors duration-500">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-linear-to-br from-rose-200/40 to-pink-200/40 dark:from-rose-900/20 dark:to-pink-900/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-linear-to-br from-pink-200/40 to-fuchsia-200/40 dark:from-pink-900/20 dark:to-fuchsia-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 right-1/3 w-[350px] h-[350px] bg-linear-to-br from-fuchsia-200/30 to-purple-200/30 dark:from-fuchsia-900/15 dark:to-purple-900/15 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav 
          className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <Link href="/" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-rose-400 dark:bg-rose-500 rounded-full" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">My Wishlist</span>
        </nav>

        {/* Header Section */}
        <div 
          className={`mb-10 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* Animated Heart Icon */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-linear-to-br from-rose-500 to-pink-600 rounded-2xl blur-xl opacity-40 animate-pulse" />
                <div className="relative w-16 h-16 bg-linear-to-br from-rose-500 via-pink-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-rose-500/30 dark:shadow-rose-500/20">
                  <Heart className="w-8 h-8 text-white fill-white animate-heartbeat" />
                </div>
                {/* Floating Sparkle */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center animate-bounce">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
                  <span className="bg-linear-to-r from-gray-900 via-rose-900 to-gray-900 dark:from-white dark:via-rose-200 dark:to-white bg-clip-text text-transparent">
                    My Wishlist
                  </span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                  {sortedProducts.length > 0
                    ? `${sortedProducts.length} item${sortedProducts.length !== 1 ? "s" : ""} saved with love`
                    : "Your curated collection of favorites"}
                </p>
              </div>
            </div>

            {sortedProducts.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAddAllToCart}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-rose-500/30 dark:shadow-rose-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add All to Cart
                </button>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold text-sm border border-gray-200 dark:border-gray-700 hover:border-rose-200 dark:hover:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-300"
                >
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {sortedProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { 
                  icon: Heart, 
                  label: "Saved Items", 
                  value: sortedProducts.length,
                  color: "from-rose-500 to-pink-500",
                  bgColor: "from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50",
                },
                { 
                  icon: TrendingUp, 
                  label: "Total Value", 
                  value: formatPrice(totalValue),
                  color: "from-emerald-500 to-teal-500",
                  bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50",
                },
                { 
                  icon: Zap, 
                  label: "On Sale", 
                  value: onSaleCount,
                  color: "from-amber-500 to-orange-500",
                  bgColor: "from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50",
                },
                { 
                  icon: Package, 
                  label: "In Stock", 
                  value: `${inStockCount}/${sortedProducts.length}`,
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50",
                },
              ].map((stat, idx) => (
                <div
                  key={stat.label}
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-4 bg-linear-to-br border border-white/50 dark:border-white/10 transition-all duration-300 hover:shadow-lg group",
                    stat.bgColor
                  )}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-linear-to-br flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
                    stat.color
                  )}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Savings Banner */}
          {totalSavings > 0 && (
            <div className="mt-6 p-4 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Potential Savings!</p>
                  <p className="text-sm text-white/80">You could save {formatPrice(totalSavings)} on sale items</p>
                </div>
              </div>
              <Sparkles className="w-6 h-6 text-white/60 animate-pulse" />
            </div>
          )}
        </div>

        {/* Content */}
        {sortedProducts.length === 0 ? (
          <EmptyWishlist isLoaded={isLoaded} />
        ) : (
          <div 
            className={`transition-all duration-700 delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                {/* Select Mode Toggle */}
                <button
                  onClick={() => {
                    setIsSelectMode(!isSelectMode);
                    setSelectedItems(new Set());
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isSelectMode
                      ? "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  {isSelectMode ? "Cancel" : "Select"}
                </button>

                {isSelectMode && (
                  <>
                    <button
                      onClick={toggleSelectAll}
                      className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {selectedItems.size === sortedProducts.length ? "Deselect All" : "Select All"}
                    </button>
                    {selectedItems.size > 0 && (
                      <button
                        onClick={handleRemoveSelected}
                        className="px-4 py-2.5 bg-red-100 dark:bg-red-900/50 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove ({selectedItems.size})
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ArrowUpDown className="w-4 h-4" />
                    Sort
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-2">
                      {[
                        { value: "newest", label: "Recently Added", icon: Clock },
                        { value: "oldest", label: "Oldest First", icon: Clock },
                        { value: "price-low", label: "Price: Low to High", icon: ArrowUpDown },
                        { value: "price-high", label: "Price: High to Low", icon: ArrowUpDown },
                        { value: "name", label: "Name A-Z", icon: Filter },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value as SortOption)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                            sortBy === option.value
                              ? "bg-rose-50 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                          )}
                        >
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2.5 rounded-lg transition-all",
                      viewMode === "grid"
                        ? "bg-white dark:bg-gray-900 text-rose-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2.5 rounded-lg transition-all",
                      viewMode === "list"
                        ? "bg-white dark:bg-gray-900 text-rose-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    )}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div 
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                  : "space-y-4"
              )}
            >
              {sortedProducts.map((product, idx) => (
                <WishlistProductCard
                  key={`wish-${product.id || 'p'}-${idx}`}
                  product={product}
                  viewMode={viewMode}
                  isSelectMode={isSelectMode}
                  isSelected={selectedItems.has(product.id)}
                  isRemoving={removingIds.has(product.id)}
                  isAddingToCart={addingToCartIds.has(product.id)}
                  onRemove={() => handleRemoveFromWishlist(product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                  onSelect={() => toggleSelectItem(product.id)}
                  delay={idx * 50}
                />
              ))}
            </div>
          </div>
        )}
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

        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          15% {
            transform: scale(1.15);
          }
          30% {
            transform: scale(1);
          }
          45% {
            transform: scale(1.1);
          }
          60% {
            transform: scale(1);
          }
        }
        
        .animate-heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }
        
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Wishlist Product Card Component
interface ProductCardProps {
  product: Product;
  viewMode: ViewMode;
  isSelectMode: boolean;
  isSelected: boolean;
  isRemoving: boolean;
  isAddingToCart: boolean;
  onRemove: () => void;
  onAddToCart: () => void;
  onSelect: () => void;
  delay: number;
}

function WishlistProductCard({
  product,
  viewMode,
  isSelectMode,
  isSelected,
  isRemoving,
  isAddingToCart,
  onRemove,
  onAddToCart,
  onSelect,
  delay,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPercent = hasDiscount ? getDiscountPercent(product.price, product.compare_price!) : 0;
  const isOutOfStock = product.stock <= 0;
  const productImage = (imageError || !getProductImage(product.images))
    ? "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600"
    : getProductImage(product.images);

  if (viewMode === "list") {
    return (
      <div
        className={cn(
          "group flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-500",
          isSelected
            ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
            : "border-gray-100 dark:border-gray-800 hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-xl hover:shadow-rose-100/50 dark:hover:shadow-rose-950/30",
          isRemoving && "opacity-50 scale-95"
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {/* Select Checkbox */}
        {isSelectMode && (
          <button
            onClick={onSelect}
            className={cn(
              "w-6 h-6 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all self-center",
              isSelected
                ? "bg-rose-500 border-rose-500 text-white"
                : "border-gray-300 dark:border-gray-600 hover:border-rose-400"
            )}
          >
            {isSelected && <Check className="w-4 h-4" />}
          </button>
        )}

        {/* Image */}
        <Link 
          href={`/products/${product.slug || product.id}`}
          className="relative block w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0"
        >
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              -{discountPercent}%
            </span>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Out of Stock</span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            {product.category && (
              <span className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                {product.category.name}
              </span>
            )}
            <Link 
              href={`/products/${product.slug || product.id}`}
              className="block"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`star-${product.id}-${i}`}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < Math.round(product.avg_rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200 dark:text-gray-700"
                  )}
                />
              ))}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                ({product.review_count})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.compare_price!)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
                  isAddingToCart
                    ? "bg-emerald-500 text-white"
                    : isOutOfStock
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    : "bg-rose-500 text-white hover:bg-rose-600"
                )}
              >
                {isAddingToCart ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
                {isAddingToCart ? "Added!" : "Add to Cart"}
              </button>
              <button
                onClick={onRemove}
                disabled={isRemoving}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-500 transition-colors"
              >
                {isRemoving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transition-all duration-500",
        isSelected
          ? "ring-2 ring-rose-500 bg-rose-50 dark:bg-rose-950/30"
          : "border border-gray-100 dark:border-gray-800 hover:border-rose-200 dark:hover:border-rose-800 hover:shadow-xl hover:shadow-rose-100/50 dark:hover:shadow-rose-950/30 hover:-translate-y-1",
        isRemoving && "opacity-50 scale-95"
      )}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Select Checkbox */}
      {isSelectMode && (
        <button
          onClick={onSelect}
          className={cn(
            "absolute top-3 left-3 z-20 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
            isSelected
              ? "bg-rose-500 border-rose-500 text-white"
              : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-300 dark:border-gray-600 hover:border-rose-400"
          )}
        >
          {isSelected && <Check className="w-4 h-4" />}
        </button>
      )}

      {/* Image Container */}
      <Link 
        href={`/products/${product.slug || product.id}`}
        className="relative block aspect-square overflow-hidden"
      >
        <Image
          src={productImage}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-transform duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
          onError={() => setImageError(true)}
        />

        {/* Gradient Overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-linear-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div 
          className={cn(
            "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10",
            hasDiscount ? "top-12" : "top-3",
            isHovered && !isSelectMode ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          )}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            disabled={isRemoving}
            className="p-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>

        </div>

        {/* Add to Cart Button */}
        <div 
          className={cn(
            "absolute bottom-3 left-3 right-3 transition-all duration-300 z-10",
            isHovered && !isSelectMode ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart();
            }}
            disabled={isOutOfStock || isAddingToCart}
            className={cn(
              "w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300",
              isAddingToCart
                ? "bg-emerald-500 text-white"
                : isOutOfStock
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm text-gray-800 dark:text-white hover:bg-rose-500 hover:text-white shadow-lg"
            )}
          >
            {isAddingToCart ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {product.category && (
          <span className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">
            {product.category.name}
          </span>
        )}
        <Link href={`/products/${product.slug || product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white mt-1 line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < Math.round(product.avg_rating)
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-200 dark:text-gray-700"
              )}
            />
          ))}
          <span className="text-xs text-gray-400 dark:text-gray-500">
            ({product.review_count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compare_price!)}
              </span>
            )}
          </div>

          {/* Mobile Add to Cart */}
          <button
            onClick={onAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            className={cn(
              "lg:hidden p-2.5 rounded-xl transition-all duration-300",
              isAddingToCart
                ? "bg-emerald-500 text-white"
                : isOutOfStock
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-rose-500 text-white hover:bg-rose-600 active:scale-95"
            )}
          >
            {isAddingToCart ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Stock Warning */}
        {!isOutOfStock && product.stock <= 5 && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              Only {product.stock} left!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Empty Wishlist Component
function EmptyWishlist({ isLoaded }: { isLoaded: boolean }) {
  return (
    <div 
      className={`transition-all duration-700 delay-200 ${
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="relative mx-auto max-w-lg">
        {/* Glow Effect */}
        <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-rose-200 via-pink-200 to-fuchsia-200 dark:from-rose-900/30 dark:via-pink-900/30 dark:to-fuchsia-900/30 opacity-50 blur-2xl" />

        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl">
          {/* Gradient Bar */}
          <div className="h-1.5 bg-linear-to-r from-rose-400 via-pink-500 to-fuchsia-500" />

          <div className="px-8 py-16 text-center">
            {/* Animated Icon */}
            <div className="relative mx-auto mb-8 w-32 h-32">
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-rose-200 dark:border-rose-800/50 animate-spin-slow" />
              {/* Middle Ring */}
              <div className="absolute inset-4 rounded-full border border-pink-200 dark:border-pink-800/40 animate-spin-slow-reverse" />
              {/* Inner Circle */}
              <div className="absolute inset-8 rounded-full bg-linear-to-br from-rose-100 to-pink-100 dark:from-rose-900/50 dark:to-pink-900/50 flex items-center justify-center">
                <Heart className="w-10 h-10 text-rose-400 dark:text-rose-500 animate-heartbeat" />
              </div>
              
              {/* Floating Sparkles */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-sparkle" />
              <Sparkles className="absolute -bottom-1 -left-3 w-5 h-5 text-pink-400 animate-sparkle animation-delay-500" />
              <Sparkles className="absolute top-0 -left-4 w-4 h-4 text-fuchsia-400 animate-sparkle animation-delay-1000" />
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
              Tap the heart on items you love and they'll appear here — your personal collection of favorites, waiting for you.
            </p>

            {/* CTA Button */}
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-linear-to-r from-rose-500 via-pink-500 to-fuchsia-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 dark:shadow-rose-500/15 hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              {/* Shimmer Effect */}
              <span className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/20 to-transparent" />
              <ShoppingBag className="w-5 h-5" />
              <span>Browse Products</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Decorative Dots */}
            <div className="flex justify-center gap-2 mt-12">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-rose-200 dark:bg-rose-800/60 animate-dot-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
        {[
          { icon: Heart, title: "Save Your Favorites", desc: "Keep track of items you love" },
          { icon: Zap, title: "Get Sale Alerts", desc: "Know when prices drop" },
          { icon: ShoppingBag, title: "Quick Checkout", desc: "Add to cart with one click" },
        ].map((feature, idx) => (
          <div
            key={feature.title}
            className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-gray-950/50 transition-all duration-300 text-center"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="w-12 h-12 bg-linear-to-br from-rose-100 to-pink-100 dark:from-rose-900/50 dark:to-pink-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <feature.icon className="w-6 h-6 text-rose-500 dark:text-rose-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{feature.desc}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow 15s linear infinite reverse;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          50%, 100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes dot-bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
        
        .animate-dot-bounce {
          animation: dot-bounce 2s ease-in-out infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}