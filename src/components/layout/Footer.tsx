"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  Scissors,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Heart,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Send,
  Youtube,
  Star,
  Gift,
  Truck,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const features = [
    { icon: Truck, label: "Free Shipping", desc: "On orders over ₹999" },
    { icon: Shield, label: "Secure Payment", desc: "100% protected" },
    { icon: Gift, label: "Gift Wrapping", desc: "Available on request" },
    { icon: Star, label: "Premium Quality", desc: "Handcrafted items" },
  ];

  return (
    <footer className="relative overflow-hidden mt-20 transition-colors duration-500 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-t border-slate-200/80 dark:border-slate-800/80">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/8 to-rose-500/8 dark:from-pink-500/15 dark:to-rose-500/15 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 dark:from-indigo-500/10 dark:to-cyan-500/10 rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite_4s]" />

        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-violet-400 to-pink-400 dark:from-violet-500 dark:to-pink-500"
            style={{
              width: `${3 + (i % 3) * 3}px`,
              height: `${3 + (i % 3) * 3}px`,
              bottom: `${20 + i * 15}%`,
              left: `${10 + i * 18}%`,
              opacity: 0.2,
              animation: `float ${5 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 dark:via-violet-400/50 to-transparent" />

      {/* Features Bar */}
      <div className="relative border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.label}
                className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-lg hover:shadow-violet-500/5 dark:hover:shadow-violet-500/10"
                style={{
                  animation: `footerFadeUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-violet-500 group-hover:to-purple-600 border border-violet-200/50 dark:border-violet-700/50 group-hover:border-transparent">
                    <feature.icon className="w-5 h-5 text-violet-600 dark:text-violet-400 transition-colors duration-300 group-hover:text-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                    {feature.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div
            className="lg:col-span-1"
            style={{ animation: "footerFadeUp 0.6s ease-out both" }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-6 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-pulse" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30 dark:shadow-violet-500/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-8deg] overflow-hidden">
                  {/* Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  <Scissors className="w-6 h-6 text-white relative z-10 transition-transform duration-300 group-hover:rotate-12" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-violet-900 to-purple-900 dark:from-white dark:via-violet-200 dark:to-purple-200 bg-clip-text text-transparent">
                  CrochetCraft
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -mt-0.5">
                  Handmade with love
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-xs">
              Handmade with love, each piece tells a story. Discover unique
              crochet creations crafted with care and passion for every
              occasion.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                {
                  icon: Instagram,
                  label: "Instagram",
                  hoverColor: "from-pink-500 to-purple-500",
                  hoverShadow: "shadow-pink-500/40",
                },
                {
                  icon: Facebook,
                  label: "Facebook",
                  hoverColor: "from-blue-500 to-blue-600",
                  hoverShadow: "shadow-blue-500/40",
                },
                {
                  icon: Youtube,
                  label: "YouTube",
                  hoverColor: "from-red-500 to-red-600",
                  hoverShadow: "shadow-red-500/40",
                },
              ].map(({ icon: Icon, label, hoverColor, hoverShadow }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="group/social relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  {/* Hover gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${hoverColor} opacity-0 group-hover/social:opacity-100 transition-opacity duration-300`}
                  />
                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${hoverColor} blur-xl opacity-0 group-hover/social:opacity-50 transition-opacity duration-300 ${hoverShadow}`}
                  />
                  <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400 relative z-10 transition-all duration-300 group-hover/social:text-white group-hover/social:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ animation: "footerFadeUp 0.6s ease-out 0.1s both" }}>
            <h3 className="font-bold text-base mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              Quick Links
            </h3>
            <ul className="space-y-1">
              {[
                { href: "/products", label: "All Products" },
                { href: "/products?category=amigurumi", label: "Amigurumi" },
                { href: "/products?category=home-decor", label: "Home Decor" },
                { href: "/custom-order", label: "Custom Orders" },
                { href: "/products?category=baby-items", label: "Baby Items" },
              ].map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group/link flex items-center gap-2 text-sm py-2 px-3 -mx-3 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400"
                    style={{
                      animation: `footerSlideIn 0.3s ease-out ${0.15 + i * 0.05}s both`,
                    }}
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 text-violet-500" />
                    <span className="transition-all duration-200 group-hover/link:translate-x-1">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div style={{ animation: "footerFadeUp 0.6s ease-out 0.2s both" }}>
            <h3 className="font-bold text-base mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Heart className="w-4 h-4 text-white" />
              </div>
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/return-policy", label: "Returns Policy" },
                { href: "#", label: "Terms of Service" },
                { href: "#", label: "Privacy Policy" },
                { href: "/faq", label: "FAQ" },
              ].map((link, i) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group/link flex items-center gap-2 text-sm py-2 px-3 -mx-3 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400"
                    style={{
                      animation: `footerSlideIn 0.3s ease-out ${0.25 + i * 0.05}s both`,
                    }}
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 text-pink-500" />
                    <span className="transition-all duration-200 group-hover/link:translate-x-1">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div style={{ animation: "footerFadeUp 0.6s ease-out 0.3s both" }}>
            <h3 className="font-bold text-base mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Mail className="w-4 h-4 text-white" />
              </div>
              Contact Us
            </h3>
            <ul className="space-y-2">
              {[
                {
                  icon: MapPin,
                  text: "123 Craft Lane, Creative City, IN 560001",
                  href: "#",
                  color: "violet",
                },
                {
                  icon: Phone,
                  text: "+91 98765 43210",
                  href: "tel:+919876543210",
                  color: "blue",
                },
                {
                  icon: Mail,
                  text: "hello@crochetcraft.in",
                  href: "mailto:hello@crochetcraft.in",
                  color: "emerald",
                },
              ].map(({ icon: Icon, text, href, color }, i) => (
                <li
                  key={text}
                  style={{
                    animation: `footerSlideIn 0.3s ease-out ${0.35 + i * 0.05}s both`,
                  }}
                >
                  <a
                    href={href}
                    className="group/contact flex items-start gap-3 p-3 -mx-3 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover/contact:scale-110 ${
                        color === "violet"
                          ? "bg-violet-100 dark:bg-violet-900/30"
                          : color === "blue"
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : "bg-emerald-100 dark:bg-emerald-900/30"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          color === "violet"
                            ? "text-violet-600 dark:text-violet-400"
                            : color === "blue"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      />
                    </div>
                    <div className="flex items-start gap-1 pt-2 min-w-0">
                      <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-200 group-hover/contact:text-slate-800 dark:group-hover/contact:text-slate-200 break-words">
                        {text}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 opacity-0 -translate-x-1 translate-y-1 group-hover/contact:opacity-100 group-hover/contact:translate-x-0 group-hover/contact:translate-y-0 transition-all duration-300 shrink-0 mt-0.5" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div
          className="relative mt-16 p-8 sm:p-10 rounded-3xl overflow-hidden"
          style={{ animation: "footerFadeUp 0.6s ease-out 0.4s both" }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-pink-500/5 dark:from-violet-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl" />

          {/* Border */}
          <div className="absolute inset-0 rounded-3xl border border-slate-200/80 dark:border-slate-700/80" />

          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 dark:from-violet-500/30 dark:via-purple-500/30 dark:to-pink-500/30 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3 h-3" />
                Newsletter
              </div>
              <h3 className="font-bold text-2xl text-slate-800 dark:text-white mb-2">
                Stay in the loop 🧶
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Get updates on new patterns, exclusive offers, and crafting
                inspiration delivered to your inbox.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
            >
              <div className="relative flex-1 lg:w-72">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl blur opacity-0 focus-within:opacity-20 transition-opacity duration-300" />
                <div className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm focus-within:shadow-lg focus-within:border-violet-400 dark:focus-within:border-violet-500 transition-all duration-300">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                    disabled={subscribed}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={subscribed}
                className="group/sub relative px-8 py-4 rounded-xl text-sm font-bold text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 dark:hover:shadow-violet-500/40 hover:scale-105 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600" />

                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/sub:translate-x-full transition-transform duration-700 ease-in-out" />

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 blur-xl opacity-0 group-hover/sub:opacity-50 transition-opacity duration-300" />

                <span className="relative z-10 flex items-center gap-2">
                  {subscribed ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 transition-transform duration-300 group-hover/sub:translate-x-1" />
                      Subscribe
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80"
          style={{ animation: "footerFadeUp 0.6s ease-out 0.5s both" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 order-2 md:order-1">
              © {currentYear} CrochetCraft. All rights reserved.
            </p>

            {/* Bottom Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 order-1 md:order-2">
              {["Privacy Policy", "Terms of Service", "Cookies"].map(
                (label) => (
                  <a
                    key={label}
                    href="#"
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 relative group/link"
                  >
                    {label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 group-hover/link:w-full transition-all duration-300" />
                  </a>
                ),
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 order-3">
              <span>Made with</span>
              <span className="relative inline-flex">
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-[heartbeat_1.5s_ease-in-out_infinite]" />
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500 absolute inset-0 animate-ping opacity-30" />
              </span>
              <span>&</span>
              <span className="text-lg">🧶</span>
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes footerFadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes footerSlideIn {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }
        
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.15);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </footer>
  );
}
