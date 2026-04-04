"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, getProductImage, getDiscountPercent } from "@/lib/utils";
import { Heart, ShoppingBag, Star, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPercent = hasDiscount ? getDiscountPercent(product.price, product.compare_price!) : 0;
  const isOutOfStock = product.stock <= 0;
  const isNew = new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) {
      toast.error("Out of stock!");
      return;
    }
    
    setIsAddingToCart(true);
    const supabase = createClient();
    addItem(product, 1, supabase);
    toast.success(`${product.name} added to cart!`);
    
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }

    const wasWishlisted = isWishlisted;
    await toggleWishlist(product, supabase);
    toast.success(wasWishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  const productImage = imageError 
    ? "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600"
    : getProductImage(product.images);

  return (
    <Link
      href={`/products/${product.slug || product.id}`}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden transition-all duration-500",
        "hover:shadow-2xl hover:shadow-amber-100/50 hover:-translate-y-1",
        "border border-gray-100 hover:border-amber-200",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Main Image */}
        <Image
          src={productImage}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />

        {/* Gradient Overlay */}
        <div 
          className={cn(
            "absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )} 
        />

        {/* Shimmer Effect */}
        <div 
          className={cn(
            "absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full transition-transform duration-1000",
            isHovered ? "translate-x-full" : "-translate-x-full"
          )}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {hasDiscount && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-linear-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/30 animate-pulse">
              <Zap className="w-3 h-3" />
              {discountPercent}% OFF
            </span>
          )}
          {isNew && !hasDiscount && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-linear-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-3 h-3" />
              NEW
            </span>
          )}
          {product.is_featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-linear-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-500/30">
              <Star className="w-3 h-3 fill-current" />
              FEATURED
            </span>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div 
          className={cn(
            "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          )}
        >
          <button
            onClick={handleWishlist}
            className={cn(
              "p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 shadow-lg",
              (mounted && isWishlisted)
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white"
            )}
          >
            <Heart className={cn("w-4 h-4", (mounted && isWishlisted) && "fill-current")} />
          </button>

        </div>

        {/* Add to Cart Button */}
        <div 
          className={cn(
            "absolute bottom-3 left-3 right-3 transition-all duration-300 z-10",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cn(
              "w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300",
              isOutOfStock
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : isAddingToCart
                ? "bg-emerald-500 text-white"
                : "bg-white/95 backdrop-blur-md text-gray-800 hover:bg-amber-500 hover:text-white shadow-lg"
            )}
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : isAddingToCart ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Added!
              </>
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
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">
            {product.category.name}
          </span>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mt-1 line-clamp-1 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  i < Math.round(product.avg_rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">
            ({product.review_count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compare_price!)}
              </span>
            )}
          </div>

          {/* Quick Add Button (Mobile) */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cn(
              "lg:hidden p-2 rounded-xl transition-all duration-300",
              isOutOfStock
                ? "bg-gray-100 text-gray-400"
                : "bg-amber-500 text-white hover:bg-amber-600 active:scale-95"
            )}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

        {/* Stock Indicator */}
        {!isOutOfStock && product.stock <= 5 && (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span className="text-xs text-orange-600 font-medium">
              Only {product.stock} left!
            </span>
          </div>
        )}
      </div>

      {/* Hover Border Effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl border-2 border-amber-500 transition-opacity duration-300 pointer-events-none",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />
    </Link>
  );
}