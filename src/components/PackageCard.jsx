"use client";

import React from "react";
import Link from "next/link";
import { FiStar, FiMapPin, FiCalendar } from "react-icons/fi";

export default function PackageCard({ pkg }) {
  const rating = pkg.rating || 4.8;

  // Stable badge: based on the package ID, so it never flickers.
  // Later you can replace this with a real field like pkg.badge from your database.
  const badgeOptions = ["BEST SELLER", "EARLY BIRD"];
  const badgeIndex = pkg._id
    ? pkg._id.charCodeAt(pkg._id.length - 1) % badgeOptions.length
    : 0;
  const badge = badgeOptions[badgeIndex];
  const isOlive = badge === "EARLY BIRD";

  return (
    <Link href={`/packages/${pkg._id}`}>
      <div className="group cursor-pointer">
        {/* Card Container */}
        <div className="bg-white rounded-sm overflow-hidden border border-espresso/10 hover:border-champagne transition-all duration-300 hover:shadow-xl">
          {/* Image Container */}
          <div className="relative h-80 overflow-hidden">
            <img
              src={
                pkg.image ||
                "https://via.placeholder.com/400x400?text=" + pkg.destination
              }
              alt={pkg.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/20 to-transparent"></div>

            {/* Badge */}
            <div
              className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold tracking-widest rounded-sm ${
                isOlive ? "bg-olive text-white" : "bg-champagne text-espresso"
              }`}
            >
              {badge}
            </div>

            {/* Price & Rating (Bottom Left) */}
            <div className="absolute bottom-4 left-4 right-4 text-white flex justify-between items-end">
              <div>
                <p className="text-xs font-light opacity-80 mb-1">FROM</p>
                <p className="font-serif text-3xl font-bold">
                  ₹{Math.floor(pkg.price / 1000)}K
                </p>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-sm">
                <FiStar className="w-4 h-4 fill-champagne text-champagne" />
                <span className="text-sm font-semibold">{rating}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <h3 className="font-serif text-xl text-espresso mb-3 line-clamp-2 group-hover:text-champagne transition-colors">
              {pkg.title}
            </h3>

            {/* Destination & Duration */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-espresso/60 text-sm">
                <FiMapPin className="w-4 h-4" />
                <span>{pkg.destination}</span>
              </div>
              <div className="flex items-center gap-2 text-espresso/60 text-sm">
                <FiCalendar className="w-4 h-4" />
                <span>{pkg.duration} days</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-espresso/70 text-sm line-clamp-2 mb-6 font-light leading-relaxed">
              {pkg.description ||
                "Curated boutique experience with local storytellers"}
            </p>

            {/* CTA Button */}
            <button className="w-full bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white font-semibold py-3 rounded-sm hover:opacity-90 hover:shadow-lg transition-all duration-300 text-sm tracking-wide">
              VIEW JOURNEY →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
