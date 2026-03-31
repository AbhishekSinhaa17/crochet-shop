import React from 'react';
import { HelpCircle, MessageCircle, Star, Package, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'FAQ | CrochetCraft',
  description: 'Frequently asked questions about our handmade crochet products, shipping, and custom orders.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How long do custom orders take?",
      answer: "Custom orders typically take 2-3 weeks to complete, depending on the complexity of the piece and our current order volume. We'll provide a more accurate timeline when we discuss your specific requirements.",
      category: "Orders",
      icon: Clock
    },
    {
      question: "What materials do you use?",
      answer: "We use high-quality, ethically sourced yarns including 100% cotton, soft merino wool, and premium acrylic blends. For baby items, we strictly use hypoallergenic, wonderfully soft baby-grade yarns.",
      category: "Materials",
      icon: Star
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we ship all across India. We are working on expanding our delivery network to international locations soon. Subscribe to our newsletter to stay updated!",
      category: "Shipping",
      icon: Package
    },
    {
      question: "How do I care for my crochet items?",
      answer: "Most of our items can be gently hand-washed in lukewarm water with mild detergent. Lay them flat to dry on a clean towel. We provide detailed, specific care instructions with every purchase.",
      category: "Care",
      icon: HelpCircle
    },
    {
      question: "Can I request a specific color or size?",
      answer: "Absolutely! We love doing custom variations of our existing designs. Just reach out to us via the Contact Us page or start a Chat to discuss your ideas.",
      category: "Customization",
      icon: MessageCircle
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background styling matching the global premium theme */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 -z-20" />
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-violet-100/50 via-pink-50/50 to-transparent dark:from-violet-900/20 dark:via-pink-900/10 dark:to-transparent -z-10" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite] -z-10" />
      <div className="absolute top-40 -left-40 w-72 h-72 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_2s] -z-10" />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-sm mb-6 border border-violet-200/50 dark:border-violet-800/50">
            <HelpCircle className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300 tracking-wide uppercase">Help Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">Questions</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about our products, services, and policies. Can't find the answer you're looking for? Feel free to contact us.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 lg:p-8 hover:shadow-xl hover:shadow-violet-500/5 dark:hover:shadow-violet-500/10 transition-all duration-300"
                style={{ animation: `fade-in-up ${0.3 + index * 0.1}s ease-out both` }}
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-pink-500/5 dark:from-violet-500/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-violet-100/50 dark:bg-violet-900/30 flex items-center justify-center shrink-0 border border-violet-200/50 dark:border-violet-700/50 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-16 text-center" style={{ animation: 'fade-in-up 0.6s ease-out 0.8s both' }}>
          <div className="inline-flex flex-col items-center p-8 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 p-[1px] shadow-xl w-full max-w-2xl">
            <div className="bg-white dark:bg-slate-900 rounded-[23px] p-8 sm:p-12 h-full w-full relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-pink-500/5 blur-xl -z-10" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Still have questions?</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                We're here to help! Send us a message and we'll get back to you as soon as possible.
              </p>
              <Link 
                href="/chat"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-pink-600 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          backdrop-filter: blur(20px) saturate(180%);
        }
        .dark .glass-card {
           background: linear-gradient(135deg, rgba(30, 30, 45, 0.9) 0%, rgba(20, 20, 35, 0.8) 100%);
        }
      `}</style>
    </div>
  );
}
