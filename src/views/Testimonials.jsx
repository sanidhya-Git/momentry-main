"use client";

import React from "react";
import Link from "next/link";

export default function Testimonials() {
  const featured = {
    quote:
      "MOMENTRY didn't show us the destination — they let it reveal itself to us. The intimate local experiences are memories we'll carry forever.",
    name: "Aanya & Rohan Kapoor",
    trip: "Traveled to Kyoto, Oct 2025",
  };

  const reviews = [
    {
      quote:
        "The desert astronomy night was unreal. Our guide knew every constellation's story.",
      name: "Dev Malhotra",
      trip: "Sahara Starlight Trail",
    },
    {
      quote:
        "Booked solo, came back with a family. The private group chat before the trip made all the difference.",
      name: "Sara Iyer",
      trip: "Bali Hidden Temples",
    },
    {
      quote:
        "The live Travel Hub tracking is genius — vouchers, weather, guide reveal. Best post-booking experience of any brand.",
      name: "Kabir Shah",
      trip: "Spiti Valley Circuit",
    },
  ];

  const instaTags = ["@dev.wanders", "@sara.travels", "#MOMENTRYMOMENTS"];

  return (
    <div className="min-h-screen bg-alabaster">
      {/* Header */}
      <section className="pt-24 pb-16 px-6 text-center">
        <p className="text-champagne text-xs font-bold tracking-[0.3em] mb-4">
          WALL OF WANDERLUST
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-espresso leading-tight">
          Real explorers. Real stories.
        </h1>
      </section>

      {/* Featured Quote */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto bg-white border border-champagne/40 rounded-sm p-10 md:p-16 text-center shadow-sm relative">
          <span className="absolute top-6 left-8 font-serif text-7xl text-champagne/30 leading-none">
            "
          </span>
          <p className="text-champagne text-xl tracking-widest mb-6">★★★★★</p>
          <p className="font-serif text-2xl md:text-3xl text-espresso italic leading-relaxed mb-8">
            {featured.quote}
          </p>
          <p className="font-semibold text-espresso">
            {featured.name}{" "}
            <span className="text-olive text-sm font-bold">
              ✔ Verified Explorer
            </span>
          </p>
          <p className="text-sm text-espresso/50 font-light mt-1">
            {featured.trip}
          </p>
        </div>
      </section>

      {/* Review Cards */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white border border-espresso/10 rounded-sm p-8 hover:border-champagne hover:shadow-lg transition"
            >
              <p className="text-champagne tracking-widest mb-4">★★★★★</p>
              <p className="text-espresso/80 font-light leading-relaxed mb-6">
                "{review.quote}"
              </p>
              <p className="font-semibold text-espresso text-sm">
                {review.name}{" "}
                <span className="text-olive text-xs font-bold">✔</span>
              </p>
              <p className="text-xs text-espresso/50 font-light mt-1">
                {review.trip}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Strip */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-espresso/50 text-xs font-semibold tracking-[0.2em] text-center mb-8">
            LIVE INSTAGRAM GRID · #MOMENTRYMOMENTS
          </p>
          <div className="grid grid-cols-3 gap-4">
            {instaTags.map((tag, i) => (
              <div
                key={i}
                className={`h-40 md:h-56 rounded-sm flex items-end p-4 ${
                  i === 0
                    ? "bg-gradient-to-br from-espresso to-olive"
                    : i === 1
                      ? "bg-gradient-to-br from-[#E2C766] to-[#C9A535]"
                      : "bg-gradient-to-br from-olive to-espresso"
                }`}
              >
                <p className="text-white text-xs font-semibold tracking-widest">
                  📷 {tag.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-espresso text-center">
        <h2 className="font-serif text-4xl text-white mb-8">
          Write your own story
        </h2>
        <Link
          href="/packages"
          className="inline-block px-12 py-4 bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white font-semibold rounded-sm hover:opacity-90 hover:shadow-lg transition tracking-wide"
        >
          Explore Trips →
        </Link>
      </section>
    </div>
  );
}
