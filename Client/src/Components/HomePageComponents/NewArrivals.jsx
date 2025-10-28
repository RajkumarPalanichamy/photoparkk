import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axiosInstance.get("/newarrivals");
        console.log("NewArrivals API Response:", response.data);
        
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setItems(response.data);
        } else {
          console.error("API response is not an array:", response.data);
          setItems([]); // Set empty array as fallback
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
        setItems([]); // Set empty array on error
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Latest Arrivals</h1>
        <Link to="/shop/acrylic">
          <button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium">
            VIEW ALL
          </button>
        </Link>
      </div>

      {/* Swiper Container */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="py-4"
          >
            {Array.isArray(items) && items.map((item, index) => {
              const firstSize =
                item.sizes && item.sizes.length > 0 ? item.sizes[0] : null;
              const isNew = index < 2; // First 2 items are "NEW"
              const isSoldOut = index === 2; // Third item is "SOLD OUT"

              return (
                <SwiperSlide key={index}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* Product Image Container */}
                    <div className="relative bg-gray-100 aspect-square">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Status Badge */}
                      {isNew && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded">
                            NEW
                          </span>
                        </div>
                      )}
                      
                      {isSoldOut && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-gray-600 text-white text-xs font-medium px-2 py-1 rounded">
                            SOLD OUT
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between mb-3">
                        {firstSize ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">
                              ₹{firstSize.price}
                            </span>
                            {firstSize.original && firstSize.original > firstSize.price && (
                              <span className="text-gray-500 line-through text-sm">
                                ₹{firstSize.original}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-red-500 text-sm font-medium">
                            Price not available
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-sm">
                              {i < Math.round(item.rating || 4) ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm ml-2">
                          ({item.rating || 4})
                        </span>
                      </div>

                      {/* Buy Button */}
                      <Link to={`/newarrivalorderpage/${item._id}`}>
                        <button 
                          disabled={isSoldOut}
                          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                            isSoldOut
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-black text-white hover:bg-gray-800"
                          }`}
                        >
                          {isSoldOut ? "SOLD OUT" : "Buy Now"}
                        </button>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* View All Link for Mobile */}
      <div className="mt-8 text-center lg:hidden">
        <Link to="/shopacrylic">
          <button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium">
            VIEW ALL PRODUCTS
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NewArrivals;
