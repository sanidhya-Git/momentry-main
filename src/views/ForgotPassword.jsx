"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      setSuccess(response.data.message);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-espresso via-olive to-espresso flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md bg-alabaster rounded-sm border border-espresso/10 p-8 shadow-lg">
        {/* Header */}
        <Link
          href="/login"
          className="inline-flex items-center text-champagne hover:text-champagne/80 mb-6 font-semibold transition"
        >
          <FiArrowLeft className="mr-2" />
          Back to Login
        </Link>

        <h2 className="text-3xl font-serif font-bold text-center text-espresso mb-2">
          Forgot Password?
        </h2>
        <p className="text-center text-espresso/70 text-sm mb-8 font-light">
          Enter your email and we'll send you a link to reset your password
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-sm mb-6 text-sm">
            {success}
            <p className="text-xs mt-2 opacity-80">Redirecting to login...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-espresso mb-3 tracking-wide">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-4 text-espresso/40 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-12 pr-4 py-3 border border-espresso/20 rounded-sm focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne bg-white text-espresso"
              />
            </div>
            <p className="text-xs text-espresso/50 mt-3 font-light">
              Check your email for password reset instructions
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white font-semibold py-4 rounded-sm hover:opacity-90 hover:shadow-lg transition disabled:opacity-50 text-lg tracking-wide"
          >
            {loading ? "Sending..." : "SEND RESET LINK"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-espresso/10">
          <p className="text-center text-espresso/70 text-sm">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-champagne font-semibold hover:text-champagne/80 transition"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
