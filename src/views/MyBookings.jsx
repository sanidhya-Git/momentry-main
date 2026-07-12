"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useBookingStore, usePackageStore } from "../store/useStore";
import {
  FiMapPin,
  FiArrowRight,
  FiCheck,
  FiDownload,
} from "react-icons/fi";

export default function MyBookings() {
  const { bookings, fetchBookings } = useBookingStore();
  const { packages } = usePackageStore();
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const downloadInvoice = async (bookingId, e) => {
    e.preventDefault()
    setDownloadingId(bookingId)
    try {
      const token = localStorage.getItem('token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/bookings/${bookingId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `momentry-invoice-${bookingId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Could not download invoice. Please try again.')
    } finally {
      setDownloadingId(null)
    }
  }

  useEffect(() => {
    const load = async () => {
      await fetchBookings();
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <p className="font-serif text-2xl text-espresso animate-pulse">
          Loading your travel hub...
        </p>
      </div>
    );
  }

  // Find the most recent confirmed booking
  const upcomingBooking = bookings?.find((b) => b.status === "confirmed");
  const upcomingPackage = upcomingBooking?.packageId ?? null;

  // Calculate destination settings
  let daysUntilDeparture = 30;
  let formattedDates = "Oct 12 - 19, 2026";
  let departureDayLabel = "Oct 12";
  let airportText = "DEL → KIX";
  let weatherTemp = "28°";
  let weatherText = "28°C · Clear skies";
  let packingGuide = [
    "Passport & visas",
    "Comfortable walking shoes",
    "Light rain jacket",
    "Power adapter (Type A)",
  ];

  if (upcomingPackage) {
    const now = new Date();
    const depDate = upcomingPackage.departureDate
      ? new Date(upcomingPackage.departureDate)
      : new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000);
    const diffTime = depDate.getTime() - now.getTime();
    daysUntilDeparture = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const durationDays = upcomingPackage.duration || 7;
    const endDate = new Date(depDate.getTime() + (durationDays - 1) * 24 * 60 * 60 * 1000);
    const options = { month: "short", day: "numeric" };
    formattedDates = `${depDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", { ...options, year: "numeric" })}`;
    departureDayLabel = depDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    // Set custom values based on destination
    const dest = upcomingPackage.destination.toLowerCase();
    if (dest.includes("kyoto") || dest.includes("japan")) {
      airportText = "DEL → KIX";
      weatherTemp = "28°";
      weatherText = "28°C · Clear skies";
      packingGuide = [
        "Passport & visas",
        "Comfortable walking shoes",
        "Light rain jacket",
        "Power adapter (Type A)",
      ];
    } else if (dest.includes("himachal") || dest.includes("kasol") || dest.includes("triund") || dest.includes("manali")) {
      airportText = "DEL → IXC";
      weatherTemp = "18°";
      weatherText = "18°C · Light rain";
      packingGuide = [
        "Trekking shoes",
        "Warm layers / fleece jacket",
        "Rain poncho",
        "Water bottle & snacks",
      ];
    } else if (dest.includes("uttarakhand") || dest.includes("kedarnath") || dest.includes("tungnath")) {
      airportText = "DEL → DED";
      weatherTemp = "15°";
      weatherText = "15°C · Heavy clouds";
      packingGuide = [
        "Warm jacket / thermals",
        "Hiking stick",
        "Small backpack",
        "Personal medicines",
      ];
    } else if (dest.includes("rajasthan") || dest.includes("jaipur") || dest.includes("udaipur")) {
      airportText = "DEL → JAI";
      weatherTemp = "34°";
      weatherText = "34°C · Sunny & dry";
      packingGuide = [
        "Light cotton clothes",
        "Sunscreen & sunglasses",
        "Sun hat / cap",
        "Comfortable sandals",
      ];
    } else if (dest.includes("goa")) {
      airportText = "DEL → GOI";
      weatherTemp = "31°";
      weatherText = "31°C · Hot & humid";
      packingGuide = [
        "Swimwear & shorts",
        "Sunscreen lotion",
        "Beach slippers",
        "Sunglasses & cap",
      ];
    } else {
      airportText = "DEL → IXC";
      weatherTemp = "25°";
      weatherText = "25°C · Partly cloudy";
    }
  }

  const displayBookingId = upcomingBooking
    ? `#BK-${upcomingBooking._id.substring(0, 6).toUpperCase()}`
    : "#BK-9024A1";

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-16">
      <div className="max-w-6xl mx-auto px-6">
        
        {bookings && bookings.length > 0 ? (
          <div className="space-y-12">
            
            {/* Travel Hub Header Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left 2 Columns: Journey Card & Timeline */}
              <div className="lg:col-span-2 space-y-10">
                
                {/* Upcoming Journey Card */}
                {upcomingPackage && (
                  <div className="bg-[#FAF3E8] border border-[#E5E0D5] rounded-2xl p-6 md:p-8 shadow-sm">
                    <p className="text-[10px] text-[#C9A535] font-bold tracking-[0.2em] mb-2 uppercase">
                      UPCOMING JOURNEY
                    </p>
                    <h2 className="font-serif text-3xl font-bold text-espresso leading-tight">
                      Trip to {upcomingPackage.title}{" "}
                      <span className="font-sans font-light text-sm text-espresso/60 block sm:inline sm:ml-2">
                        starts in {daysUntilDeparture} days
                      </span>
                    </h2>
                    <p className="text-espresso/60 text-xs md:text-sm font-light mt-2">
                      {formattedDates} · {upcomingBooking.quantity} {upcomingBooking.quantity === 1 ? "traveler" : "travelers"} · Booking {displayBookingId}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[9px] text-espresso/45 font-bold tracking-widest uppercase">
                          PREP PROGRESS — 62% READY
                        </p>
                      </div>
                      <div className="w-full bg-espresso/5 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#C9A535] h-1.5 rounded-full"
                          style={{ width: "62%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Live Timeline Section */}
                <div className="space-y-6">
                  <h3 className="font-serif text-2xl font-bold text-espresso">
                    Live Timeline
                  </h3>

                  {/* Timeline Cards Container */}
                  <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 md:p-8 shadow-sm">
                    <div className="relative pl-6 space-y-10">
                      
                      {/* Step 1: Payment Confirmed (Completed) */}
                      <div className="relative flex gap-5">
                        {/* vertical line segment */}
                        <div className="absolute -left-[37px] top-[24px] bottom-[-40px] w-0.5 bg-[#6B8E6F]" />
                        
                        {/* Circle node */}
                        <div className="absolute -left-[49px] top-0 w-7 h-7 rounded-full bg-[#6B8E6F] text-white flex items-center justify-center flex-shrink-0 z-10">
                          <FiCheck size={14} className="stroke-[3]" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm md:text-base font-semibold text-espresso">Payment Confirmed</h4>
                            <span className="px-1.5 py-0.5 rounded bg-[#6B8E6F]/10 text-[#6B8E6F] text-[9px] font-bold tracking-wider uppercase">
                              DONE
                            </span>
                          </div>
                          <p className="text-xs text-espresso/50 mt-1 font-light">
                            Receipt & invoice sent to your inbox · Jun 5
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Hotel & Flight Vouchers Issued (Completed) */}
                      <div className="relative flex gap-5">
                        {/* vertical line segment */}
                        <div className="absolute -left-[37px] top-[24px] bottom-[-40px] w-0.5 bg-[#6B8E6F]" />
                        
                        {/* Circle node */}
                        <div className="absolute -left-[49px] top-0 w-7 h-7 rounded-full bg-[#6B8E6F] text-white flex items-center justify-center flex-shrink-0 z-10">
                          <FiCheck size={14} className="stroke-[3]" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm md:text-base font-semibold text-espresso">Hotel & Flight Vouchers Issued</h4>
                            {upcomingBooking && (
                              <button
                                onClick={(e) => downloadInvoice(upcomingBooking._id, e)}
                                disabled={downloadingId === upcomingBooking._id}
                                className="text-[10px] text-[#C9A535] hover:text-[#B48C28] font-bold tracking-wide flex items-center gap-1 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                [ {downloadingId === upcomingBooking._id ? 'Downloading...' : 'Download PDF'} <FiDownload className="inline" /> ]
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-espresso/50 mt-1 font-light">
                            {upcomingPackage?.destination?.toLowerCase().includes("kyoto") 
                              ? "Heritage machiya residence + ANA flights confirmed"
                              : "Boutique stays + transport itinerary confirmed"}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Local Guide Assignment (In Progress) */}
                      <div className="relative flex gap-5">
                        {/* vertical line segment - DASHED */}
                        <div className="absolute -left-[37px] top-[24px] bottom-[-40px] w-[1px] border-l-2 border-dashed border-[#C9A535]" />
                        
                        {/* Circle node */}
                        <div className="absolute -left-[49px] top-0 w-7 h-7 rounded-full bg-[#FAF6EE] border border-solid border-[#C9A535] text-[#C9A535] flex items-center justify-center flex-shrink-0 z-10 text-[10px] font-bold">
                          ...
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm md:text-base font-semibold text-espresso">Local Guide Assignment</h4>
                            <span className="px-1.5 py-0.5 rounded bg-[#FAF3E8] text-[#C9A535] text-[9px] font-bold tracking-wider uppercase border border-[#C9A535]/20">
                              IN PROGRESS
                            </span>
                          </div>
                          <p className="text-xs text-espresso/50 mt-1 font-light">
                            Your storyteller's profile unlocks 48 hrs before departure
                          </p>
                        </div>
                      </div>

                      {/* Step 4: Departure */}
                      <div className="relative flex gap-5">
                        {/* Circle node */}
                        <div className="absolute -left-[49px] top-0 w-7 h-7 rounded-full bg-[#FAF8F5] border border-solid border-espresso/20 text-espresso/40 flex items-center justify-center flex-shrink-0 z-10">
                          
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-sm md:text-base font-semibold text-espresso/45">Departure</h4>
                          <p className="text-xs text-espresso/40 mt-1 font-light">
                            {departureDayLabel} · 06:40 AM · {airportText}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Quick Links Widgets */}
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-espresso">
                  Quick Links
                </h3>
                
                <div className="space-y-4">
                  
                  {/* Weather Widget */}
                  <div className="bg-white border border-[#E5E0D5] rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-[#C9A535] font-bold tracking-[0.2em] mb-1 uppercase">
                        {upcomingPackage ? upcomingPackage.destination.split(",")[0].toUpperCase() : "KYOTO"} WEATHER
                      </p>
                      <p className="text-xs md:text-sm font-semibold text-espresso">{weatherText}</p>
                    </div>
                    <span className="font-serif text-3xl font-bold text-espresso/30">{weatherTemp}</span>
                  </div>

                  {/* Packing Guide Widget */}
                  <div className="bg-white border border-[#E5E0D5] rounded-2xl p-5 shadow-sm">
                    <p className="text-[9px] text-[#C9A535] font-bold tracking-[0.2em] mb-3 uppercase">
                      PACKING GUIDE
                    </p>
                    <ul className="text-xs text-espresso/70 space-y-2 font-light">
                      {packingGuide.map((item, idx) => (
                        <li key={idx} className="flex items-baseline gap-1.5">
                          <span className="text-espresso/40">—</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fellow Travelers Chat Widget */}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="bg-white border border-[#E5E0D5] rounded-2xl p-5 shadow-sm hover:border-[#C9A535]/50 transition flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <p className="text-[9px] text-[#C9A535] font-bold tracking-[0.2em] mb-1 uppercase">
                        FELLOW TRAVELERS
                      </p>
                      <p className="text-xs md:text-sm font-semibold text-espresso">Join private group chat</p>
                    </div>
                    <FiArrowRight className="text-espresso/30 group-hover:text-[#C9A535] transition-all transform group-hover:translate-x-1" />
                  </a>

                  {/* 24/7 Concierge Support Widget */}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="bg-[#FAF6EE] border border-[#C9A535]/30 rounded-2xl p-5 shadow-sm hover:border-[#C9A535] transition flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <p className="text-[9px] text-[#C9A535] font-bold tracking-[0.2em] mb-1 uppercase">
                        24/7 CONCIERGE
                      </p>
                      <p className="text-xs md:text-sm font-semibold text-espresso">Chat with us anytime</p>
                    </div>
                    <FiArrowRight className="text-[#C9A535] group-hover:text-[#B48C28] transition-all transform group-hover:translate-x-1" />
                  </a>

                </div>
              </div>

            </div>

            {/* All Bookings List (Lower section) */}
            <div className="border-t border-espresso/15 pt-12">
              <h3 className="font-serif text-2xl font-bold text-espresso mb-6">
                All Bookings
              </h3>
              <div className="space-y-4">
                {(() => {
                  const statusColors = {
                    pending: 'bg-yellow-100 text-yellow-800',
                    confirmed: 'bg-green-100 text-green-800',
                    cancelled: 'bg-red-100 text-red-800',
                  };

                  const getTimelineSteps = (booking) => {
                    if (booking.status === 'pending') {
                      return [
                        { label: 'Booking Requested', done: true },
                        { label: 'Payment Processing', done: !!booking.paymentId },
                        { label: 'Awaiting Confirmation', done: false },
                      ];
                    }
                    if (booking.status === 'confirmed') {
                      return [
                        { label: 'Confirmed', done: true },
                        { label: 'Payment Complete', done: true },
                        { label: 'Preparing Your Journey', done: true },
                        { label: 'Departure', done: false },
                      ];
                    }
                    if (booking.status === 'cancelled') {
                      return [{ label: 'Booking Cancelled', done: true, cancelled: true }];
                    }
                    return [];
                  };

                  return bookings.map((booking) => {
                    const pkg = booking.packageId;
                    const steps = getTimelineSteps(booking);
                    return (
                      <div
                        key={booking._id}
                        className="bg-white border border-[#E5E0D5] rounded-2xl p-5 hover:border-[#C9A535]/50 hover:shadow-md transition"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-start">
                          <div>
                            <p className="text-[9px] text-espresso/45 uppercase tracking-widest mb-1 font-bold">
                              Journey
                            </p>
                            <p className="font-serif text-sm font-bold text-espresso">
                              {pkg?.title || "Unknown"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-espresso/45 uppercase tracking-widest mb-1 font-bold">
                              Destination
                            </p>
                            <p className="text-espresso/70 text-xs font-light">
                              {pkg?.destination || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-espresso/45 uppercase tracking-widest mb-1 font-bold">
                              Travelers
                            </p>
                            <p className="text-espresso/70 text-xs font-light">
                              {booking.quantity} {booking.quantity === 1 ? "Person" : "People"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[9px] text-espresso/45 uppercase tracking-widest mb-1 font-bold">
                              Amount
                            </p>
                            <p className="text-xs md:text-sm font-bold text-espresso">
                              ₹{booking.totalPrice.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 items-start sm:items-end">
                            <span className={`${statusColors[booking.status] || 'bg-gray-100 text-gray-700'} px-2 py-0.5 rounded-full text-xs font-semibold capitalize`}>
                              {booking.status}
                            </span>
                            <button
                              onClick={(e) => downloadInvoice(booking._id, e)}
                              disabled={downloadingId === booking._id}
                              className="flex items-center gap-1 text-[10px] text-[#C9A535] hover:text-[#B48C28] font-bold tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiDownload size={10} />
                              {downloadingId === booking._id ? 'Downloading...' : 'Download Invoice'}
                            </button>
                            <Link href={'/bookings/' + booking._id} className="text-sm text-espresso underline">
                              View Details
                            </Link>
                          </div>
                        </div>

                        {/* Dynamic Timeline Steps */}
                        {steps.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-espresso/10 flex flex-wrap gap-x-6 gap-y-2">
                            {steps.map((step, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${step.cancelled ? 'bg-red-400' : step.done ? 'bg-[#6B8E6F]' : 'bg-espresso/20'}`} />
                                <span className={`text-[10px] font-medium ${step.cancelled ? 'text-red-500' : step.done ? 'text-espresso/80' : 'text-espresso/35'}`}>
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white border border-[#E5E0D5] rounded-2xl p-16 text-center max-w-xl mx-auto shadow-sm">
            <FiMapPin size={40} className="mx-auto text-[#C9A535] mb-6" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso mb-3">
              Your adventures await
            </h2>
            <p className="text-espresso/60 text-sm md:text-base font-light mb-8 max-w-sm mx-auto leading-relaxed">
              You haven't booked any journeys yet. Explore our curated destinations to start.
            </p>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white font-semibold px-8 py-3.5 rounded-xl shadow transition tracking-wide text-xs md:text-sm uppercase font-sans"
            >
              Explore Journeys
              <FiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
