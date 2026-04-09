'use client';

import { ArrowLeft, Mail, Phone, MapPin, Instagram, Facebook, Youtube, Send, Sparkles, MessageCircle, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    { icon: Mail, title: "Email Us", value: "hello@strokesofcraft.in", href: "mailto:hello@strokesofcraft.in", color: "violet" },
    { icon: Phone, title: "Call Us", value: "+91 98765 43210", href: "tel:+919876543210", color: "blue" },
    { icon: MapPin, title: "Visit Us", value: "123 Craft Lane, Creative City, IN", href: "#", color: "pink" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-linear-to-br from-violet-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-linear-to-tr from-blue-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
        
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

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Contact Info & Text */}
          <div className="space-y-12">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg shadow-violet-500/10 border border-violet-200/50 dark:border-violet-800/50 mb-8 group">
                <MessageCircle className="w-4 h-4 text-violet-500 animate-sparkle" />
                <span className="text-sm font-bold text-violet-700 dark:text-violet-300 tracking-wider uppercase">Get In Touch</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Let&apos;s Start a <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 animate-gradient-x">Conversation</span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                Have a question about a product or interested in a custom commission? We&apos;d love to hear from you.
              </p>
            </div>

            <div className="grid gap-6 animate-fade-in-up animation-delay-300">
              {contactInfo.map((item, index) => (
                <a 
                  key={index} 
                  href={item.href}
                  className="flex items-center gap-6 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    item.color === 'violet' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' :
                    item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
                  }`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</h3>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="flex gap-4 animate-fade-in-up animation-delay-400">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-violet-600 hover:text-white transition-all duration-300 shadow-lg shadow-violet-500/5">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="animate-fade-in-up animation-delay-500">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition-all duration-700" />
              <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 lg:p-12 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <h2 className="text-2xl font-black mb-8">Send a <span className="text-violet-600">Message</span></h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Your Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe" 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-violet-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com" 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-violet-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 outline-none" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Subject</label>
                    <input 
                      required
                      type="text" 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="How can we help?" 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-violet-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 outline-none" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Your Message</label>
                    <textarea 
                      required
                      rows={4} 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Write your message here..." 
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-violet-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300 outline-none resize-none" 
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 rounded-2xl bg-linear-to-r from-violet-600 to-pink-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>

                {isSubmitted && (
                  <div className="absolute inset-0 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center p-12 z-20 animate-fade-in">
                    <CheckCircle className="w-20 h-20 text-emerald-500 mb-6 animate-bounce-slow" />
                    <h3 className="text-3xl font-black mb-4">Message Sent!</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Thank you for reaching out. We&apos;ll get back to you as soon as possible (usually within 2 hours).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes blob { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes sparkle { 0%, 100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.2) rotate(180deg); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out both; }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out both; }
        .animate-fade-in { animation: fade-in 0.5s ease-out both; }
        .animate-blob { animation: blob 15s infinite ease-in-out; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 6s ease infinite; }
        .animate-sparkle { animation: sparkle 4s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
      `}</style>
    </div>
  );
}
