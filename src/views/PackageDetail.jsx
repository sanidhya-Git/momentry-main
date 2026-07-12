"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  usePackageStore,
  useAuthStore,
  useBookingStore,
} from "../store/useStore";
import { apiClient } from '../utils/api';
import {
  FiMapPin,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiLock,
  FiChevronDown,
  FiChevronRight,
  FiCheck,
  FiStar,
} from "react-icons/fi";

export default function PackageDetail() {
  const { id } = useParams();
  const { packages, loading: packagesLoading } = usePackageStore();
  const { user } = useAuthStore();
  const { createBooking, bookings } = useBookingStore();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState({ reviews: [], totalReviews: 0, avgRating: 0, ratingBreakdown: {}, pages: 1 });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', body: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDay, setOpenDay] = useState(1);
  const [timeLeft, setTimeLeft] = useState(null);
  const [activeTab, setActiveTab] = useState("journey");

  const pkg = packages?.find((p) => p._id === id);

  useEffect(() => {
    if (!pkg || !pkg.bookingEndDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(pkg.bookingEndDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        return { expired: true };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [pkg?.bookingEndDate]);

  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    apiClient.get(`/reviews/package/${id}?page=${reviewsPage}&limit=5`)
      .then(r => setReviews(r.data))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [id, reviewsPage, reviewSubmitted]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-alabaster">
        <p className="font-serif text-2xl text-espresso">
          {packagesLoading || !packages?.length
            ? "Loading journey..."
            : "Journey not found"}
        </p>
      </div>
    );
  }

  const eligibleBooking = bookings?.find(b =>
    b.packageId?._id === id && b.status === 'confirmed'
  );
  const alreadyReviewed = reviews.reviews?.some(r => r.userId?._id === user?._id);
  const canReview = user && eligibleBooking && !alreadyReviewed && !reviewSubmitted;

  const submitReview = async () => {
    if (!reviewForm.rating) { setReviewError('Please select a rating'); return; }
    if (!reviewForm.title.trim()) { setReviewError('Please add a title'); return; }
    if (!reviewForm.body.trim()) { setReviewError('Please write your review'); return; }
    setReviewSubmitting(true);
    setReviewError('');
    try {
      await apiClient.post('/reviews', { packageId: id, bookingId: eligibleBooking._id, ...reviewForm });
      setReviewSubmitted(true);
      setReviewForm({ rating: 0, title: '', body: '' });
    } catch (e) {
      setReviewError(e.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const result = await createBooking(id, quantity);
    if (result.success) {
      router.push(`/payment/${result.data._id}`);
    }
    setLoading(false);
  };

  const totalPrice = pkg.price * quantity;

  // Render content depending on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "journey":
        return (
          <div className="space-y-0">
            {pkg.itinerary && pkg.itinerary.length > 0 ? (
              pkg.itinerary.map((day, idx) => {
                const isOpen = openDay === day.day;
                return (
                  <div
                    key={idx}
                    className="border-b border-espresso/10 py-5 last:border-b-0"
                  >
                    <button
                      onClick={() => setOpenDay(isOpen ? null : day.day)}
                      className="w-full flex items-center justify-between text-left transition focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-champagne font-semibold">
                          DAY {String(day.day).padStart(2, "0")}
                        </span>
                        <span className="font-serif text-lg md:text-xl font-bold text-espresso hover:text-champagne transition-colors">
                          {day.title}
                        </span>
                      </div>
                      <span className="text-espresso/40 ml-2">
                        {isOpen ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
                      </span>
                    </button>
                    
                    {/* Expanded Content */}
                    {isOpen && (
                      <div className="mt-4 pl-0 md:pl-[64px] animate-fadeIn">
                        <p className="text-espresso/70 text-sm md:text-base font-light leading-relaxed">
                          {day.description}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <p className="text-espresso/60 font-light italic">No itinerary details available.</p>
            )}
          </div>
        );
      case "stays":
        return (
          <div className="space-y-6">
            <div className="border border-espresso/10 p-6 bg-white rounded-md">
              <span className="text-[10px] text-champagne font-bold tracking-widest uppercase">PRIMARY LODGING</span>
              <h3 className="font-serif text-xl font-bold text-espresso mt-1 mb-2">Heritage Machiya Townhouse</h3>
              <p className="text-espresso/70 text-sm font-light leading-relaxed">
                Stay in a meticulously restored historical machiya residence. Features traditional paper sliding doors, tatami mats, and modern luxury amenities to give you an authentic Kyoto home experience.
              </p>
            </div>
            <div className="border border-espresso/10 p-6 bg-white rounded-md">
              <span className="text-[10px] text-champagne font-bold tracking-widest uppercase">RETREAT RETREAT</span>
              <h3 className="font-serif text-xl font-bold text-espresso mt-1 mb-2">Private Onsen Ryokan</h3>
              <p className="text-espresso/70 text-sm font-light leading-relaxed">
                Rejuvenate at a high-end hot spring resort. Unwind in mineral-rich outdoor thermal baths and indulge in multi-course kaiseki dinners crafted with seasonal regional ingredients.
              </p>
            </div>
          </div>
        );
      case "included":
        return (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-espresso mb-4">What's Included in Your Journey</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pkg.highlights?.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white border border-espresso/5 p-4 rounded-md">
                  <FiCheck className="text-olive mt-1 flex-shrink-0 text-lg stroke-[3]" />
                  <span className="text-espresso/80 text-sm font-light">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "reviews":
        return (
          <section className="mt-0 pb-4">
            {/* Aggregate Rating */}
            {reviews.totalReviews > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6 flex gap-8 flex-wrap">
                <div className="text-center">
                  <div className="text-5xl font-bold text-espresso">{reviews.avgRating?.toFixed(1)}</div>
                  <div className="text-yellow-400 text-xl mt-1">{'★'.repeat(Math.round(reviews.avgRating))}{'☆'.repeat(5-Math.round(reviews.avgRating))}</div>
                  <div className="text-sm text-gray-500 mt-1">{reviews.totalReviews} review{reviews.totalReviews !== 1 ? 's' : ''}</div>
                </div>
                <div className="flex-1 min-w-48">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2 mb-1">
                      <span className="text-xs w-4">{star}★</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{width: reviews.totalReviews > 0 ? ((reviews.ratingBreakdown?.[star]||0)/reviews.totalReviews*100)+'%' : '0%'}}></div>
                      </div>
                      <span className="text-xs text-gray-500 w-4">{reviews.ratingBreakdown?.[star]||0}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Write Review Form */}
            {canReview && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-espresso mb-4">Write a Review</h3>
                {reviewError && <p className="text-red-500 text-sm mb-3">{reviewError}</p>}
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setReviewForm(f=>({...f,rating:s}))}
                      className={'text-2xl ' + (s <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300')}>★</button>
                  ))}
                </div>
                <input value={reviewForm.title} onChange={e=>setReviewForm(f=>({...f,title:e.target.value}))}
                  placeholder="Review title" maxLength={100}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:border-champagne" />
                <textarea value={reviewForm.body} onChange={e=>setReviewForm(f=>({...f,body:e.target.value}))}
                  placeholder="Share your experience..." maxLength={1000} rows={4}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:border-champagne resize-none" />
                <button onClick={submitReview} disabled={reviewSubmitting}
                  className="bg-espresso text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-espresso/90 disabled:opacity-50">
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            )}
            {reviewSubmitted && <p className="text-green-600 text-sm mb-4">Review submitted! It will appear after moderation.</p>}

            {/* Reviews List */}
            {reviewsLoading ? <p className="text-gray-400">Loading reviews...</p> : (
              reviews.reviews?.length === 0 ? (
                <p className="text-gray-400 italic">No reviews yet. Be the first to share your experience!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.reviews.map(r => (
                    <div key={r._id} className="bg-white border border-gray-100 rounded-xl p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-champagne/20 flex items-center justify-center text-espresso font-bold text-sm">
                            {(r.userId?.name || 'A')[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm text-espresso">{r.userId?.name || 'Traveler'}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                          <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN',{month:'short',year:'numeric'})}</div>
                        </div>
                      </div>
                      <p className="font-semibold text-sm text-espresso mb-1">{r.title}</p>
                      <p className="text-sm text-gray-600">{r.body}</p>
                    </div>
                  ))}
                  {reviews.pages > 1 && (
                    <div className="flex gap-2 mt-4">
                      {Array.from({length:reviews.pages},(_,i)=>i+1).map(p=>(
                        <button key={p} onClick={()=>setReviewsPage(p)}
                          className={'px-3 py-1 text-sm rounded-lg border ' + (p===reviewsPage?'bg-espresso text-white':'border-gray-200 text-gray-600')}>
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      <div className="max-w-6xl mx-auto px-6 pt-10">
        
        {/* Dark Blue Hero Banner Card */}
        <div className="relative bg-[#1F323A] rounded-2xl p-8 md:p-12 mb-10 overflow-hidden shadow-lg min-h-[200px] flex flex-col justify-end">
          {/* Decorative background image blend */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
            style={{ backgroundImage: `url(${pkg.image || ''})` }}
          />
          
          {/* Badge */}
          <div className="absolute top-6 left-6 bg-[#C9A535] text-white px-3 py-1 text-[10px] font-bold tracking-widest rounded uppercase">
            Best Seller
          </div>

          {/* Banner Contents */}
          <div className="relative z-10">
            <h1 className="font-serif text-3xl md:text-5xl text-white mb-3">
              {pkg.title}
            </h1>
            <p className="text-white/80 text-xs md:text-sm tracking-widest uppercase font-light">
              {pkg.destination} · {pkg.duration} DAYS / {pkg.duration - 1} NIGHTS · ★ 4.9 (212 verified reviews)
            </p>
          </div>
        </div>

        {/* Page Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Details & Tabs */}
          <div className="lg:col-span-2">
            
            {/* Tab Bar Navigation */}
            <div className="flex border-b border-espresso/10 mb-8 overflow-x-auto gap-8">
              {[
                { id: "journey", label: "The Journey" },
                { id: "stays", label: "Stays & Comfort" },
                { id: "included", label: "What's Included" },
                { id: "reviews", label: "Reviews" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 text-sm font-semibold tracking-wide border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#C9A535] text-espresso"
                      : "border-transparent text-espresso/40 hover:text-espresso/70"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents Panel */}
            <div className="animate-fadeIn">
              {renderTabContent()}
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div>
            <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sticky top-24 shadow-md">
              <div className="mb-6">
                <p className="text-[10px] text-espresso/40 tracking-widest uppercase font-bold mb-1">
                  From
                </p>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-espresso">
                  ₹{pkg.price.toLocaleString()}
                  <span className="text-sm font-light text-espresso/50"> / person</span>
                </h3>
              </div>

              {/* Departure and Travelers Custom Split Input Panel */}
              <div className="grid grid-cols-2 gap-0 border border-espresso/10 rounded-xl mb-6 overflow-hidden bg-[#FAF8F5]">
                <div className="p-3.5 border-r border-espresso/10 flex flex-col justify-center">
                  <span className="text-[9px] text-espresso/40 font-bold tracking-widest uppercase">
                    DEPARTURE
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-espresso mt-1">
                    {pkg.departureDate ? formatDate(pkg.departureDate) : "Oct 12, 2026"}
                  </span>
                </div>
                <div className="p-3.5 flex flex-col justify-center relative">
                  <span className="text-[9px] text-espresso/40 font-bold tracking-widest uppercase">
                    TRAVELERS
                  </span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="text-xs md:text-sm font-semibold text-espresso mt-1 bg-transparent border-none focus:outline-none appearance-none cursor-pointer pr-6 w-full font-sans"
                  >
                    {[...Array(pkg.maxParticipants || 10).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? "Adult" : "Adults"}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3.5 bottom-4 text-espresso/40">
                    <FiChevronDown size={14} />
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              {pkg.isActive && !(timeLeft && timeLeft.expired) ? (
                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white font-semibold py-4 rounded-xl shadow transition duration-200 disabled:opacity-50 tracking-wider text-sm font-sans"
                >
                  {loading ? "Processing..." : "Book Now — Secure with Razorpay"}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-espresso/10 text-espresso/40 font-semibold py-4 rounded-xl cursor-not-allowed text-sm"
                >
                  {timeLeft && timeLeft.expired ? "Booking Closed" : "Not Available"}
                </button>
              )}

              <p className="text-[11px] text-espresso/50 text-center mt-3">
                Free cancellation up to 30 days before departure
              </p>

              <hr className="my-5 border-espresso/5" />

              {/* Value Checkmarks */}
              <div className="space-y-3">
                {[
                  "Handpicked boutique stays",
                  "Expert local storytellers",
                  "24/7 premium concierge"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-espresso/70 font-light">
                    <FiCheck className="text-espresso/60 text-sm flex-shrink-0 stroke-[3.5]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
