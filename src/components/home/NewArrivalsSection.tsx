'use client';

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  Star,
  Gift,
  Heart,
  Gem,
  Crown,
  Timer,
  Rocket
} from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";

interface NewArrivalsSectionProps {
  products: any[];
}

export default function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Deterministic random for SSR
  const drand = (i: number, seed: number) => {
    const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      x: 5 + drand(i, 1) * 90,
      y: 5 + drand(i, 2) * 90,
      size: 4 + drand(i, 3) * 8,
      duration: 6 + drand(i, 4) * 6,
      delay: drand(i, 5) * 4,
      colorIdx: Math.floor(drand(i, 6) * 3),
    }));
  }, []);

  const highlights = [
    { icon: Flame, text: 'Hot & Trending', color: 'from-orange-500 to-red-500' },
    { icon: Clock, text: 'Just Dropped', color: 'from-cyan-500 to-blue-500' },
    { icon: Star, text: 'Limited Edition', color: 'from-amber-500 to-yellow-500' },
    { icon: Gift, text: 'Perfect Gifts', color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }

        @keyframes float-reverse {
          0%, 100% { transform: translateY(-12px) rotate(0deg); }
          50% { transform: translateY(6px) rotate(-3deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes particle-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-12px) translateX(6px); opacity: 0.6; }
          50% { transform: translateY(-6px) translateX(-6px); opacity: 0.4; }
          75% { transform: translateY(-16px) translateX(4px); opacity: 0.7; }
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes sweep-shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }

        @keyframes countdown-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-float-gentle { animation: float-gentle 8s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 7s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% auto; }
        .animate-gradient-shift { animation: gradient-shift 6s ease infinite; background-size: 200% 200%; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.6s ease-out forwards; }
        .animate-sweep-shine { animation: sweep-shine 3s ease-in-out infinite; }
        .animate-countdown-pulse { animation: countdown-pulse 1s ease-in-out infinite; }

        .text-gradient-primary {
          background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        .text-gradient-fire {
          background: linear-gradient(135deg, #f97316 0%, #ef4444 50%, #ec4899 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        .glass-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.7) 100%
          );
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .dark .glass-card {
          background: linear-gradient(
            135deg,
            rgba(30, 30, 45, 0.9) 0%,
            rgba(20, 20, 35, 0.8) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-badge {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .dark .glass-badge {
          background: rgba(30, 30, 45, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .shadow-glow-cyan {
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.3), 0 0 60px rgba(6, 182, 212, 0.15);
        }

        .noise-texture {
          position: absolute;
          inset: 0;
          opacity: 0.02;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .dark .noise-texture {
          opacity: 0.04;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <section className="py-10 lg:py-12 relative overflow-hidden">
        {/* === BACKGROUND === */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/30 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/20" />
          
          {/* Animated gradient orbs */}
          <div 
            className="absolute w-[800px] h-[800px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
              top: '-200px',
              right: '-200px',
            }}
          />
          <div 
            className="absolute w-[600px] h-[600px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              bottom: '-150px',
              left: '-100px',
              animationDelay: '2s',
            }}
          />
          <div 
            className="absolute w-[500px] h-[500px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
              top: '40%',
              left: '30%',
              animationDelay: '4s',
            }}
          />

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Noise texture */}
          <div className="noise-texture" />
        </div>

        {/* === LEFT SIDE DECORATIONS === */}
        <div className="absolute left-0 top-0 bottom-0 w-28 lg:w-44 pointer-events-none">
          {/* Yarn balls */}
          <div className="absolute top-[18%] left-4 lg:left-8 animate-float-gentle">
            <div className="w-18 h-18 lg:w-26 lg:h-26 rounded-full bg-gradient-to-br from-cyan-200/50 to-cyan-300/30 dark:from-cyan-800/30 dark:to-cyan-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-cyan-400/30 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-300/40 to-transparent" />
            </div>
          </div>

          <div className="absolute top-[48%] left-6 lg:left-12 animate-float-reverse" style={{ animationDelay: '1s' }}>
            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-blue-200/50 to-blue-300/30 dark:from-blue-800/30 dark:to-blue-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-blue-400/30 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>

          <div className="absolute bottom-[22%] left-4 lg:left-8 animate-float-gentle" style={{ animationDelay: '2s' }}>
            <div className="w-16 h-16 lg:w-22 lg:h-22 rounded-full bg-gradient-to-br from-violet-200/50 to-violet-300/30 dark:from-violet-800/30 dark:to-violet-900/20 shadow-lg">
              <div className="absolute inset-3 rounded-full border border-dashed border-violet-400/30 animate-spin-slow" />
            </div>
          </div>

          {/* Floating icons */}
          <div className="absolute top-[32%] left-6 lg:left-12 animate-bounce-subtle hidden lg:flex">
            <div className="w-12 h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-cyan-500" />
            </div>
          </div>

          <div className="absolute bottom-[38%] left-3 lg:left-6 animate-float-gentle hidden lg:flex" style={{ animationDelay: '1.5s' }}>
            <div className="w-10 h-10 rounded-lg glass-card shadow-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          {/* Curved line */}
          <svg className="absolute top-[58%] left-0 w-full h-40 opacity-30 dark:opacity-20" viewBox="0 0 100 160">
            <path 
              d="M0 80 Q 45 35, 65 80 T 100 80" 
              fill="none" 
              stroke="url(#leftNewGradient)" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <defs>
              <linearGradient id="leftNewGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* === RIGHT SIDE DECORATIONS === */}
        <div className="absolute right-0 top-0 bottom-0 w-28 lg:w-44 pointer-events-none">
          {/* Yarn balls */}
          <div className="absolute top-[22%] right-4 lg:right-8 animate-float-reverse">
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-orange-200/50 to-orange-300/30 dark:from-orange-800/30 dark:to-orange-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-orange-400/30 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>

          <div className="absolute top-[52%] right-6 lg:right-12 animate-float-gentle" style={{ animationDelay: '2s' }}>
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-pink-200/50 to-pink-300/30 dark:from-pink-800/30 dark:to-pink-900/20 shadow-lg">
              <div className="absolute inset-3 rounded-full border-2 border-dashed border-pink-400/30 animate-spin-slow" />
            </div>
          </div>

          <div className="absolute bottom-[18%] right-4 lg:right-8 animate-float-reverse" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 lg:w-18 lg:h-18 rounded-full bg-gradient-to-br from-emerald-200/50 to-emerald-300/30 dark:from-emerald-800/30 dark:to-emerald-900/20 shadow-lg" />
          </div>

          {/* Floating icons */}
          <div className="absolute top-[36%] right-6 lg:right-12 animate-bounce-subtle hidden lg:flex" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
          </div>

          <div className="absolute bottom-[32%] right-3 lg:right-6 animate-float-reverse hidden lg:flex" style={{ animationDelay: '2.5s' }}>
            <div className="w-10 h-10 rounded-lg glass-card shadow-lg flex items-center justify-center">
              <Gem className="w-4 h-4 text-violet-500" />
            </div>
          </div>

          {/* Curved line */}
          <svg className="absolute top-[42%] right-0 w-full h-40 opacity-30 dark:opacity-20" viewBox="0 0 100 160">
            <path 
              d="M100 80 Q 55 125, 35 80 T 0 80" 
              fill="none" 
              stroke="url(#rightNewGradient)" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <defs>
              <linearGradient id="rightNewGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* === FLOATING PARTICLES === */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.x + p.y}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: `linear-gradient(135deg, 
                  rgba(${p.colorIdx === 0 ? '6, 182, 212' : p.colorIdx === 1 ? '59, 130, 246' : '139, 92, 246'}, ${0.3 + Math.random() * 0.3}), 
                  transparent)`,
                filter: 'blur(1px)',
                animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* === MAIN CONTENT === */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <div 
              className={`space-y-5 transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Badge with pulse effect */}
              <div className="inline-flex items-center gap-3">
                <div className="relative">
                  <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-badge shadow-lg shadow-glow-cyan">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-md">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      {/* Pulse rings */}
                      <span className="absolute inset-0 rounded-lg border-2 border-cyan-500/60 animate-[pulse-ring_2s_ease-out_infinite]" />
                      <span className="absolute inset-0 rounded-lg border-2 border-cyan-500/40 animate-[pulse-ring_2s_ease-out_infinite_0.5s]" />
                    </div>
                    <span className="text-sm font-bold text-gradient-primary">Fresh Arrivals</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                </div>

                {/* Live countdown */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-md">
                  <Timer className="w-4 h-4 text-orange-500" />
                  <div className="flex items-center gap-1 font-mono text-sm font-bold">
                    <span className="text-foreground animate-countdown-pulse">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="text-foreground animate-countdown-pulse">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-muted-foreground">:</span>
                    <span className="text-foreground animate-countdown-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">until next drop</span>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]">
                New{' '}
                <span className="relative inline-block">
                  <span className="text-gradient-primary">Creations</span>
                  <svg 
                    className="absolute -bottom-2 left-0 w-full h-4" 
                    viewBox="0 0 200 16" 
                    preserveAspectRatio="none"
                  >
                    <path 
                      d="M0 10 Q 50 4, 100 10 T 200 8" 
                      fill="none" 
                      stroke="url(#newUnderline)" 
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="200"
                      strokeDashoffset={isLoaded ? 0 : 200}
                      style={{ transition: 'stroke-dashoffset 1.2s ease-out 0.4s' }}
                    />
                    <defs>
                      <linearGradient id="newUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h2>

              <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Just off our craft table, 
                <span className="text-foreground font-semibold"> ready to find their new home</span>. 
                Grab them before they&apos;re gone!
              </p>

              {/* Highlight tags */}
              <div className="flex flex-wrap gap-3 pt-2">
                {highlights.map((item, idx) => (
                  <div 
                    key={item.text}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default"
                  >
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            

          </div>

          {/* Product Grid */}
          <ProductGrid products={products || []} showHeader={false} />


        </div>

        {/* === CORNER ACCENTS === */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-gradient-to-l from-violet-500/8 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-gradient-to-r from-cyan-500/8 to-transparent blur-3xl pointer-events-none" />
      </section>
    </>
  );
}