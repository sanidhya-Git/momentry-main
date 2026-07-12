import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-espresso text-white mt-12 border-t border-espresso/20">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-champagne font-serif tracking-wide">
              MOMENTRY
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4 font-light">
              Budget travel adventures across India for backpackers and
              explorers.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="text-champagne hover:text-white transition text-lg p-2 touch-target"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-olive hover:text-white transition text-lg p-2 touch-target"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-champagne hover:text-white transition text-lg p-2 touch-target"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 font-serif text-gray-100">Quick Links</h4>
            <ul className="space-y-2 text-sm sm:text-base text-gray-300 font-light">
              <li>
                <a
                  href="/"
                  className="hover:text-champagne transition block py-2 px-2 -mx-2"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/packages"
                  className="hover:text-champagne transition block py-2 px-2 -mx-2"
                >
                  Packages
                </a>
              </li>
              <li>
                <a
                  href="/signup"
                  className="hover:text-champagne transition block py-2 px-2 -mx-2"
                >
                  Sign Up
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="hover:text-champagne transition block py-2 px-2 -mx-2"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 font-serif text-gray-100">Contact Us</h4>
            <div className="space-y-3 text-sm sm:text-base text-gray-300 font-light">
              <div className="flex items-center gap-3">
                <FaPhone className="text-champagne flex-shrink-0" />
                <a
                  href="tel:+91-7878103486"
                  className="hover:text-champagne transition break-all"
                >
                  +91-7878103486
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-olive flex-shrink-0" />
                <a
                  href="mailto:contact@momentry.in"
                  className="hover:text-olive transition break-all"
                >
                  contact@momentry.in
                </a>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-champagne mt-1 flex-shrink-0" />
                <span>India</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-base sm:text-lg font-bold mb-4 font-serif text-gray-100">Newsletter</h4>
            <p className="text-gray-300 mb-3 text-sm font-light">
              Get latest travel deals
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2.5 rounded-sm text-espresso text-sm focus:outline-none focus:ring-1 focus:ring-champagne bg-white"
              />
              <button className="w-full bg-gradient-to-br from-[#E2C766] to-[#C9A535] text-white py-2.5 rounded-sm hover:opacity-90 transition font-bold text-xs tracking-widest uppercase font-sans">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row gap-4 text-center sm:text-left text-gray-400 text-xs sm:text-sm">
            <p>&copy; 2026 MOMENTRY Travel. All rights reserved.</p>
            <div className="flex justify-center sm:justify-end gap-4 flex-wrap">
              <a href="#" className="hover:text-champagne transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-champagne transition">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-champagne transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
