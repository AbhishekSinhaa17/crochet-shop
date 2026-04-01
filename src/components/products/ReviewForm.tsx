"use client";

import { useState } from "react";
import { Star, Send, Sparkles, PenLine, MessageSquare, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to leave a review");
      setLoading(false);
      return;
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role?.toLowerCase()?.trim() === "admin") {
      toast.error("Administrators are not allowed to leave reviews.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("reviews").upsert({
      user_id: user.id,
      product_id: productId,
      rating,
      title,
      comment,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSubmitted(true);
      setTimeout(() => {
        toast.success("Review submitted!");
        setRating(0);
        setTitle("");
        setComment("");
        setSubmitted(false);
        onSuccess();
      }, 2000);
    }
    setLoading(false);
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const ratingEmojis = ["", "😕", "😐", "🙂", "😊", "🤩"];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl"
        />
      </div>

      {/* Main Card */}
      <motion.div
        className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 border border-white/50 overflow-hidden"
        whileHover={{ boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.25)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Success Overlay */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="relative inline-flex"
                >
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-green-400 rounded-full"
                  />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 text-xl font-semibold text-gray-800"
                >
                  Thank You!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-500"
                >
                  Your review has been submitted
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="relative p-8 md:p-10">
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </motion.div>
            <div>
              <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent">
                Write a Review
              </h3>
              <p className="text-gray-500 text-sm">Share your experience with others</p>
            </div>
          </motion.div>

          {/* Rating Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
              <span className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">
                1
              </span>
              Your Rating
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative p-1"
                  >
                    {/* Glow Effect */}
                    <motion.div
                      animate={{
                        opacity: star <= (hoverRating || rating) ? 0.6 : 0,
                        scale: star <= (hoverRating || rating) ? 1.5 : 1,
                      }}
                      className="absolute inset-0 bg-yellow-400 rounded-full blur-md"
                    />

                    {/* Star */}
                    <motion.div
                      animate={{
                        scale: star <= (hoverRating || rating) ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Star
                        className={`relative w-10 h-10 transition-colors duration-200 ${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.div>

                    {/* Sparkle */}
                    <AnimatePresence>
                      {star <= rating && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-1 -right-1"
                        >
                          <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              {/* Rating Label */}
              <AnimatePresence mode="wait">
                {(hoverRating || rating) > 0 && (
                  <motion.div
                    key={hoverRating || rating}
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full"
                  >
                    <motion.span
                      key={hoverRating || rating}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-2xl"
                    >
                      {ratingEmojis[hoverRating || rating]}
                    </motion.span>
                    <span className="font-semibold text-yellow-700">
                      {ratingLabels[hoverRating || rating]}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Title Field */}
          <motion.div variants={itemVariants} className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">
                2
              </span>
              Review Title
            </label>

            <motion.div
              animate={{ scale: focusedField === "title" ? 1.02 : 1 }}
              className="relative group"
            >
              <motion.div
                animate={{
                  opacity: focusedField === "title" ? 0.5 : 0,
                }}
                className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl blur"
              />

              <div className="relative flex items-center">
                <PenLine
                  className={`absolute left-4 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "title" ? "text-purple-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Summarize your experience"
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Comment Field */}
          <motion.div variants={itemVariants} className="mb-8">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-bold">
                3
              </span>
              Your Review
            </label>

            <motion.div
              animate={{ scale: focusedField === "comment" ? 1.01 : 1 }}
              className="relative group"
            >
              <motion.div
                animate={{
                  opacity: focusedField === "comment" ? 0.5 : 0,
                }}
                className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl blur"
              />

              <div className="relative">
                <MessageSquare
                  className={`absolute left-4 top-4 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "comment" ? "text-purple-500" : "text-gray-400"
                  }`}
                />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onFocus={() => setFocusedField("comment")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Tell us more about your experience..."
                  rows={4}
                  maxLength={500}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 resize-none transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10"
                />

                {/* Character Count */}
                <motion.div
                  animate={{
                    color: comment.length > 450 ? "#ef4444" : "#9ca3af",
                  }}
                  className="absolute bottom-3 right-3 text-xs"
                >
                  {comment.length}/500
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={loading || rating === 0}
            whileHover={{ scale: rating === 0 ? 1 : 1.02 }}
            whileTap={{ scale: rating === 0 ? 1 : 0.98 }}
            className="group relative w-full overflow-hidden rounded-xl py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Animated Gradient Background */}
            <motion.div
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-[length:200%_100%]"
            />

            {/* Shimmer */}
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />

            {/* Content */}
            <span className="relative flex items-center justify-center gap-3 text-white font-semibold text-lg">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </motion.div>
                    <span>Submitting...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      whileHover={{ x: 5, y: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.div>
                    <span>Submit Review</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </span>
          </motion.button>

          {/* Helper Text */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-center text-sm text-gray-500"
          >
            Your review will help others make better decisions ✨
          </motion.p>
        </form>
      </motion.div>
    </motion.div>
  );
}