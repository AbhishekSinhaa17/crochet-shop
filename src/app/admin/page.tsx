import { ProductService } from "@/services/product-service";
import { OrderService } from "@/services/order-service";
import { ProfileService } from "@/services/profile-service";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Activity,
  Sparkles,
  Zap,
  Eye,
  ChevronRight,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Truck,
  RefreshCcw,
  AlertCircle,
  Crown,
  Target,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
} from "lucide-react";
import AnimatedValue from "./AnimatedValue";
import Link from "next/link";

export default async function AdminDashboard() {
  const productService = new ProductService(true);
  const orderService = new OrderService(true);
  const profileService = new ProfileService(true);

  const [
    { count: productCount },
    { count: orderCount },
    { count: userCount },
    { data: recentOrders },
    { data: paidOrders },
  ] = await Promise.all([
    productService.getProducts({ limit: 1 }),
    orderService.getAllOrders({ limit: 1 }),
    profileService.getProfiles({ limit: 1 }),
    orderService.getAllOrders({ limit: 5 }),
    orderService.getAllOrders({ status: "paid", limit: 1000 }),
  ]);

  const totalRevenue =
    (paidOrders as any)?.reduce(
      (sum: number, o: any) => sum + Number(o.total),
      0
    ) || 0;

  const stats = [
    {
      label: "Total Revenue",
      value: totalRevenue,
      formatted: formatPrice(totalRevenue),
      icon: IndianRupee,
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      bgGradient:
        "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      iconBg: "bg-emerald-500",
      trend: "+12.5%",
      trendUp: true,
      description: "vs last month",
    },
    {
      label: "Total Orders",
      value: orderCount || 0,
      formatted: String(orderCount || 0),
      icon: ShoppingCart,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      bgGradient:
        "from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20",
      iconBg: "bg-violet-500",
      trend: "+8.2%",
      trendUp: true,
      description: "vs last month",
    },
    {
      label: "Products",
      value: productCount || 0,
      formatted: String(productCount || 0),
      icon: Package,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient:
        "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
      iconBg: "bg-pink-500",
      trend: "+3",
      trendUp: true,
      description: "new this week",
    },
    {
      label: "Customers",
      value: userCount || 0,
      formatted: String(userCount || 0),
      icon: Users,
      gradient: "from-amber-500 via-orange-500 to-yellow-500",
      bgGradient:
        "from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
      iconBg: "bg-amber-500",
      trend: "+24%",
      trendUp: true,
      description: "vs last month",
    },
  ];

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      delivered: {
        icon: CheckCircle,
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
        label: "Delivered",
      },
      shipped: {
        icon: Truck,
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        dot: "bg-blue-500 animate-pulse",
        label: "Shipped",
      },
      processing: {
        icon: RefreshCcw,
        bg: "bg-violet-100 dark:bg-violet-900/30",
        text: "text-violet-700 dark:text-violet-400",
        border: "border-violet-200 dark:border-violet-800",
        dot: "bg-violet-500 animate-pulse",
        label: "Processing",
      },
      pending: {
        icon: Clock,
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500",
        label: "Pending",
      },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentConfig = (status: string) => {
    return status === "paid"
      ? {
          bg: "bg-emerald-100 dark:bg-emerald-900/30",
          text: "text-emerald-700 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-800",
          dot: "bg-emerald-500",
          label: "Paid",
        }
      : {
          bg: "bg-amber-100 dark:bg-amber-900/30",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-800",
          dot: "bg-amber-500 animate-pulse",
          label: "Pending",
        };
  };

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Light mode */}
        <div className="dark:opacity-0 transition-opacity duration-700">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-violet-200/40 via-purple-200/30 to-fuchsia-200/40 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/30 via-teal-200/20 to-cyan-200/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-amber-200/25 via-orange-200/20 to-rose-200/25 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        {/* Dark mode */}
        <div className="opacity-0 dark:opacity-100 transition-opacity duration-700">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-violet-900/20 via-purple-900/15 to-fuchsia-900/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-emerald-900/15 via-teal-900/10 to-cyan-900/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-amber-900/10 via-orange-900/10 to-rose-900/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header Section */}
      <div className="mb-8 animate-fade-in-down">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/25 dark:shadow-violet-500/15 transform group-hover:scale-105 transition-all duration-300">
                <BarChart3 className="w-7 h-7 text-white drop-shadow-lg" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-white" />
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-900 dark:from-white dark:via-violet-200 dark:to-purple-200 bg-clip-text text-transparent tracking-tight">
                  Dashboard
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider border border-violet-200/50 dark:border-violet-700/50">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium text-sm transition-all shadow-sm hover:shadow-md group">
              <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium text-sm transition-all shadow-sm hover:shadow-md group">
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-semibold text-sm shadow-xl shadow-violet-500/25 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/30 group"
            >
              <Eye className="w-4 h-4" />
              View All Orders
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="animate-fade-in-up group"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="relative h-full">
              {/* Glow effect */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              />

              <div
                className={`relative h-full p-6 rounded-2xl bg-gradient-to-br ${stat.bgGradient} border border-white/60 dark:border-gray-700/60 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden`}
              >
                {/* Background decoration */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}
                />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div
                    className={`absolute top-1/4 right-1/4 w-1 h-1 rounded-full bg-gradient-to-r ${stat.gradient} opacity-60 animate-float`}
                  />
                  <div
                    className={`absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${stat.gradient} opacity-40 animate-float animation-delay-2000`}
                  />
                </div>

                <div className="relative">
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                        stat.trendUp
                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                          : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400"
                      }`}
                    >
                      {stat.trendUp ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {stat.trend}
                    </div>
                  </div>

                  {/* Value */}
                  <div>
                    <h4
                      className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent tabular-nums`}
                    >
                      <AnimatedValue
                        value={stat.value}
                        formatted={stat.formatted}
                      />
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {stat.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                      style={{
                        width: `${Math.min(70 + i * 8, 95)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Orders - Takes 2 columns */}
        <div className="xl:col-span-2 animate-fade-in-up animation-delay-400">
          <div className="relative group h-full">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden">
              {/* Top gradient line */}
              <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl blur-lg opacity-40" />
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      Recent Orders
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        Live
                      </span>
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last {(recentOrders as any)?.length || 0} transactions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50/80 via-gray-50/50 to-gray-100/80 dark:from-gray-800/80 dark:via-gray-800/50 dark:to-gray-800/80">
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-500 to-purple-600" />
                          Order
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-blue-500 to-cyan-600" />
                          Status
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
                          Payment
                        </div>
                      </th>
                      <th className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-500 to-orange-600" />
                          Total
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {(recentOrders as any || []).length > 0 ? (
                      (recentOrders as any || []).map(
                        (order: any, idx: number) => {
                          const statusConfig = getStatusConfig(order.status);
                          const paymentConfig = getPaymentConfig(
                            order.payment_status
                          );
                          const StatusIcon = statusConfig.icon;

                          return (
                            <tr
                              key={order.id}
                              className="group hover:bg-gradient-to-r hover:from-violet-50/50 hover:via-purple-50/30 hover:to-fuchsia-50/50 dark:hover:from-violet-900/10 dark:hover:via-purple-900/5 dark:hover:to-fuchsia-900/10 transition-all duration-300"
                              style={{
                                animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                              }}
                            >
                              {/* Order Info */}
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                      <span className="text-white font-bold text-sm">
                                        #{idx + 1}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors font-mono text-xs">
                                      {order.order_number}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mt-0.5">
                                      <Clock className="w-3 h-3" />
                                      {new Date(
                                        order.created_at
                                      ).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-6">
                                <span
                                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} transition-all duration-300 group-hover:scale-105`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
                                  />
                                  {order.status}
                                </span>
                              </td>

                              {/* Payment */}
                              <td className="py-4 px-6">
                                <span
                                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${paymentConfig.bg} ${paymentConfig.text} ${paymentConfig.border} transition-all duration-300 group-hover:scale-105`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${paymentConfig.dot}`}
                                  />
                                  {order.payment_status}
                                </span>
                              </td>

                              {/* Total */}
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  <span className="font-bold text-gray-900 dark:text-white text-base">
                                    {formatPrice(order.total)}
                                  </span>
                                  <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-all duration-300" />
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-20">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="relative mb-6">
                              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                              <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                                <ShoppingCart className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                              </div>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              No Orders Yet
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
                              When customers place orders, they'll appear here
                              for you to manage.
                            </p>
                            <Link
                              href="/admin/products"
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
                            >
                              <Package className="w-4 h-4" />
                              Add Products
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              {(recentOrders as any || []).length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/80 via-gray-50/50 to-gray-100/80 dark:from-gray-800/80 dark:via-gray-800/50 dark:to-gray-800/80">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-bold text-gray-900 dark:text-white px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 rounded-md">
                      {(recentOrders as any)?.length}
                    </span>{" "}
                    of {orderCount || 0} orders
                  </p>
                  <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors group"
                  >
                    View all orders
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6 animate-fade-in-up animation-delay-600">
          {/* Quick Stats Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Quick Stats
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: "Conversion Rate",
                      value: "3.24%",
                      trend: "+0.8%",
                      color: "emerald",
                    },
                    {
                      label: "Avg. Order Value",
                      value: "₹1,842",
                      trend: "+12%",
                      color: "violet",
                    },
                    {
                      label: "Cart Abandonment",
                      value: "24.3%",
                      trend: "-5%",
                      color: "amber",
                    },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                    >
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.label}
                        </p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {item.value}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          item.trend.startsWith("+")
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                            : "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400"
                        }`}
                      >
                        {item.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 rounded-3xl p-6 shadow-xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold">
                    This Month
                  </span>
                </div>

                <h4 className="text-white/80 text-sm font-medium mb-1">
                  Overall Performance
                </h4>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-4xl font-bold text-white">94.2%</span>
                  <span className="text-emerald-300 text-sm font-semibold flex items-center gap-1 mb-1">
                    <ArrowUp className="w-4 h-4" />
                    +5.4%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: "94.2%" }}
                  />
                </div>
                <p className="text-white/60 text-xs">
                  Compared to 88.8% last month
                </p>

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <p className="text-white/60 text-xs">Growth</p>
                    <p className="text-white font-bold">+23%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                    <p className="text-white/60 text-xs">Target</p>
                    <p className="text-white font-bold">₹50K</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Quick Actions
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: Package,
                      label: "Products",
                      href: "/admin/products",
                      gradient: "from-violet-500 to-purple-600",
                    },
                    {
                      icon: ShoppingCart,
                      label: "Orders",
                      href: "/admin/orders",
                      gradient: "from-emerald-500 to-teal-600",
                    },
                    {
                      icon: Users,
                      label: "Users",
                      href: "/admin/users",
                      gradient: "from-blue-500 to-cyan-600",
                    },
                    {
                      icon: PieChart,
                      label: "Analytics",
                      href: "/admin/analytics",
                      gradient: "from-amber-500 to-orange-600",
                    },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gradient-to-br hover:from-gray-100/80 hover:to-gray-50/80 dark:hover:from-gray-800/80 dark:hover:to-gray-700/50 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 transition-all duration-300 group/action"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg transform group-hover/action:scale-110 group-hover/action:rotate-3 transition-all duration-300`}
                      >
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover/action:text-violet-700 dark:group-hover/action:text-violet-400 transition-colors">
                        {action.label}
                      </span>
                    </Link>
                  ))}
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
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
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
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
  );
}