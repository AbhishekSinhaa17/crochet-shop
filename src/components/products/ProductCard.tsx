"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Sparkles, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getDiscountPercent, getProductImage } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { createClient } from "@/lib/supabase/client";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
  isAdmin?: boolean;
}

export default function ProductCard({ product, index = 0, isAdmin = false }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for gradient effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for tilt
  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    
    const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * -5;
    const rotateYValue = ((e.clientX - centerX) / (rect.width / 2)) * 5;
    
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error("Out of stock!");
      return;
    }
    
    setIsAddingToCart(true);
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const supabase = createClient();
    addItem(product, 1, supabase);
    setIsAddingToCart(false);
    setAddedToCart(true);
    
    toast.success(
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4 text-green-500" />
        <span><strong>{product.name}</strong> added to cart!</span>
      </div>
    );
    
    setTimeout(() => setAddedToCart(false), 2000);
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

    setWishlisted(!wishlisted);

    if (wishlisted) {
      await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_id", product.id);
      toast.success("Removed from wishlist");
    } else {
      await supabase.from("wishlist").upsert({ user_id: user.id, product_id: product.id });
      toast.success("Added to wishlist!");
    }
  };

  const imageUrl = getProductImage(product.images) || 
    product.category?.image_url || 
    "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=400";
  const hasDiscount = product.compare_price && product.compare_price > product.price;

  // Gradient position based on mouse
  const gradientX = useTransform(mouseX, [0, 300], [0, 100]);
  const gradientY = useTransform(mouseY, [0, 400], [0, 100]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className="relative group"
    >
      <Link
        href={`/products/${product.slug || product.id}`}
        className="block relative rounded-[24px] overflow-hidden transition-all duration-500"
        style={{
          background: "var(--card)",
          boxShadow: isHovered 
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)"
            : "0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--border)",
        }}
      >
        {/* Animated border gradient */}
        <motion.div 
          className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, 
              transparent 0%, 
              rgba(139, 92, 246, 0.3) 25%, 
              rgba(236, 72, 153, 0.3) 50%, 
              rgba(251, 146, 60, 0.3) 75%, 
              transparent 100%)`,
            backgroundSize: "300% 300%",
            animation: isHovered ? "borderGradient 3s ease infinite" : "none",
            padding: "1px",
            zIndex: 1,
          }}
        />

        {/* Spotlight effect following mouse */}
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
          style={{
            background: useTransform(
              [gradientX, gradientY],
              ([x, y]) => `radial-gradient(600px circle at ${x}% ${y}%, rgba(139, 92, 246, 0.15), transparent 40%)`
            ),
          }}
        />

        {/* Image container */}
        <div className="relative aspect-3/4 overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          {/* Skeleton loader with shimmer */}
          <AnimatePresence>
            {!imageLoaded && (
              <motion.div 
                className="absolute inset-0"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skeleton-shimmer" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: isHovered ? 1.08 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={imgError ? "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=400" : imageUrl}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImgError(true)}
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>

          {/* Premium gradient overlay */}
          <div 
            className="absolute inset-0 transition-all duration-500 pointer-events-none"
            style={{
              background: isHovered 
                ? "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)"
                : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)"
            }}
          />

          {/* Animated badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            <AnimatePresence>
              {hasDiscount && (
                <motion.span
                  initial={{ x: -30, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -30, opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25"
                >
                  <Sparkles className="w-3 h-3" />
                  {getDiscountPercent(product.price, product.compare_price!)}% OFF
                </motion.span>
              )}
              
              {product.is_featured && (
                <motion.span
                  initial={{ x: -30, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -30, opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-linear-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25"
                >
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </motion.span>
              )}
              
              {product.stock <= 0 && (
                <motion.span
                  initial={{ x: -30, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-900/90 text-white backdrop-blur-sm"
                >
                  Sold Out
                </motion.span>
              )}
              
              {product.stock > 0 && product.stock <= 3 && (
                <motion.span
                  initial={{ x: -30, opacity: 0, scale: 0.8 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  Only {product.stock} left
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Action buttons */}
          <motion.div 
            className="absolute top-4 right-4 flex flex-col gap-2 z-20"
            initial={false}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : 20,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Wishlist button */}
            {!isAdmin && (
              <motion.button
                onClick={handleWishlist}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden group/btn"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <motion.div
                  animate={wishlisted ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    className={`w-4 h-4 transition-all duration-300 ${
                      wishlisted 
                        ? "fill-rose-500 text-rose-500" 
                        : "text-gray-600 group-hover/btn:text-rose-500"
                    }`}
                  />
                </motion.div>
                {/* Ripple effect */}
                {wishlisted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-rose-500 rounded-full"
                  />
                )}
              </motion.button>
            )}


          </motion.div>

          {/* Add to Cart button */}
          {!isAdmin && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 z-20"
              initial={false}
              animate={{ 
                y: isHovered ? 0 : 20,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAddingToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full py-3 px-4 rounded-2xl font-semibold text-sm
                  flex items-center justify-center gap-2
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${addedToCart 
                    ? "bg-green-500 text-white" 
                    : "bg-white text-gray-900 hover:bg-gray-50"
                  }
                `}
                style={{
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}
              >
                <AnimatePresence mode="wait">
                  {isAddingToCart ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle 
                          className="opacity-25" 
                          cx="12" cy="12" r="10" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          fill="none" 
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                        />
                      </svg>
                      Adding...
                    </motion.div>
                  ) : addedToCart ? (
                    <motion.div
                      key="added"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Added to Cart!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Card content */}
        <div className="p-5 relative">
          {/* Subtle top border gradient */}
          <div 
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(to right, transparent, var(--border), transparent)"
            }}
          />

          {/* Category with animated underline */}
          <div className="mb-2 overflow-hidden">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="relative inline-block"
            >
              <span 
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--primary)" }}
              >
                {product.category?.name || "Crochet"}
              </span>
              <motion.div 
                className="absolute -bottom-0.5 left-0 h-0.5 rounded-full"
                style={{ background: "var(--primary)" }}
                initial={{ width: 0 }}
                animate={{ width: isHovered ? "100%" : "30%" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </div>

          {/* Product name */}
          <motion.h3 
            className="font-display font-semibold text-base mb-2 line-clamp-2 leading-snug transition-colors duration-300"
            style={{ 
              color: isHovered ? "var(--primary)" : "var(--foreground)" 
            }}
          >
            {product.name}
          </motion.h3>

          {/* Rating stars */}
          {product.review_count > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: index * 0.1 + 0.3 + i * 0.05,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <Star
                      className={`w-3.5 h-3.5 transition-all duration-300 ${
                        i < Math.round(product.avg_rating) 
                          ? "fill-amber-400 text-amber-400" 
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <span 
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                ({product.review_count})
              </span>
            </div>
          )}

          {/* Price section */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <motion.span 
              className="text-xl font-bold"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              style={{ 
                color: "var(--foreground)",
                transformOrigin: "left center" 
              }}
              transition={{ duration: 0.2 }}
            >
              {formatPrice(product.price)}
            </motion.span>
            
            {hasDiscount && (
              <motion.span 
                className="text-sm line-through"
                style={{ color: "var(--muted-foreground)" }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {formatPrice(product.compare_price!)}
              </motion.span>
            )}
            
            {hasDiscount && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full"
              >
                Save {formatPrice(product.compare_price! - product.price)}
              </motion.span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}