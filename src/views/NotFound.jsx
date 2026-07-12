"use client";

import React from "react";
import Link from "next/link";
import { FiCompass } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-alabaster flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center max-w-md mx-auto space-y-6">
        {/* Animated Compass Icon */}
        <div className="flex justify-center">
          <div className="relative p-6 bg-cream border border-espresso/10 rounded-full animate-pulse">
            <FiCompass size={48} className="text-champagne rotate-45 transform transition-transform duration-1000 hover:rotate-180" />
          </div>
        </div>

        {/* 404 Header */}
        <p className="text-[12px] font-bold text-champagne tracking-[0.3em] uppercase">
          Lost in Translation
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-espresso tracking-tight">
          404
        </h1>
        <h2 className="font-serif text-2xl font-semibold text-espresso/80">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="text-espresso/60 text-sm font-light leading-relaxed">
          The curation you are seeking does not exist or has been moved to a new destination. Let us guide you back to the beginning of your journey.
        </p>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white font-semibold px-8 py-3 rounded-sm hover:opacity-90 hover:shadow-lg transition tracking-wide text-sm"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
