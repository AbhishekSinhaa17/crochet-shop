"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  MessageCircle,
  Star,
  Package,
  Clock,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Search,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// export const metadata = {
//   title: 'FAQ | Strokes of Craft',
//   description: 'Frequently asked questions about our handmade crochet products, shipping, and custom orders.',
// };

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    "All",
    "Orders",
    "Materials",
    "Shipping",
    "Care",
    "Customization",
  ];

  const faqs = [
    {
      question: "How long do custom orders take?",
      answer:
        "Custom orders typically take 2-3 weeks to complete, depending on the complexity of the piece and our current order volume. We'll provide a more accurate timeline when we discuss your specific requirements.",
      category: "Orders",
      icon: Clock,
    },
    {
      question: "What materials do you use?",
      answer:
        "We use high-quality, ethically sourced yarns including 100% cotton, soft merino wool, and premium acrylic blends. For baby items, we strictly use hypoallergenic, wonderfully soft baby-grade yarns.",
      category: "Materials",
      icon: Star,
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we ship all across India. We are working on expanding our delivery network to international locations soon. Subscribe to our newsletter to stay updated!",
      category: "Shipping",
      icon: Package,
    },
    {
      question: "How do I care for my crochet items?",
      answer:
        "Most of our items can be gently hand-washed in lukewarm water with mild detergent. Lay them flat to dry on a clean towel. We provide detailed, specific care instructions with every purchase.",
      category: "Care",
      icon: HelpCircle,
    },
    {
      question: "Can I request a specific color or size?",
      answer:
        "Absolutely! We love doing custom variations of our existing designs. Just reach out to us via the Contact Us page or start a Chat to discuss your ideas.",
      category: "Customization",
      icon: MessageCircle,
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-12 pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 -z-30" />

      {/* Gradient Mesh Background */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-400/30 via-purple-400/20 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/25 via-rose-400/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-fuchsia-400/20 via-violet-400/15 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Animated Grid Pattern */}
      <div className="fixed inset-0 -z-10 opacity-[0.015] dark:opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {mounted && [...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-violet-500/40 to-pink-500/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative">
        {/* Back Navigation */}
        <div className="animate-fade-in-down mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 flex items-center justify-center group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 group-hover:shadow-violet-200/50 dark:group-hover:shadow-violet-900/30 transition-all duration-300 group-hover:-translate-x-1">
              <ArrowLeft className="w-4 h-4 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
            </div>
            <span className="group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Back to Home</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-20 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse-slow" />

          <div className="animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card shadow-lg shadow-violet-500/10 mb-8 border border-violet-200/50 dark:border-violet-800/50 group hover:scale-105 transition-transform duration-300 cursor-default">
              <div className="relative">
                <Sparkles className="w-4 h-4 text-violet-500 animate-sparkle" />
                <div className="absolute inset-0 text-violet-500 animate-ping opacity-50">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <span className="text-sm font-bold text-violet-700 dark:text-violet-300 tracking-wider uppercase">
                Help Center
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 animate-fade-in-up animation-delay-100">
            <span className="block mb-2">Frequently Asked</span>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 animate-gradient-x">
                Questions
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 10C50 4 100 2 150 6C200 10 250 4 298 2"
                  stroke="url(#underline-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-draw-line"
                />
                <defs>
                  <linearGradient
                    id="underline-gradient"
                    x1="0"
                    y1="0"
                    x2="300"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Everything you need to know about our products, services, and
            policies.
            <span className="block mt-2 text-violet-600 dark:text-violet-400 font-medium">
              We're here to help!
            </span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 animate-fade-in-up animation-delay-300">
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative flex items-center">
              <Search className="absolute left-5 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-300 text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up animation-delay-400">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg shadow-violet-500/30 scale-105"
                  : "bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-400 border border-slate-200/50 dark:border-slate-700/50"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-5">
          {filteredFaqs.map((faq, index) => {
            const Icon = faq.icon;
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <div
                  className={`relative rounded-3xl transition-all duration-500 ${
                    isOpen
                      ? "bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 p-[2px] shadow-2xl shadow-violet-500/20"
                      : "bg-transparent"
                  }`}
                >
                  <div
                    className={`relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[22px] overflow-hidden transition-all duration-500 ${
                      !isOpen &&
                      "border border-slate-200/50 dark:border-slate-700/50 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-xl hover:shadow-violet-500/10"
                    }`}
                  >
                    {/* Background glow on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-pink-500/5 transition-opacity duration-500 ${
                        isOpen
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    />

                    {/* Question Header */}
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full p-6 lg:p-8 flex items-center gap-5 text-left relative z-10"
                    >
                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                          isOpen
                            ? "bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/30 rotate-3 scale-110"
                            : "bg-violet-100/80 dark:bg-violet-900/40 group-hover:scale-105 group-hover:bg-violet-200/80 dark:group-hover:bg-violet-800/40"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 transition-all duration-300 ${
                            isOpen
                              ? "text-white"
                              : "text-violet-600 dark:text-violet-400"
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Category Badge */}
                        <span
                          className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-widest transition-all duration-300 ${
                            isOpen
                              ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {faq.category}
                        </span>

                        {/* Question */}
                        <h3
                          className={`text-xl lg:text-2xl font-bold transition-all duration-300 ${
                            isOpen
                              ? "text-violet-600 dark:text-violet-400"
                              : "text-slate-800 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400"
                          }`}
                        >
                          {faq.question}
                        </h3>
                      </div>

                      {/* Chevron */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                          isOpen
                            ? "bg-violet-500/10 rotate-180"
                            : "bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30"
                        }`}
                      >
                        <ChevronDown
                          className={`w-6 h-6 transition-all duration-300 ${
                            isOpen
                              ? "text-violet-600 dark:text-violet-400"
                              : "text-slate-400"
                          }`}
                        />
                      </div>
                    </button>

                    {/* Answer Panel */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-out ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-6 lg:px-8 pb-8 pl-[5.5rem] lg:pl-[7rem]">
                        <div className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500 to-pink-500 rounded-full" />
                          <p className="pl-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <HelpCircle className="w-10 h-10 text-violet-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
              No results found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}

        {/* Contact CTA Section */}
        <div className="mt-24 animate-fade-in-up animation-delay-800">
          <div className="relative group">
            {/* Animated border gradient */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition-all duration-700 animate-gradient-x" />

            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
              {/* Decorative background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-pink-500/10 via-violet-500/10 to-transparent rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
              </div>

              <div className="relative p-10 lg:p-16 text-center">
                {/* Floating icons */}
                <div className="absolute top-8 left-8 w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center animate-bounce-slow">
                  <MessageCircle className="w-6 h-6 text-violet-500" />
                </div>
                <div className="absolute top-12 right-12 w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center animate-bounce-slow animation-delay-1000">
                  <Star className="w-5 h-5 text-pink-500" />
                </div>
                <div className="absolute bottom-12 left-16 w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center animate-bounce-slow animation-delay-2000">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 mb-8">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                    We typically respond within 2 hours
                  </span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white mb-5">
                  Still have{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">
                    questions?
                  </span>
                </h2>

                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
                  Can't find the answer you're looking for? Our friendly team is
                  here to help you with anything you need.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/chat"
                    className="group/btn relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                    <span className="relative flex items-center gap-3">
                      <MessageCircle className="w-5 h-5" />
                      Start a Conversation
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-105"
                  >
                    Send Email
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.95);
          }
          75% {
            transform: translate(30px, 10px) scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.2) rotate(180deg);
          }
        }

        @keyframes draw-line {
          from {
            stroke-dashoffset: 400;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out both;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out both;
        }

        .animate-blob {
          animation: blob 12s ease-in-out infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }

        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }

        .animate-draw-line {
          stroke-dasharray: 400;
          animation: draw-line 1.5s ease-out 0.5s both;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        .animation-delay-4000 {
          animation-delay: 4000ms;
        }

        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
          backdrop-filter: blur(20px) saturate(180%);
        }

        .dark .glass-card {
          background: linear-gradient(135deg, rgba(30, 30, 45, 0.95) 0%, rgba(20, 20, 35, 0.85) 100%);
        }
      `}</style>
    </div>
  );
}
