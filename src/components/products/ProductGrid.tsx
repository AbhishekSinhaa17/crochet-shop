"use client";

import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  isAdmin?: boolean;
}

export default function ProductGrid({ products, title, subtitle, showHeader = true, isAdmin = false }: ProductGridProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-linear-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        {showHeader && (title || subtitle) && (
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-12 bg-linear-to-r from-transparent to-purple-500" />
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
              </span>
              <span className="h-px w-12 bg-linear-to-l from-transparent to-purple-500" />
            </div>

            {title && (
              <h2 className="relative inline-block">
                {/* Background Glow */}
                <span className="absolute inset-0 blur-2xl bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 opacity-30 animate-pulse" />
                
                {/* Main Title */}
                <span className="relative text-4xl md:text-5xl lg:text-6xl font-display font-bold bg-linear-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent">
                  {title}
                </span>
                
                {/* Animated Underline */}
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full transform origin-left animate-shimmer" />
              </h2>
            )}

            {subtitle && (
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {subtitle.split(' ').map((word, i) => (
                  <span
                    key={i}
                    className="inline-block animate-fadeInUp"
                    style={{ animationDelay: `${0.5 + i * 0.05}s` }}
                  >
                    {word}&nbsp;
                  </span>
                ))}
              </p>
            )}

            {/* Decorative Badge */}
            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-purple-100 shadow-lg shadow-purple-500/10">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-600">
                {products.length} Premium Products
              </span>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div 
            className={`text-center py-20 transition-all duration-700 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="relative inline-block">
              {/* Empty State Illustration */}
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-linear-to-br from-purple-100 to-pink-100 rounded-3xl rotate-6 animate-pulse" />
                <div className="absolute inset-0 bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl flex items-center justify-center">
                  <svg 
                    className="w-16 h-16 text-purple-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                    />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                We couldn't find any products matching your criteria. Try adjusting your filters.
              </p>
              
              <button className="mt-6 px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all duration-300">
                Explore All Products
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div
                  key={`grid-${product.id || 'p'}-${index}`}
                  className={`group relative transition-all duration-700 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-20'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Card Glow Effect */}
                  <div 
                    className={`absolute -inset-0.5 bg-linear-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl opacity-0 blur transition-all duration-500 ${
                      hoveredIndex === index ? 'opacity-75' : ''
                    }`} 
                  />
                  
                  {/* Card Container */}
                  <div className="relative bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden transform transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-purple-500/20">
                    {/* Premium Badge */}
                    {index < 3 && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-linear-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg animate-bounce-slow">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          TOP
                        </span>
                      </div>
                    )}

                    <ProductCard product={product} isAdmin={isAdmin} />
                  </div>

                  {/* Reflection Effect */}
                  <div className="absolute -bottom-4 left-4 right-4 h-8 bg-linear-to-b from-gray-200/30 to-transparent rounded-b-2xl blur-sm transform scale-y-[-1] opacity-50" />
                </div>
              ))}
            </div>

            {/* Load More Section */}
            <div 
              className={`mt-16 text-center transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Link 
                href="/products"
                className="group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden rounded-full bg-gray-900 text-white font-medium shadow-2xl hover:shadow-purple-500/25 transition-all duration-500"
              >
                {/* Button Gradient Animation */}
                <span className="absolute inset-0 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Shine Effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
                
                <span className="relative">View All Products</span>
                <svg 
                  className="relative w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 30px) scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes shimmer {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-blob {
          animation: blob 10s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 1s ease-out forwards;
          animation-delay: 0.5s;
          transform: scaleX(0);
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}