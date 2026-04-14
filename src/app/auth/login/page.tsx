"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Sparkles, Heart, ChevronLeft, Scissors } from "lucide-react";
import toast from "react-hot-toast";
import { Logger } from "@/lib/logger";
import { motion, AnimatePresence } from "framer-motion";
import { drand } from "@/lib/drand";

// Custom Yarn Ball SVG Component
const YarnBall = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.svg
    viewBox="0 0 100 100"
    className={className}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6, type: "spring" }}
  >
    <circle cx="50" cy="50" r="45" fill="currentColor" opacity="0.3" />
    <path
      d="M20 50 Q35 30 50 50 T80 50"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      opacity="0.5"
    />
    <path
      d="M25 35 Q45 55 65 35"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      opacity="0.4"
    />
    <path
      d="M30 65 Q50 45 70 65"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      opacity="0.4"
    />
  </motion.svg>
);

// Custom Crochet Hook SVG
const CrochetHook = ({ className }: { className?: string }) => (
  <motion.svg
    viewBox="0 0 24 100"
    className={className}
    initial={{ opacity: 0, rotate: -45 }}
    animate={{ opacity: 1, rotate: 0 }}
    transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
  >
    <path
      d="M12 10 C12 5 8 2 12 2 C16 2 14 8 12 10 L12 95"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  </motion.svg>
);

// Floating yarn strand animation
const FloatingYarn = ({ delay = 0, duration = 20 }: { delay?: number; duration?: number }) => (
  <motion.div
    className="absolute"
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0, 0.3, 0.3, 0],
      x: [0, 100, -50, 0],
      y: [0, -50, 50, 0],
    }}
    transition={{
      delay,
      duration,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    <svg width="200" height="100" viewBox="0 0 200 100">
      <motion.path
        d="M0 50 Q50 0 100 50 T200 50"
        stroke="url(#yarnGradient)"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 2, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="yarnGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#f9a8d4" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);

// Stitch pattern background
const StitchPattern = () => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
    <svg width="100%" height="100%" className="text-pink-900 dark:text-pink-300">
      <defs>
        <pattern id="stitches" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20 L10 10 L20 20 L10 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M20 20 L30 10 L40 20 L30 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stitches)" />
    </svg>
  </div>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(error.message);
        setLoading(false);
      } else {
        toast.success("Welcome back! 🧶");
        router.push(redirect);
        setTimeout(() => router.refresh(), 100);
      }
    } catch (err: any) {
      Logger.error("Login Error", err, { module: "auth", action: "login" });
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Store redirect path in a cookie so the server-side callback can read it
    document.cookie = `auth_redirect=${encodeURIComponent(redirect)}; path=/; max-age=300; SameSite=Lax; Secure`;
    
    // Use exact URL that matches Supabase's allowed redirect URLs (no query params)
    const redirectTo = `${window.location.origin}/auth/callback`;
    
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { 
        redirectTo,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        }
      },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-linear-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Back to Home Button */}
      <motion.div
        className="absolute top-8 left-8 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-white/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 group shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </motion.div>

      {/* Animated Background Elements */}
      <StitchPattern />

      {/* Floating Yarn Balls */}
      <YarnBall
        className="absolute top-20 left-10 w-24 h-24 text-pink-300 dark:text-pink-500/30"
        delay={0.2}
      />
      <YarnBall
        className="absolute bottom-32 right-16 w-32 h-32 text-rose-200 dark:text-rose-500/20"
        delay={0.4}
      />
      <YarnBall
        className="absolute top-40 right-20 w-16 h-16 text-fuchsia-200 dark:text-fuchsia-500/25"
        delay={0.6}
      />
      <YarnBall
        className="absolute bottom-20 left-20 w-20 h-20 text-pink-200 dark:text-pink-500/20"
        delay={0.8}
      />

      {/* Floating Yarn Strands */}
      <div className="absolute top-1/4 left-0">
        <FloatingYarn delay={0} duration={25} />
      </div>
      <div className="absolute bottom-1/4 right-0">
        <FloatingYarn delay={5} duration={30} />
      </div>

      {/* Crochet Hook */}
      <CrochetHook className="absolute top-10 right-1/4 w-6 h-24 text-pink-400 dark:text-pink-500/40 opacity-30" />

      {/* Sparkle Effects */}
      {mounted && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${drand(i, 100) * 100}%`,
            left: `${drand(i, 101) * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-4 h-4 text-pink-400 dark:text-pink-300" />
        </motion.div>
      ))}

      {/* Main Card */}
      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div
            className="relative w-16 h-16 mx-auto mb-6"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Logo Glow */}
            <div className="absolute -inset-4 bg-linear-to-r from-pink-500/20 via-purple-500/20 to-violet-500/20 rounded-3xl blur-2xl opacity-100" />
            
            <div className="relative">
              {/* Spinning Border */}
              <motion.div 
                className="absolute -inset-1 bg-linear-to-r from-pink-500 via-purple-500 to-violet-500 rounded-2xl opacity-75 blur-sm"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              {/* Icon Container */}
              <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-[#C2185B] to-[#9C27B0] flex items-center justify-center shadow-xl shadow-purple-500/25 overflow-hidden">
                <Scissors className="w-8 h-8 text-white relative z-10" />
                <motion.div 
                  className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold bg-linear-to-r from-pink-600 via-rose-500 to-fuchsia-600 dark:from-pink-400 dark:via-rose-400 dark:to-fuchsia-400 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Welcome Back
          </motion.h1>
          <motion.p
            className="text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-2"
            variants={itemVariants}
          >
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
            Continue your crafting journey
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
          </motion.p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl shadow-pink-200/50 dark:shadow-pink-900/20 p-8 border border-white/50 dark:border-gray-700/50"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.25)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Google Login Button */}
          <motion.button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl py-4 hover:border-pink-200 dark:hover:border-pink-500/50 hover:bg-pink-50/50 dark:hover:bg-pink-900/20 transition-all duration-300 group shadow-sm"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
              Continue with Google
            </span>
          </motion.button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-pink-100 dark:border-pink-900/50"></div>
            </div>
            <div className="relative flex justify-center">
              <motion.span
                className="px-4 bg-white/80 dark:bg-gray-900/80 text-sm text-gray-400 dark:text-gray-500 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-2 h-2 rounded-full bg-pink-300 dark:bg-pink-600"></span>
                or sign in with email
                <span className="w-2 h-2 rounded-full bg-pink-300 dark:bg-pink-600"></span>
              </motion.span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Email Address
              </label>
              <motion.div
                className={`relative rounded-2xl transition-all duration-300 ${
                  focusedField === "email"
                    ? "ring-2 ring-pink-400 dark:ring-pink-500 ring-offset-2 dark:ring-offset-gray-900"
                    : ""
                }`}
                animate={focusedField === "email" ? { scale: 1.02 } : { scale: 1 }}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <motion.div
                    animate={
                      focusedField === "email"
                        ? { rotate: [0, -10, 10, 0], scale: 1.1 }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    <Mail
                      className={`w-5 h-5 transition-colors duration-300 ${
                        focusedField === "email" ? "text-pink-500" : "text-gray-400 dark:text-gray-500"
                      }`}
                    />
                  </motion.div>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="hello@craftlover.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-pink-300 dark:focus:border-pink-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
                />
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Password
              </label>
              <motion.div
                className={`relative rounded-2xl transition-all duration-300 ${
                  focusedField === "password"
                    ? "ring-2 ring-pink-400 dark:ring-pink-500 ring-offset-2 dark:ring-offset-gray-900"
                    : ""
                }`}
                animate={focusedField === "password" ? { scale: 1.02 } : { scale: 1 }}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <motion.div
                    animate={
                      focusedField === "password"
                        ? { rotate: [0, -10, 10, 0], scale: 1.1 }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    <Lock
                      className={`w-5 h-5 transition-colors duration-300 ${
                        focusedField === "password" ? "text-pink-500" : "text-gray-400 dark:text-gray-500"
                      }`}
                    />
                  </motion.div>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-pink-300 dark:focus:border-pink-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showPassword ? "visible" : "hidden"}
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Forgot Password Link */}
            <motion.div className="flex justify-end" variants={itemVariants}>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 font-medium hover:underline transition-colors"
              >
                Forgot your password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="relative w-full py-4 rounded-2xl font-semibold text-white overflow-hidden group disabled:cursor-not-allowed"
              variants={itemVariants}
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-pink-500 via-rose-500 to-fuchsia-500"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% 200%" }}
              />

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <motion.div
            className="mt-8 pt-6 border-t border-pink-100 dark:border-pink-900/30"
            variants={itemVariants}
          >
            <p className="text-center text-gray-500 dark:text-gray-400">
              New to Strokes of Craft?{" "}
              <Link href="/auth/register" className="relative group">
                <span className="font-semibold bg-linear-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
                  Create an account
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-linear-to-r from-pink-500 to-fuchsia-500 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span>Made with</span>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
          </motion.div>
          <span>for crafters everywhere</span>
        </motion.div>
      </motion.div>
    </div>
  );
}