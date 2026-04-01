'use client';

import { ArrowLeft, FileText, ShieldCheck, Mail, AlertTriangle, Scale, Check, Clock, Sparkles, ChevronRight, ArrowRight, MessageCircle, X, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TermsOfServicePage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const sections = [
    {
      title: "Agreement to Terms",
      content: "By accessing or using CrochetCraft, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services. These terms apply to all visitors, users, and others who access or use the service.",
      icon: Scale,
      color: "violet"
    },
    {
      title: "Custom Orders & Commissions",
      content: "Custom orders are handcrafted specifically for you. Once production has started, custom orders cannot be cancelled. We require a 50% deposit for large commissions. We will provide photos of the finished product for your approval before shipping.",
      icon: Sparkles,
      color: "pink"
    },
    {
      title: "Payments & Pricing",
      content: "All prices are in Indian Rupees (INR) unless stated otherwise. We reserve the right to change our prices at any time without notice. Payments must be made in full through our secure payment gateways before orders are dispatched.",
      icon: ShieldCheck,
      color: "blue"
    },
    {
      title: "Intellectual Property",
      content: "All designs, patterns, photographs, and content on CrochetCraft are the intellectual property of our artisans. You may not reproduce, redistribute, or sell our patterns or finished items without explicit written permission.",
      icon: Shield,
      color: "amber"
    },
    {
      title: "Shipping & Delivery",
      content: "We ship all across India. Delivery times are estimates and not guarantees. We are not responsible for delays caused by the courier service or incorrect address information provided by the customer.",
      icon: Clock,
      color: "emerald"
    }
  ];

  const highlights = [
    { title: "Safe Shopping", icon: ShieldCheck, desc: "100% secure payments" },
    { title: "Handmade Quality", icon: Sparkles, desc: "Crafted with precision" },
    { title: "Support", icon: Mail, desc: "24/7 customer help" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/10 via-rose-500/5 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        <div className="absolute inset-0 opacity-[0.01] dark:opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8 pb-20 lg:pt-12 lg:pb-28 relative z-10">
        
        {/* Navigation */}
        <div className="animate-fade-in-down">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 mb-12 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 flex items-center justify-center group-hover:bg-violet-50 dark:group-hover:bg-violet-900/20 group-hover:shadow-violet-200/50 dark:group-hover:shadow-violet-900/30 transition-all duration-300 group-hover:-translate-x-1">
              <ArrowLeft className="w-4 h-4 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
            </div>
            <span className="group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Back to Home</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-slow" />
          
          <div className="animate-fade-in-down animation-delay-100">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg shadow-violet-500/10 border border-violet-200/50 dark:border-violet-800/50 mb-8 group hover:scale-105 transition-all duration-300">
              <Scale className="w-4 h-4 text-violet-500 animate-sparkle" />
              <span className="text-sm font-bold text-violet-700 dark:text-violet-300 tracking-wider uppercase">Legal Documentation</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-in-up animation-delay-300">
            <span className="block">Terms of</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 animate-gradient-x">Service</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
            Welcome to CrochetCraft. Please read these terms carefully before using our services. 
            Updated on <span className="font-semibold text-violet-600 dark:text-violet-400">October 2023.</span>
          </p>
        </div>

        {/* Highlight Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {highlights.map((item, index) => (
            <div 
              key={index}
              className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${500 + index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 mb-20">
          {sections.map((section, index) => {
            const isExpanded = expandedSection === index;
            const colorMap = {
              violet: 'from-violet-500 to-purple-500',
              pink: 'from-pink-500 to-rose-500',
              blue: 'from-blue-500 to-indigo-500',
              amber: 'from-amber-500 to-orange-500',
              emerald: 'from-emerald-500 to-teal-500',
            };

            return (
              <div 
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${700 + index * 100}ms` }}
              >
                <div className={`relative rounded-3xl transition-all duration-500 ${isExpanded ? 'bg-gradient-to-r ' + colorMap[section.color as keyof typeof colorMap] + ' p-[2px]' : ''}`}>
                  <div className="relative bg-white dark:bg-slate-900 rounded-[22px] overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : index)}
                      className="w-full p-6 lg:p-8 flex items-center gap-6 text-left group"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isExpanded ? 'bg-gradient-to-br ' + colorMap[section.color as keyof typeof colorMap] + ' text-white scale-110' : 'bg-slate-100 dark:bg-slate-800'
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
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed border-l-4 border-violet-500/20 pl-6">
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

        {/* Call to Action */}
        <div className="animate-fade-in-up animation-delay-1200">
          <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] p-12 lg:p-16 text-center shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-3xl font-black mb-4">Any <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">Concerns?</span></h2>
            <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto">If you have any questions regarding our terms, feel free to reach out to our team.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Contact Support <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blob { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out both; }
        .animate-blob { animation: blob 8s infinite ease-in-out; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 15s ease infinite; }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-1200 { animation-delay: 1200ms; }
      `}</style>
    </div>
  );
}
