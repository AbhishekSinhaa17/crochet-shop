"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Package, Star, Clock, CreditCard } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

interface ProductPreviewModalProps {
  productId?: string;
  productData?: any; // For custom orders
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductPreviewModal({
  productId,
  productData: initialData,
  isOpen,
  onClose,
}: ProductPreviewModalProps) {
  const [product, setProduct] = useState<any>(initialData);
  const [loading, setLoading] = useState(!initialData && !!productId);

  useEffect(() => {
    if (isOpen && productId && !initialData) {
      fetchProduct();
    } else if (isOpen && initialData) {
      setProduct(initialData);
      setLoading(false);
    }
  }, [isOpen, productId, initialData]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("id", productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product for preview:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isCustom = !!initialData || !productId;
  const name = product?.name || product?.title || "Product Details";
  const image = 
    product?.images?.[0] || 
    product?.image || 
    product?.reference_images?.[0] || 
    "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600";
  const price = product?.price || product?.quoted_price || 0;
  const description = product?.description || "No description provided.";
  const category = product?.category?.name || (isCustom ? "Custom Request" : "Crochet");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden shadow-2xl border border-white/20 dark:border-gray-800 flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>

            {loading ? (
              <div className="w-full h-[400px] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 font-medium">Loading details...</p>
              </div>
            ) : product ? (
              <>
                {/* Image Section */}
                <div className="w-full md:w-1/2 aspect-square relative bg-gray-100 dark:bg-gray-800 shrink-0">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/90 dark:bg-black/80 backdrop-blur-md text-violet-600 dark:text-violet-400 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-widest border border-white/20">
                      {category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-10 flex flex-col overflow-y-auto premium-scroll">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(product.avg_rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400 font-medium">
                      {product.review_count || 0} reviews
                    </span>
                  </div>

                  <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {name}
                  </h2>

                  <div className="flex items-baseline gap-3 mb-8">
                    <span className="text-4xl font-bold bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(price)}
                    </span>
                    {product.compare_price > price && (
                      <span className="text-xl text-gray-400 line-through">
                        {formatPrice(product.compare_price)}
                      </span>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-violet-500" />
                        Details
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {description}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1">
                          <Package className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Inventory</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {product.stock !== undefined ? `${product.stock} available` : "N/A"}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Type</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {isCustom ? "Custom Request" : "Instant Purchase"}
                        </p>
                      </div>
                    </div>

                    {!isCustom && product.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {product.tags.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="pt-8 mt-auto border-t border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        {product.id && `System Ref: ${product.id}`}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
                <p className="text-red-500 font-medium">Information could not be retrieved.</p>
                <button 
                    onClick={onClose}
                    className="text-sm text-violet-600 font-bold hover:underline"
                >
                    Return to dashboard
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
