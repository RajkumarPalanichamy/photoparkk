import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ChevronRight, ChevronLeft } from "lucide-react";
import machine1 from "../assets/frontend_assets/About/machine1.jpg";
import machine2 from "../assets/frontend_assets/About/machine2.jpg";
import machine3 from "../assets/frontend_assets/About/machine3.jpg";
import machine4 from "../assets/frontend_assets/About/machine4.jpg";
import machine5 from "../assets/frontend_assets/About/machine5.jpg";

// Lazy load video component
const VideoSection = lazy(() => import("./VideoSection"));

const About = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: machine2,
      title: "Precision Engineering",
      description: "We use cutting-edge technology to ensure accuracy and quality in every frame. From concept to creation, our machines handle it all with unmatched precision.",
      imageAlt: "Precision Engineering Machine"
    },
    {
      image: machine4,
      title: "Seamless Fabrication",
      description: "Our automated systems ensure every frame is fabricated with consistent strength and style. The process is fast, reliable, and fully scalable.",
      imageAlt: "Seamless Fabrication Process"
    },
    {
      image: machine3,
      title: "Quality Assurance",
      description: "Each product undergoes rigorous testing to meet our high-quality standards before reaching you. Our commitment is to excellence in every frame.",
      imageAlt: "Quality Assurance Process"
    },
    {
      image: machine1,
      title: "Advanced Automation",
      description: "State-of-the-art automation ensures consistent quality and rapid production. Our systems work seamlessly to deliver perfect results every time.",
      imageAlt: "Advanced Automation System"
    },
    {
      image: machine5,
      title: "Final Inspection",
      description: "Every frame passes through our comprehensive final inspection process, ensuring that only the highest quality products reach our customers.",
      imageAlt: "Final Inspection Process"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Hero Video Section */}
      <div className="relative w-full h-[70vh] overflow-hidden">
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
        <Suspense fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        }>
          {isVideoLoaded && <VideoSection />}
        </Suspense>

        {/* Content Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center text-white px-6 max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Advanced Machinery
              <span className="block text-primary">In Action</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
              Witness our state-of-the-art production process delivering precision-crafted frames with unmatched quality and innovation.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </div>

      {/* Process Slides */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
              Our Manufacturing Process
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Discover how our advanced technology and skilled craftsmanship come together to create exceptional frames.
            </p>
          </motion.div>

          {/* Slides Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-90 p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
            >
              <ChevronLeft size={24} className="text-neutral-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-90 p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
            >
              <ChevronRight size={24} className="text-neutral-700" />
            </button>

            {/* Current Slide */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl bg-white"
            >
              {/* Image Section */}
              <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].imageAlt}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Content Section */}
              <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-3xl lg:text-4xl font-bold text-secondary mb-6 leading-tight">
                    {slides[currentSlide].title}
                  </h3>
                  <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                    {slides[currentSlide].description}
                  </p>
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center gap-2 mb-6">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentSlide 
                            ? 'bg-primary w-8' 
                            : 'bg-neutral-300 hover:bg-neutral-400'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Slide Counter */}
                  <p className="text-sm text-neutral-500">
                    {currentSlide + 1} of {slides.length}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">24/7</span>
              </div>
              <h4 className="text-xl font-semibold text-secondary mb-2">Continuous Operation</h4>
              <p className="text-neutral-600">Our facilities operate around the clock to meet your demands.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-success">99.9%</span>
              </div>
              <h4 className="text-xl font-semibold text-secondary mb-2">Quality Rate</h4>
              <p className="text-neutral-600">Exceptional quality standards maintained across all production.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">10K+</span>
              </div>
              <h4 className="text-xl font-semibold text-secondary mb-2">Frames Produced</h4>
              <p className="text-neutral-600">Successfully delivered thousands of high-quality frames.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About; 