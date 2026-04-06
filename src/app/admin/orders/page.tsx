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
  updateOrderStatusAction 
} from "@/actions/admin_orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAdminOrdersAction();
      if (response.data) setOrders(response.data);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
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


  // Filter & search
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      (order.order_number?.toLowerCase() || "").includes(searchQuery.toLowerCase());

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
    <div className="min-h-screen relative overflow-hidden">
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
                      className="order-row group border-b
                        border-gray-50 dark:border-gray-800/60 
                        animate-table-row"
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
                          <p
                            className="font-mono text-xs font-semibold 
                              text-gray-800 dark:text-gray-200"
                          >
                            {order.order_number}
                          </p>
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
                          {Array.isArray(order.items) ? order.items.length : 0} items
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
                        <div className="relative">
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
                              <option key={s} value={s} className="capitalize">
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
    </div>
  );
}
