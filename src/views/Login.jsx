"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useStore";
import { GoogleLogin } from "@react-oauth/google";
import { FiMail, FiLock } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    const result = await googleLogin(credentialResponse);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Image with Overlay */}
      <div className="hidden md:flex relative items-center justify-center bg-gradient-to-br from-espresso via-olive to-espresso overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1000"
            alt="Mountain landscape"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-espresso/40 to-transparent"></div>
        </div>

        <div className="relative z-10 text-white text-center px-8">
          <h2 className="font-serif text-5xl mb-6 leading-tight">
            We travel not to escape life,
            <br />
            <span className="italic">but for life not to escape us.</span>
          </h2>
          <p className="text-lg opacity-80 font-light">Spiti Valley</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center bg-alabaster py-12 px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <h1 className="font-serif text-4xl text-espresso mb-2 text-center">
            MOMENTRY<span className="text-champagne">.</span>
          </h1>
          <p className="text-center text-espresso/60 text-sm mb-8 font-light tracking-widest">
            WELCOME BACK
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Email Input */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
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
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-espresso mb-3 tracking-wide">
                PASSWORD
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-champagne hover:text-champagne/80 font-semibold transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white font-semibold py-4 rounded-sm hover:opacity-90 hover:shadow-lg transition disabled:opacity-50 text-lg tracking-wide"
            >
              {loading ? "Logging in..." : "SIGN IN"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-espresso/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-alabaster text-espresso/50 font-semibold">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center mb-8">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
            />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-espresso/70 text-sm">
            New to MOMENTRY?{" "}
            <Link
              href="/signup"
              className="text-champagne font-semibold hover:text-champagne/80 transition"
            >
              Create an account
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-espresso/10">
            <p className="text-center text-xs text-espresso/50 font-light">
              Secured by MOMENTRY Premium Encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
