"use client";

import { useState, useEffect } from "react";
import { formatPrice, formatDate } from "@/lib/utils";
import { CustomOrder } from "@/types";
import {
  Clock,
  Package,
  IndianRupee,
  RefreshCcw,
  Search,
  Filter,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Truck,
  Image as ImageIcon,
  MapPin,
  Phone,
  X,
  CreditCard,
  MessageSquare,
  StickyNote,
  Edit,
  Eye,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAdminCustomOrdersAction,
  updateCustomOrderStatusAction,
  sendAdminOrderReplyAction,
} from "@/actions/admin_custom_orders";

const FILTER_OPTIONS = [
  "all",
  "pending",
  "quoted",
  "paid",
  "in_progress",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);

  // Modal Actions States
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [quotedPriceInput, setQuotedPriceInput] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [adminNotesInput, setAdminNotesInput] = useState<string>("");

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
    setRefreshing(true);
    await fetchOrders();
    setTimeout(() => setRefreshing(false), 500);
    toast.success("Orders refreshed!");
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      const additionalData: any = {};
      
      const response = await updateCustomOrderStatusAction(
        selectedOrder.id,
        newStatus,
        adminNotesInput,
        newStatus === "quoted"
          ? Number(quotedPriceInput)
          : selectedOrder.quoted_price || undefined,
        additionalData
      );

      if (response.error) throw new Error(response.error);

      toast.success("Order status updated successfully!");
      fetchOrders();
      setAdminNotesInput("");
      setSelectedOrder(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder || !trackingNumber.trim()) return;
    setIsUpdatingTracking(true);
    try {
      const response = await updateCustomOrderStatusAction(
        selectedOrder.id,
        "shipped",
        undefined,
        selectedOrder.quoted_price || undefined,
        { tracking_id: trackingNumber, courier_name: "India Post (Speed Post)" }
      );

      if (response.error) throw new Error(response.error);

      toast.success("Tracking updated. Order marked as Shipped!");
      fetchOrders();
      setSelectedOrder(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update tracking");
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  // Select row logic
  const handleSelectOrder = (order: CustomOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setQuotedPriceInput(order.quoted_price?.toString() || "");
    setAdminNotesInput(""); // Always start with an empty note for new updates
    setTrackingNumber(order.tracking_id || "");
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const inProgressCount = orders.filter(
    (o) => o.status === "in_progress",
  ).length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const totalRevenue = orders
    .filter((o) =>
      ["paid", "in_progress", "shipped", "delivered"].includes(o.status),
    )
    .reduce((sum, o) => sum + (o.quoted_price || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* ══════════════════════════════════════════
          PAGE HEADER
         ══════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Custom Orders Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Build bespoke crochet items for your customers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
              bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 
              border border-gray-200/50 dark:border-gray-700/50
              shadow-sm hover:shadow-md transition-all duration-300"
          >
            <RefreshCcw
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
            label: "Total Quotes Won",
            value: formatPrice(totalRevenue),
            icon: IndianRupee,
            color: "from-emerald-500 to-teal-500",
            iconBg:
              "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
          },
          {
            label: "Pending Quotes",
            value: pendingCount,
            icon: Clock,
            color: "from-amber-500 to-orange-500",
            iconBg:
              "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
          },
          {
            label: "Crafting",
            value: inProgressCount,
            icon: Package,
            color: "from-violet-500 to-purple-500",
            iconBg:
              "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
          },
          {
            label: "Shipped",
            value: shippedCount,
            icon: Truck,
            color: "from-indigo-500 to-blue-500",
            iconBg:
              "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="stat-card group relative overflow-hidden rounded-2xl p-4 shadow-sm border bg-white border-gray-100/60 dark:bg-gray-900 dark:border-gray-800"
          >
            <div
              className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
            />
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}
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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-violet-800"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-10 pr-10 py-2.5 rounded-xl text-sm border capitalize cursor-pointer bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:focus:ring-violet-800"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="capitalize">
                {opt === "all" ? "All Statuses" : opt.replace("_", " ")}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ORDERS TABLE
         ══════════════════════════════════════════ */}
      <div className="rounded-2xl shadow-sm border overflow-hidden bg-white border-gray-100/60 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-gray-900 dark:text-white">
                Custom Orders
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {filteredOrders.length} order
                {filteredOrders.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto premium-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/60 dark:bg-gray-800/40">
                {["Order", "Date", "Budget / Quote", "Status"].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-6 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <tr
                    key={`${order.id}-${idx}`}
                    onClick={() => handleSelectOrder(order)}
                    className="order-row group border-b border-gray-50 dark:border-gray-800/60 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white shadow-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                            {order.title}
                          </p>
                          <p className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
                            #{order.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                          Requested Budget
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {order.budget_min
                            ? `${formatPrice(order.budget_min)} - ${formatPrice(order.budget_max || 0)}`
                            : "No limit"}
                        </span>
                        {order.quoted_price && (
                          <span className="text-[10px] text-violet-500 font-bold mt-1">
                            Quoted: {formatPrice(order.quoted_price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border 
                        ${
                          order.status === "paid"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : order.status === "quoted"
                              ? "bg-cyan-50 text-cyan-600 border-cyan-200"
                              : order.status === "shipped" ||
                                  order.status === "delivered"
                                ? "bg-blue-50 text-blue-600 border-blue-200"
                                : "bg-amber-50 text-amber-600 border-amber-200"
                        }`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-gray-500 border-b border-white h-full relative"
                  >
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          ORDER DETAILS MODAL
         ══════════════════════════════════════════ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-2xl h-full bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto premium-scroll animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Custom Order Details
                  <span className="text-sm font-mono font-normal text-gray-400">
                    #{selectedOrder.id.slice(0, 8)}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Requested on {formatDate(selectedOrder.created_at)}
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
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-violet-100 text-violet-600`}
                  >
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Order Status
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white uppercase">
                      {selectedOrder.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
                {selectedOrder.status === "paid" ||
                selectedOrder.status === "in_progress" ||
                selectedOrder.status === "shipped" ||
                selectedOrder.status === "delivered" ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Payment
                      </p>
                      <p className="text-sm font-bold text-emerald-600 uppercase">
                        Paid - {formatPrice(selectedOrder.quoted_price || 0)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Payment
                      </p>
                      <p className="text-sm font-bold text-amber-600 uppercase">
                        Pending
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-violet-500" />
                    Shipping Address
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800 h-full">
                    {selectedOrder.shipping_address ? (
                      <>
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
                          {selectedOrder.shipping_address?.pincode}
                        </p>
                        <p>{selectedOrder.shipping_address?.country}</p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <MapPin className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-center text-xs">
                          Customer has not provided a shipping address yet.
                          <br />
                          (Collected at payment)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-violet-500" />
                    Requirement Brief
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800 h-full">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {selectedOrder.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 italic mb-3">
                      "{selectedOrder.description}"
                    </p>
                    {selectedOrder.size_details && (
                      <p className="text-xs mb-1">
                        <strong>Size:</strong> {selectedOrder.size_details}
                      </p>
                    )}
                    {selectedOrder.preferred_colors && (
                      <p className="text-xs mb-1">
                        <strong>Colors:</strong>{" "}
                        {selectedOrder.preferred_colors}
                      </p>
                    )}
                    {selectedOrder.deadline && (
                      <p className="text-xs">
                        <strong>Deadline:</strong>{" "}
                        {formatDate(selectedOrder.deadline)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Reference Images */}
              {selectedOrder.reference_images &&
                selectedOrder.reference_images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-violet-500" />
                      Reference Images
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {selectedOrder.reference_images.map((img, i) => (
                        <a
                          key={i}
                          href={img}
                          target="_blank"
                          rel="noreferrer"
                          className="relative shrink-0 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden block group"
                        >
                          <img
                            src={img}
                            alt={`Ref ${i}`}
                            className="w-24 h-24 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="text-white w-6 h-6" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              <hr className="border-gray-200 dark:border-gray-800" />

              {/* Action Update Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 text-violet-500" />
                  Process & Update Order
                </h3>
                <div className="bg-violet-50/50 dark:bg-violet-900/10 p-6 rounded-2xl border border-violet-100 dark:border-violet-900/30 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        Order Stage
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-violet-500 outline-none"
                      >
                        {FILTER_OPTIONS.slice(1).filter(opt => {
                          // If order is paid or beyond, don't allow going back to pending or quoted
                          const postPaymentStatuses = ["paid", "in_progress", "shipped", "delivered"];
                          const isAlreadyPaid = postPaymentStatuses.includes(selectedOrder.status);
                          if (isAlreadyPaid && (opt === "pending" || opt === "quoted")) {
                            return false;
                          }
                          return true;
                        }).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.replace("_", " ").toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {newStatus === "quoted" && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                          Quoted Price (₹)
                        </label>
                        <input
                          type="number"
                          value={quotedPriceInput}
                          onChange={(e) => setQuotedPriceInput(e.target.value)}
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                          placeholder="Ex: 1500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 mt-4">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1.5 mb-2">
                      <StickyNote className="w-3 h-3" /> Admin Note / Message to
                      Customer
                    </label>
                    <textarea
                      rows={2}
                      value={adminNotesInput}
                      onChange={(e) => setAdminNotesInput(e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-violet-500 outline-none"
                      placeholder="Enter tracking details, instructions, or a warm note!"
                    />
                  </div>

                  <button
                    onClick={handleUpdateStatus}
                    disabled={isUpdatingStatus}
                    className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-violet-500/25 transition-all outline-none"
                  >
                    {isUpdatingStatus ? (
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Save Changes & Notify Customer
                  </button>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-800" />

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
                      Updating tracking will mark the order as <span className="font-bold text-indigo-600">Shipped</span>
                    </p>
                    <button 
                      onClick={handleUpdateTracking}
                      disabled={isUpdatingTracking || !trackingNumber.trim() || trackingNumber === selectedOrder?.tracking_id}
                      className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold 
                        hover:bg-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center gap-2 shadow-lg shadow-violet-600/20"
                    >
                      {isUpdatingTracking ? (
                        <>
                          <RefreshCcw className="w-4 h-4 animate-spin" />
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

              <div className="h-10" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
