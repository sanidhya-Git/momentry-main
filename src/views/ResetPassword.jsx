"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLock, FiCheck } from "react-icons/fi";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-espresso via-olive to-espresso flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md bg-alabaster rounded-sm border border-espresso/10 p-8 shadow-lg text-center">
          <h2 className="text-2xl font-serif font-bold text-red-600 mb-4">Invalid Link</h2>
          <p className="text-espresso/70 mb-6 font-light">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition shadow-sm"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token,
        password,
      });
      setSuccess(response.data.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-espresso via-olive to-espresso flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md bg-alabaster rounded-sm border border-espresso/10 p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-block bg-champagne/10 p-4 rounded-full mb-4">
            <FiLock className="w-8 h-8 text-champagne" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-espresso mb-2">Reset Password</h2>
          <p className="text-espresso/60 text-sm font-light">Enter your new credentials below</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-sm mb-6 text-sm flex items-center">
            <FiCheck className="mr-2 w-5 h-5 text-green-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-espresso mb-3 tracking-wide">
              NEW PASSWORD
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-4 text-espresso/40 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-3 border border-espresso/20 rounded-sm focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne bg-white text-espresso"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-espresso mb-3 tracking-wide">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-4 text-espresso/40 w-5 h-5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-12 pr-4 py-3 border border-espresso/20 rounded-sm focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne bg-white text-espresso"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white font-semibold py-4 rounded-sm hover:opacity-90 hover:shadow-lg transition disabled:opacity-50 text-lg tracking-wide"
          >
            {loading ? "Resetting..." : "RESET PASSWORD"}
          </button>
        </form>

        <p className="text-center text-espresso/70 text-sm mt-8 pt-6 border-t border-espresso/10">
          Remember your password?{" "}
          <Link href="/login" className="text-champagne font-semibold hover:text-champagne/80 transition">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
