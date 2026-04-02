'use client';

import { Sparkles, Shield, Truck, Gift, Heart, Award, Clock, Crown, Star, Gem, Palette, Scissors } from "lucide-react";

export default function TrustMarquee() {
  const topItems = [
    { icon: Sparkles, text: 'Handmade with Love', color: 'from-violet-500 to-purple-500', bg: 'from-violet-500/10 to-purple-500/10' },
    { icon: Shield, text: '100% Quality Assured', color: 'from-emerald-500 to-teal-500', bg: 'from-emerald-500/10 to-teal-500/10' },
    { icon: Truck, text: 'Free Shipping ₹999+', color: 'from-blue-500 to-cyan-500', bg: 'from-blue-500/10 to-cyan-500/10' },
    { icon: Heart, text: '100+ Happy Customers', color: 'from-rose-500 to-red-500', bg: 'from-rose-500/10 to-red-500/10' },
    { icon: Award, text: 'Premium Yarn Only', color: 'from-amber-500 to-orange-500', bg: 'from-amber-500/10 to-orange-500/10' },
  ];

  const bottomItems = [
    { icon: Clock, text: 'Fast 10 Day Delivery', color: 'from-indigo-500 to-violet-500', bg: 'from-indigo-500/10 to-violet-500/10' },
    { icon: Crown, text: 'Exclusive Designs', color: 'from-amber-500 to-yellow-500', bg: 'from-amber-500/10 to-yellow-500/10' },
    { icon: Star, text: '4.9★ Customer Rating', color: 'from-yellow-500 to-amber-500', bg: 'from-yellow-500/10 to-amber-500/10' },
    { icon: Gem, text: 'Unique Creations', color: 'from-purple-500 to-pink-500', bg: 'from-purple-500/10 to-pink-500/10' },
    { icon: Palette, text: 'Custom Colors Available', color: 'from-teal-500 to-emerald-500', bg: 'from-teal-500/10 to-emerald-500/10' },
    { icon: Scissors, text: 'Artisan Craftsmanship', color: 'from-rose-500 to-pink-500', bg: 'from-rose-500/10 to-pink-500/10' },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.6;
          }
        }

        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes shimmer-bg {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
        }

        .animate-marquee-reverse {
          animation: marquee-reverse 35s linear infinite;
        }

        .animate-marquee:hover,
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }

        .animate-float-particle {
          animation: float-particle 4s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }

        .glass-item {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.7) 100%
          );
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.06),
            0 1px 3px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .dark .glass-item {
          background: linear-gradient(
            135deg,
            rgba(30, 30, 45, 0.8) 0%,
            rgba(20, 20, 35, 0.7) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.3),
            0 1px 3px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }

        .icon-glow {
          filter: drop-shadow(0 0 8px currentColor);
        }

        .group:hover .icon-glow {
          filter: drop-shadow(0 0 12px currentColor);
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee,
          .animate-marquee-reverse {
            animation: none;
          }
        }
      `}</style>

      <section className="relative py-8 lg:py-10 overflow-hidden">
        {/* === BACKGROUND === */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-linear-to-b from-violet-50/50 via-white to-rose-50/50 dark:from-slate-900 dark:via-slate-950 dark:to-violet-950/30" />
          
          {/* Animated gradient orbs */}
          <div 
            className="absolute w-[500px] h-[500px] rounded-full opacity-30 dark:opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
              top: '-250px',
              left: '10%',
            }}
          />
          <div 
            className="absolute w-[400px] h-[400px] rounded-full opacity-30 dark:opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
              bottom: '-200px',
              right: '15%',
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
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* === FLOATING DECORATIONS === */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-particle pointer-events-none"
            style={{
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              background: `linear-gradient(135deg, 
                rgba(${i % 3 === 0 ? '147, 51, 234' : i % 3 === 1 ? '236, 72, 153' : '251, 146, 60'}, 0.4), 
                transparent)`,
              top: `${20 + Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        {/* === TOP DECORATIVE LINE === */}
        <div className="absolute top-0 left-0 right-0 h-px">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-rose-500/20 to-transparent animate-pulse-subtle" />
        </div>

        {/* === BOTTOM DECORATIVE LINE === */}
        <div className="absolute bottom-0 left-0 right-0 h-px">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-rose-500/20 to-transparent animate-pulse-subtle" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* === SECTION HEADER === */}
        <div className="relative z-10 text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-violet-500/10 to-rose-500/10 border border-violet-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-semibold bg-linear-to-r from-violet-600 to-rose-500 bg-clip-text text-transparent">
              Why Choose Us
            </span>
            <Sparkles className="w-4 h-4 text-rose-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Crafted with <span className="bg-linear-to-r from-violet-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">Excellence</span>
          </h2>
        </div>

        {/* === FIRST MARQUEE ROW === */}
        <div className="relative z-10 mb-6">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
          
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex items-center gap-6 px-3">
                {topItems.map((item, i) => (
                  <div 
                    key={`${setIdx}-${i}`} 
                    className="group flex items-center gap-4 px-6 py-4 rounded-2xl glass-item cursor-default transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {/* Icon container */}
                    <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br ${item.bg}`}>
                      <div className={`absolute inset-0 rounded-xl bg-linear-to-br ${item.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
                      <item.icon className={`relative w-6 h-6 bg-linear-to-br ${item.color} bg-clip-text transition-transform duration-300 group-hover:scale-110`} style={{ color: `rgb(var(--${item.color.split('-')[1]}-500))` }} />
                      <item.icon className={`absolute w-6 h-6 bg-linear-to-r ${item.color} opacity-80 transition-all duration-300 group-hover:opacity-100`} />
                    </div>
                    
                    {/* Text */}
                    <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors duration-300 whitespace-nowrap">
                      {item.text}
                    </span>
                    
                    {/* Separator dot */}
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${item.color} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* === SECOND MARQUEE ROW (REVERSE) === */}
        <div className="relative z-10">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
          
          <div className="flex animate-marquee-reverse whitespace-nowrap">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex items-center gap-6 px-3">
                {bottomItems.map((item, i) => (
                  <div 
                    key={`${setIdx}-${i}`} 
                    className="group flex items-center gap-4 px-6 py-4 rounded-2xl glass-item cursor-default transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {/* Icon container */}
                    <div className={`relative flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br ${item.bg}`}>
                      <div className={`absolute inset-0 rounded-xl bg-linear-to-br ${item.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
                      <item.icon className={`absolute w-6 h-6 bg-linear-to-r ${item.color} opacity-80 transition-all duration-300 group-hover:opacity-100`} />
                    </div>
                    
                    {/* Text */}
                    <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors duration-300 whitespace-nowrap">
                      {item.text}
                    </span>
                    
                    {/* Separator dot */}
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${item.color} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* === BOTTOM STATS BAR === */}
        <div className="relative z-10 mt-12">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
              {[
                { value: '100+', label: 'Happy Customers', icon: Heart, color: 'from-rose-500 to-pink-500' },
                { value: '500+', label: 'Products Sold', icon: Gift, color: 'from-violet-500 to-purple-500' },
                { value: '4.9/5', label: 'Average Rating', icon: Star, color: 'from-amber-500 to-yellow-500' },
                { value: '100%', label: 'Handmade', icon: Sparkles, color: 'from-emerald-500 to-teal-500' },
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="group flex items-center gap-4 cursor-default"
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br ${stat.color} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className={`text-2xl lg:text-3xl font-black bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === DECORATIVE YARN BALLS === */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-violet-200/40 to-violet-300/30 dark:from-violet-800/20 dark:to-violet-900/15 animate-float-particle" style={{ animationDuration: '6s' }}>
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-violet-400/20 animate-spin" style={{ animationDuration: '20s' }} />
              <div className="absolute inset-4 rounded-full bg-linear-to-br from-violet-300/30 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-6 w-14 h-14 rounded-full bg-linear-to-br from-rose-200/40 to-rose-300/30 dark:from-rose-800/20 dark:to-rose-900/15 animate-float-particle" style={{ animationDuration: '5s', animationDelay: '1s' }}>
              <div className="absolute inset-1 rounded-full border border-dashed border-rose-400/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            </div>
          </div>
        </div>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-amber-200/40 to-amber-300/30 dark:from-amber-800/20 dark:to-amber-900/15 animate-float-particle" style={{ animationDuration: '7s', animationDelay: '0.5s' }}>
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-amber-400/20 animate-spin" style={{ animationDuration: '25s' }} />
            </div>
            <div className="absolute -top-6 -left-4 w-12 h-12 rounded-full bg-linear-to-br from-emerald-200/40 to-emerald-300/30 dark:from-emerald-800/20 dark:to-emerald-900/15 animate-float-particle" style={{ animationDuration: '4s', animationDelay: '2s' }}>
              <div className="absolute inset-1 rounded-full border border-dashed border-emerald-400/20 animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse' }} />
            </div>
          </div>
        </div>

        {/* === CORNER ACCENTS === */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-linear-to-br from-violet-500/5 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-linear-to-tl from-rose-500/5 via-transparent to-transparent blur-3xl pointer-events-none" />
      </section>
    </>
  );
}