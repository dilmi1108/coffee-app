import React from 'react';
import { Link } from 'react-router-dom';
import { FaCoffee, FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-coffee-950 text-coffee-100 border-t-4 border-coffee-600">
      {/* Top Footer */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Info Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold font-display text-white">
            <FaCoffee className="text-coffee-400" />
            <span className="font-sinhala text-2xl">කෝපි කඩේ</span>
          </Link>
          <p className="text-xs text-coffee-300 leading-relaxed">
            Sri Lanka's premium coffee shop experience. Brewing high-quality single-origin Ceylon coffee infused with warm local hospitality and spices.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="rounded-full bg-coffee-900 p-2.5 hover:bg-coffee-700 transition text-white">
              <FaFacebookF className="text-sm" />
            </a>
            <a href="#" className="rounded-full bg-coffee-900 p-2.5 hover:bg-coffee-700 transition text-white">
              <FaInstagram className="text-sm" />
            </a>
            <a href="#" className="rounded-full bg-coffee-900 p-2.5 hover:bg-coffee-700 transition text-white">
              <FaTwitter className="text-sm" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="text-base font-bold text-white mb-4 border-b border-coffee-800 pb-2">Quick Links</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-coffee-300">
            <li><Link to="/menu" className="hover:text-white transition">Explore Menu</Link></li>
            <li><Link to="/blog" className="hover:text-white transition">Brewing Tips & Blog</Link></li>
            <li><Link to="/about" className="hover:text-white transition">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Find Our Cafe</Link></li>
            <li><Link to="/profile" className="hover:text-white transition">Order History</Link></li>
          </ul>
        </div>

        {/* Hours Column */}
        <div>
          <h4 className="text-base font-bold text-white mb-4 border-b border-coffee-800 pb-2">Opening Hours</h4>
          <ul className="flex flex-col gap-3 text-xs text-coffee-300">
            <li className="flex items-center gap-2">
              <FaClock className="text-coffee-400 text-sm" />
              <div>
                <p className="font-medium text-white">Weekdays (Mon - Fri)</p>
                <p className="text-[11px] text-coffee-400">6:30 AM - 9:00 PM</p>
              </div>
            </li>
            <li className="flex items-center gap-2">
              <FaClock className="text-coffee-400 text-sm" />
              <div>
                <p className="font-medium text-white">Weekends (Sat - Sun)</p>
                <p className="text-[11px] text-coffee-400">8:00 AM - 10:00 PM</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4 className="text-base font-bold text-white mb-4 border-b border-coffee-800 pb-2">Get in Touch</h4>
          <ul className="flex flex-col gap-3 text-xs text-coffee-300">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-coffee-400 text-sm mt-0.5" />
              <span>No. 45, Kandy Road, Colombo 07, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-coffee-400 text-sm" />
              <span>+94 11 234 5678</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-coffee-400 text-sm" />
              <span>hello@kopikade.lk</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="bg-coffee-950/80 py-4 text-center text-xs text-coffee-400 border-t border-coffee-900">
        <p>&copy; {new Date().getFullYear()} කෝපි කඩේ. All rights reserved. Made with ❤️ in Sri Lanka.</p>
      </div>
    </footer>
  );
};
