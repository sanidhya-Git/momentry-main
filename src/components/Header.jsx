"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useStore";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-espresso/5 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-[#E2C766] to-[#C9A535] rounded-xl flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-300">
              <FaMapMarkerAlt className="text-lg sm:text-xl" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl sm:text-2xl font-bold font-serif text-espresso tracking-wide">
                MOMENTRY
              </span>
              <span className="text-[10px] text-olive font-semibold tracking-widest uppercase">
                Travel Adventures
              </span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link
              href="/packages"
              className="text-espresso/80 hover:text-champagne transition font-medium border-b-2 border-transparent hover:border-champagne/40 pb-1"
            >
              Trips
            </Link>
            <Link
              href="/about"
              className="text-espresso/80 hover:text-champagne transition font-medium border-b-2 border-transparent hover:border-champagne/40 pb-1"
            >
              About Us
            </Link>
            <Link
              href="/testimonials"
              className="text-espresso/80 hover:text-champagne transition font-medium border-b-2 border-transparent hover:border-champagne/40 pb-1"
            >
              Testimonials
            </Link>
            {user && (
              <Link
                href="/bookings"
                className="text-espresso/80 hover:text-champagne transition font-medium border-b-2 border-transparent hover:border-champagne/40 pb-1"
              >
                My Journeys
              </Link>
            )}
            {user && (
              <Link
                href="/profile"
                className="text-espresso/80 hover:text-champagne transition font-medium border-b-2 border-transparent hover:border-champagne/40 pb-1"
              >
                Profile
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)}
                  className="w-10 h-10 rounded-full bg-[#1E323A] text-white flex items-center justify-center font-semibold text-sm hover:opacity-90 transition border border-white/10 shadow-sm"
                >
                  {user.name ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "U"}
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-espresso/10 rounded-md shadow-lg py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-espresso/5">
                      <p className="text-xs text-espresso/50 font-bold uppercase tracking-wider">Account</p>
                      <p className="text-sm font-semibold text-espresso truncate">{user.name}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-espresso hover:bg-cream transition"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/bookings"
                      className="block px-4 py-2 text-sm text-espresso hover:bg-cream transition"
                    >
                      My Journeys
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-espresso/80 hover:text-champagne transition font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white px-5 py-2.5 rounded-md hover:opacity-90 hover:shadow-md transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-2xl p-2 -mr-2 text-espresso touch-target"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <FiMenu />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-espresso/5">
            <Link
              href="/"
              className="block py-3 px-2 text-espresso/80 hover:text-champagne hover:bg-cream rounded font-medium"
            >
              Home
            </Link>
            <Link
              href="/packages"
              className="block py-3 px-2 text-espresso/80 hover:text-champagne hover:bg-cream rounded font-medium"
            >
              Packages
            </Link>
            {user && (
              <Link
                href="/bookings"
                className="block py-3 px-2 text-espresso/80 hover:text-champagne hover:bg-cream rounded font-medium"
              >
                My Bookings
              </Link>
            )}
            {user && (
              <Link
                href="/profile"
                className="block py-3 px-2 text-espresso/80 hover:text-champagne hover:bg-cream rounded font-medium"
              >
                Profile
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white px-4 py-3 rounded-md hover:opacity-90 transition font-semibold touch-target"
              >
                <FiLogOut /> Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-3 px-2 text-espresso/80 hover:text-champagne hover:bg-cream rounded font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="w-full mt-4 block text-center bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white px-4 py-3 rounded-md hover:opacity-90 transition font-semibold touch-target"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
