import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";

const SpecialOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const response = await axiosInstance.get("/specialoffers");
        setOffers(response.data);
      } catch (error) {
        console.error("Error fetching special offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialOffers();
  }, []);

  return (
    <div className="mt-10 px-4 text-center font-[poppins]">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
        Special Offers 50%
      </h1>
      <p className="text-sm sm:text-base text-neutral-600 mb-10 max-w-2xl mx-auto">
        Our most loved products, chosen by thousands of satisfied customers.
      </p>

      {loading ? (
        <p className="text-center text-neutral-500">Loading offers...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {offers.map((item, index) => {
            const firstSize = item.sizes?.[0];
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4 flex flex-col items-center text-center"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-xl mb-4"
                />
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-neutral-600 text-sm mb-2">{item.content}</p>

                <div className="flex justify-center items-center text-base">
                  <span className="text-warning">
                    {"★".repeat(Math.round(item.rating || 4))}
                  </span>
                  <span className="text-neutral-500 ml-2">
                    {item.rating || 4} stars
                  </span>
                </div>

                <div className="mt-2">
                  {firstSize ? (
                    <>
                      <span className="text-xl text-warning font-bold">
                        ₹{firstSize.price}
                      </span>
                      <span className="text-neutral-500 ml-2 line-through">
                        ₹{firstSize.original}
                      </span>
                    </>
                  ) : (
                    <span className="text-red-500 text-sm">
                      No sizes available
                    </span>
                  )}
                </div>

                <Link
                  to={`/specialoffersorderpage/${item._id}`}
                  className="w-full"
                >
                  <button className="mt-4 bg-primary text-white w-full py-2 rounded-lg hover:bg-primary-hover transition">
                    Buy Now
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SpecialOffers;
