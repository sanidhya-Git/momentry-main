"use client";

import React, { useState, useEffect } from 'react'
import { apiClient } from '../utils/api'
import { useAuthStore } from '../store/useStore'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiImage,
  FiLock,
  FiStar,
  FiCalendar,
  FiPackage,
  FiEdit2,
  FiSave,
  FiX,
} from 'react-icons/fi'

// ─── tiny helpers ────────────────────────────────────────────────────────────

function StarRating({ rating = 0, max = 5 }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <FiStar
          key={i}
          size={13}
          className={i < rating ? 'text-[#C9A535] fill-[#C9A535]' : 'text-espresso/20'}
          style={{ fill: i < rating ? '#C9A535' : 'none' }}
        />
      ))}
    </span>
  )
}

function StatusBadge({ status }) {
  const map = {
    approved: 'bg-[#6B8E6F]/12 text-[#4A7050] border border-[#6B8E6F]/25',
    pending:  'bg-[#C9A535]/12 text-[#8A6E1A] border border-[#C9A535]/25',
    rejected: 'bg-red-50 text-red-600 border border-red-200',
  }
  const label = status === 'approved' ? 'Published' : status === 'rejected' ? 'Not approved' : 'Under review'
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase ${map[status] || map.pending}`}>
      {label}
    </span>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

function FieldRow({ icon: Icon, label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.18em] uppercase text-espresso/45">
        <Icon size={11} />
        {label}
      </label>
      {children}
    </div>
  )
}

function Toast({ type, message, onClose }) {
  if (!message) return null
  const styles = type === 'success'
    ? 'bg-[#6B8E6F]/10 border-[#6B8E6F]/30 text-[#4A7050]'
    : 'bg-red-50 border-red-200 text-red-700'
  return (
    <div className={`flex items-center justify-between gap-3 border rounded-lg px-4 py-3 text-sm font-medium mb-6 ${styles}`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-70 transition" aria-label="Dismiss">
        <FiX size={14} />
      </button>
    </div>
  )
}

// ─── input shared style ───────────────────────────────────────────────────────

const inputCls =
  'w-full bg-[#FAF8F5] border border-espresso/12 rounded-lg px-4 py-3 text-sm text-espresso placeholder-espresso/30 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#C9A535]/30 focus:border-[#C9A535]/50 transition'

// ─── tabs ─────────────────────────────────────────────────────────────────────

const TABS = ['Personal Info', 'My Reviews', 'Security']

// ─── main component ───────────────────────────────────────────────────────────

export default function Profile() {
  const { user } = useAuthStore()

  // profile data
  const [profile, setProfile]   = useState(null)
  const [bookings, setBookings] = useState([])
  const [reviews, setReviews]   = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [pageLoading, setPageLoading] = useState(true)

  // personal info form
  const [infoForm, setInfoForm] = useState({ name: '', phone: '', avatar: '' })
  const [infoLoading, setInfoLoading] = useState(false)
  const [infoFeedback, setInfoFeedback] = useState({ type: '', message: '' })

  // security form
  const [secForm, setSecForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [secLoading, setSecLoading] = useState(false)
  const [secFeedback, setSecFeedback] = useState({ type: '', message: '' })

  // ── fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [profRes, bookRes, revRes] = await Promise.allSettled([
          apiClient.get('/users/profile'),
          apiClient.get('/bookings'),
          apiClient.get('/reviews/user/me'),
        ])

        const prof = profRes.status === 'fulfilled' ? profRes.value.data : (user || {})
        setProfile(prof)
        setInfoForm({
          name:   prof.name   || '',
          phone:  prof.phone  || '',
          avatar: prof.avatar || '',
        })

        if (bookRes.status === 'fulfilled') setBookings(bookRes.value.data || [])
        if (revRes.status === 'fulfilled')  setReviews(revRes.value.data  || [])
      } catch {
        // fall back to store user
        const prof = user || {}
        setProfile(prof)
        setInfoForm({ name: prof.name || '', phone: prof.phone || '', avatar: prof.avatar || '' })
      } finally {
        setPageLoading(false)
      }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── derived stats ───────────────────────────────────────────────────────────
  const totalTrips = bookings.length
  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
  const reviewCount = reviews.length

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—'

  const initials = (profile?.name || user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  // ── avatar validity ─────────────────────────────────────────────────────────
  const [avatarValid, setAvatarValid] = useState(false)
  useEffect(() => {
    if (!infoForm.avatar) { setAvatarValid(false); return }
    const img = new Image()
    img.onload  = () => setAvatarValid(true)
    img.onerror = () => setAvatarValid(false)
    img.src = infoForm.avatar
  }, [infoForm.avatar])

  // ── save profile ────────────────────────────────────────────────────────────
  async function handleSaveInfo(e) {
    e.preventDefault()
    setInfoLoading(true)
    setInfoFeedback({ type: '', message: '' })
    try {
      const res = await apiClient.put('/users/profile', {
        name:   infoForm.name.trim(),
        phone:  infoForm.phone.trim(),
        avatar: infoForm.avatar.trim(),
      })
      const updatedUser = res.data
      useAuthStore.setState({ user: updatedUser })
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setProfile(updatedUser)
      setInfoFeedback({ type: 'success', message: 'Profile updated!' })
    } catch (err) {
      setInfoFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Could not save changes. Please try again.',
      })
    } finally {
      setInfoLoading(false)
    }
  }

  // ── update password ─────────────────────────────────────────────────────────
  async function handleUpdatePassword(e) {
    e.preventDefault()
    setSecFeedback({ type: '', message: '' })

    if (secForm.newPassword.length < 6) {
      setSecFeedback({ type: 'error', message: 'New password must be at least 6 characters.' })
      return
    }
    if (secForm.newPassword !== secForm.confirmPassword) {
      setSecFeedback({ type: 'error', message: 'Passwords don\'t match — please re-enter.' })
      return
    }

    setSecLoading(true)
    try {
      await apiClient.put('/users/profile', {
        oldPassword: secForm.oldPassword,
        newPassword: secForm.newPassword,
      })
      setSecForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      setSecFeedback({ type: 'success', message: 'Password updated successfully!' })
    } catch (err) {
      setSecFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Could not update password. Check your current password.',
      })
    } finally {
      setSecLoading(false)
    }
  }

  // ── loading state ───────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
        <p className="font-serif text-2xl text-espresso animate-pulse">Loading your profile…</p>
      </div>
    )
  }

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF9F7] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* ── PROFILE HEADER ─────────────────────────────────────────────────── */}
        <div className="bg-white border border-espresso/8 rounded-2xl overflow-hidden shadow-sm">
          {/* champagne accent strip — the "passport stamp" top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#E2C766] to-[#C9A535]" />

          <div className="px-8 py-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name || 'Profile photo'}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-[#C9A535]/30"
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex' }}
                />
              ) : null}
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white flex items-center justify-center font-serif text-2xl font-bold select-none"
                style={{ display: profile?.avatar ? 'none' : 'flex' }}
                aria-hidden="true"
              >
                {initials}
              </div>
            </div>

            {/* Identity block */}
            <div className="flex-1 min-w-0">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso leading-tight truncate">
                {profile?.name || user?.name || 'Traveller'}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-espresso/50 font-light mt-1">
                <FiMail size={13} />
                {profile?.email || user?.email || '—'}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-espresso/40 font-light mt-1">
                <FiCalendar size={11} />
                Member since {memberSince}
              </p>

              {/* Passport-stamp stat chips */}
              <div className="flex flex-wrap gap-3 mt-5">
                <div className="border border-espresso/10 rounded-lg px-4 py-2.5 text-center min-w-[72px]">
                  <p className="font-serif text-xl font-bold text-espresso leading-none">{totalTrips}</p>
                  <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-espresso/40 mt-1">Trips</p>
                </div>
                <div className="border border-espresso/10 rounded-lg px-4 py-2.5 text-center min-w-[72px]">
                  <p className="font-serif text-xl font-bold text-espresso leading-none">
                    ₹{totalSpent >= 100000
                      ? `${(totalSpent / 100000).toFixed(1)}L`
                      : totalSpent.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-espresso/40 mt-1">Total</p>
                </div>
                <div className="border border-espresso/10 rounded-lg px-4 py-2.5 text-center min-w-[72px]">
                  <p className="font-serif text-xl font-bold text-espresso leading-none">{reviewCount}</p>
                  <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-espresso/40 mt-1">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS ───────────────────────────────────────────────────────────── */}
        <div className="flex border-b border-espresso/10">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={[
                'px-5 py-3 text-xs font-bold tracking-[0.14em] uppercase transition-all relative',
                activeTab === i
                  ? 'text-espresso'
                  : 'text-espresso/40 hover:text-espresso/70',
              ].join(' ')}
            >
              {tab}
              {activeTab === i && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E2C766] to-[#C9A535] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* ══ TAB: PERSONAL INFO ════════════════════════════════════════════════ */}
        {activeTab === 0 && (
          <div className="bg-white border border-espresso/8 rounded-2xl p-8 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2 mb-7">
              <FiEdit2 size={14} className="text-[#C9A535]" />
              <h2 className="font-serif text-xl font-bold text-espresso">Personal Information</h2>
            </div>

            <Toast
              type={infoFeedback.type}
              message={infoFeedback.message}
              onClose={() => setInfoFeedback({ type: '', message: '' })}
            />

            <form onSubmit={handleSaveInfo} className="space-y-6" noValidate>
              <FieldRow icon={FiUser} label="Full Name">
                <input
                  type="text"
                  value={infoForm.name}
                  onChange={(e) => setInfoForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                  className={inputCls}
                  required
                />
              </FieldRow>

              <FieldRow icon={FiPhone} label="Phone Number">
                <input
                  type="tel"
                  value={infoForm.phone}
                  onChange={(e) => setInfoForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className={inputCls}
                />
              </FieldRow>

              <FieldRow icon={FiImage} label="Avatar URL">
                <div className="flex gap-3 items-start">
                  <input
                    type="url"
                    value={infoForm.avatar}
                    onChange={(e) => setInfoForm((f) => ({ ...f, avatar: e.target.value }))}
                    placeholder="https://example.com/photo.jpg"
                    className={`${inputCls} flex-1`}
                  />
                  {infoForm.avatar && avatarValid && (
                    <img
                      src={infoForm.avatar}
                      alt="Preview"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C9A535]/30 flex-shrink-0 mt-0.5"
                    />
                  )}
                  {infoForm.avatar && !avatarValid && (
                    <div className="w-10 h-10 rounded-full bg-espresso/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiImage size={14} className="text-espresso/30" />
                    </div>
                  )}
                </div>
              </FieldRow>

              <div className="flex items-center justify-between pt-2 border-t border-espresso/5">
                <p className="text-xs text-espresso/35 font-light">Changes apply across all your bookings.</p>
                <button
                  type="submit"
                  disabled={infoLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#E2C766] to-[#C9A535] text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:opacity-90 hover:shadow-md transition disabled:opacity-60 text-sm"
                >
                  {infoLoading ? <Spinner /> : <FiSave size={14} />}
                  {infoLoading ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ══ TAB: MY REVIEWS ══════════════════════════════════════════════════ */}
        {activeTab === 1 && (
          <div className="animate-fadeIn space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <FiStar size={14} className="text-[#C9A535]" />
              <h2 className="font-serif text-xl font-bold text-espresso">My Reviews</h2>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white border border-espresso/8 rounded-2xl p-14 text-center shadow-sm">
                <FiStar size={36} className="mx-auto text-[#C9A535]/40 mb-5" />
                <p className="font-serif text-xl font-bold text-espresso mb-2">No reviews yet</p>
                <p className="text-sm text-espresso/50 font-light max-w-sm mx-auto leading-relaxed">
                  You haven't written any reviews yet. Book a package to share your experience!
                </p>
              </div>
            ) : (
              reviews.map((review) => {
                const pkg = review.packageId
                const pkgTitle = pkg?.title || 'Unknown Package'
                const pkgDest  = pkg?.destination || ''
                const dateStr  = review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })
                  : '—'

                return (
                  <div
                    key={review._id}
                    className="bg-white border border-espresso/8 rounded-2xl p-6 shadow-sm hover:border-[#C9A535]/30 transition"
                  >
                    {/* header row */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <FiPackage size={12} className="text-[#C9A535] flex-shrink-0" />
                          <p className="font-serif text-base font-bold text-espresso truncate">{pkgTitle}</p>
                          {pkgDest && (
                            <span className="text-[10px] text-espresso/40 font-light">— {pkgDest}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <StarRating rating={review.rating} />
                          <span className="text-[10px] text-espresso/40 font-light">{dateStr}</span>
                        </div>
                      </div>
                      <StatusBadge status={review.status || 'pending'} />
                    </div>

                    {/* body */}
                    {review.title && (
                      <p className="text-sm font-semibold text-espresso mb-1.5">{review.title}</p>
                    )}
                    {review.body && (
                      <p className="text-sm text-espresso/60 font-light leading-relaxed">{review.body}</p>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ══ TAB: SECURITY ════════════════════════════════════════════════════ */}
        {activeTab === 2 && (
          <div className="bg-white border border-espresso/8 rounded-2xl p-8 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2 mb-7">
              <FiLock size={14} className="text-[#C9A535]" />
              <h2 className="font-serif text-xl font-bold text-espresso">Change Password</h2>
            </div>

            <Toast
              type={secFeedback.type}
              message={secFeedback.message}
              onClose={() => setSecFeedback({ type: '', message: '' })}
            />

            <form onSubmit={handleUpdatePassword} className="space-y-6" noValidate>
              <FieldRow icon={FiLock} label="Current Password">
                <input
                  type="password"
                  value={secForm.oldPassword}
                  onChange={(e) => setSecForm((f) => ({ ...f, oldPassword: e.target.value }))}
                  placeholder="Your current password"
                  className={inputCls}
                  required
                  autoComplete="current-password"
                />
              </FieldRow>

              <FieldRow icon={FiLock} label="New Password">
                <input
                  type="password"
                  value={secForm.newPassword}
                  onChange={(e) => setSecForm((f) => ({ ...f, newPassword: e.target.value }))}
                  placeholder="At least 6 characters"
                  className={inputCls}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                {secForm.newPassword.length > 0 && secForm.newPassword.length < 6 && (
                  <p className="text-[11px] text-red-500 font-medium mt-0.5">
                    Must be at least 6 characters
                  </p>
                )}
              </FieldRow>

              <FieldRow icon={FiLock} label="Confirm New Password">
                <input
                  type="password"
                  value={secForm.confirmPassword}
                  onChange={(e) => setSecForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Re-enter your new password"
                  className={inputCls}
                  required
                  autoComplete="new-password"
                />
                {secForm.confirmPassword.length > 0 && secForm.newPassword !== secForm.confirmPassword && (
                  <p className="text-[11px] text-red-500 font-medium mt-0.5">
                    Passwords don't match
                  </p>
                )}
              </FieldRow>

              <div className="flex items-center justify-between pt-2 border-t border-espresso/5">
                <p className="text-xs text-espresso/35 font-light">
                  You'll stay signed in after changing your password.
                </p>
                <button
                  type="submit"
                  disabled={secLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#E2C766] to-[#C9A535] text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:opacity-90 hover:shadow-md transition disabled:opacity-60 text-sm"
                >
                  {secLoading ? <Spinner /> : <FiLock size={14} />}
                  {secLoading ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
