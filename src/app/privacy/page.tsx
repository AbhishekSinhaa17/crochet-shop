'use client';

import { ArrowLeft, ShieldCheck, Mail, Lock, Eye, Check, Clock, Sparkles, ChevronRight, ArrowRight, MessageCircle, X, Shield, Globe, Database } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PrivacyPolicyPage() {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const sections = [
    {
      title: "Information We Collect",
      content: "We collect information you provide directly to us when you make a purchase, create an account, or contact us. This includes your name, email address, shipping address, and payment information. We also collect data related to your browsing behavior to improve our website experience.",
      icon: Database,
      color: "emerald"
    },
    {
      title: "How We Use Your Data",
      content: "Your data is primarily used to process your orders, provide customer support, and send you updates about your purchase. If you've opted in, we may also send you marketing communications about new products and special offers.",
      icon: Eye,
      color: "blue"
    },
    {
      title: "Cookies & Tracking",
      content: "We use cookies to enhance your experience, remember your preferences, and analyze our traffic. You can choose to disable cookies through your browser settings, but please note that some parts of our website may not function correctly as a result.",
      icon: Globe,
      color: "violet"
    },
    {
      title: "Data Security",
      content: "We take the security of your personal information seriously. We use industry-standard encryption and security measures to protect your data from unauthorized access, disclosure, or alteration.",
      icon: Lock,
      color: "amber"
    },
    {
      title: "Third-Party Sharing",
      content: "We do not sell your personal data. We only share information with third-party service providers (such as shipping companies and payment processors) who assist us in operating our website and processing your orders.",
      icon: ShieldCheck,
      color: "rose"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-linear-to-tr from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8 pb-20 lg:pt-12 lg:pb-28 relative z-10">
        
        {/* Navigation */}
        <div className="animate-fade-in-down">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 mb-12 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:shadow-emerald-200/50 dark:group-hover:shadow-emerald-900/30 transition-all duration-300 group-hover:-translate-x-1">
              <ArrowLeft className="w-4 h-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
            </div>
            <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Back to Home</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="animate-fade-in-down animation-delay-100">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg shadow-emerald-500/10 border border-emerald-200/50 dark:border-emerald-800/50 mb-8 group hover:scale-105 transition-all duration-300">
              <Lock className="w-4 h-4 text-emerald-500 animate-sparkle" />
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 tracking-wider uppercase">Privacy & Safety</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-in-up animation-delay-300">
            <span className="block">Privacy</span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-teal-600 to-blue-600 animate-gradient-x">Policy</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
            Your privacy is important to us. We are committed to protecting your personal data and being transparent about how we use it.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 mb-20">
          {sections.map((section, index) => {
            const isExpanded = expandedSection === index;
            const colorMap = {
              emerald: 'from-emerald-500 to-teal-500',
              blue: 'from-blue-500 to-cyan-500',
              violet: 'from-violet-500 to-purple-500',
              amber: 'from-amber-500 to-orange-500',
              rose: 'from-rose-500 to-pink-500',
            };

            return (
              <div 
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${500 + index * 100}ms` }}
              >
                <div className={`relative rounded-3xl transition-all duration-500 ${isExpanded ? 'bg-linear-to-r ' + colorMap[section.color as keyof typeof colorMap] + ' p-[2px]' : ''}`}>
                  <div className="relative bg-white dark:bg-slate-900 rounded-[22px] overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : index)}
                      className="w-full p-6 lg:p-8 flex items-center gap-6 text-left group"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isExpanded ? 'bg-linear-to-br ' + colorMap[section.color as keyof typeof colorMap] + ' text-white scale-110' : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        <section.icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{section.title}</h3>
                      </div>
                      <ChevronRight className={`w-6 h-6 transition-all duration-300 ${isExpanded ? 'rotate-90 text-slate-400' : 'text-slate-300'}`} />
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-8 pb-8 pl-[5.5rem]">
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed border-l-4 border-emerald-500/20 pl-6">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="text-center animate-fade-in-up animation-delay-1200">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            For any data-related queries, please email us at <Link href="mailto:hello@strokesofcraft.in" className="text-emerald-600 font-bold hover:underline">hello@strokesofcraft.in</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blob { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes sparkle { 0%, 100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.2) rotate(180deg); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out both; }
        .animate-blob { animation: blob 10s infinite ease-in-out; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 12s ease infinite; }
        .animate-sparkle { animation: sparkle 3s ease-in-out infinite; }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-1200 { animation-delay: 1200ms; }
      `}</style>
    </div>
  );
}
