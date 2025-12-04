import React from "react";
import BacklightBanner from "../../assets/frontend_assets/BacklightPhotoFrames/BacklightBanner.jpeg";
import BacklightPortrait from "../../assets/frontend_assets/BacklightPhotoFrames/BacklightPortrait.jpeg";
import BacklighLandscape from "../../assets/frontend_assets/BacklightPhotoFrames/LandScape.jpeg";
import Backlighsquare from "../../assets/frontend_assets/BacklightPhotoFrames/Square.jpeg";
import { Link } from "react-router-dom";
const steps = ["Select Shape", "Upload Image", "Place Order"];

const Backlightintro = () => {
  return (
    <div className="my-20 font-[poppins] w-full px-17">
      <div className="container mx-auto px-4 text-center">
        {/* Title */}
        <h1 className="text-4xl font-bold">Backlight Photo Frame</h1>
        <p className="text-lg text-gray-600 mt-5">
          Customize Your Backlight Photo Frame
        </p>

        {/* Canvas Section with Layered Text + Border Highlight */}
        <div className="relative mb-16 mt-10 px-4 sm:px-6 lg:px-8">
          {/* Canvas Image */}
          <img
            src={BacklightBanner}
            alt="Canvas Frame"
            className="w-full h-130 rounded-xl border-8 border-gray-200 object-cover shadow-[0_10px_30px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.5)]"
          />
        </div>

        {/* Canvas Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center uppercase text-gray-800 mb-12 tracking-wider">
          Select Backlight Frame
        </h1>

        {/* Steps Section */}
        <div className="flex flex-col mt-12 sm:flex-row justify-center items-center gap-6 md:gap-8 xl:gap-16 2xl:gap-20 mb-12 text-sm sm:text-base xl:text-xl 2xl:text-2xl font-semibold text-gray-800">
          {steps.map((label, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-orange-400 text-white flex items-center justify-center">
                {index + 1}
              </div>
              <p className="text-center">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Portrait Frame */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition flex flex-col h-full">
            <img
              src={BacklightPortrait}
              alt="Portrait Frame"
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold  mb-1">PORTRAIT FRAME</h2>
            <p className="text-gray-600 text-sm mb-4">
              Precisely carved in portrait orientation, suits best for selfie
              photos
            </p>
            <div className="mt-auto flex justify-center">
              <Link
                to="/BacklightPortrait"
                className="text-orange-400 font-semibold flex items-center cursor-pointer hover:underline"
              >
                View Designs <span className="ml-2">&#8594;</span>
              </Link>
            </div>
          </div>

          {/* Landscape Frame */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition flex flex-col h-full">
            <img
              src={BacklighLandscape}
              alt="Landscape Frame"
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold  mb-1">LANDSCAPE FRAME</h2>
            <p className="text-gray-600 text-sm mb-4">
              Precisely carved in landscape orientation, suits best for family
              photos
            </p>
            <div className="mt-auto flex  justify-center">
              <Link
                to="/BacklightLanScape"
                className="text-orange-400 font-semibold flex items-center cursor-pointer hover:underline"
              >
                View Designs <span className="ml-2">&#8594;</span>
              </Link>
            </div>
          </div>

          {/* Square Frame */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition flex flex-col h-full">
            <img
              src={Backlighsquare}
              alt="Square Frame"
              className="w-full h-60 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold  mb-1">SQUARE FRAME</h2>
            <p className="text-gray-600 text-sm mb-4">
              Precisely carved in square shape, suits best for selfies or family
              photos
            </p>
            <div className="mt-auto flex justify-center">
              <Link
                to="/BacklightSquare"
                className="text-orange-400 font-semibold flex items-center cursor-pointer hover:underline"
              >
                View Designs <span className="ml-2">&#8594;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backlightintro;
