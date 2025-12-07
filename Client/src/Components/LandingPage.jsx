import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

// Lazy load the video component
const VideoBackground = lazy(() => import("./VideoBackground"));

export default function LandingPage() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Lazy load video after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Offers Scrolling Banner */}
      <motion.div
        className="bg-secondary text-white py-3 overflow-hidden relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center">
          <motion.div
            className="text-lg font-bold whitespace-nowrap flex items-center gap-4"
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          >
            <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-bold">
              NEW
            </span>
            <span>
              Premium Photography Collections - Handcrafted Excellence
            </span>
            <span className="text-red-400">•</span>
            <span>Free shipping on orders above ₹999</span>
            <span className="text-red-400">•</span>
            <span>Transform your memories into timeless art</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Landing Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Loading Placeholder */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg font-medium">Loading...</p>
            </div>
          </div>
        )}

        {/* Video Background */}
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
          }
        >
          {isVideoLoaded && (
            <VideoBackground isPlaying={isVideoPlaying} isMuted={isMuted} />
          )}
        </Suspense>

        {/* Video Controls */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
          >
            {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        {/* Content Overlay - Darker for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
        {/* Additional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/50 z-10"></div>

        {/* Main Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              {/* Mobile Content */}
              <div className="block sm:hidden">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-black bg-opacity-80 backdrop-blur-sm border border-white/20 p-6 rounded-lg"
                >
                  <h1 className="text-3xl font-bold text-white mb-4">
                    Premium{" "}
                    <span className="bg-red-600 px-2 py-1 rounded text-2xl">
                      Collections
                    </span>
                  </h1>
                  <p className="text-neutral-300 mb-6 text-sm">
                    Discover our exclusive collection of handcrafted premium
                    frames
                  </p>
                  <Link to="/Offers">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
                    >
                      SHOP NOW
                    </motion.button>
                  </Link>
                </motion.div>
              </div>

              {/* Desktop Content */}
              <div className="hidden sm:block">
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="bg-black bg-opacity-75 backdrop-blur-sm border border-white/20 p-10 rounded-xl max-w-lg"
                >
                  <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                    Premium{" "}
                    <span className="bg-red-600 px-3 py-2 rounded text-4xl">
                      Collections
                    </span>
                  </h1>
                  <p className="text-neutral-300 mb-8 text-lg">
                    Discover our exclusive collection of handcrafted premium
                    frames and photography art
                  </p>
                  <div className="flex gap-4">
                    <Link to="/Offers">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-secondary px-8 py-4 rounded-lg font-semibold hover:bg-neutral-100 transition-colors text-lg"
                      >
                        SHOP NOW
                      </motion.button>
                    </Link>
                    <Link to="/shop/acrylic">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-secondary transition-colors text-lg"
                      >
                        VIEW ALL
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
