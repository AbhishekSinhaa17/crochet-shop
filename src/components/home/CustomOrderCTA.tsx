'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from "react";
import { 
  Palette, 
  ArrowRight, 
  Play, 
  Clock, 
  Shield, 
  Infinity, 
  Heart, 
  Star, 
  Package,
  Sparkles,
  Crown,
  Gem,
  Wand2,
  MessageCircleHeart,
  CheckCircle2,
  Send,
  PenTool,
  Layers,
  Zap,
  BadgeCheck,

  Camera,
  Scissors,
  Gift
} from "lucide-react";

export default function CustomOrderCTA() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
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
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Deterministic random for SSR
  const drand = (i: number, seed: number) => {
    const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      x: 5 + drand(i, 1) * 90,
      y: 5 + drand(i, 2) * 90,
      size: 3 + drand(i, 3) * 8,
      duration: 8 + drand(i, 4) * 8,
      delay: drand(i, 5) * 5,
      colorIdx: Math.floor(drand(i, 6) * 4),
    }));
  }, []);

  const stats = [
    { value: '40+', label: 'Custom Orders', icon: Package, color: 'from-violet-500 to-purple-600', bg: 'from-violet-500/20 to-purple-500/20' },
    { value: '24h', label: 'Response Time', icon: Clock, color: 'from-cyan-500 to-blue-600', bg: 'from-cyan-500/20 to-blue-500/20' },
    { value: '100%', label: 'Satisfaction', icon: Heart, color: 'from-rose-500 to-pink-600', bg: 'from-rose-500/20 to-pink-500/20' },
    { value: '5.0', label: 'Star Rating', icon: Star, color: 'from-amber-500 to-orange-600', bg: 'from-amber-500/20 to-orange-500/20' },
  ];

  const features = [
    { icon: Clock, text: '24h Response', description: 'Quick turnaround on all inquiries' },
    { icon: Shield, text: 'Guaranteed', description: '100% satisfaction promise' },
    { icon: Infinity, text: 'Revisions', description: 'Unlimited design changes' },
    { icon: CheckCircle2, text: 'Premium', description: 'Highest quality materials' },
  ];

  const processSteps = [
    { 
      step: '01', 
      title: 'Share Your Vision', 
      description: 'Tell us about your dream creation',
      icon: MessageCircleHeart,
      color: 'from-rose-500 to-pink-500'
    },
    { 
      step: '02', 
      title: 'We Design It', 
      description: 'Our artisans sketch your idea',
      icon: PenTool,
      color: 'from-violet-500 to-purple-500'
    },
    { 
      step: '03', 
      title: 'Crafted with Love', 
      description: 'Handmade with premium yarn',
      icon: Heart,
      color: 'from-amber-500 to-orange-500'
    },
    { 
      step: '04', 
      title: 'Delivered to You', 
      description: 'Beautifully packaged & shipped',
      icon: Gift,
      color: 'from-emerald-500 to-teal-500'
    },
  ];

  const recentOrders = [
    { name: 'Custom Bunny', client: 'Priya S.', color: 'from-rose-400 to-pink-500' },
    { name: 'Baby Blanket', client: 'Rahul M.', color: 'from-blue-400 to-cyan-500' },
    { name: 'Amigurumi Set', client: 'Sneha P.', color: 'from-violet-400 to-purple-500' },
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

        @keyframes border-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
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

        @keyframes sweep-shine {
          0% { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateX(150%) skewX(-20deg); opacity: 0; }
        }

        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        @keyframes morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
          75% { border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%; }
        }

        @keyframes draw-line {
          to { stroke-dashoffset: 0; }
        }

        @keyframes step-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(147, 51, 234, 0); }
        }

        .animate-float-gentle { animation: float-gentle 10s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 8s ease-in-out infinite; }
        .animate-float-diagonal { animation: float-diagonal 12s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% auto; }
        .animate-gradient-shift { animation: gradient-shift 8s ease infinite; background-size: 200% 200%; }
        .animate-spin-slow { animation: spin-slow 25s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 20s linear infinite; }
        .animate-border-flow { animation: border-flow 4s linear infinite; background-size: 200% 100%; }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.8s ease-out forwards; }
        .animate-sweep-shine { animation: sweep-shine 4s ease-in-out infinite; }
        .animate-morph { animation: morph 15s ease-in-out infinite; }
        .animate-step-pulse { animation: step-pulse 2s ease-in-out infinite; }

        .text-gradient-gold {
          background: linear-gradient(135deg, #fcd34d, #f59e0b, #fbbf24, #f59e0b, #fcd34d);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-shimmer 4s linear infinite;
        }

        .text-gradient-purple {
          background: linear-gradient(135deg, #a855f7, #ec4899, #8b5cf6, #ec4899, #a855f7);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-shimmer 3s linear infinite;
        }

        .text-gradient-rainbow {
          background: linear-gradient(90deg, #f43f5e, #ec4899, #a855f7, #6366f1, #06b6d4, #10b981, #f59e0b, #f43f5e);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-shimmer 6s linear infinite;
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

        .glass-white {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .glass-white-strong {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.9);
        }

        .shadow-glow-purple {
          box-shadow: 
            0 0 40px rgba(147, 51, 234, 0.3),
            0 0 80px rgba(147, 51, 234, 0.15),
            0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .shadow-glow-white {
          box-shadow: 
            0 0 40px rgba(255, 255, 255, 0.25),
            0 0 80px rgba(255, 255, 255, 0.1);
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.025;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .cta-card {
          position: relative;
          overflow: hidden;
        }

        .cta-card::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: linear-gradient(135deg, #a855f7, #ec4899, #f59e0b, #10b981, #6366f1, #a855f7);
          background-size: 300% 300%;
          border-radius: inherit;
          z-index: -1;
          animation: gradient-shift 6s ease infinite;
          opacity: 0.8;
        }

        .step-connector {
          position: absolute;
          top: 50%;
          left: 100%;
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,0.3), transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <section ref={sectionRef} className="py-10 lg:py-12 relative overflow-hidden">
        {/* === BACKGROUND === */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-violet-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950" />
          
          {/* Animated gradient orbs */}
          <div 
            className="absolute w-[900px] h-[900px] rounded-full animate-pulse-glow animate-morph"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 60%)',
              top: '-300px',
              left: '-200px',
            }}
          />
          <div 
            className="absolute w-[700px] h-[700px] rounded-full animate-pulse-glow animate-morph"
            style={{
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 60%)',
              bottom: '-200px',
              right: '-150px',
              animationDelay: '3s',
            }}
          />
          <div 
            className="absolute w-[500px] h-[500px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 60%)',
              top: '40%',
              right: '20%',
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
          <div className="noise-overlay" />
        </div>

        {/* === LEFT SIDE DECORATIONS === */}
        <div className="absolute left-0 top-0 bottom-0 w-32 lg:w-52 pointer-events-none">
          {/* Yarn balls */}
          <div className="absolute top-[12%] left-4 lg:left-10 animate-float-gentle">
            <div className="relative w-20 h-20 lg:w-32 lg:h-32">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-violet-300/50 to-violet-400/30 dark:from-violet-700/40 dark:to-violet-800/30 shadow-xl">
                <div className="absolute inset-3 rounded-full border-2 border-dashed border-violet-400/40 animate-spin-slow" />
                <div className="absolute inset-6 rounded-full bg-linear-to-br from-violet-200/50 to-transparent" />
              </div>
              {/* Thread line */}
              <svg className="absolute -bottom-10 left-1/2 w-1 h-16 overflow-visible">
                <path d="M0 0 Q 10 20, 0 40 Q -10 60, 5 80" stroke="url(#threadGradient1)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <defs>
                  <linearGradient id="threadGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="absolute top-[42%] left-6 lg:left-14 animate-float-reverse" style={{ animationDelay: '1.5s' }}>
            <div className="w-14 h-14 lg:w-22 lg:h-22 rounded-full bg-linear-to-br from-rose-300/50 to-rose-400/30 dark:from-rose-700/40 dark:to-rose-800/30 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-rose-400/40 animate-spin-reverse" />
            </div>
          </div>

          <div className="absolute bottom-[22%] left-4 lg:left-8 animate-float-diagonal" style={{ animationDelay: '3s' }}>
            <div className="w-16 h-16 lg:w-26 lg:h-26 rounded-full bg-linear-to-br from-amber-300/50 to-amber-400/30 dark:from-amber-700/40 dark:to-amber-800/30 shadow-lg">
              <div className="absolute inset-3 rounded-full border-2 border-dashed border-amber-400/40 animate-spin-slow" />
            </div>
          </div>

          {/* Floating icon cards */}
          <div className="absolute top-[28%] left-8 lg:left-16 animate-bounce-subtle hidden lg:flex">
            <div className="w-14 h-14 rounded-2xl glass-card shadow-xl flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-violet-500" />
            </div>
          </div>

          <div className="absolute top-[58%] left-4 lg:left-10 animate-float-gentle hidden lg:flex" style={{ animationDelay: '2s' }}>
            <div className="w-12 h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-rose-500" />
            </div>
          </div>

          <div className="absolute bottom-[38%] left-6 lg:left-12 animate-float-reverse hidden lg:flex" style={{ animationDelay: '4s' }}>
            <div className="w-11 h-11 rounded-lg glass-card shadow-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          {/* Decorative SVG curves */}
          <svg className="absolute top-[35%] left-0 w-full h-60 opacity-40 dark:opacity-25" viewBox="0 0 120 240" fill="none">
            <path 
              d="M10 20 C 40 60, 20 100, 50 140 C 80 180, 30 200, 60 230" 
              stroke="url(#leftCurveGradient)" 
              strokeWidth="1.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
            <circle cx="10" cy="20" r="4" fill="#a855f7" opacity="0.5" />
            <circle cx="60" cy="230" r="4" fill="#ec4899" opacity="0.5" />
            <defs>
              <linearGradient id="leftCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* === RIGHT SIDE DECORATIONS === */}
        <div className="absolute right-0 top-0 bottom-0 w-32 lg:w-52 pointer-events-none">
          {/* Yarn balls */}
          <div className="absolute top-[18%] right-4 lg:right-10 animate-float-reverse">
            <div className="relative w-18 h-18 lg:w-28 lg:h-28">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-emerald-300/50 to-emerald-400/30 dark:from-emerald-700/40 dark:to-emerald-800/30 shadow-xl">
                <div className="absolute inset-3 rounded-full border-2 border-dashed border-emerald-400/40 animate-spin-reverse" />
                <div className="absolute inset-5 rounded-full bg-linear-to-br from-emerald-200/50 to-transparent" />
              </div>
            </div>
          </div>

          <div className="absolute top-[48%] right-6 lg:right-14 animate-float-gentle" style={{ animationDelay: '2.5s' }}>
            <div className="w-20 h-20 lg:w-32 lg:h-32 rounded-full bg-linear-to-br from-pink-300/50 to-pink-400/30 dark:from-pink-700/40 dark:to-pink-800/30 shadow-lg">
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-pink-400/40 animate-spin-slow" />
            </div>
          </div>

          <div className="absolute bottom-[18%] right-4 lg:right-8 animate-float-diagonal" style={{ animationDelay: '1s' }}>
            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-linear-to-br from-blue-300/50 to-blue-400/30 dark:from-blue-700/40 dark:to-blue-800/30 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-blue-400/40 animate-spin-reverse" />
            </div>
          </div>

          {/* Floating icon cards */}
          <div className="absolute top-[32%] right-8 lg:right-16 animate-bounce-subtle hidden lg:flex" style={{ animationDelay: '0.7s' }}>
            <div className="w-14 h-14 rounded-2xl glass-card shadow-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          <div className="absolute top-[62%] right-4 lg:right-10 animate-float-reverse hidden lg:flex" style={{ animationDelay: '3.5s' }}>
            <div className="w-12 h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Gem className="w-5 h-5 text-violet-500" />
            </div>
          </div>

          <div className="absolute bottom-[32%] right-6 lg:right-12 animate-float-gentle hidden lg:flex" style={{ animationDelay: '5s' }}>
            <div className="w-11 h-11 rounded-lg glass-card shadow-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
          </div>

          {/* Decorative SVG curves */}
          <svg className="absolute top-[40%] right-0 w-full h-60 opacity-40 dark:opacity-25" viewBox="0 0 120 240" fill="none">
            <path 
              d="M110 20 C 80 60, 100 100, 70 140 C 40 180, 90 200, 60 230" 
              stroke="url(#rightCurveGradient)" 
              strokeWidth="1.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
            <circle cx="110" cy="20" r="4" fill="#10b981" opacity="0.5" />
            <circle cx="60" cy="230" r="4" fill="#f97316" opacity="0.5" />
            <defs>
              <linearGradient id="rightCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
                    p.colorIdx === 1 ? '236, 72, 153' : 
                    p.colorIdx === 2 ? '251, 146, 60' : '16, 185, 129'
                  }, ${0.25 + Math.random() * 0.35}), 
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
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-premium shadow-xl mb-8">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-gradient-purple">Custom Creations Studio</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-[1.1]">
              <span className="block">Bring Your</span>
              <span className="block text-gradient-rainbow mt-2">
                Vision to Life
              </span>
            </h2>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have a unique idea? Share your vision and let our artisans create 
              <span className="text-foreground font-semibold"> something truly magical </span>
              just for you.
            </p>
          </div>

          {/* Process Steps - Interactive Timeline */}
          <div 
            className={`mb-10 lg:mb-12 transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-linear-to-r from-transparent via-border to-transparent -translate-y-1/2 hidden lg:block" />
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {processSteps.map((step, idx) => (
                  <div 
                    key={step.step}
                    className={`relative group cursor-pointer transition-all duration-500 ${
                      activeStep === idx ? 'scale-105' : 'hover:scale-102'
                    }`}
                    onClick={() => setActiveStep(idx)}
                  >
                    <div className={`relative p-6 rounded-3xl glass-premium shadow-xl overflow-hidden transition-all duration-500 ${
                      activeStep === idx ? 'shadow-glow-purple' : ''
                    }`}>
                      {/* Active indicator */}
                      {activeStep === idx && (
                        <div className={`absolute inset-0 bg-linear-to-br ${step.color} opacity-10`} />
                      )}
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                      {/* Step number */}
                      <div className="absolute top-4 right-4 text-4xl font-black text-muted-foreground/10">
                        {step.step}
                      </div>

                      {/* Icon */}
                      <div className={`relative w-14 h-14 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center shadow-lg mb-4 ${
                        activeStep === idx ? 'animate-step-pulse' : ''
                      }`}>
                        <step.icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>

                      {/* Active dot */}
                      {activeStep === idx && (
                        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-linear-to-r from-violet-500 to-rose-500">
                          <div className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-75" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main CTA Card */}
          <div 
            className={`cta-card rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Card inner */}
            <div className="relative bg-linear-to-br from-violet-600 via-purple-600 to-fuchsia-600 animate-gradient-shift p-1">
              <div className="relative rounded-[2.4rem] lg:rounded-[3.4rem] overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-linear-to-br from-violet-600 via-purple-600 to-fuchsia-600" />
                
                {/* Mouse-reactive gradient */}
                <div 
                  className="absolute inset-0 opacity-50 transition-all duration-500"
                  style={{
                    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                  }}
                />

                {/* Mesh gradient */}
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: `
                      radial-gradient(ellipse at 15% 25%, rgba(251, 146, 60, 0.3) 0%, transparent 45%),
                      radial-gradient(ellipse at 85% 75%, rgba(236, 72, 153, 0.3) 0%, transparent 45%),
                      radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 55%)
                    `,
                  }}
                />

                {/* Grid pattern */}
                <div 
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                  }}
                />

                {/* Floating shapes inside */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute glass-white rounded-2xl lg:rounded-3xl animate-float-gentle"
                      style={{
                        width: `${50 + drand(i, 20) * 50}px`,
                        height: `${50 + drand(i, 21) * 50}px`,
                        left: `${drand(i, 22) * 100}%`,
                        top: `${drand(i, 23) * 100}%`,
                        transform: `rotate(${drand(i, 24) * 60 - 30}deg)`,
                        animationDuration: `${10 + drand(i, 25) * 8}s`,
                        animationDelay: `${drand(i, 26) * 5}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 md:p-12 lg:p-16 xl:p-20">
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    
                    {/* Left - Text Content */}
                    <div className="text-white space-y-8">
                      {/* Mini badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-white">
                        <Zap className="w-4 h-4 text-amber-300" />
                        <span className="text-sm font-semibold">Limited Slots Available</span>
                      </div>

                      {/* Heading */}
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                        Dream It.
                        <br />
                        <span className="text-gradient-gold">We'll Craft It.</span>
                      </h3>

                      {/* Description */}
                      <p className="text-lg text-white/85 leading-relaxed max-w-lg">
                        From amigurumi toys to cozy blankets, share your idea and we'll bring it to life 
                        with premium materials and exceptional craftsmanship.
                      </p>

                      {/* Features grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {features.map((feature) => (
                          <div 
                            key={feature.text}
                            className="group flex items-start gap-3 p-4 rounded-2xl glass-white hover:bg-white/20 transition-all duration-300 cursor-default"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <feature.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-white text-sm">{feature.text}</div>
                              <div className="text-xs text-white/60">{feature.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap gap-4 pt-4">
                        <Link
                          href="/custom-order"
                          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold glass-white-strong text-violet-600 hover:scale-105 transition-all duration-300 shadow-2xl text-lg overflow-hidden"
                        >
                          {/* Shimmer */}
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-violet-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          
                          <div className="relative z-10 w-11 h-11 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Send className="w-5 h-5 text-white" />
                          </div>
                          <span className="relative z-10">Start Your Order</span>
                          <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>


                      </div>
                    </div>

                    {/* Right - Stats & Social Proof */}
                    <div className="space-y-6">
                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, idx) => (
                          <div 
                            key={stat.label}
                            className={`group relative p-6 rounded-3xl glass-white hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 cursor-default overflow-hidden ${
                              isLoaded ? 'animate-scale-in' : 'opacity-0'
                            }`}
                            style={{ animationDelay: `${0.5 + idx * 0.1}s` }}
                          >
                            {/* Hover gradient */}
                            <div className={`absolute inset-0 bg-linear-to-br ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            
                            {/* Icon */}
                            <div className={`relative w-12 h-12 rounded-2xl bg-linear-to-br ${stat.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                              <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            
                            {/* Value */}
                            <p className="relative text-3xl lg:text-4xl font-black text-white mb-1">
                              {stat.value}
                            </p>
                            
                            {/* Label */}
                            <p className="relative text-sm text-white/70 font-medium">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Recent orders */}
                      <div className="p-6 rounded-3xl glass-white">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-5 h-5 text-amber-300" />
                          <span className="font-semibold text-white">Recent Custom Orders</span>
                        </div>
                        <div className="space-y-3">
                          {recentOrders.map((order, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors duration-300">
                              <div className={`w-10 h-10 rounded-full bg-linear-to-br ${order.color} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                                {order.client.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-white">{order.name}</p>
                                <p className="text-xs text-white/60">by {order.client}</p>
                              </div>
                              <BadgeCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Trust badge */}
                      <div className="flex items-center justify-center gap-4 p-4 rounded-2xl glass-white">
                        <div className="flex -space-x-2">
                          {['from-rose-400 to-pink-500', 'from-violet-400 to-purple-500', 'from-amber-400 to-orange-500', 'from-emerald-400 to-teal-500'].map((gradient, i) => (
                            <div 
                              key={i}
                              className={`w-10 h-10 rounded-full bg-linear-to-br ${gradient} border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold shadow-md`}
                            >
                              {['PS', 'RM', 'AK', 'VS'][i]}
                            </div>
                          ))}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="text-xs text-white/70">
                            <span className="font-semibold text-white">100+</span> happy customers
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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