"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Tag,
  Truck,
  Shield,
  RotateCcw,
  Gift,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Loader2,
  Heart,
  Package,
  CreditCard,
  Clock,
  Percent,
  ChevronDown,
  Lock,
  Zap,
  Info,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import { formatPrice, getProductImage } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface PromoCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
}

const validPromoCodes: PromoCode[] = [
  { code: "SAVE10", discount: 10, type: "percentage" },
  { code: "FLAT100", discount: 100, type: "fixed" },
  { code: "WELCOME20", discount: 20, type: "percentage" },
];

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
    fetchRecommended();
  }, []);

  const fetchRecommended = async () => {
    try {
      const supabase = createClient();
      let query = supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("is_active", true)
        .limit(4);
      
      if (items.length > 0) {
        const itemIds = items.map(i => i.id).filter(id => id);
        if (itemIds.length > 0) {
          query = query.not("id", "in", `(${itemIds.join(",")})`);
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setRecommendedProducts(data || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoadingRecommended(false);
    }
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingIds(new Set([...updatingIds, id]));
    await new Promise(resolve => setTimeout(resolve, 300));
    updateQuantity(id, newQuantity);
    setUpdatingIds(new Set([...updatingIds].filter(i => i !== id)));
  };

  const handleRemoveItem = async (id: string, name: string) => {
    setRemovingIds(new Set([...removingIds, id]));
    await new Promise(resolve => setTimeout(resolve, 500));
    removeItem(id);
    toast.success(`${name} removed from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    setAppliedPromo(null);
    toast.success("Cart cleared");
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setApplyingPromo(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundPromo = validPromoCodes.find(
      p => p.code.toLowerCase() === promoCode.toLowerCase()
    );
    
    if (foundPromo) {
      setAppliedPromo(foundPromo);
      toast.success(`Promo code "${foundPromo.code}" applied!`);
    } else {
      toast.error("Invalid promo code");
    }
    
    setApplyingPromo(false);
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    toast.success("Promo code removed");
  };

  // Calculate totals
  const subtotal = getTotal();
  const freeShippingThreshold = 999;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 99;
  const promoDiscount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? (subtotal * appliedPromo.discount) / 100
      : appliedPromo.discount
    : 0;
  const total = subtotal + shipping - promoDiscount;
  const amountToFreeShipping = freeShippingThreshold - subtotal;
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  
  // Calculate savings
  const totalSavings = items.reduce((sum, item) => {
    if (item.compare_price && item.compare_price > item.price) {
      return sum + (item.compare_price - item.price) * item.quantity;
    }
    return sum;
  }, 0) + promoDiscount;

  if (items.length === 0) {
    return (
      <EmptyCart 
        isLoaded={isLoaded} 
        recommendedProducts={recommendedProducts}
        isLoadingRecommended={isLoadingRecommended}
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/20 transition-colors duration-500">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-linear-to-r from-amber-200/30 to-orange-200/30 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-linear-to-r from-emerald-200/30 to-teal-200/30 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-linear-to-r from-purple-200/30 to-pink-200/30 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav 
          className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-400 dark:bg-amber-500 rounded-full" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">Shopping Cart</span>
        </nav>

        {/* Header */}
        <div 
          className={`mb-8 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl blur-xl opacity-40 animate-pulse" />
                <div className="relative w-14 h-14 bg-linear-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/30 dark:shadow-amber-500/20">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                {/* Item Count Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-linear-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {items.length}
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                  Shopping Cart
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {items.length} item{items.length !== 1 ? "s" : ""} in your cart
                </p>
              </div>
            </div>

            <button
              onClick={handleClearCart}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </button>
          </div>

          {/* Free Shipping Progress */}
          {subtotal < freeShippingThreshold && (
            <div className="mt-6 p-4 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-2xl border border-amber-100 dark:border-amber-900">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Add {formatPrice(amountToFreeShipping)} more for FREE shipping!
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Free shipping on orders above {formatPrice(freeShippingThreshold)}
                  </p>
                </div>
                <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
              </div>
              <div className="h-2 bg-amber-100 dark:bg-amber-900/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {subtotal >= freeShippingThreshold && (
            <div className="mt-6 p-4 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-2xl border border-emerald-100 dark:border-emerald-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-emerald-700 dark:text-emerald-300">
                  🎉 You've unlocked FREE shipping!
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Enjoy free delivery on your order
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div 
            className={`lg:col-span-2 space-y-4 transition-all duration-700 delay-200 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            {items.map((item, idx) => (
              <CartItemCard
                key={item.id}
                item={item}
                isRemoving={removingIds.has(item.id)}
                isUpdating={updatingIds.has(item.id)}
                onUpdateQuantity={(qty) => handleUpdateQuantity(item.id, qty)}
                onRemove={() => handleRemoveItem(item.id, item.name)}
                delay={idx * 100}
              />
            ))}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div 
            className={`transition-all duration-700 delay-300 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="sticky top-24 space-y-6">
              {/* Summary Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                    Order Summary
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  {/* Promo Code Section */}
                  <div>
                    {!appliedPromo ? (
                      <div>
                        {!showPromoInput ? (
                          <button
                            onClick={() => setShowPromoInput(true)}
                            className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                          >
                            <Tag className="w-4 h-4" />
                            Have a promo code?
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                placeholder="Enter code"
                                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
                              />
                              <button
                                onClick={handleApplyPromo}
                                disabled={applyingPromo || !promoCode.trim()}
                                className="px-4 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium text-sm hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                              >
                                {applyingPromo ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  "Apply"
                                )}
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                setShowPromoInput(false);
                                setPromoCode("");
                              }}
                              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-100 dark:border-emerald-900">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <Percent className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                              {appliedPromo.code}
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">
                              {appliedPromo.type === "percentage" 
                                ? `${appliedPromo.discount}% off` 
                                : `${formatPrice(appliedPromo.discount)} off`}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={removePromo}
                          className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-100 dark:border-gray-800" />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Subtotal ({items.length} items)
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                        ) : (
                          <span className="text-gray-900 dark:text-white">{formatPrice(shipping)}</span>
                        )}
                      </span>
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Promo Discount
                        </span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          -{formatPrice(promoDiscount)}
                        </span>
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-100 dark:border-gray-800" />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(total)}
                      </span>
                      {totalSavings > 0 && (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                          You save {formatPrice(totalSavings)}!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Link
                    href="/checkout"
                    className="w-full py-4 bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 text-white rounded-2xl font-semibold text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 dark:shadow-amber-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <Lock className="w-5 h-5" />
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Security Note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <Shield className="w-4 h-4" />
                    Secure checkout with SSL encryption
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: "Free Shipping", sublabel: "Over ₹999" },
                  { icon: RotateCcw, label: "Easy Returns", sublabel: "7 Days" },
                  { icon: Shield, label: "Secure Pay", sublabel: "100% Safe" },
                ].map((badge, i) => (
                  <div
                    key={badge.label}
                    className="bg-white dark:bg-gray-900 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-gray-950/50 transition-shadow"
                  >
                    <badge.icon className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{badge.label}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{badge.sublabel}</p>
                  </div>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
                  We accept
                </p>
                <div className="flex items-center justify-center gap-3">
                  {["visa", "mastercard", "upi", "paytm", "cod"].map((method) => (
                    <div 
                      key={method}
                      className="w-10 h-6 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div 
          className={`mt-16 transition-all duration-700 delay-400 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              You might also like
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {isLoadingRecommended ? (
              [1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-square bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <Package className="w-12 h-12" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mt-2 animate-pulse" />
                  </div>
                </div>
              ))
            ) : (
              recommendedProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))
            )}
          </div>
        </div>
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
      `}</style>
    </div>
  );
}

// Cart Item Card Component
interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    compare_price?: number | null;
    quantity: number;
    image: string;
    stock?: number;
  };
  isRemoving: boolean;
  isUpdating: boolean;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  delay: number;
}

function CartItemCard({
  item,
  isRemoving,
  isUpdating,
  onUpdateQuantity,
  onRemove,
  delay,
}: CartItemProps) {
  const [imageError, setImageError] = useState(false);
  const hasDiscount = item.compare_price && item.compare_price > item.price;
  const savings = hasDiscount ? (item.compare_price! - item.price) * item.quantity : 0;
  const productImage = imageError
    ? "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=200"
    : item.image || "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=200";

  return (
    <div
      className={cn(
        "group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-500",
        "hover:shadow-xl hover:shadow-gray-100/50 dark:hover:shadow-gray-950/30",
        isRemoving && "opacity-50 scale-95 pointer-events-none"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="p-4 sm:p-6">
        <div className="flex gap-4 sm:gap-6">
          {/* Product Image */}
          <Link
            href={`/products/${item.id}`}
            className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 group/image"
          >
            <Image
              src={productImage}
              alt={item.name}
              fill
              className="object-cover group-hover/image:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
            {hasDiscount && (
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-linear-to-r from-red-500 to-rose-500 text-white text-xs font-bold rounded-full">
                SALE
              </div>
            )}
          </Link>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Link
                  href={`/products/${item.id}`}
                  className="font-semibold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(item.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(item.compare_price!)}
                    </span>
                  )}
                </div>

                {savings > 0 && (
                  <span className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <Zap className="w-3 h-3" />
                    You save {formatPrice(savings)}
                  </span>
                )}
              </div>

              {/* Remove Button */}
              <button
                onClick={onRemove}
                disabled={isRemoving}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
              >
                {isRemoving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between mt-4">
              {/* Quantity Controls */}
              <div className="flex items-center">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => onUpdateQuantity(item.quantity - 1)}
                    disabled={item.quantity <= 1 || isUpdating}
                    className="p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      item.quantity
                    )}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.quantity + 1)}
                    disabled={isUpdating || (item.stock !== undefined && item.quantity >= item.stock)}
                    className="p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {item.stock !== undefined && item.stock <= 5 && (
                  <span className="ml-3 text-xs text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Only {item.stock} left
                  </span>
                )}
              </div>

              {/* Item Total */}
              <div className="text-right">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
          <Heart className="w-4 h-4" />
          Save for Later
        </button>
      </div>
    </div>
  );
}

// Empty Cart Component
function EmptyCart({ 
  isLoaded, 
  recommendedProducts, 
  isLoadingRecommended 
}: { 
  isLoaded: boolean;
  recommendedProducts: Product[];
  isLoadingRecommended: boolean;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/20 transition-colors duration-500">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-linear-to-r from-amber-200/30 to-orange-200/30 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-linear-to-r from-purple-200/30 to-pink-200/30 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-lg mx-auto px-4 py-20">
        <div 
          className={`transition-all duration-700 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Glow Effect */}
          <div className="absolute -inset-4 rounded-3xl bg-linear-to-r from-amber-200 via-orange-200 to-amber-200 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-amber-900/30 opacity-50 blur-2xl" />

          {/* Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl">
            {/* Gradient Bar */}
            <div className="h-1.5 bg-linear-to-r from-amber-400 via-orange-500 to-amber-400" />

            <div className="px-8 py-16 text-center">
              {/* Animated Icon */}
              <div className="relative mx-auto mb-8 w-32 h-32">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-200 dark:border-amber-800/50 animate-spin-slow" />
                {/* Inner Circle */}
                <div className="absolute inset-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-amber-500 dark:text-amber-400" />
                </div>
                
                {/* Floating Elements */}
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-bounce" />
                <Package className="absolute -bottom-1 -left-3 w-5 h-5 text-orange-400 animate-bounce animation-delay-500" />
              </div>

              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Your cart is empty
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
                Looks like you haven't added anything to your cart yet. Start exploring our collection!
              </p>

              {/* CTA Button */}
              <Link
                href="/products"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 dark:shadow-amber-500/15 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                {/* Shimmer Effect */}
                <span className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-white/20 to-transparent" />
                <ShoppingBag className="w-5 h-5" />
                <span>Start Shopping</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Decorative Dots */}
              <div className="flex justify-center gap-2 mt-12">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-amber-200 dark:bg-amber-800/60 animate-dot-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { icon: Truck, label: "Free Shipping", desc: "Over ₹999" },
              { icon: Shield, label: "Secure Pay", desc: "100% Safe" },
              { icon: RotateCcw, label: "Easy Returns", desc: "7 Days" },
            ].map((feature, idx) => (
              <div
                key={feature.label}
                className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-800"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <feature.icon className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-900 dark:text-white">{feature.label}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Recommendations in Empty Cart */}
          <div 
            className={`mt-16 transition-all duration-700 delay-500 px-4 sm:px-0 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                You might also like
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {isLoadingRecommended ? (
                [1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="aspect-square bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <Package className="w-12 h-12" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                      <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mt-2 animate-pulse" />
                    </div>
                  </div>
                ))
              ) : (
                recommendedProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))
              )}
            </div>
          </div>
        </div>
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
      `}</style>
    </div>
  );
}