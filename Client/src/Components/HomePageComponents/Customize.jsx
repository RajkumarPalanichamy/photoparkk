import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import frameborder1 from "../../assets/frontend_assets/CustomizedFrameBorder/frameborder1.jpeg";
import frameborder2 from "../../assets/frontend_assets/CustomizedFrameBorder/frameborder2.jpeg";
import frameborder3 from "../../assets/frontend_assets/CustomizedFrameBorder/frameborder3.jpeg";
import frameborder4 from "../../assets/frontend_assets/CustomizedFrameBorder/frameborder4.jpeg";
import { Link } from "react-router-dom";

const frameImages = [frameborder1, frameborder2, frameborder3, frameborder4];

const photoQuotes = [
  "Every picture tells a story.",
  "Frame the moment, cherish forever.",
  "Memories that never fade.",
  "Your life. Your frame. Your style.",
];

function Customize() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalFrames = frameImages.length;
  const [isManual, setIsManual] = useState(false);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % totalFrames);
    setIsManual(true);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalFrames) % totalFrames);
    setIsManual(true);
  };

  useEffect(() => {
    if (isManual) {
      const resetTimer = setTimeout(() => setIsManual(false), 1000);
      return () => clearTimeout(resetTimer);
    }

    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [activeIndex, isManual]);

  return (
    <div className="mt-20 flex flex-col items-center justify-center p-4 mx-[4vw]">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-secondary text-center font-[poppins]">
        Customize Your Frame
      </h1>
      <p className="text-base sm:text-lg text-neutral-600 mb-12 text-center max-w-2xl font-[poppins]">
        Choose your favorite frame style and preview it in real-time. Make your
        memories stand out with a frame that fits your vibe!
      </p>

      <div className="relative w-full max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[480px] mx-auto">
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white shadow-lg hover:bg-neutral-50 z-20 transition-colors"
            aria-label="Previous frame"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-600 z-20" />
          </button>

          {/* Frames Container */}
          <div
            className="relative 
            h-[340px] w-[240px] 
            sm:h-[440px] sm:w-[320px] 
            md:h-[500px] md:w-[360px]"
          >
            {frameImages.map((frame, index) => {
              const position =
                (index - activeIndex + totalFrames) % totalFrames;

              let transform = "scale(0.8) translateX(-100%)";
              let zIndex = 0;
              let opacity = 0;

              if (position === 0) {
                transform = "scale(1) translateX(0)";
                zIndex = 3;
                opacity = 1;
              } else if (position === 1) {
                transform = "scale(0.85) translateX(45%)";
                zIndex = 2;
                opacity = 0.7;
              } else if (position === totalFrames - 1) {
                transform = "scale(0.85) translateX(-45%)";
                zIndex = 1;
                opacity = 0.7;
              }

              return (
                <div
                  key={index}
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${frame})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transform,
                    opacity,
                    zIndex,
                    transition: "all 0.5s ease-in-out",
                  }}
                >
                  <div className="relative z-10 bg-white/80 p-3 rounded-xl shadow-lg text-center max-w-[85%]">
                    <span className="text-sm sm:text-base font-semibold text-neutral-700 font-[poppins]">
                      {photoQuotes[index]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white shadow-lg z-20 hover:bg-neutral-50 transition-colors"
            aria-label="Next frame"
          >
            <ChevronRight className="w-6 h-6 text-neutral-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {frameImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setIsManual(true);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === index ? "bg-secondary w-4" : "bg-neutral-400"
              }`}
              aria-label={`Go to frame ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <Link to="/frames">
        <button className="bg-primary text-white px-6 py-3 mt-5 cursor-pointer text-xl rounded-2xl hover:bg-primary-hover hover:text-white transition duration-200">
          Customize
        </button>
      </Link>
    </div>
  );
}

export default Customize;
