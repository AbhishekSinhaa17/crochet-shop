'use client';

import { ArrowLeft, RefreshCcw, ShieldCheck, Mail, AlertTriangle, PackageSearch, Check, Clock, Package, Sparkles, ChevronRight, ArrowRight, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// export const metadata: Metadata = {
//   title: "Returns Policy | Strokes of Craft",
//   description: "Our policies and procedures for product returns, exchanges, and refunds.",
// };

export default function ReturnPolicyPage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const returnSteps = [
    { step: 1, title: "Contact Us", description: "Reach out within 7 days of delivery via chat or email", icon: MessageCircle },
    { step: 2, title: "Get Address", description: "We'll provide you with a return shipping address", icon: Package },
    { step: 3, title: "Ship Item", description: "Securely pack and ship the item back to us", icon: RefreshCcw },
    { step: 4, title: "Get Refund", description: "Refund processed within 10 business days", icon: Check },
  ];

  const policies = [
    {
      title: "Standard Return Policy",
      content: "We accept returns for standard, non-customized crochet items within 7 days of the delivery date. To be eligible for a return, the item must be unused, unwashed, and in the same condition that you received it. It must also be in the original packaging with all tags attached.",
      icon: ShieldCheck,
      color: "rose"
    },
    {
      title: "Non-Returnable Items",
      content: "Due to the unique, handcrafted nature of our business, certain items cannot be returned:",
      list: [
        "Custom-made items or personalized commissions",
        "Items bought during clearance or flash sales",
        "Digital patterns or tutorials",
        "Intimate items (e.g., crochet earrings or specific baby goods) due to hygiene reasons"
      ],
      icon: X,
      color: "amber"
    },
    {
      title: "Shipping Costs",
      content: "You will be responsible for paying your own shipping costs for returning your item unless the item arrived damaged or defective. Original shipping costs are non-refundable. If you receive a refund, the cost of original shipping will be deducted from your refund.",
      icon: Package,
      color: "violet"
    },
    {
      title: "Damaged or Defective Items",
      content: "We stringently inspect every stitch before shipping, but if you receive a damaged or defective item, please contact us immediately! We will enthusiastically replace the item or offer a full refund, and we will cover the return shipping costs in these rare scenarios.",
      icon: AlertTriangle,
      color: "emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-linear-to-br from-rose-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-linear-to-tr from-violet-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-linear-to-r from-pink-500/10 via-rose-500/10 to-violet-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-linear-to-br from-rose-500/30 to-pink-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8 pb-20 lg:pt-12 lg:pb-28 relative z-10">
        
        {/* Back Navigation */}
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

        {/* Hero Header */}
        <div className="text-center mb-20 relative">
          {/* Decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-linear-to-br from-rose-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-slow" />
          
          <div className="animate-fade-in-down animation-delay-100">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg shadow-rose-500/10 border border-rose-200/50 dark:border-rose-800/50 mb-8 group hover:scale-105 transition-all duration-300">
              <div className="relative">
                <Sparkles className="w-4 h-4 text-rose-500 animate-sparkle" />
              </div>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase">Return Policy</span>
            </div>
          </div>

          <div className="relative inline-block mb-8 animate-fade-in-up animation-delay-200">
            <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-rose-500 via-pink-500 to-rose-600 shadow-2xl shadow-rose-500/30 flex items-center justify-center text-white mx-auto transform hover:rotate-6 hover:scale-110 transition-all duration-500 group cursor-default">
              <RefreshCcw className="w-12 h-12 group-hover:rotate-180 transition-transform duration-700" />
              {/* Orbiting dots */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-in-up animation-delay-300">
            <span className="block">Returns &</span>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 animate-gradient-x">
                Exchanges
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 4 100 2 150 6C200 10 250 4 298 2" stroke="url(#rose-gradient)" strokeWidth="3" strokeLinecap="round" className="animate-draw-line" />
                <defs>
                  <linearGradient id="rose-gradient" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="#F43F5E" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#F43F5E" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
            We pour our hearts into crafting your items. If something isn't quite right, 
            <span className="block mt-2 text-rose-600 dark:text-rose-400 font-medium">here's everything you need to know.</span>
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: ShieldCheck, title: "7-Day Window", desc: "Request a return within 7 days of receiving your order", color: "rose", delay: 500 },
            { icon: PackageSearch, title: "Original Condition", desc: "Items must be unworn, unwashed, and in original packaging", color: "violet", delay: 600 },
            { icon: AlertTriangle, title: "Exclusions Apply", desc: "Custom orders and personalized items are non-refundable", color: "amber", delay: 700 },
          ].map((item, index) => (
            <div 
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${item.delay}ms` }}
            >
              {/* Card glow effect */}
              <div className={`absolute -inset-0.5 bg-linear-to-r ${
                item.color === 'rose' ? 'from-rose-500 to-pink-500' :
                item.color === 'violet' ? 'from-violet-500 to-purple-500' :
                'from-amber-500 to-orange-500'
              } rounded-3xl blur opacity-0 group-hover:opacity-30 transition-all duration-500`} />
              
              <div className="relative p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-linear-to-br ${
                  item.color === 'rose' ? 'from-rose-500/5 to-pink-500/5' :
                  item.color === 'violet' ? 'from-violet-500/5 to-purple-500/5' :
                  'from-amber-500/5 to-orange-500/5'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                    item.color === 'rose' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 group-hover:shadow-lg group-hover:shadow-rose-500/30' :
                    item.color === 'violet' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 group-hover:shadow-lg group-hover:shadow-violet-500/30' :
                    'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:shadow-lg group-hover:shadow-amber-500/30'
                  }`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-slate-800 dark:text-white">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Return Process Timeline */}
        <div className="mb-20 animate-fade-in-up animation-delay-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-4">
              How It <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-pink-500">Works</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Simple 4-step process to return your item</p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-linear-to-r from-rose-200 via-pink-200 to-rose-200 dark:from-rose-900/50 dark:via-pink-900/50 dark:to-rose-900/50 -translate-y-1/2 rounded-full" />
            <div className="hidden md:block absolute top-1/2 left-0 h-1 bg-linear-to-r from-rose-500 to-pink-500 -translate-y-1/2 rounded-full transition-all duration-1000 animate-progress-line" style={{ width: '100%' }} />

            <div className="grid md:grid-cols-4 gap-6">
              {returnSteps.map((item, index) => (
                <div 
                  key={index}
                  className="relative group"
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <div className={`relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all duration-500 cursor-pointer ${
                    activeStep === index 
                      ? 'border-rose-500 shadow-2xl shadow-rose-500/20 scale-105 -translate-y-2' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700'
                  }`}>
                    {/* Step number */}
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      activeStep === index 
                        ? 'bg-linear-to-br from-rose-500 to-pink-500 text-white scale-125 shadow-lg shadow-rose-500/40' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {item.step}
                    </div>

                    <div className="pt-4 text-center">
                      <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-500 ${
                        activeStep === index 
                          ? 'bg-linear-to-br from-rose-500 to-pink-500 text-white rotate-6 scale-110' 
                          : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                      }`}>
                        <item.icon className="w-7 h-7" />
                      </div>
                      <h4 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Policy Sections */}
        <div className="mb-20">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-4">
              Policy <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-pink-500">Details</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">Everything you need to know about our return policy</p>
          </div>

          <div className="space-y-5">
            {policies.map((policy, index) => {
              const isExpanded = expandedSection === index;
              const colorClasses = {
                rose: 'from-rose-500 to-pink-500',
                amber: 'from-amber-500 to-orange-500',
                violet: 'from-violet-500 to-purple-500',
                emerald: 'from-emerald-500 to-teal-500',
              };
              
              return (
                <div 
                  key={index}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${900 + index * 100}ms` }}
                >
                  <div className={`relative rounded-3xl transition-all duration-500 ${
                    isExpanded 
                      ? `bg-linear-to-r ${colorClasses[policy.color as keyof typeof colorClasses]} p-[2px] shadow-2xl shadow-${policy.color}-500/20` 
                      : ''
                  }`}>
                    <div className={`relative bg-white dark:bg-slate-900 rounded-[22px] overflow-hidden transition-all duration-500 ${
                      !isExpanded && 'border border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}>
                      {/* Header */}
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : index)}
                        className="w-full p-6 lg:p-8 flex items-center gap-5 text-left group"
                      >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                          isExpanded 
                            ? `bg-linear-to-br ${colorClasses[policy.color as keyof typeof colorClasses]} text-white shadow-lg rotate-3 scale-110` 
                            : `bg-${policy.color}-100 dark:bg-${policy.color}-900/30 text-${policy.color}-600 dark:text-${policy.color}-400 group-hover:scale-105`
                        }`}
                        style={{
                          background: !isExpanded ? undefined : undefined,
                          backgroundColor: !isExpanded ? (policy.color === 'rose' ? 'rgb(255 228 230)' : policy.color === 'amber' ? 'rgb(254 243 199)' : policy.color === 'violet' ? 'rgb(237 233 254)' : 'rgb(209 250 229)') : undefined,
                        }}
                        >
                          <policy.icon className="w-7 h-7" />
                        </div>

                        <div className="flex-1">
                          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-widest ${
                            isExpanded 
                              ? 'bg-white/20 text-slate-700 dark:text-slate-300' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            Section {index + 1}
                          </span>
                          <h3 className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                            isExpanded 
                              ? 'text-slate-800 dark:text-white' 
                              : 'text-slate-800 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400'
                          }`}>
                            {policy.title}
                          </h3>
                        </div>

                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                          isExpanded 
                            ? 'bg-white/10 rotate-90' 
                            : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30'
                        }`}>
                          <ChevronRight className={`w-6 h-6 transition-all duration-300 ${
                            isExpanded ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'
                          }`} />
                        </div>
                      </button>

                      {/* Content */}
                      <div className={`overflow-hidden transition-all duration-500 ease-out ${
                        isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="px-6 lg:px-8 pb-8 pl-[5.5rem] lg:pl-[7rem]">
                          <div className="relative">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full bg-linear-to-b ${colorClasses[policy.color as keyof typeof colorClasses]}`} />
                            <div className="pl-6">
                              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                {policy.content}
                              </p>
                              {policy.list && (
                                <ul className="space-y-3">
                                  {policy.list.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                      <span className={`w-6 h-6 rounded-full bg-linear-to-br ${colorClasses[policy.color as keyof typeof colorClasses]} flex items-center justify-center shrink-0 mt-0.5`}>
                                        <X className="w-3 h-3 text-white" />
                                      </span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="animate-fade-in-up animation-delay-1200">
          <div className="relative group">
            {/* Animated border */}
            <div className="absolute -inset-1 bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition-all duration-700 animate-gradient-x" />
            
            <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
              {/* Decorative background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-br from-rose-500/10 via-pink-500/10 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-linear-to-tr from-pink-500/10 via-rose-500/10 to-transparent rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
              </div>

              <div className="relative p-12 lg:p-16 text-center">
                {/* Floating elements */}
                <div className="absolute top-8 left-8 w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center animate-bounce-slow">
                  <Mail className="w-6 h-6 text-rose-500" />
                </div>
                <div className="absolute top-12 right-12 w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center animate-bounce-slow animation-delay-1000">
                  <MessageCircle className="w-5 h-5 text-pink-500" />
                </div>
                <div className="absolute bottom-12 left-16 w-8 h-8 rounded-md bg-rose-500/10 flex items-center justify-center animate-bounce-slow animation-delay-2000">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 mb-8">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">Our team typically responds within 2 hours</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-black text-slate-800 dark:text-white mb-5">
                  Still have <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-pink-500">questions?</span>
                </h2>
                
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
                  Need help with a return? Our friendly support team is here to assist you every step of the way.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/chat"
                    className="group/btn relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/30"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-rose-500 via-pink-500 to-rose-600 transition-all duration-500" />
                    <div className="absolute inset-0 bg-linear-to-r from-pink-600 via-rose-500 to-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                    <span className="relative flex items-center gap-3">
                      <Mail className="w-5 h-5" />
                      Contact Support
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Link>
                  
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-105"
                  >
                    View FAQ
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
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.1);
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

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes progress-line {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out both;
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

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-progress-line {
          animation: progress-line 2s ease-out 1s both;
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

        .animation-delay-1200 {
          animation-delay: 1200ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        .animation-delay-4000 {
          animation-delay: 4000ms;
        }
      `}</style>
    </div>
  );
}