"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cartStore";
import { useRouter, usePathname } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Search,
  LogOut,
  Package,
  MessageCircle,
  LayoutDashboard,
  Scissors,
  ChevronRight,
  Sparkles,
  Crown,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());
  const supabase = createClient();

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const json = await res.json();
      if (json.profile) {
        setProfile(json.profile);
      } else {
        setProfile(null);
      }
    } catch (e: any) {
      console.error("Profile Fetch Error:", e);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) await fetchProfile();
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile();
      } else {
        setProfile(null);
        setFetchError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !profile) {
      fetchProfile();
    }
  }, [user, profile]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/auth/signout";
    document.body.appendChild(form);
    form.submit();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/products", label: "Shop", icon: ShoppingBag },
    { href: "/#about-us", label: "About Us", icon: Heart },
    { href: "/custom-order", label: "Custom Order", icon: Sparkles },
  ];

  if (pathname?.startsWith("/admin")) return null;

  const userInitial = profile?.full_name?.charAt(0)?.toUpperCase();

  const avatarGradients = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500",
  ];
  const avatarGradient =
    avatarGradients[
      (profile?.full_name || "U").charCodeAt(0) % avatarGradients.length
    ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          scrolled ? "py-2" : "py-4"
        )}
      >
        {/* Background with glassmorphism */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500",
            scrolled
              ? "bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-b border-slate-200/50 dark:border-slate-700/50"
              : "bg-transparent"
          )}
        />

        {/* Animated gradient line at bottom when scrolled */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 transition-all duration-500",
            scrolled ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          )}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative z-10">
              {/* Logo Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-violet-600/20 to-purple-600/20 dark:from-violet-500/30 dark:to-purple-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-pulse" />
                <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30 dark:shadow-violet-500/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-8deg] group-hover:shadow-xl group-hover:shadow-violet-500/40 overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  <Scissors className="w-5 h-5 text-white relative z-10 transition-transform duration-300 group-hover:rotate-12" />
                </div>
              </div>
              
              <div className="flex flex-col relative">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-violet-900 to-purple-900 dark:from-white dark:via-violet-200 dark:to-purple-200 bg-clip-text text-transparent transition-all duration-200 leading-tight">
                  CrochetCraft
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -mt-0.5 translate-y-1 group-hover:translate-y-0">
                  Handmade with love
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 relative bg-slate-100/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-full p-1.5 border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/30">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 group/nav",
                      isActive
                        ? "text-white"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {/* Active background */}
                    {isActive && (
                      <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full shadow-lg shadow-violet-500/30 dark:shadow-violet-500/40" />
                    )}
                    
                    {/* Hover background */}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-full bg-white/0 dark:bg-white/0 group-hover/nav:bg-white dark:group-hover/nav:bg-slate-700 transition-all duration-300 scale-90 opacity-0 group-hover/nav:scale-100 group-hover/nav:opacity-100 shadow-sm" />
                    )}
                    
                    <span className="relative z-10 flex items-center gap-2">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <ThemeToggle />

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn(
                  "relative p-2.5 rounded-xl transition-all duration-300 group/search",
                  searchOpen
                    ? "bg-violet-100 dark:bg-violet-900/50 scale-95"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
                )}
                aria-label="Search"
              >
                <Search
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    searchOpen 
                      ? "text-violet-600 dark:text-violet-400 rotate-90 scale-90" 
                      : "text-slate-500 dark:text-slate-400 group-hover/search:text-slate-700 dark:group-hover/search:text-slate-200"
                  )}
                />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2.5 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 hidden sm:flex group/wish relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-slate-500 dark:text-slate-400 transition-all duration-300 group-hover/wish:text-pink-500 group-hover/wish:scale-110 group-hover/wish:fill-pink-500" />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2.5 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105 relative group/cart"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-slate-500 dark:text-slate-400 transition-all duration-300 group-hover/cart:text-violet-600 dark:group-hover/cart:text-violet-400 group-hover/cart:scale-110" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg shadow-violet-500/40 animate-[bounceIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* User / Auth */}
              {mounted && user ? (
                <div className="relative ml-1" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={cn(
                      "flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 group/user",
                      userMenuOpen
                        ? "bg-slate-100 dark:bg-slate-800 ring-2 ring-violet-500/30"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <div className="relative">
                      {/* Avatar glow */}
                      <div className={cn(
                        "absolute inset-0 rounded-xl bg-gradient-to-br blur-md opacity-50 transition-opacity duration-300 group-hover/user:opacity-80",
                        avatarGradient
                      )} />
                      <div
                        className={cn(
                          "relative w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center font-bold text-sm text-white shadow-lg transition-all duration-300",
                          avatarGradient,
                          userMenuOpen ? "scale-95" : "group-hover/user:scale-105"
                        )}
                      >
                        {userInitial || <User className="w-4 h-4" />}
                      </div>
                    </div>
                    
                    {/* Chevron indicator */}
                    <ChevronRight 
                      className={cn(
                        "w-4 h-4 text-slate-400 transition-all duration-300 hidden sm:block",
                        userMenuOpen ? "rotate-90" : "group-hover/user:translate-x-0.5"
                      )} 
                    />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-[99] bg-black/10 dark:bg-black/30 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div
                        className="absolute right-0 top-full mt-3 w-72 rounded-2xl overflow-hidden z-[100] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 animate-[dropdownIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{ transformOrigin: "top right" }}
                      >
                        {/* User Info Header */}
                        <div className="relative px-5 py-5 overflow-hidden">
                          {/* Gradient background */}
                          <div className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-10 dark:opacity-20",
                            avatarGradient
                          )} />
                          
                          {/* Decorative circles */}
                          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-2xl" />
                          
                          <div className="relative flex items-center gap-4">
                            <div className="relative">
                              <div className={cn(
                                "absolute inset-0 rounded-2xl bg-gradient-to-br blur-lg opacity-60",
                                avatarGradient
                              )} />
                              <div
                                className={cn(
                                  "relative w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shadow-xl",
                                  avatarGradient
                                )}
                              >
                                {userInitial || "?"}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-slate-800 dark:text-white truncate flex items-center gap-2">
                                {profile?.full_name || "User"}
                                {profile?.role?.toLowerCase()?.trim() === "admin" && (
                                  <Crown className="w-4 h-4 text-amber-500" />
                                )}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

                        {/* Menu Items */}
                        <div className="py-2 px-2">
                          {[
                            { href: "/profile", icon: User, label: "My Profile", color: "violet" },
                            { href: "/orders", icon: Package, label: "Orders", color: "blue" },
                            { href: "/wishlist", icon: Heart, label: "Wishlist", color: "pink" },
                            { href: "/chat", icon: MessageCircle, label: "Messages", color: "emerald" },
                          ].map((item, i) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="group/menu flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              style={{
                                animation: `slideInRight 0.2s ease-out ${0.05 * (i + 1)}s both`,
                              }}
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover/menu:scale-110",
                                item.color === "violet" && "bg-violet-100 dark:bg-violet-900/30",
                                item.color === "blue" && "bg-blue-100 dark:bg-blue-900/30",
                                item.color === "pink" && "bg-pink-100 dark:bg-pink-900/30",
                                item.color === "emerald" && "bg-emerald-100 dark:bg-emerald-900/30",
                              )}>
                                <item.icon className={cn(
                                  "w-5 h-5 transition-colors duration-200",
                                  item.color === "violet" && "text-violet-600 dark:text-violet-400",
                                  item.color === "blue" && "text-blue-600 dark:text-blue-400",
                                  item.color === "pink" && "text-pink-600 dark:text-pink-400",
                                  item.color === "emerald" && "text-emerald-600 dark:text-emerald-400",
                                )} />
                              </div>
                              <span className="flex-1 text-slate-700 dark:text-slate-200 font-medium">{item.label}</span>
                              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 -translate-x-2 group-hover/menu:opacity-100 group-hover/menu:translate-x-0 transition-all duration-200" />
                            </Link>
                          ))}

                          {profile?.role?.toLowerCase()?.trim() === "admin" && (
                            <>
                              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent my-2" />
                              <Link
                                href="/admin"
                                className="group/menu flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-300 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 border border-violet-200/50 dark:border-violet-700/30"
                                style={{
                                  animation: "slideInRight 0.2s ease-out 0.25s both",
                                }}
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 transition-all duration-300 group-hover/menu:scale-110">
                                  <LayoutDashboard className="w-5 h-5 text-white" />
                                </div>
                                <span className="flex-1 font-semibold bg-gradient-to-r from-violet-700 to-purple-700 dark:from-violet-300 dark:to-purple-300 bg-clip-text text-transparent">
                                  Admin Dashboard
                                </span>
                                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                              </Link>
                            </>
                          )}
                        </div>

                        {/* Sign Out */}
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                        <div className="p-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLogout();
                            }}
                            className="group/logout flex items-center gap-3 px-3 py-3 text-sm w-full rounded-xl transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            style={{
                              animation: "slideInRight 0.2s ease-out 0.3s both",
                            }}
                          >
                            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center transition-all duration-300 group-hover/logout:scale-110 group-hover/logout:bg-red-200 dark:group-hover/logout:bg-red-900/50">
                              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="flex-1 text-left text-red-600 dark:text-red-400 font-medium">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : mounted && !user ? (
                <Link
                  href="/auth/login"
                  className="relative ml-2 text-sm font-semibold py-2.5 px-6 rounded-xl text-white overflow-hidden group/signin transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 dark:hover:shadow-violet-500/40 hover:scale-105 active:scale-95"
                >
                  {/* Button background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600" />
                  
                  {/* Animated shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/signin:translate-x-full transition-transform duration-700 ease-in-out" />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 blur-xl opacity-0 group-hover/signin:opacity-50 transition-opacity duration-300" />
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Sign In
                  </span>
                </Link>
              ) : (
                <div className="w-14 h-10 ml-2 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2.5 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden ml-1 hover:scale-105 active:scale-95 relative"
                aria-label="Menu"
              >
                <div className="relative w-5 h-5">
                  <Menu
                    className={cn(
                      "w-5 h-5 absolute inset-0 text-slate-700 dark:text-slate-200 transition-all duration-300",
                      menuOpen
                        ? "rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                    )}
                  />
                  <X
                    className={cn(
                      "w-5 h-5 absolute inset-0 text-slate-700 dark:text-slate-200 transition-all duration-300",
                      menuOpen
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                    )}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="mt-4 animate-[searchSlideDown_0.35s_cubic-bezier(0.34,1.56,0.64,1)]">
              <form onSubmit={handleSearch}>
                <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 opacity-0 focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
                  
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for crochet products..."
                    className="w-full pl-12 pr-12 py-4 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-600 hover:scale-105 animate-[scaleIn_0.2s_ease-out]"
                    >
                      <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </button>
                  )}
                </div>
              </form>
              
              {/* Quick suggestions */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs text-slate-500 dark:text-slate-400">Popular:</span>
                {["Amigurumi", "Baby Blanket", "Keychain", "Bouquet"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      router.push(`/products?search=${term}`);
                      setSearchOpen(false);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300 transition-all duration-200 hover:scale-105"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 mx-4 rounded-2xl overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 animate-[mobileMenuIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
            <nav className="flex flex-col p-3 gap-1">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "group/mobile flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                        : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                    style={{
                      animation: `slideInRight 0.25s ease-out ${i * 0.05}s both`,
                    }}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                      isActive 
                        ? "bg-white/20" 
                        : "bg-slate-100 dark:bg-slate-800 group-hover/mobile:scale-110"
                    )}>
                      <link.icon className={cn(
                        "w-5 h-5",
                        isActive ? "text-white" : "text-slate-500 dark:text-slate-400"
                      )} />
                    </div>
                    <span className="flex-1">{link.label}</span>
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-all duration-200",
                        isActive 
                          ? "text-white/70" 
                          : "text-slate-300 dark:text-slate-600 opacity-0 -translate-x-2 group-hover/mobile:opacity-100 group-hover/mobile:translate-x-0"
                      )}
                    />
                  </Link>
                );
              })}
              
              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent my-2" />
              
              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="group/mobile flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                style={{
                  animation: `slideInRight 0.25s ease-out ${navLinks.length * 0.05}s both`,
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center transition-all duration-300 group-hover/mobile:scale-110">
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>
                <span className="flex-1">Wishlist</span>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 -translate-x-2 group-hover/mobile:opacity-100 group-hover/mobile:translate-x-0 transition-all duration-200" />
              </Link>
            </nav>
          </div>
        )}
      </header>
      
      {/* Spacer */}
      <div className="h-20" />

      {/* Keyframes */}
      <style>{`
        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes searchSlideDown {
          from {
            opacity: 0;
            transform: translateY(-12px) scaleY(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }
        @keyframes mobileMenuIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}