"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiDownload, FiArrowLeft } from "react-icons/fi";
import { apiClient } from "../utils/api";

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await apiClient.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const downloadInvoice = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/bookings/${id}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `momentry-invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Could not download invoice. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <p className="font-serif text-2xl text-espresso animate-pulse">
          Loading booking details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] gap-4">
        <p className="text-red-600 text-base font-medium">{error}</p>
        <Link
          href="/bookings"
          className="flex items-center gap-2 text-espresso/70 hover:text-espresso transition text-sm font-medium"
        >
          <FiArrowLeft /> Back to My Bookings
        </Link>
      </div>
    );
  }

  const pkg = booking?.packageId;
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-16">
      <div className="max-w-3xl mx-auto px-6">

        {/* Back link */}
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-espresso/60 hover:text-espresso transition text-sm font-medium mb-8"
        >
          <FiArrowLeft /> Back to My Bookings
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] text-[#C9A535] font-bold tracking-[0.2em] uppercase mb-2">
            Booking Details
          </p>
          <h1 className="font-serif text-3xl font-bold text-espresso">
            {pkg?.title || "Unknown Package"}
          </h1>
          <p className="text-espresso/50 text-sm mt-1">
            Booking ID: #{booking._id.substring(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Package Info Card */}
        <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 shadow-sm mb-6">
          <p className="text-[9px] text-espresso/45 uppercase tracking-widest mb-4 font-bold">
            Package Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-[10px] text-espresso/45 uppercase tracking-wider mb-1 font-bold">
                Package
              </p>
              <p className="text-espresso font-semibold text-sm">{pkg?.title || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] text-espresso/45 uppercase tracking-wider mb-1 font-bold">
                Destination
              </p>
              <p className="text-espresso/70 text-sm">{pkg?.destination || "N/A"}</p>
            </div>
            <div>
              <p className="text-[10px] text-espresso/45 uppercase tracking-wider mb-1 font-bold">
                Duration
              </p>
              <p className="text-espresso/70 text-sm">
                {pkg?.duration ? `${pkg.duration} days` : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-espresso/45 uppercase tracking-wider mb-1 font-bold">
                Departure Date
              </p>
              <p className="text-espresso/70 text-sm">{formatDate(pkg?.departureDate)}</p>
            </div>
            <div>
              <p className="text-[10px] text-espresso/45 uppercase tracking-wider mb-1 font-bold">
                Travelers
              </p>
              <p className="text-espresso/70 text-sm">
                {booking.quantity} {booking.quantity === 1 ? "Person" : "People"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-espresso/45 uppercase tracking-wider mb-1 font-bold">
                Status
              </p>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[booking.status] || "bg-gray-100 text-gray-700"}`}
              >
                {booking.status}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-espresso/45 uppercase tracking-wider mb-1 font-bold">
                Total Amount
              </p>
              <p className="text-espresso font-bold text-base">
                ₹{booking.totalPrice?.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-espresso/45 uppercase tracking-wider mb-1 font-bold">
                Booked On
              </p>
              <p className="text-espresso/70 text-sm">{formatDate(booking.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Payment Info Card */}
        <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 shadow-sm mb-8">
          <p className="text-[9px] text-espresso/45 uppercase tracking-widest mb-4 font-bold">
            Payment Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-[10px] text-espresso/45 uppercase tracking-wider mb-1 font-bold">
                Payment ID
              </p>
              <p className="text-espresso/70 text-sm font-mono break-all">
                {booking.paymentId || "Not yet paid"}
              </p>
            </div>
            {booking.razorpayOrderId && (
              <div>
                <p className="text-[10px] text-espresso/45 uppercase tracking-wider mb-1 font-bold">
                  Order ID
                </p>
                <p className="text-espresso/70 text-sm font-mono break-all">
                  {booking.razorpayOrderId}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Download Invoice */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <button
            onClick={downloadInvoice}
            disabled={downloading}
            className="inline-flex items-center gap-2 bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload />
            {downloading ? "Downloading..." : "Download Invoice"}
          </button>
          <Link
            href="/bookings"
            className="inline-flex items-center gap-2 text-espresso/60 hover:text-espresso transition text-sm font-medium"
          >
            <FiArrowLeft /> Back to All Bookings
          </Link>
        </div>

      </div>
    </div>
  );
}
