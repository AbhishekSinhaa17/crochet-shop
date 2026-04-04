'use client';

import Link from "next/link";
import Image from "next/image";
import { Sparkles, Layers, Package, ArrowRight, Star, Heart, Gem, Crown } from "lucide-react";
import { drand } from "@/lib/drand";
import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

interface CategoryBentoProps {
  categories: Category[];
}

export default function CategoryBento({ categories }: CategoryBentoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sizes = [
    'col-span-12 md:col-span-12 lg:col-span-4 row-span-2', // Massive Featured Item
    'col-span-6 md:col-span-6 lg:col-span-4 row-span-1',   // Top Middle
    'col-span-6 md:col-span-6 lg:col-span-4 row-span-1',   // Top Right
    'col-span-6 md:col-span-6 lg:col-span-4 row-span-1',   // Bottom Middle
    'col-span-6 md:col-span-6 lg:col-span-4 row-span-1',   // Bottom Right
  ];

  const gradients = [
    'from-violet-500 via-purple-500 to-fuchsia-500',
    'from-rose-500 via-pink-500 to-red-500',
    'from-amber-500 via-orange-500 to-yellow-500',
    'from-emerald-500 via-teal-500 to-cyan-500',
    'from-blue-500 via-indigo-500 to-violet-500',
  ];

  const iconColors = [
    'text-violet-500',
    'text-rose-500',
    'text-amber-500',
    'text-emerald-500',
    'text-blue-500',
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }

        @keyframes float-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
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

        @keyframes border-dance {
          0%, 100% { 
            clip-path: inset(0 0 95% 0);
          }
          25% { 
            clip-path: inset(0 0 0 95%);
          }
          50% { 
            clip-path: inset(95% 0 0 0);
          }
          75% { 
            clip-path: inset(0 95% 0 0);
          }
        }

        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }

        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% auto; }
        .animate-gradient { animation: gradient-shift 6s ease infinite; background-size: 200% 200%; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-border-dance { animation: border-dance 4s linear infinite; }
        .animate-scale-in { animation: scale-in 0.6s ease-out forwards; }

        .text-gradient-primary {
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
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

        .bento-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .bento-card:hover {
          transform: translateY(-8px) scale(1.02);
          z-index: 10;
        }

        .bento-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #9333ea, #ec4899, #f97316, #ec4899, #9333ea);
          background-size: 200% 200%;
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          animation: gradient-shift 4s linear infinite;
          transition: opacity 0.4s ease;
        }

        .bento-card:hover::before {
          opacity: 1;
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

      <section className="pt-8 pb-4 lg:pt-12 lg:pb-6 relative overflow-hidden">
        {/* === BACKGROUND === */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-white via-violet-50/30 to-rose-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/20" />
          
          {/* Animated gradient orbs */}
          <div 
            className="absolute w-[800px] h-[800px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, transparent 70%)',
              top: '10%',
              left: '-200px',
            }}
          />
          <div 
            className="absolute w-[600px] h-[600px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
              bottom: '10%',
              right: '-150px',
              animationDelay: '2s',
            }}
          />
          <div 
            className="absolute w-[500px] h-[500px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.08) 0%, transparent 70%)',
              top: '50%',
              left: '30%',
              animationDelay: '4s',
            }}
          />

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Noise texture */}
          <div className="noise-texture" />
        </div>

        {/* === LEFT SIDE DECORATIONS === */}
        <div className="absolute left-0 top-0 bottom-0 w-32 lg:w-48 pointer-events-none">
          {/* Yarn balls */}
          <div className="absolute top-[20%] left-4 lg:left-8 animate-float-slow">
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-linear-to-br from-violet-200/50 to-violet-300/30 dark:from-violet-800/30 dark:to-violet-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-violet-400/30 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full bg-linear-to-br from-violet-300/40 to-transparent" />
            </div>
          </div>

          <div className="absolute top-[50%] left-6 lg:left-12 animate-float-medium" style={{ animationDelay: '1s' }}>
            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-linear-to-br from-rose-200/50 to-rose-300/30 dark:from-rose-800/30 dark:to-rose-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-rose-400/30 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>

          <div className="absolute bottom-[20%] left-4 lg:left-8 animate-float-fast" style={{ animationDelay: '2s' }}>
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-linear-to-br from-amber-200/50 to-amber-300/30 dark:from-amber-800/30 dark:to-amber-900/20 shadow-lg">
              <div className="absolute inset-3 rounded-full border border-dashed border-amber-400/30 animate-spin-slow" />
            </div>
          </div>

          {/* Floating icons */}
          <div className="absolute top-[35%] left-8 lg:left-14 animate-float-fast" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl glass-card shadow-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
          </div>

          <div className="absolute bottom-[40%] left-2 lg:left-6 animate-float-slow" style={{ animationDelay: '1.5s' }}>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          {/* Decorative line */}
          <svg className="absolute top-[60%] left-0 w-full h-32 opacity-30 dark:opacity-20" viewBox="0 0 100 128">
            <path 
              d="M0 64 Q 40 32, 60 64 T 100 64" 
              fill="none" 
              stroke="url(#leftCategoryGradient)" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <defs>
              <linearGradient id="leftCategoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333ea" stopOpacity="0" />
                <stop offset="50%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* === RIGHT SIDE DECORATIONS === */}
        <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-48 pointer-events-none">
          {/* Yarn balls */}
          <div className="absolute top-[25%] right-4 lg:right-8 animate-float-medium">
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-linear-to-br from-emerald-200/50 to-emerald-300/30 dark:from-emerald-800/30 dark:to-emerald-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-emerald-400/30 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>

          <div className="absolute top-[55%] right-6 lg:right-12 animate-float-slow" style={{ animationDelay: '2s' }}>
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-linear-to-br from-pink-200/50 to-pink-300/30 dark:from-pink-800/30 dark:to-pink-900/20 shadow-lg">
              <div className="absolute inset-3 rounded-full border-2 border-dashed border-pink-400/30 animate-spin-slow" />
            </div>
          </div>

          <div className="absolute bottom-[15%] right-4 lg:right-8 animate-float-fast" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-linear-to-br from-blue-200/50 to-blue-300/30 dark:from-blue-800/30 dark:to-blue-900/20 shadow-lg" />
          </div>

          {/* Floating icons */}
          <div className="absolute top-[40%] right-8 lg:right-14 animate-float-fast" style={{ animationDelay: '0.8s' }}>
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl glass-card shadow-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          <div className="absolute bottom-[35%] right-2 lg:right-6 animate-float-medium" style={{ animationDelay: '2.5s' }}>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Gem className="w-5 h-5 text-violet-500" />
            </div>
          </div>

          {/* Decorative line */}
          <svg className="absolute top-[30%] right-0 w-full h-32 opacity-30 dark:opacity-20" viewBox="0 0 100 128">
            <path 
              d="M100 64 Q 60 96, 40 64 T 0 64" 
              fill="none" 
              stroke="url(#rightCategoryGradient)" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <defs>
              <linearGradient id="rightCategoryGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* === FLOATING PARTICLES === */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`bento-particle-${i}`}
            className="absolute rounded-full animate-float-slow pointer-events-none"
            style={{
              width: `${4 + drand(i, 20) * 6}px`,
              height: `${4 + drand(i, 20) * 6}px`,
              background: `linear-gradient(135deg, 
                rgba(${i % 3 === 0 ? '147, 51, 234' : i % 3 === 1 ? '236, 72, 153' : '251, 146, 60'}, ${0.3 + drand(i, 21) * 0.3}), 
                transparent)`,
              top: `${10 + drand(i, 22) * 80}%`,
              left: `${10 + drand(i, 23) * 80}%`,
              animationDuration: `${5 + drand(i, 24) * 5}s`,
              animationDelay: `${drand(i, 25) * 3}s`,
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* === MAIN CONTENT === */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          
          {/* Section Header */}
          <div 
            className={`text-center mb-10 lg:mb-12 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-badge shadow-lg mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-purple-500 shadow-md">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gradient-primary">
                Curated Collections
              </span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            
            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Shop by{' '}
              <span className="relative inline-block">
                <span className="text-gradient-primary">Category</span>
                <svg 
                  className="absolute -bottom-2 left-0 w-full h-4" 
                  viewBox="0 0 200 16" 
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M0 12 Q 50 4, 100 10 T 200 8" 
                    fill="none" 
                    stroke="url(#categoryUnderline)" 
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    strokeDashoffset={isLoaded ? 0 : 200}
                    style={{ transition: 'stroke-dashoffset 1.2s ease-out 0.4s' }}
                  />
                  <defs>
                    <linearGradient id="categoryUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h2>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our thoughtfully curated collections of 
              <span className="text-foreground font-semibold"> unique crochet creations</span>, 
              each crafted with love and attention to detail
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[200px]">
            {(categories || []).map((cat, idx) => {
              const isLarge = idx === 0;
              const gradient = gradients[idx % gradients.length];
              const iconColor = iconColors[idx % iconColors.length];

              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`bento-card group relative rounded-3xl overflow-hidden cursor-pointer ${sizes[idx] || 'col-span-6 md:col-span-4'}`}
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-linear-to-br ${gradient.replace('from-', 'from-').split(' ').map(c => c.includes('from-') || c.includes('via-') || c.includes('to-') ? c.replace('500', '100') : c).join(' ')} dark:${gradient.replace('from-', 'from-').split(' ').map(c => c.includes('from-') || c.includes('via-') || c.includes('to-') ? c.replace('500', '900/30') : c).join(' ')}`}>
                        <div className="relative">
                          <div className={`absolute inset-0 bg-linear-to-br ${gradient} blur-2xl opacity-30 animate-pulse-glow`} />
                          <Sparkles className={`relative ${isLarge ? 'w-24 h-24' : 'w-16 h-16'} ${iconColor} opacity-40`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent transition-all duration-500" />
                  <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-all duration-500`} />
                  
                  {/* Animated border */}
                  <div className={`absolute inset-0 rounded-3xl border-2 border-transparent bg-linear-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-border-dance`} style={{ backgroundClip: 'border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Top accent line */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-full bg-linear-to-r ${gradient} w-0 group-hover:w-2/3 transition-all duration-500`} />

                  {/* Corner decoration */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                      <ArrowRight className="w-5 h-5 text-white -rotate-45" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    {/* Category badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-badge shadow-lg w-fit mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <Package className={`w-4 h-4 ${iconColor}`} />
                      <span className="text-xs font-semibold text-foreground">View Collection</span>
                    </div>

                    <h3 className={`${isLarge ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'} font-bold text-white mb-3 transition-all duration-300 group-hover:translate-y-0`}>
                      {cat.name}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-white/80 group-hover:text-white transition-all duration-300">
                      <span className="text-sm font-medium">Explore Now</span>
                      <div className={`w-8 h-8 rounded-full bg-linear-to-r ${gradient} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110`}>
                        <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Number badge */}
                  <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                    <span className={`text-6xl md:text-7xl lg:text-8xl font-black text-white`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* View All Button */}
          <div 
            className={`text-center mt-16 transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-4 px-8 py-4 rounded-2xl font-bold glass-card shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-linear-to-r from-violet-500 via-purple-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative text-foreground group-hover:text-white transition-colors duration-300">
                View All Collections
              </span>
              
              <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-500 group-hover:from-white/20 group-hover:to-white/10 flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110">
                <ArrowRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* === CORNER ACCENTS === */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-violet-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-rose-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-linear-to-l from-amber-500/8 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-linear-to-r from-violet-500/8 to-transparent blur-3xl pointer-events-none" />
      </section>
    </>
  );
}