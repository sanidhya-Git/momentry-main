"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, usePackageStore } from "../store/useStore";
import { FiSearch, FiMapPin, FiClock, FiArrowRight, FiStar, FiUsers, FiHeart } from "react-icons/fi";
import { apiClient } from "../utils/api";

const DEFAULT_TESTIMONIALS = [
  { name: "Priya Sharma", location: "Mumbai", quote: "Momentry planned the perfect Himalayan trek. Every detail was taken care of — I just had to show up and enjoy!", rating: 5 },
  { name: "Arjun Mehta", location: "Bangalore", quote: "The Spiti Valley trip was life-changing. The local guides know places no tourist app will ever tell you about.", rating: 5 },
  { name: "Sneha Patel", location: "Ahmedabad", quote: "Booked the Udaipur heritage experience as a surprise for my parents. They still talk about it months later.", rating: 5 },
];

const formatINR = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function Home() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { packages, fetchPackages } = usePackageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    fetchPackages();
    apiClient.get("/content/featuredPackages").then(r => {
      const ids = r.data?.data || [];
      if (ids.length > 0 && packages.length > 0) {
        setFeaturedPackages(packages.filter(p => ids.includes(p._id)).slice(0, 6));
      }
    }).catch(() => {});
    apiClient.get("/content/testimonials").then(r => {
      const t = r.data?.data || [];
      if (t.length > 0) setTestimonials(t);
      else setTestimonials(DEFAULT_TESTIMONIALS);
    }).catch(() => setTestimonials(DEFAULT_TESTIMONIALS));
  }, []);

  useEffect(() => {
    if (packages.length > 0 && featuredPackages.length === 0) {
      setFeaturedPackages(packages.filter(p => p.isActive).slice(0, 4));
    }
  }, [packages]);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push("/packages" + (searchQuery ? "?search=" + encodeURIComponent(searchQuery) : ""));
  };

  return (
    <div className="min-h-screen bg-alabaster">
      {/* Splash/Welcome Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-alabaster via-cream to-alabaster">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-olive rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-champagne rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-olive rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-2xl px-6 py-12">
          {/* Logo */}
          <h1 className="font-serif text-6xl md:text-7xl font-bold text-espresso mb-6">
            MOMENTRY
            <span className="text-champagne text-5xl md:text-6xl">.</span>
          </h1>

          {/* Tagline */}
          <p className="font-serif text-2xl md:text-3xl text-espresso italic mb-8 leading-relaxed">
            Travel elegantly. Explore deeply.
          </p>

          {/* Decorative line */}
          <div className="w-12 h-0.5 bg-champagne mx-auto mb-8"></div>

          {/* Description */}
          <p className="text-lg text-espresso/70 mb-12 font-light tracking-wide">
            Handpicked boutique journeys,
            <br />
            curated by local storytellers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/packages"
              className="px-12 py-4 bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white font-semibold rounded-sm hover:opacity-90 hover:shadow-lg transition-all duration-300 text-lg tracking-wide"
            >
              Explore Trips →
            </Link>

            {user ? (
              <Link
                href="/bookings"
                className="px-12 py-4 border-2 border-espresso text-espresso font-semibold rounded-sm hover:bg-espresso hover:text-white transition-all duration-300 text-lg tracking-wide"
              >
                My Journeys
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-12 py-4 border-2 border-espresso text-espresso font-semibold rounded-sm hover:bg-espresso hover:text-white transition-all duration-300 text-lg tracking-wide"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-espresso/40 text-sm tracking-[0.3em] z-10">
          SCROLL TO DISCOVER ▾
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white py-6 shadow-md sticky-search">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Where do you want to go? Himachal, Goa, Rajasthan..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#C9A535] text-sm"
              />
            </div>
            <button type="submit" className="bg-gradient-to-r from-[#E2C766] to-[#C9A535] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition">
              <FiSearch /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-espresso py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[{ n: "10,000+", l: "Happy Travelers" }, { n: "50+", l: "Destinations" }, { n: "4.8★", l: "Avg Rating" }, { n: "100%", l: "Safe Journeys" }].map(s => (
              <div key={s.l}>
                <div className="text-2xl font-bold text-[#C9A535]">{s.n}</div>
                <div className="text-xs text-white/70 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-alabaster">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest text-[#C9A535] uppercase font-semibold mb-2">Curated For You</p>
            <h2 className="font-serif text-3xl md:text-4xl text-espresso">Handpicked Journeys</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPackages.map(pkg => (
              <a key={pkg._id} href={"/packages/" + pkg._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={pkg.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold text-espresso">
                    {pkg.duration}D
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                    <FiMapPin className="inline text-[#C9A535]" size={10} />
                    {pkg.destination}
                  </p>
                  <h3 className="font-semibold text-espresso text-sm mb-3 line-clamp-2">{pkg.title}</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-400">from</span>
                      <div className="font-bold text-espresso">{formatINR(pkg.price)}</div>
                    </div>
                    <span className="text-xs bg-[#C9A535]/10 text-[#C9A535] px-3 py-1 rounded-full font-semibold group-hover:bg-[#C9A535] group-hover:text-white transition">Book →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="/packages" className="border-2 border-espresso text-espresso px-8 py-3 rounded-xl font-semibold hover:bg-espresso hover:text-white transition inline-block">
              View All Packages
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p className="text-xs tracking-widest text-[#C9A535] uppercase font-semibold mb-2">Traveler Stories</p>
          <h2 className="font-serif text-3xl text-espresso mb-10">What Our Travelers Say</h2>
          {testimonials.length > 0 && (
            <div>
              <div className="text-yellow-400 text-xl mb-4">{"★".repeat(testimonials[activeTestimonial]?.rating || 5)}</div>
              <p className="text-lg text-espresso/80 italic leading-relaxed mb-6 min-h-16">"{testimonials[activeTestimonial]?.quote}"</p>
              <p className="font-semibold text-espresso">{testimonials[activeTestimonial]?.name}</p>
              <p className="text-sm text-gray-400">{testimonials[activeTestimonial]?.location}</p>
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={"w-2 h-2 rounded-full transition-all " + (i === activeTestimonial ? "bg-[#C9A535] w-5" : "bg-gray-200")}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div>
              <p className="text-champagne text-sm font-semibold tracking-widest mb-4">
                OUR PHILOSOPHY
              </p>
              <h2 className="font-serif text-5xl text-espresso mb-8 leading-tight">
                We don't sell tours.
                <br />
                <span className="italic">We curate stories.</span>
              </h2>
              <p className="text-espresso/70 text-lg leading-relaxed mb-6 font-light">
                MOMENTRY was born from a simple frustration — rushed tourism
                that skims the surface. We believe in slow, deep-dive travel:
                boutique stays run by families, meals cooked by grandmothers,
                and trails known only to locals.
              </p>
              <p className="text-espresso/70 text-lg leading-relaxed font-light">
                Every curation is scouted in person by our team, and every
                journey gives back to the communities that host it.
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-12">
              <div>
                <p className="font-serif text-5xl text-champagne font-bold mb-2">
                  150+
                </p>
                <p className="text-espresso/60 text-sm font-semibold tracking-widest">
                  HIDDEN GEMS UNCOVERED
                </p>
              </div>
              <div>
                <p className="font-serif text-5xl text-champagne font-bold mb-2">
                  98%
                </p>
                <p className="text-espresso/60 text-sm font-semibold tracking-widest">
                  HAPPY EXPLORERS
                </p>
              </div>
              <div>
                <p className="font-serif text-5xl text-champagne font-bold mb-2">
                  126
                </p>
                <p className="text-espresso/60 text-sm font-semibold tracking-widest">
                  LOCAL COMMUNITIES SUPPORTED
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-espresso text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-5xl mb-8 leading-tight">
            Your next adventure awaits
          </h2>
          <p className="text-lg mb-12 font-light opacity-90">
            Explore our curated collection of boutique journeys
          </p>
          <Link
            href="/packages"
            className="inline-block px-12 py-4 bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white font-semibold rounded-sm hover:opacity-90 hover:shadow-lg transition-all duration-300 text-lg tracking-wide"
          >
            Discover Journeys →
          </Link>
        </div>
      </section>
    </div>
  );
}
