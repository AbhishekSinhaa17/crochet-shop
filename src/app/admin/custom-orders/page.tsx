"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CustomOrder } from "@/types";
import { formatDate, formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Palette,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  Package,
  ChevronDown,
  Image as ImageIcon,
  MessageSquare,
  Loader2,
  Inbox,
  Zap,
  TrendingUp,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
  Copy,
  RefreshCw,
  IndianRupee,
  Send,
  X,
} from "lucide-react";

const statusConfig: Record<
  string,
  {
    icon: React.ElementType;
    gradient: string;
    bg: string;
    text: string;
    border: string;
    glow: string;
    darkBg: string;
    darkText: string;
    darkBorder: string;
  }
> = {
  pending: {
    icon: Clock,
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    glow: "shadow-amber-500/20",
    darkBg: "dark:bg-amber-500/10",
    darkText: "dark:text-amber-400",
    darkBorder: "dark:border-amber-500/30",
  },
  reviewing: {
    icon: Eye,
    gradient: "from-blue-500 via-indigo-500 to-cyan-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    glow: "shadow-blue-500/20",
    darkBg: "dark:bg-blue-500/10",
    darkText: "dark:text-blue-400",
    darkBorder: "dark:border-blue-500/30",
  },
  quoted: {
    icon: IndianRupee,
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    glow: "shadow-cyan-500/20",
    darkBg: "dark:bg-cyan-500/10",
    darkText: "dark:text-cyan-400",
    darkBorder: "dark:border-cyan-500/30",
  },
  accepted: {
    icon: CheckCircle2,
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    glow: "shadow-emerald-500/20",
    darkBg: "dark:bg-emerald-500/10",
    darkText: "dark:text-emerald-400",
    darkBorder: "dark:border-emerald-500/30",
  },
  in_progress: {
    icon: Zap,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    glow: "shadow-violet-500/20",
    darkBg: "dark:bg-violet-500/10",
    darkText: "dark:text-violet-400",
    darkBorder: "dark:border-violet-500/30",
  },
  completed: {
    icon: CheckCircle2,
    gradient: "from-green-500 via-emerald-500 to-teal-600",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    glow: "shadow-green-500/20",
    darkBg: "dark:bg-green-500/10",
    darkText: "dark:text-green-400",
    darkBorder: "dark:border-green-500/30",
  },
  cancelled: {
    icon: XCircle,
    gradient: "from-red-500 via-rose-500 to-pink-500",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    glow: "shadow-red-500/20",
    darkBg: "dark:bg-red-500/10",
    darkText: "dark:text-red-400",
    darkBorder: "dark:border-red-500/30",
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

import { 
  getAdminCustomOrdersAction, 
  updateCustomOrderStatusAction, 
  sendAdminOrderReplyAction 
} from "@/actions/admin_custom_orders";

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedImages, setExpandedImages] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [replyingOrder, setReplyingOrder] = useState<CustomOrder | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAdminCustomOrdersAction();
      if (response.data) setOrders(response.data);
    } catch (error: any) {
      console.error("Error fetching custom orders:", error);
      toast.error("Failed to load custom orders");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setTimeout(() => setIsRefreshing(false), 600);
    toast.success("Orders refreshed!");
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const response = await updateCustomOrderStatusAction(id, status);
      if (response.error) toast.error(response.error);
      else {
        toast.success("Status updated!");
        fetchOrders();
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied!");
  };

  const handleSendReply = async () => {
    if (!replyingOrder || !replyText.trim()) return;
    setIsSendingReply(true);

    try {
      const response = await sendAdminOrderReplyAction(replyingOrder.user_id, replyText.trim());
      
      if (response.error) throw new Error(response.error);

      toast.success("Message sent to customer!");
      setReplyingOrder(null);
      setReplyText("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSendingReply(false);
    }
  };


  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (order.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (order.id?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    inProgress: orders.filter((o) =>
      ["reviewing", "quoted", "accepted", "in_progress"].includes(o.status)
    ).length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Light mode gradients */}
        <div className="dark:opacity-0 opacity-100 transition-opacity duration-500">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-linear-to-br from-violet-200/50 via-purple-200/50 to-fuchsia-200/50 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-linear-to-br from-blue-200/40 via-cyan-200/40 to-teal-200/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 right-1/4 w-[450px] h-[450px] bg-linear-to-br from-amber-200/30 via-orange-200/30 to-rose-200/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-br from-pink-100/20 via-purple-100/20 to-indigo-100/20 rounded-full blur-3xl" />
        </div>
        {/* Dark mode gradients */}
        <div className="dark:opacity-100 opacity-0 transition-opacity duration-500">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-linear-to-br from-violet-900/30 via-purple-900/20 to-fuchsia-900/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-linear-to-br from-blue-900/20 via-cyan-900/20 to-teal-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 right-1/4 w-[450px] h-[450px] bg-linear-to-br from-amber-900/20 via-orange-900/20 to-rose-900/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px]" />
      </div>

      {/* Header Section */}
      <div className="relative mb-8 animate-fade-in-down">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-br from-violet-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow" />
              <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-2xl shadow-violet-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Sparkles className="w-7 h-7 text-white animate-sparkle" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-linear-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white dark:border-gray-900 animate-bounce shadow-lg shadow-amber-500/50" />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold bg-linear-to-r from-gray-900 via-violet-800 to-purple-900 dark:from-white dark:via-violet-200 dark:to-purple-200 bg-clip-text text-transparent animate-gradient-x">
                Custom Orders
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {stats.inProgress} active
                  </span>
                </span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>{stats.total} total orders</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="group relative px-4 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-600 dark:text-gray-300 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-violet-500/10"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        style={{ animationDelay: "100ms" }}
      >
        {[
          {
            label: "Total Orders",
            value: stats.total,
            icon: Package,
            gradient: "from-indigo-500 via-blue-500 to-cyan-500",
            bg: "bg-indigo-50 dark:bg-indigo-500/10",
            iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
            text: "text-indigo-600 dark:text-indigo-400",
            change: "+12%",
            changeType: "up",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            gradient: "from-amber-500 via-orange-500 to-yellow-500",
            bg: "bg-amber-50 dark:bg-amber-500/10",
            iconBg: "bg-amber-100 dark:bg-amber-500/20",
            text: "text-amber-600 dark:text-amber-400",
            change: "3 new",
            changeType: "neutral",
          },
          {
            label: "In Progress",
            value: stats.inProgress,
            icon: Zap,
            gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
            bg: "bg-violet-50 dark:bg-violet-500/10",
            iconBg: "bg-violet-100 dark:bg-violet-500/20",
            text: "text-violet-600 dark:text-violet-400",
            change: "Active",
            changeType: "active",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle2,
            gradient: "from-emerald-500 via-green-500 to-teal-500",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
            text: "text-emerald-600 dark:text-emerald-400",
            change: "+8%",
            changeType: "up",
          },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="group relative animate-fade-in-up"
            style={{ animationDelay: `${150 + index * 50}ms` }}
          >
            {/* Glow effect on hover */}
            <div
              className={`absolute inset-0 bg-linear-to-r ${stat.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
            />

            <div
              className={`relative ${stat.bg} backdrop-blur-xl border border-white/60 dark:border-gray-700/50 rounded-2xl p-5 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 cursor-default overflow-hidden`}
            >
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/40 to-transparent dark:from-white/5 rounded-full -translate-y-16 translate-x-16" />

              <div className="relative flex items-start justify-between">
                <div>
                  <div
                    className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.text}`} />
                  </div>
                  <p
                    className={`text-3xl font-bold ${stat.text} tracking-tight`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    stat.changeType === "up"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : stat.changeType === "active"
                        ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400 animate-pulse"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>

              {/* Decorative gradient line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div
        className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in-up"
        style={{ animationDelay: "200ms" }}
      >
        {/* Search */}
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-linear-to-r from-violet-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-violet-500 transition-colors duration-200" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders by title, description, or ID..."
              className="w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-violet-300 dark:focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300"
            />
          </div>
        </div>

        {/* Filter */}
        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-sm text-gray-700 dark:text-gray-300 font-medium focus:outline-none cursor-pointer appearance-none pr-6"
            >
              <option value="all">All Status</option>
              {allStatuses.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 -ml-4" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4 animate-fade-in-up">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-gray-700/50 p-6 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && (
        <div className="animate-fade-in-up">
          <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-gray-700/50 p-12 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 via-transparent to-purple-500/5" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-linear-to-br from-violet-200/30 to-purple-200/30 dark:from-violet-500/10 dark:to-purple-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 mb-6 animate-float">
                <Inbox className="w-9 h-9 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {searchQuery || filterStatus !== "all"
                  ? "No orders found"
                  : "No custom orders yet"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "When customers submit custom order requests, they'll appear here for you to manage."}
              </p>
              {(searchQuery || filterStatus !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                  }}
                  className="mt-6 px-6 py-2.5 bg-linear-to-r from-violet-500 to-purple-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-violet-500/25 hover:scale-105 transition-all duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const config = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = config.icon;
          const isUpdating = updatingId === order.id;
          const hasImages = order.reference_images?.length > 0;
          const isImagesExpanded = expandedImages === order.id;

          return (
            <div
              key={`${order.id}-${index}`}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${250 + index * 60}ms` }}
            >
              {/* Card glow effect */}
              <div
                className={`absolute inset-0 bg-linear-to-r ${config.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
              />

              <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-gray-700/50 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 transition-all duration-500 overflow-hidden group-hover:-translate-y-1">
                {/* Status accent bar */}
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full bg-linear-to-b ${config.gradient} rounded-l-2xl`}
                />

                {/* Animated shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <div className="relative p-6 pl-8">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Status icon */}
                      <div className="relative">
                        <div
                          className={`absolute inset-0 bg-linear-to-br ${config.gradient} rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500`}
                        />
                        <div
                          className={`relative w-12 h-12 rounded-xl ${config.bg} ${config.darkBg} ${config.border} ${config.darkBorder} border-2 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${config.glow} shadow-lg`}
                        >
                          <StatusIcon
                            className={`w-5 h-5 ${config.text} ${config.darkText} ${order.status === "in_progress" ? "animate-pulse" : ""}`}
                          />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors duration-300 truncate">
                            {order.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(order.created_at)}</span>
                          </div>
                          <button
                            onClick={() => copyOrderId(order.id)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors duration-200 group/copy"
                          >
                            <span className="font-mono bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded">
                              #{order.id.slice(0, 8)}
                            </span>
                            <Copy className="w-3 h-3 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Status select & actions */}
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div
                          className={`relative ${config.bg} ${config.darkBg} ${config.border} ${config.darkBorder} border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${config.glow} ${isUpdating ? "opacity-60 pointer-events-none" : ""}`}
                        >
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(order.id, e.target.value)
                            }
                            className={`appearance-none bg-transparent pl-4 pr-10 py-2.5 text-xs font-bold ${config.text} ${config.darkText} uppercase tracking-wide cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded-xl`}
                          >
                            {allStatuses.map((s) => (
                              <option key={s} value={s}>
                                {s.replace("_", " ")}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${config.text} ${config.darkText} pointer-events-none`}
                          />
                        </div>
                        {isUpdating && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
                            <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveMenuId(
                                activeMenuId === order.id ? null : order.id
                              )
                            }
                            className="p-2.5 bg-gray-100/50 dark:bg-gray-700/50 rounded-xl text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          {activeMenuId === order.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
                                <button
                                  onClick={() => {
                                    setReplyingOrder(order);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Reply to Customer
                                </button>
                                <button
                                  onClick={() => {
                                    copyOrderId(order.id);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Order ID
                                </button>
                                <div className="mx-2 my-1 border-t border-gray-100 dark:border-gray-700" />
                                <button
                                  onClick={() => {
                                    /* Any other action */
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                  Close Details
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Description */}
                  <div className="flex items-start gap-3 mb-5 p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-100/50 dark:border-gray-700/30">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {order.description}
                    </p>
                  </div>

                  {/* Meta tags */}
                  <div className="flex flex-wrap gap-2">
                    {order.preferred_colors && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-pink-50 to-fuchsia-50 dark:from-pink-500/10 dark:to-fuchsia-500/10 border border-pink-200/50 dark:border-pink-500/30 rounded-xl text-xs font-semibold text-pink-700 dark:text-pink-400 hover:scale-105 transition-transform duration-200">
                        <Palette className="w-3.5 h-3.5" />
                        {order.preferred_colors}
                      </span>
                    )}

                    {order.budget_min && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-200/50 dark:border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:scale-105 transition-transform duration-200">
                        {/* No DollarSign icon needed, formatPrice adds ₹ */}
                        {formatPrice(order.budget_min)} –{" "}
                        {formatPrice(order.budget_max || 0)}
                      </span>
                    )}

                    {hasImages && (
                      <button
                        onClick={() =>
                          setExpandedImages(isImagesExpanded ? null : order.id)
                        }
                        className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200/50 dark:border-blue-500/30 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-400 hover:shadow-md hover:scale-105 transition-all duration-200"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        {order.reference_images.length} reference
                        {order.reference_images.length !== 1 && "s"}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${isImagesExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Reference images */}
                  {hasImages && isImagesExpanded && (
                    <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700/50 animate-accordion-down">
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                        {order.reference_images.map(
                          (img: string, i: number) => (
                            <div
                              key={i}
                              className="shrink-0 relative group/img animate-fade-in-up"
                              style={{ animationDelay: `${i * 80}ms` }}
                            >
                              <div className="absolute inset-0 bg-linear-to-br from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />
                              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-600 shadow-lg hover:shadow-2xl hover:scale-110 hover:-translate-y-2 hover:rotate-2 transition-all duration-500 cursor-pointer">
                                <img
                                  src={img}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                                  <ExternalLink className="w-5 h-5 text-white drop-shadow-lg" />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom gradient line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Modal */}
      {replyingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-fade-in"
            onClick={() => !isSendingReply && setReplyingOrder(null)}
          />
          <div
            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-white/60 dark:border-gray-700/50 overflow-hidden animate-zoom-in"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between bg-linear-to-r from-violet-500/5 to-purple-500/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Reply to Customer
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Order: {replyingOrder.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReplyingOrder(null)}
                disabled={isSendingReply}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider text-[10px]">
                  Customer Request
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 italic">
                  "{replyingOrder.description}"
                </p>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your message here..."
                rows={5}
                className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700/50 flex justify-end gap-3">
              <button
                onClick={() => setReplyingOrder(null)}
                disabled={isSendingReply}
                className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={isSendingReply || !replyText.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-linear-to-r from-violet-600 to-purple-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all"
              >
                {isSendingReply ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSendingReply ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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
            transform: translate(30px, 20px) scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.1) rotate(5deg);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes accordion-down {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
        }

        .animate-blob {
          animation: blob 12s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 4s ease infinite;
        }

        .animate-accordion-down {
          animation: accordion-down 0.3s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thumb-gray-200::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 3px;
        }

        .dark .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
          background: #374151;
        }
      `}</style>
    </div>
  );
}