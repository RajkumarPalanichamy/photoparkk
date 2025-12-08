import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import BacklightBanner from "../../assets/frontend_assets/BacklightPhotoFrames/BacklightBanner.jpeg";
import BacklightPortrait from "../../assets/frontend_assets/BacklightPhotoFrames/BacklightPortrait.jpeg";
import BacklightLandscape from "../../assets/frontend_assets/BacklightPhotoFrames/LandScape.jpeg";
import BacklightSquare from "../../assets/frontend_assets/BacklightPhotoFrames/Square.jpeg";

const steps = ["Select Shape", "Upload Image", "Place Order"];

const frameData = [
  {
    title: "Portrait Frame",
    image: BacklightPortrait,
    route: "/BacklightPortrait",
  },
  {
    title: "Landscape Frame",
    image: BacklightLandscape,
    route: "/BacklightLanScape",
  },
  {
    title: "Square Frame",
    image: BacklightSquare,
    route: "/BacklightSquare",
  },
];

const BacklightIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full font-[Poppins] px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 pt-[80px] mt-10 mb-20">
      {/* Header Section */}
      <div className="text-center font-extrabold text-2xl sm:text-3xl xl:text-4xl">
        <h1>Backlight Photo Frame</h1>
        <p className="text-lg sm:text-xl text-neutral-600 mt-3 sm:mt-5">
          Customize Your Backlight Photo Frame
        </p>

        {/* Banner Image */}
        <div className="w-full mt-6 rounded-xl overflow-hidden shadow-xl">
          <img
            src={BacklightBanner}
            alt="Backlight Frame Banner"
            className="w-full lg-h-130 object-cover"
          />
        </div>

        <p className="font-bold text-xl sm:text-2xl mt-12 sm:mt-16">
          Pick the Backlight Frame For You!
        </p>
      </div>

      {/* Step Flow */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-10 mt-10 mb-12 text-sm sm:text-base xl:text-lg font-semibold text-secondary">
        {steps.map((label, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm sm:text-base">
              {index + 1}
            </div>
            <p className="text-center">{label}</p>
          </div>
        ))}
      </div>

      {/* Frame Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {frameData.map((frame, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden flex flex-col"
          >
            <img
              src={frame.image}
              alt={frame.title}
              className="w-full h-[340px] object-cover"
            />
            <div className="p-4">
              <div className="text-xl font-semibold text-center">
                {frame.title}
              </div>
              <div className="mt-2 flex justify-center">
                <button
                  onClick={() => navigate(frame.route)}
                  className="flex items-center gap-1 text-primary font-medium text-sm sm:text-base hover:underline"
                >
                  Customize Now <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BacklightIntro;
