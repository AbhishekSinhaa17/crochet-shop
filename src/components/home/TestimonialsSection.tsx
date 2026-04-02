'use client';

import { useEffect, useState, useMemo } from "react";
import { 
  Heart, 
  Star, 
  Quote, 
  Gift, 
  BadgeCheck, 
  Shield, 
  Package,
  Sparkles,
  Crown,
  Award,
  ThumbsUp,
  MessageCircle,
  Users,
  TrendingUp,
  Gem,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function TestimonialsSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate featured testimonial
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Deterministic random for SSR
  const drand = (i: number, seed: number) => {
    const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const particles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      x: 5 + drand(i, 1) * 90,
      y: 5 + drand(i, 2) * 90,
      size: 4 + drand(i, 3) * 8,
      duration: 6 + drand(i, 4) * 6,
      delay: drand(i, 5) * 4,
      colorIdx: Math.floor(drand(i, 6) * 3),
    }));
  }, []);

  const testimonials = [
    {
      name: 'Priya Sharma',
      avatar: 'PS',
      location: 'Mumbai, India',
      role: 'Verified Buyer',
      rating: 5,
      text: "The amigurumi bunny I ordered was absolutely perfect! Every stitch is flawless and the attention to detail is remarkable. It's become my daughter's favorite toy and she carries it everywhere. The quality exceeded all my expectations!",
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-500/10 to-pink-500/10',
      product: 'Amigurumi Bunny',
      date: '2 weeks ago',
      featured: true,
      helpful: 24,
    },
    {
      name: 'Rahul Mehta',
      avatar: 'RM',
      location: 'Delhi, India',
      role: 'Repeat Customer',
      rating: 5,
      text: "Got a custom baby blanket made for my nephew. The quality is outstanding, arrived beautifully packaged, and the baby loves it! Already planning to order more gifts.",
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      product: 'Custom Baby Blanket',
      date: '1 month ago',
      featured: false,
      helpful: 18,
    },
    {
      name: 'Ananya Krishnan',
      avatar: 'AK',
      location: 'Bangalore, India',
      role: 'Verified Buyer',
      rating: 5,
      text: "The home decor set transformed my living room! Each piece is unique and you can feel the love put into making them. Already planning my next order. Highly recommend!",
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-500/10 to-purple-500/10',
      product: 'Home Decor Set',
      date: '3 weeks ago',
      featured: false,
      helpful: 31,
    },
    {
      name: 'Sneha Patel',
      avatar: 'SP',
      location: 'Ahmedabad, India',
      role: 'Gift Buyer',
      rating: 5,
      text: "Ordered a custom gift and the recipient was overjoyed! The craftsmanship is truly exceptional and the communication throughout was wonderful.",
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-500/10 to-orange-500/10',
      product: 'Custom Gift',
      date: '1 week ago',
      featured: false,
      helpful: 15,
    },
    {
      name: 'Vikram Singh',
      avatar: 'VS',
      location: 'Jaipur, India',
      role: 'First Time Buyer',
      rating: 5,
      text: "I was skeptical about buying handmade products online, but this exceeded all expectations. The texture, colors, and quality are simply amazing. Will definitely be back!",
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      product: 'Crochet Throw',
      date: '2 months ago',
      featured: true,
      helpful: 42,
    },
    {
      name: 'Meera Iyer',
      avatar: 'MI',
      location: 'Chennai, India',
      role: 'Loyal Customer',
      rating: 5,
      text: "This is my 5th purchase and I'm never disappointed. The consistency in quality is remarkable. Each piece feels special and handmade with love.",
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-500/10 to-rose-500/10',
      product: 'Various Items',
      date: '5 days ago',
      featured: false,
      helpful: 28,
    },
  ];



  const trustedBy = [
    'Featured in Handmade Magazine',
    'Top Rated on Etsy',
    'Instagram Community Choice',
    'Verified Artisan Seller',
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

        @keyframes sweep-shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }

        @keyframes card-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.1); }
          50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.2); }
        }

        @keyframes quote-bounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
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
        .animate-card-glow { animation: card-glow 3s ease-in-out infinite; }
        .animate-quote-bounce { animation: quote-bounce 4s ease-in-out infinite; }

        .text-gradient-primary {
          background: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #f97316 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        .text-gradient-love {
          background: linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
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

        .testimonial-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .testimonial-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .testimonial-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(135deg, #ec4899, #f43f5e, #f97316, #f43f5e, #ec4899);
          background-size: 200% 200%;
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          animation: gradient-shift 4s linear infinite;
          transition: opacity 0.4s ease;
        }

        .testimonial-card:hover::before {
          opacity: 1;
        }

        .shadow-glow-rose {
          box-shadow: 0 0 30px rgba(244, 63, 94, 0.2), 0 0 60px rgba(244, 63, 94, 0.1);
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
          <div className="absolute inset-0 bg-linear-to-b from-rose-50/30 via-white to-pink-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950/20" />
          
          {/* Animated gradient orbs */}
          <div 
            className="absolute w-[800px] h-[800px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(244, 63, 94, 0.12) 0%, transparent 70%)',
              top: '-200px',
              right: '-200px',
            }}
          />
          <div 
            className="absolute w-[600px] h-[600px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
              bottom: '-150px',
              left: '-100px',
              animationDelay: '2s',
            }}
          />
          <div 
            className="absolute w-[500px] h-[500px] rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
              top: '40%',
              left: '50%',
              animationDelay: '4s',
            }}
          />

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(244, 63, 94, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(244, 63, 94, 0.5) 1px, transparent 1px)
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
          <div className="absolute top-[15%] left-4 lg:left-8 animate-float-gentle">
            <div className="w-18 h-18 lg:w-26 lg:h-26 rounded-full bg-linear-to-br from-rose-200/50 to-rose-300/30 dark:from-rose-800/30 dark:to-rose-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-rose-400/30 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full bg-linear-to-br from-rose-300/40 to-transparent" />
            </div>
          </div>

          <div className="absolute top-[45%] left-6 lg:left-12 animate-float-reverse" style={{ animationDelay: '1s' }}>
            <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-linear-to-br from-pink-200/50 to-pink-300/30 dark:from-pink-800/30 dark:to-pink-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-pink-400/30 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>

          <div className="absolute bottom-[25%] left-4 lg:left-8 animate-float-gentle" style={{ animationDelay: '2s' }}>
            <div className="w-16 h-16 lg:w-22 lg:h-22 rounded-full bg-linear-to-br from-violet-200/50 to-violet-300/30 dark:from-violet-800/30 dark:to-violet-900/20 shadow-lg">
              <div className="absolute inset-3 rounded-full border border-dashed border-violet-400/30 animate-spin-slow" />
            </div>
          </div>

          {/* Floating icons */}
          <div className="absolute top-[28%] left-6 lg:left-12 animate-bounce-subtle hidden lg:flex">
            <div className="w-12 h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
          </div>

          <div className="absolute bottom-[40%] left-3 lg:left-6 animate-float-gentle hidden lg:flex" style={{ animationDelay: '1.5s' }}>
            <div className="w-10 h-10 rounded-lg glass-card shadow-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
          </div>

          {/* Curved line */}
          <svg className="absolute top-[55%] left-0 w-full h-40 opacity-30 dark:opacity-20" viewBox="0 0 100 160">
            <path 
              d="M0 80 Q 45 35, 65 80 T 100 80" 
              fill="none" 
              stroke="url(#leftTestimonialGradient)" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <defs>
              <linearGradient id="leftTestimonialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* === RIGHT SIDE DECORATIONS === */}
        <div className="absolute right-0 top-0 bottom-0 w-28 lg:w-44 pointer-events-none">
          {/* Yarn balls */}
          <div className="absolute top-[20%] right-4 lg:right-8 animate-float-reverse">
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-linear-to-br from-amber-200/50 to-amber-300/30 dark:from-amber-800/30 dark:to-amber-900/20 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-amber-400/30 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
            </div>
          </div>

          <div className="absolute top-[50%] right-6 lg:right-12 animate-float-gentle" style={{ animationDelay: '2s' }}>
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-linear-to-br from-orange-200/50 to-orange-300/30 dark:from-orange-800/30 dark:to-orange-900/20 shadow-lg">
              <div className="absolute inset-3 rounded-full border-2 border-dashed border-orange-400/30 animate-spin-slow" />
            </div>
          </div>

          <div className="absolute bottom-[20%] right-4 lg:right-8 animate-float-reverse" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 lg:w-18 lg:h-18 rounded-full bg-linear-to-br from-emerald-200/50 to-emerald-300/30 dark:from-emerald-800/30 dark:to-emerald-900/20 shadow-lg" />
          </div>

          {/* Floating icons */}
          <div className="absolute top-[32%] right-6 lg:right-12 animate-bounce-subtle hidden lg:flex" style={{ animationDelay: '0.5s' }}>
            <div className="w-12 h-12 rounded-xl glass-card shadow-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          <div className="absolute bottom-[35%] right-3 lg:right-6 animate-float-reverse hidden lg:flex" style={{ animationDelay: '2.5s' }}>
            <div className="w-10 h-10 rounded-lg glass-card shadow-lg flex items-center justify-center">
              <Gem className="w-4 h-4 text-violet-500" />
            </div>
          </div>

          {/* Curved line */}
          <svg className="absolute top-[40%] right-0 w-full h-40 opacity-30 dark:opacity-20" viewBox="0 0 100 160">
            <path 
              d="M100 80 Q 55 125, 35 80 T 0 80" 
              fill="none" 
              stroke="url(#rightTestimonialGradient)" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <defs>
              <linearGradient id="rightTestimonialGradient" x1="100%" y1="0%" x2="0%" y2="0%">
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
                  rgba(${p.colorIdx === 0 ? '244, 63, 94' : p.colorIdx === 1 ? '236, 72, 153' : '168, 85, 247'}, ${0.3 + Math.random() * 0.3}), 
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
            className={`text-center mb-10 lg:mb-12 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-badge shadow-lg shadow-glow-rose mb-6">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-md">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-sm font-bold text-gradient-love">Customer Love Stories</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.1]">
              What Our{' '}
              <span className="relative inline-block">
                <span className="text-gradient-primary">Customers</span>
                <svg 
                  className="absolute -bottom-2 left-0 w-full h-4" 
                  viewBox="0 0 200 16" 
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M0 10 Q 50 4, 100 10 T 200 8" 
                    fill="none" 
                    stroke="url(#testimonialUnderline)" 
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    strokeDashoffset={isLoaded ? 0 : 200}
                    style={{ transition: 'stroke-dashoffset 1.2s ease-out 0.4s' }}
                  />
                  <defs>
                    <linearGradient id="testimonialUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              {' '}Say
            </h2>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Real stories from our wonderful community of 
              <span className="text-foreground font-semibold"> crochet lovers</span>. 
              Every review warms our hearts!
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              {trustedBy.map((item, idx) => (
                <div 
                  key={item}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-sm text-sm font-medium text-muted-foreground"
                >
                  <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>


          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={testimonial.name}
                className={`group relative testimonial-card ${testimonial.featured ? 'md:row-span-2' : ''} ${
                  isLoaded ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
              >
                <div className={`relative h-full p-6 lg:p-8 rounded-3xl glass-card shadow-lg hover:shadow-2xl flex flex-col overflow-hidden`}>
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-linear-to-br ${testimonial.bgGradient} opacity-50`} />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* Quote icon */}
                  <div className={`absolute -top-4 left-6 lg:left-8 w-12 h-12 rounded-2xl bg-linear-to-br ${testimonial.gradient} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 animate-quote-bounce`}>
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full pt-6">
                    {/* Rating & Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                    </div>

                    {/* Text */}
                    <p className={`text-foreground/80 leading-relaxed flex-1 mb-6 ${testimonial.featured ? 'text-lg' : ''}`}>
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    {/* Product tag & Helpful */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-background/50 dark:bg-background/30 text-muted-foreground border border-border/50">
                        <Gift className="w-3.5 h-3.5 text-rose-500" />
                        {testimonial.product}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{testimonial.helpful} found helpful</span>
                      </div>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-6 border-t border-border/50 mt-auto">
                      <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <BadgeCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{testimonial.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div 
            className={`mt-16 text-center transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative inline-flex flex-col items-center">
              {/* Social proof avatars */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex -space-x-3">
                  {['from-rose-400 to-pink-500', 'from-violet-400 to-purple-500', 'from-amber-400 to-orange-500', 'from-emerald-400 to-teal-500', 'from-blue-400 to-cyan-500'].map((gradient, i) => (
                    <div 
                      key={i}
                      className={`w-10 h-10 rounded-full bg-linear-to-br ${gradient} border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs font-bold shadow-md`}
                    >
                      {['PS', 'RM', 'AK', 'SP', 'VS'][i]}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full glass-card border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold text-foreground shadow-md">
                    +2k
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">100+</span> happy customers
                  </p>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-6 max-w-md">
                Join our growing family of crochet enthusiasts and experience the magic yourself!
              </p>

              <a
                href="/products"
                className="group relative inline-flex items-center gap-4 px-8 py-4 rounded-2xl font-bold glass-card shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-linear-to-r from-rose-500 via-pink-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <span className="relative text-foreground group-hover:text-white transition-colors duration-300">
                  Shop Now & Join the Family
                </span>
                
                <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-rose-500 to-pink-500 group-hover:from-white/20 group-hover:to-white/10 flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110">
                  <ArrowRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* === CORNER ACCENTS === */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-rose-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-pink-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-linear-to-l from-violet-500/8 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-linear-to-r from-rose-500/8 to-transparent blur-3xl pointer-events-none" />
      </section>
    </>
  );
}