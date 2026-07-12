"use client";

import React, { useState, useEffect } from "react";
import { usePackageStore } from "../store/useStore";
import PackageCard from "../components/PackageCard";
import { FiSearch, FiFilter } from "react-icons/fi";

export default function Packages() {
  const { packages, filteredPackages, filterPackages } = usePackageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [destination, setDestination] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const destinations = [...new Set(packages?.map((p) => p.destination) || [])];
  const durations = [...new Set(packages?.map((p) => p.duration) || [])];

  const handleFilter = () => {
    filterPackages({
      search: searchTerm,
      minPrice: minPrice ? parseInt(minPrice) : null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null,
      duration: duration ? parseInt(duration) : null,
      destination: destination || null,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setDuration("");
    setDestination("");
    filterPackages({});
  };

  useEffect(() => {
    handleFilter();
  }, [searchTerm, minPrice, maxPrice, duration, destination]);

  return (
    <div className="min-h-screen bg-alabaster">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-espresso to-olive text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1920"
            alt="Mountain"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="font-serif text-5xl md:text-6xl mb-4 leading-tight">
            Where will the world take you?
          </h1>
          <p className="text-lg opacity-90 font-light mb-8">
            Explore our curated collection of boutique journeys
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            {/* Main Search */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-4 text-espresso/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by destination, package name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-espresso/20 rounded-sm focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne bg-alabaster text-espresso text-lg"
              />
            </div>

            {/* Filters Toggle */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-champagne font-semibold hover:text-champagne/80 transition text-sm tracking-wide"
              >
                <FiFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-alabaster p-6 rounded-sm border border-espresso/10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Destination */}
                  <div>
                    <label className="block text-sm font-semibold text-espresso mb-3 tracking-wide">
                      WHERE TO?
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-4 py-2 border border-espresso/20 rounded-sm focus:outline-none focus:border-champagne bg-white text-espresso"
                    >
                      <option value="">All Destinations</option>
                      {destinations.map((dest) => (
                        <option key={dest} value={dest}>
                          {dest}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-espresso mb-3 tracking-wide">
                      DURATION
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-2 border border-espresso/20 rounded-sm focus:outline-none focus:border-champagne bg-white text-espresso"
                    >
                      <option value="">All Durations</option>
                      {durations.map((dur) => (
                        <option key={dur} value={dur}>
                          {dur} days
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Min Price */}
                  <div>
                    <label className="block text-sm font-semibold text-espresso mb-3 tracking-wide">
                      MIN PRICE (₹)
                    </label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-espresso/20 rounded-sm focus:outline-none focus:border-champagne bg-white text-espresso"
                    />
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-semibold text-espresso mb-3 tracking-wide">
                      MAX PRICE (₹)
                    </label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="500000"
                      className="w-full px-4 py-2 border border-espresso/20 rounded-sm focus:outline-none focus:border-champagne bg-white text-espresso"
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handleReset}
                    className="px-8 py-2 bg-espresso text-white font-semibold rounded-sm hover:bg-espresso/80 transition text-sm"
                  >
                    RESET ALL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="py-6 px-6 bg-white border-b border-espresso/10">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-espresso/60 font-semibold tracking-[0.2em]">
            SHOWING {filteredPackages?.length || 0} OF {packages?.length || 0}{" "}
            CURATIONS
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {filteredPackages && filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-sm border border-espresso/10">
              <p className="text-2xl text-espresso font-serif mb-4">
                No journeys found
              </p>
              <p className="text-espresso/60 mb-8">
                Try adjusting your filters to discover more boutique experiences
              </p>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white font-semibold rounded-sm hover:opacity-90 hover:shadow-lg transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
