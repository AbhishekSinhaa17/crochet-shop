"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cartStore";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Heart, User, Menu, X, Search, LogOut, Package, MessageCircle, LayoutDashboard, ChevronDown, Sparkles, Crown, ArrowRight, Flower2, Star, Gift, Zap, TrendingUp, Clock, ChevronRight, Scissors } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { user, profile, signOut } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerLoading, setHeaderLoading] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());
  const clearCart = useCartStore((s) => s.clearCart);
  const setItems = useCartStore((s) => s.setItems);
  const setWishlistItems = useWishlistStore((s) => s.setItems);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const wishlistCount = useWishlistStore((s) => s.items.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Fetch individual cart for the user
    const fetchCart = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("cart_items")
          .select("*, product:products(*)")
          .eq("user_id", userId);
        
        if (error) throw error;
        
        if (data) {
          const cartProducts = data.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            compare_price: item.product.compare_price,
            image: item.product.images?.[0] || "",
            stock: item.product.stock,
            quantity: item.quantity,
          }));
          setItems(cartProducts);
        }
      } catch (err) {
        console.error("Cart Fetch Error:", err);
      }
    };

    // Fetch individual wishlist for the user
    const fetchWishlist = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("wishlist")
          .select("product_id")
          .eq("user_id", userId);
        
        if (error) throw error;
        
        if (data) {
          setWishlistItems(data.map((item: any) => item.product_id));
        }
      } catch (err) {
        console.error("Wishlist Fetch Error:", err);
      }
    };

    if (user) {
      fetchCart(user.id);
      fetchWishlist(user.id);
    } else if (mounted) {
      clearCart(false); // Clear local items only, preserve DB
      clearWishlist();
    }
  }, [user, mounted, setItems, setWishlistItems, clearCart, clearWishlist]);

  useEffect(() => {
    const handleFocus = async () => {
      await supabase.auth.refreshSession();
      console.log("Session refreshed on focus");
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
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

  // Keyboard listeners for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  const handleLogout = async () => {
    // Clear local state only - don't sync-delete from DB before the session is actually closed
    clearCart(false);
    clearWishlist();
    
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
    { href: "/#about-us", label: "About", icon: Star },
    {
      href: "/custom-order",
      label: "Custom Order",
      icon: Sparkles,
      highlight: true,
    },
  ];

  if (pathname?.startsWith("/admin")) return null;

  const userInitial = profile?.full_name?.charAt(0)?.toUpperCase();
  const isAdmin = profile?.role?.toLowerCase()?.trim() === "admin";

  return (
    <>
      {/* ========== FULL SCREEN SEARCH ========== */}
      <div
        className={cn(
          "fixed inset-0 z-100 transition-all duration-700",
          searchOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Animated Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSearchOpen(false);
          }}
          className="absolute top-6 right-6 z-50 p-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 group"
          aria-label="Close search"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Search Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <div
            className={cn(
              "w-full max-w-3xl transition-all duration-700 delay-100",
              searchOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12",
            )}
          >
            {/* Search Label */}
            <p className="text-white/60 text-sm font-medium mb-4 tracking-wider uppercase">
              Search our collection
            </p>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-pink-500 via-purple-500 to-violet-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for handmade treasures..."
                    className="w-full pl-16 pr-6 py-6 text-xl md:text-2xl font-light bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>
            </form>

            {/* Popular Searches */}
            <div className="mt-10">
              <p className="text-white/40 text-sm font-medium mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending searches
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { term: "Amigurumi", emoji: "🧸" },
                  { term: "Baby Blankets", emoji: "👶" },
                  { term: "Flower Bouquet", emoji: "💐" },
                  { term: "Keychains", emoji: "🔑" },
                  { term: "Bags & Totes", emoji: "👜" },
                  { term: "Home Decor", emoji: "🏠" },
                ].map((item, i) => (
                  <button
                    key={item.term}
                    onClick={() => {
                      router.push(`/products?search=${item.term}`);
                      setSearchOpen(false);
                    }}
                    className="group flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span className="text-lg group-hover:scale-125 transition-transform duration-300">
                      {item.emoji}
                    </span>
                    {item.term}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div className="mt-10">
              <p className="text-white/40 text-sm font-medium mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Crochet flowers", "Stuffed animals"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      router.push(`/products?search=${term}`);
                      setSearchOpen(false);
                    }}
                    className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 text-sm transition-all duration-300"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== MAIN HEADER ========== */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "py-2" : "py-2.5 md:py-3",
        )}
      >
        {/* Background Layer */}
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500",
            scrolled
              ? "bg-white/70 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50"
              : "bg-transparent",
          )}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* ========== LOGO ========== */}
            <Link
              href="/"
              className="relative flex items-center gap-3 group z-10"
            >
              {/* Logo Glow */}
              <div className="absolute -inset-4 bg-linear-to-r from-pink-500/20 via-purple-500/20 to-violet-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Logo Icon */}
              <div className="relative">
                {/* Spinning Border */}
                <div className="absolute -inset-1 bg-linear-to-r from-pink-500 via-purple-500 to-violet-500 rounded-2xl opacity-75 group-hover:opacity-100 blur-sm transition-opacity duration-500 animate-spin-slow" />

                {/* Icon Container */}
                <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-[#C2185B] to-[#9C27B0] flex items-center justify-center shadow-xl shadow-purple-500/25 group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-105 overflow-hidden">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  <Scissors className="w-6 h-6 text-white relative z-10" />
                </div>

                {/* Floating Sparkle */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-linear-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              {/* Logo Text */}
              <div className="hidden sm:flex flex-col">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Strokes
                  </span>
                  <span className="text-3xl font-black bg-linear-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent tracking-tight">
                    of Craft
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Handmade with love
                </span>
              </div>
            </Link>

            {/* ========== DESKTOP NAVIGATION ========== */}
            <nav ref={navRef} className="hidden lg:flex items-center">
              <div className="relative flex items-center bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full p-1 border border-slate-200/50 dark:border-slate-700/50">
                {/* Animated Hover Background */}
                <div
                  className={cn(
                    "absolute h-10 bg-white dark:bg-slate-700 rounded-full shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 transition-all duration-300 ease-out",
                    hoveredNav ? "opacity-100" : "opacity-0",
                  )}
                  style={{
                    left: hoveredNav
                      ? `${(navRef.current?.querySelector(`[data-nav="${hoveredNav}"]`) as HTMLElement)?.offsetLeft || 0}px`
                      : 0,
                    width: hoveredNav
                      ? `${(navRef.current?.querySelector(`[data-nav="${hoveredNav}"]`) as HTMLElement)?.offsetWidth || 0}px`
                      : 0,
                  }}
                />

                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      data-nav={link.href}
                      onMouseEnter={() => setHoveredNav(link.href)}
                      onMouseLeave={() => setHoveredNav(null)}
                      className={cn(
                        "relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 z-10",
                        isActive
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
                        link.highlight &&
                          !isActive &&
                          "text-purple-600 dark:text-purple-400",
                      )}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}

                      {/* Active Indicator */}
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50" />
                      )}

                      {/* Highlight Badge */}
                      {link.highlight && (
                        <span className="px-2 py-0.5 rounded-full bg-linear-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wide shadow-lg shadow-orange-500/30">
                          New
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* ========== ACTIONS ========== */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />

                {/* Keyboard Shortcut Hint */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                  ⌘K
                </span>
              </button>

              {/* Wishlist */}
              {!isAdmin && (
                <Link
                  href="/wishlist"
                  className="relative hidden sm:flex p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-all duration-300 group"
                >
                  <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <Heart className="absolute inset-0 m-auto w-5 h-5 text-pink-500 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-125 transition-all duration-500 fill-pink-500" />
                  
                  {/* Wishlist Badge */}
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center">
                      <span className="absolute w-4 h-4 bg-pink-500 rounded-full animate-ping opacity-75" />
                      <span className="relative w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-lg">
                        {wishlistCount}
                      </span>
                    </span>
                  )}
                </Link>
              )}

              {/* Cart */}
              {!isAdmin && (
                <Link
                  href="/cart"
                  className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all duration-300 group"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />

                  {/* Cart Badge */}
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center">
                      <span className="absolute w-5 h-5 bg-linear-to-r from-pink-500 to-purple-600 rounded-full animate-ping opacity-75" />
                      <span className="relative w-5 h-5 bg-linear-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                        {itemCount}
                      </span>
                    </span>
                  )}
                </Link>
              )}

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-linear-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent mx-1" />

              {/* ========== USER MENU ========== */}
              {mounted && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={cn(
                      "flex items-center gap-3 p-1 rounded-2xl transition-all duration-300 group",
                      userMenuOpen
                        ? "bg-slate-100 dark:bg-slate-800 ring-2 ring-purple-500/30"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800",
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="relative w-9 h-9 rounded-lg bg-linear-to-br from-pink-500 via-purple-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg overflow-hidden">
                        {userInitial || <User className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* ========== DROPDOWN MENU ========== */}
                  {userMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />

                      {/* Dropdown */}
                      <div className="absolute right-0 top-full mt-3 w-72 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
                        <div className="relative bg-[#0F172A] rounded-2xl shadow-2xl border border-white/5 overflow-hidden">
                          {/* Top Section */}
                          <div className="p-5 border-b border-white/5">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                                {userInitial || "A"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white text-lg truncate">{profile?.full_name || "Abhishek Sinha"}</p>
                                <p className="text-sm text-slate-500 truncate">{user.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Links */}
                          <div className="py-2 border-b border-white/5">
                            {[
                              { label: "Profile", icon: User, href: "/profile" },
                              { label: "Orders", icon: Package, href: "/orders" },
                              ...(!isAdmin ? [{ label: "Wishlist", icon: Heart, href: "/wishlist" }] : []),
                              { label: "Messages", icon: MessageCircle, href: "/chat" },
                            ].map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                              >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.label}</span>
                              </Link>
                            ))}
                          </div>

                          {/* Admin Section */}
                          {isAdmin && (
                            <div className="py-2 border-b border-white/5">
                              <Link
                                href="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center justify-between px-5 py-3 text-purple-400 hover:text-purple-300 hover:bg-white/5 transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <LayoutDashboard className="w-5 h-5" />
                                  <span className="text-sm font-bold">Admin Dashboard</span>
                                </div>
                                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                              </Link>
                            </div>
                          )}

                          {/* Footer / Logout */}
                          <div className="py-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-5 py-3 text-red-500 hover:bg-red-500/5 transition-all duration-200"
                            >
                              <LogOut className="w-5 h-5" />
                              <span className="text-sm font-bold">Sign out</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : mounted ? (
                <Link
                  href="/auth/login"
                  className="relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden group transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                >
                  {/* Animated Gradient Background */}
                  <div className="absolute inset-0 bg-linear-to-r from-pink-500 via-purple-600 to-violet-600 bg-size-[200%_100%] animate-gradient-x" />

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  <Sparkles className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Sign In</span>
                </Link>
              ) : (
                <div className="w-24 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
              >
                <div className="relative w-5 h-5">
                  <span
                    className={cn(
                      "absolute top-1 left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-300",
                      menuOpen && "top-[9px] rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute top-[9px] left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-300",
                      menuOpen && "opacity-0 translate-x-2",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute bottom-1 left-0 w-5 h-0.5 bg-current rounded-full transition-all duration-300",
                      menuOpen && "bottom-[9px] -rotate-45",
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ========== MOBILE MENU ========== */}
        <div
          className={cn(
            "lg:hidden fixed inset-0 z-40 transition-all duration-500",
            menuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            className={cn(
              "absolute top-20 left-4 right-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden transition-all duration-500",
              menuOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-8 opacity-0",
            )}
          >
            {/* Gradient Top Border */}
            <div className="h-1 bg-linear-to-r from-pink-500 via-purple-500 to-violet-500" />

            {/* Nav Links */}
            <nav className="p-4">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl mb-2 transition-all duration-300",
                      isActive
                        ? "bg-linear-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                    )}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                        isActive
                          ? "bg-linear-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
                      )}
                    >
                      <link.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{link.label}</p>
                      {link.highlight && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                          <Sparkles className="w-3 h-3" />
                          Popular choice
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  </Link>
                );
              })}

              {/* Wishlist Link */}
              {!isAdmin && (
                <Link
                  href="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center text-pink-500">
                    <Heart className="w-5 h-5" />
                  </div>
                  <p className="flex-1 font-semibold">Wishlist</p>
                  <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                </Link>
              )}
            </nav>

            {/* Promo Banner */}
            <div className="mx-4 mb-4 p-4 rounded-2xl bg-linear-to-r from-purple-500/10 via-pink-500/10 to-violet-500/10 border border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Free Shipping
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    On orders over ₹999
                  </p>
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="px-4 pb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div
        className={cn(
          "transition-all duration-500",
          scrolled ? "h-16" : "h-18 md:h-20",
        )}
      />

      {/* ========== GLOBAL STYLES ========== */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-in {
          animation-duration: 0.3s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both;
        }

        .fade-in {
          animation-name: fadeIn;
        }

        .slide-in-from-top-2 {
          animation-name: slideInFromTop;
        }

        .slide-in-from-top-3 {
          animation-name: slideInFromTop3;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromTop3 {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
