"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Package,
  Clock,
  ArrowUpRight,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ShoppingBag,
  IndianRupee,
  Sparkles,
  Eye,
  X,
  MapPin,
  Phone,
  CreditCard,
  ArrowRight,
} from "lucide-react";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const FILTER_OPTIONS = ["all", ...STATUS_OPTIONS] as const;

import {
  getAdminOrdersAction,
  updateOrderStatusAction,
  updateOrderTrackingAction,
} from "@/actions/admin_orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setTrackingNumber(selectedOrder.tracking_number || "");
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      const response = await getAdminOrdersAction();
      if (response.success) {
        setOrders(response.data || []);
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const updateStatus = async (orderId: string, status: string) => {
    if (!orderId) return;
    setUpdatingId(orderId);
    try {
      const response = await updateOrderStatusAction(orderId, status);

      if (response.error) {
        throw new Error(response.error);
      }
      toast.success("Order status updated!");
      await fetchOrders();
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder || !trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    setIsUpdatingTracking(true);
    try {
      const response = await updateOrderTrackingAction(
        selectedOrder.id,
        trackingNumber.trim(),
        "INDIA_POST",
        "shipped", // Automatically mark as shipped
      );

      if (response.success) {
        toast.success(
          "Tracking information updated & order marked as shipped!",
        );
        await fetchOrders();
        // Update local state to reflect changes in modal
        setSelectedOrder({
          ...selectedOrder,
          tracking_number: trackingNumber.trim(),
          courier: "INDIA_POST",
          status: "shipped" as any,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      console.error("Error updating tracking:", error);
      toast.error(error.message || "Failed to update tracking");
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  // Filter & search
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      (order.order_number?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      );

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; dot: string; icon: any }> = {
      pending: {
        bg: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700/50 dark:text-amber-400",
        dot: "bg-amber-500",
        icon: Clock,
      },
      confirmed: {
        bg: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700/50 dark:text-blue-400",
        dot: "bg-blue-500",
        icon: CheckCircle2,
      },
      processing: {
        bg: "bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-900/30 dark:border-violet-700/50 dark:text-violet-400",
        dot: "bg-violet-500 animate-pulse",
        icon: Loader2,
      },
      shipped: {
        bg: "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700/50 dark:text-indigo-400",
        dot: "bg-indigo-500 animate-pulse",
        icon: Truck,
      },
      delivered: {
        bg: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-400",
        dot: "bg-emerald-500",
        icon: CheckCircle2,
      },
      cancelled: {
        bg: "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-400",
        dot: "bg-red-500",
        icon: XCircle,
      },
    };
    return styles[status] || styles.pending;
  };

  const getPaymentStyle = (status: string) => {
    return status === "paid"
      ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-400"
      : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700/50 dark:text-amber-400";
  };

  const getPaymentDot = (status: string) => {
    return status === "paid" ? "bg-emerald-500" : "bg-amber-500 animate-pulse";
  };

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div
            className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 
              flex items-center justify-center shadow-lg shadow-violet-500/20 animate-pulse"
          >
            <Package className="w-6 h-6 text-white" />
          </div>
          <div
            className="absolute -inset-2 rounded-2xl border-2 border-violet-200 
              dark:border-violet-800 animate-ping opacity-20"
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading orders...
          </p>
          <div className="flex gap-1 justify-center mt-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* ── Background blobs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full 
            bg-violet-200/20 dark:bg-violet-800/10 blur-3xl"
        />
        <div
          className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full 
            bg-pink-200/20 dark:bg-pink-800/10 blur-3xl"
        />
      </div>

      {/* ══════════════════════════════════════════
          HEADER
         ══════════════════════════════════════════ */}
      <div
        className="mb-6 animate-fade-in-down"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Orders
              </h1>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 
                  text-[11px] font-semibold border
                  bg-violet-50 border-violet-200 text-violet-600
                  dark:bg-violet-900/30 dark:border-violet-700/50 dark:text-violet-400"
              >
                <Sparkles className="w-3 h-3" />
                {orders.length} total
              </span>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Manage and track all customer orders
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              border transition-all duration-300
              bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300
              dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-750
              disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-md"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MINI STAT CARDS
         ══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Revenue",
            value: formatPrice(totalRevenue),
            icon: IndianRupee,
            color: "from-emerald-500 to-teal-500",
            iconBg:
              "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
          },
          {
            label: "Pending",
            value: pendingCount,
            icon: Clock,
            color: "from-amber-500 to-orange-500",
            iconBg:
              "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
          },
          {
            label: "Shipped",
            value: shippedCount,
            icon: Truck,
            color: "from-indigo-500 to-violet-500",
            iconBg:
              "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
          },
          {
            label: "Delivered",
            value: deliveredCount,
            icon: CheckCircle2,
            color: "from-emerald-500 to-green-500",
            iconBg:
              "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="stat-card group relative overflow-hidden rounded-2xl p-4
              shadow-sm border animate-fade-in-up
              bg-white border-gray-100/60
              dark:bg-gray-900 dark:border-gray-800"
            style={{ animationDelay: `${80 + i * 80}ms` }}
          >
            <div
              className={`absolute inset-x-0 top-0 h-0.5 bg-linear-to-r ${stat.color} 
                opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
            />
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg 
                  ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          SEARCH & FILTER BAR
         ══════════════════════════════════════════ */}
      <div
        className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in-up"
        style={{ animationDelay: "350ms" }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 
              text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border 
              transition-all duration-300
              bg-white border-gray-200 text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
              dark:bg-gray-900 dark:border-gray-700 dark:text-white 
              dark:placeholder:text-gray-500
              dark:focus:ring-violet-800 dark:focus:border-violet-600"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <Filter
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 
              text-gray-400 dark:text-gray-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-10 pr-10 py-2.5 rounded-xl text-sm border 
              transition-all duration-300 capitalize cursor-pointer
              bg-white border-gray-200 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
              dark:bg-gray-900 dark:border-gray-700 dark:text-white
              dark:focus:ring-violet-800 dark:focus:border-violet-600"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="capitalize">
                {opt === "all" ? "All Statuses" : opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 
              text-gray-400 dark:text-gray-500 pointer-events-none"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ORDERS TABLE
         ══════════════════════════════════════════ */}
      <div
        className="animate-fade-in-up rounded-2xl shadow-sm border overflow-hidden
          bg-white border-gray-100/60
          dark:bg-gray-900 dark:border-gray-800"
        style={{ animationDelay: "450ms" }}
      >
        {/* Table header bar */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b
            border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl 
                bg-linear-to-br from-violet-500 to-purple-600 
                shadow-lg shadow-violet-500/20 dark:shadow-violet-500/10"
            >
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-gray-900 dark:text-white">
                All Orders
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {filteredOrders.length} order
                {filteredOrders.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping 
                  rounded-full bg-emerald-400 opacity-75"
              />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Live
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto premium-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/60 dark:bg-gray-800/40">
                {[
                  "Order",
                  "Date",
                  "Items",
                  "Total",
                  "Payment",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-6 text-left text-[11px] font-bold uppercase 
                      tracking-wider text-gray-400 dark:text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => {
                  const s = getStatusStyle(order.status);
                  const StatusIcon = s.icon;

                  return (
                    <tr
                      key={`${order.id}-${idx}`}
                      onClick={() => setSelectedOrder(order)}
                      className="order-row group border-b
                        border-gray-50 dark:border-gray-800/60 
                        animate-table-row cursor-pointer hover:bg-gray-50/50 
                        dark:hover:bg-gray-800/30 transition-colors"
                      style={{ animationDelay: `${550 + idx * 60}ms` }}
                    >
                      {/* Order number */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg 
                              bg-linear-to-br from-violet-500 to-purple-600 
                              text-[10px] font-bold text-white shadow-sm 
                              group-hover:scale-110 transition-transform duration-300"
                          >
                            #{idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                              {(order.shipping_address as any)?.name ||
                                "Customer"}
                            </p>
                            <p className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
                              {order.order_number}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                      </td>

                      {/* Items count */}
                      <td className="py-4 px-6">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-medium
                            text-gray-600 dark:text-gray-400"
                        >
                          <Package className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                          {Array.isArray(order.items) ? order.items.length : 0}{" "}
                          items
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatPrice(order.total)}
                        </span>
                      </td>

                      {/* Payment badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold 
                            px-2.5 py-1 rounded-full border capitalize
                            ${getPaymentStyle(order.payment_status)}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getPaymentDot(
                              order.payment_status,
                            )}`}
                          />
                          {order.payment_status}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold 
                            px-2.5 py-1 rounded-full border capitalize ${s.bg}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${s.dot}`}
                          />
                          {order.status}
                        </span>
                      </td>

                      {/* Action dropdown */}
                      <td className="py-4 px-6">
                        <div
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {updatingId === order.id && (
                            <div className="absolute -left-6 top-1/2 -translate-y-1/2">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500" />
                            </div>
                          )}
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateStatus(order.id, e.target.value)
                            }
                            disabled={updatingId === order.id}
                            className="appearance-none text-xs font-medium px-3 py-2 pr-8 
                              rounded-xl border cursor-pointer
                              transition-all duration-300
                              bg-white border-gray-200 text-gray-700
                              hover:border-violet-300 hover:bg-violet-50
                              focus:outline-none focus:ring-2 focus:ring-violet-200 
                              focus:border-violet-400
                              dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300
                              dark:hover:border-violet-600 dark:hover:bg-violet-900/20
                              dark:focus:ring-violet-800 dark:focus:border-violet-600
                              disabled:opacity-50 disabled:cursor-wait
                              capitalize"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option
                                key={s}
                                value={s}
                                className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 capitalize"
                              >
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 
                              text-gray-400 dark:text-gray-500 pointer-events-none"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Empty state */
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl
                          bg-gray-50 dark:bg-gray-800"
                      >
                        {searchQuery || statusFilter !== "all" ? (
                          <AlertCircle className="h-7 w-7 text-gray-300 dark:text-gray-600" />
                        ) : (
                          <ShoppingBag className="h-7 w-7 text-gray-300 dark:text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                          {searchQuery || statusFilter !== "all"
                            ? "No orders match your filters"
                            : "No orders yet"}
                        </p>
                        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                          {searchQuery || statusFilter !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "Orders will appear here once customers start purchasing"}
                        </p>
                      </div>
                      {(searchQuery || statusFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                          }}
                          className="text-xs font-semibold text-violet-600 dark:text-violet-400 
                            hover:text-violet-700 dark:hover:text-violet-300
                            px-4 py-2 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20
                            transition-all duration-300"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {filteredOrders.length > 0 && (
          <div
            className="flex items-center justify-between px-6 py-3.5 border-t
              border-gray-100 bg-gray-50/40
              dark:border-gray-800 dark:bg-gray-800/30"
          >
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {filteredOrders.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {orders.length}
              </span>{" "}
              orders
            </p>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                      d === 0 ? "bg-violet-500" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* ══════════════════════════════════════════
          ORDER DETAILS MODAL
         ══════════════════════════════════════════ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />

          {/* Sidebar */}
          <div className="relative w-full max-w-2xl h-full bg-white dark:bg-gray-900 shadow-2xl animate-slide-in-right overflow-y-auto premium-scroll">
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Order Details
                  <span className="text-sm font-mono font-normal text-gray-400">
                    {selectedOrder.order_number}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Placed on {formatDate(selectedOrder.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Status Header */}
              <div className="flex flex-wrap gap-4 items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusStyle(selectedOrder.status).bg}`}
                  >
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Order Status
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                      {selectedOrder.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${getPaymentStyle(selectedOrder.payment_status)}`}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Payment
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                      {selectedOrder.payment_status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-violet-500" />
                    Shipping Address
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <p className="font-bold text-gray-900 dark:text-white text-base mb-1">
                      {selectedOrder.shipping_address?.name}
                    </p>
                    {selectedOrder.shipping_address?.phone && (
                      <p className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-medium mb-3">
                        <Phone className="w-3.5 h-3.5" />
                        {selectedOrder.shipping_address.phone}
                      </p>
                    )}
                    <p>{selectedOrder.shipping_address?.line1}</p>
                    {selectedOrder.shipping_address?.line2 && (
                      <p>{selectedOrder.shipping_address.line2}</p>
                    )}
                    <p>
                      {selectedOrder.shipping_address?.city},{" "}
                      {selectedOrder.shipping_address?.state}
                    </p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">
                      {selectedOrder.shipping_address?.postal_code ||
                        selectedOrder.shipping_address?.pincode}
                    </p>
                    <p>{selectedOrder.shipping_address?.country}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-violet-500" />
                    Order Summary
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatPrice(
                          selectedOrder.subtotal ||
                            selectedOrder.total -
                              (selectedOrder.shipping_fee || 0),
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatPrice(selectedOrder.shipping_fee || 0)}
                      </span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span>Discount</span>
                        <span>-{formatPrice(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                      <span className="font-bold text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="font-bold text-xl text-violet-600 dark:text-violet-400">
                        {formatPrice(selectedOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipment Tracking Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-violet-500" />
                  Shipment Tracking
                </h3>
                <div className="bg-violet-50/50 dark:bg-violet-900/10 p-6 rounded-2xl border border-violet-100 dark:border-violet-900/30 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        Tracking Number (India Post)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. EW123456789IN"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border 
                          bg-white dark:bg-gray-900 border-violet-200 dark:border-violet-800
                          focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
                          transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        Courier
                      </label>
                      <div className="px-4 py-2.5 rounded-xl text-sm border bg-gray-100/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 font-medium">
                        India Post (Speed Post)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      Updating tracking will mark the order as{" "}
                      <span className="font-bold text-indigo-600">Shipped</span>
                    </p>
                    <button
                      onClick={handleUpdateTracking}
                      disabled={
                        isUpdatingTracking ||
                        !trackingNumber.trim() ||
                        trackingNumber === selectedOrder?.tracking_number
                      }
                      className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold 
                        hover:bg-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center gap-2 shadow-lg shadow-violet-600/20"
                    >
                      {isUpdatingTracking ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4" />
                          Update Tracking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
                  Ordered Items ({selectedOrder.items.length})
                  <span className="text-[10px] font-normal text-gray-400 italic">
                    Scroll for more
                  </span>
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-900/50 transition-colors group"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 shrink-0">
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=100"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/50">
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                    Customer Note
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-200 italic">
                    &ldquo;{selectedOrder.notes}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 p-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
