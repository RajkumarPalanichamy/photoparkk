import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserSquare,
  Image as ImageIcon,
  Square,
  Heart,
  Hexagon,
  Circle,
  ChevronRight,
} from "lucide-react";
import AcrylicBanner from "../../assets/frontend_assets/CanvasCustomized/AcrylicBanner.jpg";

const shapeData = [
  {
    name: "Portrait",
    icon: <UserSquare className="w-12 h-12 text-primary" />,
    route: "/AcrylicPortrait",
  },
  {
    name: "Landscape",
    icon: <ImageIcon className="w-12 h-12 text-success" />,
    route: "/AcrylicLandscape",
  },
  {
    name: "Square",
    icon: <Square className="w-12 h-12 text-primary" />,
    route: "/AcrylicSquare",
  },
  {
    name: "Love",
    icon: <Heart className="w-12 h-12 text-primary" />,
    route: "/AcrylicLove",
  },
  {
    name: "Hexagon",
    icon: <Hexagon className="w-12 h-12 text-warning" />,
    route: "/AcrylicHexagon",
  },
  {
    name: "Round",
    icon: <Circle className="w-12 h-12 text-error" />,
    route: "/AcrylicRound",
  },
];

const steps = ["Select Shape", "Upload Image", "Place Order"];

function CustomizeSteps() {
  const navigate = useNavigate();

  return (
    <div className="w-full font-[Poppins] px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 pt-[80px] mt-10">
      {/* Header */}
      <div className="text-center font-extrabold text-2xl sm:text-3xl xl:text-4xl">
        <h1>Acrylic Frame</h1>
        <p className="text-lg sm:text-xl text-neutral-600 mt-3 sm:mt-5">
          Customize Your Acrylic Photo Frame
        </p>

        {/* Banner */}
        <div className="w-full mt-6 rounded-xl overflow-hidden shadow-xl">
          <img
            src={AcrylicBanner}
            alt="Acrylic Frame Banner"
            className="w-full h-auto object-cover"
          />
        </div>

        <p className="font-bold text-xl sm:text-2xl mt-12 sm:mt-16">
          Pick the Acrylic Frame Shape For You!
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-10 mt-10 mb-10 text-sm sm:text-base xl:text-lg font-semibold text-secondary">
        {steps.map((label, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm sm:text-base">
              {index + 1}
            </div>
            <p className="text-center">{label}</p>
          </div>
        ))}
      </div>

      {/* Frame Shapes Grid */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6 md:gap-8 text-center">
        {shapeData.map((shape, index) => (
          <div
            key={index}
            onClick={() => navigate(shape.route)}
            className="cursor-pointer h-56 sm:h-60 w-full bg-white rounded-2xl flex flex-col items-center justify-center px-4 py-6 transition-transform duration-300 hover:scale-105"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.3) 0px 1px 2px, rgba(0, 0, 0, 0.2) 0px 4px 8px",
            }}
          >
            <div className="text-5xl mb-3">{shape.icon}</div>
            <button className="flex items-center justify-center gap-2 text-secondary font-medium text-sm sm:text-base">
              <p>{shape.name}</p>
              <ChevronRight className="w-4 h-4 text-primary" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomizeSteps;
