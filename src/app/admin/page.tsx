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
} from "lucide-react";
import AnimatedValue from "./AnimatedValue";

export default async function AdminDashboard() {
  const productService = new ProductService(true);
  const orderService = new OrderService(true);
  const profileService = new ProfileService(true);

  // Fetch data using services
  const [
    { count: productCount },
    { count: orderCount },
    { count: userCount },
    { data: recentOrders },
    { data: paidOrders },
  ] = await Promise.all([
    productService.getProducts({ limit: 1 }), // Just for count
    orderService.getAllOrders({ limit: 1 }),  // Just for count
    profileService.getProfiles({ limit: 1 }), // Just for count
    orderService.getAllOrders({ limit: 5 }),
    orderService.getAllOrders({ status: 'paid', limit: 1000 }), // Simplified for revenue
  ]);

  const totalRevenue =
    (paidOrders as any)?.reduce((sum: number, o: any) => sum + Number(o.total), 0) || 0;

  const stats = [
    {
      label: "Total Revenue",
      value: totalRevenue,
      formatted: formatPrice(totalRevenue),
      icon: IndianRupee,
      iconBg:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
      gradient: "from-emerald-500 to-teal-500",
      trend: "+12.5%",
    },
    {
      label: "Total Orders",
      value: orderCount || 0,
      formatted: String(orderCount || 0),
      icon: ShoppingCart,
      iconBg:
        "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
      gradient: "from-violet-500 to-purple-500",
      trend: "+8.2%",
    },
    {
      label: "Products",
      value: productCount || 0,
      formatted: String(productCount || 0),
      icon: Package,
      iconBg:
        "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400",
      gradient: "from-pink-500 to-rose-500",
      trend: "+3",
    },
    {
      label: "Customers",
      value: userCount || 0,
      formatted: String(userCount || 0),
      icon: Users,
      iconBg:
        "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
      gradient: "from-amber-500 to-orange-500",
      trend: "+24%",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-400",
          dot: "bg-emerald-500",
        };
      case "shipped":
        return {
          bg: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700/50 dark:text-blue-400",
          dot: "bg-blue-500 animate-pulse",
        };
      case "processing":
        return {
          bg: "bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-900/30 dark:border-violet-700/50 dark:text-violet-400",
          dot: "bg-violet-500 animate-pulse",
        };
      default:
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700/50 dark:text-amber-400",
          dot: "bg-amber-500",
        };
    }
  };

  const getPaymentStyle = (status: string) => {
    return status === "paid"
      ? {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-400",
          dot: "bg-emerald-500",
        }
      : {
          bg: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700/50 dark:text-amber-400",
          dot: "bg-amber-500 animate-pulse",
        };
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ── Background blobs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-200/20 dark:bg-violet-800/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-pink-200/20 dark:bg-pink-800/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/10 dark:bg-amber-800/5 blur-3xl" />
      </div>

      <div className="mb-8 animate-fade-in-down">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border bg-violet-50 border-violet-200 text-violet-600 dark:bg-violet-900/30 dark:border-violet-700/50 dark:text-violet-400">
            <Sparkles className="w-3 h-3" />
            Overview
          </span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl p-6 shadow-sm border animate-fade-in-up bg-white border-gray-100/60 dark:bg-gray-900 dark:border-gray-800"
            style={{ animationDelay: `${100 + i * 100}ms` }}
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${stat.gradient} opacity-70 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-linear-to-br ${stat.gradient} opacity-[0.06] dark:opacity-[0.1] group-hover:opacity-[0.12] dark:group-hover:opacity-[0.2] group-hover:scale-125 transition-all duration-700`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <AnimatedValue value={stat.value} formatted={stat.formatted} />
              </p>
              <p className="mt-1 text-sm font-medium text-gray-400 dark:text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="animate-fade-in-up rounded-2xl shadow-sm border overflow-hidden bg-white border-gray-100/60 dark:bg-gray-900 dark:border-gray-800" style={{ animationDelay: "500ms" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20 dark:shadow-violet-500/10">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">Last {(recentOrders as any)?.length || 0} transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Live</span>
          </div>
        </div>

        <div className="overflow-x-auto premium-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/60 dark:bg-gray-800/40">
                <th className="py-3 px-6 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Order</th>
                <th className="py-3 px-6 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Status</th>
                <th className="py-3 px-6 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Payment</th>
                <th className="py-3 px-6 text-right text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody>
              {(recentOrders as any || []).length > 0 ? (
                (recentOrders as any || []).map((order: any, idx: number) => {
                  const s = getStatusStyle(order.status);
                  const p = getPaymentStyle(order.payment_status);

                  return (
                    <tr key={order.id} className="group border-b border-gray-50 dark:border-gray-800/60 animate-table-row" style={{ animationDelay: `${650 + idx * 100}ms` }}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white shadow-sm group-hover:scale-110 transition-transform duration-300">#{idx + 1}</div>
                          <div>
                            <p className="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">{order.order_number}</p>
                            <p className="text-[10px] mt-0.5 flex items-center gap-1 text-gray-400 dark:text-gray-600">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`premium-badge ${s.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`premium-badge ${p.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(order.total)}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-violet-400 dark:text-violet-500" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800">
                        <ShoppingCart className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-400 dark:text-gray-500">No orders yet</p>
                      <p className="text-xs text-gray-300 dark:text-gray-600">Orders will show up here once customers start purchasing</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {(recentOrders as any || []).length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/40 dark:border-gray-800 dark:bg-gray-800/30">
            <p className="text-xs text-gray-400 dark:text-gray-500">Showing {(recentOrders as any)?.length} of {orderCount || 0} orders</p>
            <div className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <span key={d} className={`h-1.5 w-1.5 rounded-full ${d === 0 ? "bg-violet-500" : "bg-gray-200 dark:bg-gray-700"}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}