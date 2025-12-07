import React from "react";
import { useNavigate } from "react-router-dom";
import {
  UserSquare,
  Image as ImageIcon,
  Square,
  ChevronRight,
} from "lucide-react";
import CanvasBanner from "../../assets/frontend_assets/CanvasCustomized/CanvasBanner.jpeg";

const shapeData = [
  {
    name: "Portrait",
    icon: <UserSquare className="w-12 h-12 text-primary" />,
    route: "/CanvasPortrait",
  },
  {
    name: "Landscape",
    icon: <ImageIcon className="w-12 h-12 text-success" />,
    route: "/CanvasLandscape",
  },
  {
    name: "Square",
    icon: <Square className="w-12 h-12 text-primary" />,
    route: "/CanvasSquare",
  },
];

const steps = ["Select Shape", "Upload Image", "Place Order"];

function CanvasIntro() {
  const navigate = useNavigate();

  return (
    <div className="w-full font-[Poppins] px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 pt-[80px] mt-10">
      {/* Header */}
      <div className="text-center font-extrabold text-2xl sm:text-3xl xl:text-4xl">
        <h1>Canvas Frame</h1>
        <p className="text-lg sm:text-xl text-neutral-600 mt-3 sm:mt-5">
          Customize Your Canvas Photo Frame
        </p>

        {/* Banner */}
        <div className="w-full mt-6 rounded-xl overflow-hidden shadow-xl">
          <img
            src={CanvasBanner}
            alt="Canvas Frame Banner"
            className="w-full h-auto object-cover"
          />
        </div>

        <p className="font-bold text-xl sm:text-2xl mt-12 sm:mt-16">
          Pick the Canvas Frame Shape For You!
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

      {/* Shape Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {shapeData.map((shape, index) => (
          <div
            key={index}
            onClick={() => navigate(shape.route)}
            className="cursor-pointer h-60 w-full bg-white rounded-2xl flex flex-col items-center justify-center px-6 py-8 transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-offset-2 hover:ring-primary"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.2) 0px 1px 3px, rgba(0, 0, 0, 0.1) 0px 5px 15px",
            }}
          >
            <div className="text-5xl mb-4">{shape.icon}</div>
            <p className="text-lg font-semibold text-secondary mb-2">
              {shape.name}
            </p>
            <button className="flex items-center justify-center gap-2 text-primary font-medium text-sm sm:text-base">
              <span>Customize Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CanvasIntro;
