"use client";

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
  Search,
  Filter,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Eye,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Box,
  MapPin,
  CreditCard,
  AlertCircle,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  items: any[];
  created_at: string;
  shipping_address?: any;
  payment_status?: string;
}

interface Props {
  orders: Order[];
  stats: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    totalSpent: number;
  };
}

const statusConfig: Record<string, { 
  label: string; 
  icon: any; 
  color: string; 
  bgColor: string;
  borderColor: string;
  gradient: string;
}> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    borderColor: "border-amber-200 dark:border-amber-500/20",
    gradient: "from-amber-500 to-orange-500",
  },
  processing: {
    label: "Processing",
    icon: RotateCcw,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    borderColor: "border-blue-200 dark:border-blue-500/20",
    gradient: "from-blue-500 to-cyan-500",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-500/10",
    borderColor: "border-purple-200 dark:border-purple-500/20",
    gradient: "from-purple-500 to-pink-500",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    borderColor: "border-emerald-200 dark:border-emerald-500/20",
    gradient: "from-emerald-500 to-teal-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    borderColor: "border-red-200 dark:border-red-500/20",
    gradient: "from-red-500 to-rose-500",
  },
};

export default function OrdersPageClient({ orders, stats }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch = 
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item: any) => 
          item.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesStatus = !statusFilter || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setSortOrder("newest");
  };

  const hasActiveFilters = searchQuery || statusFilter || sortOrder !== "newest";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-amber-200/30 to-orange-200/30 dark:from-amber-600/10 dark:to-orange-600/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 dark:from-emerald-600/10 dark:to-teal-600/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div 
          className={`mb-8 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-200 font-medium">My Orders</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
                My Orders
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Track and manage your order history
              </p>
            </div>
            
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {[
            { 
              label: "Total Orders", 
              value: stats.total, 
              icon: Package, 
              gradient: "from-amber-500 to-orange-500",
              bgGradient: "from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10",
            },
            { 
              label: "In Progress", 
              value: stats.pending + stats.processing, 
              icon: Clock, 
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10",
            },
            { 
              label: "Shipped", 
              value: stats.shipped, 
              icon: Truck, 
              gradient: "from-purple-500 to-pink-500",
              bgGradient: "from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10",
            },
            { 
              label: "Total Spent", 
              value: formatPrice(stats.totalSpent), 
              icon: TrendingUp, 
              gradient: "from-emerald-500 to-teal-500",
              bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10",
              isPrice: true,
            },
          ].map((stat, idx) => (
            <div
              key={stat.label}
              className={`group relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-5 border border-white/50 dark:border-gray-800 hover:shadow-xl transition-all duration-500`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Background Decoration */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              <p className={`text-2xl font-bold text-gray-900 dark:text-white mt-1 ${stat.isPrice ? 'text-xl' : ''}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {orders.length === 0 ? (
          /* Empty State */
          <EmptyState isLoaded={isLoaded} />
        ) : (
          <>
            {/* Search & Filter Bar */}
            <div 
              className={`mb-6 transition-all duration-700 delay-200 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search orders by number or product..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent dark:border-gray-700/50 text-gray-900 dark:text-white rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-amber-500 dark:focus:border-amber-500 focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                  {/* Status Filter */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {statusFilter ? statusConfig[statusFilter]?.label : "All Status"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="p-2">
                        <button
                          onClick={() => setStatusFilter(null)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                            !statusFilter ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                          )}
                        >
                          <Package className="w-4 h-4" />
                          <span className="text-sm font-medium">All Orders</span>
                        </button>
                        {Object.entries(statusConfig).map(([key, config]) => {
                          const Icon = config.icon;
                          return (
                            <button
                              key={key}
                              onClick={() => setStatusFilter(key)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                                statusFilter === key ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                              )}
                            >
                              <Icon className={`w-4 h-4 ${config.color}`} />
                              <span className="text-sm font-medium">{config.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {sortOrder === "newest" ? "Newest" : "Oldest"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="p-2">
                        {[
                          { value: "newest", label: "Newest First" },
                          { value: "oldest", label: "Oldest First" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setSortOrder(option.value as any)}
                            className={cn(
                              "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                              sortOrder === option.value
                                ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                  
                  {statusFilter && (
                    <button
                      onClick={() => setStatusFilter(null)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                        statusConfig[statusFilter].bgColor,
                        statusConfig[statusFilter].color
                      )}
                    >
                      {statusConfig[statusFilter].label}
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium"
                    >
                      "{searchQuery}"
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div 
              className={`flex items-center justify-between mb-6 transition-all duration-700 delay-300 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredOrders.length}</span> of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{orders.length}</span> orders
              </p>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <Search className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="text-amber-600 dark:text-amber-500 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order, idx) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    isLoaded={isLoaded}
                    delay={idx * 50}
                  />
                ))}
              </div>
            )}
          </>
        )}
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

// Order Card Component
function OrderCard({ 
  order, 
  isLoaded, 
  delay 
}: { 
  order: Order; 
  isLoaded: boolean;
  delay: number;
}) {
  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const itemCount = order.items?.length || 0;

  return (
    <Link
      href={`/orders/${order.id}`}
      className={cn(
        "group block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-500",
        "hover:shadow-xl hover:shadow-amber-100/50 dark:hover:shadow-amber-900/20 hover:border-amber-200 dark:hover:border-amber-700 hover:-translate-y-1",
        isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Status Bar */}
      <div className={`h-1 bg-gradient-to-r ${status.gradient}`} />
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Order Info */}
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
              status.bgColor
            )}>
              <StatusIcon className={cn("w-7 h-7", status.color)} />
            </div>
            
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-mono font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {order.order_number}
                </h3>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  status.bgColor,
                  status.color
                )}>
                  {status.label}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(order.created_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Box className="w-4 h-4" />
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Order Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(order.total)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
              <ChevronRight className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {order.items.slice(0, 4).map((item: any, i: number) => (
                <div
                  key={i}
                  className="relative w-12 h-12 rounded-xl border-2 border-white dark:border-gray-900 overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm transition-transform hover:scale-110 hover:z-10"
                  style={{ zIndex: 4 - i }}
                >
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=80"}
                    alt={item.name || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {itemCount > 4 && (
                <div className="w-12 h-12 rounded-xl border-2 border-white dark:border-gray-900 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300 shadow-sm">
                  +{itemCount - 4}
                </div>
              )}
            </div>
            <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
              {order.items.slice(0, 2).map((item: any) => item.name).join(", ")}
              {itemCount > 2 && ` +${itemCount - 2} more`}
            </div>
          </div>

          {/* View Details Link */}
          <span className="text-sm font-medium text-amber-600 dark:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            View Details
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Empty State Component
function EmptyState({ isLoaded }: { isLoaded: boolean }) {
  return (
    <div 
      className={`text-center py-20 transition-all duration-700 delay-200 ${
        isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="relative inline-block mb-8">
        {/* Animated Background Circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-full animate-ping opacity-20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-500/20 dark:to-orange-500/20 rounded-full animate-pulse" />
        </div>
        
        {/* Icon Container */}
        <div className="relative w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-full flex items-center justify-center">
          <Package className="w-16 h-16 text-amber-500 dark:text-amber-400 animate-bounce" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center animate-float">
          <ShoppingBag className="w-5 h-5 text-amber-500 dark:text-amber-400" />
        </div>
        <div className="absolute -bottom-2 -left-4 w-8 h-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center animate-float animation-delay-1000">
          <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-400" />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
        No orders yet
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Looks like you haven't placed any orders yet. Start exploring our collection and find something you'll love!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30 dark:shadow-amber-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
          style={{ backgroundSize: "200% auto" }}
        >
          <ShoppingBag className="w-5 h-5" />
          Start Shopping
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300"
        >
          Explore Categories
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-2xl mx-auto">
        {[
          { icon: Truck, title: "Free Shipping", desc: "On orders over ₹999" },
          { icon: CreditCard, title: "Secure Payment", desc: "100% secure checkout" },
        ].map((feature, idx) => (
          <div
            key={feature.title}
            className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <feature.icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{feature.desc}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}