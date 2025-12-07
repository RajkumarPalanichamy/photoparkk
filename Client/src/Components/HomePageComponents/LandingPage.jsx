import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import parkvideo from "../../assets/frontend_assets/HomeSlides/photoparkk Video.mp4";

export default function LandingPage() {
  const [currentOffer, setCurrentOffer] = useState(0);

  const offers = [
    "Premium Photography Collections - Handcrafted Excellence",
    "Transform Your Memories into Timeless Art",
    "Curated Premium Frames for Lasting Moments",
    "Free Shipping on Orders Over ₹999",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden pt-[80px]">
      {/* Enhanced Offers Bar */}
      <div className="relative bg-primary py-2 sm:py-3 overflow-hidden border-b border-primary/30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        <div className="relative flex flex-col sm:flex-row items-center justify-center px-4 sm:px-0 gap-2 sm:gap-0">
          <div className="flex items-center">
            <Sparkles
              size={14}
              className="text-warning mr-2 sm:mr-3 animate-spin"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentOffer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-white font-semibold text-xs sm:text-sm md:text-base tracking-wide text-center"
              >
                {offers[currentOffer]}
              </motion.div>
            </AnimatePresence>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="sm:ml-4"
          >
            <Link
              to="/offers"
              className="bg-white text-primary px-3 sm:px-4 py-1 rounded-full text-xs font-bold hover:shadow-lg transition-all duration-300 whitespace-nowrap"
            >
              SHOP NOW
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Landing Section */}
      <div className="relative w-full h-screen">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={parkvideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Enhanced Overlay - Darker for better text visibility */}
          <div className="absolute inset-0 bg-secondary/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black/75" />
          {/* Additional dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          {/* Mobile Content */}
          <div className="block sm:hidden w-full px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-secondary/80 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
                className="inline-flex items-center gap-2 bg-primary px-4 py-2 rounded-full mb-6"
              >
                <Sparkles size={16} />
                <span className="text-white font-bold text-sm uppercase tracking-wide">
                  Premium Collection
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl font-bold text-white mb-4 leading-tight"
              >
                Exclusive <span className="text-primary">Savings</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-neutral-200 text-lg mb-8 leading-relaxed"
              >
                Premium Photography Collections
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link to="/offers">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px -10px rgba(255, 255, 255, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-white text-secondary px-8 py-4 rounded-2xl font-bold text-lg w-full flex items-center justify-center gap-3 hover:shadow-2xl transition-all duration-300"
                  >
                    EXPLORE COLLECTION
                    <ArrowRight
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      size={20}
                    />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Desktop Content */}
          <div className="hidden sm:block w-full max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
                className="inline-flex items-center gap-3 bg-primary px-6 py-3 rounded-full mb-8 shadow-2xl"
              >
                <Sparkles size={20} className="text-white" />
                <span className="text-white font-bold text-lg uppercase tracking-wider">
                  Premium Collection
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-7xl font-bold text-white mb-6 leading-tight"
              >
                Exclusive{" "}
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.8 }}
                  className="text-primary inline-block"
                >
                  Savings
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="text-2xl text-neutral-200 mb-12 leading-relaxed max-w-2xl"
              >
                Discover our premium photography collections with exclusive
                discounts. Transform your memories into timeless art.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="flex gap-6"
              >
                <Link to="/offers">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 40px -10px rgba(255, 255, 255, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-white text-secondary px-12 py-6 rounded-2xl font-bold text-xl flex items-center gap-4 hover:shadow-2xl transition-all duration-300"
                  >
                    SHOP COLLECTION
                    <ArrowRight
                      className="group-hover:translate-x-2 transition-transform duration-300"
                      size={24}
                    />
                  </motion.button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                className="flex gap-8 mt-16"
              >
                {[
                  { number: "25K+", label: "Happy Customers" },
                  { number: "1996", label: "Since Year" },
                  { number: "4.9★", label: "Rating" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + index * 0.2 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-white">
                      {stat.number}
                    </div>
                    <div className="text-neutral-300 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
