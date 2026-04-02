'use client';

import { ArrowLeft, Cookie, ShieldCheck, Mail, Info, Check, Clock, Sparkles, ChevronRight, ArrowRight, MessageCircle, X, Shield, Settings, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CookiesPolicyPage() {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const cookieTypes = [
    {
      title: "Essential Cookies",
      content: "These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how our website functions.",
      icon: Shield,
      color: "rose"
    },
    {
      title: "Performance & Analytics",
      content: "These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website and application for you in order to enhance your experience.",
      icon: Settings,
      color: "blue"
    },
    {
      title: "Functionality Cookies",
      content: "These are used to recognize you when you return to our website. This enables us to personalize our content for you, greet you by name and remember your preferences (for example, your choice of language or region).",
      icon: MousePointer2,
      color: "violet"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-linear-to-br from-rose-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl animate-blob animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-linear-to-tr from-violet-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 lg:py-28 relative z-10">
        
        {/* Navigation */}
        <div className="animate-fade-in-down">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 mb-12 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 flex items-center justify-center group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 group-hover:shadow-rose-200/50 dark:group-hover:shadow-rose-900/30 transition-all duration-300 group-hover:-translate-x-1">
              <ArrowLeft className="w-4 h-4 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" />
            </div>
            <span className="group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Back to Home</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="animate-fade-in-down animation-delay-100">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg shadow-rose-500/10 border border-rose-200/50 dark:border-rose-800/50 mb-8 group hover:scale-105 transition-all duration-300">
              <Cookie className="w-4 h-4 text-rose-500 animate-sparkle" />
              <span className="text-sm font-bold text-rose-700 dark:text-rose-300 tracking-wider uppercase">Cookies Policy</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-in-up animation-delay-300">
            <span className="block">Cookie</span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-pink-600 to-violet-600 animate-gradient-x">Management</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
            We use cookies to ensure you get the best experience on Strokes of Craft. Learn more about how we use them and how you can manage them.
          </p>
        </div>

        {/* Cookie Info Cards */}
        <div className="space-y-6 mb-20">
          {cookieTypes.map((cookie, index) => {
            const isExpanded = expandedSection === index;
            const colorMap = {
              rose: 'from-rose-500 to-pink-500',
              blue: 'from-blue-500 to-indigo-500',
              violet: 'from-violet-500 to-purple-500',
            };

            return (
              <div 
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <div className={`relative rounded-3xl transition-all duration-500 ${isExpanded ? 'bg-linear-to-r ' + colorMap[cookie.color as keyof typeof colorMap] + ' p-[2px]' : ''}`}>
                  <div className="relative bg-white dark:bg-slate-900 rounded-[22px] overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : index)}
                      className="w-full p-6 lg:p-8 flex items-center gap-6 text-left group"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isExpanded ? 'bg-linear-to-br ' + colorMap[cookie.color as keyof typeof colorMap] + ' text-white scale-110' : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        <cookie.icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{cookie.title}</h3>
                      </div>
                      <ChevronRight className={`w-6 h-6 transition-all duration-300 ${isExpanded ? 'rotate-90 text-slate-400' : 'text-slate-300'}`} />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-8 pb-8 pl-[5.5rem]">
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed border-l-4 border-rose-500/20 pl-6">
                          {cookie.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing Info */}
        <div className="animate-fade-in-up animation-delay-1200 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[2.5rem] p-10 lg:p-12 text-center">
          <Info className="w-12 h-12 text-rose-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold mb-4">How to manage cookies</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, as it will no longer be personalized to you.
            For any data-related queries, please email us at <Link href="mailto:hello@strokesofcraft.in" className="text-emerald-600 font-bold hover:underline">hello@strokesofcraft.in</Link>
          </p>
          <div className="inline-flex items-center gap-2 text-rose-600 font-bold hover:underline cursor-pointer">
            Explore your browser settings <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -20px) scale(1.05); } }
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes sparkle { 0%, 100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.2) rotate(180deg); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out both; }
        .animate-blob { animation: blob 15s infinite ease-in-out; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 8s ease infinite; }
        .animate-sparkle { animation: sparkle 4s ease-in-out infinite; }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-1200 { animation-delay: 1200ms; }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.3; } }
        .animate-pulse-slow { animation: pulse-slow 5s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
