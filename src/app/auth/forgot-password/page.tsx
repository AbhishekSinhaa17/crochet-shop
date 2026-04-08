"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) throw error;
      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">
          Forgot Password?
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Enter your email to receive a reset link
        </p>

        {sent ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">
              ✅ Reset link sent! Check your email.
            </p>
            <Link
              href="/auth/login"
              className="text-purple-600 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="hello@craftlover.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-xl mb-4 
                         focus:outline-none focus:ring-2 
                         focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-pink-500 text-white 
                         rounded-xl font-medium hover:bg-pink-600 
                         disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center mt-4">
              <Link
                href="/auth/login"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}