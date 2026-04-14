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
  MapPin,
  X,
  Send,
  MessageCircle,
  ArrowUpRight,
  Phone,
  HelpCircle,
  ShoppingBag,
  Zap,
  Star,
  Heart,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import ChatWindow from "@/components/chat/ChatWindow";

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
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const { user } = useAuthStore();

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

  const handlePayment = async (order: CustomOrder, shippingAddress?: any) => {
    setIsPayingId(order.id);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customOrderId: order.id,
          shippingAddress: shippingAddress,
        }),
      });

      const { data, error } = await res.json();
      if (!data?.orderId) throw new Error(error || "Failed to create order");

      if (data.testMode) {
        toast.loading("Simulating payment (Test Mode)...", { duration: 2000 });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: data.orderId,
            razorpay_payment_id: `test_pay_${Date.now()}`,
            razorpay_signature: "mock_signature",
            customOrderId: order.id,
          }),
        });
        const result = await verifyRes.json();
        if (result.data?.verified) {
          toast.success("Test payment successful!");
          window.location.reload();
        } else {
          throw new Error("Test payment failed");
        }
        return;
      }

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
              body: JSON.stringify({ ...response, customOrderId: order.id }),
            });
            const result = await verifyRes.json();
            if (result.data?.verified) {
              toast.success("Payment successful! Your order is now being processed.");
              window.location.reload();
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err: any) {
            toast.error(err.message || "Something went wrong");
          }
        },
        prefill: { name: "", email: "" },
        theme: { color: "#8b5cf6" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Could not start payment");
    } finally {
      setIsPayingId(null);
    }
  };

  const handleChat = (order: CustomOrder) => {
    window.location.href = "/contact";
  };

  if (customOrders.length === 0) {
    return (
      <div className="relative text-center py-24 rounded-3xl overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.08),transparent)]" />
        <div className="absolute inset-0 border border-violet-100/60 dark:border-violet-900/30 rounded-3xl" />

        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)]" />

        {/* Floating orbs */}
        <div className="absolute top-12 left-16 w-40 h-40 bg-violet-300/20 dark:bg-violet-700/10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-12 right-16 w-48 h-48 bg-fuchsia-300/20 dark:bg-fuchsia-700/10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite_1.5s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/10 dark:bg-purple-800/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Icon cluster */}
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 dark:from-violet-600/10 dark:to-fuchsia-600/10 rounded-3xl blur-xl animate-pulse" />
            <div className="relative w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl border border-violet-100 dark:border-violet-900/50 shadow-2xl shadow-violet-500/10 flex items-center justify-center">
              <ShoppingBag className="w-11 h-11 text-violet-500 dark:text-violet-400" />
            </div>
            {/* Floating badges */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 animate-bounce">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-3 w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg animate-[bounce_2s_ease-in-out_infinite_0.5s]">
              <Star className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
            No custom orders yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed text-base">
            Have something unique in mind? Let&apos;s bring your crochet dream
            to life — handcrafted just for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              onClick={() => (window.location.href = "/custom-order")}
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white overflow-hidden shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%] animate-[shimmer_3s_ease-in-out_infinite]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <span className="relative flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                Request a Custom Piece
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-10 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              Secure Payment
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Handcrafted
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Fast Response
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {customOrders.map((order, index) => (
        <div
          key={order.id}
          className={cn(
            "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
          style={{ transitionDelay: `${index * 120}ms` }}
        >
          <CustomOrderCard
            order={order}
            isExpanded={expandedId === order.id}
            onToggle={() =>
              setExpandedId(expandedId === order.id ? null : order.id)
            }
            handlePayment={handlePayment}
            onChat={() => handleChat(order)}
            isPaying={isPayingId === order.id}
          />
        </div>
      ))}

      {/* Chat Modal */}
      {chatOrderId &&
        (() => {
          const order = customOrders.find((o) => o.id === chatOrderId);
          if (!order || !order.conversation_id || !user) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={() => setChatOrderId(null)}
              />
              {/* Modal */}
              <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl h-[85vh] sm:h-[75vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
                {/* Header */}
                <div className="relative flex items-center justify-between p-5 overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),transparent)]" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-lg leading-tight">
                        Order Support
                      </h3>
                      <p className="text-violet-200 text-xs mt-0.5 truncate max-w-[200px]">
                        {order.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChatOrderId(null)}
                    className="relative w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center transition-all hover:rotate-90 duration-300"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                {/* Chat body */}
                <div className="flex-1 overflow-hidden bg-gray-50/50 dark:bg-gray-950/30">
                  <ChatWindow
                    conversationId={order.conversation_id}
                    currentUserId={user.id}
                  />
                </div>
              </div>
            </div>
          );
        })()}

      {/* Creating chat loader */}
      {isCreatingChat && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />
          <div className="relative bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-5 animate-in zoom-in-95 duration-300 border border-violet-100 dark:border-violet-900/30">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/20 rounded-full animate-ping" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-xl shadow-violet-500/30">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-black text-xl text-gray-900 dark:text-white">
                Setting up chat
              </p>
              <p className="text-sm text-gray-400 mt-1.5">
                Connecting with support team...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Individual Card ──────────────────────────────────────────────────────────

function CustomOrderCard({
  order,
  isExpanded,
  onToggle,
  handlePayment,
  onChat,
  isPaying,
}: {
  order: CustomOrder;
  isExpanded: boolean;
  onToggle: () => void;
  handlePayment: (order: CustomOrder, shippingAddress?: any) => Promise<void>;
  onChat: () => void;
  isPaying: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      const ro = new ResizeObserver(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      });
      ro.observe(contentRef.current);
      setContentHeight(contentRef.current.scrollHeight);
      return () => ro.disconnect();
    }
  }, [isExpanded, order]);

  const copyOrderId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(order.id);
    toast.success("Order ID copied!");
  };

  const statusMeta = getStatusMeta(order.status);

  return (
    <>
      <div
        className={cn(
          "group relative rounded-3xl border overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
          isExpanded
            ? "border-violet-200/70 dark:border-violet-800/50 shadow-2xl shadow-violet-500/8 dark:shadow-violet-500/5"
            : "border-gray-200/70 dark:border-gray-700/50 shadow-md hover:shadow-xl hover:shadow-violet-500/5 hover:border-violet-200/50 dark:hover:border-violet-800/30"
        )}
      >
        {/* Animated top gradient bar */}
        <div
          className={cn(
            "absolute top-0 inset-x-0 h-[3px] transition-all duration-700",
            statusMeta.gradient,
            isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-40"
          )}
        />

        {/* Background glow (expanded) */}
        <div
          className={cn(
            "absolute top-0 inset-x-0 h-48 pointer-events-none transition-opacity duration-500",
            isExpanded ? "opacity-100" : "opacity-0"
          )}
          style={{
            background: `radial-gradient(ellipse at top, ${statusMeta.glowColor} 0%, transparent 70%)`,
          }}
        />

        {/* ── Collapsed Header ─────────────────────────────────────────── */}
        <div className="relative p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Left: icon + info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Status icon */}
              <div className="relative shrink-0">
                {/* Pulse ring for active statuses */}
                {["quoted", "in_progress", "shipped"].includes(order.status) && (
                  <div
                    className={cn(
                      "absolute inset-0 rounded-2xl animate-ping opacity-25",
                      statusMeta.pingColor
                    )}
                  />
                )}
                <div
                  className={cn(
                    "relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300",
                    statusMeta.iconBg,
                    isExpanded && "scale-110"
                  )}
                >
                  {getStatusIcon(order.status)}
                </div>
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight truncate">
                    {order.title}
                  </h3>
                  {/* Status pill */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border",
                      statusMeta.pill
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        statusMeta.dot,
                        ["in_progress", "shipped"].includes(order.status) && "animate-pulse"
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
                    className="group/copy flex items-center gap-1.5 font-mono bg-gray-100 dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 px-2 py-0.5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200"
                  >
                    #{order.id.slice(0, 8).toUpperCase()}
                    <Copy className="w-2.5 h-2.5 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: price + toggle */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.18em] mb-0.5">
                  Total
                </p>
                <p
                  className={cn(
                    "text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r",
                    order.quoted_price ? statusMeta.priceGradient : "from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-500"
                  )}
                >
                  {order.quoted_price ? formatPrice(order.quoted_price) : "Pending"}
                </p>
              </div>
              {/* Toggle button */}
              <button
                onClick={onToggle}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 border",
                  isExpanded
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 border-transparent text-white shadow-lg shadow-violet-500/25"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400"
                )}
              >
                <Eye
                  className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    isExpanded && "scale-110"
                  )}
                />
                <span className="hidden sm:inline">
                  {isExpanded ? "Collapse" : "Details"}
                </span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-300",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Quick Progress Strip (collapsed only) */}
          {!isExpanded && (
            <div className="mt-5 animate-in fade-in duration-300">
              <MiniTimeline status={order.status} />
            </div>
          )}
        </div>

        {/* ── Expanded Content ──────────────────────────────────────────── */}
        <div
          className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            maxHeight: isExpanded ? `${contentHeight + 80}px` : "0px",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div ref={contentRef}>
            {/* Divider */}
            <div className="mx-5 sm:mx-6 border-t border-gray-100 dark:border-gray-800/60" />

            <div className="p-5 sm:p-8 space-y-8">
              {/* Full Timeline */}
              <OrderTimelineSection status={order.status} />

              {/* Main grid */}
              <div className="grid lg:grid-cols-3 gap-6 xl:gap-8">
                {/* Left: Project details (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Project card */}
                  <GlassCard>
                    <GlassCardHeader
                      icon={<Sparkles className="w-4.5 h-4.5 text-violet-500" />}
                      title="Custom Project"
                    />
                    <div className="p-6 space-y-6">
                      {/* Hero row */}
                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Image */}
                        <div className="relative w-full sm:w-44 h-44 rounded-2xl overflow-hidden shrink-0 shadow-xl shadow-black/10 border border-gray-100 dark:border-gray-800">
                          <img
                            src={
                              order.reference_images?.[0] ||
                              "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=400"
                            }
                            alt={order.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                            {order.title}
                          </h4>

                          {/* Description */}
                          <div className="relative p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                            <span className="absolute top-2 left-3 text-3xl text-gray-200 dark:text-gray-700 font-serif leading-none select-none">
                              &ldquo;
                            </span>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-5 pr-2 italic">
                              {order.description}
                            </p>
                            <span className="absolute bottom-0 right-4 text-3xl text-gray-200 dark:text-gray-700 font-serif leading-none select-none">
                              &rdquo;
                            </span>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {order.preferred_colors && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 shadow-sm">
                                <span className="font-bold text-violet-500">Color:</span>
                                {order.preferred_colors}
                              </span>
                            )}
                            {order.size_details && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 shadow-sm">
                                <span className="font-bold text-violet-500">Size:</span>
                                {order.size_details}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reference images grid */}
                      {order.reference_images?.length > 1 && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mb-3">
                            Reference Images
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {order.reference_images.map((img, i) => (
                              <button
                                key={i}
                                onClick={() => setLightboxImg(img)}
                                className="group/img relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 hover:border-violet-400 dark:hover:border-violet-600 shadow-sm hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 hover:scale-105"
                              >
                                <img
                                  src={img}
                                  className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-violet-600/0 group-hover/img:bg-violet-600/20 transition-colors flex items-center justify-center">
                                  <Eye className="w-5 h-5 text-white opacity-0 group-hover/img:opacity-100 transition-all scale-75 group-hover/img:scale-100" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status action */}
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-800/60">
                        <OrderStatusSection
                          order={order}
                          isPaying={isPaying}
                          handlePayment={handlePayment}
                          onChat={onChat}
                        />
                      </div>
                    </div>
                  </GlassCard>

                  {/* Seller note */}
                  {order.admin_notes && (
                    <div className="relative overflow-hidden p-5 rounded-3xl border border-violet-100/60 dark:border-violet-900/30">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-fuchsia-50/40 to-transparent dark:from-violet-950/30 dark:via-fuchsia-950/10 dark:to-transparent" />
                      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/20 dark:bg-violet-800/10 rounded-full blur-2xl" />
                      <div className="relative flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-white dark:bg-gray-800 border border-violet-100 dark:border-violet-900/50 flex items-center justify-center shadow-sm shrink-0">
                          <StickyNote className="w-5 h-5 text-violet-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-500 dark:text-violet-400 mb-1.5">
                            Note from your Maker
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {order.admin_notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: sidebar (1/3) */}
                <div className="space-y-5">
                  {/* Price summary */}
                  <GlassCard>
                    <GlassCardHeader
                      icon={<CreditCard className="w-4 h-4 text-violet-500" />}
                      title="Price Summary"
                    />
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{order.title}</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {formatPrice(order.quoted_price || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          Free
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                            Total
                          </span>
                          <span
                            className={cn(
                              "text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r",
                              order.quoted_price ? statusMeta.priceGradient : "from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-500"
                            )}
                          >
                            {order.quoted_price ? formatPrice(order.quoted_price) : "Pending"}
                          </span>
                        </div>
                      </div>
                      {/* Payment status badge */}
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                        {["paid", "in_progress", "shipped", "delivered"].includes(order.status) ? (
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-bold">Payment Confirmed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-bold">Payment Pending</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassCard>

                  {/* New Support Section from Screenshot */}
                  <div className="relative overflow-hidden rounded-3xl bg-gray-950 p-6 border border-gray-800/60 transition-all duration-300 hover:border-violet-500/30">
                    <div className="relative flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                          <HelpCircle className="w-6 h-6 text-amber-500" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-gray-950 animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-white mb-1 tracking-tight">
                          Need Help?
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                          Contact our support team for any questions about your order.
                        </p>
                        <button
                          onClick={onChat}
                          className="group/btn flex items-center gap-1.5 text-sm font-black text-amber-500 hover:text-amber-400 transition-colors"
                        >
                          Contact Support
                          <ChevronDown className="w-4 h-4 -rotate-90 transition-transform group-hover/btn:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delivery address */}
                  {order.shipping_address && (
                    <GlassCard>
                      <GlassCardHeader
                        icon={<MapPin className="w-4 h-4 text-violet-500" />}
                        title="Delivery Address"
                      />
                      <div className="p-5">
                        <p className="font-bold text-sm text-gray-900 dark:text-white mb-1">
                          {order.shipping_address.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          {order.shipping_address.line1}
                          <br />
                          {order.shipping_address.city},{" "}
                          {order.shipping_address.state} –{" "}
                          {order.shipping_address.pincode}
                          <br />
                          India
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Phone className="w-3.5 h-3.5 text-violet-400" />
                          {order.shipping_address.phone}
                        </div>
                      </div>
                    </GlassCard>
                  )}
                  {/* Support widget - Only visible during payment phase as requested */}
                  {order.status === "quoted" && (
                    <div className="relative overflow-hidden rounded-3xl p-6 text-white group cursor-default animate-in fade-in slide-in-from-bottom-2 duration-500">
                      {/* BG */}
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.12),transparent)]" />
                      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center mb-4">
                          <HelpCircle className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-black text-base mb-1.5">Need help?</h4>
                        <p className="text-violet-100 text-xs leading-relaxed mb-5">
                          Our maker is happy to answer questions about your custom
                          project.
                        </p>
                        <button
                          onClick={onChat}
                          className="w-full py-3 bg-white hover:bg-violet-50 text-violet-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Chat with Support
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImg(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
          <div
            className="relative max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-90 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg}
              alt="Reference"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors backdrop-blur-sm border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Glass Card Primitives ────────────────────────────────────────────────────

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

function GlassCardHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-800/20">
      <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-900/30 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-black text-sm text-gray-900 dark:text-white tracking-tight">
        {title}
      </h3>
    </div>
  );
}

// ─── Mini Timeline (collapsed) ────────────────────────────────────────────────

function MiniTimeline({ status }: { status: string }) {
  const steps = [
    { key: "pending", label: "Requested" },
    { key: "quoted", label: "Quoted" },
    { key: "paid", label: "Paid" },
    { key: "in_progress", label: "Crafting" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
  ];

  const currentIdx = steps.findIndex((s) => s.key === status);

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-xs font-bold text-red-500 dark:text-red-400">
        <AlertCircle className="w-3.5 h-3.5" />
        Order Cancelled
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-0">
      {steps.map((step, idx) => {
        const isActive = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            {/* Node */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                  isCurrent
                    ? "border-violet-500 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)] scale-125"
                    : isActive
                      ? "border-violet-500 bg-white dark:bg-gray-900"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                )}
              >
                {isActive && !isCurrent && (
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                )}
                {isCurrent && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span
                className={cn(
                  "absolute top-6 text-[8px] font-bold whitespace-nowrap tracking-tight transition-colors duration-300",
                  isCurrent
                    ? "text-violet-600 dark:text-violet-400"
                    : isActive
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-gray-300 dark:text-gray-600"
                )}
              >
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-0.5 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <div
                  className={cn(
                    "h-full transition-all duration-700 rounded-full",
                    idx < currentIdx
                      ? "w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Full Timeline Section ────────────────────────────────────────────────────

function OrderTimelineSection({ status }: { status: string }) {
  const steps = [
    { key: "pending", label: "Requested", desc: "Order submitted", icon: Clock },
    { key: "quoted", label: "Quoted", desc: "Price confirmed", icon: IndianRupee },
    { key: "paid", label: "Paid", desc: "Payment received", icon: CreditCard },
    { key: "in_progress", label: "Crafting", desc: "Being handmade", icon: Package },
    { key: "shipped", label: "Shipped", desc: "On its way", icon: Truck },
    { key: "delivered", label: "Delivered", desc: "Order complete", icon: CheckCircle2 },
  ];

  const currentIdx = status === "cancelled" ? -1 : steps.findIndex((s) => s.key === status);

  if (status === "cancelled") {
    return (
      <div className="flex items-center justify-center gap-3 p-5 bg-red-50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-800/30 rounded-2xl">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <div>
          <p className="text-sm font-bold text-red-700 dark:text-red-400">Order Cancelled</p>
          <p className="text-xs text-red-500 dark:text-red-500/80 mt-0.5">
            This order was cancelled. Please contact support for help.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative px-2">
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-start relative pt-2 pb-8">
        {/* Track */}
        <div className="absolute top-[18px] left-[28px] right-[28px] h-[3px] bg-gray-100 dark:bg-gray-800 rounded-full" />
        {/* Active track */}
        <div
          className="absolute top-[18px] left-[28px] h-[3px] rounded-full transition-all duration-1000 ease-out"
          style={{
            width:
              currentIdx <= 0
                ? "0%"
                : `calc(${(currentIdx / (steps.length - 1)) * 100}% * ((100% - 56px) / 100%))`,
            background: "linear-gradient(90deg, #8b5cf6, #a855f7, #ec4899)",
          }}
        />
        {/* Glow track */}
        <div
          className="absolute top-[18px] left-[28px] h-[3px] rounded-full blur-sm opacity-40 transition-all duration-1000 ease-out"
          style={{
            width:
              currentIdx <= 0
                ? "0%"
                : `calc(${(currentIdx / (steps.length - 1)) * 100}% * ((100% - 56px) / 100%))`,
            background: "linear-gradient(90deg, #8b5cf6, #a855f7, #ec4899)",
          }}
        />

        {steps.map((step, idx) => {
          const isActive = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const Icon = step.icon;
          return (
            <div
              key={step.key}
              className="relative flex-1 flex flex-col items-center"
            >
              {/* Circle */}
              <div
                className={cn(
                  "relative z-10 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                  isActive
                    ? "bg-white dark:bg-gray-900 border-violet-500"
                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                  isCurrent &&
                    "scale-125 border-violet-500 shadow-[0_0_16px_rgba(139,92,246,0.4)]"
                )}
              >
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full border-2 border-violet-400 animate-ping opacity-25" />
                )}
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 transition-colors duration-500",
                    isActive ? "text-violet-500" : "text-gray-300 dark:text-gray-600"
                  )}
                />
              </div>

              {/* Label */}
              <div className="text-center mt-3">
                <p
                  className={cn(
                    "text-[10px] font-black uppercase tracking-wider transition-colors duration-500",
                    isCurrent
                      ? "text-violet-600 dark:text-violet-400"
                      : isActive
                        ? "text-gray-800 dark:text-gray-200"
                        : "text-gray-300 dark:text-gray-600"
                  )}
                >
                  {step.label}
                </p>
                <p
                  className={cn(
                    "text-[9px] mt-0.5 transition-colors duration-500",
                    isActive
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-gray-200 dark:text-gray-700"
                  )}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="sm:hidden flex flex-col gap-0">
        {steps.map((step, idx) => {
          const isActive = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const isLast = idx === steps.length - 1;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 shrink-0",
                    isActive
                      ? "bg-white dark:bg-gray-900 border-violet-500"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                    isCurrent &&
                      "scale-110 shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5",
                      isActive ? "text-violet-500" : "text-gray-300 dark:text-gray-600"
                    )}
                  />
                </div>
                {!isLast && (
                  <div className="w-[2px] h-8 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                    <div
                      className={cn(
                        "w-full transition-all duration-700 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full",
                        isActive ? "h-full" : "h-0"
                      )}
                    />
                  </div>
                )}
              </div>
              <div className="pb-6">
                <p
                  className={cn(
                    "text-xs font-black uppercase tracking-wider",
                    isCurrent
                      ? "text-violet-600 dark:text-violet-400"
                      : isActive
                        ? "text-gray-800 dark:text-gray-200"
                        : "text-gray-300 dark:text-gray-600"
                  )}
                >
                  {step.label}
                </p>
                <p className={cn(
                  "text-[10px] mt-0.5",
                  isActive ? "text-gray-400" : "text-gray-200 dark:text-gray-700"
                )}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Status Section ───────────────────────────────────────────────────────────

function OrderStatusSection({
  order,
  isPaying,
  handlePayment,
  onChat,
}: {
  order: CustomOrder;
  isPaying: boolean;
  handlePayment: (order: CustomOrder, addr?: any) => Promise<void>;
  onChat: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState({
    name: order.shipping_address?.name || "",
    line1: order.shipping_address?.line1 || "",
    city: order.shipping_address?.city || "",
    state: order.shipping_address?.state || "",
    pincode: order.shipping_address?.pincode || "",
    phone: order.shipping_address?.phone || "",
  });

  useEffect(() => {
    if (order.shipping_address) {
      setAddress({
        name: order.shipping_address.name || "",
        line1: order.shipping_address.line1 || "",
        city: order.shipping_address.city || "",
        state: order.shipping_address.state || "",
        pincode: order.shipping_address.pincode || "",
        phone: order.shipping_address.phone || "",
      });
    }
  }, [order.shipping_address]);

  const isComplete =
    address.name && address.line1 && address.city && address.pincode && address.phone;

  const handlePay = () => {
    if (!isComplete) {
      setShowForm(true);
      toast.error("Please fill in your delivery address first");
      return;
    }
    handlePayment(order, address);
  };

  if (order.status === "pending") {
    return (
      <StatusBanner
        icon={<Clock className="w-5 h-5 text-amber-500 animate-pulse" />}
        iconBg="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30"
        title="Awaiting Quote"
        desc="Our maker is reviewing your request and will send a quote soon."
      />
    );
  }

  if (order.status === "quoted") {
    return (
      <div className="space-y-5">
        {/* Address block */}
        <div className="rounded-2xl border border-violet-100 dark:border-violet-900/40 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-violet-50/50 dark:bg-violet-950/20 border-b border-violet-100 dark:border-violet-900/30">
            <span className="text-xs font-black text-violet-700 dark:text-violet-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Delivery Address
            </span>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-[10px] font-bold text-violet-500 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              {isComplete ? "Edit" : "Add Address ↗"}
            </button>
          </div>
          <div className="p-5">
            {showForm ? (
              <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {[
                  { key: "name", placeholder: "Full Name", span: 2 },
                  { key: "phone", placeholder: "Phone Number", span: 1 },
                  { key: "line1", placeholder: "Address Line", span: 2 },
                  { key: "city", placeholder: "City", span: 1 },
                  { key: "state", placeholder: "State", span: 1 },
                  { key: "pincode", placeholder: "Pincode", span: 1 },
                ].map((f) => (
                  <input
                    key={f.key}
                    type="text"
                    placeholder={f.placeholder}
                    value={address[f.key as keyof typeof address]}
                    onChange={(e) =>
                      setAddress({ ...address, [f.key]: e.target.value })
                    }
                    className={cn(
                      "px-3 py-2.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-500/25 focus:border-violet-400 dark:focus:border-violet-600 transition-all",
                      f.span === 2 && "col-span-2"
                    )}
                  />
                ))}
                <button
                  onClick={() => setShowForm(false)}
                  className="col-span-2 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl text-sm font-bold transition-all hover:opacity-90 shadow-lg shadow-violet-500/20"
                >
                  Save Address
                </button>
              </div>
            ) : (
              <div className="min-h-[40px] flex items-center">
                {isComplete ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {address.name}
                    </span>
                    , {address.line1}, {address.city} – {address.pincode}
                  </p>
                ) : (
                  <p className="text-sm text-amber-600 dark:text-amber-400 italic">
                    Please add a delivery address to proceed with payment.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pay + Chat row */}
        <div className="flex gap-3">
          <button
            onClick={handlePay}
            disabled={isPaying}
            className="group/pay relative flex-1 overflow-hidden rounded-2xl py-4 font-black text-sm text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-violet-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%] group-hover/pay:animate-[shimmer_1.5s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <span className="relative flex items-center justify-center gap-2.5">
              {isPaying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CreditCard className="w-5 h-5" />
              )}
              {isPaying
                ? "Processing..."
                : `Pay ${formatPrice(order.quoted_price || 0)}`}
              {!isPaying && (
                <ArrowRight className="w-4 h-4 transition-transform group-hover/pay:translate-x-1" />
              )}
            </span>
          </button>
          <ChatButton onClick={onChat} color="violet" iconOnly />
        </div>
      </div>
    );
  }

  if (order.status === "paid" || order.status === "in_progress") {
    return (
      <StatusBanner
        icon={<Sparkles className="w-5 h-5 text-violet-500 animate-[bounce_1.5s_ease-in-out_infinite]" />}
        iconBg="bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900/30"
        title="Your order is being crafted"
        desc="Our maker is working hard on your custom masterpiece. Sit tight!"
      />
    );
  }

  if (order.status === "shipped") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 dark:border-blue-900/40 p-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Tracking ID */}
          <div className="flex-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 dark:text-blue-400 mb-2">
              Tracking ID
            </p>
            <div className="flex items-center gap-3">
              <code className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {order.tracking_id || "—"}
              </code>
              {order.tracking_id && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(order.tracking_id || "");
                    toast.success("Copied!");
                  }}
                  className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:border-blue-300 transition-colors shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://www.17track.net/en/track?nums=${order.tracking_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <Truck className="w-3.5 h-3.5" />
              Track
              <ArrowUpRight className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="https://www.indiapost.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 rounded-xl text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Official Portal
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (order.status === "delivered") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 dark:border-emerald-900/40 p-5 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-300/20 dark:bg-emerald-800/10 blur-3xl" />
        <div className="relative">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="font-black text-emerald-800 dark:text-emerald-300">
            Order Delivered! 🎉
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400/80 mt-1">
            We hope you love your custom creation!
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function StatusBanner({
  icon,
  iconBg,
  title,
  desc,
  action,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
      <div
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm shrink-0",
          iconBg
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
          {desc}
        </p>
      </div>
      {action}
    </div>
  );
}

function ChatButton({
  onClick,
  color,
  iconOnly,
}: {
  onClick: () => void;
  color: "amber" | "violet" | "blue";
  iconOnly?: boolean;
}) {
  const colors = {
    amber: "hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500 border-amber-100 dark:border-amber-900/30",
    violet: "hover:bg-violet-50 dark:hover:bg-violet-900/20 text-violet-500 border-violet-100 dark:border-violet-900/30",
    blue: "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 border-blue-100 dark:border-blue-900/30",
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border bg-white dark:bg-gray-900 transition-all duration-200 shadow-sm hover:shadow font-bold text-xs",
        iconOnly ? "w-12 h-12" : "px-4 h-12",
        colors[color]
      )}
      title="Chat with support"
    >
      <MessageSquare className="w-4 h-4" />
      {!iconOnly && "Chat"}
    </button>
  );
}

// ─── Status meta ──────────────────────────────────────────────────────────────

function getStatusMeta(status: string) {
  const map: Record<string, {
    gradient: string;
    glowColor: string;
    pingColor: string;
    iconBg: string;
    pill: string;
    dot: string;
    priceGradient: string;
  }> = {
    pending: {
      gradient: "bg-gradient-to-r from-amber-400 to-orange-400",
      glowColor: "rgba(245,158,11,0.04)",
      pingColor: "bg-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shadow-amber-500/10",
      pill: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/40",
      dot: "bg-amber-500",
      priceGradient: "from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-400",
    },
    quoted: {
      gradient: "bg-gradient-to-r from-cyan-400 to-blue-400",
      glowColor: "rgba(6,182,212,0.04)",
      pingColor: "bg-cyan-400",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 shadow-cyan-500/10",
      pill: "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 border-cyan-200/60 dark:border-cyan-800/40",
      dot: "bg-cyan-500",
      priceGradient: "from-cyan-600 to-blue-500 dark:from-cyan-400 dark:to-blue-400",
    },
    paid: {
      gradient: "bg-gradient-to-r from-emerald-400 to-green-400",
      glowColor: "rgba(16,185,129,0.04)",
      pingColor: "bg-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10",
      pill: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40",
      dot: "bg-emerald-500",
      priceGradient: "from-emerald-600 to-green-500 dark:from-emerald-400 dark:to-green-400",
    },
    in_progress: {
      gradient: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
      glowColor: "rgba(139,92,246,0.05)",
      pingColor: "bg-violet-400",
      iconBg: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 shadow-violet-500/10",
      pill: "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/40",
      dot: "bg-violet-500",
      priceGradient: "from-violet-600 to-fuchsia-500 dark:from-violet-400 dark:to-fuchsia-400",
    },
    shipped: {
      gradient: "bg-gradient-to-r from-blue-400 to-indigo-400",
      glowColor: "rgba(59,130,246,0.04)",
      pingColor: "bg-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-blue-500/10",
      pill: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40",
      dot: "bg-blue-500",
      priceGradient: "from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400",
    },
    delivered: {
      gradient: "bg-gradient-to-r from-green-400 to-emerald-400",
      glowColor: "rgba(34,197,94,0.04)",
      pingColor: "bg-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-green-500/10",
      pill: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200/60 dark:border-green-800/40",
      dot: "bg-green-500",
      priceGradient: "from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-400",
    },
    cancelled: {
      gradient: "bg-gradient-to-r from-red-400 to-rose-400",
      glowColor: "rgba(239,68,68,0.04)",
      pingColor: "bg-red-400",
      iconBg: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 shadow-red-500/10",
      pill: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-800/40",
      dot: "bg-red-500",
      priceGradient: "from-red-600 to-rose-500 dark:from-red-400 dark:to-rose-400",
    },
  };
  return (
    map[status] || {
      gradient: "bg-gradient-to-r from-gray-300 to-gray-400",
      glowColor: "rgba(156,163,175,0.04)",
      pingColor: "bg-gray-400",
      iconBg: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
      pill: "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700",
      dot: "bg-gray-400",
      priceGradient: "from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-400",
    }
  );
}

function getStatusIcon(status: string) {
  const cls = "w-6 h-6";
  switch (status) {
    case "pending": return <Clock className={cls} />;
    case "quoted": return <IndianRupee className={cls} />;
    case "paid": return <CheckCircle2 className={cls} />;
    case "in_progress": return <Package className={cn(cls, "animate-pulse")} />;
    case "shipped": return <Truck className={cls} />;
    case "delivered": return <CheckCircle2 className={cls} />;
    default: return <AlertCircle className={cls} />;
  }
}