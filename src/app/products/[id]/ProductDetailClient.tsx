"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, Review } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, formatDate, getDiscountPercent, getProductImages } from "@/lib/utils";
import ProductCard from "@/components/products/ProductCard";
import ReviewForm from "@/components/products/ReviewForm";
import {
  Star,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Check,
  Sparkles,
  Award,
  Package,
  ChevronRight,
  Zap,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase/client";

interface Props {
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  reviews,
  relatedProducts,
}: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentReviews, setCurrentReviews] = useState(reviews);
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
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

  const parsedImages = getProductImages(product.images);
  const images = parsedImages.length > 0
    ? parsedImages
    : ["https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600"];

  const hasDiscount =
    product.compare_price && product.compare_price > product.price;

  const handleAddToCart = async () => {
    if (isAdmin) return;
    if (product.stock <= 0) {
      toast.error("Out of stock!");
      return;
    }
    
    try {
      addItem(product, quantity, supabase);
      setAddedToCart(true);
      toast.success(`${product.name} added to cart!`);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlist = async () => {
    if (isAdmin) return;
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast.error("Session expired. Please login again.");
        return;
      }

      // Check if item already exists to prevent duplicates
      const { data: existing } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id);

      if (existing && existing.length > 0) {
        toast.error("Already in wishlist");
        setIsWishlisted(true);
        return;
      }

      await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: product.id });
      setIsWishlisted(true);
      toast.success("Added to wishlist!");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const refreshReviews = async () => {
    try {
      const { data } = await supabase
        .from("reviews")
        .select("*, profile:profiles!user_id(full_name, avatar_url)")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });
      if (data) setCurrentReviews(data);
      setShowReviewForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/20 transition-colors duration-500">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-linear-to-r from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-linear-to-r from-rose-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-r from-amber-100/10 to-rose-100/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Breadcrumb */}
        <nav 
          className={`flex items-center gap-2 text-sm mb-8 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <Link 
            href="/" 
            className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
          <Link 
            href="/products" 
            className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300"
          >
            Products
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
          <span className="text-gray-800 dark:text-gray-100 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Premium Image Gallery */}
          <div 
            className={`space-y-4 transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Main Image Container */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsImageZoomed(true)}
              onMouseLeave={() => setIsImageZoomed(false)}
            >
              {/* Decorative Frame */}
              <div className="absolute -inset-2 bg-linear-to-r from-amber-400 via-rose-400 to-amber-400 rounded-3xl opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500" />
              
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-2xl shadow-amber-100/50 dark:shadow-black/50">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-10" />
                
                <Image
                  src={imgErrors.has(selectedImage) ? "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600" : images[selectedImage]}
                  alt={product.name}
                  fill
                  className={`object-cover transition-transform duration-700 ${
                    isImageZoomed ? "scale-110" : "scale-100"
                  }`}
                  priority
                  onError={() => setImgErrors(new Set([...imgErrors, selectedImage]))}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                  {hasDiscount && (
                    <span className="inline-flex items-center gap-1.5 bg-linear-to-r from-red-500 to-rose-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg shadow-red-500/30 animate-pulse">
                      <Zap className="w-4 h-4" />
                      {getDiscountPercent(product.price, product.compare_price!)}% OFF
                    </span>
                  )}
                  {product.is_featured && (
                    <span className="inline-flex items-center gap-1.5 bg-linear-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg shadow-amber-500/30">
                      <Sparkles className="w-4 h-4" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                {!isAdmin && (
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <button
                      onClick={handleWishlist}
                      className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
                        isWishlisted 
                          ? "bg-red-500 text-white" 
                          : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white dark:hover:bg-red-500"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                    </button>
                    <button className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full text-gray-700 dark:text-gray-200 hover:bg-amber-500 hover:text-white transition-all duration-300">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                      selectedImage === i 
                        ? "ring-2 ring-amber-500 ring-offset-2 scale-105" 
                        : "opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                    {selectedImage === i && (
                      <div className="absolute inset-0 bg-linear-to-t from-amber-500/20 to-transparent" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div 
            className={`space-y-6 transition-all duration-700 delay-200 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {/* Category Badge */}
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-linear-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium hover:from-amber-200 hover:to-orange-200 transition-all duration-300 group"
              >
                <span className="w-2 h-2 bg-amber-500 rounded-full group-hover:scale-125 transition-transform" />
                {product.category.name}
              </Link>
            )}

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Rating Section */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-full border border-amber-100/50 dark:border-amber-800/30">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 transition-all duration-300 ${
                      i < Math.round(product.avg_rating)
                        ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                        : "text-gray-200 dark:text-gray-700"
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {product.avg_rating.toFixed(1)}
              </span>
              <span className="text-gray-400">•</span>
              <button 
                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-amber-600 hover:text-amber-700 font-medium hover:underline"
              >
                {product.review_count} reviews
              </button>
            </div>

            {/* Price Section */}
            <div className="flex items-end gap-4 py-4">
              <div className="relative">
                <span className="text-4xl md:text-5xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="absolute -top-4 -right-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                    SAVE {formatPrice(product.compare_price! - product.price)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="text-xl text-gray-400 dark:text-gray-500 line-through mb-1">
                  {formatPrice(product.compare_price!)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Stock Indicator */}
            <div className="flex items-center gap-3">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span className="text-emerald-700 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {!isAdmin && (
              <div className="space-y-4 p-6 bg-linear-to-br from-white to-amber-50/50 dark:from-gray-900/50 dark:to-amber-900/20 rounded-2xl border border-amber-100/50 dark:border-amber-800/30 shadow-lg shadow-amber-100/20 dark:shadow-black/20">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Quantity:</span>
                  <div className="flex items-center bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-full overflow-hidden shadow-inner">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95"
                    >
                      <Minus className="w-4 h-4 dark:text-gray-300" />
                    </button>
                    <span className="w-14 text-center font-bold text-lg dark:text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95"
                    >
                      <Plus className="w-4 h-4 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-500 flex items-center justify-center gap-3 ${
                      addedToCart
                        ? "bg-emerald-500 text-white"
                        : "bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5"
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
                    style={{ backgroundSize: "200% auto" }}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-6 h-6 animate-bounce" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-6 h-6" />
                        Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleWishlist}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      isWishlisted
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current animate-pulse" : ""}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Premium Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Truck, label: "Free Shipping", sublabel: "Over ₹999", color: "from-blue-500 to-cyan-500" },
                { icon: Shield, label: "Quality Assured", sublabel: "100% Authentic", color: "from-emerald-500 to-teal-500" },
              ].map(({ icon: Icon, label, sublabel, color }, idx) => (
                <div 
                  key={label} 
                  className="group relative p-4 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-transparent hover:shadow-xl dark:shadow-black/50 transition-all duration-500 cursor-pointer overflow-hidden"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10 text-center group-hover:text-white transition-colors duration-500">
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-linear-to-br ${color} flex items-center justify-center group-hover:bg-white/20 transition-all duration-500`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-white/80">{sublabel}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {product.tags.map((tag, idx) => (
                  <span 
                    key={tag} 
                    className="px-4 py-1.5 bg-linear-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-600 dark:text-gray-400 rounded-full text-sm font-medium hover:from-amber-100 hover:to-orange-50 hover:text-amber-700 dark:hover:text-amber-400 transition-all duration-300 cursor-pointer"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <section 
          id="reviews" 
          className={`mt-24 transition-all duration-700 delay-300 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-8 h-8 text-amber-500" />
                <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  Customer Reviews
                </h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {currentReviews.length} reviews from verified buyers
              </p>
            </div>
            {!isAdmin && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  showReviewForm
                    ? "bg-gray-100 text-gray-600"
                    : "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                {showReviewForm ? (
                  <>
                    <X className="w-5 h-5" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Write a Review
                  </>
                )}
              </button>
            )}
          </div>

          {/* Review Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="md:col-span-1 p-6 bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl text-white">
              <div className="text-5xl font-bold mb-2">{product.avg_rating.toFixed(1)}</div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.avg_rating)
                        ? "fill-white text-white"
                        : "text-white/40"
                    }`}
                  />
                ))}
              </div>
              <p className="text-white/80">{product.review_count} total reviews</p>
            </div>
            <div className="md:col-span-3 p-6 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg dark:shadow-black/20">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = currentReviews.filter(r => r.rating === rating).length;
                const percentage = currentReviews.length > 0 ? (count / currentReviews.length) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3 mb-2 last:mb-0">
                    <span className="w-8 text-sm font-medium text-gray-600 dark:text-gray-400">{rating}★</span>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-sm text-gray-400 dark:text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-10 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl animate-in slide-in-from-top duration-500">
              <ReviewForm productId={product.id} onSuccess={refreshReviews} />
            </div>
          )}

          {/* Reviews List */}
          {currentReviews.length === 0 ? (
            <div className="text-center py-16 bg-linear-to-br from-white to-amber-50/50 dark:from-gray-900/50 dark:to-amber-900/20 rounded-2xl border border-amber-100/50 dark:border-amber-800/30">
              <Package className="w-16 h-16 text-amber-300 dark:text-amber-900/50 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No reviews yet.</p>
              {!isAdmin && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-amber-600 dark:text-amber-500 font-semibold hover:underline"
                >
                  Be the first to review this product!
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {currentReviews.map((review, idx) => (
                <div 
                  key={review.id} 
                  className="group p-6 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800 hover:shadow-xl hover:shadow-amber-100/50 dark:shadow-black/50 transition-all duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                        {((review as any).profile?.full_name || "A").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {(review as any).profile?.full_name || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200 dark:text-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                          {review.is_verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                              <Check className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </div>

                  {/* Review Content */}
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-amber-700 transition-colors">
                      "{review.title}"
                    </h4>
                  )}
                  {review.comment && (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {review.comment}
                    </p>
                  )}

                  {/* Review Footer */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                    <button className="text-sm text-gray-400 dark:text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1">
                      👍 Helpful
                    </button>
                    <button className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section 
            className={`mt-24 transition-all duration-700 delay-400 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-amber-500" />
                  <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                    You May Also Like
                  </h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Curated picks based on your interest
                </p>
              </div>
              <Link 
                href="/products"
                className="hidden md:flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold group"
              >
                View All
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, idx) => (
                <div 
                  key={p.id} 
                  className="transform hover:-translate-y-2 transition-transform duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <ProductCard product={p} isAdmin={isAdmin} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: slideInFromTop 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}