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
  Bell,
  Search
} from "lucide-react";
import Link from "next/link";

/**
 * 👑 Admin Dashboard (Main Hub)
 */
export default function AdminDashboardPage() {
  const { profile } = useAuthStore();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 transition-all duration-700 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Welcome back, <span className="text-purple-600 dark:text-purple-400">{profile?.full_name || "Admin"}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Store overview and management dashboard.
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors shadow-sm">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors shadow-sm relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-gray-900" />
            </button>
            <Link 
              href="/admin/products/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Revenue" 
            value="₹1,24,500" 
            change="+12.5%" 
            icon={TrendingUp} 
            color="bg-emerald-500" 
          />
          <StatCard 
            title="Total Orders" 
            value="342" 
            change="+8.2%" 
            icon={ShoppingBag} 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Total Customers" 
            value="1,240" 
            change="+14.1%" 
            icon={Users} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Active Inventory" 
            value="64" 
            change="-2.4%" 
            icon={Package} 
            color="bg-amber-500" 
          />
        </div>

        {/* Dashboard Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders / Alerts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                <Link href="/admin/orders" className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">New Order #ORD-8273</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">2 minutes ago • ₹2,450</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions / Settings */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Management</h3>
              <div className="grid grid-cols-1 gap-3">
                <QuickActionLink href="/admin/products" label="Manage Products" icon={Package} />
                <QuickActionLink href="/admin/orders" label="Process Orders" icon={ShoppingBag} />
                <QuickActionLink href="/admin/users" label="User Roles" icon={Users} />
                <QuickActionLink href="/admin/settings" label="Store Settings" icon={Settings} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all group">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] rounded-bl-[100px] transition-transform group-hover:scale-110`} />
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center text-gray-900 dark:text-white`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className={`text-sm font-bold ${change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
          {change}
        </span>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h4>
    </div>
  );
}

function QuickActionLink({ href, label, icon: Icon }: any) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-all group"
    >
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span>{label}</span>
      <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
