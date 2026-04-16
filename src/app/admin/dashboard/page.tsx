"use client";

import { useAuthStore } from "@/store/useAuthStore";
import AdminGuard from "@/components/admin/AdminGuard";
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Settings,
  Search,
  Clock,
  RefreshCcw,
  Truck,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BarChart3,
  Zap,
  Crown,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
  MoreHorizontal,
  Calendar,
  DollarSign,
  ChevronRight,
  Layers,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAdminDashboardAction } from "@/actions/admin_dashboard";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import toast from "react-hot-toast";

/**
 * 👑 Admin Dashboard (Main Hub) - Premium Redesign
 */
export default function AdminDashboardPage() {
  const { profile } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const res = await getAdminDashboardAction();
      setData(res);
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load real-time stats");
    } finally {
      setLoading(false);
    }
  }

  const stats = data?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeInventory: 0,
  };

  const recentOrders = data?.recentOrders || [];

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <AdminGuard>
      <div className="relative min-h-screen">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Light mode */}
          <div className="dark:opacity-0 transition-opacity duration-700">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-200/50 via-violet-200/40 to-fuchsia-200/50 rounded-full blur-3xl animate-blob" />
            <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/40 via-cyan-200/30 to-teal-200/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-amber-200/30 via-orange-200/20 to-rose-200/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
          </div>
          {/* Dark mode */}
          <div className="opacity-0 dark:opacity-100 transition-opacity duration-700">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-900/30 via-violet-900/20 to-fuchsia-900/30 rounded-full blur-3xl animate-blob" />
            <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-900/20 via-cyan-900/15 to-teal-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-amber-900/15 via-orange-900/10 to-rose-900/15 rounded-full blur-3xl animate-blob animation-delay-4000" />
          </div>
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative">
          {/* Premium Header */}
          <header className="mb-8 animate-fade-in-down">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left side - Welcome */}
              <div className="flex items-start gap-4">
                {/* Admin Avatar */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-purple-500/25 dark:shadow-purple-500/15 transform group-hover:scale-105 transition-all duration-300">
                    <Crown className="w-8 h-8 text-white drop-shadow-lg" />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-900/40 dark:to-fuchsia-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      Admin Portal
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-sm hidden sm:block">
                      •
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm hidden sm:flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {currentTime.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                    {greeting()},{" "}
                    <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 dark:from-purple-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                      {profile?.full_name || "Admin"}
                    </span>
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Your store is performing well today
                  </p>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative group hidden sm:block">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Quick search..."
                      className="w-56 pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all shadow-sm hover:shadow-md text-gray-900 dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Notification */}
                <button className="relative p-3 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all shadow-sm hover:shadow-md group">
                  <Bell className="w-5 h-5 transform group-hover:rotate-12 transition-transform" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse" />
                </button>

                {/* Refresh */}
                <button
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="p-3 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 group"
                  title="Refresh Data"
                >
                  <RefreshCcw
                    className={cn(
                      "w-5 h-5 transition-transform",
                      loading ? "animate-spin" : "group-hover:rotate-180",
                    )}
                  />
                </button>

                {/* Add Product */}
                <Link
                  href="/admin/products/new"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 hover:from-purple-700 hover:via-violet-700 hover:to-fuchsia-700 text-white font-semibold shadow-xl shadow-purple-500/25 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-purple-500/30 active:translate-y-0 group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Add Product</span>
                </Link>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={loading ? "..." : formatPrice(stats.totalRevenue)}
              change="+12.5%"
              trend="up"
              icon={DollarSign}
              gradient="from-emerald-500 via-green-500 to-teal-500"
              bgGradient="from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
              iconBg="bg-emerald-500"
              delay="0s"
              loading={loading}
            />
            <StatCard
              title="Total Orders"
              value={loading ? "..." : stats.totalOrders.toString()}
              change="+8.2%"
              trend="up"
              icon={ShoppingBag}
              gradient="from-purple-500 via-violet-500 to-fuchsia-500"
              bgGradient="from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20"
              iconBg="bg-purple-500"
              delay="0.1s"
              loading={loading}
            />
            <StatCard
              title="Total Customers"
              value={loading ? "..." : stats.totalCustomers.toString()}
              change="+24.3%"
              trend="up"
              icon={Users}
              gradient="from-blue-500 via-cyan-500 to-sky-500"
              bgGradient="from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20"
              iconBg="bg-blue-500"
              delay="0.2s"
              loading={loading}
            />
            <StatCard
              title="Active Inventory"
              value={loading ? "..." : stats.activeInventory.toString()}
              change="-3.1%"
              trend="down"
              icon={Package}
              gradient="from-amber-500 via-orange-500 to-yellow-500"
              bgGradient="from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
              iconBg="bg-amber-500"
              delay="0.3s"
              loading={loading}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Recent Orders - Takes 2 columns */}
            <div className="xl:col-span-2 animate-fade-in-up animation-delay-400">
              <div className="relative group h-full">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden">
                  {/* Top gradient line */}
                  <div className="h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500" />

                  <div className="p-6 lg:p-8">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-xl blur-lg opacity-40" />
                          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Recent Activity
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Latest orders from your store
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/admin/orders"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-400 font-semibold text-sm transition-all group/link"
                      >
                        <span>View All</span>
                        <ChevronRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Orders List */}
                    <div className="space-y-3">
                      {loading ? (
                        Array(4)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="h-24 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl animate-pulse"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                          ))
                      ) : recentOrders.length > 0 ? (
                        recentOrders.map((order: any, index: number) => (
                          <OrderCard
                            key={order.id}
                            order={order}
                            index={index}
                          />
                        ))
                      ) : (
                        <EmptyState />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6 animate-fade-in-up animation-delay-600">
              {/* Quick Actions */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500" />

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Quick Actions
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <QuickActionLink
                        href="/admin/products"
                        label="Manage Products"
                        description="View and edit inventory"
                        icon={Package}
                        gradient="from-violet-500 to-purple-600"
                      />
                      <QuickActionLink
                        href="/admin/orders"
                        label="Process Orders"
                        description="Handle customer orders"
                        icon={ShoppingBag}
                        gradient="from-emerald-500 to-teal-600"
                      />
                      <QuickActionLink
                        href="/admin/users"
                        label="User Management"
                        description="Manage user accounts"
                        icon={Users}
                        gradient="from-blue-500 to-cyan-600"
                      />

                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 shadow-xl overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
                        This Month
                      </span>
                    </div>

                    <h4 className="text-white/80 text-sm font-medium mb-1">
                      Overall Performance
                    </h4>
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-4xl font-bold text-white">
                        94.2%
                      </span>
                      <span className="text-emerald-200 text-sm font-semibold flex items-center gap-1 mb-1">
                        <ArrowUp className="w-4 h-4" />
                        +5.4%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-1000"
                        style={{ width: "94.2%" }}
                      />
                    </div>
                    <p className="text-white/60 text-xs mt-2">
                      Compared to last month's 88.8%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Styles */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInDown {
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
              transform: translate(30px, 10px) scale(1.05);
            }
          }
          
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          
          .animate-fade-in-down {
            animation: fadeInDown 0.6s ease-out forwards;
          }
          
          .animate-blob {
            animation: blob 20s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
          
          .animation-delay-600 {
            animation-delay: 0.6s;
          }
        `}</style>
      </div>
    </AdminGuard>
  );
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  gradient,
  bgGradient,
  iconBg,
  delay,
  loading,
}: any) {
  return (
    <div className="animate-fade-in-up group" style={{ animationDelay: delay }}>
      <div className="relative h-full">
        {/* Glow effect */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
        />

        <div
          className={`relative h-full p-6 rounded-2xl bg-gradient-to-br ${bgGradient} border border-white/60 dark:border-gray-700/60 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden`}
        >
          {/* Background decoration */}
          <div
            className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}
          />

          <div className="relative">
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold",
                  trend === "up"
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400",
                )}
              >
                {trend === "up" ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {change}
              </div>
            </div>

            {/* Value */}
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {title}
              </p>
              {loading ? (
                <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              ) : (
                <h4
                  className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent tabular-nums`}
                >
                  {value}
                </h4>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, index }: { order: any; index: number }) {
  const statusConfig: any = {
    delivered: {
      icon: CheckCircle,
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      badge:
        "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
    shipped: {
      icon: Truck,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      badge:
        "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    processing: {
      icon: RefreshCcw,
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-600 dark:text-amber-400",
      badge:
        "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    },
    pending: {
      icon: Clock,
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400",
      badge:
        "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    },
    // Custom Order Statuses
    quoted: {
      icon: DollarSign,
      bg: "bg-cyan-100 dark:bg-cyan-900/30",
      text: "text-cyan-600 dark:text-cyan-400",
      badge: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
    },
    paid: {
      icon: CheckCircle,
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
    in_progress: {
      icon: RefreshCcw,
      bg: "bg-violet-100 dark:bg-violet-900/30",
      text: "text-violet-600 dark:text-violet-400",
      badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
    }
  };

  const config = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const isCustom = order.type === 'custom';

  return (
    <Link
      href={isCustom ? `/admin/custom-orders?id=${order.id}` : `/admin/orders?id=${order.id}`}
      className="block group"
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      <div className="relative p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gradient-to-r hover:from-purple-50/80 hover:via-violet-50/50 hover:to-fuchsia-50/80 dark:hover:from-purple-900/20 dark:hover:via-violet-900/10 dark:hover:to-fuchsia-900/20 border border-transparent hover:border-purple-200/50 dark:hover:border-purple-800/50 transition-all duration-300">
        <div className="flex items-center gap-4">
          {/* Status Icon */}
          <div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
              config.bg,
            )}
          >
            <StatusIcon className={cn("w-7 h-7", config.text)} />
          </div>

          {/* Order Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <p className="font-bold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors truncate">
                {order.display_name}
              </p>
              {isCustom && (
                <span className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 text-[9px] font-black uppercase tracking-tighter border border-pink-200 dark:border-pink-800">
                  Custom
                </span>
              )}
              <span
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                  config.badge,
                )}
              >
                {order.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(order.created_at)}
              </span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white/80 dark:bg-gray-700/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <ArrowUpRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function QuickActionLink({
  href,
  label,
  description,
  icon: Icon,
  gradient,
}: any) {
  return (
    <Link href={href} className="group block">
      <div className="relative p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/80 dark:hover:from-gray-800/80 dark:hover:to-gray-700/50 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
              {label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full blur-2xl opacity-20 animate-pulse" />
        <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No Recent Orders
      </h4>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
        When customers place orders, they'll appear here for you to manage.
      </p>
      <Link
        href="/admin/products"
        className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5"
      >
        <Plus className="w-4 h-4" />
        Add Products
      </Link>
    </div>
  );
}
