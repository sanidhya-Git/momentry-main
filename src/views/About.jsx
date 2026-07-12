"use client";

import React from "react";
import Link from "next/link";

export default function About() {
  const stats = [
    { value: "150+", label: "HIDDEN GEMS UNCOVERED" },
    { value: "98%", label: "HAPPY EXPLORERS" },
    { value: "126", label: "LOCAL COMMUNITIES SUPPORTED" },
  ];

  const curators = [
    { name: "Meera S.", love: "Kyoto", initials: "MS" },
    { name: "Arjun T.", love: "Spiti", initials: "AT" },
    { name: "Sofia L.", love: "Lisbon", initials: "SL" },
    { name: "Dev R.", love: "Sahara", initials: "DR" },
  ];

  const promises = [
    {
      title: "Handpicked Boutique Stays",
      description: "Scouted in person, never aggregated.",
    },
    {
      title: "Expert Local Storytellers",
      description: "Guides who grew up where you'll wander.",
    },
    {
      title: "24/7 Premium Concierge",
      description: "A human, always awake, always for you.",
    },
  ];

  return (
    <div className="min-h-screen bg-alabaster">
      {/* Philosophy Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-champagne text-xs font-bold tracking-[0.3em] mb-4 text-center">
            OUR PHILOSOPHY
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-espresso text-center mb-10 leading-tight">
            We don't sell tours.
            <br />
            <span className="italic">We curate stories.</span>
          </h1>
          <p className="text-espresso/70 text-lg leading-relaxed font-light max-w-3xl mx-auto text-center mb-20">
            MOMENTRY was born from a simple frustration — rushed tourism that
            skims the surface. We believe in slow, deep-dive travel: boutique
            stays run by families, meals cooked by grandmothers, and trails
            known only to locals. Every curation is scouted in person by our
            team, and every journey gives back to the communities that host it.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="font-serif text-6xl text-champagne font-bold mb-3">
                  {stat.value}
                </p>
                <p className="text-espresso/60 text-xs font-semibold tracking-[0.2em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Curators */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-champagne text-xs font-bold tracking-[0.3em] mb-12 text-center">
            THE CURATORS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-3xl mx-auto">
            {curators.map((curator, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#E2C766] to-[#C9A535] flex items-center justify-center">
                  <span className="font-serif text-2xl text-white font-bold">
                    {curator.initials}
                  </span>
                </div>
                <p className="font-serif text-lg text-espresso font-semibold">
                  {curator.name}
                </p>
                <p className="text-sm text-espresso/50 font-light">
                  ♥ {curator.love}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {promises.map((promise, i) => (
              <div
                key={i}
                className="bg-white border border-espresso/10 rounded-sm p-8 text-center hover:border-champagne transition"
              >
                <p className="text-champagne text-2xl mb-4">◇</p>
                <h3 className="font-serif text-xl text-espresso mb-3">
                  {promise.title}
                </h3>
                <p className="text-espresso/60 text-sm font-light">
                  {promise.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-espresso text-center">
        <h2 className="font-serif text-4xl text-white mb-8">
          Ready to travel deeper?
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
