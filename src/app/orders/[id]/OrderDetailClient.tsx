"use client";

// Client-side component for order details

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Package,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  HelpCircle,
  Download,
  Share2,
  Sparkles,
  Box,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  subtotal?: number;
  shipping_fee?: number;
  discount?: number;
  items: any[];
  created_at: string;
  shipping_address?: any;
  payment_method?: string;
  payment_status?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  notes?: string;
}

interface Props {
  order: Order;
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: RotateCcw },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const statusConfig: Record<string, { color: string; bgColor: string; gradient: string }> = {
  pending: { color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-500/10", gradient: "from-amber-500 to-orange-500" },
  confirmed: { color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-500/10", gradient: "from-amber-500 to-orange-500" },
  processing: { color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-500/10", gradient: "from-blue-500 to-cyan-500" },
  shipped: { color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-50 dark:bg-purple-500/10", gradient: "from-purple-500 to-pink-500" },
  delivered: { color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-500/10", gradient: "from-emerald-500 to-teal-500" },
  cancelled: { color: "text-red-600 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-500/10", gradient: "from-red-500 to-rose-500" },
};

export default function OrderDetailClient({ order }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const currentStatusIndex = statusSteps.findIndex(s => s.key === order.status);
  const status = statusConfig[order.status] || statusConfig.pending;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const address = order.shipping_address;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-linear-to-r from-amber-200/30 to-orange-200/30 dark:from-amber-600/10 dark:to-orange-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-linear-to-r from-purple-200/30 to-pink-200/30 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div 
          className={`mb-8 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          {/* Back Button & Breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Orders
            </Link>
            
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Order Header Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className={`h-2 bg-linear-to-r ${status.gradient}`} />
            
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
                      Order #{order.order_number}
                    </h1>
                    <button
                      onClick={() => copyToClipboard(order.order_number, "order")}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {copiedField === "order" ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
                
                <div className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold",
                  status.bgColor,
                  status.color
                )}>
                  {order.status === "cancelled" ? (
                    <XCircle className="w-5 h-5" />
                  ) : order.status === "delivered" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : order.status === "shipped" ? (
                    <Truck className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Progress */}
        {order.status !== "cancelled" && (
          <div 
            className={`mb-8 transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-6 md:p-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-500" />
                Order Progress
              </h2>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-6 right-6 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-linear-to-r ${status.gradient} transition-all duration-1000`}
                    style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
                
                {/* Steps */}
                <div className="relative flex justify-between">
                  {statusSteps.map((step, idx) => {
                    const isCompleted = idx <= currentStatusIndex;
                    const isCurrent = idx === currentStatusIndex;
                    const Icon = step.icon;
                    
                    return (
                      <div 
                        key={step.key} 
                        className="flex flex-col items-center"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div 
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 z-10",
                            isCompleted 
                              ? `bg-linear-to-br ${status.gradient} text-white shadow-lg` 
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500",
                            isCurrent && "ring-4 ring-amber-100 dark:ring-amber-900/30 scale-110"
                          )}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={cn(
                          "mt-3 text-sm font-medium text-center",
                          isCompleted ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
                        )}>
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className="text-xs text-amber-600 dark:text-amber-400 mt-1">Current</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tracking Info */}
              {order.tracking_number && (
                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Tracking Number</p>
                      <p className="text-lg font-mono font-semibold text-gray-900 dark:text-white mt-1">
                        {order.tracking_number}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(order.tracking_number!, "tracking")}
                      className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all flex items-center gap-2"
                      title="Copy Tracking ID"
                    >
                      {copiedField === "tracking" ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      )}
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Copy ID</span>
                    </button>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <a
                      href={`https://www.17track.net/en/track?nums=${order.tracking_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
                    >
                      <Truck className="w-5 h-5" />
                      Track Order (Fast)
                    </a>
                    <a
                      href="https://www.indiapost.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 border-2 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 font-bold rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Official Portal
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic w-full">
                      If the official portal is slow, use the Fast Tracker button above.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div 
            className={`md:col-span-2 transition-all duration-700 delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Box className="w-5 h-5 text-amber-500" />
                  Order Items ({order.items.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.items.map((item: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="p-4 md:p-6 flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                      <Image
                        src={item.image || "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=200"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/products/${item.product_id}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatPrice(item.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Details */}
          <div 
            className={`space-y-6 transition-all duration-700 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-500" />
                  Order Summary
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium dark:text-white">{formatPrice(order.subtotal || order.total)}</span>
                </div>
                
                {order.shipping_fee !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                    <span className="font-medium dark:text-white">
                      {order.shipping_fee === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                      ) : (
                        formatPrice(order.shipping_fee)
                      )}
                    </span>
                  </div>
                )}
                
                {order.discount !== undefined && order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Discount</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {order.payment_method && (
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize mt-1">
                      {order.payment_method}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {address && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-500" />
                    Shipping Address
                  </h2>
                </div>
                
                <div className="p-6">
                  <p className="font-semibold text-gray-900 dark:text-white">{address.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {address.line1}
                    {address.line2 && <>, {address.line2}</>}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{address.country}</p>
                  
                  {address.phone && (
                    <div className="flex items-center gap-2 mt-4 text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      {address.phone}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Need Help? */}
            <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
                  <HelpCircle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Need Help?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Contact our support team for any questions about your order.
                  </p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-500 font-medium text-sm mt-3 hover:underline"
                  >
                    Contact Support
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div 
          className={`mt-8 flex flex-wrap gap-4 transition-all duration-700 delay-400 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/30 dark:shadow-amber-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5" />
            Shop More
          </Link>
          
          {order.status === "delivered" && (
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300">
              <RotateCcw className="w-5 h-5" />
              Reorder
            </button>
          )}
        </div>
      </div>
    </div>
  );
}