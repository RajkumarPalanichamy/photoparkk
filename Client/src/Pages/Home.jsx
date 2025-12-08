import React from "react";
import LandingPage from "../Components/HomePageComponents/LandingPage";
import NewArrivals from "../Components/HomePageComponents/NewArrivals";
import Acrylicintro from "../Components/HomePageComponents/Acrylicintro";
import Canvasintro from "../Components/HomePageComponents/Canvasintro";
import Backlightintro from "../Components/HomePageComponents/Backlightintro";
import Offers from "../Components/HomePageComponents/Offers";
import Customize from "../Components/HomePageComponents/Customize";
import Faq from "../Components/HomePageComponents/Faq";
import ShippingDetails from "../Components/HomePageComponents/ShippingDetails";

const Home = () => {
  return (
    <div className="relative">
      <LandingPage />
      <NewArrivals />
      <Offers />
      <Customize />
      <Acrylicintro />
      <Canvasintro />
      <Backlightintro />
      <Faq />
      <ShippingDetails />

      {/* ✅ Floating Instagram Button - Responsive */}
      <a
        href="https://www.instagram.com/photoparkk_"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 group"
        title="Follow us on Instagram"
      >
        <div className="flex items-center sm:gap-3 bg-primary text-white px-4 py-3 rounded-full shadow-xl transition-transform duration-300 transform hover:scale-105 ring-2 ring-primary-light">
          {/* Instagram Icon */}
          <div className="bg-white text-primary rounded-full p-2 shadow-md group-hover:rotate-12 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="h-6 w-6"
              fill="currentColor"
            >
              <path d="M224,202.66A53.34,53.34,0,1,0,277.34,256,53.38,53.38,0,0,0,224,202.66Zm124.71-41a54,54,0,0,0-30.59-30.59C297.51,120,224,120,224,120s-73.51,0-94.12,10.12a54,54,0,0,0-30.59,30.59C89.17,183.27,89.17,256,89.17,256s0,72.73,10.12,94.12a54,54,0,0,0,30.59,30.59C150.49,390,224,390,224,390s73.51,0,94.12-10.12a54,54,0,0,0,30.59-30.59C358.83,328.73,358.83,256,358.83,256S358.83,183.27,348.71,161.68ZM224,338a82,82,0,1,1,82-82A82,82,0,0,1,224,338Zm85-148.62a19.14,19.14,0,1,1,19.14-19.14A19.14,19.14,0,0,1,309,189.38Z" />
            </svg>
          </div>

          {/* Text - visible on sm and up */}
          <span className="hidden sm:inline font-semibold text-sm tracking-wide">
            Follow us on Instagram
          </span>
        </div>
      </a>
    </div>
  );
};

export default Home;
