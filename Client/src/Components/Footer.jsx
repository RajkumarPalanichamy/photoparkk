import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-6 mt-15">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold mb-1">PhotoParkk</h2>
          <p className="text-xs text-gray-400 mb-3">Since 1996</p>
          <p className="text-sm">
            Frame your memories with style. High-quality custom photo frames
            delivered to your door.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/frames" className="hover:text-white">
                Customize Frames
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/shipping-policy" className="hover:text-white">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-white">
                Refund & Cancellation Policy
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="hover:text-white">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Get in Touch</h3>
          <p className="text-sm">Email: photoparkk.prints@gmail.com</p>
          <p className="text-sm">Phone: +91 96296 74444</p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.instagram.com/photoparkk_?igsh=MWI3aGNmZDZ6NnFrOQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://wa.me/919629674444"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={20} />
            </a>
            <a
              href="https://twitter.com/photoparkk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="text-center text-sm mt-10 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} PhotoPark. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
