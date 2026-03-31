"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CustomOrder } from "@/types";
import { formatDate, formatPrice, getStatusColor } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Palette,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Sparkles,
  Package,
  ChevronDown,
  Image as ImageIcon,
  MessageSquare,
  Loader2,
  Inbox,
} from "lucide-react";

const statusConfig: Record<
  string,
  {
    icon: React.ElementType;
    gradient: string;
    bg: string;
    text: string;
    border: string;
  }
> = {
  pending: {
    icon: Clock,
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  reviewing: {
    icon: Eye,
    gradient: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  quoted: {
    icon: DollarSign,
    gradient: "from-cyan-500 to-teal-500",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  accepted: {
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-green-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  in_progress: {
    icon: Loader2,
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  completed: {
    icon: CheckCircle2,
    gradient: "from-green-500 to-emerald-600",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  cancelled: {
    icon: XCircle,
    gradient: "from-red-500 to-rose-500",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

const allStatuses = [
  "pending",
  "reviewing",
  "quoted",
  "accepted",
  "in_progress",
  "completed",
  "cancelled",
];

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedImages, setExpandedImages] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("custom_orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("custom_orders")
      .update({ status })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Status updated!");
      fetchOrders();
    }
    setUpdatingId(null);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProgress: orders.filter((o) =>
      ["reviewing", "quoted", "accepted", "in_progress"].includes(o.status),
    ).length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  return (
    <div className="relative">
      {/* Ambient blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-32 right-1/4 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />
      </div>

      {/* Header */}
      <div
        className="flex items-center gap-3 mb-8"
        style={{ animation: "fadeInDown 0.5s ease-out" }}
      >
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-gray-900 via-violet-900 to-purple-900 bg-clip-text text-transparent">
            Custom Orders
          </h1>
          <p className="text-sm text-gray-500">
            {stats.total} total &middot; {stats.pending} pending &middot;{" "}
            {stats.inProgress} active
          </p>
        </div>
      </div>

      {/* Stat Pills */}
      <div
        className="flex flex-wrap gap-3 mb-8"
        style={{ animation: "fadeInUp 0.5s ease-out 0.1s both" }}
      >
        {[
          {
            label: "Total",
            value: stats.total,
            icon: Package,
            color: "from-indigo-500 to-blue-500",
            bg: "bg-indigo-50",
            text: "text-indigo-700",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "from-amber-500 to-orange-500",
            bg: "bg-amber-50",
            text: "text-amber-700",
          },
          {
            label: "Active",
            value: stats.inProgress,
            icon: Loader2,
            color: "from-violet-500 to-purple-500",
            bg: "bg-violet-50",
            text: "text-violet-700",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle2,
            color: "from-emerald-500 to-green-500",
            bg: "bg-emerald-50",
            text: "text-emerald-700",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`group relative ${stat.bg} border border-white/60 rounded-xl px-4 py-2.5 flex items-center gap-2.5 hover:scale-105 hover:shadow-md transition-all duration-300 cursor-default`}
          >
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className={`text-lg font-bold ${stat.text}`}>{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold -mt-0.5">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div
          className="flex flex-col items-center justify-center py-20"
          style={{ animation: "fadeInUp 0.4s ease-out" }}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4">
            <Loader2 className="w-6 h-6 text-violet-500 animate-spin" />
          </div>
          <p className="text-gray-500 text-sm">Loading custom orders...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60"
          style={{ animation: "fadeInUp 0.5s ease-out" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4 animate-bounce [animation-duration:3s]">
            <Inbox className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-gray-900 font-semibold text-lg mb-1">
            No custom orders yet
          </p>
          <p className="text-gray-500 text-sm">
            Orders will appear here when customers submit them.
          </p>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order, index) => {
          const config = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = config.icon;
          const isUpdating = updatingId === order.id;
          const hasImages = order.reference_images?.length > 0;
          const isImagesExpanded = expandedImages === order.id;

          return (
            <div
              key={order.id}
              className="group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500 overflow-hidden"
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.06}s both`,
              }}
            >
              {/* Status accent bar */}
              <div
                className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${config.gradient} rounded-l-2xl opacity-80`}
              />

              <div className="p-6 pl-7">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Status icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.bg} ${config.border} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <StatusIcon
                        className={`w-4.5 h-4.5 ${config.text} ${order.status === "in_progress" ? "animate-spin [animation-duration:3s]" : ""}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold text-gray-900 group-hover:text-violet-700 transition-colors duration-200 truncate">
                        {order.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-400">
                          {formatDate(order.created_at)}
                        </p>
                        <span className="text-gray-300">&middot;</span>
                        <p className="text-xs text-gray-400 font-mono">
                          {order.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status select */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`relative ${config.bg} ${config.border} border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md ${isUpdating ? "opacity-60 pointer-events-none" : ""}`}
                    >
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`appearance-none bg-transparent pl-3 pr-8 py-2 text-xs font-semibold ${config.text} capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded-xl`}
                      >
                        {allStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${config.text} pointer-events-none`}
                      />
                    </div>
                    {isUpdating && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="flex items-start gap-2 mb-4">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-300 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {order.description}
                  </p>
                </div>

                {/* Meta tags */}
                <div className="flex flex-wrap gap-2 mb-1">
                  {order.preferred_colors && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-50 to-fuchsia-50 border border-pink-200/50 rounded-lg text-xs font-medium text-pink-700">
                      <Palette className="w-3 h-3" />
                      {order.preferred_colors}
                    </span>
                  )}
                  {order.budget_min && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-lg text-xs font-medium text-emerald-700">
                      <DollarSign className="w-3 h-3" />
                      {formatPrice(order.budget_min)} –{" "}
                      {formatPrice(order.budget_max || 0)}
                    </span>
                  )}
                  {hasImages && (
                    <button
                      onClick={() =>
                        setExpandedImages(isImagesExpanded ? null : order.id)
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-lg text-xs font-medium text-blue-700 hover:shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer"
                    >
                      <ImageIcon className="w-3 h-3" />
                      {order.reference_images.length} reference
                      {order.reference_images.length !== 1 && "s"}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 ${isImagesExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {/* Reference images (expandable) */}
                {hasImages && isImagesExpanded && (
                  <div
                    className="flex gap-3 mt-4 pt-4 border-t border-gray-100 overflow-x-auto pb-1"
                    style={{ animation: "fadeInUp 0.3s ease-out" }}
                  >
                    {order.reference_images.map((img: string, i: number) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border-2 border-white shadow-md hover:shadow-xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/img"
                        style={{
                          animation: `fadeInUp 0.3s ease-out ${i * 0.08}s both`,
                        }}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom gradient line on hover */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
            </div>
          );
        })}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
