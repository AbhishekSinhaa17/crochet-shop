"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Heart, Check, X, ChevronLeft, Scissors } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

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
        stroke="url(#yarnGradientReg)"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 2, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="yarnGradientReg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
);

// Stitch pattern background
const StitchPattern = () => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
    <svg width="100%" height="100%" className="text-fuchsia-900 dark:text-fuchsia-300">
      <defs>
        <pattern id="stitchesReg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20 L10 10 L20 20 L10 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M20 20 L30 10 L40 20 L30 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stitchesReg)" />
    </svg>
  </div>
);

// Knitting needles decoration
const KnittingNeedles = ({ className }: { className?: string }) => (
  <motion.svg
    viewBox="0 0 60 100"
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 0.3, y: 0 }}
    transition={{ delay: 0.5, duration: 0.8 }}
  >
    <line x1="15" y1="5" x2="15" y2="95" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="15" cy="5" r="4" fill="currentColor" />
    <line x1="45" y1="10" x2="45" y2="100" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="45" cy="10" r="4" fill="currentColor" />
  </motion.svg>
);

// Password strength checker
const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    { label: "At least 6 characters", valid: password.length >= 6 },
    { label: "Contains a number", valid: /\d/.test(password) },
    { label: "Contains uppercase", valid: /[A-Z]/.test(password) },
  ];

  const strength = checks.filter((c) => c.valid).length;
  const strengthColors = ["bg-gray-200 dark:bg-gray-700", "bg-red-400", "bg-yellow-400", "bg-green-400"];
  const strengthLabels = ["", "Weak", "Good", "Strong"];

  if (password.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 space-y-2"
    >
      {/* Strength Bar */}
      <div className="flex gap-1">
        {[1, 2, 3].map((level) => (
          <motion.div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              strength >= level ? strengthColors[strength] : "bg-gray-200 dark:bg-gray-700"
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: level * 0.1 }}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span
          className={`text-xs font-medium ${
            strength === 1
              ? "text-red-500"
              : strength === 2
              ? "text-yellow-600 dark:text-yellow-400"
              : strength === 3
              ? "text-green-500"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {strengthLabels[strength]}
        </span>
      </div>

      {/* Check List */}
      <div className="space-y-1">
        {checks.map((check, index) => (
          <motion.div
            key={check.label}
            className="flex items-center gap-2 text-xs"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: index * 0.1 }}
            >
              {check.valid ? (
                <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-green-500" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <X className="w-2.5 h-2.5 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </motion.div>
            <span className={check.valid ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"}>
              {check.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleLogin = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
      } else {
        toast.success("Account created! Please check your email to verify. 🧶");
        router.push("/auth/login");
      }
    } catch (err: any) {
      console.error("Registration Error:", err);
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-linear-to-br from-fuchsia-50 via-pink-50 to-rose-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900">
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
      <YarnBall className="absolute top-16 left-8 w-20 h-20 text-fuchsia-300 dark:text-fuchsia-500/30" delay={0.2} />
      <YarnBall className="absolute bottom-24 right-12 w-28 h-28 text-pink-200 dark:text-pink-500/20" delay={0.4} />
      <YarnBall className="absolute top-32 right-16 w-14 h-14 text-rose-200 dark:text-rose-500/25" delay={0.6} />
      <YarnBall className="absolute bottom-16 left-16 w-18 h-18 text-purple-200 dark:text-purple-500/20" delay={0.8} />
      <YarnBall className="absolute top-1/2 left-4 w-12 h-12 text-pink-300 dark:text-pink-500/25" delay={1} />

      {/* Floating Yarn Strands */}
      <div className="absolute top-1/3 left-0">
        <FloatingYarn delay={0} duration={25} />
      </div>
      <div className="absolute bottom-1/3 right-0">
        <FloatingYarn delay={5} duration={30} />
      </div>

      {/* Decorative Elements */}
      <CrochetHook className="absolute top-16 right-1/4 w-6 h-24 text-fuchsia-400 dark:text-fuchsia-500/40 opacity-30" />
      <KnittingNeedles className="absolute bottom-20 left-1/4 w-12 h-20 text-pink-400 dark:text-pink-500/40" />

      {/* Sparkle Effects */}
      {mounted && [...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-4 h-4 text-fuchsia-400 dark:text-fuchsia-300" />
        </motion.div>
      ))}

      {/* Main Card */}
      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-6" variants={itemVariants}>
          <motion.div
            className="relative w-16 h-16 mx-auto mb-4"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Logo Glow */}
            <div className="absolute -inset-4 bg-linear-to-r from-fuchsia-500/20 via-pink-500/20 to-rose-500/20 rounded-3xl blur-2xl opacity-100" />
            
            <div className="relative">
              {/* Spinning Border */}
              <motion.div 
                className="absolute -inset-1 bg-linear-to-r from-fuchsia-500 via-pink-500 to-rose-500 rounded-2xl opacity-75 blur-sm"
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />

              {/* Icon Container */}
              <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-[#C2185B] to-[#9C27B0] flex items-center justify-center shadow-xl shadow-fuchsia-500/25 overflow-hidden">
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
            className="text-4xl font-bold bg-linear-to-r from-fuchsia-600 via-pink-500 to-rose-500 dark:from-fuchsia-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Join Our Craft
          </motion.h1>
          <motion.p
            className="text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-2"
            variants={itemVariants}
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
            Start your creative journey today
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl shadow-fuchsia-200/50 dark:shadow-fuchsia-900/20 p-8 border border-white/50 dark:border-gray-700/50"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(192, 38, 211, 0.25)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Google Sign Up Button */}
          <motion.button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl py-4 hover:border-fuchsia-200 dark:hover:border-fuchsia-500/50 hover:bg-fuchsia-50/50 dark:hover:bg-fuchsia-900/20 transition-all duration-300 group shadow-sm"
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
              Sign up with Google
            </span>
          </motion.button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-fuchsia-100 dark:border-fuchsia-900/50"></div>
            </div>
            <div className="relative flex justify-center">
              <motion.span
                className="px-4 bg-white/80 dark:bg-gray-900/80 text-sm text-gray-400 dark:text-gray-500 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-2 h-2 rounded-full bg-fuchsia-300 dark:bg-fuchsia-600"></span>
                or register with email
                <span className="w-2 h-2 rounded-full bg-fuchsia-300 dark:bg-fuchsia-600"></span>
              </motion.span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Full Name
              </label>
              <motion.div
                className={`relative rounded-2xl transition-all duration-300 ${
                  focusedField === "name"
                    ? "ring-2 ring-fuchsia-400 dark:ring-fuchsia-500 ring-offset-2 dark:ring-offset-gray-900"
                    : ""
                }`}
                animate={focusedField === "name" ? { scale: 1.02 } : { scale: 1 }}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <motion.div
                    animate={
                      focusedField === "name"
                        ? { rotate: [0, -10, 10, 0], scale: 1.1 }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    <User
                      className={`w-5 h-5 transition-colors duration-300 ${
                        focusedField === "name" ? "text-fuchsia-500" : "text-gray-400 dark:text-gray-500"
                      }`}
                    />
                  </motion.div>
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Your creative name"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-fuchsia-300 dark:focus:border-fuchsia-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
                />
              </motion.div>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Email Address
              </label>
              <motion.div
                className={`relative rounded-2xl transition-all duration-300 ${
                  focusedField === "email"
                    ? "ring-2 ring-fuchsia-400 dark:ring-fuchsia-500 ring-offset-2 dark:ring-offset-gray-900"
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
                        focusedField === "email" ? "text-fuchsia-500" : "text-gray-400 dark:text-gray-500"
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
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-fuchsia-300 dark:focus:border-fuchsia-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
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
                    ? "ring-2 ring-fuchsia-400 dark:ring-fuchsia-500 ring-offset-2 dark:ring-offset-gray-900"
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
                        focusedField === "password" ? "text-fuchsia-500" : "text-gray-400 dark:text-gray-500"
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
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-fuchsia-300 dark:focus:border-fuchsia-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-white"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30 transition-colors"
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

              {/* Password Strength Indicator */}
              <AnimatePresence>{password.length > 0 && <PasswordStrength password={password} />}</AnimatePresence>
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div variants={itemVariants} className="flex items-start gap-3 pt-2">
              <motion.button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 mt-0.5 ${
                  agreedToTerms
                    ? "bg-linear-to-r from-fuchsia-500 to-pink-500 border-transparent"
                    : "border-gray-300 dark:border-gray-600 hover:border-fuchsia-400 dark:hover:border-fuchsia-500"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence>
                  {agreedToTerms && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                I agree to the{" "}
                <Link href="/terms" className="text-fuchsia-500 dark:text-fuchsia-400 hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-fuchsia-500 dark:text-fuchsia-400 hover:underline font-medium">
                  Privacy Policy
                </Link>
              </span>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="relative w-full py-4 rounded-2xl font-semibold text-white overflow-hidden group disabled:cursor-not-allowed disabled:opacity-60 mt-6"
              variants={itemVariants}
              whileHover={{ scale: loading || !agreedToTerms ? 1 : 1.02, y: loading || !agreedToTerms ? 0 : -2 }}
              whileTap={{ scale: loading || !agreedToTerms ? 1 : 0.98 }}
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-fuchsia-500 via-pink-500 to-rose-500"
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
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
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

              {/* Confetti effect on hover */}
              <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ["#fff", "#fce7f3", "#f5d0fe", "#e9d5ff", "#ddd6fe", "#c4b5fd"][i],
                      left: `${15 + i * 15}%`,
                      top: "50%",
                    }}
                    animate={{
                      y: [-10, 10, -10],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>

              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                      🧶
                    </motion.div>
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Sign In Link */}
          <motion.div className="mt-6 pt-6 border-t border-fuchsia-100 dark:border-fuchsia-900/30" variants={itemVariants}>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Already part of the craft?{" "}
              <Link href="/auth/login" className="relative group">
                <span className="font-semibold bg-linear-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                  Sign In
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-linear-to-r from-fuchsia-500 to-pink-500 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          className="mt-8 grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { icon: "🎨", label: "Free Patterns" },
            { icon: "💬", label: "Community" },
            { icon: "📚", label: "Tutorials" },
          ].map((benefit, index) => (
            <motion.div
              key={benefit.label}
              className="text-center p-3 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/50 dark:border-gray-700/50"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <motion.div
                className="text-2xl mb-1"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {benefit.icon}
              </motion.div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{benefit.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Text */}
        <motion.div
          className="text-center text-sm text-gray-400 dark:text-gray-500 mt-6 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span>Crafted with</span>
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
            <Heart className="w-4 h-4 text-fuchsia-400 fill-fuchsia-400" />
          </motion.div>
          <span>by creators, for creators</span>
        </motion.div>
      </motion.div>
    </div>
  );
}