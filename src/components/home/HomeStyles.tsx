'use client';

export default function HomeStyles() {
  return (
    <style jsx global>{`
      /* === BASE ANIMATIONS === */
      @keyframes slide-up {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slide-left {
        from {
          opacity: 0;
          transform: translateX(60px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .animate-slide-up {
        animation: slide-up 0.8s ease-out both;
      }

      .animate-slide-left {
        animation: slide-left 0.8s ease-out both;
      }

      /* === FLOATING ANIMATIONS === */
      @keyframes float {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
      }

      @keyframes float-slow {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
        }
        50% {
          transform: translateY(-15px) rotate(5deg);
        }
      }

      @keyframes float-slow-reverse {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
        }
        50% {
          transform: translateY(-15px) rotate(-5deg);
        }
      }

      @keyframes float-orb {
        0%, 100% {
          transform: translate(0, 0) scale(1);
        }
        33% {
          transform: translate(30px, -40px) scale(1.05);
        }
        66% {
          transform: translate(-20px, 20px) scale(0.95);
        }
      }

      .animate-float {
        animation: float 6s ease-in-out infinite;
      }

      .animate-float-slow {
        animation: float-slow 8s ease-in-out infinite;
      }

      .animate-float-slow-reverse {
        animation: float-slow-reverse 10s ease-in-out infinite;
      }

      /* === SPIN ANIMATIONS === */
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .animate-spin-very-slow {
        animation: spin 60s linear infinite;
      }

      .animate-spin-slow-reverse {
        animation: spin 45s linear infinite reverse;
      }

      /* === PULSE ANIMATIONS === */
      @keyframes pulse-slow {
        0%, 100% {
          opacity: 0.4;
          transform: scale(1);
        }
        50% {
          opacity: 0.7;
          transform: scale(1.05);
        }
      }

      @keyframes pulse-glow {
        0%, 100% {
          opacity: 0.6;
          box-shadow: 0 0 20px hsl(var(--primary) / 0.4);
        }
        50% {
          opacity: 1;
          box-shadow: 0 0 30px hsl(var(--primary) / 0.8);
        }
      }

      @keyframes ping-slow {
        0% {
          transform: scale(1);
          opacity: 0.8;
        }
        75%, 100% {
          transform: scale(2);
          opacity: 0;
        }
      }

      .animate-pulse-slow {
        animation: pulse-slow 4s ease-in-out infinite;
      }

      .animate-pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
      }

      .animate-ping-slow {
        animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
      }

      /* === MARQUEE === */
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      .animate-marquee {
        animation: marquee 40s linear infinite;
      }
      
      .animate-marquee:hover {
        animation-play-state: paused;
      }

      /* === SPECIAL ANIMATIONS === */
      @keyframes shimmer-slow {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      .animate-shimmer-slow {
        animation: shimmer-slow 3s linear infinite;
      }

      @keyframes draw-line {
        from {
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
        }
        to {
          stroke-dashoffset: 0;
        }
      }

      .animate-draw-line {
        animation: draw-line 2s ease-out forwards;
      }

      @keyframes scroll-indicator {
        0%, 100% {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        50% {
          transform: translateX(-50%) translateY(10px);
          opacity: 0.3;
        }
      }

      .animate-scroll-indicator {
        animation: scroll-indicator 2s ease-in-out infinite;
      }
    `}</style>
  );
}
