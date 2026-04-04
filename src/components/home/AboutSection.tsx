'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { drand } from "@/lib/drand";
import { 
  Sparkles,
  Heart,
  Scissors,
  ArrowRight,
  Award,
  Crown,
  Gem,
  Zap,
  Quote,
  Users,
  Shield,
  Palette,
  Play
} from "lucide-react";

export default function AboutSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeValue, setActiveValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearTimeout(interval);
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      x: 5 + drand(i, 1) * 90,
      y: 5 + drand(i, 2) * 90,
      size: 4 + drand(i, 3) * 8,
      duration: 8 + drand(i, 4) * 8,
      delay: drand(i, 5) * 5,
      colorIdx: Math.floor(drand(i, 6) * 3),
    }));
  }, []);

  const stats = [
    { number: "100+", label: "Happy Customers", icon: Users, color: "from-rose-500 to-pink-600" },
    { number: "100+", label: "Unique Designs", icon: Gem, color: "from-violet-500 to-purple-600" },
    { number: "2+", label: "Years Experience", icon: Award, color: "from-amber-500 to-orange-600" },
    { number: "100%", label: "Handmade", icon: Heart, color: "from-emerald-500 to-teal-600" },
  ];


  const values = [
    { icon: Heart, title: "Passion", desc: "Every stitch made with love" },
    { icon: Gem, title: "Quality", desc: "Only premium materials used" },
    { icon: Users, title: "Community", desc: "Building connections through craft" },
    { icon: Sparkles, title: "Creativity", desc: "Unique designs for unique people" },
  ];



  return (
    <>
      <style jsx global>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes float-reverse {
          0%, 100% { transform: translateY(-15px) rotate(0deg); }
          50% { transform: translateY(8px) rotate(-4deg); }
        }

        @keyframes float-diagonal {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, -15px) rotate(3deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
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

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes particle-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          25% { transform: translateY(-15px) translateX(8px); opacity: 0.5; }
          50% { transform: translateY(-8px) translateX(-8px); opacity: 0.3; }
          75% { transform: translateY(-20px) translateX(5px); opacity: 0.6; }
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.15); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }

        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
          75% { border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%; }
        }

        @keyframes image-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }

        @keyframes value-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(147, 51, 234, 0); }
        }

        .animate-float-gentle { animation: float-gentle 10s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 8s ease-in-out infinite; }
        .animate-float-diagonal { animation: float-diagonal 12s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% auto; }
        .animate-gradient-shift { animation: gradient-shift 8s ease infinite; background-size: 200% 200%; }
        .animate-spin-slow { animation: spin-slow 25s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 20s linear infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.8s ease-out forwards; }
        .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
        .animate-morph { animation: morph 15s ease-in-out infinite; }
        .animate-image-float { animation: image-float 6s ease-in-out infinite; }
        .animate-value-pulse { animation: value-pulse 2s ease-in-out infinite; }

        .text-gradient-primary {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        .text-gradient-purple {
          background: linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc, #a855f7, #8b5cf6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        .glass-premium {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.85) 100%
          );
          backdrop-filter: blur(24px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 2px 8px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .dark .glass-premium {
          background: linear-gradient(
            135deg,
            rgba(30, 30, 50, 0.95) 0%,
            rgba(20, 20, 40, 0.9) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .dark .glass-card {
          background: rgba(30, 30, 50, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .shadow-glow-purple {
          box-shadow: 
            0 0 40px rgba(147, 51, 234, 0.25),
            0 0 80px rgba(147, 51, 234, 0.12),
            0 20px 60px rgba(0, 0, 0, 0.1);
        }

        .image-container {
          position: relative;
        }

        .image-container::before {
          content: '';
          position: absolute;
          inset: -4px;
          background: linear-gradient(135deg, #a855f7, #ec4899, #f97316, #10b981, #6366f1, #a855f7);
          background-size: 300% 300%;
          border-radius: inherit;
          z-index: -1;
          animation: gradient-shift 6s ease infinite;
          opacity: 0.7;
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

      <section id="about-us" className="py-10 lg:py-12 relative overflow-hidden">
        {/* === BACKGROUND === */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-violet-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950" />
          
          {/* Animated gradient orbs */}
          <div 
            className="absolute w-[800px] h-[800px] rounded-full animate-pulse-glow animate-morph"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 60%)',
              top: '-200px',
              right: '-200px',
            }}
          />
          <div 
            className="absolute w-[600px] h-[600px] rounded-full animate-pulse-glow animate-morph"
            style={{
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 60%)',
              bottom: '-150px',
              left: '-100px',
              animationDelay: '3s',
            }}
          />
          <div 
            className="absolute w-[500px] h-[500px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 60%)',
              top: '40%',
              left: '30%',
              animationDelay: '6s',
            }}
          />

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.8) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />

          {/* Noise texture */}
          <div className="noise-texture" />
        </div>

        {/* === LEFT SIDE DECORATIONS === */}
        <div className="absolute left-0 top-0 bottom-0 w-28 lg:w-48 pointer-events-none">
          {/* Yarn balls */}
          <div className="absolute top-[15%] left-4 lg:left-10 animate-float-gentle">
            <div className="relative w-18 h-18 lg:w-28 lg:h-28">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-violet-300/50 to-violet-400/30 dark:from-violet-700/40 dark:to-violet-800/30 shadow-xl">
                <div className="absolute inset-3 rounded-full border-2 border-dashed border-violet-400/40 animate-spin-slow" />
                <div className="absolute inset-5 rounded-full bg-linear-to-br from-violet-200/50 to-transparent" />
              </div>
            </div>
          </div>

          <div className="absolute top-[45%] left-6 lg:left-14 animate-float-reverse" style={{ animationDelay: '1.5s' }}>
            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-linear-to-br from-rose-300/50 to-rose-400/30 dark:from-rose-700/40 dark:to-rose-800/30 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-rose-400/40 animate-spin-reverse" />
            </div>
          </div>

          <div className="absolute bottom-[25%] left-4 lg:left-8 animate-float-diagonal" style={{ animationDelay: '3s' }}>
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-linear-to-br from-amber-300/50 to-amber-400/30 dark:from-amber-700/40 dark:to-amber-800/30 shadow-lg">
              <div className="absolute inset-3 rounded-full border-2 border-dashed border-amber-400/40 animate-spin-slow" />
            </div>
          </div>

          {/* Floating icons */}
          <div className="absolute top-[30%] left-6 lg:left-12 animate-bounce-subtle hidden lg:flex">
            <div className="w-12 h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-violet-500" />
            </div>
          </div>

          <div className="absolute bottom-[40%] left-3 lg:left-6 animate-float-gentle hidden lg:flex" style={{ animationDelay: '2s' }}>
            <div className="w-10 h-10 rounded-lg glass-card shadow-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </div>
          </div>

          {/* Curved line */}
          <svg className="absolute top-[55%] left-0 w-full h-48 opacity-40 dark:opacity-25" viewBox="0 0 100 200" fill="none">
            <path 
              d="M10 20 C 40 60, 20 100, 50 140 C 80 180, 30 200, 60 240" 
              stroke="url(#leftAboutGradient)" 
              strokeWidth="1.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="leftAboutGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* === RIGHT SIDE DECORATIONS === */}
        <div className="absolute right-0 top-0 bottom-0 w-28 lg:w-48 pointer-events-none">
          {/* Yarn balls */}
          <div className="absolute top-[20%] right-4 lg:right-10 animate-float-reverse">
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-linear-to-br from-emerald-300/50 to-emerald-400/30 dark:from-emerald-700/40 dark:to-emerald-800/30 shadow-xl">
              <div className="absolute inset-3 rounded-full border-2 border-dashed border-emerald-400/40 animate-spin-reverse" />
            </div>
          </div>

          <div className="absolute top-[50%] right-6 lg:right-14 animate-float-gentle" style={{ animationDelay: '2.5s' }}>
            <div className="w-18 h-18 lg:w-28 lg:h-28 rounded-full bg-linear-to-br from-pink-300/50 to-pink-400/30 dark:from-pink-700/40 dark:to-pink-800/30 shadow-lg">
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-pink-400/40 animate-spin-slow" />
            </div>
          </div>

          <div className="absolute bottom-[20%] right-4 lg:right-8 animate-float-diagonal" style={{ animationDelay: '1s' }}>
            <div className="w-14 h-14 lg:w-18 lg:h-18 rounded-full bg-linear-to-br from-blue-300/50 to-blue-400/30 dark:from-blue-700/40 dark:to-blue-800/30 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-blue-400/40 animate-spin-reverse" />
            </div>
          </div>

          {/* Floating icons */}
          <div className="absolute top-[35%] right-6 lg:right-12 animate-bounce-subtle hidden lg:flex" style={{ animationDelay: '0.7s' }}>
            <div className="w-12 h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          <div className="absolute bottom-[35%] right-3 lg:right-6 animate-float-reverse hidden lg:flex" style={{ animationDelay: '3.5s' }}>
            <div className="w-10 h-10 rounded-lg glass-card shadow-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-500" />
            </div>
          </div>

          {/* Curved line */}
          <svg className="absolute top-[40%] right-0 w-full h-48 opacity-40 dark:opacity-25" viewBox="0 0 100 200" fill="none">
            <path 
              d="M90 20 C 60 60, 80 100, 50 140 C 20 180, 70 200, 40 240" 
              stroke="url(#rightAboutGradient)" 
              strokeWidth="1.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="rightAboutGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* === FLOATING PARTICLES === */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: `linear-gradient(135deg, 
                  rgba(${
                    p.colorIdx === 0 ? '147, 51, 234' : 
                    p.colorIdx === 1 ? '236, 72, 153' : '251, 146, 60'
                  }, ${0.25 + drand(i, 60) * 0.35}), 
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
          <div 
            className={`text-center mb-10 lg:mb-12 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-premium shadow-lg mb-6">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gradient-purple">Our Story</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.1]">
              <span className="block">Handcrafted with</span>
              <span className="block text-gradient-primary mt-2">Love & Passion</span>
            </h2>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              What started as a simple hobby blossomed into a mission to bring 
              <span className="text-foreground font-semibold"> handmade magic </span>
              into every home.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
            
            {/* Left: Image Montage */}
            <div 
              className={`relative transition-all duration-1000 delay-200 ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              {/* Main Image Container */}
              <div className="relative z-10 group">
                {/* Glow Effect */}
                <div className="absolute -inset-6 bg-linear-to-r from-violet-600/20 via-purple-600/20 to-pink-600/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Main Image */}
                <div className="image-container relative w-full aspect-4/5 max-w-lg mx-auto lg:mx-0 rounded-[2.5rem] overflow-hidden shadow-glow-purple animate-image-float">
                  <Image
                    src="/about-artisan.png"
                    alt="Our artisan craftsmanship"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="group/play w-20 h-20 rounded-full glass-premium shadow-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110">
                      <div className="absolute inset-0 rounded-full bg-linear-to-r from-violet-500 to-rose-500 opacity-0 group-hover/play:opacity-100 transition-opacity duration-300" />
                      <Play className="w-8 h-8 text-foreground group-hover/play:text-white transition-colors duration-300 ml-1 relative z-10" fill="currentColor" />
                    </button>
                  </div>

                  {/* Bottom info card */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="glass-premium rounded-2xl p-4 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <Heart className="w-6 h-6 text-white animate-heartbeat" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">Made with Love</p>
                          <p className="text-sm text-muted-foreground">Every stitch tells a story</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Spinning decoration */}
              <div className="absolute bottom-1/4 -left-8 z-0 hidden lg:block">
                <div className="w-28 h-28 rounded-full border-4 border-dashed border-violet-300/40 dark:border-violet-700/40 animate-spin-slow" />
              </div>
            </div>

            {/* Right: Content */}
            <div 
              className={`transition-all duration-1000 delay-400 ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              {/* Quote */}
              <div className="relative mb-8">
                <Quote className="absolute -top-2 -left-2 w-10 h-10 text-violet-500/20" />
                <p className="text-xl lg:text-2xl text-foreground font-medium leading-relaxed pl-8 border-l-4 border-gradient-to-b from-violet-500 to-rose-500 italic">
                  "In a world of mass production, there's magic in items made slowly, purposefully, and entirely by hand."
                </p>
              </div>

              {/* Description */}
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed mb-10">
                <p>
                  At <span className="text-foreground font-bold text-gradient-purple">Strokes of Craft</span>, 
                  we believe every stitch carries emotion, every pattern tells a story, 
                  and every piece becomes a treasured keepsake.
                </p>
                <p>
                  From cozy blankets to adorable amigurumi, each creation is crafted with 
                  <span className="text-foreground font-semibold"> premium materials </span>
                  and unwavering attention to detail.
                </p>
              </div>

              {/* Values - Interactive */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {values.map((value, idx) => (
                  <div 
                    key={value.title}
                    className={`group relative p-5 rounded-2xl glass-card shadow-lg cursor-pointer transition-all duration-500 hover:-translate-y-2 overflow-hidden ${
                      activeValue === idx ? 'animate-value-pulse shadow-glow-purple' : ''
                    }`}
                    onClick={() => setActiveValue(idx)}
                  >
                    {/* Active background */}
                    <div className={`absolute inset-0 bg-linear-to-br from-violet-500/10 to-rose-500/10 transition-opacity duration-500 ${
                      activeValue === idx ? 'opacity-100' : 'opacity-0'
                    }`} />
                    
                    <div className="relative flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg transition-all duration-300 ${
                        activeValue === idx ? 'scale-110' : 'group-hover:scale-110'
                      }`}>
                        <value.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">{value.title}</h4>
                        <p className="text-sm text-muted-foreground">{value.desc}</p>
                      </div>
                    </div>

                    {/* Active indicator */}
                    {activeValue === idx && (
                      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-linear-to-r from-violet-500 to-rose-500">
                        <div className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-75" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  {/* Background */}
                  <div className="absolute inset-0 bg-linear-to-r from-violet-600 via-purple-600 to-rose-600 animate-gradient-shift" />
                  
                  {/* Shine */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {/* Glow */}
                  <div className="absolute inset-0 bg-linear-to-r from-violet-600 via-purple-600 to-rose-600 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  <span className="relative">Explore Collection</span>
                  <ArrowRight className="relative w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/custom-order"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold glass-premium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <Palette className="w-5 h-5 text-violet-500" />
                  <span className="text-foreground">Custom Order</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div 
            className={`mb-20 transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, idx) => (
                <div 
                  key={stat.label}
                  className={`group relative p-6 lg:p-8 rounded-3xl glass-premium shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-default overflow-hidden ${
                    isLoaded ? 'animate-scale-in' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                >
                  {/* Hover gradient */}
                  <div className={`absolute inset-0 bg-linear-to-br ${stat.color.replace('from-', 'from-').replace('to-', 'to-')}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${stat.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className={`text-4xl lg:text-5xl font-black bg-linear-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                      {stat.number}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </div>

                  {/* Decorative number */}
                  <div className="absolute -bottom-4 -right-2 text-8xl font-black text-muted-foreground/5 pointer-events-none">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>



        </div>

        {/* === CORNER ACCENTS === */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-linear-to-br from-violet-500/15 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-linear-to-tl from-rose-500/15 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-linear-to-l from-amber-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-linear-to-r from-violet-500/10 to-transparent blur-3xl pointer-events-none" />
      </section>
    </>
  );
}