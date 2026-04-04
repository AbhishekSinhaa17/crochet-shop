'use client';

import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ProductGrid from "@/components/products/ProductGrid";
import { drand } from "@/lib/drand";

interface FeaturedProductsSectionProps {
  products: any[];
}

export default function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 120);
    
    const fetchAdminStatus = async () => {
      try {
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.profile?.role?.toLowerCase()?.trim() === "admin") {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Error fetching admin status:", e);
      }
    };
    fetchAdminStatus();

    return () => clearTimeout(t);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const x = 8 + drand(i, 1) * 84; // %
      const y = 10 + drand(i, 2) * 70; // %
      const s = 4 + drand(i, 3) * 10; // px
      const huePick = Math.floor(drand(i, 4) * 3); // 0..2
      const color =
        huePick === 0
          ? "rgba(147, 51, 234, "
          : huePick === 1
            ? "rgba(236, 72, 153, "
            : "rgba(251, 146, 60, ";
      const a = 0.18 + drand(i, 5) * 0.28;

      const dur = 7 + drand(i, 6) * 7;
      const delay = drand(i, 7) * 2.5;
      return { i, x, y, s, color, a, dur, delay };
    });
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes orbitFloat {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0.55; }
          50% { transform: translate3d(0, -10px, 0) rotate(6deg); opacity: 0.9; }
        }

        @keyframes sparkleShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes glowPulse {
          0%, 100% { filter: blur(60px); opacity: 0.35; transform: scale(1); }
          50% { filter: blur(80px); opacity: 0.6; transform: scale(1.05); }
        }

        @keyframes sweepLine {
          0% { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateX(120%) skewX(-15deg); opacity: 0; }
        }

        @keyframes floatUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-float-orbit { animation: orbitFloat 7s ease-in-out infinite; }
        .animate-glow-pulse { animation: glowPulse 5.5s ease-in-out infinite; }
        .animate-sweep { animation: sweepLine 1.8s ease-in-out infinite; }
        .animate-float-up { animation: floatUp 0.7s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .animate-float-orbit,
          .animate-glow-pulse,
          .animate-sweep {
            animation: none !important;
          }
          * { scroll-behavior: auto !important; }
        }
      `}</style>

      <section className="pt-4 pb-12 relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-b from-muted/30 via-muted/50 to-muted/30 dark:from-muted/10 dark:via-muted/20 dark:to-muted/10" />
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(147,51,234,.7) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(147,51,234,.7) 1px, transparent 1px)`,
              backgroundSize: "56px 56px",
            }}
          />

          {/* Glow orbs */}
          <div
            className="absolute top-[-220px] left-[-120px] w-[520px] h-[520px] rounded-full bg-primary/10 dark:bg-primary/20 animate-glow-pulse"
          />
          <div
            className="absolute bottom-[-240px] right-[-160px] w-[620px] h-[620px] rounded-full bg-pink-500/10 dark:bg-pink-500/20 animate-glow-pulse"
            style={{ animationDelay: "1.6s" }}
          />

          {/* Top/bottom hairlines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Side decorations (fill empty spaces) */}
        <div className="absolute inset-y-0 left-0 w-28 sm:w-36 lg:w-44 pointer-events-none">
          {/* yarn balls */}
          <div className="absolute top-[18%] left-4 w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-pink-500/15 border border-primary/20 blur-[0.2px] shadow-premium animate-float-orbit" />
          <div className="absolute top-[52%] left-7 w-14 h-14 rounded-full bg-linear-to-br from-amber-500/20 to-pink-500/15 border border-amber-500/20 animate-float-orbit" style={{ animationDelay: "1s" }} />
          {/* hook-like line */}
          <svg className="absolute top-[30%] left-0 w-full h-40 opacity-30 dark:opacity-20" viewBox="0 0 120 160" fill="none">
            <path
              d="M20 10 C40 40, 20 60, 40 90 C60 120, 40 140, 20 150"
              stroke="url(#leftGlow)"
              strokeWidth="1"
              strokeDasharray="5 6"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="leftGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333ea" stopOpacity="0" />
                <stop offset="50%" stopColor="#9333ea" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* mini glass badges */}
          <div className="absolute top-[72%] left-6 w-12 h-12 rounded-2xl bg-background/70 dark:bg-background/50 border border-border/60 backdrop-blur-md shadow-premium flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="absolute inset-y-0 right-0 w-28 sm:w-36 lg:w-44 pointer-events-none">
          <div className="absolute top-[22%] right-5 w-22 h-22 rounded-full bg-linear-to-br from-emerald-500/18 to-blue-500/14 border border-emerald-500/20 shadow-premium animate-float-orbit" style={{ animationDelay: "0.6s" }} />
          <div className="absolute top-[56%] right-8 w-14 h-14 rounded-full bg-linear-to-br from-violet-500/18 to-amber-500/14 border border-violet-500/20 animate-float-orbit" style={{ animationDelay: "1.4s" }} />
          <svg className="absolute top-[35%] right-0 w-full h-44 opacity-30 dark:opacity-20" viewBox="0 0 120 160" fill="none">
            <path
              d="M100 10 C80 40, 100 62, 80 92 C60 122, 80 140, 100 150"
              stroke="url(#rightGlow)"
              strokeWidth="1"
              strokeDasharray="5 6"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="rightGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute top-[74%] right-6 w-12 h-12 rounded-2xl bg-background/70 dark:bg-background/50 border border-border/60 backdrop-blur-md shadow-premium flex items-center justify-center">
            <Crown className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <div
              key={`particle-feat-${p.i}`}
              className="rounded-full"
              style={{
                position: "absolute",
                top: `${p.y}%`,
                left: `${p.x}%`,
                width: `${p.s}px`,
                height: `${p.s}px`,
                background: `linear-gradient(135deg, ${p.color}${p.a}), rgba(255,255,255,0)`,
                filter: "blur(1px)",
                animation: `orbitFloat ${p.dur}s ease-in-out ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <div className={isLoaded ? "animate-float-up" : ""}>
              <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 backdrop-blur-sm">
                <Crown className="w-4 h-4" />
                <span>Editor’s Choice</span>
                <span className="absolute -right-2 -top-2 w-16 h-6 rounded-full bg-primary/20 blur-[10px] animate-sweep" />
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 leading-[1.05]">
                Featured{" "}
                <span className="bg-linear-to-r from-primary via-primary/80 to-pink-500 bg-clip-text text-transparent">
                  Creations
                </span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-xl">
                Handpicked crochet masterpieces crafted with premium yarns and endless attention to detail.
              </p>
            </div>


          </div>

          {/* Product Grid */}
          <ProductGrid products={products || []} showHeader={false} isAdmin={isAdmin} />


        </div>
      </section>
    </>
  );
}