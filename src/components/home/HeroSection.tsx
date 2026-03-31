'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { 
  ArrowRight, 
  Star, 
  Sparkles,
  Heart,
  Play,
  ChevronDown,
  Zap,
  Gift,
  Truck,
  Shield,
  Palette,
  Award,
  Scissors
} from "lucide-react";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --primary-rgb: 147, 51, 234;
          --secondary-rgb: 236, 72, 153;
          --accent-rgb: 251, 146, 60;
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }

        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }

        @keyframes float-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50% { transform: translateY(-8px) translateX(-50%); }
        }

        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }

        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-gradient { animation: gradient-shift 8s ease infinite; background-size: 200% 200%; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% auto; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 30s linear infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2.5s ease-in-out infinite; }
        .animate-morph { animation: morph 10s ease-in-out infinite; }

        .text-gradient-primary {
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .text-gradient-shine {
          background: linear-gradient(
            90deg,
            #9333ea 0%,
            #ec4899 25%,
            #f97316 50%,
            #ec4899 75%,
            #9333ea 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-premium {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.85) 100%
          );
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 2px 8px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .dark .glass-premium {
          background: linear-gradient(
            135deg,
            rgba(30, 30, 45, 0.9) 0%,
            rgba(20, 20, 35, 0.85) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .dark .glass-card {
          background: rgba(20, 20, 30, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .shadow-premium {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 10px 20px -5px rgba(0, 0, 0, 0.1),
            0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        .dark .shadow-premium {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.2),
            0 10px 20px -5px rgba(0, 0, 0, 0.4),
            0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .shadow-glow-primary {
          box-shadow: 
            0 0 30px rgba(var(--primary-rgb), 0.3),
            0 0 60px rgba(var(--primary-rgb), 0.15);
        }

        .btn-premium {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-premium::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s ease;
        }

        .btn-premium:hover::before {
          left: 100%;
        }

        .btn-premium:hover {
          transform: translateY(-3px);
          box-shadow: 
            0 15px 40px -5px rgba(var(--primary-rgb), 0.4),
            0 0 30px rgba(var(--primary-rgb), 0.2);
        }

        .hover-lift {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hover-lift:hover {
          transform: translateY(-6px) scale(1.02);
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

      <section 
        ref={sectionRef}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* === BACKGROUND === */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950" />
          
          <div 
            className="absolute w-[800px] h-[800px] rounded-full animate-pulse-glow animate-morph"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
              top: `calc(10% + ${mousePosition.y * 30}px)`,
              right: '-200px',
              transition: 'top 1s ease-out',
            }}
          />
          
          <div 
            className="absolute w-[600px] h-[600px] rounded-full animate-morph"
            style={{
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)',
              bottom: '-100px',
              left: '-150px',
              animationDelay: '3s',
            }}
          />

          <div 
            className="absolute w-[400px] h-[400px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
              top: '50%',
              left: '30%',
              animationDelay: '6s',
            }}
          />

          <div className="noise-texture" />

          <div 
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* === LEFT SIDE DECORATIONS === */}
        <div className="absolute left-0 top-0 bottom-0 w-32 lg:w-48 pointer-events-none">
          <div className="absolute top-[15%] left-4 lg:left-8 animate-float-slow">
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-violet-200/60 to-violet-300/40 dark:from-violet-800/30 dark:to-violet-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-violet-400/30 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-violet-300/40 to-transparent" />
            </div>
          </div>

          <div className="absolute top-[45%] left-6 lg:left-12 animate-float-medium" style={{ animationDelay: '1s' }}>
            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-rose-200/60 to-rose-300/40 dark:from-rose-800/30 dark:to-rose-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-rose-400/30 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>

          <div className="absolute bottom-[25%] left-4 lg:left-8 animate-float-fast" style={{ animationDelay: '2s' }}>
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-amber-200/60 to-amber-300/40 dark:from-amber-800/30 dark:to-amber-900/20 shadow-lg">
              <div className="absolute inset-3 rounded-full border border-dashed border-amber-400/30 animate-spin-slow" />
            </div>
          </div>

          <svg className="absolute top-[30%] left-0 w-full h-40 opacity-30 dark:opacity-20" viewBox="0 0 100 160">
            <path 
              d="M0 80 Q 50 40, 80 80 T 160 80" 
              fill="none" 
              stroke="url(#leftLineGradient)" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <defs>
              <linearGradient id="leftLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333ea" stopOpacity="0" />
                <stop offset="50%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute top-[65%] left-8 lg:left-14 animate-float-slow" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl glass-card shadow-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
          </div>

          <div className="absolute bottom-[45%] left-2 lg:left-4 animate-float-medium" style={{ animationDelay: '1.5s' }}>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-violet-500" />
            </div>
          </div>
        </div>

        {/* === RIGHT SIDE DECORATIONS === */}
        <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-48 pointer-events-none">
          <div className="absolute top-[20%] right-4 lg:right-8 animate-float-medium">
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-violet-200/60 to-violet-300/40 dark:from-violet-800/30 dark:to-violet-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-violet-400/30 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>

          <div className="absolute top-[50%] right-6 lg:right-12 animate-float-slow" style={{ animationDelay: '2s' }}>
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-rose-200/60 to-rose-300/40 dark:from-rose-800/30 dark:to-rose-900/20 shadow-lg">
              <div className="absolute inset-3 rounded-full border-2 border-dashed border-rose-400/30 animate-spin-slow" />
            </div>
          </div>

          <div className="absolute bottom-[20%] right-4 lg:right-8 animate-float-fast" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 lg:w-18 lg:h-18 rounded-full bg-gradient-to-br from-amber-200/60 to-amber-300/40 dark:from-amber-800/30 dark:to-amber-900/20 shadow-lg" />
          </div>

          <svg className="absolute top-[60%] right-0 w-full h-40 opacity-30 dark:opacity-20" viewBox="0 0 100 160">
            <path 
              d="M100 80 Q 50 120, 20 80 T -60 80" 
              fill="none" 
              stroke="url(#rightLineGradient)" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <defs>
              <linearGradient id="rightLineGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute top-[35%] right-8 lg:right-14 animate-float-fast" style={{ animationDelay: '0.8s' }}>
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl glass-card shadow-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          <div className="absolute bottom-[40%] right-2 lg:right-4 animate-float-slow" style={{ animationDelay: '2.5s' }}>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-500" />
            </div>
          </div>
        </div>

        {/* === FLOATING PARTICLES === */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-slow"
            style={{
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              background: `linear-gradient(135deg, 
                rgba(${i % 3 === 0 ? '147, 51, 234' : i % 3 === 1 ? '236, 72, 153' : '251, 146, 60'}, ${0.3 + Math.random() * 0.3}), 
                transparent)`,
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
              animationDuration: `${6 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 4}s`,
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* === MAIN CONTENT === */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-10 lg:py-14">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* === LEFT CONTENT === */}
            <div className="space-y-10 text-center lg:text-left">
              
              {/* Premium Badge */}
              <div 
                className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-premium shadow-premium hover-lift cursor-default transition-all duration-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-violet-500 to-rose-500"></span>
                </span>
                <span className="text-sm font-semibold text-gradient-primary">
                  ✨ Artisan Handcrafted Collection
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-5">
                <h1 
                  className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] transition-all duration-700 delay-100 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <span className="block text-foreground/90">
                    Discover
                  </span>
                  <span className="block text-gradient-shine mt-1">
                    Handmade
                  </span>
                  <span className="relative inline-block text-foreground/90 mt-1">
                    Magic
                    <svg 
                      className="absolute -bottom-3 left-0 w-full h-5" 
                      viewBox="0 0 200 20" 
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M0 15 Q 50 5, 100 12 T 200 10" 
                        stroke="url(#underlineGrad)" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                        strokeDasharray="200"
                        strokeDashoffset={isLoaded ? 0 : 200}
                        style={{ transition: 'stroke-dashoffset 1.2s ease-out 0.6s' }}
                      />
                      <defs>
                        <linearGradient id="underlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#9333ea" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>
                
                <p 
                  className={`text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed transition-all duration-700 delay-200 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  Each piece is lovingly crafted with 
                  <span className="text-foreground font-semibold"> premium materials</span>,
                  bringing warmth and artistry into your life with every stitch.
                </p>
              </div>

              {/* CTA Buttons */}
              <div 
                className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Link
                  href="/products"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 rounded-2xl font-bold text-white btn-premium shadow-glow-primary animate-gradient"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
                
                <Link
                  href="/custom-order"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold glass-premium shadow-premium hover-lift border border-violet-200/50 dark:border-violet-800/50 hover:border-violet-400 transition-all duration-500"
                >
                  <Heart className="w-5 h-5 text-rose-500 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-foreground">Request Custom</span>
                </Link>
              </div>


            </div>

            {/* === RIGHT - IMAGE SHOWCASE === */}
            <div 
              className={`relative transition-all duration-1000 delay-300 ${
                isLoaded ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-95'
              }`}
            >
              {/* Revolving Design: Orbital Rings & Icons */}
              <div className="absolute -inset-8 lg:-inset-16 pointer-events-none z-0">
                {/* Outer Dashed Ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-violet-400/40 animate-spin-slow" style={{ animationDuration: '40s' }} />
                
                {/* Inner Orbital Icons */}
                <div className="absolute inset-4 rounded-full border border-violet-200/20 dark:border-violet-700/30 animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
                  {/* Top */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-premium flex items-center justify-center text-violet-500 shadow-xl" style={{ animation: 'spin-slow 30s linear infinite' }}>
                    <Sparkles className="w-5 h-5 pointer-events-auto" />
                  </div>
                  {/* Bottom */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 rounded-full glass-premium flex items-center justify-center text-rose-500 shadow-xl" style={{ animation: 'spin-slow 30s linear infinite' }}>
                    <Heart className="w-5 h-5 pointer-events-auto" />
                  </div>
                  {/* Left */}
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-premium flex items-center justify-center text-amber-500 shadow-xl" style={{ animation: 'spin-slow 30s linear infinite' }}>
                    <Scissors className="w-5 h-5 pointer-events-auto" />
                  </div>
                  {/* Right */}
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-premium flex items-center justify-center text-emerald-500 shadow-xl" style={{ animation: 'spin-slow 30s linear infinite' }}>
                    <Palette className="w-5 h-5 pointer-events-auto" />
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-violet-500/30 via-rose-500/30 to-amber-500/30 rounded-full blur-3xl animate-pulse-glow z-0" />

              {/* Main image container */}
              <div className="relative z-10 w-[320px] h-[320px] md:w-[450px] md:h-[450px] mx-auto">
                {/* Gradient border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-rose-500 to-amber-500 rounded-full opacity-60 blur-sm animate-gradient" />
                
                {/* Image */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-premium">
                  <Image
                    src="/hero-circle.png"
                    alt="Handmade crochet collection"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-rose-500/10 mix-blend-overlay pointer-events-none" />
                </div>

                {/* Floating Card - Top Left */}
                <div className="absolute -left-6 top-12 z-20 animate-float-slow">
                  <div className="flex items-center gap-3 px-5 py-4 glass-premium rounded-2xl shadow-premium hover-lift">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">Handcrafted</div>
                      <div className="text-xs text-muted-foreground">Premium Yarn</div>
                    </div>
                  </div>
                </div>

                {/* Floating Card - Bottom Right */}
                <div className="absolute -right-4 bottom-16 z-20 animate-float-medium" style={{ animationDelay: '1s' }}>
                  <div className="px-5 py-4 glass-premium rounded-2xl shadow-premium hover-lift">
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {['bg-rose-400', 'bg-violet-400', 'bg-amber-400'].map((color, i) => (
                          <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold`}>
                            {['S', 'E', 'J'][i]}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">2.5k+ Reviews</span>
                    </div>
                  </div>
                </div>

                {/* Price tag */}
                <div className="absolute top-6 right-6 z-20 animate-float-fast" style={{ animationDelay: '0.5s' }}>
                  <div className="px-4 py-2 glass-premium rounded-full shadow-premium">
                    <span className="text-sm font-bold text-gradient-primary">From ₹299</span>
                  </div>
                </div>

                {/* Play button */}
                <div className="absolute bottom-8 left-8 z-20">
                  <button className="group w-14 h-14 rounded-full glass-premium shadow-premium flex items-center justify-center hover-lift overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Play className="w-6 h-6 text-foreground group-hover:text-white transition-colors duration-300 relative z-10 ml-0.5" fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === SCROLL INDICATOR === */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle z-20">
          <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer">
            <div className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1.5">
              <div className="w-1 h-2 bg-current rounded-full animate-float-fast" />
            </div>
            <span className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1">
              Scroll
              <ChevronDown className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* === CORNER ACCENTS === */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-rose-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-gradient-to-l from-amber-500/8 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-gradient-to-r from-violet-500/8 to-transparent blur-3xl pointer-events-none" />
      </section>
    </>
  );
}