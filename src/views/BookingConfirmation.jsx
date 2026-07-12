"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useBookingStore,
  usePackageStore,
  useAuthStore,
} from "../store/useStore";

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const { bookings, fetchBookings } = useBookingStore();
  const { packages } = usePackageStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const booking = bookings?.find((b) => b._id === bookingId);
  const pkg = booking
    ? packages?.find((p) => p._id === booking.packageId)
    : null;

  useEffect(() => {
    if (!pkg) return;

    const targetTime = pkg.departureDate
      ? new Date(pkg.departureDate).getTime()
      : new Date().getTime() + 30 * 24 * 60 * 60 * 1000;

    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        });
      } else {
        setCountdown({ days: 0, hours: 0, mins: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000);

    return () => clearInterval(timer);
  }, [pkg?.departureDate]);

  if (!booking || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <p className="font-serif text-2xl text-espresso">
          Loading confirmation...
        </p>
      </div>
    );
  }

  const displayBookingId = `#BK-${bookingId.substring(0, 6).toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayBookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-20 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center w-full">
        
        {/* Double Dashed/Solid Checkmark Circle */}
        <div className="mb-10 flex justify-center">
          <div className="w-24 h-24 rounded-full border border-dashed border-[#C9A535] flex items-center justify-center relative">
            <div className="w-[84px] h-[84px] rounded-full border border-solid border-[#C9A535] bg-[#FAF8F5] flex items-center justify-center">
              {/* Minimal Checkmark */}
              <svg
                className="w-7 h-7 text-espresso stroke-[2.5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Celebration Message */}
        <h1 className="font-serif text-4xl md:text-5xl text-espresso mb-4 leading-tight">
          Pack your bags, {user?.name?.split(" ")[0] || "traveler"}!
        </h1>
        <p className="text-base md:text-lg text-espresso/70 font-light mb-12 max-w-lg mx-auto leading-relaxed">
          It's <i>official</i> — your curation to <span className="font-normal text-espresso">{pkg.destination}</span> is <i>locked in</i>.
        </p>

        {/* Split Details Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-12">
          {/* Card 1: Booking ID */}
          <div className="bg-white border border-[#E5E0D5] p-5 rounded-2xl shadow-sm flex flex-col justify-center items-center h-[96px]">
            <p className="text-[9px] text-[#C9A535] font-bold tracking-[0.25em] mb-2 uppercase">
              BOOKING ID
            </p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-base md:text-lg font-bold text-espresso tracking-wide">
                {displayBookingId}
              </span>
              <button
                onClick={handleCopy}
                className="text-[9px] text-espresso/45 hover:text-espresso font-bold tracking-widest transition uppercase border-b border-espresso/25 pb-0.5"
              >
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>

          {/* Card 2: Countdown */}
          <div className="bg-white border border-[#E5E0D5] p-5 rounded-2xl shadow-sm flex flex-col justify-center items-center h-[96px]">
            <p className="text-[9px] text-[#C9A535] font-bold tracking-[0.25em] mb-2 uppercase">
              DEPARTURE COUNTDOWN
            </p>
            <p className="text-sm md:text-base font-serif font-bold text-espresso tracking-wide">
              {countdown.days} Days : {String(countdown.hours).padStart(2, "0")} Hrs : {String(countdown.mins).padStart(2, "0")} Min
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-4">
          <button
            onClick={() => router.push("/bookings")}
            className="w-full max-w-xs bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white font-semibold py-4 rounded-xl shadow transition duration-200 tracking-wider text-sm font-sans mx-auto block"
          >
            Track My Trip
          </button>
          <p className="text-xs text-espresso/55 font-light mt-6 max-w-md mx-auto leading-relaxed">
            A welcome packet & invoice have been dispatched to <span className="font-normal text-espresso">{user?.email}</span>
          </p>
        </div>

      </div>
    </div>
  );
}
