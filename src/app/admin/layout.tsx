"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageCircle,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Crown,
  Bell,
  Search,
  Moon,
  Sun,
  Zap,
  TrendingUp,
  Activity,
  Menu,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import AdminGuard from "@/components/admin/AdminGuard";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "next-themes";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    gradient: "from-violet-500 to-purple-600",
    badge: null,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
    gradient: "from-blue-500 to-cyan-600",
    badge: null,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
    gradient: "from-emerald-500 to-teal-600",
    badge: "3",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    gradient: "from-amber-500 to-orange-600",
    badge: null,
  },
  {
    href: "/admin/custom-orders",
    label: "Custom Orders",
    icon: FileText,
    gradient: "from-pink-500 to-rose-600",
    badge: "2",
  },
  {
    href: "/admin/chat",
    label: "Messages",
    icon: MessageCircle,
    gradient: "from-indigo-500 to-blue-600",
    badge: "5",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().signOut();
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex transition-colors duration-500">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="dark:opacity-0 transition-opacity duration-700">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/30 via-violet-200/20 to-fuchsia-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-200/20 via-cyan-200/15 to-teal-200/20 rounded-full blur-3xl" />
        </div>
        <div className="opacity-0 dark:opacity-100 transition-opacity duration-700">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-900/20 via-violet-900/15 to-fuchsia-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-900/15 via-cyan-900/10 to-teal-900/15 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden lg:flex flex-col transition-all duration-500 ease-out",
          sidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Sidebar Background with Glass Effect */}
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-r border-gray-200/60 dark:border-gray-800/60 shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50" />

        {/* Gradient Accent Line */}
        <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-gradient-to-b from-purple-500/50 via-transparent to-blue-500/50" />

        <div className="relative flex flex-col h-full">
          {/* Header / Logo */}
          <div
            className={cn(
              "p-6 border-b border-gray-200/60 dark:border-gray-800/60",
              sidebarCollapsed && "p-4"
            )}
          >
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div
                  className={cn(
                    "relative bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-xl shadow-purple-500/25 dark:shadow-purple-500/15 transition-all duration-300 group-hover:scale-105",
                    sidebarCollapsed ? "w-12 h-12" : "w-12 h-12"
                  )}
                >
                  <Scissors className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                {/* Status dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </span>
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden animate-fade-in">
                  <h1 className="font-display font-bold text-gray-900 dark:text-white text-lg tracking-tight">
                    Strokes of Craft
                  </h1>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-100 to-fuchsia-100 dark:from-purple-900/40 dark:to-fuchsia-900/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Crown className="w-2.5 h-2.5" />
                      Admin
                    </span>
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Search Bar (when expanded) */}
          {!sidebarCollapsed && (
            <div className="px-4 pt-4 animate-fade-in">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 dark:bg-gray-800/80 border border-transparent focus:border-purple-500/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
                  ⌘K
                </kbd>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
            {/* Section Label */}
            {!sidebarCollapsed && (
              <p className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                Main Menu
              </p>
            )}

            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group",
                    isActive
                      ? "bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 dark:from-purple-500/20 dark:via-violet-500/15 dark:to-fuchsia-500/20 text-purple-700 dark:text-purple-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white",
                    sidebarCollapsed && "justify-center px-0"
                  )}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-fuchsia-600 rounded-r-full shadow-lg shadow-purple-500/50" />
                  )}

                  {/* Icon with gradient background on active/hover */}
                  <div
                    className={cn(
                      "relative flex items-center justify-center transition-all duration-300",
                      sidebarCollapsed ? "w-10 h-10 rounded-xl" : "w-8 h-8 rounded-lg",
                      isActive
                        ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                        : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gradient-to-br group-hover:" +
                            item.gradient
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4 transition-all duration-300",
                        isActive
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-white"
                      )}
                    />
                  </div>

                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[10px] font-bold shadow-lg shadow-rose-500/25 animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                      {item.label}
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px]">
                          {item.badge}
                        </span>
                      )}
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Stats Card (when expanded) */}
          {!sidebarCollapsed && (
            <div className="px-4 py-3 animate-fade-in">
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-xl" />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-white/80" />
                    <span className="text-white/80 text-xs font-medium">
                      Today's Stats
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">$2,847</span>
                    <span className="text-emerald-300 text-xs font-semibold flex items-center gap-0.5 mb-1">
                      <TrendingUp className="w-3 h-3" />
                      +12%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: "68%" }}
                    />
                  </div>
                  <p className="text-white/60 text-[10px] mt-1.5">
                    68% of daily target
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* User Profile & Footer */}
          <div className="p-4 border-t border-gray-200/60 dark:border-gray-800/60">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 mb-2 group",
                sidebarCollapsed && "justify-center px-0"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-orange-500",
                  sidebarCollapsed ? "w-10 h-10 rounded-xl" : "w-8 h-8 rounded-lg"
                )}
              >
                {mounted && (
                  <>
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 group-hover:text-white transition-colors" />
                    ) : (
                      <Moon className="w-4 h-4 group-hover:text-white transition-colors" />
                    )}
                  </>
                )}
              </div>
              {!sidebarCollapsed && (
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              )}
            </button>

            {/* Back to Store */}
            <Link
              href="/"
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 mb-2 group",
                sidebarCollapsed && "justify-center px-0"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-all duration-300",
                  sidebarCollapsed ? "w-10 h-10 rounded-xl" : "w-8 h-8 rounded-lg"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </div>
              {!sidebarCollapsed && <span>Back to Store</span>}
            </Link>

            {/* User Profile */}
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 transition-all duration-300",
                sidebarCollapsed && "justify-center p-2"
              )}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/25">
                  {profile?.full_name?.charAt(0) || "A"}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-gray-100 dark:border-gray-800" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {profile?.full_name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {profile?.role || "Administrator"}
                  </p>
                </div>
              )}
              {!sidebarCollapsed && (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-all duration-300"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-110 z-10"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 lg:hidden">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-200/60 dark:border-gray-800/60 shadow-lg">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-gray-900 dark:text-white">
                  Admin
                </h1>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
              </button>

              {/* Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl animate-slide-in-left">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Scissors className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display font-bold text-gray-900 dark:text-white">
                      Strokes of Craft
                    </h1>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                      Admin Panel
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/30 text-purple-700 dark:text-purple-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        isActive
                          ? `bg-gradient-to-br ${item.gradient}`
                          : "bg-gray-100 dark:bg-gray-800"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5",
                          isActive
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400"
                        )}
                      />
                    </div>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all mb-2"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
                </div>
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-all duration-500 overflow-x-hidden",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        )}
      >
        <AdminGuard>
          <div className="pt-16 lg:pt-0">
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto w-full">
              {children}
            </div>
          </div>
        </AdminGuard>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-out forwards;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 2px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
}