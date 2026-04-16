"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Package, Star, Clock, CreditCard, Sparkles, Tag, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatPrice, getProductImage } from "@/lib/utils";
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
    getProductImage(product?.images) || 
    product?.image || 
    product?.reference_images?.[0] || 
    "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600";
  const price = product?.price || product?.quoted_price || 0;
  const description = product?.description || "No description provided.";
  const category = product?.category?.name || (isCustom ? "Custom Request" : "Crochet");

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop - Intense blur and dark overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-[20px] transition-opacity"
          />

          {/* Modal Card - 100% SOLID OPAQUE DARKNESS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-xl bg-white dark:bg-[#0F172A] rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] border-4 border-gray-100 dark:border-white/5 flex flex-col max-h-[90vh] z-[100000]"
          >
            {/* Opaque Background Layer (Redundant but safe) */}
            <div className="absolute inset-0 bg-white dark:bg-[#0F172A] -z-10" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-3 bg-gray-100 dark:bg-gray-800/80 hover:bg-violet-600 dark:hover:bg-violet-600 transition-all duration-300 rounded-2xl shadow-xl group border border-white/10"
            >
              <X className="w-5 h-5 text-gray-900 dark:text-white group-hover:text-white" />
            </button>

            {loading ? (
              <div className="w-full h-96 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-600 rounded-full animate-spin" />
                <p className="text-gray-900 dark:text-white font-bold tracking-tight">Syncing catalog data...</p>
              </div>
            ) : product ? (
              <>
                {/* Header Image */}
                <div className="w-full aspect-[4/3] relative bg-gray-100 dark:bg-gray-900 shrink-0 border-b border-gray-100 dark:border-white/10">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-gray-950/60 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-6 left-6">
                    <span className="px-4 py-2 bg-violet-600 text-white rounded-xl text-[10px] font-black shadow-2xl flex items-center gap-1.5 tracking-widest uppercase border border-violet-500">
                        <Sparkles className="w-3.5 h-3.5" />
                        {category}
                    </span>
                  </div>
                </div>

                {/* Content Section - SOLID OPAQUE */}
                <div className="flex-1 overflow-y-auto premium-scroll bg-white dark:bg-[#0F172A]">
                    <div className="p-8 md:p-10 space-y-8">
                        {/* Status & Title */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < 5 ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-800'}`} />
                                    ))}
                                </div>
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Verified Registry</span>
                            </div>
                            <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white leading-tight tracking-tight mb-4">
                                {name}
                            </h2>
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-black text-violet-600 dark:text-violet-400 tracking-tighter">
                                    {formatPrice(price)}
                                </span>
                                {product.compare_price > price && (
                                    <span className="text-xl text-gray-300 dark:text-gray-600 line-through decoration-violet-500/40">
                                        {formatPrice(product.compare_price)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Compact Stats Card Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-white/5">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <Package className="w-3.5 h-3.5 text-violet-500" />
                                    Inventory
                                </p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">
                                    {product.stock !== undefined ? `${product.stock} Units` : "--"}
                                </p>
                            </div>
                            <div className="p-5 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-white/5">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                    <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                                    Sale Type
                                </p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">
                                    {isCustom ? "Custom" : "Direct"}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-violet-600" />
                                Product Overview
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                {description}
                            </p>
                        </div>

                        {/* Tags */}
                        {product.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-xl text-[9px] font-bold uppercase tracking-widest border border-transparent hover:border-violet-500/30 transition-colors">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* ID Footer */}
                        <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 tracking-widest uppercase">
                                    REF: {product.id?.slice(0, 8)}...
                                </span>
                            </div>
                            <span className="text-[9px] font-black text-gray-400 uppercase italic">
                                Strokes of Craft Official
                            </span>
                        </div>
                    </div>
                </div>
              </>
            ) : (
              <div className="w-full h-96 flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#0F172A]">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-[32px] flex items-center justify-center text-red-500 mb-6">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Registry Error</h3>
                <p className="text-gray-500 text-sm mb-8">Could not synchronize this item with the master registry.</p>
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
