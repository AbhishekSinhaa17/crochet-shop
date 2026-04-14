"use client";

import { useState, useEffect, useRef } from "react";
import { CustomOrder } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  IndianRupee,
  ChevronDown,
  ExternalLink,
  Copy,
  CreditCard,
  MessageSquare,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  StickyNote,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Props {
  customOrders: CustomOrder[];
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CustomOrdersContent({ customOrders }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPayingId, setIsPayingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (order: CustomOrder) => {
    setIsPayingId(order.id);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customOrderId: order.id }),
      });

      const data = await res.json();
      if (!data.orderId)
        throw new Error(data.error || "Failed to initiate payment");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Strokes of Craft",
        description: `Custom Order: ${order.title}`,
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                customOrderId: order.id,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              toast.success(
                "Payment successful! Your order is now being processed."
              );
              window.location.reload();
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err: any) {
            toast.error(err.message || "Something went wrong");
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: { color: "#8b5cf6" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Could not start payment");
    } finally {
      setIsPayingId(null);
    }
  };

  if (customOrders.length === 0) {
    return (
      <div className="relative text-center py-20 rounded-3xl border border-gray-200/60 dark:border-gray-700/40 overflow-hidden group">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-violet-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent dark:from-violet-900/20" />

        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-violet-200/30 dark:bg-violet-800/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/30 dark:bg-purple-800/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl rotate-6 opacity-20 animate-pulse" />
            <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-9 h-9 text-violet-400 dark:text-violet-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No custom orders yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
            Have something unique in mind? Let&apos;s bring your crochet
            dream to life.
          </p>
          <button
            onClick={() => (window.location.href = "/custom-order")}
            className="group/btn relative inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
            Request a Custom Piece
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {customOrders.map((order, index) => (
        <div
          key={order.id}
          className={cn(
            "transition-all duration-700",
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <CustomOrderCard
            order={order}
            isExpanded={expandedId === order.id}
            onToggle={() =>
              setExpandedId(expandedId === order.id ? null : order.id)
            }
            onPay={() => handlePayment(order)}
            isPaying={isPayingId === order.id}
          />
        </div>
      ))}
    </div>
  );
}

function CustomOrderCard({
  order,
  isExpanded,
  onToggle,
  onPay,
  isPaying,
}: {
  order: CustomOrder;
  isExpanded: boolean;
  onToggle: () => void;
  onPay: () => void;
  isPaying: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, order]);

  const copyOrderId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(order.id);
    toast.success("Order ID copied!");
  };

  return (
    <>
      <div
        className={cn(
          "relative rounded-2xl border overflow-hidden transition-all duration-500",
          "bg-white dark:bg-gray-900/80",
          "backdrop-blur-xl",
          isExpanded
            ? "border-violet-200/60 dark:border-violet-800/40 shadow-xl shadow-violet-500/5 dark:shadow-violet-500/5"
            : "border-gray-200/60 dark:border-gray-700/40 shadow-sm hover:shadow-lg hover:border-gray-300/60 dark:hover:border-gray-600/40"
        )}
      >
        {/* Top accent line */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-[2px] transition-all duration-500",
            getStatusGradient(order.status),
            isExpanded ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Subtle background glow when expanded */}
        {isExpanded && (
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-violet-50/50 dark:from-violet-950/10 to-transparent pointer-events-none" />
        )}

        {/* Header */}
        <div
          className="relative p-5 sm:p-6 cursor-pointer select-none"
          onClick={onToggle}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Status Icon with pulse ring */}
              <div className="relative">
                {(order.status === "in_progress" ||
                  order.status === "quoted") && (
                  <div
                    className={cn(
                      "absolute inset-0 rounded-xl animate-ping opacity-20",
                      order.status === "in_progress"
                        ? "bg-violet-500"
                        : "bg-cyan-500"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                    getStatusIconBg(order.status),
                    isExpanded && "scale-110"
                  )}
                >
                  {getStatusIcon(order.status)}
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                    {order.title}
                  </h3>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] uppercase font-extrabold tracking-wider border",
                      getStatusPillStyle(order.status)
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full mr-1.5",
                        getStatusDotColor(order.status),
                        (order.status === "in_progress" ||
                          order.status === "shipped") &&
                          "animate-pulse"
                      )}
                    />
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {formatDate(order.created_at)}
                  </span>
                  <button
                    onClick={copyOrderId}
                    className="flex items-center gap-1 font-mono text-[10px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-0.5 rounded-md border border-gray-200/50 dark:border-gray-700/50 transition-colors group/copy"
                  >
                    #{order.id.slice(0, 8)}
                    <Copy className="w-2.5 h-2.5 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 ml-auto sm:ml-0">
              {order.quoted_price && (
                <div className="text-right">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] leading-none mb-1">
                    Quote
                  </p>
                  <p className="text-lg sm:text-xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {formatPrice(order.quoted_price)}
                  </p>
                </div>
              )}
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-all duration-300",
                  isExpanded && "bg-violet-100 dark:bg-violet-900/30 rotate-180"
                )}
              >
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-colors duration-300",
                    isExpanded
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-gray-400"
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Timeline - Always visible */}
        <div className="px-5 sm:px-6 pb-5">
          <OrderTimeline status={order.status} />
        </div>

        {/* Expandable Content */}
        <div
          className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            maxHeight: isExpanded ? `${contentHeight + 40}px` : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div ref={contentRef}>
            <div className="border-t border-gray-100 dark:border-gray-800/60" />
            <div className="p-5 sm:p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column */}
                <div className="space-y-5">
                  {/* Description */}
                  <div className="group/desc">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" />
                      Your Request
                    </h4>
                    <div className="relative p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/60 dark:to-gray-800/30 rounded-xl border border-gray-200/40 dark:border-gray-700/30">
                      <div className="absolute top-3 left-3 text-gray-300 dark:text-gray-700 text-2xl font-serif leading-none">
                        &ldquo;
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-5 pr-2">
                        {order.description}
                      </p>
                      <div className="absolute bottom-1 right-4 text-gray-300 dark:text-gray-700 text-2xl font-serif leading-none">
                        &rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {order.admin_notes && (
                    <div className="relative overflow-hidden p-4 bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/10 border border-violet-200/40 dark:border-violet-800/30 rounded-xl">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-violet-200/20 dark:bg-violet-800/10 rounded-full blur-2xl" />
                      <div className="relative">
                        <h4 className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                          <StickyNote className="w-3 h-3" />
                          Note from Seller
                        </h4>
                        <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">
                          {order.admin_notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Quoted CTA */}
                  {order.status === "quoted" && (
                    <div className="relative overflow-hidden p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-200/60 dark:border-amber-800/30 rounded-xl">
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-200/30 dark:bg-amber-800/10 rounded-full blur-2xl" />
                      <div className="relative flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">
                            Ready for Payment
                          </h4>
                          <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-1 leading-relaxed">
                            Your quote is ready! Complete payment to start
                            the crafting process.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  {/* Reference Images */}
                  {order.reference_images?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" />
                        Reference Images
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {order.reference_images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setLightboxImg(img)}
                            className="group/img relative w-[72px] h-[72px] rounded-xl overflow-hidden border-2 border-gray-200/60 dark:border-gray-700/40 shadow-sm hover:shadow-lg hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300 hover:scale-105 active:scale-95"
                          >
                            <img
                              src={img}
                              alt={`Reference ${i + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                              <Eye className="w-4 h-4 text-white opacity-0 group-hover/img:opacity-100 transition-all duration-300 scale-75 group-hover/img:scale-100" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment Button */}
                  {order.status === "quoted" && (
                    <button
                      onClick={onPay}
                      disabled={isPaying}
                      className="group/pay relative w-full overflow-hidden rounded-xl py-3.5 px-6 font-bold text-sm text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-[length:200%_100%] group-hover/pay:animate-shimmer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      <div className="relative flex items-center justify-center gap-2.5">
                        {isPaying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CreditCard className="w-4 h-4 transition-transform group-hover/pay:scale-110" />
                        )}
                        {isPaying
                          ? "Processing..."
                          : `Pay ${formatPrice(order.quoted_price || 0)} & Start Order`}
                        {!isPaying && (
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/pay:translate-x-1" />
                        )}
                      </div>
                    </button>
                  )}

                  {/* Tracking Info */}
                  {order.status === "shipped" && order.tracking_id && (
                    <div className="relative overflow-hidden p-5 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/10 border border-blue-200/60 dark:border-blue-800/30 rounded-xl space-y-4">
                      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-2xl" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                            <Truck className="w-3 h-3" />
                            Tracking ID
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(
                                order.tracking_id || ""
                              );
                              toast.success("Tracking ID copied!");
                            }}
                            className="text-blue-400 hover:text-blue-600 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <code className="text-lg font-bold text-blue-900 dark:text-blue-200 tracking-wider">
                          {order.tracking_id}
                        </code>
                      </div>
                      <a
                        href={`https://www.17track.net/en/track?nums=${order.tracking_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Track Your Package
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Delivered Success */}
                  {order.status === "delivered" && (
                    <div className="relative overflow-hidden p-5 bg-gradient-to-br from-emerald-50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/10 border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl text-center">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-emerald-200/30 dark:bg-emerald-800/10 rounded-full blur-3xl" />
                      <div className="relative">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                          Order Delivered! 🎉
                        </h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400/80 mt-1">
                          We hope you love your custom piece!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImg(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-90 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg}
              alt="Reference"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Timeline Component
function OrderTimeline({ status }: { status: string }) {
  const steps = [
    { key: "pending", label: "Requested", icon: Clock },
    { key: "quoted", label: "Quoted", icon: IndianRupee },
    { key: "paid", label: "Paid", icon: CreditCard },
    { key: "in_progress", label: "Crafting", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const currentIdx =
    status === "cancelled"
      ? -1
      : steps.findIndex((s) => s.key === status);

  if (status === "cancelled") {
    return (
      <div className="flex items-center justify-center gap-2 py-2 px-4 bg-red-50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-800/30 rounded-xl">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
          Order Cancelled
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Mobile: Compact labels */}
      <div className="relative flex items-center justify-between max-w-xl mx-auto py-2">
        {/* Background Track */}
        <div className="absolute top-1/2 left-[20px] right-[20px] h-[3px] bg-gray-100 dark:bg-gray-800 rounded-full -translate-y-[10px]" />

        {/* Active Track */}
        <div
          className="absolute top-1/2 left-[20px] h-[3px] rounded-full -translate-y-[10px] transition-all duration-1000 ease-out"
          style={{
            width:
              currentIdx <= 0
                ? "0%"
                : `calc(${(currentIdx / (steps.length - 1)) * 100}% - ${currentIdx <= 0 ? 0 : 0}px)`,
            background:
              "linear-gradient(90deg, #8b5cf6, #a855f7, #7c3aed)",
          }}
        />

        {/* Animated glow on active line */}
        <div
          className="absolute top-1/2 left-[20px] h-[3px] rounded-full -translate-y-[10px] transition-all duration-1000 ease-out blur-sm opacity-50"
          style={{
            width:
              currentIdx <= 0
                ? "0%"
                : `calc(${(currentIdx / (steps.length - 1)) * 100}%)`,
            background:
              "linear-gradient(90deg, #8b5cf6, #a855f7, #7c3aed)",
          }}
        />

        {steps.map((step, idx) => {
          const isActive = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Step dot / icon */}
              <div
                className={cn(
                  "relative w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500",
                  isActive
                    ? "bg-white dark:bg-gray-900 border-[2.5px] border-violet-500 shadow-sm"
                    : "bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700",
                  isCurrent &&
                    "scale-[1.3] shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                )}
              >
                <Icon
                  className={cn(
                    "w-3 h-3 transition-colors duration-500",
                    isActive
                      ? "text-violet-500"
                      : "text-gray-300 dark:text-gray-600"
                  )}
                />
                {/* Current step ping */}
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full border-2 border-violet-400 animate-ping opacity-30" />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[8px] sm:text-[9px] font-bold mt-2 uppercase tracking-tight whitespace-nowrap transition-all duration-500",
                  isCurrent
                    ? "text-violet-600 dark:text-violet-400"
                    : isActive
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-gray-300 dark:text-gray-600"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Helpers ---

function getStatusGradient(status: string) {
  const map: Record<string, string> = {
    pending:
      "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400",
    quoted:
      "bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400",
    paid: "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400",
    in_progress:
      "bg-gradient-to-r from-violet-400 via-purple-500 to-violet-400",
    shipped:
      "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400",
    delivered:
      "bg-gradient-to-r from-green-400 via-emerald-500 to-green-400",
    cancelled:
      "bg-gradient-to-r from-red-400 via-red-500 to-red-400",
  };
  return map[status] || "bg-gradient-to-r from-gray-400 to-gray-400";
}

function getStatusIconBg(status: string) {
  const map: Record<string, string> = {
    pending:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    quoted:
      "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
    paid: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    in_progress:
      "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400",
    shipped:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    delivered:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    cancelled:
      "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  };
  return map[status] || "bg-gray-100 dark:bg-gray-800 text-gray-600";
}

function getStatusPillStyle(status: string) {
  const map: Record<string, string> = {
    pending:
      "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40",
    quoted:
      "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 border-cyan-200/60 dark:border-cyan-800/40",
    paid: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40",
    in_progress:
      "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/40",
    shipped:
      "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40",
    delivered:
      "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200/60 dark:border-green-800/40",
    cancelled:
      "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-800/40",
  };
  return map[status] || "bg-gray-50 dark:bg-gray-800 text-gray-600 border-gray-200 dark:border-gray-700";
}

function getStatusDotColor(status: string) {
  const map: Record<string, string> = {
    pending: "bg-amber-500",
    quoted: "bg-cyan-500",
    paid: "bg-emerald-500",
    in_progress: "bg-violet-500",
    shipped: "bg-blue-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
  };
  return map[status] || "bg-gray-500";
}

function getStatusIcon(status: string) {
  const iconClass = "w-5 h-5";
  switch (status) {
    case "pending":
      return <Clock className={iconClass} />;
    case "quoted":
      return <IndianRupee className={iconClass} />;
    case "paid":
      return <CheckCircle2 className={iconClass} />;
    case "in_progress":
      return <Package className={cn(iconClass, "animate-pulse")} />;
    case "shipped":
      return <Truck className={iconClass} />;
    case "delivered":
      return <CheckCircle2 className={iconClass} />;
    default:
      return <AlertCircle className={iconClass} />;
  }
}