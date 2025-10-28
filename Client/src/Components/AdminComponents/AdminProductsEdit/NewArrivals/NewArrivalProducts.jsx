import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const NewArrivalProducts = () => {
  const navigate = useNavigate();
  const [newArrivalItems, setNewArrivalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({}); // Tracks selected size per product

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          "https://api.photoparkk.com/api/newarrivals"
        );
        console.log("Admin NewArrivals API Response:", response.data);
        
        if (Array.isArray(response.data)) {
          setNewArrivalItems(response.data);
        } else {
          console.error("API response is not an array:", response.data);
          setNewArrivalItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
        setNewArrivalItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.photoparkk.com/api/newarrivals/${id}`);
      setNewArrivalItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleSizeClick = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  if (loading) {
    return <div className="text-center py-10 text-xl">Loading...</div>;
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-center underline">
        Home Page Products Below Here
      </h2>

      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold underline text-center sm:text-left">
            New Arrivals
          </h2>
          <Link to="/newarrivaladdform">
            <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
              Add New Product
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(newArrivalItems) && newArrivalItems.map((item) => {
            const selectedSize = selectedSizes[item._id] || item.sizes?.[0];
            return (
              <div
                key={item._id}
                className="border rounded-lg shadow-sm p-4 flex flex-col bg-white hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-40 w-full object-cover rounded-md mb-4"
                />

                <h1 className="text-3xl font-semibold mb-1">{item.title}</h1>
                <p className="text-gray-600 mb-2 text-xl">{item.content}</p>

                {/* Dynamic Price Based on Selected Size */}
                <div className="mb-2 text-xl">
                  <p className="text-green-600 font-bold">
                    ₹{selectedSize?.price}
                  </p>
                  <p className="text-red-500 line-through">
                    ₹{selectedSize?.original}
                  </p>
                </div>

                {/* Ratings */}
                <div className="flex items-center text-yellow-500 text-lg mb-2">
                  {"★".repeat(Math.round(item.rating || 4))}
                  <span className="ml-2 text-sm text-gray-500">
                    {item.rating || 4} / 5
                  </span>
                </div>

                <p className="text-xl text-gray-700 mb-2">
                  Thickness: <strong>{item.thickness}</strong>
                </p>

                {/* Selectable Sizes */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.sizes?.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSizeClick(item._id, size)}
                      className={`text-sm px-3 py-1 border rounded transition 
                        ${
                          selectedSize?.label === size.label
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:border-black"
                        }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>

                {/* Stock */}
                <div>
                  <p className="text-lg my-1">
                    Stock: <span className="text-green-700">{item.stock}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/newarrivalupdateform/${item._id}`}
                    className="w-full"
                  >
                    <button className="bg-yellow-500 w-full text-white py-2 rounded hover:bg-yellow-600 transition">
                      Update
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewArrivalProducts;
